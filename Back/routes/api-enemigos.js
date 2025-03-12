import express from 'express';
import { enemigos } from '../models/index.js';

const router = express.Router();

// GET
router.get('/', async (req, res) => {
  try {
    const enemigosList = await enemigos.findAll();
    res.json(enemigosList);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// POST
router.post('/', async (req, res) => {
  try {
    const { nombre, vida, daño, velocidad } = req.body;
    const newEnemigo = await enemigos.create({ nombre, vida, daño, velocidad });
    res.json(newEnemigo);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// PUT
router.put('/:id', async (req, res) => {
  try {
    const { nombre, vida, daño, velocidad } = req.body;
    const enemigo = await enemigos.findByPk(req.params.id);
    if (enemigo) {
      const enemigoUpdated = await enemigo.update({ nombre, vida, daño, velocidad });
      res.json(enemigoUpdated);
    } else {
      res.status(404).send('Enemigo no encontrado');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const enemigo = await enemigos.findByPk(req.params.id);
    if (enemigo) {
      await enemigo.destroy();
      res.json({ message: 'Enemigo eliminado correctamente' });
    } else {
      res.status(404).send('Enemigo no encontrado');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;
