import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// Estado en memoria volátil
let maintenanceStatus = {
  userDashboard: false,
  unity: false
};

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

export default {
  getStatus: (req, res) => res.json(maintenanceStatus),

  toggleMaintenance: (req, res) => {
    const validServices = ['userDashboard', 'unity'];
    const { service } = req.body;
    
    if (!validServices.includes(service)) {
      return res.status(400).json({ error: 'Servicio no válido' });
    }
    
    maintenanceStatus[service] = !maintenanceStatus[service];
    console.log(`Estado actualizado - ${service}: ${maintenanceStatus[service]}`);
    
    res.json({ 
      success: true, 
      service,
      newStatus: maintenanceStatus[service] 
    });
  },

  getUnityStatus: (req, res) => res.json({ inMaintenance: maintenanceStatus.unity }),

  verifyAdminMiddleware: verifyAdmin
};
