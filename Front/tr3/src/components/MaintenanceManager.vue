<template>
    <v-container>
      <v-card>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>Gestor de Microservicios</v-toolbar-title>
        </v-toolbar>
        
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-card class="ma-2">
                <v-card-title>UserDashboard</v-card-title>
                <v-card-actions>
                  <v-btn 
                    :color="status.userDashboard ? 'error' : 'success'"
                    @click="toggleMaintenance('userDashboard')"
                    :loading="loading.userDashboard"
                  >
                    {{ status.userDashboard ? 'En Mantenimiento' : 'Operativo' }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
  
            <v-col cols="12" md="6">
              <v-card class="ma-2">
                <v-card-title>Unity Game</v-card-title>
                <v-card-actions>
                  <v-btn 
                    :color="status.unity ? 'error' : 'success'"
                    @click="toggleMaintenance('unity')"
                    :loading="loading.unity"
                  >
                    {{ status.unity ? 'En Mantenimiento' : 'Operativo' }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script>
  export default {
    data: () => ({
      status: {
        userDashboard: false,
        unity: false
      },
      loading: {
        userDashboard: false,
        unity: false
      }
    }),
    async mounted() {
      await this.fetchStatus();
    },
    methods: {
      async fetchStatus() {
        try {
          const response = await fetch('http://a23marrojgon-tr3.dam.inspedralbes.cat:29848/api/maintenance/status');
          if (!response.ok) throw new Error('Error obteniendo estado');
          this.status = await response.json();
        } catch (error) {
          console.error(error);
          alert('Error al obtener el estado de los servicios');
        }
      },
      async toggleMaintenance(service) {
        this.loading[service] = true;
        try {
          const response = await fetch('http://a23marrojgon-tr3.dam.inspedralbes.cat:29848/api/maintenance/toggle', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ service })
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error cambiando estado');
          }
          
          await this.fetchStatus();
        } catch (error) {
          console.error(error);
          alert(error.message);
        } finally {
          this.loading[service] = false;
        }
      }
    }
  };
  </script>
  