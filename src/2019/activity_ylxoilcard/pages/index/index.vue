<template>
  <div>
    <div class="top">
      <div class="discount">{{discount}}<span class="zhe">折</span>
        <span class="jiayou">充值加油基金</span>
      </div>
      <img src="../../assets/ban.png" alt="" class="ban">
      <div class="dis">x{{discount/100}}</div>
    </div>
    <div class="banner" style="margin-top:-5px">
      <div class="company">
        <div  class="companys">
          <div class="business">
            <div class="title">欢迎使用{{title}}</div>
            <div class="title ">租车业务</div>
          </div>
          <div class="company-ban">
            <!-- <div class="plate-number">
              <div class="plate-left">您使用的车辆车牌号:</div>
              <div class="plate-right">{{cardnumber.Number}}</div>
            </div> -->
            <div class="plate-number">
              <div class="plate-left">车内配备油卡卡号：</div>
              <div class="plate-right">{{cardnumber.CardNumber}}</div>
            </div>
          </div>
        </div>
        <div class="refundtitle">
          <img src="../../assets/cardtitle.png" alt="" class="cardtitle">
          充值后不可退款，请认真核对油卡卡号
        </div>
        <div class="btns" @click="clickpay">立即充值</div>
        <img src="../../assets/zhuyi.png" alt="" class="zhuyi">
      </div>

    </div>


  </div>
</template>
<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
        cardnumber: {},
        discount: 0, //折扣
        title: ''


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
    methods: {
      clickpay() {

        this.$router.replace({
          path: 'activity',
          query: {
            oilcardid: this.oilcardid,
            merchantid: this.merchantid

          }
        })
        console.log(177)

      },
      getToken() {
        this.$http.post('/v1/authentication/grant', {
          client_id: 'wechat_ylx',
          client_secret: this.$isTest ? '123456789' : '8e3af6ec8aa604c095ce813397c5114e',
          grant_type: 'client_credentials'
        }, this.baseUrl, false).then((data) => {
          console.log(1588, data)
          if (data.error) {
            // this.$vux.toast.show({type: 'warn',text: data.data.error.message})
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
          wechatIdentity: 'yilvxing',
          //redirectUrl: "http://localhost:8088/#/?access_token=" + this.access_token
          redirectUrl: this.$isTest ?
            `https://test.m.cheyuu.com/html/ylxoilcard/index.html#/?oilcardid=${this.oilcardid}&merchantid=${this.merchantid}&ylxuid=${this.ylxuid}` :
            `https://m.cheyuu.com/html/ylxoilcard/index.html#/?oilcardid=${this.oilcardid}&merchantid=${this.merchantid}&ylxuid=${this.ylxuid}`
        }, this.baseUrl, false).then((data) => {
          if (data.redirectUrl) {
            location.href = data.redirectUrl
          }

        })
      },
      getuserinfo() {
        let access_token = localStorage.getItem('access_token')
        let refresh_token = localStorage.getItem('refresh_token')
        axios({
          url: this.baseUrl + '/v1/members/checkylxlogin?access_token=' + access_token,
          method: 'get'
        }).then(({
          data
        }) => {
          console.log(777, data)
          if (data.result) {
            this.showPage = true
            this.merchantinfo()
            this.ylxoilcard()
            if (this.ylxuid) {
              this.grtuid()
            }

          } else {
            this.getToken()
          }
        })
      },
      ylxoilcard() {
        this.$http.get('/v1/ylxoilcard/ylxoilcardinfo?access_token=' + this.access_token, {
          oilCardID: this.oilcardid
        }, this.baseUrl, false).then((data) => {
          if (data.error) {
            if (data.error.code != 401) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else {
            console.log(777, data)
            this.cardnumber = data

          }
        })
      },

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
            this.title = data.Title
            this.discount = Number(data.Discount) || 0;
          }
        })

      },

      grtuid() {
        this.$http.post('/v1/ylxoilcard/bindyilvxinguid?access_token=' + this.access_token, {
          ylxuid: this.ylxuid
        }, this.baseUrl, false).then((data) => {

        })
      },


    }

  }

</script>
<style lang="scss" scoped>
  @import '../../styles/variable.scss';

  .top {
    position: relative;

    .discount {
      position: absolute;
       left: Px(110);
       top: Px(25);
      font-size: Px(80);
      color: #FFE878;
      font-weight: 700;

      .zhe {
        font-size: Px(36);
      }
    }

    .ban {
      width: 100%;
     // height: Px(300);

    }

    .dis {
      position: absolute;
      left: Px(320);
      bottom: Px(160);
      font-size: Px(48);
      color: #FFFFFF;
    }
  }

  .banner {
    position: relative;
    margin-top: Px(-10);

    width: 100%;
    height: calc(100vh - 300 / 750 * 10rem);

    background-image: linear-gradient(-180deg, #73BFF9 0%, #2D9FFF 100%);
    overflow: hidden;

    .company {

      //overflow: hidden;


      .business {
        //margin-top: Px(40);
        padding: Px(20) 0;
        overflow: hidden;
        margin-top: Px(30);
        border-bottom: 1px solid #e9e9e9;

        .title {
          text-align: center;
          font-size: Px(32);
          color: #222222;
        }
      }

      .company-ban {
        width: 100%;
        padding: Px(20);
        box-sizing: border-box;
        font-size: Px(28);

        .plate-number {
          display: flex;
          justify-content: space-between;
          padding: Px(15);

          .plate-left {
            color: #999999;
          }

          .plate-right {
            color: #222222
          }


        }
      }

      .refundtitle {
        margin-top: Px(50);
        text-align: center;
        font-size: Px(28);
        color: #F3E47E;

        .cardtitle {
          width: Px(24);
        }




      }

      .btns {
        margin: Px(20) Px(20) 0;
        height: Px(88);
        line-height: Px(88);
        text-align: center;
        font-size: Px(32);
        color: #FFFFFF;
        background-image: linear-gradient(180deg, #FBA302, #F56A01);
        border-radius: Px(10);
      }
    }

    .zhuyi {
      width: 100%;
      position: relative;
      left: 0;
      bottom: Px(-30);

    }

  }

  .jiayou {
    font-family: hzgb;
    font-size: Px(72);
    color: #FFFFFF;
  }

  .companys {
    width: Px(690);
   // height: Px(320);
    margin: Px(40) auto;
    //  padding-top:Px(40);
    background-color: #fff;
    border-radius: Px(10);

  }

  @media screen and (max-width: 340px) {
    .banner {
      padding-bottom: Px(40) !important;
    }
  }

</style>
