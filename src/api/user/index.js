import axios from '@/utils/request'
// 发送登录请求
export function getLoad (mobile, code) {
  // console.log(mobile, code)
  return axios({
    url: '/v1_0/authorizations',
    method: 'post',
    data: { mobile, code }
  })
}
// 获取用户信息
export function getUserInfo () {
  return axios({
    url: '/v1_0/user/profile',
    method: 'get'
  })
}

export function updateInfo (data) {
  return axios({
    url: '/v1_0/user/profile',
    method: 'patch',
    data
  })
}

export function changeAvatar (data) {
  return axios({
    url: '/v1_0/user/photo',
    method: 'patch',
    data
  })
}
