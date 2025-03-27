import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import Home from '@/components/Home.vue';
import UserDashboard from '../components/UserDashboard.vue';
import EquipSkins from '../components/EquipSkins.vue';
import EnemyStats from '../components/EnemyStats.vue';
import DifficultyManager from '../components/DifficultyManager.vue';
import Stats from '../components/Stats.vue';
import MaintenanceManager from'../components/MaintenanceManager.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/user-dashboard',
    name: 'UserDashboard',
    component: UserDashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/equip-skins',
    name: 'EquipSkins',
    component: EquipSkins,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/enemy-stats',
    name: 'EnemyStats',
    component: EnemyStats,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/difficulty',
    name: 'Difficulty',
    component: DifficultyManager,
    meta: { requiresAuth: true, requiresAdmin: true }
  },  
  {
    path: '/stats',
    name: 'Stats',
    component: Stats,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/maintenance',
    name: 'Maintenance',
    component: MaintenanceManager,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole') || 'user';

  // Redirección basada en permisos
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresAdmin && userRole !== 'admin') {
    next('/user-dashboard');
  } else if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
    next(userRole === 'admin' ? '/home' : '/user-dashboard');
  } else {
    next();
  }
});

export default router;
