<template>
  <v-container fluid class="fill-height pa-0">
    <v-row align="center" justify="center" class="ma-0">
      <v-col cols="12" sm="8" md="6" lg="4" class="pa-4">
        <v-card class="elevation-12 rounded-lg">
          <v-toolbar color="primary" dark flat class="rounded-t-lg">
            <v-toolbar-title class="text-h5 font-weight-bold">
              <v-icon left>mdi-account-lock</v-icon>
              Iniciar Sesión
            </v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>

          <v-card-text class="pa-6">
            <v-form ref="form" v-model="valid" @submit.prevent="handleLogin">
              <v-text-field
                v-model="email"
                :rules="[v => !!v || 'El email es requerido']"
                label="Email"
                prepend-icon="mdi-email"
                type="email"
                required
                outlined
                dense
                class="mb-4"
                :error-messages="error"
                @keyup.enter="handleLogin"
              ></v-text-field>

              <v-text-field
                v-model="password"
                :rules="[v => !!v || 'La contraseña es requerida']"
                label="Contraseña"
                prepend-icon="mdi-lock"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                required
                outlined
                dense
                class="mb-6"
                :error-messages="error"
                @keyup.enter="handleLogin"
              ></v-text-field>

              <v-btn
                block
                color="primary"
                type="submit"
                :loading="loading"
                :disabled="!valid"
                elevation="2"
                class="mb-4"
              >
                <v-icon left>mdi-login</v-icon>
                Iniciar Sesión
              </v-btn>

              <v-alert
                v-if="error"
                type="error"
                dense
                text
                class="mb-4"
              >
                <v-icon left>mdi-alert-circle</v-icon>
                {{ error }}
              </v-alert>

              <div class="text-center">
                <span class="text-body-2">¿No tienes cuenta?</span>
                <v-btn
                  text
                  color="primary"
                  class="ml-2"
                  @click="$router.push('/register')"
                >
                  Regístrate aquí
                </v-btn>
              </div>
            </v-form>
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
        loading: false,
        valid: true,
        error: ''
      }
    },
    methods: {
      async handleLogin() {
        this.loading = true;
        this.error = '';
        
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
            localStorage.setItem('username', data.name);
            
            // Redirección basada en rol
            const targetRoute = data.role === 'admin' ? '/home' : '/user-dashboard';
            this.$router.push(targetRoute);
          } else {
            throw new Error('No se recibió token de autenticación');
          }
        } catch (error) {
          console.error('Error:', error);
          this.error = error.message || 'Error al conectar con el servidor';
        } finally {
          this.loading = false;
        }
      }
    }
}
</script>

<style scoped>
.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-5px);
}

.v-btn {
  text-transform: none;
  letter-spacing: 0.5px;
}

.v-toolbar {
  border-radius: 8px 8px 0 0;
}

.v-text-field {
  font-size: 0.9rem;
}

.v-alert {
  border-radius: 8px;
}
</style>
