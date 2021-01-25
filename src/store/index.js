import Vue from 'vue'
import Vuex from 'vuex'

// 导入localStorage中的方法
/**
 *  为什么不使用localStorage进行数据读取操作?
 *  1. 因为localStorage中的数据是死的,做到实时刷新
 *  2. 使用vuex代替localStorage是解决实时刷新的问题,但是又带来了新的问题
 *     无法存储数据,因为vuex的数据是存储在内存中的,一旦刷新页面数据也会消失
 *  3. 解决办法: 操作token的同时,同时带上localStorage,而数据通过localStorage.getItem获取
 * */

import { addToken, removeToken } from '@/utils/token'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV === 'development',
  state: {
    token: JSON.parse(localStorage.getItem('token'))
  },
  mutations: {
    addToken (state, token) {
      state.token = token
      try {
        addToken(token)
      } catch {
        console.log('写入token失败')
      }
    },
    // 移除token时将vuex中的token置空
    removeToken (state) {
      state.token = null
      // 移除localStorage中的token
      removeToken()
    }
  },
  actions: {
  },
  modules: {
  }
})
