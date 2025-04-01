<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title>
            Registro
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid">
              <v-text-field
                v-model="name"
                :rules="[v => !!v || 'El nombre es requerido']"
                label="Nombre"
                required
              ></v-text-field>

              <v-text-field
                v-model="email"
                :rules="[v => !!v || 'El email es requerido']"
                label="Email"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                :rules="[v => !!v || 'La contraseña es requerida']"
                label="Contraseña"
                type="password"
                required
              ></v-text-field>

              <v-text-field
                v-model="confirmPassword"
                :rules="[v => !!v || 'La confirmación de la contraseña es requerida']"
                label="Confirmar Contraseña"
                type="password"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="register"
              :disabled="!valid"
            >
              Registrarse
            </v-btn>
          </v-card-actions>
          <v-card-text class="text-center">
            ¿Ya tienes cuenta? 
            <router-link to="/login">Inicia Sesión</router-link>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      valid: true
    }
  },
  methods: {
    async register() {
      if (this.password !== this.confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }

      try {
        const response = await fetch('http://localhost:3001/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: this.name,
            email: this.email,
            password: this.password
          })
        });

        if (!response.ok) {
          throw new Error('Error en el registro');
        }

        const data = await response.json();
        
        if (data.message) {
          alert('Registro exitoso');
          this.$router.push('/login');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
      }
    }
  }
}
</script>

<style scoped>
</style> 