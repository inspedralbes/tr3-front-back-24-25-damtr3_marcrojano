import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Enemigo = sequelize.define('Enemigo', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,  // Asegurarte que el nombre es único
  },
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
