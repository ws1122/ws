<docs>
  ## 入口文件.
  > 尽量从App.vue里开发.而不是直接从 html里开发
</docs>

<template lang="pug">
  div
    <router-view></router-view>
</template>

<script>
  export default {
    name: 'app',
    data() {
      return {
        baseUrl: this.$isTest ? '//test.api.cheyuu.com' : '//api.cheyuu.com'
      }
    },
    computed: {
      access_token(){
        return this.$store.state.token.access_token || ''
      },
      refresh_token(){
        return this.$store.state.token.refresh_token || ''
      },
      isneedrefresh(){
         return this.$store.state.token.isneedRefresh
      }
    },
    watch: {
      isneedrefresh(val){
        if(val == true) {
          this.refreshToken()
        }
      }
    },
    methods: {
      refreshToken(){
        this.$post({
          api: '/v1/authentication/refresh',
          data: {
            client_id: "partner_contact",
            refresh_token: this.refresh_token,
            access_token: this.access_token
          }   
        },this.baseUrl).then((data)=>{
          // console.log(233,data)
          if(data.data.error){
            this.$vux.toast.show({type: 'warn',text: data.data.error.message})
            this.refreshToken()
          } else { // 请求成功
            var access_token = data.data.access_token
            var refresh_token = data.data.refresh_token
            this.$store.dispatch('needRefresh', false)
            this.$store.dispatch('setAccessToken', access_token)
            this.$store.dispatch('setRefreshToken', refresh_token)
            localStorage['access_token'] = access_token;
            localStorage['refresh_token'] = refresh_token;  
          }
        }).catch(()=>{})
      },
      
    },
    mounted(){
     
    }
  }
</script>

<style lang="scss">
  @import './styles/variable';
  body {
    font-size: $font-size-normal;
    background: #fff;
  }
</style>

<style>
  /*reset*/
  * {
    margin: 0;
    padding: 0;
  }
  em {
    font-style: normal;
  }
  
  ul,
  li {
    list-style: none;
  }
</style>
