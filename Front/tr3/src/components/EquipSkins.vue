<template>
  <div class="character-editor">
    <!-- Notification Snackbar -->
    <v-snackbar
      v-model="mostrarSnackbar"
      :color="tipoMensaje"
      :timeout="3000"
      top
    >
      {{ mensaje }}
      <template v-slot:action="{ attrs }">
        <v-btn icon v-bind="attrs" @click="mostrarSnackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Main Container -->
    <v-container fluid class="pa-4">
      <v-row>
        <v-col cols="12">
          <v-card class="mb-6 rounded-lg" elevation="3">
            <div class="d-flex align-center pa-4 primary darken-1">
              <v-avatar size="52" class="mr-4 elevation-2 white">
                <v-icon size="32" color="primary">mdi-account-sword</v-icon>
              </v-avatar>
              <div>
                <h1 class="text-h4 white--text font-weight-bold mb-1">Character Stats Editor</h1>
                <p class="text-subtitle-1 white--text mb-0">Configure and manage character attributes</p>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <!-- Left Panel: Character List -->
        <v-col cols="12" md="8">
          <v-card class="rounded-lg mb-6" elevation="2">
            <v-toolbar flat class="secondary darken-1">
              <v-icon left color="white">mdi-format-list-bulleted</v-icon>
              <span class="white--text text-h6 font-weight-bold">Existing Characters</span>
              <v-spacer></v-spacer>
              <v-btn 
                color="white" 
                small 
                outlined 
                @click="guardarYEnviar" 
                :disabled="characters.length === 0"
                class="text-none"
              >
                <v-icon left small>mdi-content-save</v-icon>
                Save Changes
              </v-btn>
            </v-toolbar>
            
            <div v-if="characters.length === 0" class="d-flex flex-column align-center justify-center pa-8">
              <v-avatar size="80" class="mb-4 grey lighten-4">
                <v-icon size="48" color="grey darken-1">mdi-account-multiple</v-icon>
              </v-avatar>
              <p class="text-h6 grey--text text--darken-1">No characters registered</p>
              <p class="text-subtitle-2 grey--text text-center">Add a new character using the form</p>
            </div>
            
            <v-container v-else fluid>
              <v-row dense>
                <v-col
                  v-for="(character, index) in characters"
                  :key="character.nombre"
                  cols="12"
                  sm="6"
                  lg="4"
                >
                  <v-card 
                    class="mb-3 rounded-lg" 
                    outlined
                    hover
                  >
                    <v-card-title class="py-2 d-flex justify-space-between">
                      <div class="d-flex align-center">
                        <v-avatar size="32" color="primary lighten-4" class="mr-2">
                          <v-icon color="primary">mdi-account</v-icon>
                        </v-avatar>
                        <span class="text-subtitle-1 font-weight-bold">{{ character.nombre }}</span>
                      </div>
                      <v-btn icon small @click="eliminarCharacter(index)">
                        <v-icon small color="grey darken-1">mdi-delete</v-icon>
                      </v-btn>
                    </v-card-title>

                    <v-divider></v-divider>

                    <v-card-text class="pt-4">
                      <v-row dense>
                        <v-col cols="12">
                          <v-slider
                            v-model="character.vida"
                            label="Health"
                            thumb-label="always"
                            min="0"
                            max="500"
                            color="red"
                            track-color="red lighten-3"
                            prepend-icon="mdi-heart"
                            hide-details
                          ></v-slider>
                        </v-col>

                        <v-col cols="12">
                          <v-slider
                            v-model="character.daño"
                            label="Damage"
                            thumb-label="always"
                            min="0"
                            max="100"
                            color="orange"
                            track-color="orange lighten-3"
                            prepend-icon="mdi-sword-cross"
                            hide-details
                          ></v-slider>
                        </v-col>

                        <v-col cols="12">
                          <v-slider
                            v-model="character.velocidad"
                            label="Speed"
                            thumb-label="always"
                            min="0"
                            max="10"
                            step="0.1"
                            color="green"
                            track-color="green lighten-3"
                            prepend-icon="mdi-run-fast"
                            hide-details
                          ></v-slider>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>

        <!-- Right Panel: Add New Character Form -->
        <v-col cols="12" md="4">
          <v-card class="rounded-lg sticky-top" elevation="2">
            <v-toolbar flat class="accent darken-1">
              <v-icon left color="white">mdi-plus-circle</v-icon>
              <span class="white--text text-h6 font-weight-bold">Add Character</span>
            </v-toolbar>
            
            <v-card-text class="pt-4">
              <v-form ref="formNuevoCharacter" @submit.prevent="agregarNuevoCharacter">
                <v-text-field
                  v-model="nuevoCharacter.nombre"
                  label="Character Name"
                  prepend-inner-icon="mdi-tag"
                  filled
                  rounded
                  dense
                  required
                  class="mb-2"
                ></v-text-field>

                <div class="mb-3">
                  <div class="d-flex align-center mb-1">
                    <v-icon small color="red" class="mr-2">mdi-heart</v-icon>
                    <span class="text-subtitle-2 grey--text text--darken-2">Health: {{ nuevoCharacter.vida }}</span>
                  </div>
                  <v-slider
                    v-model="nuevoCharacter.vida"
                    min="0"
                    max="500"
                    thumb-label="always"
                    color="red"
                    track-color="red lighten-3"
                    hide-details
                  ></v-slider>
                </div>

                <div class="mb-3">
                  <div class="d-flex align-center mb-1">
                    <v-icon small color="orange" class="mr-2">mdi-sword-cross</v-icon>
                    <span class="text-subtitle-2 grey--text text--darken-2">Damage: {{ nuevoCharacter.daño }}</span>
                  </div>
                  <v-slider
                    v-model="nuevoCharacter.daño"
                    min="0"
                    max="100"
                    thumb-label="always"
                    color="orange"
                    track-color="orange lighten-3"
                    hide-details
                  ></v-slider>
                </div>

                <div class="mb-4">
                  <div class="d-flex align-center mb-1">
                    <v-icon small color="green" class="mr-2">mdi-run-fast</v-icon>
                    <span class="text-subtitle-2 grey--text text--darken-2">Speed: {{ nuevoCharacter.velocidad }}</span>
                  </div>
                  <v-slider
                    v-model="nuevoCharacter.velocidad"
                    min="0"
                    max="10"
                    step="0.1"
                    thumb-label="always"
                    color="green"
                    track-color="green lighten-3"
                    hide-details
                  ></v-slider>
                </div>

                <v-btn 
                  color="success" 
                  type="submit"
                  elevation="2"
                  block
                  large
                  class="text-none font-weight-bold"
                >
                  <v-icon left>mdi-plus</v-icon>
                  Add Character
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
          
          <!-- Save and Send to Unity Button -->
          <v-card class="mt-4 rounded-lg" outlined>
            <v-card-text class="pa-3">
              <v-btn
                color="primary"
                @click="guardarYEnviar"
                :disabled="characters.length === 0"
                elevation="2"
                large
                block
                class="text-none font-weight-bold"
              >
                <v-icon left>mdi-content-save-send</v-icon>
                Save and Send to Unity
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mostrarSnackbar: false,
      tipoMensaje: 'success',
      mensaje: '',
      characters: [],
      nuevoCharacter: {
        nombre: '',
        vida: 100,
        daño: 10,
        velocidad: 2.5,
      },
    }
  },
  mounted() {
    this.fetchCharacters();
  },
  methods: {
    async fetchCharacters() {
      try {
        const response = await fetch('http://localhost:3001/api/characters');
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        // Clonar la respuesta para inspeccionarla
        const responseClone = response.clone();

        try {
          const data = await response.json();
          this.characters = data;
        } catch (error) {
          console.error('Error parsing JSON:', error);
          const text = await responseClone.text();
          console.error('Respuesta del servidor:', text);
          throw error;
        }
      } catch (error) {
        console.error('Error fetching characters:', error);
        this.mostrarSnackbar = true;
        this.tipoMensaje = 'error';
        this.mensaje = 'Error al obtener personajes';
      }
    },
    async guardarYEnviar() {
      try {
        const response = await fetch('http://localhost:3001/api/characters/guardar-y-enviar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            characters: this.characters,
          }),
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data.mensaje);
        this.mostrarSnackbar = true;
        this.tipoMensaje = 'success';
        this.mensaje = 'Datos guardados exitosamente';
      } catch (error) {
        console.error('Error saving and sending characters:', error);
        this.mostrarSnackbar = true;
        this.tipoMensaje = 'error';
        this.mensaje = 'Error al guardar y enviar personajes';
      }
    },
    agregarNuevoCharacter() {
      if (this.nuevoCharacter.nombre.trim() !== '') {
        this.characters.push({ ...this.nuevoCharacter });
        this.nuevoCharacter.nombre = '';
        this.nuevoCharacter.vida = 100;
        this.nuevoCharacter.daño = 10;
        this.nuevoCharacter.velocidad = 2.5;
      }
    },
    eliminarCharacter(index) {
      this.characters.splice(index, 1);
    }
  }
}
</script>

<style scoped>
.sticky-top {
  position: sticky;
  top: 16px;
}
</style>
