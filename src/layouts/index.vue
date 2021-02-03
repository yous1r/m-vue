<template>
<div>
  <router-view></router-view>
  <van-tabbar class="tabbar" :active-color="mainColor" route >
    <van-tabbar-item to="/" icon="home-o" >首页</van-tabbar-item>
    <van-tabbar-item to="/qa" icon="chat-o">问答</van-tabbar-item>
    <van-tabbar-item to="/movie" icon="video-o">视频</van-tabbar-item>
    <van-tabbar-item to="/user" icon="user-o">个人中心</van-tabbar-item>
  </van-tabbar>
</div>

</template>

<script>
export default {
  name: 'Layout',
  data () {
    return {
      mainColor: this.themeColor.mainColor
      // active: 0
    }
  }
}
</script>

<style lang="less" scoped>
.tabbar {
  position: fixed;
  bottom: 0;
}
</style>
