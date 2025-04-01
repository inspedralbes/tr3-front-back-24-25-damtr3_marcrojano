import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import maintenanceService from '../services/maintenanceService.js';
import { verifyToken } from '../middleware/auth.js';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const verifyAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Formato de token inválido' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso solo para administradores' });
    }
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

class MaintenanceController {
  async getStatus(req, res) {
    try {
      const status = maintenanceService.getStatus();
      res.json({
        userDashboard: status.userDashboard,
        lastUpdate: {
          userDashboard: status.lastUpdate?.userDashboard || null
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el estado de mantenimiento' });
    }
  }

  async toggleMaintenance(req, res) {
    try {
      const { service } = req.body;
      
      if (!service) {
        return res.status(400).json({ error: 'Se requiere especificar el servicio' });
      }

      const status = maintenanceService.toggleMaintenance(service);
      res.json({
        success: true,
        message: `Servicio ${service} ${status[service] ? 'en mantenimiento' : 'operativo'}`,
        status: {
          [service]: status[service],
          lastUpdate: {
            [service]: status.lastUpdate?.[service] || new Date()
          }
        }
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  verifyAdminMiddleware = verifyAdmin;
}

export default new MaintenanceController();
