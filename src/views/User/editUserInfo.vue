<template>
  <div>
    <van-nav-bar
      title="编辑资料"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <div class="img">
      <van-image
        width="40%"
        round
        fit="cover"
        :src="userInfo.photo"
      />
    </div>
    <van-cell title="昵称" :value="userInfo.name" is-link @click="showName"/>
    <van-cell title="性别" :value="userInfo.gender === 0 ? '男' : '女'" is-link @click="showGender"/>
    <van-cell title="生日" :value="userInfo.birthday" is-link @click="showBirthday"/>
    <!-- 编辑昵称弹出层 -->
    <van-dialog v-model="isShowName"  title="修改昵称" show-cancel-button @confirm="updateNickname">
      <van-field v-model="nickName" ref="nickName" placeholder="请输入昵称" />
    </van-dialog>
    <!-- 编辑性别 -->
    <van-popup v-model="isShowGender" round position="bottom" >
      <van-nav-bar title="修改性别" right-text="取消" @click-right="isShowGender = false"/>
      <van-cell-group>
        <van-cell title="男" is-link @click="updateGender(0)"/>
        <van-cell title="女" is-link @click="updateGender(1)"/>
      </van-cell-group>
    </van-popup>
    <!-- 编辑生日 -->
    <van-popup v-model="isShowBirthday" round position="bottom" >
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择生日"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="isShowBirthday = false"
        @confirm="updateDate"
      />
    </van-popup>
  </div>

</template>

<script>
import moment from 'moment'
export default {
  name: 'editInfo',
  data () {
    return {
      // 控制弹出层的显示状态
      isShowName: false,
      isShowGender: false,
      isShowBirthday: false,
      // 接收昵称,用于双向绑定,接受修改的值
      nickName: '',
      // 根据vant组件需要提供的Date数据, currentDate用于双向绑定
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(Date.now()),
      currentDate: new Date(this.$store.state.userInfo.birthday)
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  methods: {
    // 切换编辑昵称弹出窗,并自动获取焦点
    async showName () {
      // 点击后将显示状态置为true
      this.isShowName = true
      this.nickName = this.userInfo.name
      await this.$nextTick()
      this.$refs.nickName.focus()
      // this.$store.commit()
    },
    // 切换编辑性别弹窗
    showGender () {
      // 点击后将显示状态置为true
      this.isShowGender = true
    },
    // 切换编辑生日弹窗
    showBirthday () {
      // 点击后将显示状态置为true
      this.isShowBirthday = true
    },
    // 更新昵称
    updateNickname () {
      // console.log(value)
      this.$store.dispatch('updateNickname', this.nickName)
      this.isShowName = false
    },
    // 更新性别
    updateGender (gender) {
      this.$store.dispatch('updateGender', gender)
      this.isShowGender = false
    },
    // 更新生日
    updateDate (value) {
      this.$store.dispatch('updateDate', moment(value).format('YYYY-MM-DD'))
      this.isShowBirthday = false
    }
  }
}
</script>

<style lang="less" scoped>
.img {
  text-align: center;
  padding: 20px;
}
::v-deep {
  .van-dialog__content {
    padding: 10px;
  }
  .van-field {
    border: 1px solid #ccc;
  }
}
</style>
