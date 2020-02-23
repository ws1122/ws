<template>
  <div class="container">
      <div class="icon-wrap">
          <img src="../../asset/suc.png" alt="">
      </div>
      <div class="tip">收款成功</div>
      <div class="con-item"><strong>收款金额：</strong><span>{{FeeTotal}}</span></div>
      <div class="con-item"><strong>验证码：</strong><span>{{CheckCode}}</span></div>
      <div class="con-item"><strong>收款时间：</strong><span class="date">{{CreateTime}}</span></div>
      <div class="back-home" @click="gobackHome">返回</div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
          
      }
    },
    computed:{
        CheckCode(){
            return this.$route.query.CheckCode
        },
        FeeTotal(){
            return this.$route.query.FeeTotal
        },
        CreateTime(){
            return this.$route.query.CreateTime
        }
    },
    methods: {
      gobackHome(){
        this.$router.replace({name:'index'})
      }
    },
  }
</script>
<style lang="scss" scoped>
@import '../../styles/variable.scss';
.icon-wrap {
    width: Px(105);
    margin: Px(100) auto 0;
    img {
        display: block;
        width: 100%;
    }
}
.tip {
    margin: Px(15) auto Px(50);
    font-size: Px(18);
    color: #222222;
    text-align: center;
}
.con-item {
    height: Px(40);
    line-height: Px(40);
    margin-left: Px(60);
    margin-bottom: Px(12);
    span {
        position: relative;
        top: Px(4);
        font-size: Px(30);
        color: #222222;
        line-height: Px(40);
        &.date {
            font-size: Px(16);
            color: #222222;
            top: Px(0);
        }
    }
    strong {
        display: inline-block;
        width: Px(100);
        font-size: Px(18);
        color: #666666;
        font-weight: 500
    }
}
.back-home {
    margin: Px(74) auto;
    background-image: linear-gradient(90deg, #45B7FD 0%, #96B5FD 100%);
    border-radius: Px(40);
    height: Px(40);
    color: #fff;
    line-height: Px(40);
    text-align: center;
    width: Px(190);
}
</style>

