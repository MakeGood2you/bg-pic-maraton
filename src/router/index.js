import Vue from 'vue'
import VueRouter from 'vue-router'
import Register from "../views/Register";

Vue.use(VueRouter)

const routes = [

  {
    path: '/:uid/:eid',
    name: 'Register',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Register

  },

  {
    path: '/pictureAdded/:uid/:eid/:phone/:fullName',
    name: 'pictureAdded',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/pictureAdded.vue'),

  },

]

const router = new VueRouter({
  routes
})

export default router
