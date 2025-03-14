import Enemigo from '../models/enemigo.js';

export const getEnemigos = async (req, res) => {
    try {
      const enemigos = await Enemigo.findAll();
      res.json({ enemigos });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

export const updateEnemigo = async (req, res) => {
    try {
        const { id } = req.params;
        const { vida, daño, velocidad } = req.body;

        // Intenta encontrar el enemigo por ID antes de actualizar
        const enemigo = await Enemigo.findByPk(id);
        if (!enemigo) {
            return res.status(404).json({ mensaje: "Enemigo no encontrado" });
        }

        // Actualiza el enemigo si se encuentra
        await Enemigo.update({ vida, daño, velocidad }, { where: { id } });
        const updatedEnemigo = await Enemigo.findByPk(id);

        res.json(updatedEnemigo);
    } catch (error) {
        console.error("Error en updateEnemigo:", error);
        res.status(500).json({ error: error.message });
    }
};

export const updateEnemigoUnity = async (req, res) => {
    try {
        const { vida, daño, velocidad } = req.body;
        const [enemigo, created] = await Enemigo.upsert({ id: 1, vida, daño, velocidad }, { returning: true });
        res.status(created ? 201 : 200).json(enemigo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const createEnemigoFromUnity = async (req, res) => {
    try {
      const { vida, daño, velocidad } = req.body;
      const enemigo = await Enemigo.create({ vida, daño, velocidad });
      res.status(201).json({ mensaje: "Enemigo creado correctamente", enemigo });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
