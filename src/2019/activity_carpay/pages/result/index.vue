<template>
  <div class="container">
    <div class="banner"></div>
    <div class="suc-wrap">
      <img class="suc-ico" src="../../assets/suc.png" alt="">
      <div class="suc-tip">支付成功</div>
      <div class="money-tit">本次充值加油币（元）</div>
      <div class="money-num"><span>￥</span>{{addmoney}}</div>
      <div class="cheyoo-rest-wrap">
        <div class="cheyoo-tit">
          <div><img src="../../assets/ico-cell.png" alt=""></div>
          <div>加油币可用余额（元）</div>
        </div>
        <div class="cheyoo-cell">{{points}}</div>
      </div>
    </div>
    <div class="extra-tip">如有疑问请咨询客服电话：<span>400-6326-888</span></div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
        points: ''
      }
    },
    computed:{
      // 充值的加油币
      addmoney(){
        return this.$route.query.addnum
      },
      access_token() {
        return this.$store.state.token.access_token || localStorage.getItem('access_token')
      }
    },
    mounted(){
      this.getMypoint()
    },
    methods: {
      getMypoint(){
        this.$http.get('/v2/users/userpoints?access_token=' + this.access_token ,{},this.baseUrl).then(data=>{
          if(data.error) {
            if (data.error.code != 401) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else {
            this.points = data.Points
          }
        })
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
  .banner {
    height: Px(236);
    width: 100%;
    background-image: linear-gradient(-0deg,#FBA302, #F56A01);
  }
  .suc-wrap {
    position: relative;
    top: Px(-196);
    margin: 0 Px(20);
    padding-top: Px(40);
    padding-bottom: Px(36);
    background: #FFFFFF;
    box-shadow: 0 1px Px(20) 0 rgba(0,0,0,0.06);
    border-radius: Px(20);
    .suc-ico {
      margin: 0 auto;
      display: block;
      width: Px(84);
    }
    .suc-tip {
      margin-top: Px(10);
      font-size: Px(32);
      color: #F67A02;
      text-align: center;
    }
    .money-tit {
      margin-top: Px(60);
      font-size: Px(28);
      color: #333333;
      text-align: center;
    }
    .money-num {
      font-size: Px(84);
      color: #333333;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      span {
        font-size: Px(48);
      }
    }
    .cheyoo-rest-wrap {
      margin-top: Px(60);
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      background: #fff;
      padding: Px(36) Px(20) 0;
      border-top: 1px solid #E9E9E9;
      .cheyoo-tit {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: Px(28);
        color: #999999;
      }

      .cheyoo-tit>div>img {
        display: block;
        margin-right: Px(10);
        width: Px(38);
      }

      .cheyoo-cell {
        font-size: Px(32);
        color: #999999;
      }
    }
  }
  .extra-tip {
    position: absolute;
    left: 0;
    bottom: Px(80);
    width: 100%;
    font-size: Px(32);
    color: #666666;
    text-align: center;
    span {
      color: #F56A01;
    }
  }
</style>

