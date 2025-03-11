<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Mi Aplicación</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text to="/">Inicio</v-btn>
      <v-btn text to="/equip-skins">Equipar Skins</v-btn>
      <v-btn text to="/enemy-stats">Estadísticas Enemigos</v-btn>
      <v-btn text to="/take-photo">Sacar Foto</v-btn>
      <v-btn text to="/stats">Estadísticas</v-btn>
    </v-app-bar>

    <router-view />
  </v-app>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
/* Personalización del diseño */
.v-application {
  font-family: 'Roboto', sans-serif;
}
</style>
