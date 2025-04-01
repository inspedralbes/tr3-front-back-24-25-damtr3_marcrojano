import mongoose from 'mongoose';

let isMaintenanceMode = false;
let lastUpdate = null;

export const getMongoDBStatus = async (req, res) => {
    try {
        console.log('📊 Obteniendo estado de MongoDB...');
        const connectionStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
        const status = {
            mongodb: isMaintenanceMode,
            lastUpdate: lastUpdate,
            connectionStatus: connectionStatus,
            message: isMaintenanceMode 
                ? 'MongoDB en modo mantenimiento - Conexión cerrada'
                : connectionStatus === 'connected'
                    ? 'MongoDB operativo - Conexión activa'
                    : 'MongoDB no conectado'
        };
        console.log('Estado actual:', status);
        res.json(status);
    } catch (error) {
        console.error('❌ Error al obtener el estado de MongoDB:', error);
        res.status(500).json({ error: 'Error al obtener el estado de MongoDB' });
    }
};

export const toggleMongoDBMaintenance = async (req, res) => {
    try {
        console.log('🔄 Cambiando estado de mantenimiento de MongoDB...');
        isMaintenanceMode = !isMaintenanceMode;
        lastUpdate = new Date();

        if (isMaintenanceMode) {
            console.log('🔴 Desconectando MongoDB...');
            await mongoose.disconnect();
        } else {
            console.log('🟢 Reconectando MongoDB...');
            await mongoose.connect(process.env.MONGODB_URI);
        }

        const connectionStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
        const response = {
            success: true,
            message: isMaintenanceMode 
                ? 'MongoDB en modo mantenimiento - Conexión cerrada'
                : 'MongoDB operativo - Conexión activa',
            status: {
                mongodb: isMaintenanceMode,
                lastUpdate: lastUpdate,
                connectionStatus: connectionStatus
            }
        };
        console.log('Respuesta:', response);
        res.json(response);
    } catch (error) {
        console.error('❌ Error al cambiar el estado de MongoDB:', error);
        res.status(500).json({ error: 'Error al cambiar el estado de MongoDB' });
    }
}; 