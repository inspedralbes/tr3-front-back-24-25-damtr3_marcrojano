import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import enemigoRoutes from './routes/enemigos.js';
import characterRoutes from './routes/CharacterRoutes.js';  
import sequelize from './config/database.js';

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/api', enemigoRoutes);
app.use('/api', characterRoutes);  

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida.');
    
    await sequelize.sync({
      force: process.env.NODE_ENV === 'test',
      alter: process.env.NODE_ENV === 'development'
    });
    console.log('🔄 Modelos sincronizados con la base de datos.');
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor activo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('💥 Error de inicialización:', error);
    process.exit(1);
  }
}

startServer();
