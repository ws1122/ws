<template>
  <div class="container" v-show="showPage">
    <div v-if="isshow">
      <img src="../../assets/img/failure.png" alt="" class="failure">
      <div>恭喜你</div>
      <div>成功领取洗车券一张</div>
      <div class="mycouped" @click="toorder">
        查看我的洗车券
      </div>
    </div>
    <div class="liks" v-else>
      <img src="../../assets/img/link.png" alt="" class="failure">
      <div>{{msg}}</div>
      <div class="link">洗车券领取失败</div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        isshow: true,
        msg: '',
        showPage: false,
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
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
      randomCode() {
        return this.$route.query.randomCode || localStorage.getItem('randomCode')
      },

    },
    mounted() {
      if (!this.access_token) {
        this.getToken()
      } else {
        this.getuserinfo()
      }

    },
    methods: {
      // 获取token
      getToken() {
        this.$http.post("/v1/authentication/grant", {
          client_id: "thirdparty",
          client_secret: "12323",
          grant_type: "client_credentials"
        }, this.baseUrl, false).then(data => {
          if (data.error) {
            this.$vux.toast.show({
              type: 'warn',
              text: data.data.error.message
            })
            //  this.getToken()
          } else {
            let access_token = data.access_token;
            let refresh_token = data.refresh_token;
            localStorage["access_token"] = access_token;
            localStorage["refresh_token"] = refresh_token;
            this.login();
          }
        });
      },
      //登录接口
      login() {
        let access_token = localStorage.getItem('access_token') || '';
        let loginurl = this.$isTest ? 'https://test.m.cheyuu.com' : 'https://m.cheyuu.com'
        this.$http.post('/v1/authentication/loginwechatthirdparty?access_token=' + access_token, {
          authorizaAppID: "wx2bf201b493042594",
          //redirectUrl: "http://localhost:8088/#/?access_token=" + access_token
          redirectUrl: loginurl + '/html/threeorder/index.html#/?randomCode=' + this.randomCode /*重定向url地址 */
        }, this.baseUrl, false).then(data => {
          if (data.redirectUrl) {
            location.href = data.redirectUrl
          }
        });
      },
      /*获取uid*/
      getuserinfo() {
        let access_token = localStorage.getItem('access_token') || this.access_token
        this.$http.get("/v1/wsmember/logininfo?access_token=" + access_token, {},
          this.baseUrl, false).then(data => {
          console.log('userinfo接口：', data);
          if (Number(data.ID) > 0) { ///
            localStorage["userinfo"] = JSON.stringify(data);
            if (this.randomCode == '') {
              this.showPage = true;
              this.isshow = false;
            } else {
              this.sendwash()
            }
          } else {
            this.getToken()
          }
        });
      },
      /*发送洗车劵*/
      sendwash() {
        let randomCode = localStorage.getItem('randomCode') || this.randomCode
        this.$http.get("/v1/wscoupons/coupons?access_token=" + this.access_token, {
          randomCode: randomCode
        }, this.baseUrl).then(data => {
          if (data.error) {
            if (data.error.code != 401) {
              this.$vux.toast.show({
                type: "warn",
                text: data.error.message
              });
            }
          } else {
            this.showPage = true
            if (!data.status) {
              document.title = "领劵失败";
              this.isshow = false;
              this.msg = data.msg
            } else {
              this.isshow = true;
              document.title = "领劵成功";
            }
            // if (data.elecCouponCode) {
            //   this.qrcodeVal = data.elecCouponCode
            //   this.showQrcode = true
            //   this.initWebSocket()
            // }
          }
        })


      },
      toorder() {
        this.$router.replace({
          path: 'other',
        })

      }
    },
  }

</script>
<style lang="scss">
  @import '../../styles/variable.scss';

  .container {
    padding-top: Px(150);
    text-align: center;
    font-size: Px(36);
    color: #000;

    .failure {
      width: Px(202);
      height: Px(170);
      margin-bottom: Px(40);
    }

    div {
      padding-top: Px(20);
      line-height: Px(40);
    }

    .mycouped {
      margin: Px(100) auto 0;
      width: Px(670);
      height: Px(88);
      background: #40B9FF;
      border-radius: 5px;
      line-height: Px(60);
      color: #ffffff;
      font-size: Px(32);
    }

    .liks {
      padding-top: Px(150);
      text-align: center;
      font-size: Px(36);
      color: #000;

      .failure {
        width: Px(202);
        height: Px(170);
        margin-bottom: Px(40);
      }

      div {
        padding-top: Px(20);
        line-height: Px(40);
      }

      .link {
        font-size: Px(28);
        color: #999999;
      }

    }

  }

</style>
