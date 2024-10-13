import Vue from 'vue'
import Router from 'vue-router'
import Players from '@/components/Players'
import Match from '@/components/Match'  
import Team from '@/components/Team'  


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
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

  ]
})

