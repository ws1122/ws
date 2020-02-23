<template>
  <div class="container">
    <div class="top-wrap">
      <div class="input-wrap">
        <div class="txt">手机号码</div>
        <input class="inputs" v-model="phone" placeholder="填写手机号码" type="text">
        <div class="yzm-wrap">
          <span v-if="!iscut" @click="getyzm">获取验证码</span>
          <span class="noclick" v-else>{{time}}s后可重新获取</span>
        </div>
      </div>
      <div class="input-wrap bord0">
        <div class="txt">验证码</div>
        <input class="inputs yzm" v-model="vcode" placeholder="输入验证码" type="text">
      </div>
    </div>
    <div :class="['confirmbtn',isCanConfirm?'actbtn':'']">确定</div> 
  </div>
</template>
<script>
export default {
  data(){
    return {
      isCanConfirm:false,
      iscut: false,
      time: 59,
      timer: null,
      phone: '',
      vcode: ''
    }
  },
  comnented:{
   
  },
  methods:{
    getyzm(){
      this.iscut = true
      this.cutdown()
    },
    cutdown(){
      this.timer = setInterval(() => {
        if(this.time > 0) {
          this.time--
        } else {
          this.time = 59
          clearInterval(this.timer)
          this.iscut = false
        }  
      },1000)
    },
  }
}
</script>
<style lang="scss" scoped>
 @import '../../styles/variable.scss';
 .container {
    overflow: hidden;
    min-height: 100vh;
    background: #F6F6F6;
 }
 .top-wrap {
   background: #FFFFFF;
   margin-top: Px(40);
 }
 .input-wrap {
   overflow: hidden;
   margin-left: Px(20);
   margin-right: Px(20);
   border-bottom: 1px solid #E5E5E5;
   height: Px(88);
   line-height: Px(86);
   .txt {
     float: left;
     font-size: Px(32);
     color: #222222;
     width: Px(150);
   }
   .inputs {
     box-sizing: border-box;
     padding-left: Px(10);
     float: left;
     width: Px(350);
     height: Px(88);
     outline: none;
     border: 0;
     &.yzm {
       width: Px(550);
     }
   }
   .yzm-wrap {
      float: right;
      font-size: Px(28);
      color: #F56A01;
      span {
        display: inline-block;
        line-height: Px(86);
      }
      .noclick {
        font-size: Px(12);
        font-weight: 500;
        // color: #ccc;
      }
   }
 }
 .confirmbtn {
    margin-top: Px(30);
    margin-left: Px(20);
    margin-right: Px(20);
    height: Px(88);
    text-align: center;
    line-height: Px(88);
    border-radius: Px(10);
    background: #999999;
    color: #ffffff;
    font-size: Px(32);
}
.actbtn {
    background: #F88602;
}
.bord0{
  border: 0!important;
}
</style>
