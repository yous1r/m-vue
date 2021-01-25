import axios from 'axios'

const instance = axios.create({
  // baseURL: 'http://ttapi.research.itcast.cn',
  baseURL: 'http://toutiao-app.itheima.net/',
  timeout: 3000
})

export default instance
