import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Character = sequelize.define('Character', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  vida: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  daño: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  velocidad: {
    type: DataTypes.FLOAT,
    allowNull: false,
  }
}, {
  tableName: 'characters',
  freezeTableName: true,
  timestamps: true,
  paranoid: true,
});

export default Character;
