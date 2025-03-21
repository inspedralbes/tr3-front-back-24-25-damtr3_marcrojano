<template>
  <div class="enemy-editor px-4 py-2">
    <!-- Alerta de mensajes -->
    <v-slide-y-transition>
      <v-alert
        v-if="mensaje"
        :type="tipoMensaje"
        dismissible
        border="left"
        class="mb-4"
      >
        {{ mensaje }}
      </v-alert>
    </v-slide-y-transition>

    <!-- Encabezado -->
    <v-card class="mb-6" elevation="2">
      <v-card-title class="primary white--text">
        <v-icon left color="white">mdi-sword</v-icon>
        Editor de Enemigos
      </v-card-title>
      <v-card-subtitle class="pt-2">
        Configura y gestiona los enemigos para tu juego
      </v-card-subtitle>
    </v-card>

    <!-- Lista de enemigos existentes -->
    <v-card class="mb-6" elevation="2">
      <v-card-title class="secondary white--text">
        <v-icon left color="white">mdi-format-list-bulleted</v-icon>
        Enemigos Existentes
      </v-card-title>
      
      <v-card-text v-if="enemigos.length === 0" class="text-center pa-4">
        <v-icon size="48" color="grey lighten-1">mdi-ghost</v-icon>
        <p class="mt-2">No hay enemigos registrados</p>
      </v-card-text>
      
      <v-row v-else class="pa-4">
        <v-col
          v-for="enemigo in enemigos"
          :key="enemigo.nombre"
          cols="12"
          md="6"
          lg="4"
        >
          <v-card elevation="1" class="mb-2">
            <v-card-title class="py-2">
              <v-icon left color="primary">mdi-robot</v-icon>
              {{ enemigo.nombre }}
            </v-card-title>

            <v-card-text>
              <v-row dense>
                <v-col cols="12">
                  <v-text-field
                    v-model.number="enemigo.vida"
                    label="Vida"
                    type="number"
                    min="0"
                    prepend-icon="mdi-heart"
                    outlined
                    dense
                    hint="Puntos de vida del enemigo"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model.number="enemigo.daño"
                    label="Daño"
                    type="number"
                    min="0"
                    prepend-icon="mdi-sword-cross"
                    outlined
                    dense
                    hint="Daño que inflige el enemigo"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model.number="enemigo.velocidad"
                    label="Velocidad"
                    type="number"
                    min="0"
                    step="0.1"
                    prepend-icon="mdi-run-fast"
                    outlined
                    dense
                    hint="Velocidad de movimiento"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <!-- Botón para guardar cambios -->
    <v-btn
      color="primary"
      @click="guardarYEnviar"
      class="mb-6"
      :disabled="enemigos.length === 0"
      elevation="2"
      large
      block
    >
      <v-icon left>mdi-content-save-send</v-icon>
      Guardar y Enviar a Unity
    </v-btn>

    <!-- Formulario para agregar nuevos enemigos -->
    <v-card class="mb-6" elevation="2">
      <v-card-title class="accent white--text">
        <v-icon left color="white">mdi-plus-circle</v-icon>
        Agregar Nuevo Enemigo
      </v-card-title>
      
      <v-card-text>
        <v-form ref="formNuevoEnemigo" @submit.prevent="agregarNuevoEnemigo">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="nuevoEnemigo.nombre"
                label="Nombre del Enemigo"
                prepend-icon="mdi-tag"
                outlined
                dense
                required
                hint="Nombre único para identificar al enemigo"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model.number="nuevoEnemigo.vida"
                label="Vida del Enemigo"
                type="number"
                min="0"
                prepend-icon="mdi-heart"
                outlined
                dense
                required
                hint="Puntos de vida"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model.number="nuevoEnemigo.daño"
                label="Daño del Enemigo"
                type="number"
                min="0"
                prepend-icon="mdi-sword-cross"
                outlined
                dense
                required
                hint="Puntos de daño"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model.number="nuevoEnemigo.velocidad"
                label="Velocidad del Enemigo"
                type="number"
                min="0"
                step="0.1"
                prepend-icon="mdi-run-fast"
                outlined
                dense
                required
                hint="Unidades por segundo"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-card-actions class="pa-0">
            <v-spacer></v-spacer>
            <v-btn 
              color="success" 
              type="submit"
              elevation="2"
            >
              <v-icon left>mdi-plus</v-icon>
              Agregar Enemigo
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
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
      setTimeout(() => {
        this.mensaje = '';
      }, 3000);
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
  },
};
</script>