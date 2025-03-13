import express from 'express';
import bodyParser from 'body-parser';
import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './enemigos.sqlite3'
});

const Enemigo = sequelize.define('Enemigo', {
    vida: { type: DataTypes.INTEGER, allowNull: false },
    daño: { type: DataTypes.INTEGER, allowNull: false },
    velocidad: { type: DataTypes.FLOAT, allowNull: false }
});

const app = express();
app.use(bodyParser.json());

// Endpoint para obtener parámetros de los enemigos
app.get('/api/enemigos', async (req, res) => {
    try {
        const enemigos = await Enemigo.findAll();
        res.json({ enemigos: enemigos });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para actualizar un enemigo
app.put('/api/enemigos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { vida, daño, velocidad } = req.body;
        const enemigo = await Enemigo.update({
            vida,
            daño,
            velocidad
        }, {
            where: { id }
        });
        if (enemigo[0] === 1) {
            res.status(200).json({ mensaje: "Enemigo actualizado correctamente" });
        } else {
            res.status(404).json({ mensaje: "Enemigo no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3001, () => {
    console.log('Servidor corriendo en http://localhost:3001');
});
