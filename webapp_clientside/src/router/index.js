import Vue from 'vue'
import Router from 'vue-router'
import Players from '@/components/Players'
import Match from '@/components/Match'  

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
    }
  ]
})
