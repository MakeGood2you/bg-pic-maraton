import Vue from 'vue'
import VueRouter from 'vue-router'
import Register from "../views/Register";

Vue.use(VueRouter)

const routes = [
  {
    path: '/:uid/:eid',
    name: 'Register',
    component: Register
  },

  {
    path: '/pictureAdded/:uid/:eid/:phone/:fullName',
    name: 'pictureAdded',
    component: () => import( '../views/pictureAdded.vue'),

  },

]

const router = new VueRouter({
  routes
})

export default router
