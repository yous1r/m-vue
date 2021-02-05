<template>
  <div id="home">
    <!-- 导航区域 -->
    <van-nav-bar class="navbar">
      <template #left>
        <div class="logo"></div>
      </template>
      <template #right>
        <van-button round>
          <van-icon name="search" size="18" color="#fff"/>搜索
        </van-button>
      </template>
    </van-nav-bar>
    <!-- tab栏切换频道 -->
    <van-tabs v-model="active">
      <van-tab :title="item.name" v-for="item in channelList" :key="item.id">
        <!-- 文章列表组件 -->
        <Article :channelId="item.id"/>
      </van-tab>
      <!--频道列表 展开按钮-->
      <div class="channel_list" @click="show = true" >
        <van-icon name="wap-nav" />
      </div>
      <!--频道弹出层-->
      <van-action-sheet
        v-model="show"
        title="频道管理"
      >
        <!--频道列表组件-->
        <!--双向绑定高亮的下标-->
        <ChannelList v-model="active" @close="show = false"></ChannelList>
      </van-action-sheet>
    </van-tabs>
  </div>
</template>

<script>
import { getChannelList } from '@/utils/storage'
import { mapState } from 'vuex'
import Article from './Article'
import ChannelList from './ChannelList'
export default {
  name: 'Home',
  data () {
    return {
      // 用于标记选中的频道项
      active: 0,
      // 控制频道管理界面的显示、隐藏
      show: false
    }
  },
  computed: {
    // 接收vuex中的token来判断是否已经登陆
    ...mapState(['channelList', 'token'])
  },
  components: { Article, ChannelList },
  // 获取频道列表
  async created () {
    // 1. 判断是否有token,有token的话,发送请求获取当前用户频道并退出,没有执行下一步
    // 2. 判断localStorage中是否有channelList,有的话直接读取,没有的话发送请求获取默认的推荐频道
    if (this.token?.token) {
    // 有
      await this.$store.dispatch('getChannels')
    } else {
      // 1. 定义一个变量接收localStorage中的CHANNEL_LIST
      const channels = getChannelList()
      if (channels) {
      // 2. 通过判断存在与否,存在的话将该值赋值给vuex,用于响应式
        this.$store.commit('setChannels', channels)
      } else {
      // 3. 不存在的话,再去发送ajax请求获取默认频道列表
        this.$store.dispatch('getChannels')
      }
    }
  }
}
</script>

<style lang="less" scoped>
//设置视口100vh,适配每一个设备
#home {
  height: 100vh;
  padding-top: 46px;
  padding-bottom: 50px;
  overflow: hidden;
  //固定导航栏
  .navbar {
    width: 100%;
    position: fixed;
    top: 0;
    z-index: 999;
  }
  .van-tabs--line {
    height: 100%;
    padding-top: 56px;
    // padding-bottom: 50px;
  }
  //设置频道列表固定定位
  ::v-deep {
    .van-tabs__wrap {
      position: fixed;
      left: 0;
      right: 30px;
      top: 46px;
      .van-tab[role='tab'] {
        flex: 1 0 auto;
      }
    }
    .van-tabs__content {
      height: 100%;
      .van-tab__pane {
        height: 100%;
      }
      //将滚动条设置到对应模块内容上，避免共用滚动条
      //将垂直滚动条隐藏，设置各自滚动的关键
      .van-list {
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        padding-right: 10px;
        margin-right: -10px;
      }
    }
    .van-tab {
      padding: 0 18px;
    }
    .van-tabs__line {
      padding: 0 15px;
    }
  }
}
.logo {
  height: 30px;
  width: 100px;
  background: url(~@/assets/logo.png) no-repeat center / cover;
}
.van-button {
  height: 30px;
  color: #fff;
  background-color: #69f;
  border: none;
  .van-icon-search {
    vertical-align: middle;
    padding-right: 15px;
  }
}
.channel_list {
  position: fixed;
  top: 46px;
  right: 0;
  width: 30px;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  z-index: 999
}
.content {
  padding: 10px 10px 20px;
}
</style>
