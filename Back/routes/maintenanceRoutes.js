import express from 'express';
import maintenanceController from '../controllers/maintenanceController.js';

const router = express.Router();

router.get('/status', maintenanceController.getStatus);
router.post('/toggle', 
  maintenanceController.verifyAdminMiddleware, 
  maintenanceController.toggleMaintenance
);

router.get('/unity-status', maintenanceController.getUnityStatus);

export default router;
