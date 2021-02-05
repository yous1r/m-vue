import axios from '@/utils/request'

// 文章模块
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
