<template>
  <div>
    <v-alert
      v-if="mensaje"
      :type="tipoMensaje"
      dismissible
      class="mb-4"
    >
      {{ mensaje }}
    </v-alert>

    <!-- Lista de enemigos existentes -->
    <v-row>
      <v-col
        v-for="enemigo in enemigos"
        :key="enemigo.nombre"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card class="pa-4">
          <v-card-title class="text-h6">
            {{ enemigo.nombre }}
          </v-card-title>

          <v-card-text>
            <v-text-field
              v-model.number="enemigo.vida"
              label="Vida"
              type="number"
              min="0"
              outlined
              dense
            ></v-text-field>

            <v-text-field
              v-model.number="enemigo.daño"
              label="Daño"
              type="number"
              min="0"
              outlined
              dense
            ></v-text-field>

            <v-text-field
              v-model.number="enemigo.velocidad"
              label="Velocidad"
              type="number"
              min="0"
              step="0.1"
              outlined
              dense
            ></v-text-field>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Botón para guardar cambios -->
    <v-btn
      color="primary"
      @click="guardarYEnviar"
      class="mb-4 mt-4"
    >
      <v-icon left>mdi-content-save-send</v-icon>
      Guardar y Enviar a Unity
    </v-btn>

    <!-- Formulario para agregar nuevos enemigos -->
    <v-card class="mt-4 pa-4">
      <v-card-title>Agregar Nuevo Enemigo</v-card-title>
      <v-card-text>
        <v-form ref="formNuevoEnemigo" @submit.prevent="agregarNuevoEnemigo">
          <v-text-field
            v-model="nuevoEnemigo.nombre"
            label="Nombre del Enemigo"
            outlined
            dense
            required
          ></v-text-field>

          <v-text-field
            v-model.number="nuevoEnemigo.vida"
            label="Vida del Enemigo"
            type="number"
            min="0"
            outlined
            dense
            required
          ></v-text-field>

          <v-text-field
            v-model.number="nuevoEnemigo.daño"
            label="Daño del Enemigo"
            type="number"
            min="0"
            outlined
            dense
            required
          ></v-text-field>

          <v-text-field
            v-model.number="nuevoEnemigo.velocidad"
            label="Velocidad del Enemigo"
            type="number"
            min="0"
            step="0.1"
            outlined
            dense
            required
          ></v-text-field>

          <v-btn color="success" type="submit">
            <v-icon left>mdi-plus</v-icon>
            Agregar Enemigo
          </v-btn>
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
