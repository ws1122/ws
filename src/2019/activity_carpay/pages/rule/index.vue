<template>
  <div class="container">
    <div class="rule-wrap">
      <div class="rule-item" v-for="(item,index) in rules" :key="index">
        <div class="rule-index">
          <div>{{index + 1}}</div>
        </div>
        <div class="rule-desc" v-html="item"></div>
      </div>
    </div>
    <img class="kefu" src="../../assets/kefu.png" alt="">
  </div>
</template>
<script>
export default {
  data(){
    return {
      rules: [
        '加油币在订单支付时使用，等同于现金，<br/>1加油币=1元；',
        '加油币充值后30分钟内可以申请退款；',
        '单笔加油币充值，申请退款时扣除优惠，退还未使用的加油币余额；',
        '加油时优先使用账户加油币余额支付；',
        '加油币可以通过合作方兑换和充值获得。'
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../styles/variable.scss';
  .container {
    position: relative;
    min-height: 100vh;
    background: #F5F5F5;
  }
  .rule-wrap {
    overflow: hidden;
    background: #fff;
    padding: 0 Px(44) Px(40);
    .rule-item {
      margin-top: Px(40);
      display: flex;
      flex-direction: row;
      .rule-index > div {
        height: Px(34);
        width: Px(34);
        border-radius: 50%;
        text-align: center;
        line-height: Px(38);
        background: #F56A01;
        font-size: Px(22);
        color: #FFFFFF;
      }
      .rule-desc {
        margin-left: Px(8);
        font-size: Px(32);
        color: #333333;
      }
    }
  }
  .kefu {
    position: absolute;
    bottom: Px(80);
    left: 50%;
    transform: translateX(-50%);
    display: block;
    width: Px(438);
  }
</style>


