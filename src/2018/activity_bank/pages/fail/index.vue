<template>
  <div>
    <img class="fail-ico" src="./images/fail.png" alt="">
    <div class="fail-tip">购买失败</div>
    <div class="tip"><span>!</span>失败原因：未使用工行‘行卡’支付购买权益包</div>
    <div class="extra-tip">
        <p>已为您自动申请退款</p>
        <p>将在3个工作日内退款至原账户</p>
    </div>
    <div class="back-btn" @click="gohome">返回</div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        
      }
    },
    methods: {
      gohome() {
        this.$router.push({name:'/'})
      }
    }
  }
</script>
<style lang="scss" scoped>
@import '../../styles/variable.scss';
.fail-ico {
    display: block;
    margin: Px(35) auto 0;
    width: Px(46);
}
.fail-tip {
    margin: Px(10) auto;
    font-size: Px(18);
    color: #FF2900;
    text-align: center;
}
.tip {
  text-align: center;
  font-size: Px(12);
  color: #888888;
  span {
    margin-right: Px(4);
    display: inline-block;
    width: Px(14);
    height: Px(14);
    background: #888888;
    border-radius: 50%;
    color: #fff;
    line-height: Px(15);
    text-align: center;
    font-size: Px(10);
  }
}
.extra-tip {
    overflow: hidden;
    margin: Px(34) auto;
    width: Px(351);
    height: Px(87);
    background: url('./images/fail-bg.png') no-repeat;
    background-position: right 0;
    background-size: Px(89) Px(87);
    p {
        text-align: center;
        font-size: Px(15);
        color: #888888;
    }
    p:nth-of-type(1) {
        margin-top: Px(30)
    }
}
.back-btn {
  position: absolute;
  bottom: Px(53);
  left: 50%;
  transform: translateX(-50%);
  width: Px(231);
  height: Px(44);
  line-height: Px(44);
  background: #000000;
  border-radius: Px(40);
  color: #fff;
  text-align: center;
}
</style>


