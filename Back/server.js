// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { sequelize } from './models/index.js'; // Importa sequelize
import enemigosRouter from './routes/api-enemigos.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de rutas y vistas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas
app.use('/api/enemigos', enemigosRouter);

// Página de bienvenida
app.get('/', (req, res) => {
  res.render('portada');
});

// Sincronización de la base de datos
sequelize.sync()
  .then(() => {
    console.log('Base de datos sincronizada.');
    app.listen(PORT, () => {
      console.log(`Servidor funcionando en http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('Error sincronizando la base de datos:', err));
