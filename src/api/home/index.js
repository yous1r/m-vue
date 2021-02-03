import axios from '@/utils/request'

// 获取所有频道列表
export function getAllChannels () {
  return axios({
    method: 'get',
    url: '/v1_0/channels'
  })
}
// 获取当前用户频道列表
export function getUserChannels () {
  return axios({
    method: 'get',
    url: '/v1_0/user/channels'
  })
}
// 获取推荐文章列表
export function getDefaultArticles (id, timestamp) {
  return axios({
    method: 'get',
    url: '/v1_1/articles',
    params: {
      channel_id: id,
      timestamp,
      with_top: 1
    }
  })
}
// 对文章不喜欢
export function dislikeArticle (id) {
  return axios({
    method: 'post',
    url: 'v1_0/article/dislikes',
    data: { target: id }
  })
}
// 举报文章
export function getReportArticles (id, type, des = null) {
  return axios({
    method: 'post',
    url: 'v1_0/article/reports',
    data: {
      target: id,
      type,
      remark: des
    }
  })
}
// 删除频道
export function delChannel (id, seq) {
  return axios({
    method: 'patch',
    url: 'v1_0/user/channels',
    data: { channels: [id, seq] }
  })
}
// 添加频道
export function addChannel (id, seq) {
  return axios({
    method: 'post',
    url: 'v1_0/user/channels',
    data: { addChannel: [id, seq] }
  })
}
