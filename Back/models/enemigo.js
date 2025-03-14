import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Enemigo = sequelize.define('Enemigo', {
  vida: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  daño: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  velocidad: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0
    }
  }
}, {
  timestamps: true
});

export default Enemigo;
