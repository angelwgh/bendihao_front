// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import store from './store'

import 'bootstrap/dist/css/bootstrap.css'
import './assets/css/elementStyle/index.css'
import './assets/css/style.css'

Vue.config.productionTip = false
Vue.use(ElementUI);

/* eslint-disable no-new */
Vue.prototype.$axios = axios;
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
