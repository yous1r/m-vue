import axios from '@/utils/request'

export function getUser (mobile, code) {
  return axios({
    url: '/v1_0/authorizations',
    method: 'post',
    data: { mobile, code }
  })
}
