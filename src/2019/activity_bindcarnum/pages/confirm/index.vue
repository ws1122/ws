<template>
  <div class="container" v-show="showPage">
    <div class="banner">
      <img class="bgcar" src="./images/car.png" alt="">
      <div class="ban-txt-wrap">
        <div class="ban-txt">
          尊敬的
          <span class="carnum">{{licensePlate}}</span>
          车主用户
        </div>
        <div class="banner-extra" v-if="pay == 0">
          <div class="tit">您即将绑定、使用</div>
          <div class="txt">车友网“车牌付”功能</div>
        </div>
      </div>
    </div>
    <div class="wrap" v-if="pay == 1">
      <div class="tit">您即将绑定、使用</div>
      <div class="txt">车友网“车牌付”功能</div>
    </div>
    <div class="wrap margin10" v-if="pay == 1">
      <div class="title">如何使用车友网“车牌付”加油</div>
      <div class="tip margintop12">加油时，告诉加油员选择“车牌付”加油；</div>
      <div class="tip">加油后，点击公众号推送订单，确认订单并付款；</div>
    </div>
    <div class="wrap margin10" v-if="pay == 0">
      <div class="paytitle">如何使用车友网“车牌付”加油</div>
      <div class="payimg-wraps">
        <img class="pay-pic" src="./images/oil-pre.png" alt="">
        <img class="pay-pic" src="./images/oil-next.png" alt="">
      </div>
      <div class="bottom-tip">使用功能暂未开放，敬请期待···</div>
    </div>
    <div class="wrap margin10" v-if="pay == 1">
      <div class="title width140">本次绑定您将获得</div>
      <div class="image-wrap">
        <div><img class="img-pic" src="./images/ticket-jiayou2.png" alt=""></div>
        <div><img class="img-pic" src="./images/ticket-xiche.png" alt=""></div>
      </div>
      <div class="extra">您将同时将享有车牌付其他优惠活动</div>
    </div>
    <div class="wrap margin10" v-if="pay == 0">
      <div class="image-wrap">
        <div class="marleft">
          <div class="img-tit">本次绑定您将获得</div>
          <div class="img-txt"><span></span>免费洗车券1张 <span></span><span class="opa4"></span><span class="opa1"></span>
          </div>
        </div>
        <div class="marright"><img class="img-pic" src="./images/ticket-xiche.png" alt=""></div>
      </div>
    </div>
    <div class="submit-btn" @click="subClick" v-if="pay == 1">确定绑定</div>
    <div class="submit-btn" :class="canDoSub ? '':'gray'" @click="paySubClick" v-if="pay == 0">{{subTxt}}</div>
    <div class="popmask" v-show="showAlert">
      <div class="pop">
        <div class="pop-txt">绑定成功</div>
      </div>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import Qs from 'qs'
  export default {
    data() {
      return {
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
        subTxt: '确定绑定',
        canDoSub: true,
        showAlert: false,
        showPage: false
      }
    },
    computed: {
      licensePlate() {
        return this.$route.query.licensePlate
      },
      contactID() {
        return this.$route.query.contactID
      },
      pay() {
        return this.$route.query.pay
      },
      randomCode() {
        return this.$route.query.cheyoo_random_code || ''
      },
      access_token() {
        return this.$store.state.token.access_token || localStorage.getItem('access_token')
      },
      refresh_token() {
        return this.$store.state.token.refresh_token || localStorage.getItem('refresh_token')
      },
      userinfo() {
        return this.$store.state.token.userinfo || localStorage.getItem('userinfo')
      }
    },
    mounted() {
      this.checkLinkIsOk()
      // if (!this.access_token) {
      //   this.getToken()
      // } else {
      //   this.getuserinfo()
      // }   
    },
    methods: {
      subClick() {
        this.saveCarNumber()
      },
      paySubClick() {
        if (!this.canDoSub) {
          return false
        } else {
          this.saveCarNumber()
        }
      },
      // 让链接失效
      giveUpLink() {
        this.$http.post('/v1/common/delbrokenlink?access_token=' + this.access_token, {
          randomCode: this.randomCode
        }, this.baseUrl).then((data) => {
          console.log(data)
          if (this.pay == 1) {
            this.$router.push({
              name: 'result',
              query: {
                flag: 1
              }
            })
          } else {
            this.canDoSub = false
            this.subTxt = '绑定成功'
            this.showAlert = true
            setTimeout(() => {
              this.showAlert = false
            }, 2000)
          }
        })
      },
      // 绑定接口 
      saveCarNumber() {
        this.$http.post('/v2/carwash/bindinglicense?access_token=' + this.access_token, {
          licensePlate: this.licensePlate,
          contactID: this.contactID
        }, this.baseUrl).then((data) => {
          console.log('updatelicenseplatenumber==', data)
          if (data.error) {
            if (data.error.code != 401) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else { // 请求成功
            if (data.result != '') {
              this.giveUpLink()
            }
          }
        })
      },
      getToken() {
        this.$http.post('/v1/authentication/grant', {
          client_id: 'wechat_mobile_app',
          client_secret: '26a8a646db0c94b41141ca563be87876',
          grant_type: 'client_credentials'
        }, this.baseUrl, false).then((data) => {
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
            //this.getToken()
          } else { // 请求成功
            let access_token = data.access_token
            let refresh_token = data.refresh_token
            localStorage['access_token'] = access_token;
            localStorage['refresh_token'] = refresh_token;
            this.$store.dispatch('setAccessToken', access_token)
            this.$store.dispatch('setRefreshToken', refresh_token)
            console.log('before:', access_token)
            this.$nextTick(() => {
              this.login()
            })
          }
        })
      },
      login() {
        let timestamp = new Date().getTime()
        this.$http.post('/v1/authentication/loginwechat?access_token=' + this.access_token, {
          wechatIdentity: 'oil',
          redirectUrl: this.$isTest ?
            `http://test.m.cheyuu.com/html/bindcarnum/index.html#/?licensePlate=${this.licensePlate}&contactID=${this.contactID}&pay=${this.pay}&cheyoo_random_code=${this.randomCode}&isBing=${this.isBing}&v=${timestamp}` :
            `https://m.cheyuu.com/html/bindcarnum/index.html#/?licensePlate=${this.licensePlate}&contactID=${this.contactID}&pay=${this.pay}&cheyoo_random_code=${this.randomCode}&isBing=${this.isBing}&v=${timestamp}`
        }, this.baseUrl, false).then((data) => {
            console.log('登录接口：', data)
            if (data.redirectUrl) {
              location.href = data.redirectUrl
            }
          }
        })
    },
    checkLinkIsOk() {
      this.$http.post('/v1/common/checkbrokenlink', {
        randomCode: this.randomCode
      }, this.baseUrl, false).then((data) => {
        console.log(data)
        if (data.result) { // 有效
          if (!this.access_token) {
            this.getToken()
          } else {
            this.getuserinfo()
          }
        } else { // 无效 跳转 404
          this.$router.replace({
            name: 'lose'
          })
        }
      })
    },
    // 获取用户信息，判断token是否登录
    getuserinfo() {
      axios({
        url: this.baseUrl + '/v1/members/loginuserinfo?access_token=' + this.access_token,
        method: 'get'
      }).then(({
        data
      }) => {
        if (Number(data.UID) > 0) {
          this.showPage = true
          localStorage['userinfo'] = JSON.stringify(data);
          this.$store.dispatch('setUserinfo', JSON.stringify(data))
        } else {
          this.getToken()
        }
      })
    }
  }
  }

