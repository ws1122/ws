<template>
  <div class="declare_wrap">
    <img src="./images/entry.png" alt="">
    <div class="declare_title"><span>车友网选站申报入口</span></div>
    <div class="declare_btn"><span @click="toSelection('selectiondeclare')">站点申报</span></div>
  </div>
</template>

<script>
  import axios from 'axios'
  import Qs from 'qs'
  export default {
    data() {
      return {
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com'
      };
    },
    methods: {
      // 商品列表
      getToken() {
        this.$http.post('/v1/authentication/grant', {
          client_id: 'wechat_partner_app',
         // client_secret: 'fc175860ebd8e9f207826459f0b6695d', //正式
          client_secret: this.$isTest ? '7b80e058274bf47aa1acdf0fc9c89cda' : 'fc175860ebd8e9f207826459f0b6695d', //测试
          grant_type: 'client_credentials'
        }, this.baseUrl).then(data => {
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
        this.$http.post('/v1/authentication/loginwechat?access_token=' + this.access_token, {
          wechatIdentity: 'partner',
          redirectUrl: this.$isTest ? 'https://test.p.cheyuu.com/html/washcar/index.html'
          : 'https://p.cheyuu.com/html/washcar/index.html'
        }, this.baseUrl).then(data => {
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
          url: this.baseUrl + '/v1/contacts/employeesinfo?access_token=' + access_token,
          method: 'get'
        }).then(({
          data
        }) => {
          if (data.error) {
            this.getToken()
          } else {
            localStorage['userinfo'] = JSON.stringify(data);
            this.$store.dispatch('setUserinfo', JSON.stringify(data))
            this.$store.dispatch('setAccessToken', access_token)
            this.$store.dispatch('setRefreshToken', refresh_token)
            console.log('store:', this.$store.state.token)
            /// 执行页面的列表 到这里已经授权了
          }
        })
      },
      toSelection(url) {
        this.$router.push(url)
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
      }
    },
    mounted() {
      if (!this.access_token) {
        this.getToken()
      } else {
        this.getuserinfo()
      }
    }
  };

</script>

<style lang="scss" scoped>
  @import "../../styles/variable.scss";

  .declare_wrap {
    font-size: Px(32);
    text-align: center;

    img {
      width: Px(560);
      height: Px(480);
      margin-top: Px(60);
    }

    .declare_title {
      span {
        color: #666;
      }
    }

    .declare_btn {
      margin-top: Px(80);

      span {
        display: inline-block;
        width: Px(686);
        @include Height(Px(88));
        background: #10aeff;
        border-radius: Px(44);
        color: #fff;
      }
    }
  }

</style>
