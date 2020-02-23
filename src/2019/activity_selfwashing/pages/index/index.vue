<template>
  <div v-show="showPage">
    <div class="container" v-if="hasdata == 1">
      <div class="ban">
        <img class="car" src="./images/car.png"/>
        <div class="ban-con">
          <div class="ban-tit">您将使用车友网自助洗车机</div>
          <div class="ban-txt">拥有洗车券 {{amount}} 张</div>
        </div>
      </div>
      <div class="wrap margintop">
        <div class="wrap-tit">选择自助洗，将为您启动洗车机</div>
        <div class="wrap-txt">使用<span>1</span>张洗车券，选择<span>自助洗</span></div>
        <div class="wrap-btn" :class="amount > 0 ? '':'gray'" @click="doBySelf">自助洗</div>
      </div>
      <div class="wrap">
        <div class="wrap-tit">选择帮洗，将由工作人员为您洗车</div>
        <div class="wrap-txt">使用<span>2</span>张洗车券，呼叫<span>帮洗</span></div>
        <div class="wrap-btn" :class="amount > 1 ? 'blue':'gray'"  @click="doByHelp">帮洗</div>
      </div>
      <div class="tip-wrap">
        <div><img src="./images/tip.png" alt=""></div>
        <div class="tips">
          <div>以下情况，将无法“呼叫”帮洗：</div>
          <div>1.洗车券数量不足两张；</div>
          <div>2.帮洗人员暂未到岗；</div>
          <div>3.该功能暂未开放。</div>
        </div>
      </div>
    </div>
    <div class="nodata-wrap" v-if="hasdata == 2">
      <img src="./images/ticket.png" alt="">
      <div>无可用洗车券</div>
    </div>
    <!-- <div class="popmask" v-show="popshow">
      <div class="pop">
        <div class="pop-tit">{{tips}}</div>
        <div class="pop-con">
          <div>请返回使用自助洗功能</div>
          <div>敬请谅解</div>
        </div>
        <div class="pop-btn" @click="closePop">我知道了</div>
      </div>
    </div> -->
  </div>
</template>

