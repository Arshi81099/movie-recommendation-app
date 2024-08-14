import Vue from 'vue'
import VueRouter from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import {isAdmin} from './protectRoutes'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'LandingPage',
      component: LandingPage
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../components/RegisterForm.vue')
    },
    {
      path: '/movies',
      name: 'allmovies',
      component: () => import('../components/AllMovies.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../components/LoginForm.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../components/AdminDashboard.vue'),
      beforeEnter : isAdmin,
    },
    {
      path: '/moviedetails/:showId',
      name: 'moviedetails',
      component: () => import('../components/MovieDetails.vue')
    },
    {
      path: '/movielist',
      name: 'movielist',
      component: () => import('../components/MovieList.vue')
    },
    {
      path: '/userhistory',
      name: 'userhistory',
      component: () => import('../components/UserHistory.vue')
    },
    {
      path: '/moviemanagement',
      name: 'moviemanagement',
      component: () => import('../components/MovieManagement.vue')
    },
    {
      path: '/showtimemanagement',
      name: 'showtimemanagement',
      component: () => import('../components/ShowtimeManagement.vue')

    },
    {
      path: '/searchpage',
      name: 'searchpage',
      component: () => import('../components/SearchPage.vue')

    },
    {
      path: '/theatres/:theatreCode',
      name: 'theatres',
      component: () => import('../components/TheatreDetails.vue')
    },
    {
      path: '/theatremanagement',
      name: 'theatremanagement',
      component: () => import('../components/TheatreManagement.vue')
    },
    {
      path: '/theatreadd',
      name: 'theatreadd',
      component: () => import('../components/TheatreAdd.vue'),     
      beforeEnter : isAdmin,
    },
    {
      path: '/showedit/:showId',
      name: 'showedit',
      component: () => import('../components/ShowEdit.vue'),
      beforeEnter : isAdmin,
    },
    {
      path: '/showadd',
      name: 'showadd',
      component: () => import('../components/ShowAdd.vue'),
      beforeEnter : isAdmin,
    },
    {
      path: '/theatreedit/:theatreCode',
      name: 'theatreedit',
      component: () => import('../components/TheatreEdit.vue'),
      beforeEnter : isAdmin,
    },

    {
      path: '/userdashboard',
      name: 'userdashboard',
      component: () => import('../components/UserDashboard.vue')
    },
    {
      path: '/bookshow/:showId',
      name: 'bookshow',
      component: () => import('../components/BookShow.vue')
    }
  ]
})

export default router
