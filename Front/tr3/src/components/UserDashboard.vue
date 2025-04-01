<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="primary white--text">
            Panel de Usuario
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" class="text-center">
                <h2 class="mb-4">Bienvenido, {{ username }}</h2>
                
                <!-- Botón de Descarga -->
                <v-btn
                  color="success"
                  size="large"
                  class="mb-4"
                  @click="downloadGame"
                >
                  <v-icon left>mdi-download</v-icon>
                  Descargar Juego
                </v-btn>

                <!-- Botón de Cerrar Sesión -->
                <v-btn
                  color="error"
                  @click="logout"
                >
                  <v-icon left>mdi-logout</v-icon>
                  Cerrar Sesión
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'UserDashboard',
  data() {
    return {
      username: localStorage.getItem('username') || 'Usuario'
    }
  },
  methods: {
    downloadGame() {
      // Aquí puedes agregar la lógica para descargar el juego
      window.open('http://localhost:3001/download/game', '_blank');
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('username');
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.v-card {
  max-width: 800px;
  margin: 0 auto;
}
</style> 