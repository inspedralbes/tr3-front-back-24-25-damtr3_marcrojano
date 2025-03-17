import express from 'express';
import {
  getAllEnemigos,
  updateAllEnemigos,
  getEnemigosForUnity,
  guardarYEnviarEnemigos
} from '../controllers/enemigoController.js';

const router = express.Router();

// Web endpoints
router.get('/enemigos', getAllEnemigos);
//router.put('/enemigos', updateAllEnemigos);
router.post('/enemigos/guardar-y-enviar', guardarYEnviarEnemigos);

// Unity endpoints
router.get('/enemigos/unity', getEnemigosForUnity);

export default router;
