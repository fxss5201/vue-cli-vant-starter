'use strict'

import Vue from 'vue'
import axios from 'axios'
import store from './../store'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
}

const _axios = axios.create(config)
_axios.CancelToken = axios.CancelToken
_axios.isCancel = axios.isCancel
_axios.all = axios.all

let pageAxiosList = new Set() // 用于解决同时请求多个 service 接口时，必须等最慢的接口返回数据之后再关闭 loading
let axiosSource // 需要最新的链接的保存参数的地方

_axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    if (config.showLoading && !pageAxiosList.size) {
      Vue.prototype.$toast.loading({
        duration: 0,
        mask: true,
        forbidClick: true,
        message: '加载中...',
        loadingType: 'spinner'
      })
    }
    // 检查 pageAxiosList 里面是否有已经发送相同接口 url ，如果有的话直接取消发送
    if (config.needLast) {
      // 请求链接需要最新的
      const CancelToken = Vue.axios.CancelToken
      axiosSource && axiosSource.cancel && axiosSource.cancel()
      axiosSource = CancelToken.source()
      config.cancelToken = axiosSource.token
    } else if (config.needAll) {
      // console.log("needAll");
    } else {
      if (pageAxiosList.has(config.url)) {
        return Promise.reject(new Error('alreadySent'))
      }
      pageAxiosList.add(config.url)
      config.cancelToken = store.state.source.token
    }
    return config
  },
  function (error) {
    // Do something with request error
    Vue.prototype.$toast('网络出错，请重试')
    return Promise.reject(error)
  }
)

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    let nowUrl = response.config.url
    if (pageAxiosList.has(nowUrl)) {
      pageAxiosList.delete(nowUrl)
    }
    if (response.config.showLoading && !pageAxiosList.size) {
      Vue.prototype.$toast.clear()
    }
    if (response.data.isok) {
      return response.data
    } else {
      Vue.prototype.$toast('网络出错，请重试')
    }
    return response
  },
  function (error) {
    // Do something with response error
    if (_axios.isCancel(error)) {
      // 判断是否是切换路由导致的取消，如果是的话还需要将 pageAxiosList 清空
      for (let item of pageAxiosList.keys()) {
        pageAxiosList.delete(item)
      }
      Vue.prototype.$toast.clear()
    } else if (error.message === 'alreadySent') {
      console.log('alreadySent')
    } else {
      Vue.prototype.$toast('网络出错，请重试')
    }
    return Promise.reject(error)
  }
)

Plugin.install = function (Vue, options) {
  Vue.axios = _axios
  window.axios = _axios
  Object.defineProperties(Vue.prototype, {
    axios: {
      get () {
        return _axios
      }
    },
    $axios: {
      get () {
        return _axios
      }
    }
  })
}

Vue.use(Plugin)

export default Plugin
