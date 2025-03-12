import express from 'express';
const app = express();

// Configura el motor de plantillas
app.set('view engine', 'ejs');
app.set('views', './views');

// Ruta de ejemplo
app.get('/', (req, res) => {
  res.render('index');
});

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
