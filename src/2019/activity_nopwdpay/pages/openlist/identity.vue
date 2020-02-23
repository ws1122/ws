<template>
  <div class="container">
    <div class="input-wrap ">
      <div class="input-item bank-top" v-if="isbanks">
        <input v-model="cardNumShow" placeholder="请输入银行卡号" @keyup="showNum" @blur="chargeNum" ref="cardInput">
      </div>
      <div class="input-item">
        <div class="phone-input"><input type="number" maxlength="11" v-model="phone" placeholder="请输入手机号"></div>
        <div class="getvcode" :class="phone.length == 11 ? 'act':''" v-if="!iscut" @click="getYzm">获取验证码</div>
        <div class="getvcode cut" v-if="iscut">{{time}}s后重新发送</div>
      </div>
      <div class="input-item">
        <input type="text" placeholder="请输入验证码" v-model="smsScode">
      </div>
    </div>
    <div class="btn" :class="isGray ?'gray':''" @click="affirm">确认</div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        iscut: false,
        phone: '',
        time: 59,
        timer: null,
        isAgree: false,
        banknumber: '',
        isbanks: false,
        object: {},
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
        bankParam: null,
        cardNumShow: '',
        smsScode: '',
      }
    },
    computed: {
      access_token() {
        return this.$store.state.token.access_token || localStorage.getItem('access_token')
      },
      isbank() {
        return this.$route.query.isbank
      },
      isGray() {
        if ((this.isbank == 0 && this.cardNumShow == '') || this.phone == '' || this.smsScode == '' || !this .bankParam) {
          return true
        } else {
          return false
        }
      }
    },
    mounted() {
      if (window.localStorage.temp) {
        var temp = localStorage.getItem('temp');
        this.object = JSON.parse(temp);
      }
      if (this.isbank == 0) {
        this.isbanks = true
      } else {
        this.isbanks = false
      }
    },
    methods: {
      showNum() {
        let cInput = this.$refs.cardInput
        if (cInput.selectionStart < this.cardNumShow.length) {
          return
        }
        this.cardNumShow = this.cardNumShow.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
        this.banknumber = this.cardNumShow.replace(/\s/g, '')
      },
      chargeNum() {
        this.cardNumShow = this.cardNumShow.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
        this.banknumber = this.cardNumShow.replace(/\s/g, '')
      },
      getYzm() {
        var tiptext = '';
        if (this.isbanks) {
          if (this.banknumber == '') {
            tiptext = '银行卡号错误';
            this.hit(tiptext);
            return false;
          }
        }
        if (this.phone == '' || new RegExp(/^1[3,4,5,6,7,8,9]\d{9}$/).test(this.phone) == false) {
          tiptext = '手机号格式错误'
          this.hit(tiptext)
          return false
        }
        this.iscut = true
        this.cutdown()
        // if(!this.bankParam) {
        //   this.anewsend()
        // } else {
        if (this.isbanks) {
          this.submitbank()
        } else {
          this.getverification()
        }
        // }
      },
      cutdown() {
        this.timer = setInterval(() => {
          if (this.time > 0) {
            this.time--
          } else {
            this.time = 59
            clearInterval(this.timer)
            this.iscut = false
          }
        }, 1000)
      },
      hit(tiptext) {
        this.$vux.toast.show({
          type: 'warn',
          text: tiptext,
        })
      },
      affirm() {
        if (this.isGray) {
          return false
        }
        let tiptext = '';
        if (this.smsScode == '') {
          tiptext = '请输入验证码';
          this.hit(tiptext);
          return false;
        }
        if (!this.bankParam) {
          // tiptext = '参数错误',
          //  this.hit(tiptext);
          return false;
        }
        if (this.isbanks) {
          this.submitstep()
        } else {
          this.submitcontracticbcstep()
        }
      },
      /*获取验证码*/
      getverification() {
        this.$http.post('/v1/payment/contracticbcstep1?access_token=' + this.access_token, {
          bindMedium: this.object.banknumber,
          certNo: this.object.IDcard,
          custName: this.object.name,
          gender: this.object.gender,
          occupation: this.object.profession,
          signDate: this.object.date,
          mobileNo: this.phone,
        }, this.baseUrl).then((data) => {
          if (data.error) {
            if (data.error.code == 401) { // token失效
            } else {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else { // 请求成功
            this.bankParam = data;
          }
        })
      },
      /* 提交*/
      submitcontracticbcstep() {
        this.$http.post('/v1/payment/contracticbcstep2?access_token=' + this.access_token, {
          MID: this.bankParam.MID,
          smsSendNo: this.bankParam.sms_send_no,
          smsScode: this.smsScode
        }, this.baseUrl).then((data) => {
          if (data.error) {
            if (data.error.code == 401) { // token失效
            } else {
              localStorage.setItem("message", data.error.message);
               this.$router.push({
                name: 'result',
                query: {
                  issucceed: 2
                }
              })
            }
          } else { // 请求成功
               this.$router.push({
                name: 'result',
                query: {
                  issucceed: 1
                }
              })
          }
        })
      },
      /*银行卡提交获取验证码*/
      submitbank() {
        this.$http.post('/v1/payment/contracticbcstep3?access_token=' + this.access_token, {
          bindMedium: this.banknumber,
          mobileNo: this.phone,
        }, this.baseUrl).then((data) => {
          if (data.error) {
            if (data.error.code == 401) { // token失效
            } else {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else { // 请求成功
            this.bankParam = data
          }
        })
      },
      /* 提交有银行卡的 */
      submitstep() {
        this.$http.post('/v1/payment/contracticbcstep4?access_token=' + this.access_token, {
          MID: this.bankParam.MID,
          smsSendNo: this.bankParam.sms_send_no,
          smsScode: this.smsScode
        }, this.baseUrl).then((data) => {
          if (data.error) {
            if (data.error.code == 401) { // token失效
            } else {
              console.log(14444)
            localStorage.setItem("message", data.error.message);
              this.$router.push({
                name: 'result',
                query: {
                  issucceed: 2
                }
              })
            }
          } else {
              // 请求成功
              this.$router.push({
                name: 'result',
                query: {
                  issucceed: 1
                }
              })
          }
        })
      },
      /*重新发送短信 */
      // anewsend() {
      //   this.$http.post('/v1/payment/contracticbcstep5?access_token=' + this.access_token, {
      //     MID: "",
      //     sms_send_no: "",
      //   }, this.baseUrl).then((data) => {
      //     if (data.error) {
      //       if (data.error.code == 401) { // token失效
      //       } else {
      //         this.$vux.toast.show({
      //           type: 'warn',
      //           text: data.error.message
      //         })
      //       }
      //     } else { // 请求成功
      //       console.log(1111, data)
      //     }
      //   })
      // },
    }
  }
</script>
<style lang="scss" scoped>
  @import '../../styles/variable.scss';

  .container {
    width: 100%;
    min-height: 100vh;
    background: #F5F5F5;
  }

  // .banner {
  //   overflow: hidden;
  //   height: Px(210);
  //   background: #F5F5F5;
  //   text-align: center;
  //   background: url('./images/identitybg.png') no-repeat;
  //   background-size: Px(178) Px(174);
  //   background-position: top 0 right Px(10);
  //   .title {
  //     margin-top: Px(68); 
  //     font-size: Px(36);
  //     color: #666666;
  //   }
  //   .tip {
  //     margin-top: Px(18); 
  //     font-size: Px(28);
  //     color: #999;
  //   }
  // }
  .input-wrap {

    .input-item {
      display: flex;
      align-items: center;
      height: Px(100);
      border-bottom: 1px solid #f5f5f5;
      background: #fff;

      input {
        box-sizing: border-box;
        padding: 0 Px(20);
        outline: none;
        border: 0;
        height: Px(100);
        width: 100%;
      }

      .phone-input {
        width: Px(526);
      }

      .getvcode {
        box-sizing: border-box;
        height: Px(60);
        width: Px(204);
        text-align: center;
        line-height: Px(58);
        font-size: Px(28);
        color: #BFBFBF;
        border: 1px solid #F56A01;
        border-radius: Px(40);

        &.act {
          color: #F56A01;
          border: 1px solid #F56A01;
        }

        &.cut {
          font-size: Px(24);
        }
      }
    }
  }

  .btn {
    margin: Px(60) auto 0;
    width: Px(670);
    height: Px(88);
    background-image: linear-gradient(-180deg, #FBA302 0%, #F56A01 100%);
    border-radius: Px(10);
    font-size: Px(32);
    color: #FFFFFF;
    text-align: center;
    line-height: Px(88);
  }

  .protocal-wrap {
    margin-top: Px(30);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: Px(24);

    .protxt {
      margin-left: Px(10);
      color: #999999;
    }

    .proto {
      color: #09BB07;
    }

    div>img {
      display: block;
      width: Px(40);
    }
  }

  .bank-top {
    margin-bottom: Px(60);
  }

  // .kftip {
  //   margin-top: Px(30);
  //   text-align: center;
  //   font-size: Px(32);
  //   color: #999999;
  //   span {
  //     color: #51C247;
  //   }
  // }
  input {
    font-size: Px(32) !important
  }

  .gray {
    background: #999999;
  }

</style>
