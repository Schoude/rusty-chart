import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [{ name: 'home', path: '', component: () => import('@/views/TheHome.view.vue') }];

const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

export default router;
