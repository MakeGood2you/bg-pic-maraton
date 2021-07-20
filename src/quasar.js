import Vue from 'vue'

import './styles/quasar.scss'
import '@quasar/extras/material-icons/material-icons.css'
import { Quasar , Loading} from 'quasar'

Vue.use(Quasar, {

  plugins: {
      Loading
  },
    config: {
      loading:{}
    },
 })

/*
data/businessInfo
 */