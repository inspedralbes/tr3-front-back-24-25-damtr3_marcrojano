import MapConfig from '../models/Dificultad.js';

// Get all map configurations
export const getAllMapConfigs = async (req, res) => {
  try {
    const mapConfigs = await MapConfig.findAll();
    res.status(200).json(mapConfigs);
  } catch (error) {
    console.error('Error al obtener configuraciones de mapa:', error);
    res.status(500).json({ message: 'Error al obtener configuraciones de mapa', error: error.message });
  }
};

// Save map configuration from Unity
export const saveMapConfig = async (req, res) => {
  try {
    const { difficultyLevel, mapSizeX, mapSizeY, enemyMultiplier } = req.body;
    
    // Validate required fields
    if (!difficultyLevel || !mapSizeX || !mapSizeY || !enemyMultiplier) {
      return res.status(400).json({ 
        message: 'Todos los campos son requeridos: difficultyLevel, mapSizeX, mapSizeY, enemyMultiplier' 
      });
    }
    
    // Find existing config or create new one
    const [mapConfig, created] = await MapConfig.findOrCreate({
      where: { difficultyLevel },
      defaults: {
        mapSizeX,
        mapSizeY,
        enemyMultiplier
      }
    });
    
    // If found but not created, update values
    if (!created) {
      await mapConfig.update({
        mapSizeX,
        mapSizeY,
        enemyMultiplier
      });
    }
    
    res.status(201).json({
      message: created ? 'Configuración de mapa creada' : 'Configuración de mapa actualizada',
      data: mapConfig
    });
    
  } catch (error) {
    console.error('Error al guardar configuración de mapa:', error);
    res.status(500).json({ message: 'Error al guardar configuración de mapa', error: error.message });
  }
};

// Get all map configurations for Unity
export const getMapConfigsForUnity = async (req, res) => {
  try {
    const mapConfigs = await MapConfig.findAll();
    
    // Format data for Unity
    const formattedConfigs = mapConfigs.map(config => ({
      difficultyLevel: config.difficultyLevel,
      mapSizeX: config.mapSizeX,
      mapSizeY: config.mapSizeY,
      enemyMultiplier: config.enemyMultiplier
    }));
    
    res.status(200).json(formattedConfigs);
  } catch (error) {
    console.error('Error al obtener configuraciones para Unity:', error);
    res.status(500).json({ message: 'Error al obtener configuraciones para Unity', error: error.message });
  }
};