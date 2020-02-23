<template>
  <div class="container" v-show="showPage">
    <div class="ban"></div>
    <div class="card-wrap">
      <div class="card-top">
        <img src="../../assets/oil.png" alt>
        <div>四川省中石油{{detailinfo&&detailinfo.Title}}</div>
      </div>
      <img class="card-device" src="../../assets/card-device.png" alt>
      <div class="card-con">
        <div class="money">
          <span>￥</span>
          <span class="num">{{(detailinfo&&(detailinfo.Amount/100).toFixed(2)) || 0}}</span>
        </div>
        <div class="qr-wrap" v-show="showQrcode && (detailinfo&&detailinfo.IsRefund) == 0">
          <qrcode class="qrcode" :size="qrSize" :value="qrcodeVal" type="img"></qrcode>
        </div>
        <div class="btn use"
          :class="((detailinfo&&detailinfo.IsRefund) != 0 || (detailinfo&&detailinfo.Status) == 1)?'gray':''"
          v-show="(!showQrcode && (detailinfo&&detailinfo.IsRefund) == 0) || (detailinfo&&detailinfo.Status) == 1"
          @click="toUse">{{(detailinfo&&detailinfo.Status) == 1 ? '已核销':'立即使用'}}</div>
        <div class="btn backmoney" v-show="(detailinfo&&detailinfo.Status) == 0"
          :class="(detailinfo&&detailinfo.IsRefund) != 0?'isgray':''" @click="btnBackMoney">
          {{(detailinfo&&detailinfo.IsRefund) == 0 ? '申请退款': (detailinfo&&detailinfo.IsRefund) == 1 ? '退款中': (detailinfo&&detailinfo.IsRefund) == 2 ? '已退款':'已关闭'}}
        </div>
      </div>
      <div class="card-bottom">
        <span class="tip"></span>
        加油券不找零，不可拆分使用
      </div>
    </div>
    <div class="rule">
      <div class="rule-tit">加油券使用规则</div>
      <div class="rule-item">
        <span></span>本券适用于四川省所有中石油加油站。
      </div>
      <div class="rule-item">
        <span></span>加油券可叠加使用。
      </div>
      <div class="rule-item">
        <span></span>加油券未使用可随时申请退款。
      </div>
    </div>
    <div class="masks" v-show="showpop"></div>
    <div class="pop" v-show="showpop">
      <div class="pop-tit">提示</div>
      <div class="pop-con">申请退款{{(detailinfo&&(detailinfo.FeePayment/100).toFixed(2)) || 0}}元</div>
      <div class="pop-btn-wrap">
        <div @click="cancel">取消</div>
        <div class="confirm" @click="confirm">确认</div>
      </div>
    </div>
  </div>
