import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST || 'mysql',
    dialect: 'mysql',
    logging: false,
  }
);

import { defineEnemigos } from './enemigos.js';

const Enemigos = defineEnemigos(sequelize);


export { sequelize, Enemigos as enemigos };
export default sequelize;
