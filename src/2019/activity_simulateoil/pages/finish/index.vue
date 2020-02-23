<template>
  <div class="main">
    <div class="top">
      <img src="../../assets/finsih.png" alt="">
    </div>
    <div class="middle">
      <div>本次加油金额 <span>{{money}}元</span></div>
      <div>本次加油量 <span>{{oilmass}}升</span></div>
      <div class="price">
        单价6.73元/升
      </div>
    </div>
    <div class="foot">
      <mybutton @todo="submit" title="完成"></mybutton>
    </div>

  </div>
</template>
<script>
  import mybutton from '../componnents/button';
  export default {
    data() {
      return {

      }
    },
    components: {

      mybutton
    },
    mounted() {

    },
    computed: {
      money() {
        return this.$route.query.money
      },
      oilmass() {
        return this.$route.query.oilmass
      }
    },
    methods: {
      submit() {
        WeixinJSBridge.call('closeWindow');

      }

    }
  }

</script>
<style lang="scss" scoped>
  @import '../../styles/variable.scss';

  .top {
    text-align: center;
    margin-top: Px(80);

    img {
      width: Px(144)
    }
  }

  .middle {
    margin-top: Px(60);
    text-align: center;

    div {
      font-size: Px(32);
      color: #000;
      line-height: Px(60);

      span {
        color: red
      }
    }

    .price {
      margin: Px(20) auto 0;
      width: Px(280);
      height: Px(50);
      background: #EFF8FF;
      border-radius: Px(25);
      font-size: Px(28);
      color: #666666;
      line-height: Px(50);

    }
  }

  .foot {
    margin-top: Px(250);
  }

</style>
