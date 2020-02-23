<template>
  <div class="container" v-show="showPage">
    <div class="btn-invoice elect" @click="selectInvoice(0)">电子发票</div>
    <div class="tip">尊敬的用户您好，现增值税电子普通发票功能已上线，如您急需报销，我们建议您开具电子发票，根据国家的相关规定，电子发票的法律效应，基本用途，基本使用规定等与税务机关监制的增值税普通发票相同。</div>
    <!-- <div class="btn-invoice paper" @click="selectInvoice(1)">纸质发票</div> -->
    <div class="bot-tip">如有疑问请咨询客服电话：400-9646-567</div>
  </div>
</template>
<script>
  import axios from 'axios'
  import Qs from 'qs'
  export default {
    data() {
      return {
        showPage: false,
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com'
      }
    },
    computed: {
      access_token() {
        // return '87af08e08cb1bd8d4f9c9084219cddad6365bfc0'
        return this.$store.state.token.access_token || localStorage.getItem('access_token')
      },
      refresh_token() {
        return this.$store.state.token.refresh_token || localStorage.getItem('refresh_token')
      },
      userinfo() {
        return this.$store.state.token.userinfo || localStorage.getItem('userinfo')
      }
    },
    methods: {
      // 选择发票类型 type==0表示电子发票，type==1表示纸质发票
      selectInvoice(type) {
        this.$router.push({
          name: 'selectinvoice',
          query: {
            type: type
          }
        })
      },
      getToken() {
        this.$http.post('/v1/authentication/grant', {
          client_id: 'wechat_ylx',
          client_secret: this.$isTest ? '123456789' : '8e3af6ec8aa604c095ce813397c5114e',
          grant_type: 'client_credentials'
        }, this.baseUrl, false).then(data => {
          console.log(data)
          if (data.error) {
            // this.$vux.toast.show({ type: 'warn',text: data.data.error.message })
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
              /* 用于延迟执行一段代码*/
              this.login()
            })
          }
        })
      },
      login() {
        let v = new Date().getTime()
        this.$http.post('/v1/authentication/loginwechat?access_token=' + this.access_token, {
          wechatIdentity: 'yilvxing',
          redirectUrl: this.$isTest ? `https://test.m.cheyuu.com/html/invoice/index.html#/?v=${v}` :
            `//m.cheyuu.com/html/invoice/index.html#/?v=${v}`
        }, this.baseUrl, false).then(data => {
          if (data.redirectUrl) {
            location.href = data.redirectUrl
          }
        })
      },
      // 获取用户信息接口
      getuserinfo() {
        let access_token = localStorage.getItem('access_token') || ''
        let refresh_token = localStorage.getItem('refresh_token') || ''
        axios({
          url: this.baseUrl + '/v1/members/checkylxlogin?access_token=' + access_token,
          method: 'get'
        }).then(({
          data
        }) => {
          if (data.result) {
            console.log(1777, data)
            this.showPage = true
            // 遮罩层
            this.$store.dispatch('setMask', false)
            // 发票历史的头部
            this.$store.dispatch('setInvoiceHeader', true)
            //            localStorage['userinfo'] = JSON.stringify(data);
            //            this.$store.dispatch('setUserinfo', JSON.stringify(data))
            this.$store.dispatch('setAccessToken', access_token)
            this.$store.dispatch('setRefreshToken', refresh_token)
          } else {
            this.getToken()
          }
        })
      }

    },
    mounted() {
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
    margin-top: Px(42);
    padding-bottom: Px(20);
    overflow: hidden;
    background: #fff;
  }

  .tip {
    margin: Px(10) Px(12) 0;
    font-size: Px(14);
    color: #999999;
  }


  .top-font {
    font-size: Px(18);
    color: #222222;
  }

  .bot-font {
    font-size: Px(14);
    color: #999999;
  }

  .fl {
    float: left;
  }

  .fr {
    float: right;
  }

  .btn-invoice {
    margin: Px(20) Px(10);
    height: Px(44);
    text-align: center;
    line-height: Px(44);
    box-sizing: border-box;
    font-size: Px(16);
    border-radius: Px(5);

    &.elect {
      // margin-top: Px(20);
      margin-bottom: Px(10);
      color: #FFFFFF;
      background-image: linear-gradient(-180deg, #FBA302 0%, #F56A01 100%);
    }

    &.paper {
      color: #F56A01;
      border: 1px solid #F56A01;
    }
  }

  .bot-tip {
    font-size: Px(14);
    color: #999999;
    margin-top: Px(20);
    text-align: center;
  }

</style>
