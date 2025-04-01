import express from 'express';
import { getMongoDBStatus, toggleMongoDBMaintenance } from '../controllers/mongodbStatusController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Rutas protegidas que requieren autenticación
router.get('/status', verifyToken, getMongoDBStatus);
router.post('/toggle', verifyToken, toggleMongoDBMaintenance);

export default router; 