</script>
<style lang="scss" scoped>
  @import '../../styles/variable.scss';

  .container {
    box-sizing: border-box;
    min-height: 100vh;
    background: #F5F5F5;
    padding-bottom: Px(30);
  }

  .banner {
    position: relative;
    height: Px(284);
    background-image: linear-gradient(180deg, #F46B02, #FA9F02);

    .ban-txt-wrap {
      box-sizing: border-box;
      position: absolute;
      width: 100%;
      padding: Px(24) Px(54) 0;
    }

    .ban-txt-wrap .ban-txt {
      text-align: center;
      font-size: Px(28);
      color: #FFFFFF;

      .carnum {
        font-size: Px(60);
        color: #FFFFFF;
        text-align: center;
      }
    }

    .bgcar {
      position: absolute;
      right: Px(14);
      top: Px(34);
      display: block;
      width: Px(166);
    }

    .banner-extra {
      margin-top: Px(10);
      width: 100%;

      .tit {
        font-size: Px(32);
        color: #FFFFFF;
        text-align: center;
      }

      .txt {
        font-size: Px(40);
        color: #FFFFFF;
        text-align: center;
      }
    }
  }

  .wrap {
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    margin: Px(-146) auto 0;
    width: Px(708);
    padding: Px(30) Px(10);
    background: #fff;
    border-radius: Px(20);

    &.margin10 {
      margin-top: Px(20);
    }

    .tit {
      font-size: Px(32);
      color: #333333;
      text-align: center;
    }

    .txt {
      font-size: Px(40);
      color: #FF6604;
      text-align: center;
      margin-top: Px(10);
    }

    .title {
      box-sizing: border-box;
      height: Px(48);
      width: Px(460);
      text-align: center;
      margin: 0 auto;
      line-height: Px(48);
      background: #FFF6E8;
      border-radius: Px(42);
      text-align: center;
      font-size: Px(28);
      color: #FF6604;

      &.width140 {
        width: Px(280);
      }
    }

    .tip {
      font-size: Px(28);
      color: #666666;
      margin: 0 Px(30);

      &.margintop12 {
        margin-top: Px(24);
      }
    }

    .image-wrap {
      margin-top: Px(30);
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      div>.img-pic {
        display: block;
        width: Px(332);

      }

      div>.img-tit {
        margin-top: Px(30);
        font-size: Px(32);
        color: #333333;
      }

      div>.img-txt {
        height: Px(40);
        line-height: Px(40);
        font-size: Px(28);
        color: #23B4F7;

        span {
          position: relative;
          top: Px(4);
          display: inline-block;
          margin-right: Px(4);
          height: Px(26);
          width: Px(6);
          background: #23B4F7;

          &.opa4 {
            opacity: 0.4;
          }

          &.opa1 {
            opacity: 0.1;
          }
        }
      }

      .marleft {
        margin-left: Px(20);
      }

      .marright {
        margin-right: Px(20);
      }
    }

    .extra {
      font-size: Px(28);
      color: #666666;
      margin-top: Px(30);
      text-align: center;
    }
  }

  .submit-btn {
    margin: Px(20) auto 0;
    width: Px(670);
    height: Px(88);
    line-height: Px(88);
    font-size: Px(32);
    color: #FFFFFF;
    background-image: linear-gradient(180deg, #FBA302, #F56A01);
    border-radius: Px(10);
    text-align: center;
  }

  .paytitle {
    position: relative;
    margin: 0 auto;
    width: Px(420);
    font-size: Px(28);
    color: #666666;
    text-align: center;
  }

  .paytitle::before {
    content: '';
    position: absolute;
    left: Px(-80);
    top: 50%;
    width: Px(64);
    border-top: 1px solid #DFDFDF;
  }

  .paytitle::after {
    content: '';
    position: absolute;
    right: Px(-80);
    top: 50%;
    width: Px(64);
    border-top: 1px solid #DFDFDF;
  }

  .payimg-wraps {
    margin-top: Px(30);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-bottom: Px(54);

    .pay-pic {
      flex: 1;
      display: block;
      width: Px(326);
      height: Px(304);
    }
  }

  .bottom-tip {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: Px(54);
    line-height: Px(54);
    font-size: Px(24);
    color: #FF6604;
    text-align: center;
    background: #FFF6E8;
    border-radius: 0 0 Px(20) Px(20);
  }

  .gray {
    background: #999999 !important;
  }

  .popmask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .5);

    .pop {
      background: #FFF;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: Px(500);
      height: Px(260);
      border-radius: Px(20);

      .pop-txt {
        text-align: center;
        font-size: Px(32);
        line-height: Px(260);
      }
    }
  }

</style>
