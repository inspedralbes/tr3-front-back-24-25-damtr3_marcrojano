<template>
  <div v-for="enemigo in enemigos" :key="enemigo.nombre">
    <v-card>
      <v-form>
        <!-- Mostrar y permitir la edición de las propiedades del enemigo -->
        <v-text-field v-model="enemigo.vida" label="Vida" type="number"></v-text-field>
        <v-text-field v-model="enemigo.daño" label="Daño" type="number"></v-text-field>
        <v-text-field v-model="enemigo.velocidad" label="Velocidad" type="number"></v-text-field>
        <v-btn @click="updateEnemigo(enemigo)">Guardar cambios</v-btn>
      </v-form>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      enemigos: [] // Aquí se almacenarán los enemigos
    };
  },
  mounted() {
    this.fetchEnemigos(); // Obtener los enemigos al montar el componente
  },
  methods: {
    // Método para obtener los enemigos desde el backend
    async fetchEnemigos() {
      try {
        const response = await fetch('http://localhost:3001/api/enemigos');
        if (!response.ok) {
          throw new Error('Error al obtener los enemigos');
        }
        const data = await response.json();
        console.log("Enemigos recibidos:", data); // Verifica los datos recibidos
        this.enemigos = data; // Asignamos los enemigos al array
      } catch (error) {
        console.error("Error obteniendo enemigos:", error);
      }
    },

    // Método para actualizar un enemigo
    async updateEnemigo(enemigo) {
  // Verifica la estructura del objeto enemigo antes de enviarlo
  console.log("Enemigo a actualizar:", enemigo);

  // Verifica si las propiedades son accesibles
  console.log("Nombre:", enemigo.nombre);
  console.log("Vida:", enemigo.vida);
  console.log("Daño:", enemigo.daño);
  console.log("Velocidad:", enemigo.velocidad);

  if (!enemigo.nombre || !enemigo.vida || !enemigo.daño || !enemigo.velocidad) {
    console.error("Faltan datos para actualizar el enemigo");
    return;
  }

  const enemigoData = {
    nombre: enemigo.nombre,
    vida: enemigo.vida,
    daño: enemigo.daño,
    velocidad: enemigo.velocidad
  };

  try {
    const response = await fetch('http://localhost:3001/api/enemigos/unity', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enemigoData)
    });

    if (response.ok) {
      console.log(`Enemigo ${enemigo.nombre} actualizado correctamente.`);
      this.fetchEnemigos(); // Recargar la lista de enemigos
    } else {
      const errorText = await response.text();
      console.error(`Error al actualizar enemigo ${enemigo.nombre}:`, errorText);
    }
  } catch (error) {
    console.error(`Error actualizando enemigo ${enemigo.nombre}:`, error);
  }
}
  }
};
</script>
