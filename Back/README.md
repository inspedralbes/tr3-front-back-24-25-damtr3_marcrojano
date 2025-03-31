# Backend del Juego

## Requisitos Previos

1. Node.js y npm
2. MongoDB
3. Python (para la generación de gráficos)

## Instalación

1. Instalar dependencias de Node.js:
```bash
npm install
```

2. Instalar Python y matplotlib:
   - Descargar Python desde https://www.python.org/downloads/
   - Durante la instalación, marcar la opción "Add Python to PATH"
   - Instalar matplotlib:
   ```bash
   python -m pip install matplotlib
   ```

3. Configurar variables de entorno:
   - Crear un archivo `.env` basado en `.env.example`
   - Ajustar las variables según tu configuración

4. Iniciar el servidor:
```bash
npm run dev
```

## Notas Importantes

- La funcionalidad de gráficos requiere Python y matplotlib instalados
- Si no tienes Python instalado, la funcionalidad de gráficos no estará disponible
- Asegúrate de que el archivo `generate_stats_graph.py` existe en la carpeta `scripts` 