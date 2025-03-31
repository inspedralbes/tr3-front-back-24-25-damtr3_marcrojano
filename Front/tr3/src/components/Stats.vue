<template>
  <div class="stats-container">
    <h2>Estadísticas del Jugador</h2>
    
    <!-- Gráfico de estadísticas -->
    <div class="graph-container">
      <img v-if="graphUrl" :src="graphUrl" alt="Gráfico de estadísticas" class="stats-graph" />
      <div v-else class="loading">Cargando gráfico...</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Stats',
  data() {
    return {
      graphUrl: null,
      loading: true
    };
  },
  methods: {
    async fetchGraph() {
      try {
        const response = await fetch('http://localhost:3001/api/player-stats/graph');
        if (!response.ok) {
          throw new Error('Error al obtener el gráfico');
        }
        
        const blob = await response.blob();
        this.graphUrl = URL.createObjectURL(blob);
      } catch (error) {
        console.error('Error al obtener el gráfico:', error);
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.fetchGraph();
  },
  beforeUnmount() {
    if (this.graphUrl) {
      URL.revokeObjectURL(this.graphUrl);
    }
  }
};
</script>

<style scoped>
.stats-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.graph-container {
  margin: 20px 0;
  text-align: center;
}

.stats-graph {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.loading {
  padding: 20px;
  text-align: center;
  color: #666;
}

h2 {
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}
</style>
  