<script>
  import axios from 'axios'
  // import Qs from 'qs'
  export default {
    data() {
      return {
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
        hasdata: 0, // 0 加载中，1 表示有数据，2表示没数据
        popshow: false,
        amount: 0, // 洗车券数量
        // tips: '该功能暂不可用' // '帮洗人员暂未到岗'
        showPage: false
      }
    },
    computed: {
      access_token() {
        return this.$store.state.token.access_token || localStorage.getItem('access_token')
      },
      refresh_token() {
        return this.$store.state.token.refresh_token || localStorage.getItem('refresh_token')
      },
      userinfo() {
        return this.$store.state.token.userinfo || localStorage.getItem('userinfo')
      },
      devCode() {
        return this.$route.query.devcode
      }
    },
    methods: {
      closePop() {
        this.popshow = false
      },
      // 自己洗
      doBySelf() {
        if (this.amount < 0) {
          return false
        }
        this.selfWash()
      },
      // 帮洗
      doByHelp() {
        if (this.amount < 2) {
          return false
        }
        this.helpWash()
      },
      // 获取洗车券数量
      getAmount() {
        this.$http.get('/v1/coupons/freecarwashamount?access_token=' + this.access_token, {}, this.baseUrl).then(data => {
          if (data.error) {
            if (data.error.code !== 401) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else {
            this.amount = data.result
            if (data.result <= 0) {
              this.hasdata = 2
              this.$nextTick(() => {
                document.title = '无洗车券'
              })
            } else {
              this.hasdata = 1
              this.$nextTick(() => {
                document.title = '启动页'
              })
            }
          }
        })
      },
      // 自助洗车接口
      selfWash() {
        this.$http.post('/v2/carwash/carwashbyself?access_token=' + this.access_token, {
          devCode: this.devCode
        }, this.baseUrl).then(data => {
          console.log(data)
          if (data.error) {
            if (data.error.code !== 401) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else {
            this.$router.push({name: 'tips'})
          }
        })
      },
      // 帮洗车接口
      helpWash() {
        this.$http.post('/v2/carwash/carwashbycontact?access_token=' + this.access_token, {
          devCode: this.devCode
        }, this.baseUrl).then(data => {
          console.log(data)
          if (data.error) {
            if (data.error.code !== 401) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else {
            this.$router.push({name: 'call'})
          }
        })
      },
      getToken() {
        this.$http.post('/v1/authentication/grant', {
          client_id: 'wechat_mobile_app',
          client_secret: '26a8a646db0c94b41141ca563be87876',
          grant_type: 'client_credentials'
        }, this.baseUrl).then(data => {
          console.log(data)
          if (data.error) {
            this.$vux.toast.show({type: 'warn', text: data.data.error.message})
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
        let timestamp = new Date().getTime()
        this.$http.post('/v1/authentication/loginwechat?access_token=' + this.access_token, {
          wechatIdentity: 'oil',
          redirectUrl: this.$isTest ? `http://test.m.cheyuu.com/html/selfwashing/index.html#/?devcode=${this.devCode}&v=${timestamp}` : `https://m.cheyuu.com/html/selfwashing/index.html#/?devcode=${this.devCode}&v=${timestamp}`
        }, this.baseUrl).then(data => {
          console.log('登录接口：', data)
          if (data.redirectUrl) {
            location.href = data.redirectUrl
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
            localStorage['userinfo'] = JSON.stringify(data);
            this.$store.dispatch('setUserinfo', JSON.stringify(data))
            console.log('store:', this.$store.state.token)
            // / 执行页面的列表 到这里已经授权了
            this.getAmount()
            this.showPage = true
          } else {
            this.getToken()
          }
        })
      }
    },
    mounted() {
      // 开始对接口时 可以打开执行下面的方法。
      if (!this.access_token) {
        this.getToken()
      } else {
        this.getuserinfo()
      }
    }
  }
</script>
<style lang="scss" scoped>
 @import '../../styles/variable.scss';
 .container {
   position: relative;
   overflow: hidden;
   min-height: 100vh;
   width: 100%;
   background: #f5f5f5;
 }
 .ban {
   position: relative;
   height: Px(284);
   width: 100%;
   background-image: linear-gradient(-180deg, #F46B02 0%, #FA9F02 100%);
   .car {
      position: absolute;
      right: Px(14);
      top: Px(34);
      display: block;
      width: Px(166);
      z-index: 1;
   }
   .ban-con {
     overflow: hidden;
     position: absolute;
     left: 0;
     top: Px(40);
     z-index: 2;
     width: 100%;
     .ban-tit {
       font-size: Px(40);
       color: #FFFFFF;
       text-align: center;
     }
     .ban-txt {
       margin-top: Px(10);
       font-size: Px(32);
       color: #FFFFFF;
       text-align: center;
     }
   }
 }
 .wrap {
    position: relative;
    overflow: hidden;
    padding: Px(40) 0;
    margin: Px(20) Px(20) Px(0) Px(20);
    background: #FFFFFF;
    box-shadow: 0 1px Px(20) 0 rgba(0,0,0,0.06);
    border-radius: Px(20);
    width: Px(710);
    &.margintop {
      margin-top: Px(-90);
    }
    .wrap-tit {
      text-align: center;
      font-size: Px(32);
      color: #333333;
    }
    .wrap-txt {
      margin-top: Px(10);
      text-align: center;
      font-size: Px(28);
      color: #666666;
      span {
        color: #F46B02;
      }
    }
    .wrap-btn {
      margin: Px(40) auto 0;
      width: Px(300);
      height: Px(88);
      text-align: center;
      line-height: Px(88);
      background-image: linear-gradient(-180deg, #FBA302 0%, #F56A01 100%);
      border-radius: Px(10);
      font-size: Px(32);
      color: #FFFFFF;
      &.blue {
        background-image: linear-gradient(-180deg, #32DCFF 0%, #18A7EA 97%);
      }
    }
 }
 .tip-wrap {
   margin: Px(40) Px(20) 0;
   display: flex;
   flex-direction: row;
   div > img {
     display: block;
     width: Px(30);
     margin-right: Px(10);
     margin-top: Px(5)
   }
   .tips > div {
     font-size:Px(28);
     color: #999999;
   }
 }
 .gray {
   background: #999999!important;
 }
 .nodata-wrap {
   position: relative;
   overflow: hidden;
   min-height: 100vh;
   width: 100%;
   background: #ffffff;
    img {
      display: block;
      width: Px(320);
      margin: Px(140) auto;
    }
    div {
      font-size: Px(36);
      text-align: center;
      color: #333333;
    }
 }
 .popmask {
   position: fixed;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   background: rgba(0,0,0,.5);
   .pop {
     padding-top: Px(40);
     position: absolute;
     left: 50%;
     top: 50%;
     transform: translate(-50%,-50%);
     background: #FFFFFF;
     border-radius: Px(30);
     width: Px(610);
     .pop-tit {
        font-size: Px(36);
        color: #282828;
        text-align: center;
     }
     .pop-con {
        margin-top: Px(40);
        margin-bottom: Px(50);
        font-size: Px(32);
        color: #999999;
        text-align: center;
     }
     .pop-btn {
        padding: Px(16) 0 Px(20);
        border-top: 1px solid #E9E9E9;;
        font-size: Px(36);
        color: #01A2AE;
        text-align: center;
     }
   }
 }
</style>

