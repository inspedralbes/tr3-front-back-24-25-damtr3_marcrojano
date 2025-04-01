<template>
  <v-container fluid class="pa-6">
    <v-card class="elevation-12">
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title class="text-h5 font-weight-bold">
          <v-icon left>mdi-cog</v-icon>
          Gestor de Microservicios
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="refreshStatus" class="mr-2">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-toolbar>
      
      <v-card-text class="pa-6">
        <v-row>
          <v-col cols="12">
            <h2 class="text-h4 mb-6 font-weight-bold primary--text">Gestión de Mantenimiento</h2>
          </v-col>
        </v-row>

        <v-row>
          <!-- Tarjeta de MongoDB -->
          <v-col cols="12" md="6" class="pa-4">
            <v-card class="elevation-8" :class="{ 'maintenance-mode': status.mongodb }">
              <v-card-title class="primary white--text">
                <v-icon left>mdi-database</v-icon>
                MongoDB
              </v-card-title>
              <v-card-subtitle class="pt-4">
                <v-chip
                  :color="status.mongodb ? 'error' : 'success'"
                  small
                  class="mr-2"
                >
                  {{ status.mongodb ? 'En Mantenimiento' : 'Operativo' }}
                </v-chip>
              </v-card-subtitle>
              <v-card-text class="pt-4">
                <v-row>
                  <v-col cols="12">
                    <v-chip
                      small
                      color="info"
                      class="mb-2"
                      block
                    >
                      Última actualización: {{ formatDate(status.lastUpdate?.mongodb) }}
                    </v-chip>
                    <v-chip 
                      :color="status.connectionStatus === 'connected' ? 'success' : 'error'"
                      small
                      block
                    >
                      {{ status.mongodb 
                        ? 'Base de datos desconectada - No se pueden realizar operaciones' 
                        : status.connectionStatus === 'connected'
                          ? 'Base de datos conectada - Operaciones disponibles'
                          : 'Base de datos no conectada' 
                      }}
                    </v-chip>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn
                  :color="status.mongodb ? 'success' : 'error'"
                  @click="toggleMongoDB"
                  elevation="2"
                >
                  <v-icon left>{{ status.mongodb ? 'mdi-check-circle' : 'mdi-tools' }}</v-icon>
                  {{ status.mongodb ? 'Finalizar Mantenimiento' : 'Iniciar Mantenimiento' }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <!-- Tarjeta de UserDashboard -->
          <v-col cols="12" md="6" class="pa-4">
            <v-card class="elevation-8" :class="{ 'maintenance-mode': status.userDashboard }">
              <v-card-title class="primary white--text">
                <v-icon left>mdi-view-dashboard</v-icon>
                UserDashboard
              </v-card-title>
              <v-card-subtitle class="pt-4">
                <v-chip
                  :color="status.userDashboard ? 'error' : 'success'"
                  small
                  class="mr-2"
                >
                  {{ status.userDashboard ? 'En Mantenimiento' : 'Operativo' }}
                </v-chip>
              </v-card-subtitle>
              <v-card-text class="pt-4">
                <v-row>
                  <v-col cols="12">
                    <v-chip
                      small
                      color="info"
                      class="mb-2"
                      block
                    >
                      Última actualización: {{ formatDate(status.lastUpdate?.userDashboard) }}
                    </v-chip>
                    <v-chip 
                      :color="status.userDashboard ? 'error' : 'success'"
                      small
                      block
                    >
                      {{ status.userDashboard 
                        ? 'Dashboard en mantenimiento - Acceso restringido' 
                        : 'Dashboard operativo - Acceso permitido' 
                      }}
                    </v-chip>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn
                  :color="status.userDashboard ? 'success' : 'error'"
                  @click="toggleUserDashboard"
                  elevation="2"
                >
                  <v-icon left>{{ status.userDashboard ? 'mdi-check-circle' : 'mdi-tools' }}</v-icon>
                  {{ status.userDashboard ? 'Finalizar Mantenimiento' : 'Iniciar Mantenimiento' }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-snackbar
          v-model="snackbar.show"
          :color="snackbar.color"
          :timeout="3000"
          top
          right
          rounded
          elevation="8"
        >
          <v-icon left>{{ snackbar.color === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}</v-icon>
          {{ snackbar.text }}
        </v-snackbar>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'MaintenanceManager',
  data: () => ({
    status: {
      mongodb: false,
      userDashboard: false,
      lastUpdate: {
        mongodb: null,
        userDashboard: null
      },
      connectionStatus: 'connected'
    },
    snackbar: {
      show: false,
      text: '',
      color: 'success'
    }
  }),
  async mounted() {
    await this.fetchStatus();
  },
  methods: {
    formatDate(date) {
      if (!date) return 'Nunca';
      return new Date(date).toLocaleString();
    },
    showSnackbar(text, color = 'success') {
      this.snackbar = {
        show: true,
        text,
        color
      };
    },
    async refreshStatus() {
      await this.fetchStatus();
      this.showSnackbar('Estado actualizado');
    },
    async fetchStatus() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.$router.push('/login');
          return;
        }

        const response = await fetch('http://localhost:3001/api/maintenance/status', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener el estado de mantenimiento');
        }

        const data = await response.json();
        this.status.userDashboard = data.userDashboard;
        this.status.lastUpdate.userDashboard = data.lastUpdate?.userDashboard || null;

        // Obtener estado de MongoDB
        const mongoResponse = await fetch('http://localhost:3001/api/mongodb/status', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!mongoResponse.ok) {
          throw new Error('Error al obtener el estado de MongoDB');
        }

        const mongoData = await mongoResponse.json();
        this.status.mongodb = mongoData.mongodb;
        this.status.lastUpdate.mongodb = mongoData.lastUpdate;
        this.status.connectionStatus = mongoData.connectionStatus;
      } catch (error) {
        console.error('Error al obtener el estado:', error);
        this.showSnackbar(error.message || 'Error al obtener el estado de mantenimiento', 'error');
      }
    },
    async toggleUserDashboard() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.$router.push('/login');
          return;
        }

        const response = await fetch('http://localhost:3001/api/maintenance/toggle', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ service: 'userDashboard' })
        });

        if (!response.ok) {
          throw new Error('Error al cambiar el estado de mantenimiento');
        }

        const data = await response.json();
        this.status.userDashboard = data.status.userDashboard;
        this.status.lastUpdate.userDashboard = data.status.lastUpdate.userDashboard;
        this.showSnackbar(data.message);
      } catch (error) {
        console.error('Error al cambiar el estado:', error);
        this.showSnackbar(error.message || 'Error al cambiar el estado de mantenimiento', 'error');
      }
    },
    async toggleMongoDB() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.$router.push('/login');
          return;
        }

        const response = await fetch('http://localhost:3001/api/mongodb/toggle', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al cambiar el estado de MongoDB');
        }

        const data = await response.json();
        this.status.mongodb = data.status.mongodb;
        this.status.lastUpdate.mongodb = data.status.lastUpdate;
        this.status.connectionStatus = data.status.connectionStatus;
        this.showSnackbar(data.message);
      } catch (error) {
        console.error('Error al cambiar el estado de MongoDB:', error);
        this.showSnackbar(error.message || 'Error al cambiar el estado de MongoDB', 'error');
      }
    }
  }
};
</script>

<style scoped>
.maintenance-mode {
  border: 2px solid #ff5252;
  background-color: rgba(255, 82, 82, 0.05);
}

.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-5px);
}

.v-btn {
  text-transform: none;
  letter-spacing: 0.5px;
}

.v-chip {
  font-weight: 500;
}

.text-h4 {
  letter-spacing: 0.5px;
}

.v-toolbar {
  border-radius: 8px 8px 0 0;
}
</style>
  