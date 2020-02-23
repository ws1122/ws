<template lang="pug">
  div
    transition(name = 'vux-fade')
      div(v-if = 'show', :class = '$style.back')
    transition(name = 'slide-up')
      div(v-if = 'show', :class = '$style.container')
        <slot name="expansion-head"></slot>
        header
          div(
            v-for = 'item in filterItems',
            :class = '$style.item',
            @click = 'share(item.index)'
          )
            img(:src = 'item.img')
            p {{item.text}}
        <slot name="expansion-body"></slot>
        footer(@click = 'show = false') 取消
        <slot name="expansion-footer"></slot>
</template>

<script>
  import items from './items.js'
  import iconItem from './icon-item.js'
  import filter from 'lodash/filter'
  import {
    share,
    shareAPP
  } from './appShare'
  
  export default {
    components: {
     
    },
    data() {
      return {
        items
      }
    },
    computed: {
      filterItems() {
        // 自定义图标
        let items = []
        this.shareType.split('|').forEach(item => {
          iconItem[item] && items.push(iconItem[item])
        })
  
        return items.length > 0 ? items : filter(this.items, item => {
          //若配置了分享渠道 则根据分享渠道来显示结果
          if (this.config.shareChannel && this.config.shareChannel.length > 0) {
            if (this.config.shareChannel.indexOf(item.index) < 0) return false
          }
          if (this.hideCode) return item.index < 10
          return item.index < 11
        })
      },
      show: {
        get() {
          return this.value
        },
        set() {
          this.$emit('input', false)
        }
      }
    },
    props: {
      shareType: {
        type: String,
        default: ''
      },
      hideCode: {
        type: Boolean,
        default: false
      },
      config: {
        type: Object,
        default () {
          return {
            sharetype: 0,
            imageurl: '',
            title: '温商贷',
            content: '温商贷',
            linkurl: location.href,
            logourl: 'http://sq.wsloan.com/communityapp/logo.jpg',
            shareChannel: [],
            // 温商贷好友分享图片
            picurl: '',
            success() {},
            from: ''
          }
        }
      },
      value: {
        type: Boolean,
        default: false
      },
    },
    methods: {
      share(index) {
        share(this, index)
      }
    }
  }
</script>

<style lang="scss" module>
  @import '~@base';
  .back {
    background: rgba(0, 0, 0, .8);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 50;
  }
  
  %panel {
    margin: Px(24);
    background: #fff;
    border-radius: Px(12);
  }
  
  .container {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 51;
    width: 100%;
    header {
      @extend %panel;
      padding: Px(24) 0;
      &:after {
        content: '';
        display: block;
        clear: both;
      }
    }
    footer {
      @extend %panel;
      height: Px(88);
      line-height: Px(88);
      text-align: center;
      color: #666;
      font-size: Px(32);
    }
  }
  
  .item {
    float: left;
    width: 25%;
    height: Px(164);
    text-align: center;
    color: #999;
    font-size: Px(24);
    img {
      width: Px(80);
      height: Px(80);
      margin: Px(16) auto;
      display: block;
    }
  }
</style>

<style>
  .slide-up-enter-active,
  .slide-up-leave-active,
  .slide-down-enter-active,
  .slide-down-leave-active,
  .slide-right-enter-active,
  .slide-right-leave-active {
    transform: translate(0, 0);
    transition: all .3s ease;
  }
  
  .slide-up-enter,
  .slide-up-leave-to {
    transform: translate(0, 100%);
  }
  
  .slide-down-enter,
  .slide-down-leave-to {
    transform: translate(0, -100%);
  }
  
  .slide-right-enter,
  .slide-right-leave-to {
    transform: translate(100%, 0);
  }
</style>

