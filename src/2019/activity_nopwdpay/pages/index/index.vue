<template>
  <div class="container" v-if="done">
    <div class="main" v-if="ishow">
      <div class="banner">
        <div class="ban-tit">我的车牌</div>
      </div>
      <div class="wraps">
        <div class="num-wrap">
          <div :class="['num',secIndex == indexnum ? 'actitem':'']" v-for="(item,indexnum) in carNum" :key="indexnum"
            @click="secPosInput(indexnum)">{{item}}</div>
        </div>
        <div :class="['confirmbtn',isCanConfirm?'actbtn':'']" @click="doConfirm">开通无感支付</div>
      </div>
      <div class="protocal-wrap">
        <div @click="isAgree = !isAgree"><img
            :src="isAgree ? require('./images/sec-yes.png'):require('./images/sec-no.png')" alt=""></div>
        <div class="protxt">请认真阅读并同意</div>
        <div class="proto" @click="toProtoCal">《用户服务协议》</div>
      </div>
      <div class="keyboard" v-show="showKeyboard">
        <header class="pkey-header2">
          <label class="pkey-okbtn" @click="complete">完成</label>
        </header>
        <section class="pkey-keyscontain">
          <ul>
            <li v-show="txtboardshow">
              <div class="li-wrap" v-for="(item,index) in cartxt" :key="index">
                <div v-if="index==(cartxt.length-1)" @click="changeKey">ABC</div>
                <label v-for="(items,indexi) in item" :key="indexi" @click="txtclick(items,indexi)">{{items}}</label>
                <div v-if="index==(cartxt.length-1)" @click="deleteCon">
                  <img class="delico" src="./images/del.png" />
                </div>
              </div>
            </li>
            <li v-show="numboardshow">
              <div :class="['li-wrap',index == 2 ? 'extra-padding':'']" v-for="(item,index) in numtxt" :key="index">
                <div v-if="index==(cartxt.length-1)" @click="changeKey">省份</div>
                <label v-for="(items,indexi) in item" :key="indexi" @click="numclick(items,indexi)">{{items}}</label>
                <div v-if="index==(cartxt.length-1)" @click="deleteCon">
                  <img class="delico" src="./images/del.png" />
                </div>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </div>
    <div class="lists" v-if='!ishow'>
      <div class="ul-li">
        <div class="board-item" @click="addbankcard">
          <div class="bank-ico"><img src="./images/add.png" alt="" class="bank-add">
            <span class="cardname">新增银行卡</span>
          </div>
        </div>
      </div>
      <li class="ul-li" v-for="(item,index) in list" :key="index">
        <div class="board-item">
          <div class="bank-left">
            <div class="bank-ico"><img :src="item.Icon" alt=""></div>
            <div class="bank-name">
              <div>{{item.Name}}</div>
            </div>
          </div>
          <div class="bank-right">
            <div class="status">{{item.Status==1?'已开通':'已关闭'}}</div>
            <div class="endnum">尾号{{item.BankCard}}</div>
          </div>
        </div>
      </li>
    </div>
  </div>
