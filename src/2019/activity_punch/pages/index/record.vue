<template>
  <div class="container">
    <div class="ban">
      <div class="day-wrap">
        <div class="day"><span>116 </span>天</div>
        <div class="day-txt">总计</div>
      </div>
      <div class="device"></div>
      <div class="day-wrap">
        <div class="day"><span>116 </span>天</div>
        <div class="day-txt">7月</div>
      </div>
    </div>
    <div class="wrap">
      <div class="tab-head">
        <div class="tab-head-item">
          <div><img src="./images/ico1.png" alt=""></div>
          <div>日期</div>
        </div>
        <div class="tab-head-item">
          <div><img src="./images/ico2.png" alt=""></div>
          <div>到岗时间</div>
        </div>
        <div class="tab-head-item">
          <div><img src="./images/ico3.png" alt=""></div>
          <div>离岗时间</div>
        </div>
      </div>
      <scroller lock-x :height="Height">
        <div class="list">
          <div class="list-item">
            <div>11112</div>
            <div>11112</div>
            <div>11112</div>
          </div>
          <div class="list-item">
            <div>11112</div>
            <div>11112</div>
            <div>11112</div>
          </div>
          <div class="list-item">
            <div>11112</div>
            <div>11112</div>
            <div>66666</div>
          </div>
          <div class="list-item">
            <div>11112</div>
            <div>11112</div>
            <div>555555</div>
          </div>
        </div>
      </scroller>
    </div>
  </div>
</template>
<script>
import { Scroller } from 'vux'
export default {
  data(){
    return {

    }
  },
  components:{
    Scroller
  },
  computed:{
    Height() {
      return (document.body.clientWidth * 2 / 750 * 420) + 'px'
    }
  }
}
</script>

<style lang="scss" scoped>
 @import '../../styles/variable.scss';
 .container {
   overflow: hidden;
   min-height: 100vh;
   width: 100%;
   background: #f5f5f5;
 }
 .ban {
   position: relative;
   display: flex;
   height: Px(366);
   width: 100%;
   background: url('./images/bg.png') no-repeat;
   background-size: 100% 100%;
   background-position: 0 0;
   .day-wrap {
     flex: 1;
     text-align: center;
     color: #fff;
     .day {
       margin-top: Px(40);
       font-size: Px(24);
       span {
         font-size: Px(72);
       }
     }
     .day-txt {
       font-size: Px(24);
     }
   }
   .device {
     position: absolute;
     left: 50%;
     top: Px(80);
     transform: translateX(-50%);
     width: 1px;
     height: Px(60);
     opacity: 0.5;
     background: #FFFFFF;
   }
 }
 .wrap {
   position: relative;
   box-sizing: border-box;
   margin: Px(-156) auto 0;
   padding: 0 Px(24);
   width: Px(686);
   height: Px(940);
   background: #fff;
   border-radius: Px(10);
   .tab-head {
     display: flex;
     justify-content: space-between;
     height: Px(80);
     width: 100%;
     box-sizing: border-box;
     border-bottom: 1px dashed #D8D8D8;
     .tab-head-item {
      //  flex: 1;
       display: flex;
       align-items: center;
     }
     .tab-head-item > div {
       font-size: Px(28);
       color: #333333;
     }
     .tab-head-item > div > img {
       display: block;
       width: Px(28);
       margin-right: Px(10);
     }
   }
   .list {
     padding-top: Px(20);
   }
   .list-item {
     display: flex;
     justify-content: space-between;
     align-items: center;
     height: Px(60);
     div {
       font-size: Px(28);
       color: #666666;
     }
   }
 }
</style>

