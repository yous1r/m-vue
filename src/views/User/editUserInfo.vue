<template>
  <div>
    <van-nav-bar
      title="编辑资料"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <!-- 文件域 -->
    <div class="img">
      <van-uploader :after-read="readFile"/>
      <van-image
        width="100px"
        height="100px"
        round
        fit="cover"
        :src="userInfo.photo"
      />
    </div>
    <van-cell title="昵称" :value="userInfo.name" is-link @click="showName"/>
    <van-cell title="性别" :value="userInfo.gender === 0 ? '男' : '女'" is-link @click="isShowGender = true"/>
    <van-cell title="生日" :value="userInfo.birthday" is-link @click="showBirthday"/>
    <!-- 编辑昵称弹出层 -->
    <van-dialog v-model="isShowName"  title="修改昵称" isShowBirthday-cancel-button @confirm="updateNickname">
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
    <!-- 裁剪框 -->
    <vueCropper
      v-if="isShowCropper"
      :img='avatar'
      autoCrop
      autoCropWidth=140
      autoCropHeight=140
      fixed
      centerBox
      ref="cropper"
    >
    </vueCropper>
    <van-button class="left" v-if="isShowCropper" type="primary" @click="cutAvatar">裁剪</van-button>
    <van-button class="right" v-if="isShowCropper" type="primary" @click="isShowCropper = false">取消</van-button>
  </div>

</template>

<script>
import { VueCropper } from 'vue-cropper'
import moment from 'moment'
export default {
  name: 'editInfo',
  components: {
    VueCropper
  },
  data () {
    return {
      // 控制弹出层的显示状态
      isShowName: false,
      isShowGender: false,
      isShowBirthday: false,
      isShowCropper: false,
      // 接收昵称,用于双向绑定,接受修改的值
      nickName: '',
      // 根据vant组件需要提供的Date数据, currentDate用于双向绑定
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(Date.now()),
      currentDate: new Date(),
      avatar: ''
    }
  },
  computed: {
    userInfo () {
      // 从vuex获取用户数据
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
    // 切换编辑生日弹窗
    showBirthday () {
      // 点击后将显示状态置为true
      this.isShowBirthday = true
      this.currentDate = new Date(this.userInfo.birthday)
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
    updateDate (date) {
      this.$store.dispatch('updateDate', moment(date).format('YYYY-MM-DD'))
      this.isShowBirthday = false
    },
    readFile (file) {
      this.isShowCropper = true
      this.avatar = file.content
    },
    // 更新用户信息
    async cutAvatar () {
      // 调用方法获取裁剪好的图片
      // 因为是图片所有只能使用FormData方法进行上传
      this.$refs.cropper.getCropBlob((data) => {
        const fd = new FormData()
        // 以键值对的方式插入
        fd.append('photo', data)
        // 触发更换头像的请求
        this.$store.dispatch('changeAvatar', fd)
      })
      // 最后关闭弹出层
      this.isShowCropper = false
    }
  },
  created () {
    // 刷新页面store重新获取数据
    this.$store.dispatch('getUserInfo')
  }
}
</script>

<style lang="less" scoped>
.img {
  position: relative;
  text-align: center;
  padding: 20px;
  .van-uploader {
    opacity: 0;
  position: absolute;
  left: 50%;
  top: 50%;
  width: 134px;
  height: 134px;
  transform: translate(-50%, -50%);
  z-index: 1;
  ::v-deep {
    .van-uploader__upload {
      margin: 0;
      .van-uploader__input {
        width: 134px;
        height: 134px;
      }
    }
  }
}
}
::v-deep {
  .van-dialog__content {
    padding: 10px;
  }
  .van-field {
    border: 1px solid #ccc;
  }
}
.vue-cropper {
  position: absolute;
  left: 0;
  top: 0;
  height: 100vh;
  z-index: 999;
}
.left {
  position: absolute;
    left: 0;
    bottom: 0;
    z-index: 1000;
  }
.right {
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 1000;
}
</style>
