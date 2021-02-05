import Vue from 'vue'
import Vuex from 'vuex'
import { Dialog, Notify, Toast } from 'vant'
import router from '@/router'
import {
  getUserInfo,
  updateInfo,
  changeAvatar
} from '@/api/user'
import {
  dislikeArticle,
  getReportArticles
} from '@/api/home/article'
import {
  addChannel,
  delChannel,
  getAllChannels,
  getChannels
} from '@/api/home/channel'
/**
 *  为什么不使用localStorage进行数据读取操作?
 *  1. 因为localStorage中的数据是死的,做到实时刷新
 *  2. 使用vuex代替localStorage是解决实时刷新的问题,但是又带来了新的问题
 *     无法存储数据,因为vuex的数据是存储在内存中的,一旦刷新页面数据也会消失
 *  3. 解决办法: 操作token的同时,同时带上localStorage,而数据通过localStorage.getItem获取
 * */

import { getToken, addToken, removeToken, setChannelList, getChanneLlist } from '@/utils/storage'
// import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  // 仅开发环境下开启严格模式
  strict: process.env.NODE_ENV === 'development',
  state: {
    // 将token保存到state中便于响应式
    token: getToken(),
    userInfo: {},
    // 全部频道,主要用于计算可选频道
    allChannels: [],
    // 用于存放我的频道
    channelList: []
  },
  mutations: {
    // 添加token,同时在localStorage中存储一份
    addToken (state, token) {
      state.token = token
      addToken(token)
    },
    // 移除token时将vuex中的token置空
    removeToken (state) {
      state.token = {}
      // 移除localStorage中的token
      removeToken()
      state.userInfo = {}
      router.push('/login')
    },
    // 获取用户信息
    getUserInfo (state, info) {
      state.userInfo = info
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
    },
    // 更新用户头像
    changeAvatar (state, avatar) {
      state.userInfo.photo = avatar
    },
    // 设置频道
    setChannels (state, channels) {
      state.channelList = channels
    },
    // 获取全部频道列表
    getAllChannels (state, channels) {
      state.allChannels = channels
    },
    // 获取用户频道
    getChannels (state, channels) {
      state.channelList = channels
    },
    delChannel (state, id) {
      state.channelList = state.channelList.filter(item => item.id !== id)
      setChannelList(state.channelList)
    },
    addChannel (state, id) {
      const current = state.allChannels.filter(item => item.id === id)
      state.channelList.push(...current)
      setChannelList(state.channelList)
    }
  },
  actions: {
    // 移除token
    async removeToken ({ commit }) {
      try {
        const isTrue = await Dialog.confirm({
          title: '提示',
          message: '确认退出吗?'
        })
        if (isTrue) {
          // 弹出确认退出提示
          commit('removeToken')
          return Notify({
            type: 'success',
            message: '已退出',
            duration: 1000
          })
        }
      } catch {
        return Notify({
          type: 'warning',
          message: '已取消',
          duration: 1000
        })
      }
    },
    // 获取用户信息
    async getUserInfo ({ commit }) {
      try {
        const res = await getUserInfo()
        commit('getUserInfo', res.data)
      } catch {
        return Notify({
          type: 'danger',
          message: '获取用户信息失败',
          duration: 1000
        })
      }
    },
    // 更新用户昵称
    async updateNickname ({ commit, state }, name) {
      // 如果值相等不发请求
      if (state.userInfo.name === name) return
      // 发送请求更改用户名
      try {
        await updateInfo({ name })
        commit('updateNickname', name)
      } catch {
        return Notify({
          type: 'danger',
          message: '更新用户名失败',
          duration: 1000
        })
      }
      Notify({
        type: 'success',
        message: '更新成功',
        duration: 1000
      })
    },
    // 更新用户性别
    async updateGender ({ commit, state }, gender) {
    // 如果值相等不发请求
      if (state.userInfo.gender === gender) return
      commit('updateGender', gender)
      // 发送请求更改性别
      try {
        updateInfo({ gender })
      } catch {
        return Notify({
          type: 'danger',
          message: '更新失败',
          duration: 1000
        })
      }
      Notify({
        type: 'success',
        message: '更新成功',
        duration: 1000
      })
    },
    // 更新生日
    async updateDate ({ commit, state }, birthday) {
      // 如果值相等不发请求
      if (state.userInfo.birthday === birthday) return
      commit('updateDate', birthday)
      // 发送请求更改性别
      try {
        updateInfo({ birthday })
      } catch {
        return Notify({
          type: 'danger',
          message: '更新失败',
          duration: 1000
        })
      }
      Notify({
        type: 'success',
        message: '更新成功',
        duration: 1000
      })
    },
    // 更新用户头像
    async changeAvatar ({ commit }, avatar) {
      try {
        // 改变userInfo中的值
        const res = await changeAvatar(avatar)
        commit('changeAvatar', res.data.photo)
      } catch {
        return Notify({
          type: 'danger',
          message: '更新失败',
          duration: 1000
        })
      }
      Notify({
        type: 'success',
        message: '更新成功',
        duration: 1000
      })
    },
    // 不喜欢文章
    async dislikeArticle (store, id) {
      try {
        await dislikeArticle(id)
      } catch {
        return Toast.fail('屏蔽失败')
      }
      Toast.success('已屏蔽')
    },
    // 举报文章
    async reportArticle (store, { target, type }) {
      try {
        await getReportArticles(target, type)
      } catch {
        return Toast.fail('举报失败')
      }
      Toast.success('举报成功')
    },
    // 获取全部频道列表
    async getAllChannels ({ commit }) {
      const res = await getAllChannels()
      const { channels } = res.data
      commit('getAllChannels', channels)
      return channels
    },
    // 获取用户频道
    async getChannels ({ commit }) {
      const res = await getChannels()
      const channels = res.data.channels
      commit('getChannels', channels)
      return channels
    },
    // 删除频道
    async delChannel ({ commit }, id) {
      try {
        await delChannel(id)
        commit('delChannel', id)
      } catch {
        return Toast.fail('删除失败')
      }
    },
    // 添加频道
    async addChannel ({ commit }, channel) {
      try {
        await addChannel(channel)
        commit('addChannel', channel[0].id)
      } catch {
        return Toast.fail('添加失败')
      }
    }
  },
  // 计算属性,计算可选择的频道
  getters: {
    optionalChannels (state) {
      return state.allChannels.filter(item => !(state.channelList.some(v => item.id === v.id)))
    }
  },
  modules: {}
})
