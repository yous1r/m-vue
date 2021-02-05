<template >
  <!--下拉刷新新数据-->
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh" :disabled="isReporting">
    <!--上滑加载数据-->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell v-for="item in list" :key="item.art_id.toString()" :title="item.title">
        <!-- 通过具名插槽引入下方的自定义列表 -->
        <template #label>
          <!--使用宫格布局,并设置无边框-->
          <van-grid :border="false" :column-num="item.cover.images.length">
            <van-grid-item v-if="item.cover.images.length > 0">
              <!--图片懒加载-->
              <van-image fit="cover"
                         :height="item.cover.images.length === 1 ? '6rem' : '2.3rem'"
                         :src="item.cover.images[0] || ''"
                         lazy-load
              />
            </van-grid-item >
            <van-grid-item v-if="item.cover.images.length > 1">
              <van-image fit="cover" height="2.3rem"
                         :src="item.cover.images[1]"
                         lazy-load
              />
            </van-grid-item >
            <van-grid-item v-if="item.cover.images.length > 1">
              <van-image fit="cover" height="2.3rem"
                         :src="item.cover.images[2]"
                         lazy-load
              />
            </van-grid-item >
          </van-grid >
          <!-- 自定义下方的评论 -->
          <div class="label">
            <span >{{ item.aut_name }}</span >
            <span >{{ item.comm_count }}评论</span >
            <span >{{ item.pubdate | relatevieTime }}</span >
            <!-- 举报按钮 -->
            <van-icon :class="{'hidden': !($store.state.token && $store.state.token.token)}" name="cross" @click="showReport(item.art_id)" />
          </div >
          <!--举报层-->
          <van-popup v-model="isReporting">
            <!--一级菜单-->
            <van-cell-group v-if="isTop" >
              <van-cell value="不感兴趣" @click="dislike"/>
              <van-cell value="反馈垃圾内容" is-link @click="isTop = false" />
              <van-cell value="拉黑作者" />
            </van-cell-group>
            <!--二级菜单-->
            <van-cell-group v-else>
              <van-cell icon="arrow-left" value="返回" @click="isTop = true"/>
              <van-cell v-for="(v,index) in reportList" :key="index" @click="reportArticle(v.type)">{{ v.title }}</van-cell>
            </van-cell-group>

          </van-popup >
        </template >
      </van-cell >
    </van-list >

  </van-pull-refresh >
</template >

<script >
import { getDefaultArticles } from '@/api/home/article'

export default {
  name: 'Article',
  props: {
    channelId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      time: null,
      refreshing: false,
      isReporting: false,
      isTop: true,
      articleId: null,
      // 举报的列表，便于维护
      reportList: [
        { type: 0, title: '其他问题' },
        { type: 1, title: '标题夸张' },
        { type: 2, title: '低俗色情' },
        { type: 3, title: '错别字多' },
        { type: 4, title: '旧闻重复' },
        { type: 5, title: '内容不实' },
        { type: 6, title: '广告软文' },
        { type: 7, title: '涉嫌违法犯罪' },
        { type: 8, title: '侵权' }
      ]
    }
  },
  methods: {
    // 上滑加载数据
    async onLoad () {
      // 发送请求获取数据,需要提交,频道Id,判断是否有时间数据,
      // 如果有的话,将返回回来的上次时间戳存起来,如果没有的话,直接是当前时间,
      // 通过获取的列表的长度,默认为10,如果 < 10,说明无数据了
      const res = await getDefaultArticles(this.channelId, this.time || Date.now())
      const {
        results,
        pre_timestamp: time
      } = res.data
      this.list = [...this.list, ...results]
      // 存储上次的时间戳
      this.time = time
      this.loading = false
      // 如果返回的长度< 10， 就是没有数据了
      if (results.length < 10) {
        this.finished = true
      }
    },
    // 下拉刷新数据
    async onRefresh () {
      // 清空列表数据
      this.finished = false
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
      const res = await getDefaultArticles(this.channelId, Date.now())
      const {
        results,
        pre_timestamp: time
      } = res.data
      this.list = [...results]
      this.time = time
      this.refreshing = false
      this.loading = false
    },
    showReport (id) {
      this.isReporting = true
      this.articleId = id.toString()
    },
    // 不喜欢文章
    dislike () {
      this.list = this.list.filter(item => item.art_id.toString() !== this.articleId)
      // this.list.filter(item => console.log(item.art_id.toString()))
      this.$store.dispatch('dislikeArticle', this.articleId)
      this.isReporting = false
    },
    // 举报文章
    reportArticle (type) {
      // console.log(target)
      this.list = this.list.filter(item => item.art_id.toString() !== this.articleId)
      this.$store.dispatch('reportArticle', { target: this.articleId, type })
      this.isReporting = false
      this.isTop = true
    }
  }
}
</script >

<style lang="less" scoped>
.van-pull-refresh {
  height: 100%;

  .van-pull-refresh__track > .van-list > .van-cell {
    display: flex;
    flex-direction: column;
    .van-cell__title {
      > span {
        font-size: 16px;
      }
    }
    //设置请求回的图片样式
    .van-image {
      width: 100%;
      ::v-deep {
        .van-image__img {
          width: 100%;
        }
      }
    }
  }
  .label {
    .van-icon-cross {
      float: right;
      padding-right: 0.2rem;

    }
    //下方评论模块间距
    & > span {
      padding-right: 10px;
    }
  }
  //举报层的样式配置
  .van-cell__label {
    ::v-deep {
      .van-overlay {
        background-color: rgba(6,6,6,0.1);
      }
    }
    .van-popup {
      width: 60%;
      padding: 10px;
    }
  }
}
//用于切换一、二级举报层的隐显
.hidden {
  display: none;
}
</style >
