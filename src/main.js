import Vue from 'vue'
import './plugins/axios'
import 'amfe-flexible'
import { Toast } from 'vant'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.use(Toast)

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  Vue.prototype.$toast.clear()
  const CancelToken = Vue.axios.CancelToken
  store.state.source.cancel && store.state.source.cancel()
  store.commit('setSource', CancelToken.source())
  next()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
