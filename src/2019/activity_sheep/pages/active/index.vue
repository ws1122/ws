<template>
  <div class="container">
    <img class="banner" src="../../assets/ban.jpg" alt="">
    <div class="extra">
      <span class="ico"></span>
      <span class="tip">四川省所有中石油加油站通用</span>
      <span class="ico marleft"></span>
      <span class="tip">可叠加</span>
    </div>
    <div class="list-wrap">
      <div class="list-tit">选择9.8折加油券</div>
      <div class="list-item martop">
        <div><img class="price" src="../../assets/300.png" alt=""></div>
        <div class="info">
          <div class="cur-price"><span>￥</span>294</div>
          <div class="super-price">市场价：¥200</div>
        </div> 
        <div class="num-wrap">
          <div @click="reduceNum"><img :src="num < 1 ? require('../../assets/reduce.png'): require('../../assets/reduce-act.png')"></div>
          <div class="num">{{num}} 张</div>
          <div @click="addNum"><img src="../../assets/add.png" alt=""></div>
        </div>
      </div>
      <div class="list-item">
        <div><img class="price" src="../../assets/200.png" alt=""></div>
        <div class="info">
          <div class="cur-price"><span>￥</span>294</div>
          <div class="super-price">市场价：¥200</div>
        </div> 
        <div class="num-wrap">
          <div @click="reduceNum"><img :src="num < 1 ? require('../../assets/reduce.png'): require('../../assets/reduce-act.png')"></div>
          <div class="num">{{num}} 张</div>
          <div @click="addNum"><img src="../../assets/add.png" alt=""></div>
        </div>
      </div>
      <div class="list-item">
        <div><img class="price" src="../../assets/100.png" alt=""></div>
        <div class="info">
          <div class="cur-price"><span>￥</span>294</div>
          <div class="super-price">市场价：¥200</div>
        </div> 
        <div class="num-wrap">
          <div @click="reduceNum"><img :src="num < 1 ? require('../../assets/reduce.png'): require('../../assets/reduce-act.png')"></div>
          <div class="num">{{num}} 张</div>
          <div @click="addNum"><img src="../../assets/add.png" alt=""></div>
        </div>
      </div>
    </div>
    <div class="ex-tips">购买后可在“我的-我的卡券”中查看</div>
    <div class="bottom-wrap">
      <div class="price-wrap">
        <div class="price"><span>￥</span>294</div>
        <div class="price-tip">（节省6元）</div>
      </div>
      <div class="buy-btn">立即购买</div>
    </div>
    <div class="bottom-blank"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      num: 1
    }
  },
  methods: {
    addNum() {
      this.num ++
    },
    reduceNum() {
      if (this.num <= 0) {
        return false
      }
      this.num --
    }
  }
}
</script>

<style lang="scss" scoped>
 @import '../../styles/variable.scss';
 .container {
   width: 100%;
   min-height: 100vh;
   background: #00ADFD;
 }
 .banner {
   display: block;
   width: 100%;
 }
 .extra {
   height: Px(64);
   line-height: Px(64);
   text-align: center;
   background: #fff;
   .ico {
     position: relative;
     top: Px(4);
     display: inline-block;
     height: Px(28);
     width: Px(28);
     background: url('../../assets/ok.png') no-repeat;
     background-size: 100%;
     background-position: 0 0;
     &.marleft{
       margin-left: Px(40);
     }
   }
   .tip {
     font-size: Px(28);
     color: #22ADEA;
   }
 }
 .list-wrap {
   padding-top: 1px;
   margin: Px(60) auto 0;
   width: Px(710);
   height: Px(544);
   background: #fff;
   border-radius: Px(6);
   .list-tit {
      margin: Px(-28) auto 0;
      width: Px(334);
      height: Px(54);
      line-height: Px(54);
      text-align: center;
      font-size: Px(32);
      color: #FFFFFF;
      background: #007CFF;
      border-radius: Px(40);
   }
   .list-item {
     padding: Px(30) Px(20);
     display: flex;
     flex-direction: row;
     justify-content: space-between;
     align-items: flex-end;
     div > .price {
       display: block;
       width: Px(160);
     }
     .info {
       width: Px(260);
       margin-left: Px(20);
       .cur-price {
          font-size: Px(32);
          color: #F56A01;
       }
       .super-price {
          font-size: Px(24);
          color: #999999;
          text-decoration: line-through;
       }
     }
     .num-wrap {
       display: flex;
       flex-direction: row;
       justify-content: center;
       align-items: center;
       div > img {
         display: block;
         width: Px(62);
       }
       .num {
         width: Px(114);
         text-align: center;
         font-size: Px(28);
         color: #333333;
       }
     }
   }
   .list-item:not(:last-child){
     border-bottom: 1px solid #E9E9E9;
   }
 }
 .ex-tips {
   font-size: Px(28);
   opacity: .7;
   color: #FFFFFF;
   text-align: center;
   margin: Px(20);
 }
 .bottom-blank {
   height: Px(128);
   width: 100%;
 }
 .bottom-wrap {
   box-sizing: border-box;
   padding: Px(20);
   position: fixed;
   bottom: 0;
   left: 0;
   display: flex;
   flex-direction: row;
   justify-content: space-between;
   align-items: center;
   width: 100%;
   background: #fff;
   .price-wrap {
     line-height: Px(40);
     .price {
        float: left;
        font-size: Px(32);
        color: #F56A01;
     }
     .price-tip {
        float: left;
        font-size: Px(24);
        color: #999999;
     }
   }
   .buy-btn {
     width: Px(438);
     height: Px(88);
     line-height: Px(88);
     text-align: center;
     background-image: linear-gradient(-180deg, #FBA302 0%, #F56A01 100%);
     border-radius: Px(10);
     font-size: Px(32);
     color: #FFFFFF;
   }
 }
 .martop {
   margin-top: Px(20)
 }
</style>

