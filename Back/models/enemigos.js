import { DataTypes } from 'sequelize';

function defineEnemigos(sequelize) {
  return sequelize.define('Enemigos', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    vida: {
      type: DataTypes.INTEGER,
      defaultValue: 100
    },
    daño: {
      type: DataTypes.INTEGER,
      defaultValue: 10
    },
    velocidad: {
      type: DataTypes.FLOAT,
      defaultValue: 5.0
    }
  });
}

export { defineEnemigos };
