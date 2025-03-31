import PlayerStats from '../models/PlayerStats.js';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

// Ruta específica de Python
const PYTHON_PATH = 'C:\\Users\\MarcRojano\\AppData\\Local\\Programs\\Python\\Python313\\python.exe';

// Obtener todas las estadísticas
export const getAllStats = async (req, res) => {
  try {
    const stats = await PlayerStats.find().sort({ createdAt: -1 });
    res.json(stats);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      error: 'Error al obtener estadísticas',
      detalles: error.message
    });
  }
};

// Obtener estadísticas totales y generar gráfico
export const getTotalStats = async (req, res) => {
  try {
    const stats = await PlayerStats.find();
    
    // Calcular totales
    const totalStats = {
      total_wins: stats.reduce((sum, stat) => sum + stat.wins, 0),
      total_losses: stats.reduce((sum, stat) => sum + stat.losses, 0),
      total_enemies_killed: stats.reduce((sum, stat) => sum + stat.enemiesKilledByPlayer, 0),
      total_deaths: stats.reduce((sum, stat) => sum + stat.playerDeathsByEnemies, 0)
    };

    console.log('Datos para el gráfico:', totalStats);

    // Generar gráfico
    const pythonScript = path.join(process.cwd(), 'scripts', 'generate_stats_graph.py');
    console.log('Ruta del script Python:', pythonScript);

    // Verificar si el script existe
    if (!fs.existsSync(pythonScript)) {
      console.error('El script Python no existe en:', pythonScript);
      return res.status(500).json({ 
        error: 'Script de generación de gráfico no encontrado',
        instrucciones: 'Asegúrate de que el archivo generate_stats_graph.py existe en la carpeta scripts'
      });
    }

    // Crear una promesa para manejar la ejecución del script
    const generateGraph = new Promise((resolve, reject) => {
      // Escapar las comillas en la ruta del script
      const escapedScriptPath = `"${pythonScript}"`;
      const escapedData = JSON.stringify(totalStats).replace(/"/g, '\\"');
      
      const pythonProcess = spawn(PYTHON_PATH, [escapedScriptPath, escapedData], {
        shell: true,
        windowsHide: true
      });

      let errorOutput = '';
      let standardOutput = '';

      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString('utf8');
        console.error('Error de Python:', data.toString('utf8'));
      });

      pythonProcess.stdout.on('data', (data) => {
        standardOutput += data.toString('utf8');
        console.log('Salida de Python:', data.toString('utf8'));
      });

      pythonProcess.on('close', (code) => {
        console.log('Código de salida de Python:', code);
        console.log('Salida de error:', errorOutput);
        console.log('Salida estándar:', standardOutput);

        if (code !== 0) {
          reject(new Error(`Error al ejecutar el script Python: ${errorOutput}`));
          return;
        }

        const imagePath = path.join(process.cwd(), 'stats_graph.png');
        console.log('Buscando imagen en:', imagePath);

        if (!fs.existsSync(imagePath)) {
          reject(new Error('El archivo de imagen no se generó correctamente'));
          return;
        }

        try {
          const imageBuffer = fs.readFileSync(imagePath);
          console.log('Imagen leída correctamente, tamaño:', imageBuffer.length);
          resolve(imageBuffer);
        } catch (error) {
          reject(new Error(`Error al leer la imagen: ${error.message}`));
        }
      });

      pythonProcess.on('error', (error) => {
        reject(new Error(`Error al iniciar el proceso Python: ${error.message}`));
      });
    });

    const imageBuffer = await generateGraph;
    res.setHeader('Content-Type', 'image/png');
    res.send(imageBuffer);

  } catch (error) {
    console.error('Error al obtener estadísticas totales:', error);
    res.status(500).json({
      error: 'Error al obtener estadísticas totales',
      detalles: error.message
    });
  }
};

// Guardar nuevas estadísticas
export const saveStats = async (req, res) => {
  try {
    const { wins, losses, enemiesKilledByPlayer, playerDeathsByEnemies } = req.body;

    if (wins === undefined || losses === undefined || 
        enemiesKilledByPlayer === undefined || playerDeathsByEnemies === undefined) {
      return res.status(400).json({
        error: 'Faltan campos requeridos',
        camposRequeridos: ['wins', 'losses', 'enemiesKilledByPlayer', 'playerDeathsByEnemies']
      });
    }

    const newStats = new PlayerStats({
      wins,
      losses,
      enemiesKilledByPlayer,
      playerDeathsByEnemies
    });

    await newStats.save();

    res.status(201).json({
      mensaje: 'Estadísticas guardadas exitosamente',
      datos: newStats
    });

  } catch (error) {
    console.error('Error al guardar estadísticas:', error);
    res.status(500).json({
      error: 'Error al guardar estadísticas',
      detalles: error.message
    });
  }
}; 