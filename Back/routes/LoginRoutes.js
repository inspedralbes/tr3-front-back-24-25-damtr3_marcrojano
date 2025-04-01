import express from 'express';
import authController from '../controllers/LoginController.js';

const router = express.Router();

// Middleware para logging
router.use((req, res, next) => {
  console.log('Auth route:', req.method, req.url);
  next();
});

// Rutas públicas
router.post('/register', (req, res, next) => {
  console.log('Registro recibido:', req.body);
  authController.register(req, res, next);
});

router.post('/login', authController.login);

// Rutas protegidas
router.get('/verify', authController.verifyToken, (req, res) => {
  res.json({ user: req.user });
});

// Nueva ruta para obtener todos los usuarios (protegida)
router.get('/users', authController.verifyToken, authController.getAllUsers);

// Ruta específica para Unity (puedes protegerla o no según tus necesidades)
router.get('/unity/users', authController.getUsersForUnity);

export default router;