</template>
<script>
  import {
    CheckIcon
  } from 'vux'
  import axios from 'axios'
  import Qs from 'qs'
  export default {
    beforeRouteLeave(to, from, next) {
      if (to.path == '/enterinfo') { // 详情页跳地址时 需要把自己设置成 keep-alive
        from.meta.keepAlive = false;
      }
      next()
    },
    data() {
      return {
        done: false,
        showKeyboard: true, // 整个键盘的显示隐藏
        carNum: ['', '', '', '', '', '', ''], // 输入的结果数组
        secIndex: 0, // 选择输入的位置下标
        cartxt: [
          ['京', '津', '渝', '沪', '冀', '晋', '辽', '吉', '黑', '苏'],
          ['浙', '皖', '闽', '赣', '鲁', '豫', '鄂', '湘', '粤', '琼'],
          ['川', '贵', '云', '陕', '甘', '青', '蒙', '桂', '宁', '新'],
          ['藏', '使', '领', '警', '学', '港', '澳']
        ],
        numtxt: [
          ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
          ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
          ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
          ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
        ],
        txtboardshow: true, // 文字键盘
        numboardshow: false, // 数字字母键盘
        carStr: '', // 最终车牌号
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
        isAgree: false,
        list: [],
        ishow: true,
      }
    },
    components: {
      CheckIcon
    },
    computed: {
      // 确定按钮能否点击
      isCanConfirm() {
        // 如果carNum有空的就不能点
        let iscanclick = this.carNum.find((item) => {
          return item == ''
        })
        if (iscanclick == undefined) {
          return true
        } else {
          return false
        }
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
      radioSize() {
        return (document.body.clientWidth / 750 * 20) + 'px'
      }
    },
    mounted() {
      if (!this.access_token) {
        this.getToken()
      } else {
        this.getuserinfo()
      }
      // this.getlist()

    },
    methods: {
      toProtoCal() {
        this.$router.push({
          name: 'protocal'
        })
      },
      // 确定按钮
      doConfirm() {
        if (!this.isAgree) {
          this.$vux.toast.show({
            type: 'warn',
            text: '请勾选用户协议'
          })
          return false
        } else if (!this.isCanConfirm) {
          return false
        }
        let carStr = ''
        this.carNum.forEach((item, index) => {
          carStr = carStr + item
        })
        this.carStr = carStr
        if (!(
            /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[警京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{0,1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}[A-Z0-9]{0,1}[A-Z0-9]{0,1}$/
            .test(this.carStr))) {
          // 车牌号格式不正确
          localStorage
          return false
        }
        this.saveCarNumber()
      },
      // 点击完成，关闭键盘
      complete() {
        this.showKeyboard = false
      },
      // 切换文字和字母
      changeKey() {
        this.txtboardshow = !this.txtboardshow
        this.numboardshow = !this.numboardshow
      },
      // 选择哪个div输入，显示键盘
      // 如果是第0个，显示文字键盘，
      // 如果不是第0个 就是显示ABC键盘
      secPosInput(index) {
        this.showKeyboard = true
        this.secIndex = index // 边框高亮，并且在此处开始输入
        if (index == 0) { // 显示文字键盘
          this.txtboardshow = true
          this.numboardshow = false
        } else { // 显示ABC键盘
          this.txtboardshow = false
          this.numboardshow = true
        }
      },
      // 点击数字输入内容到对应位置
      numclick(items, indexi) {
        console.log(items, indexi, length)
        // this.carNum[this.secIndex] = items // 不能直接赋值，要用set
        this.$set(this.carNum, this.secIndex, items)
        if (this.secIndex < 6) {
          this.secIndex++
          this.txtboardshow = false
          this.numboardshow = true
        }
      },
      // 点击文字输入
      txtclick(items, indexi) {
        this.$set(this.carNum, this.secIndex, items)
        if (this.secIndex < 6) { // 显示数字键盘
          this.secIndex++
          this.txtboardshow = false
          this.numboardshow = true
        }
      },
      // 回撤删除
      deleteCon() {
        this.$set(this.carNum, this.secIndex, '')
        if (this.secIndex > 0) { // 显示数字键盘
          this.secIndex--
          this.txtboardshow = false
          this.numboardshow = true
        } else { // 等于0时 显示文字键盘
          this.txtboardshow = true
          this.numboardshow = false
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
            // this.$vux.toast.show({
            //   type: 'warn',
            //   text: data.data.error.message
            // })
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
        console.log('after:', this.access_token)
        this.$http.post('/v1/authentication/loginwechat?access_token=' + this.access_token, {
          wechatIdentity: 'oil',
          redirectUrl: this.$isTest ? 'https://test.m.cheyuu.com/html/nopwdpay/index.html' :
            'https://m.cheyuu.com/html/nopwdpay/index.html'
        }, this.baseUrl).then((data) => {
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
            // this.getCarNumber()
            this.getlist()
          } else {
            this.getToken()
          }
        })
      },
      getCarNumber() {
        this.$http.get('/v1/members/licenseplate?access_token=' + this.access_token, {}, this.baseUrl, false).then((
          data) => {
          if (data.error) {
            if (data.error.code == 401) { // token失效
            } else {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else { // 请求成功
            this.carStr = data.LicensePlateNumber
            if (!(data instanceof Array)) {
              if (this.carStr != '') {
                this.carNum = this.carStr.split('')
              }
            }
          }
          this.done = true
        })
      },
      saveCarNumber() {
        this.$http.post('/v1/members/updatelicenseplatenumber?access_token=' + this.access_token, {
          licensePlateNumber: this.carStr,
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
            if (data.result == 1) {
              this.$vux.toast.show({
                type: 'success',
                text: '绑定成功'
              })
              this.$router.push({
                name: 'enterinfo'
              })
              // let url = this.$isTest ? 'https://test.m.cheyuu.com/account' : 'https://m.cheyuu.com/account';
              // location.href = url
            } else {
              this.$vux.toast.show({
                type: 'warn',
                text: '绑定失败'
              })
            }
          }
        })
      },
      /*获取签约列表*/
      getlist() {
        this.$http.get('/v1/payment/all?access_token=' + this.access_token, {}, this.baseUrl, false).then((data) => {
          if (data.error) {
            if (data.error.code == 401) { // token失效
            } else {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else { // 请求成功
            if (data.length > 0) {
              this.done = true;
              this.ishow = false;
              this.list = data
            } else {
              this.ishow = true;
              this.getCarNumber()
            }
          }
        })
      },
      /*添加银行卡 */
      addbankcard() {
        this.$router.push({
          name: 'identity',
          query: {
            isbank: 0
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
  }

  .main {
    .banner {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: Px(312);
      background-image: linear-gradient(-180deg, #F46B02 0%, #FA9F02 100%);

      .ban-tit {
        padding: 0 Px(20);
        height: Px(88);
        line-height: Px(88);
        font-size: Px(32);
        color: #FFFFFF;
      }
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

    .wraps {
      box-sizing: border-box;
      position: relative;
      margin: Px(88) Px(20) 0;
      padding: Px(20) Px(20) Px(40);
      background: #fff;
      box-shadow: 0 1px Px(20) 0 rgba(0, 0, 0, 0.06);
      border-radius: Px(6);
    }

    .num-wrap {
      margin-top: Px(40);
      width: 100%;
      box-sizing: border-box;
      padding-left: Px(32);
      padding-right: Px(32);
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .num {
        box-sizing: border-box;
        width: Px(70);
        height: Px(84);
        line-height: Px(84);
        text-align: center;
        background: #FFFFFF;
        border: 1px solid #E9E9E9;
        border-radius: Px(6);
      }

      .num:nth-of-type(3) {
        margin-left: Px(30);
      }
    }

    .confirmbtn {
      margin-top: Px(100);
      margin-left: Px(20);
      margin-right: Px(20);
      height: Px(88);
      text-align: center;
      line-height: Px(88);
      border-radius: Px(10);
      background: #999999;
      color: #ffffff;
      font-size: Px(32);
    }

    .actbtn {
      background: #F88602;
    }

    .actitem {
      border-color: #F88602 !important;
    }

    .keyboard {
      width: 100%;
      position: fixed;
      bottom: 0;
      left: 0;
    }

    .pkey-header2 {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      background: #F1EFED;

      .pkey-okbtn {
        height: Px(70);
        line-height: Px(70);
        color: #8BB0C5;
        padding: 0 Px(30);
      }
    }

    .pkey-keyscontain {
      box-sizing: border-box;
      padding: Px(10) Px(10) Px(20);
      background: #D3D3DD;

      ul {
        overflow: hidden;

        .li-wrap {
          box-sizing: border-box;
          overflow: hidden;
          display: flex;
          justify-content: space-between;
          margin-top: Px(14);

          label {
            display: inline-block;
            width: Px(60);
            height: Px(84);
            background: #FFFFFF;
            text-align: center;
            line-height: Px(84);
            border-radius: Px(6);
          }

          div {
            position: relative;
            display: inline-block;
            height: Px(84);
            width: Px(84);
            background: #ACB2C2;
            text-align: center;
            line-height: Px(84);
            border-radius: Px(6);

            .delico {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              display: block;
              width: Px(44);
            }
          }

          label:active {
            background: #eeeeee;
          }
        }
      }
    }

    .extra-padding {
      padding-left: 21px;
      padding-right: 21px;
    }
  }

  .lists {
    .ul-li:not(:nth-of-type(-1)) {
      overflow: hidden;
      margin: Px(20);
      border-radius: Px(10);
    }

    .board-item {
      display: flex;
      flex-direction: row;
      box-sizing: border-box;
      justify-content: space-between;
      align-items: center;
      padding: 0 Px(40);
      height: Px(200);
      width: 100%;
      background: #FFFFFF;
      box-shadow: 0 1px Px(20) 0 rgba(0, 0, 0, 0.06);
      border-radius: Px(6);
      -webkit-user-select: none;
      user-select: none;
      -webkit-touch-callout: none;

      img {
        pointer-events: none;
      }

      &.act {
        box-shadow: 0 2px Px(10) 0 rgba(0, 0, 0, 0.60);
      }

      .bank-left {
        display: flex;
        flex-direction: row;
        align-items: center;

        .bank-ico img {
          display: block;
          width: Px(100);
        }

        .bank-name {
          margin-left: Px(20);
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: Px(36);
          color: #222222;
        }
      }

      .bank-right {
        display: flex;
        flex-direction: column;
        align-items: center;

        .status {
          width: Px(188);
          text-align: center;
          font-size: Px(30);
          color: #333333;
          font-weight: 600;
        }

        .endnum {
          width: Px(188);
          text-align: center;
          margin-top: Px(10);
          font-size: Px(24);
          color: #999999;
        }

      }
    }
  }

  .bank-add {
    width: Px(72);
    height: Px(72);

  }

  .cardname {
    position: relative;
    top: Px(-18);
    left: Px(15);
  }

</style>
