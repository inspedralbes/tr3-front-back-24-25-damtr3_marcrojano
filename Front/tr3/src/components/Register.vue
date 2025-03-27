<template>
    <v-container class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Registro</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form @submit.prevent="handleRegister">
                <v-text-field
                  v-model="name"
                  label="Nombre"
                  prepend-icon="mdi-account"
                  required
                ></v-text-field>
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
                <v-text-field
                  v-model="confirmPassword"
                  label="Confirmar Contraseña"
                  prepend-icon="mdi-lock"
                  :type="showPassword ? 'text' : 'password'"
                  required
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="handleRegister" :loading="loading">Registrarse</v-btn>
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
        showPassword: false,
        loading: false
      }
    },
    methods: {
      async handleRegister() {
        if (this.password !== this.confirmPassword) {
          alert('Las contraseñas no coinciden');
          return;
        }
  
        this.loading = true;
        try {
          console.log('Intentando registro...');
          const response = await fetch('http://localhost:3001/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              name: this.name,
              email: this.email,
              password: this.password
            })
          });
  
          console.log('Respuesta recibida:', response.status);
          
          let data;
          try {
            data = await response.json();
          } catch (e) {
            console.error('Error al parsear JSON:', e);
            throw new Error('Error en la respuesta del servidor');
          }
  
          if (!response.ok) {
            throw new Error(data.message || 'Error en el registro');
          }
  
          console.log('Datos recibidos:', data);
          
          if (data.message) {
            alert('Registro exitoso');
            this.$router.push('/login');
          } else {
            throw new Error('Error en la respuesta del servidor');
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