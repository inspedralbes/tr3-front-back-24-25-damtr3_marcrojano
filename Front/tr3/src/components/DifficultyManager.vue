<template>
    <v-container fluid class="glass-background">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-card 
            class="morpheus-card" 
            flat
            :class="{ 'dark-glass': isDarkMode }"
          >
            <v-toolbar 
              color="transparent" 
              flat 
              class="pa-0"
            >
              <v-spacer></v-spacer>
              <v-btn 
                icon 
                @click="toggleDarkMode" 
                class="mr-3 mode-toggle"
              >
                <v-icon large>
                  {{ isDarkMode ? 'mdi-weather-sunny' : 'mdi-moon-waxing-crescent' }}
                </v-icon>
              </v-btn>
            </v-toolbar>
  
            <v-card-title class="text-center mb-6">
              <h1 class="display-1 font-weight-bold gradient-text">
                Gestión de Dificultad
              </h1>
            </v-card-title>
  
            <v-card-text>
              <v-progress-linear
                v-if="loading"
                :color="isDarkMode ? 'accent' : 'primary'"
                height="3"
                indeterminate
                class="mb-4"
              ></v-progress-linear>
  
              <v-data-table
                :headers="headers"
                :items="configurations"
                hide-default-footer
                :dark="isDarkMode"
                class="elevation-0 transparent"
              >
                <template v-slot:item.difficultyLevel="{ item }">
                  <v-chip 
                    :color="getDifficultyColor(item.difficultyLevel)"
                    label
                    dark
                    class="difficulty-chip"
                  >
                    {{ item.difficultyLevel }}
                  </v-chip>
                </template>
  
                <template v-slot:item.mapSizeX="{ item }">
                  <v-text-field
                    v-model.number="item.mapSizeX"
                    type="number"
                    outlined
                    dense
                    hide-details
                    :color="isDarkMode ? 'accent' : 'primary'"
                    class="custom-input"
                    min="10"
                    max="100"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon 
                        small 
                        :color="isDarkMode ? 'accent' : 'primary'"
                        class="mr-2"
                      >
                        mdi-arrow-left-right
                      </v-icon>
                    </template>
                  </v-text-field>
                </template>
  
                <template v-slot:item.mapSizeY="{ item }">
                  <v-text-field
                    v-model.number="item.mapSizeY"
                    type="number"
                    outlined
                    dense
                    hide-details
                    :color="isDarkMode ? 'accent' : 'primary'"
                    class="custom-input"
                    min="10"
                    max="100"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon 
                        small 
                        :color="isDarkMode ? 'accent' : 'primary'"
                        class="mr-2"
                      >
                        mdi-arrow-up-down
                      </v-icon>
                    </template>
                  </v-text-field>
                </template>
  
                <template v-slot:item.enemyMultiplier="{ item }">
                  <v-text-field
                    v-model.number="item.enemyMultiplier"
                    type="number"
                    step="0.1"
                    outlined
                    dense
                    hide-details
                    :color="isDarkMode ? 'accent' : 'primary'"
                    class="custom-input"
                    min="0.5"
                    max="5.0"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon 
                        small 
                        :color="isDarkMode ? 'accent' : 'primary'"
                        class="mr-2"
                      >
                        mdi-sword-cross
                      </v-icon>
                    </template>
                  </v-text-field>
                </template>
              </v-data-table>
  
              <v-card-actions class="mt-6 justify-center">
                <v-btn
                  :color="isDarkMode ? 'accent' : 'primary'"
                  @click="saveConfigurations"
                  :loading="saving"
                  large
                  class="px-8 save-button"
                >
                  <v-icon left>mdi-content-save</v-icon>
                  Guardar Configuración
                </v-btn>
              </v-card-actions>
  
              <v-expand-transition>
                <v-alert
                  v-if="message"
                  :type="alertType"
                  border="left"
                  colored-border
                  elevation="2"
                  class="mt-4 custom-alert"
                >
                  <div class="d-flex align-center">
                    <v-icon class="mr-3">{{ alertIcon }}</v-icon>
                    <span class="text-body-1">{{ message }}</span>
                  </div>
                </v-alert>
              </v-expand-transition>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    name: 'DifficultyManager',
    data: () => ({
      loading: false,
      saving: false,
      configurations: [],
      message: null,
      alertType: 'info',
      isDarkMode: false,
      headers: [
        { 
          text: 'Dificultad', 
          value: 'difficultyLevel',
          sortable: false 
        },
        { 
          text: 'Ancho del Mapa (X)', 
          value: 'mapSizeX',
          sortable: false 
        },
        { 
          text: 'Alto del Mapa (Y)', 
          value: 'mapSizeY',
          sortable: false 
        },
        { 
          text: 'Multiplicador de Enemigos', 
          value: 'enemyMultiplier',
          sortable: false 
        },
      ]
    }),
    computed: {
      alertIcon() {
        return this.alertType === 'success' 
          ? 'mdi-check-circle-outline' 
          : 'mdi-alert-circle-outline';
      }
    },
    async mounted() {
      await this.fetchConfigurations();
    },
    methods: {
      toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
        this.$vuetify.theme.dark = this.isDarkMode;
      },
      getDifficultyColor(level) {
        const colors = {
          'Facil': 'green',
          'Normal': 'orange',
          'Dificil': 'red'
        };
        return colors[level] || 'primary';
      },
      async fetchConfigurations() {
        this.loading = true;
        try {
          const response = await fetch('http://localhost:3001/api/map-configs');
          if (!response.ok) throw new Error('Error al cargar configuraciones');
          this.configurations = await response.json();
        } catch (error) {
          this.showMessage('error', error.message);
        } finally {
          this.loading = false;
        }
      },
      async saveConfigurations() {
        this.saving = true;
        this.message = null;
        
        try {
          const response = await fetch('http://localhost:3001/api/map-configs', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(this.configurations)
          });
  
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al guardar');
          }
  
          this.showMessage('success', '¡Configuraciones actualizadas exitosamente!');
          await this.fetchConfigurations();
        } catch (error) {
          this.showMessage('error', error.message);
        } finally {
          this.saving = false;
        }
      },
      showMessage(type, text) {
        this.alertType = type;
        this.message = text;
        setTimeout(() => {
          this.message = null;
        }, 5000);
      }
    }
  };
  </script>
  
  <style scoped>
.glass-background {
  background: linear-gradient(135deg, #f5f7fa 0%, #e6e9f0 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.morpheus-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  box-shadow: 
    0 15px 35px rgba(0, 0, 0, 0.05),
    0 5px 15px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
}

.dark-glass {
  background: rgba(30, 39, 46, 0.85);
  color: #ecf0f1;
}

.gradient-text {
  background: linear-gradient(45deg, #4a90e2, #50a3a2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.mode-toggle {
  transition: transform 0.3s ease;
}

.mode-toggle:hover {
  transform: rotate(180deg);
}

.difficulty-chip {
  font-weight: 600;
  letter-spacing: 0.5px;
}

.custom-input >>> .v-input__slot {
  border-radius: 12px !important;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.save-button {
  border-radius: 30px;
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.save-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
}

.custom-alert {
  border-radius: 12px;
  backdrop-filter: blur(10px);
}
</style>