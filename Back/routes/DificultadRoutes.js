import express from 'express';
import {
  getAllMapConfigs,
  saveMapConfig,
  getMapConfigsForUnity
} from '../controllers/DificultadController.js';

const router = express.Router();

// Web endpoints
router.get('/map-configs', getAllMapConfigs);
router.post('/map-configs', saveMapConfig);

// Unity endpoints
router.get('/map-configs/unity', getMapConfigsForUnity);

export default router;