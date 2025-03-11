import { DataTypes } from 'sequelize';

function defineEnemigos(sequelize) {
  return sequelize.define('Enemigos', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // Otros atributos...
  });
}

export { defineEnemigos };
