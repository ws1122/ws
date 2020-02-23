  import axios from 'axios'
  export default {
    data() {
      return {
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
    methods: {
      getToken() {
        this.$http.post('/v1/authentication/grant', {
          client_id: 'wechat_mobile_app',
          client_secret: '26a8a646db0c94b41141ca563be87876',
          grant_type: 'client_credentials'
        }, this.baseUrl, false).then(data => {
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
          redirectUrl: this.$isTest ? `https://test.m.cheyuu.com/html/sheep/index.html#/detail?couponCode=${this.couponCode}&v=${v}` : `https://m.cheyuu.com/html/sheep/index.html#/detail?couponCode=${this.couponCode}&v=${v}`
        }, this.baseUrl, false).then((data) => {
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
            localStorage['userinfo'] = JSON.stringify(data);
            this.$store.dispatch('setUserinfo', JSON.stringify(data))
            this.$store.dispatch('setAccessToken', access_token)
            this.$store.dispatch('setRefreshToken', refresh_token)
            // this.getDetail()
          } else {
            this.getToken()
          }
        })
      }
    },
    mounted() {
      console.log('mouned:', this.access_token)
      // 开始对接口时 可以打开执行下面的方法。
      if (!this.access_token) {
        this.getToken()
      } else {
        this.getuserinfo()
      }
    }
  }
