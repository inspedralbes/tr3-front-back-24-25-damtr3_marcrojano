import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Enemigo = sequelize.define('Enemigo', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Asegura que cada nombre sea único
    validate: {
      notEmpty: {
        msg: 'El nombre no puede estar vacío'
      }
    }
  },
  vida: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'La vida debe ser un número positivo'
      }
    }
  },
  daño: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'El daño debe ser un número positivo'
      }
    }
  },
  velocidad: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'La velocidad debe ser un número positivo'
      }
    }
  }
}, {
  tableName: 'enemigos',
  freezeTableName: true,
  timestamps: true,
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt']
    }
  }
});

export default Enemigo;
