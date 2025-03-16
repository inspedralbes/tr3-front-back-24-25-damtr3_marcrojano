import Enemigo from '../models/enemigo.js';

// Obtener todos los enemigos
export const getAllEnemigos = async (req, res) => {
  try {
    const enemigos = await Enemigo.findAll();
    res.json(enemigos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEnemigoUnity = async (req, res) => {
  try {
    const { nombre, vida, daño, velocidad } = req.body;

    // Verifica si los datos están llegando correctamente
    console.log("Datos recibidos en el servidor:", req.body);

    // Validar que el nombre esté presente
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre del enemigo es obligatorio.' });
    }

    // Buscar el enemigo por nombre
    const enemigo = await Enemigo.findOne({ where: { nombre } });

    if (enemigo) {
      // Si el enemigo existe, actualizar
      console.log(`Actualizando enemigo: ${nombre}`);
      await Enemigo.update({ vida, daño, velocidad }, { where: { nombre } });
    } else {
      // Si no existe, crear uno nuevo
      console.log(`Creando enemigo nuevo: ${nombre}`);
      await Enemigo.create({ nombre, vida, daño, velocidad });
    }

    // Devolver el enemigo actualizado
    const updatedEnemigo = await Enemigo.findOne({ where: { nombre } });
    res.json(updatedEnemigo);
  } catch (error) {
    console.error("Error en el controlador de actualización:", error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'El enemigo ya existe.' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};


// Crear un nuevo enemigo desde Unity
export const createEnemigoFromUnity = async (req, res) => {
  try {
    const { nombre, vida, daño, velocidad } = req.body;
    const enemigo = await Enemigo.create({ nombre, vida, daño, velocidad });
    res.status(201).json({ mensaje: "Enemigo creado correctamente", enemigo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
