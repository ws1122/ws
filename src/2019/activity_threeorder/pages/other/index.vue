<template>
  <div class="containers" v-show="showPage">
    <div class="list" v-if="list.length>0">
      <div class="list-item" v-for="(item,index) in list" :key="index">
        <div class="list-left">
          <img src="../../assets/img/bg.png" alt="" class="bg">
          <div class="zi">
            <p>洗</p>
            <p>车</p>
            <p>劵</p>
          </div>
        </div>
        <div class="list-right">
          <div class="free">免费</div>
          <div class="time">有效期至 {{item.ExpiredTime}}</div>
          <div class="securities">卡券：{{item.CouponCode}}</div>
        </div>

      </div>

    </div>
    <div v-else>
      <div class="liks">
        <img src="../../assets/img/link.png" alt="" class="failure">
        <div class="link">没洗车劵</div>
      </div>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import Qs from 'qs'
  export default {
    data() {
      return {
        showPage: false, // 显示页面 最外层 v-show="page"
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
        list: [],
       showPage:false 
      }
    },
    computed: {
      access_token() {
        return this.$store.state.token.access_token || localStorage.getItem('access_token')
      },
    },
    methods: {
      getToken() {
        this.$http.post("/v1/authentication/grant", {
          client_id: "thirdparty",
          client_secret: "12323",
          grant_type: "client_credentials"
        }, this.baseUrl, false).then(data => {
          if (data.error) {
            this.getToken()
          } else {
            let access_token = data.access_token;
            let refresh_token = data.refresh_token;
            localStorage["access_token"] = access_token;
            localStorage["refresh_token"] = refresh_token;
            this.login();
          }
        });
      },
      //登录接口
      login() {
        let access_token = localStorage.getItem('access_token') || '';
        let loginurl = this.$isTest ? 'https://test.m.cheyuu.com' : 'https://m.cheyuu.com'
        this.$http.post('/v1/authentication/loginwechatthirdparty?access_token=' + access_token, {
          authorizaAppID: "wx2bf201b493042594",
          //redirectUrl: "http://localhost:8088/#/?access_token=" + access_token
          redirectUrl: loginurl + '/html/threeorder/index.html#/other' /*重定向url地址 */
        }, this.baseUrl, false).then(data => {
          if (data.redirectUrl) {
            location.href = data.redirectUrl;
          }
        });
      },

      /*获取劵的列表*/
      getcouponlist() {
        this.$http.get("/v1/wscoupons/couponlist?access_token=" + this.access_token, {}, this.baseUrl).then(data => {
          console.log(1888, data);
          if (data.error) {
            if (data.error.code != 401) {
              this.$vux.toast.show({
                type: "warn",
                text: data.error.message
              });
            }
          } else {
            this.showPage=true;
            this.list = data
          }
        });
      },
    },
    mounted() {
      // 开始对接口时 可以打开执行下面的方法。
      if (!this.access_token) {
        this.getToken()
      } else {
        this.getcouponlist()
      }
    }
  }

</script>
<style lang="scss" scoped>
  @import '../../styles/variable.scss';
  .containers {
    min-height: 100vh;
    background: #F5F5F5;
    .list {
      width: 100%;
      padding: Px(0) Px(28);
      box-sizing: border-box;
      overflow: hidden;
      .list-item {
        display: flex;
        margin: Px(20) 0;
        background: #FFFFFF;
        border-radius: Px(10);
        .list-left {
          padding-right: Px(40);
          position: relative;
          .bg {
            width: Px(90);
            height: Px(190);
          }
          .zi {
            position: absolute;
            left: Px(25);
            top: Px(16);
            font-size: Px(40);
            color: #FFFFFF;
          }
        }
        .list-right {
          color: #40B9FF;
          .free {
            font-size: Px(60);
            padding: Px(10) 0;
          }
          .time {
            font-size: Px(24);

          }
          .securities {
            font-size: Px(28);
            color: #999999;
            padding-top: Px(10);

          }
        }
      }

    }
  }

  .juan {
    position: fixed;
    top: 50%;
    left: 50%;
    font-size: Px(40);
    transform: translate(-50%, -50%)
  }

  .liks {
    padding-top: Px(150);
    text-align: center;
    font-size: Px(36);
    color: #000;

    .failure {
      width: Px(202);
      height: Px(170);
      margin-bottom: Px(40);
    }

    div {
      padding-top: Px(20);
      line-height: Px(40);
    }

  }

</style>
