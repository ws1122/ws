<template>
  <div>
    注意：==============
    以下 methods 里是常用的登录流程（如果不需要可以删掉），
    如果用的话，需要修改 action/http.js 文件中的token失效时的回跳路径，改为你现在的项目名地址，
    还要修改 下面方法 login() 中的 回跳地址，也是改为你现在的项目名地址，
    如果原始链接带有参数，http.js 里面 和 login 里面地址都需要带上，
    http.js里面参数处理放在 401 响应里（可以参考: 2019/bindcarnum/action/http.js）。
  </div>
</template>

<script>
  import axios from 'axios'
  import Qs from 'qs'
  export default {
    data() {
      return {
        showPage: false, // 显示页面 最外层 v-show="page"
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com'
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
    methods:{
      getToken() {
        this.$http.post('/v1/authentication/grant', {
          client_id: 'wechat_mobile_app',
          client_secret: '26a8a646db0c94b41141ca563be87876',
          // client_id: 'wechat_partner_app', // 商家端参数
          // client_secret: this.$isTest ? '7b80e058274bf47aa1acdf0fc9c89cda' : 'fc175860ebd8e9f207826459f0b6695d',
          grant_type: 'client_credentials'
        }, this.baseUrl,false).then((data) => {
          console.log(data)
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
          wechatIdentity: 'oil', // 商家端 partner
          redirectUrl: this.$isTest ? `https://test.m.cheyuu.com/html/sheep/index.html#/detail?couponCode=${this.couponCode}&v=${v}` :
            `https://m.cheyuu.com/html/sheep/index.html#/detail?couponCode=${this.couponCode}&v=${v}`
        }, this.baseUrl,false).then((data) => {
          if (data.redirectUrl) {
            location.href = data.redirectUrl
          }
        })
      },
      // 加油旅游 获取用户信息接口（商家端用下面注释那个）
      getuserinfo() {
        let access_token = localStorage.getItem('access_token')
        let refresh_token = localStorage.getItem('refresh_token')
        axios({
          url: this.baseUrl + '/v1/members/loginuserinfo?access_token=' + access_token,
          method: 'get'
        }).then(({
          data
        }) => {
          if (Number(data.UID) > 0) {
            this.showPage = true
            localStorage['userinfo'] = JSON.stringify(data);
            this.$store.dispatch('setUserinfo', JSON.stringify(data))
            this.$store.dispatch('setAccessToken', access_token)
            this.$store.dispatch('setRefreshToken', refresh_token)
            this.getDetail()
          } else {
            this.getToken()
          }
        })
      },
      // 商家端 获取用户信息接口
      // getuserinfo() {
      //   let access_token = localStorage.getItem('access_token')
      //   let refresh_token = localStorage.getItem('refresh_token')
      //   axios({
      //     url: this.baseUrl + '/v1/contacts/employeesinfo?access_token=' + access_token,
      //     method: 'get'
      //   }).then(({
      //     data
      //   }) => {
      //     if (data.error) {
      //       this.getToken()
      //     } else {
      //       this.showpage = true
      //       localStorage['userinfo'] = JSON.stringify(data);
      //       this.$store.dispatch('setUserinfo', JSON.stringify(data))
      //       this.$store.dispatch('setAccessToken', access_token)
      //       this.$store.dispatch('setRefreshToken', refresh_token)
      //       console.log('store:', this.$store.state.token)
      //       /// 执行页面的列表 到这里已经授权了
      //     }
      //   })
      // }
    },
    mounted() {
      console.log('mouned:', this.access_token)
      // 开始对接口时 可以打开执行下面的方法。
      // if (!this.access_token) {
      //   this.getToken()
      // } else {
      //   this.getuserinfo()
      // }
    }
  }
</script>
<style lang="scss" scoped>
 @import '../../styles/variable.scss';
</style>

