<template>
  <div>
    <h1>你访问的网页不存在</h1>
    <div class="container">
      <a href="#/">返回首页</a>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  }
}
</script>
<style lang="less" scoped>
.container {
  padding: 0 40px;
  text-align: center;
  a {
    display: inline-block;
    color: #fff;
    // text-align: center;
    padding: 4px 20px;
    border: 1px solid #ccc;
    border-radius: 3px;
    background-color: pink;
  }
}
</style>
