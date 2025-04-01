import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { spawn } from 'child_process';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import enemigoRoutes from './routes/enemigos.js';
import characterRoutes from './routes/CharacterRoutes.js';
import loginRoutes from './routes/LoginRoutes.js';
import maintenanceRoutes from './routes/maintenanceRoutes.js';
import mongodbStatusRoutes from './routes/mongodbStatusRoutes.js';
import sequelize from './config/database.js';
import dificultadRoutes from './routes/DificultadRoutes.js';
import playerStatsRoutes from './routes/PlayerStatsRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT_MAIN_SERVER = process.env.PORT_MAIN_SERVER;
const PORT_CONTROL_SERVER = process.env.PORT_CONTROL_SERVER;
const CORS_ORIGIN = process.env.CORS_ORIGIN;
const MONGODB_URI = process.env.MONGODB_URI;

// Configuración principal
const mainApp = express();
let mainServer = null;
let controlServer = null;

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

  // Middleware de logging
  app.use((req, res, next) => {
    console.log(`📝 ${req.method} ${req.url}`);
    next();
  });
};

// Servidor principal (3001)
const setupMainServer = () => {
  commonMiddleware(mainApp);

  // Log de rutas registradas
  console.log('📋 Registrando rutas...');

  // Rutas de MongoDB (deben ir primero para evitar conflictos)
  console.log('📋 Registrando rutas de MongoDB...');
  mainApp.use('/api/mongodb', (req, res, next) => {
    console.log(`📝 Petición MongoDB: ${req.method} ${req.url}`);
    next();
  }, mongodbStatusRoutes);
  console.log('✅ Rutas de MongoDB registradas');

  // Otras rutas
  mainApp.use('/api', enemigoRoutes);
  console.log('✅ Ruta /api/enemigos registrada');

  mainApp.use('/api', characterRoutes);
  console.log('✅ Ruta /api/characters registrada');

  mainApp.use('/api', dificultadRoutes);
  console.log('✅ Ruta /api/dificultad registrada');

  mainApp.use('/api/auth', loginRoutes);
  console.log('✅ Ruta /api/auth registrada');

  mainApp.use('/api/maintenance', maintenanceRoutes);
  console.log('✅ Ruta /api/maintenance registrada');

  mainApp.use('/api', playerStatsRoutes);
  console.log('✅ Ruta /api/player-stats registrada');

  // Middleware para manejar rutas no encontradas
  mainApp.use((req, res, next) => {
    console.error(`❌ Ruta no encontrada: ${req.method} ${req.url}`);
    res.status(404).json({ error: 'Ruta no encontrada' });
  });

  // Middleware para manejar errores
  mainApp.use((err, req, res, next) => {
    console.error('💥 Error en el servidor:', err);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: err.message
    });
  });

  return mainApp.listen(PORT_MAIN_SERVER, () => {
    console.log(`🚀 Servidor principal activo en http://localhost:${PORT_MAIN_SERVER}`);
    console.log('📝 Rutas disponibles:');
    console.log('- GET /api/mongodb/status');
    console.log('- POST /api/mongodb/toggle');
    console.log('- GET /api/maintenance/status');
    console.log('- POST /api/maintenance/toggle');
    isMainServerRunning = true;
  });
};

// Servidor de control (3003)
const setupControlServer = () => {
  commonMiddleware(controlApp);

  controlApp.get('/health', (req, res) => {
    res.json({ status: 'ok', mainServer: isMainServerRunning });
  });

  controlApp.post('/shutdown', (req, res) => {
    console.log('🛑 Recibida solicitud de apagado');
    res.json({ message: 'Apagando servidor...' });
    shutdownServers();
  });

  return controlApp.listen(PORT_CONTROL_SERVER, () => {
    console.log(`⚙️ Servidor de control activo en http://localhost:${PORT_CONTROL_SERVER}`);
  });
};

// Función para apagar los servidores
const shutdownServers = () => {
  console.log('🛑 Iniciando apagado de servidores...');
  
  if (mainServer) {
    mainServer.close(() => {
      console.log('✅ Servidor principal cerrado');
      isMainServerRunning = false;
    });
  }

  if (controlServer) {
    controlServer.close(() => {
      console.log('✅ Servidor de control cerrado');
    });
  }

  // Cerrar conexiones de base de datos
  mongoose.connection.close(() => {
    console.log('✅ Conexión a MongoDB cerrada');
  });

  sequelize.close().then(() => {
    console.log('✅ Conexión a MySQL cerrada');
  });

  // Salir del proceso
  process.exit(0);
};

// Manejar señales de terminación
process.on('SIGTERM', shutdownServers);
process.on('SIGINT', shutdownServers);

// Inicialización
const initialize = async () => {
  try {
    // Conectar a MySQL
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL establecida.');
    
    await sequelize.sync({
      force: process.env.NODE_ENV === 'test',
      alter: process.env.NODE_ENV === 'development'
    });

    // Conectar a MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conexión a MongoDB establecida.');
    
    controlServer = setupControlServer();
    mainServer = setupMainServer();
    
  } catch (error) {
    console.error('💥 Error de inicialización:', error);
    shutdownServers();
  }
};

// Iniciar la aplicación
initialize();
