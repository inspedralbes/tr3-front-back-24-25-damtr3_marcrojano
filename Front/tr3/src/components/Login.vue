<template>
    <v-container class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Login</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form @submit.prevent="handleLogin">
                <v-text-field
                  v-model="email"
                  label="Email"
                  prepend-icon="mdi-email"
                  type="email"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  label="Contraseña"
                  prepend-icon="mdi-lock"
                  :type="showPassword ? 'text' : 'password'"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPassword = !showPassword"
                  required
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="handleLogin" :loading="loading">Iniciar Sesión</v-btn>
            </v-card-actions>
            <v-card-text class="text-center">
              ¿No tienes cuenta? 
              <router-link to="/register">Regístrate</router-link>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'Login',
    data() {
      return {
        email: '',
        password: '',
        showPassword: false,
        loading: false
      }
    },
    methods: {
      async handleLogin() {
        this.loading = true;
        try {
          const response = await fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: this.email,
              password: this.password
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al iniciar sesión');
          }

          const data = await response.json();
          
          if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userRole', data.role);
            
            // Redirección basada en rol
            const targetRoute = data.role === 'admin' ? '/home' : '/user-dashboard';
            this.$router.push(targetRoute);
          } else {
            throw new Error('No se recibió token de autenticación');
          }
        } catch (error) {
          console.error('Error:', error);
          alert(error.message || 'Error al conectar con el servidor');
        } finally {
          this.loading = false;
        }
      }
    }
}
</script>
