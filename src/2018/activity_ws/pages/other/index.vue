<template>
  <div>
    <div class="topss">
      <img src="../../assets/img/done.png" alt class="img" v-if="!isnodata">
      <img src="../../assets/img/nodata.png" alt class="img" v-else>
    </div>
    <div class="main">
      <div class="title">{{isnodata?'您没有可用洗车劵':'洗车已完成'}}</div>
      <div class="explain">{{isnodata?'请您加油后找加油员领取洗车券':'感谢您的光临，祝您一路顺风'}}</div>
    </div>
    <div class="foot" v-if="!isnodata" @click="btn">完成</div>
  </div>
</template>
<script>
export default {
  props: {
    isnodata: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
    btn(){
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../styles/variable.scss";
.topss {
  margin-top: Px(300);
  width: 100%;
  img {
    width: Px(320);
    height: Px(320);
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-size: 100% 100%;
  }
}
.main {
  .title {
    margin-top: Px(40);
    text-align: center;
    color: #000;
  }
  .explain {
    font-size: Px(28);
    color: #999;
    line-height: Px(60);
    text-align: center;
    margin-top: Px(10);
  }
}
.foot {
  position: fixed;
  bottom: Px(60);
  left: 50%;
  transform: translateX(-50%);
  width: Px(690);
  height: Px(80);
  background-image: linear-gradient(-180deg, #fba302 0%, #f56a01 100%);
  border-radius: Px(8);
  text-align: center;
  line-height: Px(80);
  color: #ffffff;
}
</style>

