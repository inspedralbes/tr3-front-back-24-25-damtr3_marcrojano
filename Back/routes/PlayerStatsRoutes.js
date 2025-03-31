import express from 'express';
import { getAllStats, saveStats, getTotalStats } from '../controllers/PlayerStatsController.js';

const router = express.Router();

// Rutas para estadísticas del jugador
router.get('/player-stats', getAllStats);
router.get('/player-stats/graph', getTotalStats);
router.post('/player-stats', saveStats);

export default router; 