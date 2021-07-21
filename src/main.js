import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './quasar'
import firebaseInstance from './middleware/firebase'
import Croppa from 'vue-croppa';
Vue.use(Croppa);
import store from './store'
import notify from 'vue-notification'

Vue.config.productionTip = false
firebaseInstance.firebase.auth().onAuthStateChanged((user )=>{
  window.user=user;
  new Vue({
    notify,
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
})

