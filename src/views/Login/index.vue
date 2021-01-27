<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar ref="tabbar" title="登录"/>
    <!-- 表单 -->
    <van-form @submit="onSubmit">
    <van-field
      required
      v-model="mobile"
      label="手机号"
      placeholder="请输入手机号"
      :rules="rules.mobile"
    />
    <van-field
      required
      v-model="code"
      label="验证码"
      placeholder="请输入验证码"
      :rules="rules.code"
    />
    <div style="margin: 16px;">
      <van-button
        round block
        type="info"
        :loading='loading'
        loading-text="登录中..."
        :disabled="loading"
        :color="mainColor"
        native-type="submit"
      >登录</van-button>
    </div>
</van-form>
  </div>
</template>

<script>
import { getLoad } from '@/api/user'
export default {
  name: 'Login',
  data () {
    return {
      mainColor: this.themeColor.mainColor,
      loading: false,
      mobile: '13987654321',
      code: '246810',
      // 表单验证的规则
      rules: {
        mobile: [
          { required: true, message: '手机号不能为空' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
        ],
        code: [
          { required: true, message: '手机号不能为空' },
          { pattern: /^\d{6}$/, message: '验证码格式不正确' }
        ]
      }
    }
  },
  methods: {
    // 提交表单的数据
    async onSubmit () {
      // 用于判定是否为发送请求的状态,控制按钮的disabled状态,节流阀思想
      this.loading = true
      try {
        // 发送登录请求
        const res = await getLoad(this.mobile, this.code)
        // 将返回的token保存到vuex和localStorage中
        // console.log(res)
        this.$store.commit('addToken', res.data)
        // 登录成功提示,成功
        this.$toast({ message: '登陆成功', position: 'bottom' })
        // 登陆成功跳转到先前页
        const back = this.$route.query.back || '/'
        // console.log(back)
        this.$router.push(back)
      } catch {
        // 发送请求会存在错误信息,利用try|catch判断成功失败,并返回提示信息
        this.$toast({ message: '登陆失败', position: 'bottom' })
      }
      // 当请求完成后重置节流阀
      this.loading = false
    }
  }
}
</script>

<style>

</style>
