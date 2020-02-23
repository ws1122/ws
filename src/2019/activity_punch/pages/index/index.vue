<template>
  <div class="container">
    <div class="item">
      <div class="tit">当前时间</div>
      <div class="txt">2019-04-07</div>
    </div>
    <div class="item">
      <div class="tit">员工姓名</div>
      <div class="txt">2019-04-07</div>
    </div>
    <div class="item">
      <div class="tit">手机号码</div>
      <div class="txt">2019-04-07</div>
    </div>
    <div class="item">
      <div class="tit">工作站点</div>
      <div class="txt">2019-04-07</div>
    </div>
    <div class="item margintop20">
      <div class="tit">本月到岗2天</div>
      <div class="txt" @click="toRecord">
        <div class="txt-word">到岗记录查询</div>
        <div><img src="./images/more.png" alt=""></div>
      </div>
    </div>
    <div class="btn-wrap">
      <div class="left-wrap">
        <div class="line"></div>
        <div class="left-con">
          <div class="time-txt">到岗时间</div>
          <div class="time">09:00</div>
        </div>
      </div>
      <div class="btn gray">已确认</div>
    </div>
    <div class="btn-wrap">
      <div class="left-wrap">
        <div class="line"></div>
        <div class="left-con">
          <div class="time-txt">离岗时间</div>
          <div class="time">15:30</div>
        </div>
      </div>
      <div class="btn blue">离岗确认</div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {

    }
  },
  methods: {
    toRecord(){
      this.$router.push({name:'record'})
    }
  }
}
</script>

<style lang="scss" scoped>
 @import '../../styles/variable.scss';
.container {
  min-height: 100vh;
  width: 100%;
  background: #f5f5f5;
}
.item {
  border-top: 1px solid #f5f5f5;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 Px(32);
  box-sizing: border-box;
  width: 100%;
  height: Px(100);
  line-height: Px(100);
  background: #fff;
  .tit {
    font-size: Px(32);
    color: #666666;
  }
  .txt {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: Px(28);
    color: #333333;
  }
  .txt > .txt-word {
    font-size: Px(28);
    color: #F5A623;
  }
  .txt > div > img {
    display: block;
    width: Px(12);
    margin-left: Px(12);
  }
}
.margintop20 {
  margin-top: Px(20);
}
.btn-wrap {
  margin-top: Px(20);
  padding: Px(36) Px(54) Px(36) Px(32);
  display: flex;
  justify-content: space-between;
  background: #fff;
  .left-wrap {
    display: flex;
    .line {
      margin-top: Px(8);
      margin-right: Px(18);
      width: Px(6);
      height: Px(60);
      background: #1DB9FF;
    }
    .left-con {
      .time-txt {
        font-size: Px(24);
        color: #999999;
      }
      .time {  
        font-size: Px(36);
        color: #333333;
      }
    }
  }
  .btn {
    height: Px(88);
    line-height: Px(88);
    text-align: center;
    width: Px(220);
    border-radius: Px(44);
    font-size: Px(32);
    color: #FFFFFF;
    &.gray {
      background: #B4AFAF;
      box-shadow: 0 Px(4) Px(18) 0 rgba(216,216,216,0.97);
    }
    &.blue {
      background: #1DB9FF;
      box-shadow: 0 Px(4) Px(18) 0 rgba(29,185,255,0.58);
    }
  }
}
</style>

