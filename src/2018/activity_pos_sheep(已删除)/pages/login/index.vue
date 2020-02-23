<template>
  <div class="container">
    <div class="icon" @click="toEwmLogin">
      <img src="../../asset/ewm.png" alt="">
    </div>
    <div class="title">手机快捷登录</div>
    <div class="input-wrap">
      <input type="text" class="phone" v-model="phone" maxlength="11" placeholder="请输入手机号">
      <div class="getyzm">
        <span v-if="!iscut" @click="getyzm">获取验证码</span>
        <span class="noclick" v-else>{{time}}s后可重新获取</span>
      </div>
      <input type="text" v-model="tcode" maxlength="6" placeholder="请输入验证码">
    </div>
    <div class="login-btn" @click="tologin">登录</div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        baseUrl: this.$isTest ? '//test.api.cheyuu.com':'//api.cheyuu.com',
        phone:'',
        tcode:'',
        time: 59,
        iscut: false,
        timer:''
      }
    },
    watch: {
      phone(val, oldval) {
        if (isNaN(Number(val))) {
          this.phone = oldval
        }
      },
      tcode(val, oldval) {
        if (isNaN(Number(val))) {
          this.tcode = oldval
        }
      }
    },
    computed:{
      access_token(){
        return this.$store.state.token.access_token || ''
      }
    },
    methods: {
      // 跳转ewmlogin
      toEwmLogin(){
        this.$router.push({name:'ewmlogin'})
      },
      // 获取token
      getToken(){
       this.$post({
          api: '/v1/authentication/grant',
          data: {
            client_id:"partner_contact",
            client_secret:"91e7756b5ba01347b0390e54c1d3a16c",
            grant_type:"client_credentials"
          }   
      },this.baseUrl).then((data)=>{
        // console.log(123,data)
        if(data.data.error){
          // this.$vux.toast.show({type: 'warn',text: data.data.error.message})
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('userinfo')
          this.getToken()
        } else { // 请求成功
          var access_token = data.data.access_token
          var refresh_token = data.data.refresh_token
          localStorage['access_token'] = access_token;
          localStorage['refresh_token'] = refresh_token;
          this.$store.dispatch('setAccessToken', access_token)
          this.$store.dispatch('setRefreshToken', refresh_token)
          this.$store.dispatch('needRefresh', false)
        }
      })
     },
      cutdown(){
        this.timer = setInterval(() => {
          if(this.time > 0) {
            this.time--
          } else {
            this.time = 59
            clearInterval(this.timer)
            this.iscut = false
          }  
        },1000)
      },
      getyzm(){
        if(this.phone == '' || (new RegExp(/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/)).test(this.phone) == false){
          this.$vux.toast.show({type:'warn',text:'手机号码格式不正确'})
          return false
        }
        this.iscut = true
        this.getTcode()
        this.cutdown()
      },
      // 获取验证码接口
      getTcode(){
        this.$post({
          api: '/v1/sms/verifycode?access_token='  + this.access_token,
          data: {
            phoneNum: this.phone,
            context: 'partner_contact_login'
          }   
        },this.baseUrl).then((data)=>{
          // console.log(133,data)
          if(data.data.error){
            this.$vux.toast.show({type: 'warn',text: data.data.error.message})
            this.getToken()
          } else if(data.data.result) { // 请求成功
            this.$vux.toast.show({type: 'success',text: '发送成功'})
          }
        })
      },
      // 登录接口
      postLogin(){
        this.$post({
          api: '/v1/contacts/login?access_token=' + this.access_token,
          data: {
            phoneNum: this.phone,
            code: this.tcode
          }   
        },this.baseUrl).then((data)=>{
          // console.log(233,data)
          if(data.data.error){
            this.$vux.toast.show({type: 'warn',text: data.data.error.message})
            this.getToken()
          } else { // 请求成功
            localStorage['userinfo'] = JSON.stringify(data.data)
            this.$router.replace({name:'index'})        
          }
        }).catch(()=>{})
      },
      tologin(){
        if(this.phone == '' || (new RegExp(/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/)).test(this.phone) == false){
          this.$vux.toast.show({type:'warn',text:'手机号码格式不正确'})
          return false
        }
        if(this.tcode == '') {
          this.$vux.toast.show({type:'warn',text:'验证码不正确'})
          return false
        }
        this.postLogin()
      }
    },
    mounted(){
      this.getToken()
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
.title {
  margin-top:Px(40);
  font-size: Px(20);
  font-weight: 600;
  text-indent: Px(20);
}
.input-wrap {
  position: relative;
  overflow: hidden;
  margin-top: Px(30);
  margin-left: Px(20);
  margin-right: Px(20);
  input {
    border: 0;
    outline: none;
    box-shadow: none;
    box-sizing: border-box;
    border-bottom: 1px solid #eaeaea;
    height: Px(40);
    font-size: Px(12);
    width: 100%;
    &.phone {
      padding-right: Px(120);
    }
  }
  input::-webkit-input-placeholder { /* WebKit, Blink, Edge */
    font-size: Px(12);
  }
  input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    font-size: Px(12);
  }
  input::-moz-placeholder { /* Mozilla Firefox 19+ */
    font-size: Px(12);
  }
  input:-ms-input-placeholder { /* Internet Explorer 10-11 */
    font-size: Px(12);
  }
  .getyzm {
    position: absolute;
    right: 0;
    top: 0;
    font-size: Px(12);
    font-weight: 600;
    line-height: Px(40);
    .noclick {
      font-weight: 500;
      color: #ccc;
    }
  }
}
.login-btn {
  margin-top:Px(40);
  margin-left: Px(20);
  margin-right: Px(20);
  height: Px(40);
  background-image: linear-gradient(90deg, #45B7FD 0%, #96B5FD 100%);
  color: #fff;
  text-align: center;
  line-height: Px(40);
  border-radius: Px(20);
}
</style>


