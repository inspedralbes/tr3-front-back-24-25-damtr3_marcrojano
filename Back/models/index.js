import { Sequelize, DataTypes } from 'sequelize';

// Conexión con la base de datos
const sequelize = new Sequelize('tr3', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',  // o 'postgres', dependiendo de tu base de datos
  logging: false  // Esto desactiva los logs de SQL en la consola (opcional)
});

// Definición del modelo 'enemigos'
const enemigos = sequelize.define('Enemigo', {
  vida: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  daño: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  velocidad: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
});

// Exportar sequelize y el modelo
export { sequelize, enemigos };
