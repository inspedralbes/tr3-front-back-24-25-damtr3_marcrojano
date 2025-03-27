<template>
  <v-app>
    <Navigation v-if="showNavigation" />
    <v-main :class="{ 'with-nav': showNavigation }">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Navigation from './components/Navigation.vue';

export default {
  name: 'App',
  components: {
    Navigation
  },
  computed: {
    showNavigation() {
      const isAuthenticated = !!localStorage.getItem('token');
      const isAdmin = localStorage.getItem('userRole') === 'admin';
      const currentRoute = this.$route.path;
      return isAuthenticated && isAdmin && !['/login', '/register'].includes(currentRoute);
    }
  }
};
</script>

<style>
.with-nav {
  padding-left: 256px; /* Ajusta este valor según el ancho de tu navigation drawer */
}
</style>
