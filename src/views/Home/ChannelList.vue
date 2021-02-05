<template >
  <div class="channelList">
    <!--我的频道模块-->
    <div class="userChannelList">
      <van-nav-bar left-text="我的频道" :border="false">
        <template #right >
          <span class="edit" @click="editing = !editing">{{ editing ? '取消' : '编辑' }}</span>
        </template>
      </van-nav-bar>
      <!--我的频道列表-->
      <van-grid :column-num="4">
        <van-grid-item
          v-for="(item,index) in channelList"
          :key="index"
          @click.stop="changeChannel(index)"
          :class="{ select: index === value}"
        >{{ item.name }}
          <van-icon name="cross" v-if="editing && item.id !== 0"  @click.stop="del(item.id, index)"/>
        </van-grid-item>
      </van-grid>
    </div>
    <!--可选频道模块-->
    <div class="optionalChannelList">
      <van-nav-bar left-text="可选频道" :border="false">
      </van-nav-bar>
      <!--可选频道列表-->
      <van-grid :column-num="4">
        <van-grid-item
          v-for="item in optionalChannels"
          :key="item.id"
          @click="add(item.id)"
        >{{ item.name }}</van-grid-item>
      </van-grid>
    </div>
  </div>
</template >

<script >
// import { getDefaultChannels } from '@/api/home'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'ChannelList',
  props: ['value'],
  computed: {
    // 通过计算属性获取vuex中的值
    ...mapState(['channelList', 'token']),
    ...mapGetters(['optionalChannels'])
  },
  data () {
    return {
      editing: false
    }
  },
  methods: {
    // 通过组件v-model双向绑定active来实现切换频道,以及频道高亮
    changeChannel (index) {
      if (this.editing) return
      this.$emit('input', index)
      // 切换频道后关闭弹窗
      this.$emit('close')
    },
    // 删除频道
    del (id, index) {
      /*  1. 删除频道之前判断有没有token
      *   2. 有token的话,先判断是否删除的是高亮项,如果是的话,就将推荐置为高亮
      *   3.如果删除项的下标比高亮项下标小的的话,那么将传的值为 value-1
      *
      * */
      if (this.token?.token) {
        // 有token
        if (index === this.value) {
          this.$emit('input', 0)
        }
        if (index < this.value) {
          this.$emit('input', this.value - 1)
        }
        this.$store.dispatch('delChannel', id)
      } else {
        // 没有token
        // 将点击的频道的id给到vuex, 进行过滤,并将过滤好的频道列表保存到本地
        this.$store.commit('delChannel', id)
      }
    },
    add (id) {
      if (this.token?.token) {
        // 有token
        this.$store.dispatch('addChannel', [{ id, seq: this.channelList.length }])
      } else {
        // 没有token
        // 将id穿过去处理,并将处理好的数据存放到本地
        this.$store.commit('addChannel', id)
      }
    }
  },
  async created () {
    // 发送请求获取所有可用的列表用于计算可选的列表
    this.$store.dispatch('getAllChannels')
  }
}
</script >

<style lang="less" scoped>

.userChannelList,
.optionalChannelList {
  padding: 0 10px;
}

.van-nav-bar {
  font-size: 20px;
  margin-bottom: 15px;
  margin-top: 10px;
  background: #fff;
  border: none;
  ::v-deep {
    .van-nav-bar__text {
      color: #333;
    }
    .van-nav-bar__left {
      font-size: 16px;
    }
    .van-nav-bar__right {
      .edit {
        display: inline-block;
        width: 50px;
        color: red;
        font-weight: bold;
        padding: 0 10px;
        border: 1px solid red;
      }
    }
  }
}
.van-grid-item {
  position: relative;
  ::v-deep {
    .van-grid-item__content {
      font-size: 14px;
      padding: 10px 5px;
    }
  }
  .van-icon-cross {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 14px;
  }
}
.select {
  font-weight: bold;
  color: red;
}

</style >
