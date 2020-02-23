<template>
  <div class="container">
    <div class="ban" ref="ban" @click="clickRef">
      <img src="./images/banner.jpg" />
    </div>
    <div class="buy-btn-wrap">
      <div class="buy-btn" @click="clickBuy">10元 立即购买</div>
      <div class="tip"><span>!</span>注意：请使用工行‘行卡’支付购买权益包</div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
  
      }
    },
    methods:{
      clickBuy() {
        this.$vux.confirm.show({
          // 组件除show外的属性
          content: '活动即将开始！',
          showCancelButton: false, 
          // onCancel () {},
          // onConfirm () {}
        })
      },
      clickRef(){
        console.log(3333)
      }
    },
    mounted() {
  
    }
  }
</script>
<style lang="scss" scoped>
@import '../../styles/variable.scss';
.container {
  width: 100%;
  height: 100vh;
  background-image: linear-gradient(-180deg, #C6C6C6 0%, #E9E9E9 48%, #FFFFFF 100%);
}
.ban {
  width: 100%;
  img {
    display: block;
    width: 100%;
  }
}
.buy-btn {
  margin: Px(30) auto 0;
  width: Px(231);
  height: Px(44);
  line-height: Px(44);
  background: #000000;
  border-radius: Px(40);
  color: #fff;
  text-align: center;
}
.tip {
  margin: Px(14) auto;
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
// iponeX
@media (device-width: 375px) and (device-height: 812px) and (-webkit-min-device-pixel-ratio: 3) {
  .container {
    background-image: linear-gradient(-180deg, #C6C6C6 0%, #E9E9E9 30%, #FFFFFF 100%);
  }
  .buy-btn {
    margin: Px(120) auto 0;
  }
}
</style>


