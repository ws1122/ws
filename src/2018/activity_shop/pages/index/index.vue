<template>
  <div v-cloak>
    <div class="index-container">
      <div class="top-tip" v-if="showPoint">
        <img class="icon-coin" src="./images/coin.png" alt="">
        <div class="cheyoo-coin">{{point}}</div>
        <div class="tip">以下商品车友币抵100%</div>
      </div>
      <div class="goodslist" v-show="!nodata">
        <div class="goods" v-for="(item,index) in goodslist" :key="index" @click="toDetail(item.ID)">
          <div class="goods-pic">
            <img :src="'https://files.cheyuu.com/files/' + item.Logo" alt="">
          </div>
          <div class="goods-name">{{item.Title}}</div>
          <div class="goods-price"><span>￥</span>{{item.Price}}</div>
          <div class="restnum">库存：{{item.Stock || 0}}件</div>
        </div>
      </div>
      <div class="nodata" v-show="nodata">暂无商品</div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import Qs from 'qs'
  export default {
    data() {
      return {
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
        goodslist: [], // 商品列表
        nodata: false, // true表示没数据
        pageIndex: 1, // 页码
        pageSize: 999, // 每页条数
        showPoint: false // 显示积分上边栏（页面加载完再显示）
      }
    },
    computed: {
      point() {
        return this.$store.state.user.points
      },
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
      toDetail(id) {
        this.$router.push({
          name: 'goodsDetail',
          query: {
            id: id
          }
        })
      },
      // 获取用户积分
      getuserPoint() {
        this.$http.get('/v1/shop/userpoints?access_token=' + this.access_token, {}, this.baseUrl).then((data) => {
          console.log('积分接口：', data)
          if (data.error) {
            if (data.error.code == 401) { // token失效

            } else {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else { // 请求成功
            this.$store.dispatch('setPoints', data.Points)
            this.$store.dispatch('setBalance', data.Balance)
            this.showPoint = true
          }
        })
      },
      // 商品列表
      getGoodsList() {
        this.$http.get('/v1/shop/goodslist?access_token=' + this.access_token, {
          page: this.pageIndex,
          pageSize: this.pageSize
        }, this.baseUrl).then((data) => {
          console.log('商品列表接口：', data)
          if (data.error) {
            if (data.error.code == 401) { // token失效

            } else {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else { // 请求成功
            this.goodslist = data
            if (this.goodslist.length == 0) {
              this.nodata = true
            } else {
              this.nodata = false
            }
          }
        })
      },
      getToken() {
        this.$http.post('/v1/authentication/grant', {
          client_id: 'wechat_mobile_app',
          client_secret: '26a8a646db0c94b41141ca563be87876',
          grant_type: 'client_credentials'
        }, this.baseUrl).then((data) => {
          console.log(data)
          if (data.error) {
            this.$vux.toast.show({
              type: 'warn',
              text: data.data.error.message
            })
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            this.$store.dispatch('setAccessToken', '')
            this.$store.dispatch('setRefreshToken', '')
            //  this.getToken()
          } else { // 请求成功
            let access_token = data.access_token
            let refresh_token = data.refresh_token
            localStorage['access_token'] = access_token;
            localStorage['refresh_token'] = refresh_token;
            this.$store.dispatch('setAccessToken', access_token)
            this.$store.dispatch('setRefreshToken', refresh_token)
            console.log('before:', access_token)
            this.$nextTick(() => {
              this.login()
            })
          }
        })
      },
      login() {
        console.log('after:', this.access_token)
        this.$http.post('/v1/authentication/loginwechat?access_token=' + this.access_token, {
          wechatIdentity: 'travel',
          redirectUrl: this.$isTest ? 'http://test.m.cheyuu.com/html/shop/index.html' :
            'https://m.cheyuu.com/html/shop/index.html'
        }, this.baseUrl).then((data) => {
          console.log('登录接口：', data)
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
            console.log('store:', this.$store.state.token)
            this.getuserPoint()
            this.getGoodsList()
          } else {
            console.log(data.error)
            console.log(this.access_token)
            this.getToken()
          }
        })
      }
    },
    mounted() {
      console.log('mouned:', this.access_token)
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

  .index-container {
    overflow: hidden;
    background: #fff;
  }

  .top-tip {
    box-sizing: border-box;
    padding: 0 Px(10);
    height: Px(40);
    width: 100%;

    .icon-coin {
      float: left;
      display: block;
      width: Px(19);
      margin-top: Px(10);
    }

    .cheyoo-coin {
      float: left;
      margin-left: Px(5);
      font-size: Px(12);
      color: #222222;
      line-height: Px(40);
    }

    .icon-in {
      float: left;
      display: block;
      width: Px(10);
      margin-top: Px(15);
      margin-left: Px(5);
    }

    .tip {
      float: right;
      line-height: Px(40);
      font-size: Px(10);
      color: #F56A01;
    }
  }

  .goodslist {
    overflow: hidden;
    box-sizing: border-box;
    padding: 0 Px(10);

    .goods {
      overflow: hidden;
      padding-bottom: Px(20);
      width: Px(172);

      .goods-pic {
        position: relative;
        width: 100%;
        height: Px(172);
        background: #F4F4F4;
      }

      .goods-pic img {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        max-width: Px(172);
        max-height: Px(172);
      }

      .goods-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: Px(16);
        color: #222222;
        line-height: Px(34);
      }

      .goods-price {
        font-size: Px(16);
        color: #F56A01;
      }

      .goods-price span {
        font-size: Px(12);
        color: #F56A01;
      }

      .restnum {
        font-size: Px(12);
        color: #999999;
      }
    }

    .goods:nth-of-type(odd) {
      float: left;
    }

    .goods:nth-of-type(even) {
      float: right;
    }
  }

  .nodata {
    position: fixed;
    top: 50%;
    left: 0;
    width: 100%;
    font-size: Px(16);
    text-align: center;
    color: #222222;
  }

</style>
