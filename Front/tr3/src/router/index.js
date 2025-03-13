import { createRouter, createWebHistory } from 'vue-router';
import EquipSkins from '../components/EquipSkins.vue';
import EnemyStats from '../components/EnemyStats.vue';
import TakePhoto from '../components/TakePhoto.vue';
import Stats from '../components/Stats.vue';
import Home from '@/components/Home.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home // Puedes cambiar esto a cualquier otro componente que desees mostrar en la raíz
  },
  {
    path: '/equip-skins',
    name: 'equipSkins',
    component: EquipSkins
  },
  {
    path: '/enemy-stats',
    name: 'enemyStats',
    component: EnemyStats
  },
  {
    path: '/take-photo',
    name: 'takePhoto',
    component: TakePhoto
  },
  {
    path: '/stats',
    name: 'stats',
    component: Stats
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
