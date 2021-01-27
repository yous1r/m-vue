import Vue from 'vue'
import Vuex from 'vuex'
import { Dialog } from 'vant'
import router from '@/router'

// 导入localStorage中的方法
/**
 *  为什么不使用localStorage进行数据读取操作?
 *  1. 因为localStorage中的数据是死的,做到实时刷新
 *  2. 使用vuex代替localStorage是解决实时刷新的问题,但是又带来了新的问题
 *     无法存储数据,因为vuex的数据是存储在内存中的,一旦刷新页面数据也会消失
 *  3. 解决办法: 操作token的同时,同时带上localStorage,而数据通过localStorage.getItem获取
 * */

import { getToken, addToken, removeToken } from '@/utils/token'

Vue.use(Vuex)

export default new Vuex.Store({
  // 开发环境下开启严格模式
  strict: process.env.NODE_ENV === 'development',
  state: {
    // 将token保存到state中便于响应式
    token: getToken()
  },
  mutations: {
    // 添加token,同时在localStorage中存储一份
    addToken (state, token) {
      // console.log(token)
      state.token = token
      addToken(token)
    },
    // 移除token时将vuex中的token置空
    removeToken (state) {
      // console.log(this.$dialog)
      state.token = null
      // 移除localStorage中的token
      removeToken()
      router.push('/login')
    }
  },
  actions: {
    async removeToken (state) {
      try {
        // 弹出确认框
        await Dialog.confirm({
          title: '提示',
          message: '确认退出码?'
        })
      } catch {
        return
      }
      // console.log(this.store)
      state.commit('removeToken')
    }
  },
  modules: {
  }
})
