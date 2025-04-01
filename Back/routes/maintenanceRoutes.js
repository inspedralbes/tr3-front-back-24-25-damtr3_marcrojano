import express from 'express';
import maintenanceController from '../controllers/maintenanceController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Rutas protegidas que requieren autenticación
router.get('/status', verifyToken, maintenanceController.getStatus);
router.post('/toggle', verifyToken, maintenanceController.toggleMaintenance);
router.get('/unity-status', verifyToken, maintenanceController.getUnityStatus);

export default router;
