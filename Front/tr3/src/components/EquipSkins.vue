<template>
    <v-container fluid class="skin-showcase-container">
      <v-row>
        <v-col cols="12">
          <h1 class="text-center text-h3 mb-6">Character Customization</h1>
        </v-col>
      </v-row>
      
      <!-- Main content area -->
      <v-row>
        <!-- Character preview area -->
        <v-col cols="12" md="6" class="character-preview-col">
          <v-card elevation="8" class="character-preview-card">
            <v-card-title class="text-h5 font-weight-bold">
              <v-icon large left>mdi-account-circle</v-icon>
              Character Preview
            </v-card-title>
            
            <v-card-text class="text-center py-6">
              <div class="character-preview-container">
                <!-- Character preview image -->
                <v-img
                  :src="getPreviewImage()"
                  max-height="400"
                  contain
                  class="character-preview"
                  :class="{'preview-pulse': isNewlyEquipped}"
                ></v-img>
                
                <!-- Equipped badge -->
                <v-chip
                  v-if="equippedSkin"
                  color="success"
                  class="equipped-badge"
                  dark
                >
                  <v-icon left>mdi-check-circle</v-icon>
                  Equipped: {{ equippedSkin.name }}
                </v-chip>
              </div>
            </v-card-text>
            
            <v-card-actions class="justify-center pb-4">
              <v-btn
                color="primary"
                large
                :disabled="!selectedSkin || selectedSkin.id === (equippedSkin && equippedSkin.id)"
                @click="equipSkin"
                class="px-8"
              >
                <v-icon left>mdi-tshirt-crew</v-icon>
                Equip Skin
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        
        <!-- Skin selection area -->
        <v-col cols="12" md="6">
          <v-card elevation="8" class="skin-selection-card">
            <v-card-title class="text-h5 font-weight-bold d-flex justify-space-between">
              <div>
                <v-icon large left>mdi-palette</v-icon>
                Available Skins
              </div>
              <v-chip outlined color="primary">{{ availableSkins.length }} Skins</v-chip>
            </v-card-title>
            
            <v-card-text>
              <v-tabs
                v-model="activeTab"
                background-color="transparent"
                grow
              >
                <v-tab>
                  <v-icon left>mdi-grid</v-icon>
                  Grid View
                </v-tab>
                <v-tab>
                  <v-icon left>mdi-format-list-bulleted</v-icon>
                  List View
                </v-tab>
              </v-tabs>
              
              <v-tabs-items v-model="activeTab">
                <!-- Grid view -->
                <v-tab-item>
                  <v-row class="mt-2">
                    <v-col
                      v-for="skin in availableSkins"
                      :key="skin.id"
                      cols="6"
                      sm="4"
                    >
                      <v-card
                        @click="selectSkin(skin)"
                        :class="{ 'skin-card-selected': isSelected(skin), 'skin-card-equipped': isEquipped(skin) }"
                        hover
                        class="skin-card"
                      >
                        <v-img
                          :src="skin.thumbnail"
                          height="120"
                          class="skin-thumbnail"
                        ></v-img>
                        
                        <v-card-title class="pa-2 text-subtitle-1 justify-center">
                          {{ skin.name }}
                        </v-card-title>
                        
                        <v-card-text class="pa-2 pt-0 d-flex justify-space-between">
                          <v-chip
                            x-small
                            :color="getRarityColor(skin.rarity)"
                            text-color="white"
                          >
                            {{ skin.rarity }}
                          </v-chip>
                          
                          <v-icon
                            v-if="isEquipped(skin)"
                            small
                            color="success"
                          >
                            mdi-check-circle
                          </v-icon>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-tab-item>
                
                <!-- List view -->
                <v-tab-item>
                  <v-list class="mt-2">
                    <v-list-item-group>
                      <v-list-item
                        v-for="skin in availableSkins"
                        :key="skin.id"
                        @click="selectSkin(skin)"
                        :class="{ 'skin-item-selected': isSelected(skin) }"
                      >
                        <v-list-item-avatar>
                          <v-img :src="skin.thumbnail"></v-img>
                        </v-list-item-avatar>
                        
                        <v-list-item-content>
                          <v-list-item-title>{{ skin.name }}</v-list-item-title>
                          <v-list-item-subtitle>{{ skin.description }}</v-list-item-subtitle>
                        </v-list-item-content>
                        
                        <v-list-item-action>
                          <v-chip
                            small
                            :color="getRarityColor(skin.rarity)"
                            text-color="white"
                            class="mr-2"
                          >
                            {{ skin.rarity }}
                          </v-chip>
                          
                          <v-icon
                            v-if="isEquipped(skin)"
                            color="success"
                          >
                            mdi-check-circle
                          </v-icon>
                        </v-list-item-action>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </v-tab-item>
              </v-tabs-items>
            </v-card-text>
            
            <v-card-actions class="justify-center pb-4" v-if="selectedSkin">
              <v-btn
                text
                color="error"
                @click="selectedSkin = null"
              >
                Clear Selection
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      
      <!-- Notification system -->
      <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        :timeout="3000"
        bottom
        right
      >
        {{ snackbar.text }}
        <template v-slot:action="{ attrs }">
          <v-btn
            text
            v-bind="attrs"
            @click="snackbar.show = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        // UI controls
        activeTab: 0,
        snackbar: {
          show: false,
          text: '',
          color: 'info'
        },
        isNewlyEquipped: false,
        
        // Skin data
        selectedSkin: null,
        equippedSkin: null,
        availableSkins: [
          {
            id: 1,
            name: "Default Warrior",
            description: "Standard issue battle armor",
            thumbnail: "/api/placeholder/200/200",
            fullImage: "/api/placeholder/400/400",
            rarity: "Common"
          },
          {
            id: 2,
            name: "Shadow Assassin",
            description: "Stalk your prey unseen",
            thumbnail: "/api/placeholder/200/200",
            fullImage: "/api/placeholder/400/400",
            rarity: "Rare"
          },
          {
            id: 3,
            name: "Dragon Knight",
            description: "Forged in dragon flame",
            thumbnail: "/api/placeholder/200/200",
            fullImage: "/api/placeholder/400/400",
            rarity: "Epic"
          },
          {
            id: 4,
            name: "Celestial Guardian",
            description: "Blessed by the stars",
            thumbnail: "/api/placeholder/200/200",
            fullImage: "/api/placeholder/400/400",
            rarity: "Legendary"
          },
          {
            id: 5,
            name: "Winter's Fury",
            description: "Cold as ice, deadly as frost",
            thumbnail: "/api/placeholder/200/200",
            fullImage: "/api/placeholder/400/400",
            rarity: "Epic"
          },
          {
            id: 6,
            name: "Ancient Warlord",
            description: "Relic of a forgotten age",
            thumbnail: "/api/placeholder/200/200",
            fullImage: "/api/placeholder/400/400",
            rarity: "Rare"
          }
        ]
      };
    },
    
    mounted() {
      // Set default skin on load
      this.equippedSkin = this.availableSkins[0];
    },
    
    methods: {
      selectSkin(skin) {
        this.selectedSkin = skin;
      },
      
      equipSkin() {
        if (!this.selectedSkin) return;
        
        this.equippedSkin = this.selectedSkin;
        this.showNotification(`${this.selectedSkin.name} equipped successfully!`, 'success');
        
        // Trigger animation effect
        this.isNewlyEquipped = true;
        setTimeout(() => {
          this.isNewlyEquipped = false;
        }, 1500);
        
        // Save to local storage or server
        this.saveEquippedSkin();
      },
      
      saveEquippedSkin() {
        // Save to localStorage for persistence
        localStorage.setItem('equippedSkin', JSON.stringify({
          id: this.equippedSkin.id,
          timestamp: new Date().toISOString()
        }));
        
        // Here you would typically also send to server
        console.log('Skin equipped and saved:', this.equippedSkin.name);
      },
      
      showNotification(text, color = 'info') {
        this.snackbar.text = text;
        this.snackbar.color = color;
        this.snackbar.show = true;
      },
      
      isSelected(skin) {
        return this.selectedSkin && this.selectedSkin.id === skin.id;
      },
      
      isEquipped(skin) {
        return this.equippedSkin && this.equippedSkin.id === skin.id;
      },
      
      getPreviewImage() {
        // Return preview image based on selected or equipped skin
        if (this.selectedSkin) {
          return this.selectedSkin.fullImage;
        } else if (this.equippedSkin) {
          return this.equippedSkin.fullImage;
        }
        return "/api/placeholder/400/400"; // Default fallback
      },
      
      getRarityColor(rarity) {
        const colors = {
          'Common': 'grey',
          'Uncommon': 'green',
          'Rare': 'blue',
          'Epic': 'purple',
          'Legendary': 'orange'
        };
        
        return colors[rarity] || 'grey';
      }
    }
  };
  </script>
  
  <style scoped>
  .skin-showcase-container {
    background-color: #f5f5f5;
    min-height: 100vh;
    padding-top: 16px;
    padding-bottom: 16px;
  }
  
  .character-preview-card, .skin-selection-card {
    height: 100%;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  .character-preview-container {
    position: relative;
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .character-preview {
    transition: all 0.3s ease;
  }
  
  .preview-pulse {
    animation: pulse 1.5s ease;
  }
  
  .equipped-badge {
    position: absolute;
    bottom: 12px;
    right: 12px;
    z-index: 2;
  }
  
  .skin-card {
    transition: all 0.2s ease-in-out;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid transparent;
  }
  
  .skin-card-selected {
    border-color: #1976d2;
    transform: translateY(-4px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  
  .skin-card-equipped {
    border-color: #4caf50;
  }
  
  .skin-item-selected {
    background-color: rgba(25, 118, 210, 0.1);
  }
  
  .skin-thumbnail {
    transition: transform 0.3s ease;
  }
  
  .skin-card:hover .skin-thumbnail {
    transform: scale(1.05);
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
      filter: brightness(1);
    }
    50% {
      transform: scale(1.05);
      filter: brightness(1.2);
    }
    100% {
      transform: scale(1);
      filter: brightness(1);
    }
  }
  </style>