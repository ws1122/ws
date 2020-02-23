<template>
  <div>
    <img class="pic" src="./images/wash.png" alt="">
    <div class="tip-wrap">
      <div class="tit">温馨提示</div>
      <div class="desc">1.机器语音播报结束后，即可开始洗车。</div>
      <div class="desc">2.操作机器前，请仔细阅读机身上的使用说明。</div>
      <div class="desc">3.洗车结束后，请按机器上的停止键结束洗车。</div>
      <div class="desc">4.水枪危险，注意安全，请勿将水枪对准人畜~</div>
      <div class="extra">
        <div><img src="./images/smile.png" alt=""></div>
        <div class="extra-desc">享受自己动手洗车的乐趣吧！</div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        
      }
    }
  }
</script>
<style lang="scss" scoped>
 @import '../../styles/variable.scss';
 .pic {
   display: block;
   width: Px(320);
   margin: Px(100) auto Px(90);
 }
 .tip-wrap {
   margin: 0 Px(80);
   .tit {
     color: #333333;
     font-size: Px(36);
     margin-bottom: Px(8);
   }
   .desc {
     color: #999999;
     font-size: Px(28);
   }
   .extra {
     margin-top: Px(40);
     display: flex;
     div > img {
       display: block;
       width: Px(30);
       margin: Px(3) Px(10) 0 0;
     }
     .extra-desc {
       font-size: Px(28);
       color: #999999;
     }
   }
   
 }
</style>

