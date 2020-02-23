/* eslint-disable eqeqeq */
<template>
  <div class="container" v-show="showPage">
    <div class="money-wrap">
      <div class="money-tit">加油金额</div>
      <div class="input-wrap">
        <div>￥</div>
        <input :class="isAndro?'andinput':'iosinput'" type="number" v-model="money" @input="changeInput"
          placeholder="输入充值金额">
      </div>
    </div>
    <div class="discount-wrap">
      <div class="discount-type-wrap" @click="clickSecDis">
        <div class="discount-type">
          <div><img src="../../assets/ico-hui.png" alt=""></div>
          <div>{{(uiPromotionList && uiPromotionList[discountType] && uiPromotionList[discountType].Title) || ''}}</div>
        </div>
        <div class="more-wrap">
          <div>{{-(uiPromotionList && uiPromotionList[discountType] && uiPromotionList[discountType].Reduce) || ''}}
          </div>
          <div><img src="../../assets/more.png" alt=""></div>
        </div>
      </div>
      <div class="fee-wrap">
        <div class="fee-tit">实付金额</div>
        <div class="fee-num">￥{{fee}}</div>
      </div>
    </div>
    <div class="btn" :class="isGray ? 'gray':''" @click="clickpay">立即支付</div>
    <transition class="fade">
      <div class="popmask" v-show="popShow"></div>
    </transition>
    <transition name="slide">
      <div class="pop" v-show="popShow">
        <div class="pop-tit">优惠选择</div>
        <scroller lock-x :height="Height">
          <div class="count-list">
            <div class="clist-item" v-for="(item,index) in uiPromotionList" :key="index" @click="secDiscount(index)">
              <div class="count-desc">{{item.Title}}</div>
              <div class="count-radio">
                <img
                  :src="discountType == index ? require('../../assets/radio-on.png'):require('../../assets/radio-un.png')">
              </div>
            </div>
          </div>
        </scroller>
        <div class="btn" @click="closePop">关闭</div>
      </div>
    </transition>
  </div>
