<template>
  <div class="container">
    <div v-if="issec">
      <div class="banner">
        <div class="ban-txt"><span class="ico-sec"></span><span class="txt">绑定成功</span></div>
      </div>
      <div class="wrap">
        <div class="title">您已成功绑定</div>
        <div class="title">车友网“车牌付”功能</div>
        <div class="tips">恭喜您收到</div>
        <div class="ticket-tit">车牌付加油券1张</div>
        <img class="ticket" src="./images/ticket-jiayou2.png" alt="">
        <div class="rule">
          <div class="rule-item">使用规则：</div>
          <div class="rule-item">1.单次加油满200可减4元</div>
          <div class="rule-item">2.领取后10天可用</div>
          <div class="rule-item">3.仅限荆门地区石化加油站使用</div>
        </div>
        <div class="bottom-tip">大额优惠  数量有限  兑完即止</div>
      </div>
    </div>
    <div class="fail-wrap" v-if="!issec">
      <img class="fail-ico" src="./images/ico-fail.png" alt="">
      <div class="fail-tip">不符合绑定条件</div>
      <div class="fail-extra">无法绑定</div>
      <div class="submit-btn" @click="toMyTicket">查看我的卡券</div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        // issec: true

      }
    },
    computed:{
      issec(){
        return this.$route.query.flag == 0 ? false : true
      }
    },
    methods: {
      toMyTicket(){
        location.href = this.$isTest ? "http://test.m.cheyuu.com/account/washcoupons":"https://m.cheyuu.com/account/washcoupons"
      }
    },
    mounted(){
      if(this.issec) {
        document.title = '绑定成功'
      } else {
        document.title = '绑定失败'
      }
    }
  }
</script>
<style lang="scss" scoped>
 @import '../../styles/variable.scss';
 .container {
   min-height: 100vh;
   background: #F5F5F5;
 }
 .banner {
    overflow: hidden;
    height: Px(310);
    background-image: linear-gradient(180deg, #F46B02, #FA9F02);
    .ban-txt {
      overflow: hidden;
      margin-top: Px(54);
      font-size: Px(40);
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      .ico-sec {
        display: inline-block;
        margin-right: Px(20);
        width: Px(60);
        height: Px(60);
        background: url('./images/ico-sec.png') no-repeat;
        background-size: 100% 100%;
        background-position: 0 0;
      }
    }
 }
 .wrap {
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    margin: Px(-146) auto 0;
    width: Px(708);
    padding: Px(30) Px(30) Px(94) Px(30);
    background: #fff;
    border-radius: Px(20);
    .title {
      font-size: Px(40);
      color: #333333;
      text-align: center;
      font-weight: 600;
    }
    .tips {
      margin: Px(42) auto 0;
      background: #FF6604;
      border-radius: Px(42);
      font-size: Px(28);
      color: #FFFFFF;
      height: Px(48);
      line-height: Px(48);
      width: Px(200);
      text-align: center;
    }
    .ticket-tit {
      position: relative;
      width: Px(200);
      margin: Px(12) auto 0;
      font-size: Px(24);
      color: #FF6604;
      text-align: center;
    }
    .ticket-tit:before{
      content: '';
      position: absolute;
      left: Px(-120);
      top: 50%;
      width: Px(100);
      border-top: 1px solid #FF6604;
    }
    .ticket-tit:after {
      content: '';
      position: absolute;
      right: Px(-120);
      top: 50%;
      width: Px(100);
      border-top: 1px solid #FF6604;
    }
    .ticket {
      display: block;
      width: Px(650);
      margin: Px(22) auto 0;
    }
    .rule {
      margin-top: Px(38);
      .rule-item {
        font-size: Px(28);
        color: #999999;
      }
    }
    .bottom-tip {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: Px(54);
      line-height: Px(54);
      font-size: Px(24);
      color: #FF6604;
      text-align: center;
      background: #FFF6E8;
      border-radius: 0 0 Px(20) Px(20);
    }
  }
  .fail-wrap {
    overflow: hidden;
  }
  .fail-ico {
    display: block;
    margin: Px(70) auto 0;
    width: Px(256);
  }
  .fail-tip {
    margin-top: Px(44);
    font-size: Px(36);
    color: #333333;
    text-align: center;
  }
  .fail-extra {
    margin-top: Px(20);
    font-size: Px(28);
    color: #666666;
    text-align: center;
  }
  .submit-btn {
    margin: Px(476) auto 0;
    width: Px(670);
    height: Px(88);
    line-height: Px(88);
    font-size: Px(32);
    color: #FFFFFF;
    background-image: linear-gradient(180deg, #FBA302, #F56A01);
    border-radius: Px(10);
    text-align: center;
  }
</style>
