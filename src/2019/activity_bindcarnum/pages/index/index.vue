<template>
  <div class="container" v-show="showPage">
    <div class="banner">
      <div class="ban-txt">识别车牌</div>
      <div class="carnum">{{licensePlate}}</div>
    </div>
    <div class="cartype">
      <div class="type-txt">请确定车辆所属类型：</div>
      <div class="typebtn-wrap">
        <div class="typebtn left" @click="chosePubOrPri(0)">
          <img :src="isPub ? btnPri:btnPriAct" alt="">
        </div>
        <div class="typebtn" @click="chosePubOrPri(1)">
          <img :src="isPub ? btnPubAct:btnPub" alt="">
        </div>
      </div>
      <div class="type-txt">是否为该车车主：</div>
      <div class="typebtn-wrap">
        <div class="typebtn left" @click="choseYesOrNo(0)">
          <img :src="isYes ? btnYesAct:btnYes" alt="">
        </div>
        <div class="typebtn" @click="choseYesOrNo(1)">
          <img :src="isYes ? btnNo:btnNoAct" alt="">
        </div>
      </div>
    </div>
    <div class="submit-btn" @click="subClick">提交审核</div>
  </div>
</template>

<script>
  import axios from 'axios'
  import Qs from 'qs'
  import {
    constants
  } from 'crypto';
  export default {
    data() {
      return {
        btnNo: require('./images/btn-no.png'),
        btnNoAct: require('./images/btn-no-act.png'),
        btnYes: require('./images/btn-yes.png'),
        btnYesAct: require('./images/btn-yes-act.png'),
        btnPub: require('./images/btn-pub.png'),
        btnPubAct: require('./images/btn-pub-act.png'),
        btnPri: require('./images/btn-pri.png'),
        btnPriAct: require('./images/btn-pri-act.png'),
        isYes: true, // 是 否
        isPub: false, // 公家车，false=私家车
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
    },
    methods: {
      // 选择公家车 还是 私家车
      chosePubOrPri(index) {
        if (index == 0) {
          this.isPub = false
        } else {
          this.isPub = true
        }
      },
      //  选择是 还是 否
      choseYesOrNo(index) {
        if (index == 0) {
          this.isYes = true
        } else {
          this.isYes = false
        }
      },
      // 提交审核按钮
      subClick() {
        console.log(this.isPub, this.isYes)
        if (!this.isPub && this.isYes) {
          this.$router.push({
            name: 'confirm',
            query: {
              licensePlate: this.licensePlate,
              contactID: this.contactID,
              pay: this.pay,
              cheyoo_random_code: this.randomCode
            }
          })
        } else {
          return false;
          this.$router.push({
            name: 'result',
            query: {
              flag: 0
            }
          })
        }
      },
      getToken() {
        this.$http.post('/v1/authentication/grant', {
          client_id: 'wechat_mobile_app',
          client_secret: '26a8a646db0c94b41141ca563be87876',
          grant_type: 'client_credentials'
        }, this.baseUrl).then((data) => {
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
        console.log('after:', this.access_token)
        this.$http.post('/v1/authentication/loginwechat?access_token=' + this.access_token, {
          wechatIdentity: 'oil',
          redirectUrl: this.$isTest ?
            `http://test.m.cheyuu.com/html/bindcarnum/index.html#/?licensePlate=${this.licensePlate}&contactID=${this.contactID}&pay=${this.pay}&cheyoo_random_code=${this.randomCode}` :
            `https://m.cheyuu.com/html/bindcarnum/index.html#/?licensePlate=${this.licensePlate}&contactID=${this.contactID}&pay=${this.pay}&cheyoo_random_code=${this.randomCode}`
        }, this.baseUrl).then((data) => {
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
    min-height: 100vh;
    background: #F5F5F5;
  }

  .banner {
    height: Px(310);
    background-image: linear-gradient(180deg, #F46B02, #FA9F02);

    .ban-txt {
      opacity: 0.6;
      font-size: Px(28);
      color: #FFFFFF;
      padding: Px(20) Px(20) 0 Px(20);
    }

    .carnum {
      font-size: Px(60);
      color: #FFFFFF;
      text-align: center;
    }
  }

  .cartype {
    box-sizing: border-box;
    width: Px(710);
    margin: Px(-146) auto 0;
    padding: Px(40) Px(30);
    background: #fff;
    border-radius: Px(20);
    box-shadow: 0 1px Px(20) 0 rgba(0, 0, 0, 0.06);

    .type-txt {
      font-size: Px(32);
      color: #333333;
    }

    .typebtn-wrap {
      display: flex;
      flex-direction: row;
      margin-top: Px(20);
      margin-bottom: Px(30);

      .typebtn {
        box-sizing: border-box;
        width: Px(234);
        height: Px(70);
        //  border: 1px solid #E4E4E4;
        font-size: Px(28);
        color: #666666;
        text-align: center;
        line-height: Px(70);
        border-radius: Px(10);

        &.left {
          margin-right: Px(40);
        }

        img {
          display: block;
          width: Px(234);
        }
      }
    }
  }

  .submit-btn {
    margin: Px(60) auto 0;
    width: Px(670);
    height: Px(88);
    line-height: Px(88);
    font-size: Px(32);
    color: #FFFFFF;
    background-image: linear-gradient(180deg, #FBA302, #F56A01);
    border-radius: Px(10);
    text-align: center;
  }

</style>
