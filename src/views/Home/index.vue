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
      <van-tab :title="item.name" v-for="item in channels" :key="item.id">
        <!-- 文章列表组件 -->
        <Article :channelId="item.id"/>
      </van-tab>
      <!--频道列表 展开按钮-->
      <div class="channel_list" @click="showChannelList = true" >
        <van-icon name="wap-nav" />
        <!--频道列表组件-->
        <!--双向绑定高亮的下标-->
        <ChannelList :isShow="showChannelList" v-model="active" :userChannelList="channels"></ChannelList>
      </div>
    </van-tabs>
  </div>
</template>

<script>
import Article from './Article'
import ChannelList from './ChannelList'
export default {
  name: 'Home',
  data () {
    return {
      // 控制默认的显示与隐藏
      active: 0,
      // 存放频道列表,根据用户的登录状态以及是否有本地存储列表来渲染
      channels: [],
      // 控制频道列表编辑页面的展示与隐藏
      showChannelList: false
    }
  },
  components: { Article, ChannelList },
  // 获取频道列表
  async created () {
    // 如果有token从vuex中读取频道列表
    if (this.$store.state.token?.token) {
      this.channels = await this.$store.dispatch('getUserChannels')
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

</style>
