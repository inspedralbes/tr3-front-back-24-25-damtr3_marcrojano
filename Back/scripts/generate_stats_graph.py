import sys
import json
import matplotlib
matplotlib.use('Agg')  # Configurar el backend antes de importar pyplot
import matplotlib.pyplot as plt
import os

# Configurar la codificación UTF-8 para la salida
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

try:
    # Verificar que se proporcionaron argumentos
    if len(sys.argv) < 2:
        print("Error: No se proporcionaron datos JSON", file=sys.stderr)
        sys.exit(1)

    # Obtener los datos del argumento de línea de comandos
    data_str = sys.argv[1]
    print(f"Datos recibidos: {data_str}")  # Debug
    
    try:
        data = json.loads(data_str)
    except json.JSONDecodeError as e:
        print(f"Error al decodificar JSON: {str(e)}", file=sys.stderr)
        sys.exit(1)
    
    # Crear el gráfico
    plt.figure(figsize=(10, 6))
    
    # Datos para el gráfico
    categories = ['Victorias', 'Derrotas', 'Enemigos Eliminados', 'Muertes']
    values = [
        data['total_wins'],
        data['total_losses'],
        data['total_enemies_killed'],
        data['total_deaths']
    ]
    
    # Crear el gráfico de barras
    bars = plt.bar(categories, values)
    
    # Añadir valores sobre las barras
    for bar in bars:
        height = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2., height,
                f'{int(height)}',
                ha='center', va='bottom')
    
    # Personalizar el gráfico
    plt.title('Estadísticas Totales del Jugador')
    plt.ylabel('Cantidad')
    
    # Rotar las etiquetas del eje x para mejor legibilidad
    plt.xticks(rotation=45)
    
    # Ajustar el diseño para evitar que las etiquetas se corten
    plt.tight_layout()
    
    # Obtener la ruta absoluta del directorio actual
    current_dir = os.path.dirname(os.path.abspath(__file__))
    # Subir un nivel para llegar al directorio Back
    back_dir = os.path.dirname(current_dir)
    # Ruta completa para el archivo de imagen
    image_path = os.path.join(back_dir, 'stats_graph.png')
    
    print(f"Guardando gráfico en: {image_path}")  # Debug
    
    # Guardar el gráfico
    plt.savefig(image_path, dpi=300, bbox_inches='tight')
    plt.close()
    
    print("Gráfico generado exitosamente")
    
except Exception as e:
    print(f"Error al generar el gráfico: {str(e)}", file=sys.stderr)
    sys.exit(1) 