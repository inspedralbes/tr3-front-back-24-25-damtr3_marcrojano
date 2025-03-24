import express from 'express';
import {
  getAllCharacters,
  updateAllCharacters,
  getCharactersForUnity,
  guardarYEnviarCharacters
} from '../controllers/CharacterController.js';

const router = express.Router();

// Web endpoints
router.get('/characters', getAllCharacters);
router.put('/characters', updateAllCharacters);
router.post('/characters/guardar-y-enviar', guardarYEnviarCharacters);

// Unity endpoints
router.get('/characters/unity', getCharactersForUnity);

export default router;
