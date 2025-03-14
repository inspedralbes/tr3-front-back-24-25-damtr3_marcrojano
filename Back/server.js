import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import enemigoRoutes from './routes/enemigos.js';
import sequelize from './config/database.js';

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/api', enemigoRoutes);

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    await sequelize.sync();
    console.log('Modelos sincronizados con la base de datos.');
    
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
  }
}

startServer();
