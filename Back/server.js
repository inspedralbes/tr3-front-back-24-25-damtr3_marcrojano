import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { spawn } from 'child_process';
import jwt from 'jsonwebtoken'; // Añadir esta importación
import enemigoRoutes from './routes/enemigos.js';
import characterRoutes from './routes/CharacterRoutes.js';
import loginRoutes from './routes/LoginRoutes.js';
import maintenanceRoutes from './routes/maintenanceRoutes.js';
import sequelize from './config/database.js';
import dificultadRoutes from'./routes/DificultadRoutes.js';
import dotenv from 'dotenv'

dotenv.config();

const PORT_MAIN_SERVER = process.env.PORT_MAIN_SERVER
const PORT_CONTROL_SERVER = process.env.PORT_CONTROL_SERVER
const CORS_ORIGIN = process.env.CORS_ORIGIN

// Configuración principal
const mainApp = express();
let mainServer = null;

// Configuración del servidor de control
const controlApp = express();
let isMainServerRunning = false;

// Middleware común para ambos servidores
const commonMiddleware = (app) => {
  app.use(bodyParser.json());
  app.use(cors({
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
};

// Servidor principal (3001)
const setupMainServer = () => {
  commonMiddleware(mainApp);

  mainApp.use('/api', enemigoRoutes);
  mainApp.use('/api', characterRoutes);
  mainApp.use('/api', dificultadRoutes);
  mainApp.use('/api/auth', loginRoutes);
  mainApp.use('/api/maintenance', maintenanceRoutes);

  mainApp.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
  });

  return mainApp.listen(PORT_MAIN_SERVER, () => {
    console.log(`🚀 Servidor principal activo en http://localhost:${PORT_MAIN_SERVER}`);
    isMainServerRunning = true;
  });
};

// Servidor de control (3002)
const setupControlServer = () => {
  commonMiddleware(controlApp);

  const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token no proporcionado' });
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== 'admin') throw new Error();
      next();
    } catch (error) {
      res.status(403).json({ error: 'Acceso no autorizado' });
    }
  };

  controlApp.post('/api/control-server', verifyAdmin, (req, res) => {
    const { action } = req.body;

    try {
      switch(action) {
        case 'start':
          if (!isMainServerRunning) {
            mainServer = setupMainServer();
          }
          break;
          
        case 'stop':
          if (isMainServerRunning && mainServer) {
            mainServer.close(() => {
              console.log('🔴 Servidor principal detenido');
              isMainServerRunning = false;
            });
          }
          break;
          
        case 'restart':
          if (mainServer) {
            mainServer.close(() => {
              console.log('🔄 Reiniciando servidor...');
              mainServer = setupMainServer();
            });
          }
          break;
          
        default:
          throw new Error('Acción no válida');
      }
      
      res.json({ 
        status: isMainServerRunning ? 'running' : 'stopped',
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Endpoint de verificación de estado
  controlApp.get('/api/health', (req, res) => {
    res.json({ 
      status: isMainServerRunning ? 'running' : 'stopped',
      timestamp: new Date().toISOString()
    });
  });

  controlApp.listen(PORT_CONTROL_SERVER, () => {
    console.log(`🎛 Servidor de control activo en http://localhost:${PORT_CONTROL_SERVER}`);
  });
};

// Inicialización
const initialize = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida.');
    
    await sequelize.sync({
      force: process.env.NODE_ENV === 'test',
      alter: process.env.NODE_ENV === 'development'
    });
    
    setupControlServer();
    mainServer = setupMainServer();
    
  } catch (error) {
    console.error('💥 Error de inicialización:', error);
    process.exit(1);
  }
};

// Manejo de señales
process.on('SIGINT', () => {
  console.log('\n🔧 Apagado solicitado...');
  if (mainServer) {
    mainServer.close(() => {
      console.log('🔒 Servidor principal detenido');
      process.exit(0);
    });
  }
});

// Iniciar la aplicación
initialize();
