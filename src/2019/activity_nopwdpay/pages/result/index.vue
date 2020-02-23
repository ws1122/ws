<template>
  <div class="container">
    <img class="icon" :src="issuc ? require('./images/icon-suc.png'):require('./images/icon-fail.png')" alt="">
    <div class="tip" :class="issuc ? '':'fail'">{{issuc ? '免密支付开通成功' : '开通失败'}}</div>
    <div class="carnum" v-if="issuc">{{carStr}}</div>
    <div class="extra" v-if="issuc">加油时告诉加油员使用《车牌付加油》即可享受免密支付</div>
    <div class="extra" v-if="!issuc">{{message}}</div>
    <div class="btn" v-if="issuc" @click="retry">车牌付加油站点</div>
    <!-- <div class="btn" v-if="!issuc" >重试</div> -->
  </div>
</template>
<script>
  export default {
    data() {
      return {
        issuc: true,
        message: '',
        carStr:'',
        parameter: null,
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
      }
    },
    computed: {
      issucceed() {
        return this.$route.query.issucceed
      },
      access_token() {
        return this.$store.state.token.access_token || localStorage.getItem('access_token')
      },
    },
    mounted() {
      if (this.issucceed == 1) {
        this.issuc = true;
        document.title = '开通成功'
        this.getCarNumber()

      } else {
        if (window.localStorage.message) {
          this.message = localStorage.getItem('message')
          this.issuc = false;
          document.title = '开通失败';
        }
      }
    },
    methods: {
      /*加油站点 */
      retry() {
        location.href = 'https://m.cheyuu.com/partner/index?from=chelian';
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
          }
        })
      },
    }
  }

</script>
<style lang="scss" scoped>
  @import '../../styles/variable.scss';

  .container {
    overflow: hidden;
  }

  .icon {
    display: block;
    margin: Px(36) auto;
    width: Px(120);
  }

  .tip {
    text-align: center;
    font-size: Px(36);
    color: #F56A01;

    &.fail {
      color: #222222;
    }
  }

  .carnum {
    margin-top: Px(140);
    text-align: center;
    font-size: Px(36);
    color: #333333;
  }

  .extra {
    width: Px(480);
    margin: Px(20) auto 0;
    text-align: center;
    font-size: Px(28);
    color: #666666;
  }

  .btn {
    margin: Px(196) auto 0;
    width: Px(670);
    height: Px(88);
    background-image: linear-gradient(-180deg, #FBA302 0%, #F56A01 100%);
    border-radius: Px(10);
    font-size: Px(32);
    color: #FFFFFF;
    text-align: center;
    line-height: Px(88);
  }

</style>
