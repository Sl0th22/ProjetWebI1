import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/components/Welcome'
import Players from '@/components/Players'
import Match from '@/components/Match'  
import Team from '@/components/Team'  
import Login from '@/components/Login'
import Toornament from '@/components/Toornament'
Vue.use(Router)

export default new Router({
  routes: [

    {
      path: '/',      
      name: 'Welcome',       
      component: Welcome 
    },


    {
      path: '/Players',
      name: 'Players',
      component: Players
    },
    {
      path: '/match',      
      name: 'Match',       
      component: Match   
    },
    {
      path: '/team',      
      name: 'Team',       
      component: Team   
    },

    {
      path:'/login',
      name: 'Login',
      component : Login
    },

    {
      path:'/toornament',
      name:'Toornament',
      component : Toornament
    }
  ]
})