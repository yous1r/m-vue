import store from '@/store'
import axios from 'axios'
import router from '../router'
// 引入大数,因为js只能识别2**53的数字,用过json-bigint解析数据
// 因为axios底层用transformResponce方法将数据json.parse,使用大数解析覆盖
// 前后端数据的传递都是通过json格式的
import JSONbig from 'json-bigint'
import { Toast } from 'vant'

const baseURL = 'http://toutiao-app.itheima.net'
const instance = axios.create({
  // 备用
  // baseURL: 'http://ttapi.research.itcast.cn',
  baseURL,
  timeout: 3000,
  transformResponse: {
    function (data) {
      // 尝试使用大数解析
      try {
        return JSONbig.parse(data)
      } catch {
        // 解析出错返回元数据
        return data
      }
    }
  }
  // Authorization: 'Bearer ' + state.token
})
// 请求拦截器
instance.interceptors.request.use(
  function (config) {
    // console.dir(config)
    // 发送请求前判断是否有token, 有的话添加请求投, 没有的话直接发送请求
    // 添加请求头,带上token
    const token = store.state.token?.token
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    console.dir(error)
    Toast.fail('请求信息失效')
    return Promise.reject(error)
  }
)

// 定义请求失败的处理函数,清除token并跳转到login页面,在导航守卫中添加提示,请登录
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
    // console.log(response)
    // console.log(response.data.data.target)
    // response.data.data.target = response.data.data.target.toString()
    // 对响应数据做点什么
    // 1. 拿到错误的请求,判读请求内有refresh_token,如果有就执行请求刷新token,没有就返回原错误
    return response.data
  },
  async function (error) {
    console.dir(error)
    const { response, config } = error
    // 判断是否为401,如果是说明就是token过期了,否则清除token返回跳转login
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
          // 将新token替换原先的旧token,将配置重新发送
          const { token } = res.data.data
          store.commit('addToken', {
            token,
            refresh_token: refreshToken
          })
          return instance(config)
        } catch {
          Toast.fail('登录信息失效')
        }
        store.commit('removeToken')
      } else {
        // 没有refreshtoken就重新登陆
        goLogin()
        return Promise.reject(error)
      }
    }
    const msg = response.data.message
    if (response.status === 409 && msg === 'User name has existed') {
      // Toast.fail('用户名已存在')
      return Promise.reject(error)
    }
    // if (response.status === 409 && msg === 'User name has existed') {
    //   Toast.fail('用户名已存在')
    // }
    // goLogin()
    return Promise.reject(error)
  }
)
export default instance
