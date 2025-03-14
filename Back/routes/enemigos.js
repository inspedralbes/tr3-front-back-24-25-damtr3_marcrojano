import express from 'express';
import { getEnemigos, updateEnemigo, updateEnemigoUnity, createEnemigoFromUnity } from '../controllers/enemigoController.js';

const router = express.Router();

router.get('/enemigos', getEnemigos);
router.put('/enemigos/:id', updateEnemigo);
router.put('/enemigos/unity', updateEnemigoUnity);
router.post('/enemigos/unity', createEnemigoFromUnity);


export default router;
