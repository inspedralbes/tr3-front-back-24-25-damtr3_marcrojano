<template>
  <div class="enemy-editor">
    <!-- Notificación -->
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

    <!-- Encabezado principal -->
    <v-container fluid class="pa-4">
      <v-row>
        <v-col cols="12">
          <v-card class="mb-6 rounded-lg" elevation="3">
            <div class="d-flex align-center pa-4 primary darken-1">
              <v-avatar size="52" class="mr-4 elevation-2 white">
                <v-icon size="32" color="primary">mdi-sword</v-icon>
              </v-avatar>
              <div>
                <h1 class="text-h4 white--text font-weight-bold mb-1">Editor de Enemigos</h1>
                <p class="text-subtitle-1 white--text mb-0">Configura y gestiona los enemigos para tu juego</p>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <!-- Panel izquierdo: Lista de enemigos -->
        <v-col cols="12" md="8">
          <v-card class="rounded-lg mb-6" elevation="2">
            <v-toolbar flat class="secondary darken-1">
              <v-icon left color="white">mdi-format-list-bulleted</v-icon>
              <span class="white--text text-h6 font-weight-bold">Enemigos Existentes</span>
              <v-spacer></v-spacer>
              <v-btn 
                color="white" 
                small 
                outlined 
                @click="guardarYEnviar" 
                :disabled="enemigos.length === 0"
                class="text-none"
              >
                <v-icon left small>mdi-content-save</v-icon>
                Guardar cambios
              </v-btn>
            </v-toolbar>
            
            <div v-if="enemigos.length === 0" class="d-flex flex-column align-center justify-center pa-8">
              <v-avatar size="80" class="mb-4 grey lighten-4">
                <v-icon size="48" color="grey darken-1">mdi-ghost</v-icon>
              </v-avatar>
              <p class="text-h6 grey--text text--darken-1">No hay enemigos registrados</p>
              <p class="text-subtitle-2 grey--text text-center">Agrega un nuevo enemigo usando el formulario</p>
            </div>
            
            <v-container v-else fluid>
              <v-row dense>
                <v-col
                  v-for="(enemigo, index) in enemigos"
                  :key="enemigo.nombre"
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
                          <v-icon color="primary">mdi-robot</v-icon>
                        </v-avatar>
                        <span class="text-subtitle-1 font-weight-bold">{{ enemigo.nombre }}</span>
                      </div>
                      <v-btn icon small @click="eliminarEnemigo(index)">
                        <v-icon small color="grey darken-1">mdi-delete</v-icon>
                      </v-btn>
                    </v-card-title>

                    <v-divider></v-divider>

                    <v-card-text class="pt-4">
                      <v-row dense>
                        <v-col cols="12">
                          <v-slider
                            v-model="enemigo.vida"
                            label="Vida"
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
                            v-model="enemigo.daño"
                            label="Daño"
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
                            v-model="enemigo.velocidad"
                            label="Velocidad"
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

        <!-- Panel derecho: Formulario para agregar nuevos enemigos -->
        <v-col cols="12" md="4">
          <v-card class="rounded-lg sticky-top" elevation="2">
            <v-toolbar flat class="accent darken-1">
              <v-icon left color="white">mdi-plus-circle</v-icon>
              <span class="white--text text-h6 font-weight-bold">Agregar Enemigo</span>
            </v-toolbar>
            
            <v-card-text class="pt-4">
              <v-form ref="formNuevoEnemigo" @submit.prevent="agregarNuevoEnemigo">
                <v-text-field
                  v-model="nuevoEnemigo.nombre"
                  label="Nombre del Enemigo"
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
                    <span class="text-subtitle-2 grey--text text--darken-2">Vida: {{ nuevoEnemigo.vida }}</span>
                  </div>
                  <v-slider
                    v-model="nuevoEnemigo.vida"
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
                    <span class="text-subtitle-2 grey--text text--darken-2">Daño: {{ nuevoEnemigo.daño }}</span>
                  </div>
                  <v-slider
                    v-model="nuevoEnemigo.daño"
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
                    <span class="text-subtitle-2 grey--text text--darken-2">Velocidad: {{ nuevoEnemigo.velocidad }}</span>
                  </div>
                  <v-slider
                    v-model="nuevoEnemigo.velocidad"
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
                  Agregar Enemigo
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
          
          <!-- Botón para guardar cambios y enviar a Unity -->
          <v-card class="mt-4 rounded-lg" outlined>
            <v-card-text class="pa-3">
              <v-btn
                color="primary"
                @click="guardarYEnviar"
                :disabled="enemigos.length === 0"
                elevation="2"
                large
                block
                class="text-none font-weight-bold"
              >
                <v-icon left>mdi-content-save-send</v-icon>
                Guardar y Enviar a Unity
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
  data: () => ({
    enemigos: [],
    nuevoEnemigo: {
      nombre: '',
      vida: 100,
      daño: 10,
      velocidad: 2.5,
    },
    mensaje: '',
    tipoMensaje: 'success',
    mostrarSnackbar: false,
  }),

  mounted() {
    this.fetchEnemigos();
  },

  methods: {
    async fetchEnemigos() {
      try {
        const response = await fetch('http://localhost:3001/api/enemigos');
        const data = await response.json();
        this.enemigos = data;
      } catch (error) {
        this.mostrarMensaje('Error al cargar enemigos', 'error');
      }
    },

    async guardarYEnviar() {
      try {
        const response = await fetch('http://localhost:3001/api/enemigos/guardar-y-enviar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            enemigos: this.enemigos,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          this.mostrarMensaje(data.mensaje, 'success');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al guardar y enviar datos');
        }
      } catch (error) {
        this.mostrarMensaje(error.message, 'error');
      }
    },

    mostrarMensaje(texto, tipo = 'success') {
      this.mensaje = texto;
      this.tipoMensaje = tipo;
      this.mostrarSnackbar = true;
    },

    agregarNuevoEnemigo() {
      if (!this.nuevoEnemigo.nombre.trim()) {
        this.mostrarMensaje('El nombre del enemigo no puede estar vacío', 'warning');
        return;
      }

      const enemigoExistente = this.enemigos.find((e) => e.nombre === this.nuevoEnemigo.nombre);
      if (enemigoExistente) {
        this.mostrarMensaje(`El enemigo "${this.nuevoEnemigo.nombre}" ya existe`, 'warning');
        return;
      }

      this.enemigos.push({ ...this.nuevoEnemigo });
      this.mostrarMensaje(`Enemigo "${this.nuevoEnemigo.nombre}" agregado exitosamente`, 'success');

      // Resetear formulario después de agregar el enemigo
      this.nuevoEnemigo = { nombre: '', vida: 100, daño: 10, velocidad: 2.5 };
      if (this.$refs.formNuevoEnemigo) {
        this.$refs.formNuevoEnemigo.reset();
      }
    },

    eliminarEnemigo(index) {
      const enemigo = this.enemigos[index];
      this.enemigos.splice(index, 1);
      this.mostrarMensaje(`Enemigo "${enemigo.nombre}" eliminado`, 'info');
    },
  },
};
</script>

<style scoped>
.sticky-top {
  position: sticky;
  top: 16px;
}
</style>