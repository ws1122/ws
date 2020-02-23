<template>
  <div class="container">
    <div class="music-btn" :class="isplay ? '':'pause'" @click="musicContro">
      <img src="./images/music.png" alt="">
      <audio class="music" src="//res1.eqh5.com/556c1706dba342fcb66c591071034239.mp3" ref="bgrap"></audio>
    </div>
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide" :style="{height:Height,background:'#E9D7D7'}" v-for="(item,index) in list" :key="index">
          <div class="page page1" :style="{height:Height}">
            <img :src="item" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import page1 from './images/page1.jpg'
import page2 from './images/page2.jpg'
import page3 from './images/page3.jpg'
import page4 from './images/page4.jpg'
import Swiper from 'swiper'
  export default {
    data() {
      return {
        mySwiper: {},
        list:[page1,page2,page3,page4],
        isplay: false /// 是否正在播放音乐
      }
    },
    computed:{
      Height() {
        /*动态获取高度 */
        let h  = document.documentElement.clientHeight || document.body.clientHeight;
        return h + 'px'
      }
    },
    methods: {
      // 控制音乐
      musicContro() {
        this.isplay = !this.isplay
        if(this.isplay) {
            /*播放 */
          this.$refs.bgrap.play() 
        } else {
          /*暂停*/
          this.$refs.bgrap.pause()
        }
      },
      // 进入时播放背景音乐
      isMusic() {
        if (this.isplay) {
          return false
        }
        this.isplay = true
        this.$refs.bgrap.currentTime = 0
        this.$refs.bgrap.play()
      },
    },
    mounted(){
      /*初始化swiper */
      this.$nextTick(() => {
        this.isMusic()
        let that = this
        this.mySwiper = new Swiper('.swiper-container', {
            direction: 'vertical',
            resistanceRatio: 0.7,
            onInit: function(swiper) {
              // 初始化设置
              
            },
            // 第一屏和最后一屏分别不能向上和向下滑动
            onTouchStart: function (swiper, even) {
              swiper.unlockSwipeToPrev()
              swiper.unlockSwipeToNext()
              if (swiper.isEnd) {
                swiper.lockSwipeToNext()
              } else if (swiper.activeIndex === 0) {
                swiper.lockSwipeToPrev()
              }
            },
            onSlideChangeEnd: function(swiper) {
              // slide改变结束
            }
          })
      })
    }
  }
</script>
<style lang="scss" scoped>
@import '../../styles/variable.scss';
.page {
  position: relative;
  width: 100%;
  background: #E9D7D7;
  img {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    display: block;
    width: 100%;
  }
}
.container {
  position: relative;
  .music-btn {
    position: fixed;
    z-index: 3;
    right: Px(30);
    top: Px(30);
    overflow: hidden;  
    animation: Trans 1.5s linear infinite forwards;
    animation-play-state: running;
    img {
      display: block;
      width: Px(80);
      border-radius: 50%;
    }
  }
  .pause {
    animation-play-state: paused;
  }
}
@keyframes Trans {
  from{ transform: rotateZ(0) }
  to{ transform: rotateZ(360deg) }
}
</style>