</template>
<script>
  import {Scroller } from 'vux';
  import axios from 'axios'
  import Qs from 'qs'
  export default {
    data() {
      return {
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
        popShow: false,
        discountType: 0,
        promotionList: [], // 优惠券 接口拿到的
        couponList: [], // 卡券列表 接口拿到的
        uiPromotionList: [], // ui显示的活动列表
        uiCouponList: [], // ui显示的卡券列表
        money: '', // 输入金额
        fee: 0, // 实付金额
        showPage: false
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
      contactID() {
        return this.$route.query.contactID
      },
      partnerID() {
        return this.$route.query.partnerID
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
        return !!((this.money == '' || (Number(this.money) <= 0)))
      },
      isAndro() {
        let u = navigator.userAgent,
          app = navigator.appVersion;
        let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; // android终端或者uc浏览器
        let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
        return isAndroid == true;

      }
    },
    components: {
      Scroller
    },
    methods: {
      // 点击支付按钮
      clickpay() {
        if (this.isGray) {
          return false
        }
        this.createOrder()
      },
      // 点击选择优惠券，显示弹窗
      clickSecDis() {

        if (this.money != '' || Number(this.money) > 0) {
          if (this.uiPromotionList.length > 1) {
            this.popShow = true
          }
        }
      },
      // 输入时
      changeInput() {
        this.discountType = 0
        if (this.money == '') {
          this.fee = 0
          this.biggestPreferential(0)
        } else {
          this.fee = Number(this.money)
          this.biggestPreferential(Number(this.money))
          if (this.discountType == this.uiPromotionList.length - 1) { // 不选择优惠
            this.fee = Number(this.money)
          } else {
            this.fee = Number(this.money) - Number(this.uiPromotionList[this.discountType].Reduce)
          }
        }
      },
      // 关闭弹窗时
      closePop() {
        if (this.discountType == this.uiPromotionList.length - 1) { // 不选择优惠
          this.fee = Number(this.money)
        } else {
          this.fee = Number(this.money) - Number(this.uiPromotionList[this.discountType].Reduce)
        }
        this.popShow = false
      },
      // 选择某条优惠券
      secDiscount(index) {
        this.discountType = index
      },
      // 筛选优惠列表
      biggestPreferential(fee) {
        let temp = {
          Title: '不使用优惠'
        }
        var legalPromotionList = []; /* 合法的活动列表 */
        var legalCouponList = []; /* 优惠劵对应的列表 */
        // 我们要根据金额筛选合法的活动列表和卡券列表
        if (this.promotionList.length > 0) {
          this.promotionList.forEach((val, key) => {
            if (fee >= parseFloat(val.AmountMin) && fee < parseFloat(val.AmountMax)) {
              legalPromotionList.push(val);
            }
          });
        }
        this.uiPromotionList = legalPromotionList;
        if (this.couponList.length > 0) {
          this.couponList.forEach((val, key) => {
            if (fee >= parseFloat(val.AmountMin) && fee < parseFloat(val.AmountMax)) {
              legalCouponList.push(val);
            }
          });
        }
        this.uiCouponList = legalCouponList;
        // 暂时将 优惠列表 和 活动优惠列表合并
        let list = this.uiPromotionList.concat(this.uiCouponList)
        this.uiPromotionList = list
        this.uiPromotionList.push(temp)
      },
      // 支付接口 获取支付的 字段对象
      toPayOut(orderCode) {
        this.$http.post('/v2/pay/payout?access_token=' + this.access_token, {
          orderCode: orderCode,
          scene: 'CNPC'
        }, this.baseUrl).then(data => {
          if (data.error) {
            if (data.error.code != 401) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else {
            console.log('dataPayType==', data);
            let PayType = data.PayType
            console.log('PayType==', PayType);
            let jssdkParamsStr = data.SdkParams
            if (PayType == 'AliOffcially') {
              this.needCallAliPay(jssdkParamsStr.trade_no)
            } else {
              let jssdkParams = JSON.parse(jssdkParamsStr)
              if (this.$isTest) {
                this.paySuc(orderCode)
              } else {
                this.needCallPay2(jssdkParams)
              }
            }

          }
        })
      },
      // 支付宝支付
      needCallAliPay(outTradeNo) {
        if (window.AlipayJSBridge) {
          this.aliCallPay(outTradeNo);
        } else {
          // 如果没有注入则监听注入的事件
          document.addEventListener('AlipayJSBridgeReady', () => {
            this.aliCallPay(outTradeNo);
          }, false)
        }
      },
      // 支付宝支付
      aliCallPay(tradeNo) {
        AlipayJSBridge.call('tradePay', {
          tradeNO: tradeNo
        }, res => {
          // alert(JSON.stringify(res));
          if (res.resultCode == '9000') {
            location.href = this.$isTest ? 'https://test.m.cheyuu.com/account/couponlist'
            : 'https://m.cheyuu.com/account/couponlist'
          } else if (res.resultCode != '6001') {
            this.$vux.toast.show({
              type: 'warn',
              text: '支付失败'
            })
          }
        });
      },
      // 微信支付
      needCallPay2(jssdkParams) {
        if (typeof (WeixinJSBridge) === 'undefined') {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', () => {
              this.wxCallPay2(jssdkParams);
            }, false);
          } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', () => {
              this.wxCallPay2(jssdkParams);
            });
            document.attachEvent('onWeixinJSBridgeReady', () => {
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
          res => {
            if (res.err_msg != 'get_brand_wcpay_request:ok') {
              WeixinJSBridge.invoke('closeWindow', {}, e => {});
            } else {
              // 跳到券列表
              location.href = this.$isTest ? 'https://test.m.cheyuu.com/account/couponlist'
              : 'https://m.cheyuu.com/account/couponlist'
            }
          }
        );
      },
      // 模拟支付成功
      paySuc(orderCode) {
        this.$http.post('/v2/pay/cibnotificationfake?access_token=' + this.access_token, {
          orderCode: orderCode
        }, this.baseUrl).then(data => {
          console.log(data)
          if (data.error) {
            if (data.error.code != 401) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else {
            if (data == 'success') {
              // 跳到券列表
              location.href = this.$isTest ? 'https://test.m.cheyuu.com/account/couponlist'
              : 'https://m.cheyuu.com/account/couponlist'
            }
          }
        })
      },
      // 创建订单接口
      createOrder() {
        let couponID = ''
        let promotion = ''
        if (this.uiPromotionList.length > 1) {
          if (this.discountType != (this.uiPromotionList.length - 1)) { // 选择了优惠券
            if (!this.uiPromotionList[this.discountType].ID) {
              promotion = (this.uiPromotionList[this.discountType].PromotionID) + '~' + (this.uiPromotionList[this
                .discountType].RuleID)
            } else {
              couponID = this.uiPromotionList[this.discountType].ID
            }
          }
        }
        console.log('couponID##promotion:', couponID, promotion)
        this.$http.post('/v2/order/createcnpcorder?access_token=' + this.access_token, {
          partnerID: this.partnerID,
          contactID: this.contactID,
          feeTotal: Number(this.money) * 100,
          couponID: couponID == '' ? 0 : Number(couponID), // 优惠券信息.
          promotion: promotion, // 优惠卷规则.
          quickPay: '15',
          scene: 'cnpc'
        }, this.baseUrl).then(data => {
          console.log(data)
          if (data.error) {
            if (data.error.code != 401) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else {
            this.toPayOut(data.orderCode)
            // if (this.$isTest) {
            //   this.paySuc(data.orderCode)
            // } else {
            //   this.toPayOut(data.orderCode)
            // }
          }
        })
      },
      // 获取优惠列表
      getDisTypeList() {
        this.$http.get('/v2/order/promotionlist?access_token=' + this.access_token, {
          quickPay: '15',
          partnerID: this.partnerID,
          scene: 'JY'
        }, this.baseUrl).then(data => {
          console.log('总优惠列表===', data)
          if (data.error) {
            if (data.error.code != 401) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else {
            this.uiPromotionList = data.PromotionList, // ui显示可用的活动列表
              this.uiCouponList = data.CouponList
            this.promotionList = data.PromotionList
            this.couponList = data.CouponList
            if (this.money != '') {
              if (Number(this.money) > 0) {
                this.biggestPreferential(Number(this.money))
              }
            } else {
              this.biggestPreferential(0)
            }
          }
        })
      },
      getToken() {
        this.$http.post('/v1/authentication/grant', {
          client_id: 'wechat_mobile_app',
          client_secret: '26a8a646db0c94b41141ca563be87876',
          grant_type: 'client_credentials'
        }, this.baseUrl, false).then(data => {
          if (data.error) {
            this.$vux.toast.show({
              type: 'warn',
              text: data.data.error.message
            })
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            this.$store.dispatch('setAccessToken', '')
            this.$store.dispatch('setRefreshToken', '')
            this.getToken()
          } else { // 请求成功
            let access_token = data.access_token
            let refresh_token = data.refresh_token
            localStorage['access_token'] = access_token;
            localStorage['refresh_token'] = refresh_token;
            this.$store.dispatch('setAccessToken', access_token)
            this.$store.dispatch('setRefreshToken', refresh_token)
            this.$nextTick(() => {
              this.login()
            })
          }
        })
      },
      login() {
        let v = new Date().getTime()
        this.$http.post('/v1/authentication/loginwechat?access_token=' + this.access_token, {
          wechatIdentity: 'oil',
          redirectUrl: this.$isTest
          ? `https://test.m.cheyuu.com/html/sheep/index.html#/?contactID=${this.contactID}&partnerID=${this.partnerID}&v=${v}`
          : `https://m.cheyuu.com/html/sheep/index.html#/?contactID=${this.contactID}&partnerID=${this.partnerID}&v=${v}`
        }, this.baseUrl, false).then(data => {
          if (data.redirectUrl) {
            location.href = data.redirectUrl
          }

        })
      },
      // 获取用户信息，判断token是否登录
      getuserinfo() {
        let access_token = localStorage.getItem('access_token')
        let refresh_token = localStorage.getItem('refresh_token')
        axios({
          url: this.baseUrl + '/v1/members/loginuserinfo?access_token=' + access_token,
          method: 'get'
        }).then(({
          data
        }) => {
          if (Number(data.UID) > 0) {
            this.showPage = true
            console.log('showpage===', this.showPage)
            localStorage['userinfo'] = JSON.stringify(data);
            this.$store.dispatch('setUserinfo', JSON.stringify(data))
            this.$store.dispatch('setAccessToken', access_token)
            this.$store.dispatch('setRefreshToken', refresh_token)
            console.log('store:', this.$store.state.token)
            this.getDisTypeList()
          } else {
            this.getToken()
          }
        })
      }
    },
    mounted() {
      // this.biggestPreferential(0)
      if (!this.access_token) {
        this.getToken()
      } else {
        this.$nextTick(() => {
          this.getuserinfo()
        })
      }
    }

  }

</script>
<style lang="scss" scoped>
  @import '../../styles/variable.scss';

  .container {
    min-height: 100vh;
    background: #F5F5F5;
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

</style>
