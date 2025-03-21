import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const MapConfig = sequelize.define('MapConfig', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  difficultyLevel: {
    type: DataTypes.ENUM('Facil', 'Normal', 'Dificil'),
    allowNull: false
  },
  mapSizeX: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  mapSizeY: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  enemyMultiplier: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  tableName: 'map_configs',
  timestamps: true
});

export default MapConfig;