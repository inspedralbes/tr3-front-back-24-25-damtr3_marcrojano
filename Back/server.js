import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import enemigoRoutes from './routes/enemigos.js';
import sequelize from './config/database.js';
import Enemigo from './models/enemigo.js';

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/api', enemigoRoutes);

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // 1. Autenticar conexión
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida.');

    // 2. Sincronizar modelos
    await sequelize.sync({
      force: process.env.NODE_ENV === 'test',
      alter: process.env.NODE_ENV === 'development'
    });
    console.log('🔄 Modelos sincronizados con la base de datos.');

    // 3. Eliminar duplicados
    const enemigos = await Enemigo.findAll();
    const nombres = new Set();
    const duplicados = enemigos.filter(enemigo => {
      const duplicado = nombres.has(enemigo.nombre);
      nombres.add(enemigo.nombre);
      return duplicado;
    });

    await Promise.all(duplicados.map(duplicado => duplicado.destroy()));
    console.log(`🗑️ Eliminados ${duplicados.length} registros duplicados.`);

    // 4. Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor activo en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('💥 Error de inicialización:', error);
    process.exit(1);
  }
}

startServer();
