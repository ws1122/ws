<template>
  <div>
    <div class="top-btn-wrap">
      <!-- <div class="headbtn" v-if="hasBack" @click="goBack">
        <img src="../header/back.png" alt="">
      </div> -->
      <div class="btn" @click="showPop">
        <img src="../../asset/introduction.png" alt="">
        <div>发票申领说明</div>
      </div>
      <div class="btn" @click="toHistory">
        <img src="../../asset/history.png" alt="">
        <div>开票历史</div>
      </div>
    </div>
    <pop v-show="popShow" @closeTank="closePop" :hasTit="true">
      <div slot='poptit'>发票申领说明</div>
      <div slot='poptop'>
        <div class="slot-item" v-for="(item,index) in rule" :key="index">{{item}}</div>
      </div>
      <div slot='popbtn'>好的</div>
    </pop>
  </div>
</template>
<script>
  import pop from '../pop/index.vue'
  export default {
    props: {
      // 返回按钮有没有 默认有
      hasBack: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        popShow: false,
        rule: [
          '1.开票内容目前仅支持“*汽油*汽油”，任意金额都可申请开发票。发票开票日期为7个工作日内。',
          '2.使用活动优惠、积分和卡券支付的费用不在开具发票范围内，即我们按照实付金额开具发票。',
          '3.单次开票金额将开具一张发票，如有特殊要求，请在备注里注明。',
          '4.加油时间不是开票时间，而是打印发票时间。且油品开票上油品单价也以开票时间的油品单价为参考，不为加油时单价。',
          '5.发票申请后不可取消，我们会按照您申请的详细情况进行正常开票。',
          '6.暂不支持港澳台地区。'
        ]
      }
    },
    components: {
      pop

    },
    methods: {
      showPop() {
        this.$store.dispatch('setMask', true)
        this.popShow = true
      },
      closePop() {
        this.$store.dispatch('setMask', false)
        this.popShow = false
      },
      // 返回
      goBack() {
        history.go(-1)
      },
      // 发票历史
      toHistory() {
        this.$router.push({
          name: 'history'
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '../../styles/variable.scss';

  .top-btn-wrap {
    z-index: 4;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: Px(41);
    background: #fff;

    .headbtn {
      position: absolute;
      top: 0;
      left: 0;
      width: Px(40);
      height: Px(40);

      img {
        display: block;
        margin: Px(10) auto;
        width: Px(20);
      }
    }

    .btn {
      position: relative;
      float: right;
      height: Px(41);
      line-height: Px(41);
      font-size: Px(14);
      color: #F56A01;
      padding-left: Px(18);
      padding-right: Px(10);
      margin-left: Px(10);

      img {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        display: block;
        float: left;
        width: Px(14);
      }

      div {
        float: left;
      }
    }
  }

  .slot-item {
    font-size: Px(12);
    text-align: left;
    margin-bottom: Px(10);
  }

  .slot-item:nth-last-of-type(1) {
    margin-bottom: 0;
  }
</style>