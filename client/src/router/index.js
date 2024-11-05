import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminFuelStationView from '@/views/AdminFuelStationView.vue';
import AdminCityView from '@/views/AdminCityView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/station/:id',
      name: 'station',
      component: () => import('../views/StationView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      children: [
        {
          // UserProfile will be rendered inside User's <router-view>
          // when /user/:id/profile is matched
          path: 'city',
          component: AdminCityView,
        },
        {
          // UserPosts will be rendered inside User's <router-view>
          // when /user/:id/posts is matched
          path: 'fuel-station',
          component: AdminFuelStationView,
        },
      ],
    }
  ]
})

export default router
