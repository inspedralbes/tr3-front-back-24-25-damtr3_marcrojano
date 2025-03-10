<template>
  <v-app>
    <v-navigation-drawer app>
      <v-list>
        <v-list-item to="/">
          <v-list-item-title>Inicio</v-list-item-title>
        </v-list-item>
        <v-list-item to="/procesos">
          <v-list-item-title>Procesos</v-list-item-title>
        </v-list-item>
        <v-list-item to="/assets">
          <v-list-item-title>Assets</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-title>Panel de Control</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <NuxtPage />
      </v-container>
    </v-main>

    <v-footer app>
      © {{ new Date().getFullYear() }} - Mi Aplicación
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout'
}
</script>
