import store from '@/store'
import axios from 'axios'
import router from '../router'
// import { Toast } from 'vant'

const baseURL = 'http://toutiao-app.itheima.net'
const instance = axios.create({
  // baseURL: 'http://ttapi.research.itcast.cn',
  baseURL,
  timeout: 3000
  // Authorization: 'Bearer ' + state.token
})
// 请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // 添加请求头,带上token
    // console.log(config)
    config.headers.Authorization = 'Bearer ' + store.state.token?.token
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 定义请求失败的处理函数
function goLogin () {
  store.commit('removeToken')
  router.push({
    path: '/login',
    query: {
      back: router.currentRoute.path
    }
  })
}
// 响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    // 1. 拿到错误的请求,判读请求内有refresh_token,如果有就执行请求刷新token,没有就返回原错误
    return response.data
  },
  async function (error) {
    const { response, config } = error
    // 判断是否为401,如果是说明就是token过期了,否则清除token返回跳转login
    // console.log(store)
    console.log(response.status)
    if (response.status === 401) {
      // 判断refresh_token是否存在,存在就拿这个去请求新token,不存在清除token直接退出返回login
      const refreshToken = store.state.token.refresh_token
      if (refreshToken) {
        try {
          // 发送请求获取新的token
          const res = await axios({
            method: 'put',
            url: baseURL + '/v1_0/authorizations',
            headers: {
              Authorization: 'Bearer ' + refreshToken
            }
          })
          // console.log(res)
          const { token } = res.data.data
          store.commit('addToken', {
            token,
            refresh_token: refreshToken
          })
          return instance(config)
        } catch {
          goLogin()
        }
        store.commit('removeToken')
      } else {
        return Promise.reject(error)
      }
    } else {
      return Promise.reject(error)
    }
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)
export default instance
