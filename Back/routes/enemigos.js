import express from 'express';
import { updateEnemigoUnity, createEnemigoFromUnity, getAllEnemigos } from '../controllers/enemigoController.js';

const router = express.Router();

// Ruta para obtener todos los enemigos
router.get('/enemigos', getAllEnemigos);

// Ruta para actualizar o crear enemigo desde Unity
router.put('/enemigos/unity', updateEnemigoUnity);

router.post('/enemigos/unity', createEnemigoFromUnity);

export default router;
