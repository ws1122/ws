<template>
    <div class="container">
        <div class="icon" @click="toLogin">
            <img src="../../asset/phone.png" alt="">
        </div>
        <div id="login_container" ref="ewmlogin"></div>
    </div>
</template>
<script>
require('./ewmlogin.scss')
export default {
    data(){
        return {
            obj: null, // 微信登录的对象
            url: '//m.cheyuu.com/html/pos_sheep/index.html#/?source=scan',
            config: {
                self_redirect:false,
                id:"login_container",
                appid: "wxaaa9ace4cf42f6d2",
                scope: "snsapi_login",
                redirect_uri: '',
                state: "123",
                style: "",
                href: ''
            }
        }
    },
    computed:{
      api(){
        return `https://m.cheyuu.com/index/scanoauth?redirect_url=${encodeURIComponent(this.url)}&access_token=${this.access_token}`
      },
      access_token(){
        return this.$store.state.token.access_token || ''
      }
    },
    create(){
        this.$store.dispatch('needRefresh', true)
    },
    mounted(){
        this.$nextTick(()=>{
            this.initEwm() 
        })
    },
    methods: {
        toLogin(){
            this.$router.push({name:'login'})
        },
        initEwm(){
            this.config.redirect_uri = encodeURIComponent(this.api)
            // console.log(this.config)
            this.obj = new WxLogin(this.config);
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../styles/variable.scss';
.container {
  overflow: hidden;
  position: relative;
  .icon {
    position: absolute;
    right: 0;
    top: 0;
    overflow: hidden;
    width: Px(50);
    img {
      display: block;
      width: 100%;
    }
  }
}
</style>