</template>
<script>
  import {Qrcode } from 'vux';
  import axios from 'axios'
  import Qs from 'qs'
  export default {
    components: {
      Qrcode
    },
    data() {
      return {
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
        showQrcode: false,
        showpop: false,
        detailinfo: null,
        qrcodeVal: '',
        websock: null,
        scoketUrl: 'wss://api.cheyuu.com:39995',
        showPage: false
      };
    },
    computed: {
      qrSize() {
        return (document.body.clientWidth / 750) * 168 * 2;
      },
      couponCode() {
        return this.$route.query.couponCode;
      },
      access_token() {
        return (
          this.$store.state.token.access_token ||
          localStorage.getItem('access_token')
        )
      },
      refresh_token() {
        return this.$store.state.token.refresh_token || localStorage.getItem('refresh_token')
      },
      userinfo() {
        return this.$store.state.token.userinfo || localStorage.getItem('userinfo')
      }
    },
    mounted() {
      if (!this.access_token) {
        this.getToken()
      } else {
        this.$nextTick(() => {
          this.getuserinfo()
        })
      }
    },
    destroyed() {
      this.websocketclose() // 离开路由之后断开websocket连接
    },
    methods: {
      toUse() {
        if (this.detailinfo && this.detailinfo.IsRefund == 0 && this.detailinfo.Status == 0) {
          this.useCoupon()
        }
      },
      btnBackMoney() {
        if (this.detailinfo && this.detailinfo.IsRefund == 0) {
          this.showpop = true;
        }
      },
      cancel() {
        this.showpop = false;
      },
      confirm() {
        this.$http.post('/v2/order/cnpcrefund?access_token=' + this.access_token, {
          couponCode: this.couponCode
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
            this.$vux.toast.show({
              type: 'success',
              text: '已提交退款申请'
            })
            this.getDetail()
            this.showpop = false
          }
        })
      },
      getDetail() {
        this.$http.get('/v1/zhongyou/cnpccoupon?access_token=' + this.access_token, {
          couponCode: this.couponCode
        }, this.baseUrl).then(data => {
          console.log(data);
          if (data.error) {
            if (data.error.code != 401) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              });
            }
          } else {
            if (data) {
              this.detailinfo = data
              if (data.ElecCouponCode != undefined && data.ElecCouponCode != '' && data.ElecCouponCode != null &&
                data.Status == 0) {
                this.qrcodeVal = data.ElecCouponCode
                this.showQrcode = true
                this.initWebSocket()
              } else {
                this.showQrcode = false
                if (this.websock) {
                  this.websocketclose()
                }
              }
            }
          }
        });
      },
      useCoupon() {
        this.$http.post('/v1/zhongyou/buycouponcode?access_token=' + this.access_token, {
          couponCode: this.couponCode
        }, this.baseUrl).then(data => {
          console.log(data);
          if (data.error) {
            if (data.error.code != 401) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              });
            }
          } else {
            if (data.elecCouponCode) {
              this.qrcodeVal = data.elecCouponCode
              this.showQrcode = true
              this.initWebSocket()
            }
          }
        });
      },
      initWebSocket() { // 初始化weosocket
        if ('WebSocket' in window) {
          this.websock = new WebSocket(this.scoketUrl);
          this.websock.onmessage = this.websocketonmessage;
          this.websock.onopen = this.websocketonopen;
          this.websock.onerror = this.websocketonerror;
          this.websock.onclose = this.websocketclose;
          console.log('window==', this.websock)
        } else {
          console.log('浏览器不支持WebSocket')
        }
      },
      websocketonopen() { // 连接建立之后执行send方法发送数据
        console.log('连接服务')
        var uid = JSON.parse(localStorage.getItem('userinfo')).UID
        var data = {
          uid: uid
        };
        console.log(data)
        this.websocketsend(JSON.stringify(data));
      },
      websocketonerror(e) { // 连接建立失败重连
        console.log('连接失败，重连', e)
        // this.initWebSocket();
      },
      websocketonmessage(e) { // 数据接收
        console.log('数据接收:', e.data);
        const redata = JSON.parse(e.data);
        console.log(redata)
        if (redata.status) {
          this.$router.push({
            name: 'result'
          })
        }
      },
      websocketsend(Data) { // 数据发送
        console.log('发送数据')
        this.websock.send(Data);
      },
      websocketclose(e) { // 关闭
        console.log('断开连接', e);
      },
      getToken() {
        this.$http.post('/v1/authentication/grant', {
          client_id: 'wechat_mobile_app',
          client_secret: '26a8a646db0c94b41141ca563be87876',
          grant_type: 'client_credentials'
        }, this.baseUrl, false).then(data => {
          console.log(data)
          if (data.error) {
            this.$vux.toast.show({
              type: 'warn',
              text: data.data.error.message
            })
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            this.$store.dispatch('setAccessToken', '')
            this.$store.dispatch('setRefreshToken', '')
            // this.getToken()
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
          ? `https://test.m.cheyuu.com/html/sheep/index.html#/detail?couponCode=${this.couponCode}&v=${v}`
          : `https://m.cheyuu.com/html/sheep/index.html#/detail?couponCode=${this.couponCode}&v=${v}`
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
            localStorage['userinfo'] = JSON.stringify(data);
            this.$store.dispatch('setUserinfo', JSON.stringify(data))
            this.$store.dispatch('setAccessToken', access_token)
            this.$store.dispatch('setRefreshToken', refresh_token)
            this.getDetail()
          } else {
            this.getToken()
          }
        })
      }
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
    width: 100%;
    height: Px(310);
    background-image: linear-gradient(-180deg, #f46b02 0%, #fa9f02 100%);
  }

  .card-wrap {
    width: Px(710);
    margin: Px(-270) auto 0;

    .card-top {
      width: 100%;
      height: Px(88);
      background: #fafafa;
      border-radius: Px(6) Px(6) 0 0;

      img {
        display: block;
        float: left;
        margin: Px(5) Px(10);
        width: Px(78);
      }

      div {
        float: left;
        line-height: Px(88);
        font-size: Px(32);
        color: #666666;
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

</style>
