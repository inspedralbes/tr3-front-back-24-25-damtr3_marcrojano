<template>
  <div class="enemy-editor-container">
    <v-card
      class="enemy-card"
      elevation="10"
      dark
    >
      <div class="card-header">
        <v-card-title class="text-h4 font-weight-bold">
          <v-icon large left color="red">mdi-sword-cross</v-icon>
          EDITAR ENEMIGO
        </v-card-title>
        <div class="enemy-avatar">
          <v-avatar size="100" class="enemy-icon">
            <v-icon size="60" color="red">mdi-robot-angry</v-icon>
          </v-avatar>
        </div>
      </div>

      <v-divider class="mx-4"></v-divider>

      <v-card-text>
        <v-form v-if="id" class="stat-form">
          <div class="stat-field">
            <label class="stat-label">VIDA</label>
            <v-slider
              v-model="vida"
              min="0"
              max="100"
              thumb-label="always"
              thumb-color="red"
              track-color="grey darken-3"
              color="red accent-4"
            ></v-slider>
            <v-text-field 
              v-model="vida" 
              type="number"
              outlined
              dense
              hide-details
              class="stat-value"
              prefix="HP:"
              color="red"
            ></v-text-field>
          </div>
          
          <div class="stat-field">
            <label class="stat-label">DAÑO</label>
            <v-slider
              v-model="daño"
              min="0"
              max="10"
              thumb-label="always"
              thumb-color="orange"
              track-color="grey darken-3"
              color="orange accent-4"
            ></v-slider>
            <v-text-field 
              v-model="daño" 
              type="number"
              outlined
              dense
              hide-details
              class="stat-value"
              prefix="DMG:"
              color="orange"
            ></v-text-field>
          </div>
          
          <div class="stat-field">
            <label class="stat-label">VELOCIDAD</label>
            <v-slider
              v-model="velocidad"
              min="0"
              max="30"
              thumb-label="always"
              thumb-color="cyan"
              track-color="grey darken-3"
              color="cyan accent-4"
            ></v-slider>
            <v-text-field 
              v-model="velocidad" 
              type="number"
              outlined
              dense
              hide-details
              class="stat-value"
              prefix="SPD:"
              color="cyan"
            ></v-text-field>
          </div>
          
          <div class="save-container">
            <v-btn 
              @click="updateStats" 
              x-large 
              color="green accent-4" 
              class="save-button"
              elevation="8"
            >
              <v-icon left>mdi-content-save</v-icon>
              GUARDAR CAMBIOS
            </v-btn>
          </div>
        </v-form>
        
        <v-alert v-else type="warning" prominent border="left" colored-border elevation="2" class="loading-alert">
          <v-icon large class="mr-4">mdi-loading mdi-spin</v-icon>
          <div class="alert-content">
            <div class="text-h6">Cargando datos del enemigo...</div>
            <div>Espere mientras se recupera la información del servidor</div>
          </div>
        </v-alert>
      </v-card-text>
      
      <v-card-actions class="card-footer">
        <div class="status-indicator">
          <v-icon small color="green" class="mr-1">mdi-circle</v-icon>
          <span class="status-text">Editor activo</span>
        </div>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: null,
      vida: '',
      daño: '',
      velocidad: '',
    };
  },
  mounted() {
    this.fetchStats();
  },
  methods: {
    async fetchStats() {
  try {
    const response = await fetch('http://localhost:3001/api/enemigos');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.enemigos && data.enemigos.length > 0) {
      const enemigo = data.enemigos[0];
      this.id = enemigo.id;
      this.vida = enemigo.vida;
      this.daño = enemigo.daño;
      this.velocidad = enemigo.velocidad;
    } else {
      console.warn("No se encontraron enemigos en la base de datos.");
    }
  } catch (error) {
    console.error("Error obteniendo datos del enemigo:", error);
  }
},


    async updateStats() {
      if (!this.id) {
        console.error("Error: ID del enemigo no definido.");
        return;
      }

      const updateData = {
        vida: parseInt(this.vida),
        daño: parseInt(this.daño),
        velocidad: parseFloat(this.velocidad)
      };

      console.log("Enviando datos:", updateData, "al ID:", this.id); // Imprime los datos aquí

      try {
        const response = await fetch(`http://localhost:3001/api/enemigos/${this.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        });

        if (response.ok) {
          console.log('Datos actualizados correctamente');
        } else {
          console.error('Error al actualizar datos:', await response.text());
        }
      } catch (error) {
        console.error('Error actualizando datos:', error);
      }
    },
  }
};
</script>

<style scoped>
.enemy-editor-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #1a1a2e;
  padding: 20px;
}

.enemy-card {
  width: 100%;
  max-width: 700px;
  background: linear-gradient(135deg, #2d3436 0%, #16213e 100%);
  border: 2px solid #ff4757;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.enemy-card::before {
  content: '';
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  background: linear-gradient(45deg, #ff4757, #00cec9, #ff4757);
  z-index: -1;
  border-radius: 15px;
  animation: border-glow 3s ease infinite;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 10px 20px;
  background: rgba(0, 0, 0, 0.3);
}

.enemy-avatar {
  background: rgba(255, 0, 0, 0.1);
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
  animation: pulse 2s infinite;
}

.stat-form {
  padding: 20px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  margin-top: 20px;
}

.stat-field {
  margin-bottom: 25px;
  position: relative;
}

.stat-label {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #ffffff;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.7);
  letter-spacing: 2px;
}

.stat-value {
  width: 120px;
  position: absolute;
  right: 0;
  top: 0;
}

.save-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.save-button {
  padding: 10px 30px;
  font-weight: bold;
  letter-spacing: 1px;
  border-radius: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  overflow: hidden;
}

.save-button::before {
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: linear-gradient(45deg, rgba(0, 255, 0, 0.8), rgba(0, 255, 0, 0));
  z-index: -1;
  animation: rotate 4s linear infinite;
  opacity: 0.3;
}

.save-button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.8);
}

.loading-alert {
  display: flex;
  align-items: center;
  margin: 20px 0;
  padding: 20px;
  border-left-width: 8px !important;
  border-color: #ffb142 !important;
}

.alert-content {
  margin-left: 10px;
}

.card-footer {
  background: rgba(0, 0, 0, 0.4);
  padding: 10px 20px;
}

.status-indicator {
  display: flex;
  align-items: center;
  font-size: 12px;
}

.status-text {
  color: #aaaaaa;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 0, 0, 0.8);
  }
  100% {
    box-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
  }
}

@keyframes border-glow {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.5;
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
