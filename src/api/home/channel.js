import axios from '@/utils/request'

// 频道模块
// 获取所有频道列表
export function getAllChannels () {
  return axios({
    method: 'get',
    url: '/v1_0/channels'
  })
}
// 获取用户频道列表 ** 如果没有登陆获取默认推荐列表
export function getChannels () {
  return axios({
    method: 'get',
    url: '/v1_0/user/channels'
  })
}
// 删除频道
export function delChannel (id) {
  return axios({
    method: 'delete',
    url: 'v1_0/user/channels',
    data: { channels: id }
  })
}
// 添加频道
export function addChannel (channels) {
  return axios({
    method: 'patch',
    url: 'v1_0/user/channels',
    data: { channels }
  })
}
