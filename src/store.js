import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)
const CancelToken = axios.CancelToken

export default new Vuex.Store({
  state: {
    source: CancelToken.source()
  },
  mutations: {
    setSource (state, obj) {
      // 路由切换新建新建取消令牌，并写入store
      state.source = obj
    }
  },
  actions: {

  }
})
