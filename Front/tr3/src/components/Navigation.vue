<template>
    <div v-if="shouldShowNavigation">
      <v-app-bar app color="primary" dark>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>{{ appTitle }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text @click="logout">Cerrar Sesión</v-btn>
      </v-app-bar>
  
      <v-navigation-drawer v-model="drawer" app permanent>
        <v-list density="compact">
          <template v-if="isAdmin">
            <v-list-item
              v-for="(item, i) in adminMenu"
              :key="i"
              :value="item"
              :to="item.route"
              active-color="primary"
            >
              <template v-slot:prepend>
                <v-icon :icon="item.icon"></v-icon>
              </template>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </template>
  
          <v-list-item
            :to="userDashboardRoute"
            active-color="primary"
          >
            <template v-slot:prepend>
              <v-icon icon="mdi-account"></v-icon>
            </template>
            <v-list-item-title>Mi Panel</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Navigation',
    data() {
      return {
        drawer: true,
        adminMenu: [
          { title: 'Inicio', icon: 'mdi-home', route: '/home' },
          { title: 'Equipar Skins', icon: 'mdi-tshirt-crew', route: '/equip-skins' },
          { title: 'Estadísticas de Enemigos', icon: 'mdi-chart-bar', route: '/enemy-stats' },
          { title: 'Gestión de Dificultad', icon: 'mdi-difficulty', route: '/difficulty' },
          { title: 'Estadísticas', icon: 'mdi-chart-line', route: '/stats' },
          { title: 'Gestor de Servicios', icon: 'mdi-cog', route: '/maintenance'},
        ]
      };
    },
    computed: {
      isAuthenticated() {
        return !!localStorage.getItem('token');
      },
      isAdmin() {
        return localStorage.getItem('userRole') === 'admin';
      },
      appTitle() {
        return this.isAdmin ? 'Panel de Administración' : 'Mi Cuenta';
      },
      userDashboardRoute() {
        return this.isAdmin ? '/home' : '/user-dashboard';
      },
      shouldShowNavigation() {
        const currentRoute = this.$route.path;
        return this.isAuthenticated && this.isAdmin && !['/login', '/register'].includes(currentRoute);
      },
      
    },
    methods: {
      logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        this.$router.push('/login');
      }
    }
  };
  </script>
  