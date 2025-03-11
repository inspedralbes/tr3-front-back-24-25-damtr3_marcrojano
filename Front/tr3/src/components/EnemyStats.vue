<template>
    <v-container fluid class="enemy-dashboard pa-0">
      <v-parallax src="https://cdnjs.cloudflare.com/ajax/libs/img/1600x900/abstract/img-7.jpg" height="300">
        <div class="text-center">
          <h1 class="text-h2 font-weight-bold text-white mb-4">ENEMY CUSTOMIZER</h1>
          <h2 class="text-h5 font-weight-medium text-white">Personaliza y gestiona tus enemigos</h2>
        </div>
      </v-parallax>
      
      <v-container>
        <v-row>
          <!-- Enemy Stats Card -->
          <v-col cols="12" md="4">
            <v-card elevation="8" class="rounded-lg enemy-card">
              <v-card-title class="text-h5 font-weight-bold primary darken-1 white--text">
                <v-icon left color="white">mdi-sword-cross</v-icon>
                Estadísticas del Enemigo
              </v-card-title>
              <v-card-text class="pa-4">
                <v-slider
                  v-model="enemyLife"
                  label="Vida"
                  thumb-label="always"
                  min="0"
                  max="200"
                  color="red darken-2"
                ></v-slider>
                
                <v-slider
                  v-model="enemyDamage"
                  label="Daño"
                  thumb-label="always"
                  min="0"
                  max="50"
                  color="orange darken-2"
                ></v-slider>
                
                <v-slider
                  v-model="enemySpeed"
                  label="Velocidad"
                  thumb-label="always"
                  min="1"
                  max="20"
                  color="green darken-2"
                ></v-slider>
                
                <v-divider class="my-4"></v-divider>
                
                <div class="d-flex justify-space-between">
                  <div>
                    <div class="text-overline">Skin Equipada</div>
                    <div class="text-h6">{{ equippedSkin ? equippedSkin.name : 'Ninguna' }}</div>
                  </div>
                  <v-avatar size="60" class="mt-n2" v-if="equippedSkin">
                    <v-img :src="equippedSkin.image" alt="Skin"></v-img>
                  </v-avatar>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn 
                  block 
                  color="primary" 
                  @click="saveStats"
                  class="font-weight-bold"
                  elevation="2"
                >
                  <v-icon left>mdi-content-save</v-icon>
                  Guardar Cambios
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          
          <!-- Skins Gallery -->
          <v-col cols="12" md="8">
            <v-card elevation="8" class="rounded-lg">
              <v-card-title class="text-h5 font-weight-bold secondary darken-1 white--text">
                <v-icon left color="white">mdi-palette</v-icon>
                Galería de Skins
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Buscar skin"
                  dense
                  hide-details
                  outlined
                  dark
                  class="ml-2"
                  style="max-width: 250px"
                ></v-text-field>
              </v-card-title>
              
              <v-card-text class="pa-4">
                <v-tabs v-model="activeTab" background-color="transparent" color="secondary" grow>
                  <v-tab>
                    <v-icon left>mdi-view-grid</v-icon>
                    Cuadrícula
                  </v-tab>
                  <v-tab>
                    <v-icon left>mdi-view-list</v-icon>
                    Lista
                  </v-tab>
                </v-tabs>
                
                <v-tabs-items v-model="activeTab">
                  <!-- Grid View -->
                  <v-tab-item>
                    <v-row>
                      <v-col v-for="(skin, index) in filteredSkins" :key="index" cols="6" sm="4" md="4" lg="3">
                        <v-card
                          :color="equippedSkin === skin ? 'primary' : ''"
                          :class="{'skin-card': true, 'equipped': equippedSkin === skin}"
                          hover
                          elevation="4"
                          height="100%"
                        >
                          <v-img :src="skin.image" height="180" class="skin-image">
                            <template v-slot:placeholder>
                              <v-row class="fill-height ma-0" align="center" justify="center">
                                <v-progress-circular indeterminate color="primary"></v-progress-circular>
                              </v-row>
                            </template>
                            <div class="skin-rarity" :class="'rarity-' + skin.rarity.toLowerCase()"></div>
                          </v-img>
                          
                          <v-card-title class="text-subtitle-1 font-weight-bold pb-0">
                            {{ skin.name }}
                            <v-chip 
                              x-small 
                              :color="rarityColor(skin.rarity)" 
                              text-color="white" 
                              class="ml-2"
                            >{{ skin.rarity }}</v-chip>
                          </v-card-title>
                          
                          <v-card-subtitle class="pt-2 pb-0">
                            <v-rating
                              :value="skin.rating"
                              color="amber"
                              dense
                              half-increments
                              readonly
                              size="16"
                            ></v-rating>
                          </v-card-subtitle>
                          
                          <v-card-actions>
                            <v-btn
                              block
                              :color="equippedSkin === skin ? 'error' : 'success'"
                              class="font-weight-bold"
                              @click="equipSkin(skin)"
                            >
                              <v-icon left>{{ equippedSkin === skin ? 'mdi-tray-remove' : 'mdi-check-circle' }}</v-icon>
                              {{ equippedSkin === skin ? 'Desequipar' : 'Equipar' }}
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-tab-item>
                  
                  <!-- List View -->
                  <v-tab-item>
                    <v-list>
                      <v-list-item
                        v-for="(skin, index) in filteredSkins"
                        :key="index"
                        :class="{'list-item-equipped': equippedSkin === skin}"
                      >
                        <v-list-item-avatar size="60">
                          <v-img :src="skin.image" alt="Skin"></v-img>
                        </v-list-item-avatar>
                        
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-bold">
                            {{ skin.name }}
                            <v-chip 
                              x-small 
                              :color="rarityColor(skin.rarity)" 
                              text-color="white" 
                              class="ml-2"
                            >{{ skin.rarity }}</v-chip>
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            <v-rating
                              :value="skin.rating"
                              color="amber"
                              dense
                              half-increments
                              readonly
                              size="16"
                            ></v-rating>
                          </v-list-item-subtitle>
                          <v-list-item-subtitle class="text-caption">
                            {{ skin.description }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                        
                        <v-list-item-action>
                          <v-btn
                            :color="equippedSkin === skin ? 'error' : 'success'"
                            fab
                            small
                            @click="equipSkin(skin)"
                          >
                            <v-icon>{{ equippedSkin === skin ? 'mdi-tray-remove' : 'mdi-check-circle' }}</v-icon>
                          </v-btn>
                        </v-list-item-action>
                      </v-list-item>
                      <v-divider v-if="index < filteredSkins.length - 1"></v-divider>
                    </v-list>
                  </v-tab-item>
                </v-tabs-items>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      
      <!-- Stats Summary Dialog -->
      <v-dialog v-model="statsSaved" max-width="400">
        <v-card>
          <v-card-title class="text-h5 primary white--text">
            <v-icon left color="white">mdi-check-circle</v-icon>
            ¡Cambios Guardados!
          </v-card-title>
          <v-card-text class="pa-4 mt-4">
            <h3 class="font-weight-bold mb-3">Resumen de Estadísticas</h3>
            <v-simple-table>
              <template v-slot:default>
                <tbody>
                  <tr>
                    <td>Vida</td>
                    <td class="text-right font-weight-bold">{{ enemyLife }}</td>
                  </tr>
                  <tr>
                    <td>Daño</td>
                    <td class="text-right font-weight-bold">{{ enemyDamage }}</td>
                  </tr>
                  <tr>
                    <td>Velocidad</td>
                    <td class="text-right font-weight-bold">{{ enemySpeed }}</td>
                  </tr>
                  <tr>
                    <td>Skin Equipada</td>
                    <td class="text-right font-weight-bold">{{ equippedSkin ? equippedSkin.name : 'Ninguna' }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="statsSaved = false">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        enemyLife: 100,
        enemyDamage: 10,
        enemySpeed: 5,
        activeTab: 0,
        search: '',
        statsSaved: false,
        equippedSkin: null,
        skins: [
          {
            id: 1,
            name: "Demonio de Fuego",
            image: "/api/placeholder/300/300",
            description: "Skin de demonio con poderes de fuego",
            rarity: "Legendario",
            rating: 5
          },
          {
            id: 2,
            name: "Caballero Oscuro",
            image: "/api/placeholder/300/300",
            description: "Armadura negra con detalles rojos",
            rarity: "Épico",
            rating: 4.5
          },
          {
            id: 3,
            name: "Zombie Básico",
            image: "/api/placeholder/300/300",
            description: "Zombie estándar sin habilidades especiales",
            rarity: "Común",
            rating: 2
          },
          {
            id: 4,
            name: "Ninja Sombrío",
            image: "/api/placeholder/300/300",
            description: "Ninja con habilidades de sigilo",
            rarity: "Raro",
            rating: 3.5
          },
          {
            id: 5,
            name: "Esqueleto Arquero",
            image: "/api/placeholder/300/300",
            description: "Esqueleto con arco y flechas",
            rarity: "Poco común",
            rating: 3
          },
          {
            id: 6,
            name: "Golem de Hielo",
            image: "/api/placeholder/300/300",
            description: "Criatura de hielo con aura congelante",
            rarity: "Épico",
            rating: 4
          },
          {
            id: 7,
            name: "Dragón Antiguo",
            image: "/api/placeholder/300/300",
            description: "Dragón milenario con escamas de oro",
            rarity: "Legendario",
            rating: 5
          },
          {
            id: 8,
            name: "Soldado Infectado",
            image: "/api/placeholder/300/300",
            description: "Soldado con infección viral",
            rarity: "Común",
            rating: 2.5
          }
        ]
      }
    },
    computed: {
      filteredSkins() {
        if (!this.search) return this.skins;
        const searchTerm = this.search.toLowerCase();
        return this.skins.filter(skin => 
          skin.name.toLowerCase().includes(searchTerm) || 
          skin.description.toLowerCase().includes(searchTerm) ||
          skin.rarity.toLowerCase().includes(searchTerm)
        );
      }
    },
    methods: {
      saveStats() {
        console.log('Estadísticas guardadas:', {
          vida: this.enemyLife,
          daño: this.enemyDamage,
          velocidad: this.enemySpeed,
          skinEquipada: this.equippedSkin ? this.equippedSkin.name : 'Ninguna'
        });
        
        this.statsSaved = true;
      },
      equipSkin(skin) {
        if (this.equippedSkin === skin) {
          this.equippedSkin = null;
        } else {
          this.equippedSkin = skin;
        }
      },
      rarityColor(rarity) {
        const colors = {
          'Común': 'grey',
          'Poco común': 'green',
          'Raro': 'blue',
          'Épico': 'purple',
          'Legendario': 'amber darken-2'
        };
        return colors[rarity] || 'grey';
      }
    }
  }
  </script>
  
  <style scoped>
  .enemy-dashboard {
    background-color: #f5f5f5;
  }
  
  .enemy-card {
    position: relative;
    overflow: hidden;
  }
  
  .enemy-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('/api/placeholder/400/400') no-repeat;
    background-size: cover;
    opacity: 0.05;
    z-index: 0;
  }
  
  .skin-card {
    transition: all 0.3s ease;
    overflow: hidden;
    position: relative;
  }
  
  .skin-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.2) !important;
  }
  
  .skin-card.equipped {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.3) !important;
    border: 2px solid #1976d2;
  }
  
  .skin-image {
    position: relative;
  }
  
  .skin-rarity {
    position: absolute;
    top: 0;
    right: 0;
    width: 30px;
    height: 30px;
    clip-path: polygon(100% 0, 0 0, 100% 100%);
  }
  
  .rarity-común {
    background-color: #9e9e9e;
  }
  
  .rarity-poco.común {
    background-color: #4caf50;
  }
  
  .rarity-raro {
    background-color: #2196f3;
  }
  
  .rarity-épico {
    background-color: #9c27b0;
  }
  
  .rarity-legendario {
    background-color: #ffc107;
  }
  
  .list-item-equipped {
    background-color: rgba(25, 118, 210, 0.1);
    border-left: 4px solid #1976d2;
  }
  </style>