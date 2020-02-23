<template>
  <div class="container" >
    <!-- <div class="money-top">
      <div>油卡卡号</div>
      <div>{{cardnumber}}</div>
    </div> -->
    <div class="money-wrap">
      <div class="money-tit">充值金额</div>
      <!-- <div><img src="../../assets/discount.png" alt="" class="discount">
      </div> -->
      <div class="input-wrap">
        <div>￥</div>
        <input :class="isAndro?'andinput':'iosinput'" type="number" v-model="money" @input="changeInput"
          placeholder="输入充值金额">
      </div>
    </div>
    <div class="discount-wrap">
      <div class="discount-type-wrap">
        <div class="discount-type">
          <div><img src="../../assets/ico-hui.png" alt="">
          </div>
          <div>{{discount/10}}折</div>
        </div>
        <div class="more-wrap" v-if="!money==0">
          <div class="fee-num">-{{(Math.floor((100-discount)*money)/100).toFixed(2)}}</div>
        </div>
      </div>

      <div class="fee-wrap">
        <div class="fee-tit">实付金额</div>
        <div class="fee-num">￥{{(fee-Math.floor((100-discount)*money)/100).toFixed(2)}}</div>
      </div>
    </div>
    <div class="btn" :class="isGray ? 'gray':''" @click="clickpay">立即支付</div>
    <div class="recharge">
      <img src="../../assets/aten.png" alt="" class="aten">
      充值后不可退款，请认真核对油卡卡号</div>
  </div>
</template>

