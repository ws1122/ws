<template>
  <div class="container" v-show="showPage">
    <div class="ban">
      <div class="ban-voice">
        <img src="../../assets/voice.png" alt="">
      </div>
      <div class="wenzi">
        <p>别忘了拿油卡去加油站圈存哟，圈存之后才能用油卡</p>
        <p>加油</p>
        <p>圈存地点：中石化加油站柜台或自助圈存机</p>
      </div>
    </div>
    <div class="card-wrap">
      <div class="card-top">
        <img src="../../assets/suc.png" alt="">
      </div>
      <div class="card-con">
        <div class="recharge">充值成功</div>
        <div class="money">
          <span>￥</span>
          <span class="num">{{((orderdetail.FeeTotal/100).toFixed(2)) || 0}}</span>
        </div>
        <div class="inpay">实付金额：{{((orderdetail.FeePayment/100).toFixed(2)) || 0}}</div>
        <div class="inpay">充值时间：{{orderdetail.PayTime}}</div>
        <div class="cardoil">
          油卡号：{{orderdetail.CardNumber}}
        </div>
      </div>
      <div class="fulfill" @click="clickpay">完成</div>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import Qs from 'qs'
  export default {
    components: {

    },
    data() {
      return {
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
        showQrcode: false,
        showpop: false,
        detailinfo: null,
        qrcodeVal: '',
        showPage: false,
        orderdetail:{},
      };
    },
    computed: {
      qrSize() {
        return (document.body.clientWidth / 750) * 168 * 2;
      },
      orderCode() {
        return this.$route.query.orderCode;
      },
      access_token() {
        return (
          this.$store.state.token.access_token ||
          localStorage.getItem("access_token")
        )
      },
      refresh_token() {
        return this.$store.state.token.refresh_token || localStorage.getItem('refresh_token')
      },
    },
    mounted() {
      this.payorder()
    },

    methods: {

      /*订单完成 */
      payorder() {
        this.$http.get('/v1/ylxoilcard/finishpayorder?access_token=' + this.access_token, {
          orderCode: this.orderCode||'1907251447413710555'
        }, this.baseUrl, false).then((data) => {
          if (data.error) {
            if (data.error.code != 401) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else {
            this.showPage=true
            this.orderdetail=data
            console.log(111, data)


          }
        })
      },
      clickpay() {
        WeixinJSBridge.call('closeWindow');
        console.log(15777)

      },


    }
  };

</script>
<style lang="scss" scoped>
  @import "../../styles/variable.scss";

  .container {
    position: relative;
    width: 100%;
    min-height: 100vh;
    background: #f5f5f5;
  }

  .ban {
    display: flex;
    width: 100%;
    padding: 0 Px(20);
    box-sizing: border-box;
    font-size: Px(28);
    color: #F67A02;
    background: #FDF6EC;

    .ban-voice {
      width: Px(55);

      img {
        width: Px(40);
        position: relative;
        top: Px(60);
        left: 0;
      }
    }

    .wenzi {
      padding: Px(20) 0;
    }




  }


  .card-wrap {
    width: Px(710);
    margin: Px(30) auto Px(40);

    .card-top {
      width: 100%;
      padding-top: Px(20);
      text-align: center;
      height: Px(88);
      background: #ffffff;
      border-radius: Px(10);

      img {
        width: Px(78);
      }

    }

    .card-device {
      display: block;
      width: 100%;
    }

    .card-con {
      overflow: hidden;
      width: 100%;
      background: #fff;
      padding-bottom: Px(60);

      .money {
        margin-top: Px(40);
        text-align: center;
        color: #333333;
      }

      .money span {
        font-size: Px(48);
      }

      .money .num {
        font-size: Px(84);
      }

      .qr-wrap {
        margin-top: Px(40);
        text-align: center;
      }

      .btn {
        margin: Px(40) auto 0;
        box-sizing: border-box;
        text-align: center;
        line-height: Px(88);
        height: Px(88);
        width: Px(670);
        border-radius: Px(10);
        font-size: Px(32);

        &.use {
          background-image: linear-gradient(-180deg, #fba302 0%, #f56a01 100%);
          color: #fff;
        }

        &.backmoney {
          background: #ffffff;
          border: 1px solid #f56a01;
          color: #999999;
        }

        &.isgray {
          border: 1px solid #ececec;
          color: #f46b02;
        }

        &.gray {
          background: #aaa;
          color: #fff;
        }
      }
    }

    .card-bottom {
      background: #fff;
      height: Px(100);
      line-height: Px(100);
      text-align: center;
      border-top: 1px dashed#E9E9E9;
      font-size: Px(28);
      color: #666666;
      border-radius: 0 0 Px(6) Px(6);

      .tip {
        position: relative;
        top: Px(8);
        display: inline-block;
        height: Px(32);
        width: Px(32);
        background: url("../../assets/aten.png") no-repeat;
        background-position: 0 0;
        background-size: 100%;
      }
    }
  }

  .rule {
    margin-top: Px(40);
    padding: Px(30) Px(20);
    background: #fff;

    .rule-tit {
      font-size: Px(32);
      color: #666666;
      margin-bottom: Px(10);
    }

    .rule-item {
      font-size: Px(28);
      color: #999999;

      span {
        display: inline-block;
        width: Px(12);
        height: Px(12);
        background: #f56a01;
        border-radius: 50%;
        margin-right: Px(10);
      }
    }
  }

  .masks {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
  }

  .pop {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    width: Px(610);
    border-radius: Px(30);

    .pop-tit {
      padding: Px(40) Px(20);
      text-align: center;
      font-size: Px(36);
      color: #282828;
    }

    .pop-con {
      padding: 0 Px(20) Px(40);
      font-size: Px(32);
      color: #999999;
      text-align: center;
    }

    .pop-btn-wrap {
      display: flex;
      flex-direction: row;
      height: Px(88);
      line-height: Px(88);
      justify-content: center;
      align-items: center;
      border-top: 1px solid #e9e9e9;

      div {
        flex: 1;
        text-align: center;
        font-size: Px(36);
        color: #999999;

        &.confirm {
          color: #01a2ae;
        }
      }
    }
  }

  .recharge {
    text-align: center;
    font-size: Px(32);
    color: #F67A02;
  }

  .inpay {
    text-align: center;
    font-size: Px(28);
    color: #999999;
    padding-top: Px(20);

  }

  .cardoil {
    margin-top: Px(40);
    height: Px(50);
    border-top: 1px solid #E9E9E9;
    text-align: center;
    font-size: Px(28);
    color: #999999;
    line-height: Px(100);

  }

  .fulfill {
    margin: Px(60) auto 0;
    height: Px(88);
    line-height: Px(88);
    width: Px(710);
    text-align: center;
    font-size: Px(32);
    color: #FFFFFF;
    background-image: linear-gradient(180deg, #FBA302, #F56A01);
    border-radius: Px(10);
  }

</style>
