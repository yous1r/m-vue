<template>
  <div id="user">
    <div class="header van-nav-bar">
      <div class="avarta">
        <van-image round :src="userInfo.photo" />
      </div>
      <div class="info">
        <span class="username">{{ userInfo.name }}</span>
        <span class="birthday">{{ userInfo.birthday }}</span>
      </div>
    </div>
    <ul class="container">
      <a class="item">
        <van-icon name="wap-home-o"></van-icon>
        <span style="font-size: 12px">我的作品</span>
      </a>
      <a class="item">
        <van-icon name="newspaper-o"></van-icon>
        <span style="font-size: 12px">我的收藏</span>
      </a>
      <a class="item">
        <van-icon name="down"></van-icon>
        <span style="font-size: 12px">阅读历史</span>
      </a>
    </ul>

    <div class="input-list">
      <van-cell-group>
          <van-cell title="编辑资料" icon="shop-o" to="/user/editInfo" is-link />
          <van-cell title="小志同学" icon="shop-o" is-link />
          <van-cell title="系统设置" icon="shop-o" is-link />
          <van-cell @click="logout" title="退出登录" icon="shop-o" is-link />
      </van-cell-group>
    </div>
  </div>
</template>

<script>
// 导入获取用户信息接口
// import { getUserInfo } from '@/api/user'
export default {
  name: 'User',
  data () {
    return {
      // userInfo: ''
    }
  },
  created () {
    // 获取用户信息
    // console.log(this.userInfo)
    this.$store.dispatch('getUserInfo')
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  methods: {
    // 退出
    logout () {
      this.$store.dispatch('removeToken')
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  padding: 20px;
  display: flex;
  //line-height: auto;
  .avarta {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-right: 10px;
    .van-image {
      display: block;
      height: 100%;
    }
  }
  .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 14px;
    color: #fff;
    .birthday {
      color: pink;
      padding: 0 4px;
      background-color: #fff;
      border-radius: 3px;
    }
  }
}
.container {
  display: flex;
  height: 80px;
  .item {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
