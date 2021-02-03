<template >
  <van-action-sheet v-model="isShow" title="频道管理">
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
          v-for="(item,index) in userChannelList"
          :key="index"
          @click="changeChannel(index)"
          :class="{ select: index === value}"
        >{{ item.name }}
          <van-icon name="cross" v-if="editing && item.id !== 0"  @click="del(item.id, index)"/>
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
          @click="add"
        >{{ item.name }}</van-grid-item>
      </van-grid>
    </div>
  </van-action-sheet>
</template >

<script >
// import { getDefaultChannels } from '@/api/home'
export default {
  name: 'ChannelList',
  props: ['isShow', 'userChannelList', 'value'],
  data () {
    return {
      editing: false,
      allChannels: []
    }
  },
  methods: {
    // 通过组件v-model双向绑定active来实现切换频道,以及频道高亮
    changeChannel (index) {
      if (this.editing) return
      this.$emit('input', index)
    },
    // 删除频道
    del (id, index) {
      console.log(id, index)
      this.$store.dispatch('delChannel', { id, index })
    },
    add () {
    }
  },
  computed: {
    // 通过getter获取可选频道
    optionalChannels () {
      return this.$store.getters.optionalChannels
    }
  },
  async created () {
    // 发送请求获取所有可用的列表用于计算可选的列表
    this.allChannels = await this.$store.dispatch('getAllChannels')
  }
}
</script >

<style lang="less" scoped>
.van-popup {
  padding-bottom: 20px;
  .userChannelList,
  .optionalChannelList {
    padding: 0 10px;
  }
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
