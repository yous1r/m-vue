import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/app/',
  timeout: 3000
})

export default instance
