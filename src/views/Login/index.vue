<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar title="登录"/>
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
        native-type="submit"
      >登录</van-button>
    </div>
</van-form>
  </div>
</template>

<script>
import { getUser } from '@/api/user'
export default {
  name: 'Login',
  data () {
    return {
      mobile: '13987654321',
      code: '246810',
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
      try {
        const res = await getUser(this.mobile, this.code)
        this.$store.commit('addToken', JSON.stringify(res.data.data))
        this.$toast({ message: '登陆成功', position: 'bottom' })
        this.$router.push('/')
      } catch {
        this.$toast({ message: '登陆失败', position: 'bottom' })
      }
    }
  }
}
</script>

<style>

</style>
