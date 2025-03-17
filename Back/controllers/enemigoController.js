import Enemigo from '../models/enemigo.js';

// Obtener todos los enemigos para la web
export const getAllEnemigos = async (req, res) => {
  try {
    const enemigos = await Enemigo.findAll();
    res.json(enemigos);
  } catch (error) {
    console.error('Error en getAllEnemigos:', error);
    res.status(500).json({
      error: 'Error al obtener enemigos',
      detalles: error.message
    });
  }
};

// Actualizar múltiples enemigos desde la web
export const updateAllEnemigos = async (req, res) => {
  try {
    const { enemigos } = req.body;

    if (!enemigos || !Array.isArray(enemigos)) {
      return res.status(400).json({ error: 'Formato de datos inválido' });
    }

    const resultados = await Promise.all(
      enemigos.map(async (enemigo) => {
        const [registro] = await Enemigo.upsert({
          nombre: enemigo.nombre,
          vida: enemigo.vida,
          daño: enemigo.daño,
          velocidad: enemigo.velocidad
        }, { returning: true });
        return registro;
      })
    );

    res.json({
      mensaje: 'Todos los enemigos actualizados',
      count: resultados.length
    });

  } catch (error) {
    console.error('Error en updateAllEnemigos:', error);
    res.status(500).json({
      error: error.name === 'SequelizeUniqueConstraintError'
        ? 'Datos duplicados'
        : 'Error del servidor',
      detalles: error.message
    });
  }
};

export const guardarYEnviarEnemigos = async (req, res) => {
  try {
    console.log('Recibida solicitud en /api/enemigos/guardar-y-enviar');
    console.log('Cuerpo de la solicitud:', req.body);

    const { enemigos } = req.body;

    if (!enemigos || !Array.isArray(enemigos)) {
      return res.status(400).json({ error: 'Formato de datos inválido' });
    }

    // Guardar/actualizar los enemigos en la base de datos
    await Promise.all(
      enemigos.map(async (enemigo) => {
        await Enemigo.upsert({
          nombre: enemigo.nombre,
          vida: enemigo.vida,
          daño: enemigo.daño,
          velocidad: enemigo.velocidad
        });
      })
    );

    console.log('Enemigos guardados en la base de datos');

    // En lugar de intentar comunicarse con Unity, simplemente enviamos una respuesta exitosa
    res.json({ 
      mensaje: 'Datos guardados exitosamente', 
      advertencia: 'La comunicación con Unity está desactivada temporalmente'
    });

  } catch (error) {
    console.error('Error en guardarYEnviarEnemigos:', error);
    res.status(500).json({
      error: error.name === 'SequelizeUniqueConstraintError'
        ? 'Datos duplicados'
        : 'Error del servidor',
      detalles: error.message
    });
  }
};

// Obtener datos optimizados para Unity
export const getEnemigosForUnity = async (req, res) => {
  try {
    const enemigos = await Enemigo.findAll({
      attributes: ['nombre', 'vida', 'daño', 'velocidad'],
      raw: true
    });

    res.json(enemigos);
  } catch (error) {
    console.error('Error en getEnemigosForUnity:', error);
    res.status(500).json({
      error: 'Error al obtener datos para Unity',
      detalles: error.message
    });
  }
};
