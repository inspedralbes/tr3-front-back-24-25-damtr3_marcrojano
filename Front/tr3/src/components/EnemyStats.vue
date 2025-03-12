<template>
  <div>
    <v-card>
      <v-card-title>Enemigos</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field v-model="nombre" label="Nombre"></v-text-field>
          <v-text-field v-model="vida" label="Vida"></v-text-field>
          <v-text-field v-model="daño" label="Daño"></v-text-field>
          <v-text-field v-model="velocidad" label="Velocidad"></v-text-field>
          <v-btn @click="saveStats">Guardar Cambios</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nombre: '',
      vida: '',
      daño: '',
      velocidad: '',
      id: ''
    }
  },
  mounted() {
    this.fetchEnemigos();
  },
  methods: {
    async fetchEnemigos() {
      try {
        const response = await fetch('http://localhost:3000/api/enemigos');
        const data = await response.json();
        if (data.length > 0) {
          this.nombre = data[0].nombre;
          this.vida = data[0].vida;
          this.daño = data[0].daño;
          this.velocidad = data[0].velocidad;
          this.id = data[0].id;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async saveStats() {
      try {
        const response = await fetch(`http://localhost:3000/api/enemigos/${this.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ nombre: this.nombre, vida: this.vida, daño: this.daño, velocidad: this.velocidad })
        });
        if (response.ok) {
          console.log('Cambios guardados correctamente');
        } else {
          console.error('Error al guardar cambios');
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
}
</script>
