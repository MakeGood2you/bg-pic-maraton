import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './quasar'
import firebaseInstance from './middleware/firebase'
import Croppa from 'vue-croppa';
Vue.use(Croppa);

Vue.config.productionTip = false
firebaseInstance.firebase.auth().onAuthStateChanged((user )=>{
  window.user=user;
  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
})

