import Character from '../models/Character.js';

// Obtener todos los personajes para la web
export const getAllCharacters = async (req, res) => {
  try {
    const characters = await Character.findAll();
    res.json(characters);
  } catch (error) {
    console.error('Error en getAllCharacters:', error);
    res.status(500).json({
      error: 'Error al obtener personajes',
      detalles: error.message
    });
  }
};

// Actualizar múltiples personajes desde la web
export const updateAllCharacters = async (req, res) => {
  try {
    const { characters } = req.body;

    if (!characters || !Array.isArray(characters)) {
      return res.status(400).json({ error: 'Formato de datos inválido' });
    }

    const resultados = await Promise.all(
      characters.map(async (character) => {
        const [registro] = await Character.upsert({
          nombre: character.nombre,
          vida: character.vida,
          daño: character.daño,
          velocidad: character.velocidad
        }, { returning: true });
        return registro;
      })
    );

    res.json({
      mensaje: 'Todos los personajes actualizados',
      count: resultados.length
    });

  } catch (error) {
    console.error('Error en updateAllCharacters:', error);
    res.status(500).json({
      error: error.name === 'SequelizeUniqueConstraintError'
        ? 'Datos duplicados'
        : 'Error del servidor',
      detalles: error.message
    });
  }
};

export const guardarYEnviarCharacters = async (req, res) => {
  try {
    console.log('Recibida solicitud en /api/characters/guardar-y-enviar');
    console.log('Cuerpo de la solicitud:', req.body);

    const { characters } = req.body;

    if (!characters || !Array.isArray(characters)) {
      return res.status(400).json({ error: 'Formato de datos inválido' });
    }

    // Guardar/actualizar los personajes en la base de datos
    await Promise.all(
      characters.map(async (character) => {
        await Character.upsert({
          nombre: character.nombre,
          vida: character.vida,
          daño: character.daño,
          velocidad: character.velocidad
        });
      })
    );

    console.log('Personajes guardados en la base de datos');

    // En lugar de intentar comunicarse con Unity, simplemente enviamos una respuesta exitosa
    res.json({ 
      mensaje: 'Datos guardados exitosamente', 
      advertencia: 'La comunicación con Unity está desactivada temporalmente'
    });

  } catch (error) {
    console.error('Error en guardarYEnviarCharacters:', error);
    res.status(500).json({
      error: error.name === 'SequelizeUniqueConstraintError'
        ? 'Datos duplicados'
        : 'Error del servidor',
      detalles: error.message
    });
  }
};

// Obtener datos optimizados para Unity
export const getCharactersForUnity = async (req, res) => {
  try {
      const characters = await Character.findAll({
          attributes: ['nombre', 'vida', 'daño', 'velocidad'],
          raw: true
      });

      res.json(characters);
  } catch (error) {
      console.error('Error en getCharactersForUnity:', error);
      res.status(500).json({
          error: 'Error al obtener datos para Unity',
          detalles: error.message
      });
  }
};
