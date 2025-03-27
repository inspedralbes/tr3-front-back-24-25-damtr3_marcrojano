<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              Panel de Usuario
              <v-spacer></v-spacer>
              <v-btn color="error" @click="logout">Cerrar Sesión</v-btn>
            </v-card-title>
            <v-card-text>
              <h2>Descarga el Juego</h2>
              <v-btn
                color="primary"
                href="https://tu-url-de-descarga.com/juego"
                target="_blank"
              >
                Descargar Juego
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    name: 'UserDashboard',
    methods: {
      logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        this.$router.push('/login');
      }
    }
  }
  </script> 