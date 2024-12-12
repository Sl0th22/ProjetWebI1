import Vue from 'vue';
import Router from 'vue-router';
import Welcome from '@/components/Welcome';
import Players from '@/components/Players';
import Match from '@/components/Match';
import Team from '@/components/Team';
import Login from '@/components/Login';
import Toornament from '@/components/Toornament';
import AuthModule from '@/components/Login';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: Welcome,
    },
    {
      path: '/Players/:team_id',
      name: 'Players',
      component: Players,
    },
    {
      path: '/match',
      name: 'Match',
      component: Match,
      meta: { requiresAuth: true }, // protected route if not authenticated
    },
    {
      path: '/team',
      name: 'Team',
      component: Team,
      meta: { requiresAuth: true }, // protected route if not authenticated
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/toornament',
      name: 'Toornament',
      component: Toornament,
    },
    {
      path: '/auth',
      name: 'AuthenticationDemo',
      component: AuthModule,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('userRole') !== null; // Verify authentication

  if (to.meta.requiresAuth && !isAuthenticated) {
    // redirect to login if not authenticated
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } 
   else {
    next(); //block access to the route
  }
});



export default router;
