import Vue from 'vue'
import Vuex from 'vuex'
import { Dialog, Notify } from 'vant'
import router from '@/router'
import { getUserInfo, updateInfo } from '@/api/user'

// 导入localStorage中的方法
/**
 *  为什么不使用localStorage进行数据读取操作?
 *  1. 因为localStorage中的数据是死的,做到实时刷新
 *  2. 使用vuex代替localStorage是解决实时刷新的问题,但是又带来了新的问题
 *     无法存储数据,因为vuex的数据是存储在内存中的,一旦刷新页面数据也会消失
 *  3. 解决办法: 操作token的同时,同时带上localStorage,而数据通过localStorage.getItem获取
 * */

import { getToken, addToken, removeToken } from '@/utils/token'
// import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  // 仅开发环境下开启严格模式
  strict: process.env.NODE_ENV === 'development',
  state: {
    // 将token保存到state中便于响应式
    token: getToken(),
    userInfo: {}
  },
  mutations: {
    // 添加token,同时在localStorage中存储一份
    addToken (state, token) {
      state.token = token
      addToken(token)
    },
    // 移除token时将vuex中的token置空
    removeToken (state) {
      state.token = null
      // 移除localStorage中的token
      removeToken()
      state.userInfo = {}
      router.push('/login')
    },
    // 获取用户信息
    getUserInfo (state, info) {
      state.userInfo = info
      // console.log(state.userInfo)
    },
    // 更新用户昵称
    updateNickname (state, nickname) {
      state.userInfo.name = nickname
    },
    // 更新用户性别
    updateGender (state, gender) {
      state.userInfo.gender = gender
    },
    // 更新生日
    updateDate (state, birthday) {
      state.userInfo.birthday = birthday
    }

  },
  actions: {
    // 移除token
    async removeToken (store) {
      try {
        // 弹出确认退出提示
        await Dialog.confirm({
          title: '提示',
          message: '确认退出码?'
        })
        store.commit('removeToken')
      } catch {
      }
    },
    // 获取用户信息
    async getUserInfo (store) {
      try {
        const res = await getUserInfo()
        store.commit('getUserInfo', res.data)
      } catch {
      }
    },
    // 更新用户昵称
    async updateNickname (store, name) {
      // 如果值相等不发请求
      if (store.state.userInfo.name === name) return
      store.commit('updateNickname', name)
      // 发送请求更改用户名
      try {
        updateInfo({ name })
        Notify({
          type: 'success',
          message: '更新成功',
          duration: 1000
        })
      } catch {
        Notify({
          type: 'danger',
          message: '更新失败',
          duration: 1000
        })
      }
    },
    // 更改用户性别
    async updateGender (store, gender) {
      // 如果值相等不发请求
      if (store.state.userInfo.gender === gender) return
      store.commit('updateGender', gender)
      // 发送请求更改性别
      try {
        updateInfo({ gender })
        Notify({
          type: 'success',
          message: '更新成功',
          duration: 1000
        })
      } catch {
        Notify({
          type: 'danger',
          message: '更新失败',
          duration: 1000
        })
      }
    },
    async updateDate (store, birthday) {
      // 如果值相等不发请求
      if (store.state.userInfo.birthday === birthday) return
      store.commit('updateDate', birthday)
      // 发送请求更改性别
      try {
        updateInfo({ birthday })
        Notify({
          type: 'success',
          message: '更新成功',
          duration: 1000
        })
      } catch {
        Notify({
          type: 'danger',
          message: '更新失败',
          duration: 1000
        })
      }
    }
  },
  modules: {
  }
})
