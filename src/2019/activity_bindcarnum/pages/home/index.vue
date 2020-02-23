<template>
  <div class="container" v-show="showPage">
    <div class="banner">
      <div class="ban-txt">识别车牌</div>
    </div>
    <div class="top-wrap">
      <div class="carnum">{{licensePlate}}</div>
      <div class="btn change" @click="tochange">修改车牌</div>
      <div class="btn" @click="confirm">确认无误</div>
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
      isBing() {
        return this.$route.query.isBing
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
      confirm() {
        if (this.isBing == 1) {
          location.href = this.isTest ? 'https://test.m.cheyuu.com/carwash/bindingsuccess' :
            'https://m.cheyuu.com/carwash/bindingsuccess'
        } else {
          this.$router.push({
            name: 'confirm',
            query: {
              licensePlate: this.licensePlate,
              contactID: this.contactID,
              pay: this.pay,
              cheyoo_random_code: this.randomCode
            }
          })
        }
      },
      tochange() {
        let url = this.$isTest ? 'http://test.m.cheyuu.com/html/bindcarplate/index.html#/?licensePlate=' + this
          .licensePlate :
          'https://m.cheyuu.com/html/bindcarplate/index.html#/?licensePlate=' + this.licensePlate
        location.href = url
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
            // this.getToken()
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
            `https://test.m.cheyuu.com/html/bindcarnum/index.html#/?licensePlate=${this.licensePlate}&contactID=${this.contactID}&pay=${this.pay}&cheyoo_random_code=${this.randomCode}&isBing=${this.isBing}&v=${timestamp}` :
            `https://m.cheyuu.com/html/bindcarnum/index.html#/?licensePlate=${this.licensePlate}&contactID=${this.contactID}&pay=${this.pay}&cheyoo_random_code=${this.randomCode}&isBing=${this.isBing}&v=${timestamp}`
        }, this.baseUrl, false).then((data) => {
          console.log('登录接口：', data)
          if (data.redirectUrl) {
            location.href = data.redirectUrl
          }
        })
      },
      checkLinkIsOk() {
        this.$http.post('/v1/common/checkbrokenlink', {
          randomCode: this.randomCode
        }, this.baseUrl).then((data) => {
          console.log(data)
          if (data.result == 1) { // 有效
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
    overflow: hidden;
    min-height: 100vh;
    background: #F6F6F6;
    position: relative;
  }

  .banner {
    box-sizing: border-box;
    padding-left: Px(20);
    padding-right: Px(20);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    height: Px(312);
    background-image: linear-gradient(-180deg, #F46B02 0%, #FA9F02 100%);

    .ban-txt {
      font-size: Px(32);
      color: #FFFFFF;
      line-height: Px(88);
      height: Px(88);
    }
  }

  .top-wrap {
    overflow: hidden;
    padding-top: Px(60);
    padding-bottom: Px(40);
    width: Px(710);
    margin: Px(-224) auto 0;
    background: #FFFFFF;
    border-radius: Px(6);

    .carnum {
      text-align: center;
      font-size: Px(100);
      color: #222222;
    }
  }

  .btn {
    margin: Px(60) auto 0;
    width: Px(670);
    height: Px(88);
    line-height: Px(88);
    font-size: Px(32);
    color: #FFFFFF;
    background-image: linear-gradient(180deg, #FBA302, #F56A01);
    border-radius: Px(10);
    text-align: center;

    &.change {
      background: #fff;
      color: #999999;
      border: 1px solid #F56A01;
    }
  }

</style>
