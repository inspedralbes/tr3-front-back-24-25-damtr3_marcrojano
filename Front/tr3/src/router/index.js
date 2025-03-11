import { createRouter, createWebHistory } from 'vue-router';
import EquipSkins from '../components/EquipSkins.vue';
import EnemyStats from '../components/EnemyStats.vue';
import TakePhoto from '../components/TakePhoto.vue';
import Stats from '../components/Stats.vue';

const routes = [
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