<script>
  import axios from 'axios'
  import Qs from 'qs'
  export default {
    data() {
      return {
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
        popShow: true,
        discountType: 0,
        cardnumber: {},
        promotionList: [], //优惠券 接口拿到的
        couponList: [], // 卡券列表 接口拿到的
        uiPromotionList: [], // ui显示的活动列表
        uiCouponList: [], // ui显示的卡券列表
        money: '', // 输入金额
        fee: 0, // 实付金额
        showPage: false,
        skipnumber: 0,
        discount: 0, //折扣


      }
    },
    watch: {
      money(val, oldval) {
        if (isNaN(Number(val))) {
          this.money = oldval
        }
      }
    },
    computed: {
      oilcardid() {
        return this.$route.query.oilcardid
      },
      merchantid() {
        return this.$route.query.merchantid
      },
      ylxuid() {
        return this.$route.query.ylxuid
      },
      Height() {
        return (document.body.clientWidth / 750 * 400) + 'px'
      },
      access_token() {
        return this.$store.state.token.access_token || localStorage.getItem('access_token')
      },
      refresh_token() {
        return this.$store.state.token.refresh_token || localStorage.getItem('refresh_token')
      },
      userinfo() {
        return this.$store.state.token.userinfo || localStorage.getItem('userinfo')
      },
      isGray() {
        return (this.money == '' || (Number(this.money) <= 0)) ? true : false
      },
      isAndro() {
        let u = navigator.userAgent,
          app = navigator.appVersion;
        let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器  
        let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端  
        return isAndroid == true ? true : false;

      }
    },
    components: {},
    methods: {
      // 点击支付按钮
      clickpay() {
        if (this.isGray) {
          return false
        }
        this.createOrder()
      },
      // 输入时
      changeInput() {
        this.discountType = 0
        if (this.money == '') {
          this.fee = 0
        } else {
          this.fee = Number(this.money)
        }
      },

      // 支付接口 获取支付的 字段对象
      toPayOut(orderCode) {
        this.$http.post('/v2/pay/payout?access_token=' + this.access_token, {
          orderCode: orderCode,
          scene: 'YLXCZ',
          orderFrom: 10,
        }, this.baseUrl).then(data => {
          if (data.error) {
            if (data.error.code != 401) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else {
            let PayType = data.PayType
            let jssdkParamsStr = data.SdkParams
            let jssdkParams = JSON.parse(jssdkParamsStr)
            if (PayType == 'Wechat') {
              this.needCallPay2(jssdkParams)
            }

          }
        })
      },
      // 微信支付
      needCallPay2(jssdkParams) {
        if (typeof (WeixinJSBridge) == "undefined") {
          if (document.addEventListener) {
            document.addEventListener("WeixinJSBridgeReady", () => {
              this.wxCallPay2(jssdkParams);
            }, false);
          } else if (document.attachEvent) {
            document.attachEvent("WeixinJSBridgeReady", () => {
              this.wxCallPay2(jssdkParams);
            });
            document.attachEvent("onWeixinJSBridgeReady", () => {
              this.wxCallPay2(jssdkParams);
            });
          }
        } else {
          this.wxCallPay2(jssdkParams);
        }
      },
      wxCallPay2(jssdkParams) {
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest',
          jssdkParams,
          (res) => {
            if (res.err_msg != "get_brand_wcpay_request:ok") {
              WeixinJSBridge.invoke('closeWindow', {}, (e) => {});
            } else {
              this.$router.replace({
                path: 'detail',
                query: {
                  orderCode: this.orderCode
                }
              })

            }
          }
        );
      },
      // 创建订单接口
      createOrder() {
        this.$http.post('/v1/ylxoilcard/createoilcardorder?access_token=' + this.access_token, {
          "merchantID": Number(this.merchantid),
          "oilCardID": Number(this.oilcardid),
          feeTotal: Math.round(Number(this.fee) * 100),
        }, this.baseUrl).then(data => {
          if (data.error) {
            if (data.error.code != 401) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else {
            this.orderCode = data.orderCode
            this.toPayOut(data.orderCode)
            // if (this.$isTest) {
            //   this.paySuc(data.orderCode)
            // } else {
            //   this.toPayOut(data.orderCode)
            // }
          }
        })
      },
      // getToken() {
      //   this.$http.post('/v1/authentication/grant', {
      //     client_id: 'wechat_ylx',
      //     client_secret: this.$isTest ? '123456789' : '8e3af6ec8aa604c095ce813397c5114e',
      //     grant_type: 'client_credentials'
      //   }, this.baseUrl, false).then((data) => {
      //     console.log(1588, data)
      //     if (data.error) {
      //       // this.$vux.toast.show({type: 'warn',text: data.data.error.message})
      //       localStorage.removeItem('access_token')
      //       localStorage.removeItem('refresh_token')
      //       this.$store.dispatch('setAccessToken', '')
      //       this.$store.dispatch('setRefreshToken', '')
      //       this.getToken()
      //     } else { // 请求成功
      //       let access_token = data.access_token
      //       let refresh_token = data.refresh_token
      //       localStorage['access_token'] = access_token;
      //       localStorage['refresh_token'] = refresh_token;
      //       this.$store.dispatch('setAccessToken', access_token)
      //       this.$store.dispatch('setRefreshToken', refresh_token)
      //       this.$nextTick(() => {
      //        // this.login()
      //       })
      //     }
      //   })
      // },
      // login() {
      //   let v = new Date().getTime()
      //   this.$http.post('/v1/authentication/loginwechat?access_token=' + this.access_token, {
      //     wechatIdentity: 'yilvxing',
      //     redirectUrl: "http://localhost:8088/#/?access_token=" + this.access_token
      //    // redirectUrl: this.$isTest ?
      //     // `https://test.m.cheyuu.com/html/ylxoilcard/index.html#/?oilcardid=${this.oilcardid}&merchantid=${this.merchantid}&ylxuid=${this.ylxuid}` :
      //      // `https://m.cheyuu.com/html/ylxoilcard/index.html#/?oilcardid=${this.oilcardid}&merchantid=${this.merchantid}&ylxuid=${this.ylxuid}`
      //   }, this.baseUrl, false).then((data) => {
      //     if (data.redirectUrl) {
      //       location.href = data.redirectUrl
      //     }

      //   })
      // },
      // getuserinfo() {
      //   let access_token = localStorage.getItem('access_token')
      //   let refresh_token = localStorage.getItem('refresh_token')
      //   axios({
      //     url: this.baseUrl + '/v1/members/checkylxlogin?access_token=' + access_token,
      //     method: 'get'
      //   }).then(({
      //     data
      //   }) => {
      //     if (data.result) {
      //       this.showPage = true
      //       this.merchantinfo()
      //       this.ylxoilcard()
      //       if (this.ylxuid) {
      //         this.grtuid()
      //       }

      //     } else {
      //       this.getToken()
      //     }
      //   })
      // },
      // ylxoilcard() {
      //   this.$http.get('/v1/ylxoilcard/ylxoilcardinfo?access_token=' + this.access_token, {
      //     oilCardID: this.oilcardid
      //   }, this.baseUrl, false).then((data) => {
      //     if (data.error) {
      //       if (data.error.code != 401) {
      //         this.$vux.toast.show({
      //           type: 'warn',
      //           text: data.error.message
      //         })
      //       }
      //     } else {
      //       this.cardnumber = data.CardNumber

      //     }
      //   })
      // },

      /*获取商户信息*/
      merchantinfo() {
        this.$http.get('/v1/ylxoilcard/merchantinfo?access_token=' + this.access_token, {
          "merchantID": Number(this.merchantid),
        }, this.baseUrl, false).then((data) => {
          if (data.error) {
            if (data.error.code != 401) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })

            }
          } else {
            this.discount = Number(data.Discount);
          }
        })

      },


    },
    mounted() {
      this.merchantinfo()
      // if (!this.access_token) {
      //   this.getToken()
      // } else {
      //   this.$nextTick(() => {
      //     this.getuserinfo()
      //   })
     // }
    }

  }

