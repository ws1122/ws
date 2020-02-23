<template>
<div ref="wrapper" :class='$route.meta.hasHeader?"header-wrapper":"wrapper"' >
  <div class="scroll-content" :style="{background:$route.meta.background,'padding-bottom':'0.8rem'}">
    <!-- <div class="pullup-wrapper" >
      <div class="before-trigger" v-if='isNoUpDown'>
        <LoadMore :show-loading='isRefresh.value' :tip="topText"></LoadMore>
      </div>
    </div> -->
    <slot></slot>
    <div class="pulldown-wrapper"  v-if='isNoUpDown'>
      <div class="before-trigger">
        <LoadMore :show-loading='isLoadMore.value' :tip="bottomText"></LoadMore>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import BScroll from 'better-scroll'
import {
  LoadMore
} from 'vux'
export default {
  components: {
    LoadMore
  },
  computed: {
    topText() {
      return this.isRefresh.value ? '数据刷新中' : '下拉刷新'
    },
    bottomText() {
      return this.isLoadMore.value ? '数据加载中' : this.isNoMore.value ? '没有更多的数据' : '上拉加载'
    },
  },
  data() {
    return {
      scroll:null
    }
  },
  props: {
    isNoUpDown:{
      type:Boolean,
      default:true,
    },
    isRefresh: {
      type: Object,
      default: () => {
        return {
          value: false
        }
      }
    },
    isLoadMore: {
      type: Object,
      default: () => {
        return {
          value: false
        }
      }
    },
    isNoMore: {
      type: Object,
      default: () => {
        return {
          value: false
        }
      }
    },
    pullUp:{
      type: Boolean,
      default: true
    },
    pullDown:{
      type: Boolean,
      default: true
    },
    gotoScrollY: {
      type: Boolean,
      default: false
    },
    /**
     * 1 滚动的时候会派发scroll事件，会截流。
     * 2 滚动的时候实时派发scroll事件，不会截流。
     * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
     */

    probeType: {
      type: Number,
      default: 3
    },
    /**
     * 点击列表是否派发click事件
     */
    click: {
      type: Boolean,
      default: true
    },
    /**
     * 是否开启横向滚动
     */
    scrollX: {
      type: Boolean,
      default: false
    },
    /**
     * 是否派发滚动事件
     */
    listenScroll: {
      type: Boolean,
      default: false
    },
    /**
     * 列表的数据
     */
    data: {
      type: Array,
      default: null
    },
    /**
     * 是否派发滚动到底部的事件，用于上拉加载
     */
    
    /**
     * 是否派发顶部下拉的事件，用于下拉刷新
     */
    
    /**
     * 是否派发列表滚动开始的事件
     */
    beforeScroll: {
      type: Boolean,
      default: false
    },
    /**
     * 当数据更新后，刷新scroll的延时。
     */
    refreshDelay: {
      type: Number,
      default: 20
    }
  },
  mounted() {
    // 保证在DOM渲染完毕后初始化better-scroll
    setTimeout(() => {
      this._initScroll()
    }, 50)
    // this.$nextTick(() => {
    //   this._initScroll()
    // })
  },
  destroyed(){
    this.scroll.destroy();
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return
      }
      // better-scroll的初始化

      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click,
        scrollX: this.scrollX
      })
      // 是否派发滚动事件
      if (this.listenScroll) {
        this.scroll.on('scroll', (pos) => {
          this.$emit('scroll', pos)
        })
      }

      // 是否派发滚动到底部事件，用于上拉加载
      if (this.pullUp&&this.isNoUpDown) {
        console.log('上拉动作')
        this.scroll.on('scrollEnd', () => {
          // 滚动到底部
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
            this.$emit('scrollToEnd')
          }
        })
      }

      // 是否派发顶部下拉事件，用于下拉刷新
      if (this.pullDown&&this.isNoUpDown) {
        console.log('下拉动作')
        this.scroll.on('touchEnd', (pos) => {
          // 下拉动作
          if (pos.y > 50) {
            this.$emit('pulldown')
          }
        })
      }

      // 是否派发列表滚动开始的事件
      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll')
        })
      }
    },
    disable() {
      // 代理better-scroll的disable方法
      this.scroll && this.scroll.disable()
    },
    enable() {
      // 代理better-scroll的enable方法
      this.scroll && this.scroll.enable()
    },
    refresh() {
      // 代理better-scroll的refresh方法
      this.scroll && this.scroll.refresh()
    },
    scrollTo() {
      // 代理better-scroll的scrollTo方法
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      // 代理better-scroll的scrollToElement方法
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    // 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常
    data() {
      setTimeout(() => {
        this.refresh()
      }, this.refreshDelay)
    },
    gotoScrollY(newval, oldval) {
      console.log(newval)
      if (newval) {
        this.scrollTo(0, 0, 1000)
      }
    }
  }
}
</script>
<style>
/* .header-page .pullup-wrapper {
  position: absolute;
  top: 0!important;
  left: 0;
  right: 0;
} */
</style>


<style lang="scss" scoped>
@import '../styles/variable.scss';
.wrapper {//视口的高度，超过这个高度就可以滚动
  height: Px(280);
  position: absolute;
  top:0;
  left:0;
  right:0;
  bottom:0;
}
.header-wrapper{
  position: fixed;
  top:Px(100);
  left:0;
  right:0;
  bottom:0;
}

// .scroll-content {
// }
// .pullup-wrapper {
//   position: absolute;
//   top: Px(-60);
//   left: 0;
//   right: 0;
// }

.pulldown-wrapper {
  position: absolute;
  bottom: Px(-60);
  // bottom: 0;
  left: 0;
  right: 0;
}
</style>