</script>
<style lang="scss" scoped>
  @import '../../styles/variable.scss';

  .container {
    min-height: 100vh;
    background: #F5F5F5;
  }

  .money-top {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: Px(100);
    line-height: Px(100);
    font-size: Px(28);
    color: #999999;
    padding: 0 Px(10);
    box-sizing: border-box;
    background-color: #fff;
    border-bottom: 1px solid #cccccc;
  }

  .discount {
    width: Px(100);
    position: relative;
    top: Px(-60);
    left: Px(120);


  }

  .money-wrap {
    background: #fff;
    padding: Px(40) Px(20) Px(0);

    .money-tit {
      font-size: Px(28);
      color: #333333;
    }

    .input-wrap {
      display: flex;
      flex-direction: row;
      align-items: center;

      div {
        font-size: Px(48);
        color: #333333;
        line-height: Px(84);
      }

      input {
        height: Px(28);
        padding: Px(56) 0;
        width: Px(630);
        font-size: Px(84);
        outline: none;
        border: none;
      }

      .iosinput::-webkit-input-placeholder {
        /* WebKit browsers */
        transform: translateY(Px(28));
        font-size: Px(28);
      }

      .iosinput:-moz-placeholder {
        /* Mozilla Firefox 19+ */
        transform: translateY(Px(28));
        font-size: Px(28);
      }

      .iosinput::-moz-placeholder {
        transform: translateY(Px(28));
        font-size: Px(28);
      }

      .iosinput:-ms-input-placeholder {
        /* Internet Explorer 10+ */
        transform: translateY(Px(28));
        font-size: Px(28);
      }

      .andinput::-webkit-input-placeholder {
        /* WebKit browsers */
        transform: translateY(Px(-16));
        font-size: Px(28);
      }

      .andinput:-moz-placeholder {
        /* Mozilla Firefox 19+ */
        transform: translateY(Px(-16));
        font-size: Px(28);
      }

      .andinput::-moz-placeholder {
        transform: translateY(Px(-16));
        font-size: Px(28);
      }

      .andinput:-ms-input-placeholder {
        /* Internet Explorer 10+ */
        transform: translateY(Px(-16));
        font-size: Px(28);
      }
    }
  }

  .discount-wrap {
    margin-top: Px(20);
    padding: 0 Px(20);
    background: #fff;

    .discount-type-wrap {
      display: flex;
      padding: Px(24) 0;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #E9E9E9;

      .discount-type {
        display: flex;
        flex-direction: row;
        align-items: center;

        div {
          font-size: Px(28);
          color: #333333;
        }

        div>img {
          display: block;
          margin-right: Px(14);
          width: Px(32);
        }
      }

      .more-wrap {
        display: flex;
        flex-direction: row;
        align-items: center;

        div {
          font-size: Px(28);
          color: #F56A01;
        }

        div>img {
          display: block;
          margin-left: Px(20);
          width: Px(12);
        }
      }
    }

    .fee-wrap {
      padding: Px(40) 0;
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .fee-tit {
        font-size: Px(32);
        color: #333333;
      }

      .fee-num {
        font-size: Px(36);
        color: #F56A01;
      }
    }
  }

  .btn {
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

  .popmask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .5);
  }

  .pop {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 0 Px(20) Px(60);
    background: #fff;

    .pop-tit {
      height: Px(120);
      line-height: Px(120);
      font-size: Px(36);
      font-weight: 600;
    }

    .count-list {
      // height: Px(400);
      // overflow-y: scroll;
      // -webkit-overflow-scrolling: touch;
    }

    .count-list .clist-item {
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      height: Px(100);
      border-bottom: 1px solid #E9E9E9;

      .count-desc {
        font-size: Px(28);
        color: #333333;
      }

      .count-radio>img {
        display: block;
        width: Px(44);
      }
    }
  }

  .gray {
    background: #999999;
  }

  .slide-enter-active {
    transition: all .5s ease;
  }

  .slide-leave-active {
    transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-enter,
  .slide-leave-to {
    transform: translateY(Px(600));
  }

  .fade-enter-active {
    transition: opacity .5s;
  }

  .fade-leave-active {
    transition: opacity .8s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  .recharge {
    font-size: Px(28);
    color: #666666;
    text-align: center;
    margin-top: Px(30);

  }

  .aten {
    width: Px(24);

  }


</style>
