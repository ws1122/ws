<template>
  <div>
    <tab></tab>
    <div class="container">
      <div class="users-wrap">
        <div class="nick">{{userInfo && userInfo.Contact}}</div>
        <div class="avatar">
          <img :src="userInfo && userInfo.Avatar">
        </div>
      </div>
    </div>
    <div class="site">
      <div class="sitename">{{userInfo && userInfo.Title}}</div>
      <div class="getmoney" @click="toAmount">收银</div>
    </div>
    <div class="container">
      <div class="order-wrap">
        <div class="order-title">待消费订单
          <div class="order-title-refresh" @click="clickRefresh"><img :class="isPause ? 'pause':''" src="../../asset/refresh.png"
              alt=""></div>
        </div>
        <div class="sc-wrap" v-if="!nodata">
          <scroller lock-x :height="Height">
            <div class="order-list">
              <div class="order-item" v-for="(item,index) in orderList" :key="index">
                <div class="item-left">
                  <div>校验码：<span>{{item.CheckCode}}</span></div>
                  <p>加油金额：<span>{{item.FeeTotal}}元</span></p>
                </div>
                <div class="item-right">
                  <div class="close-order" @click="closeOrder(item)">核销订单</div>
                  <p>{{item.CreateTime}}</p>
                </div>
              </div>
            </div>
          </scroller>
        </div>
        <div class="nodata" v-if="nodata">
          <img src="../../asset/nodata.png" alt="">
          <div>暂无订单</div>
        </div>
      </div>
    </div>
    <div class="mask" v-show="popshow">
      <div class="pop">
        <div class="pop-title">核对校验码</div>
        <div class="pop-number">{{popCode}}</div>
        <div class="pop-btn-wrap">
          <div class="pop-btn agree" @click="confirm">核销</div>
          <div class="pop-btn refuse" @click="cancel">取消</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Tab from '../../components/tab/index.vue'
  import {
    Scroller
  } from 'vux'
  // var jsonp = require('jsonp');
  export default {
    components: {
      Scroller,
      Tab
    },
    data() {
      return {
        popshow: false, // 弹窗显示隐藏
        isNodata: false,
        baseUrl: this.$isTest ? '//test.w.cheyuu.com' : '//w.cheyuu.com',
        // jsonBaseUrl: '//postest.youxinbao.com.cn:8080',
        orderList: [], // 代销费订单列表
        popCode: '', // 弹窗的校验码
        hxID: '', // 要核销的那条数据ID
        OrderCode: '', // 要核销的那条的订单号
        nodata: false,
        isPause: true, // 是否执行刷新动画
        userdesc: null // 用户信息 给 userInfo 计算属性赋值用
      }
    },
    computed: {
      access_token() {
        return localStorage.getItem('access_token') || ''
      },
      userInfo() {
        var userInfo = localStorage.getItem('userinfo')
        return JSON.parse(userInfo) || this.userdesc
      },
      Height() {
        return (document.body.clientWidth * 2 / 750 * 288) + 'px'
      },
      source() {
        var currentUrl = window.location.href;
        var arr = currentUrl.split("?");
        if (arr.length > 1) {
          arr = arr[1].split("&");
          for (var i = 0; i < arr.length; i++) {
            var tem = arr[i].split("=");
            if (tem[0] == 'source') {
              return tem[1];
            }
          }
          return null;
        } else {
          return null;
        }
      }
    },
    methods: {
      // 获取站点信息
      getInfo() {
        this.$get({
          api: '/api2/getcontactdetail?access_token=' + this.access_token
        }, this.baseUrl).then((data) => {
          // console.log(data)
          if (data.data.status) {
            this.userdesc = data.data.data
            localStorage['userinfo'] = JSON.stringify(data.data.data)
            this.$store.dispatch('needRefresh', false)
            this.getOrderList()
          } else {
            // console.log(401,data)
            if (data.data.errCode == 401) {
              this.$router.replace({
                name: 'login'
              })
            } else {
              that.$vux.toast.show({
                type: 'warn',
                text: data.msg
              })
            }
          }
        }).catch(() => {})
      },
      // 收银
      toAmount() {
        this.$router.push({
          name: 'amount'
        })
      },
      // 点击刷新列表
      clickRefresh() {
        this.isPause = false
        this.getOrderList()
      },
      // 获取待消费订单列表
      getOrderList() {
        var that = this
        this.$get({
          api: '/api2/getorderlistbypos?access_token=' + this.access_token
        }, this.baseUrl).then(({
          data
        }) => {
          // console.log(data)
          setTimeout(() => {
            this.isPause = true
          }, 500)
          if (data.status) {
            this.orderList = data.data
            if (this.orderList.length == 0) {
              this.nodata = true // 没数据
            } else {
              this.nodata = false // 有数据
            }
          } else {
            this.nodata = false // 没数据
            // 授权失败
            if (data.errCode == 401) {
              this.$store.dispatch('needRefresh', true)
              // localStorage.removeItem('userinfo')
              // that.$router.replace({name:'login'})
            } else {
              that.$vux.toast.show({
                type: 'warn',
                text: data.msg
              })
            }
          }
        }).catch(() => {
          setTimeout(() => {
            this.isPause = true
          }, 500)
        })
      },
      // 请求jsonp接口 提供的不知道是什么的js接口
      // postVercation(params){
      //   jsonp(this.jsonBaseUrl + '/Verification', params, function (err, data) {
      //     if (err) {
      //       console.error(err);
      //     } else {
      //       console.log(data)
      //     }
      //   })
      // },
      // 带订单号请求几个什么参数接口
      getParams() {
        var that = this
        this.$get({
          api: '/api2/getverificationparams?access_token=' + this.access_token,
          data: {
            OrderCode: this.OrderCode
          }
        }, this.baseUrl).then(({
          data
        }) => {
          if (data.status) {
            console.log('getverificationparams:', data)
            // this.postVercation(data.data)
            console.log(111)
            Verification(data.data)
            console.log(222)
          } else {
            // 授权失败
            if (data.errCode == 401) {
              this.$store.dispatch('needRefresh', true)
              // localStorage.removeItem('userinfo')
              // that.$router.replace({name:'login'})
            } else {
              that.$vux.toast.show({
                type: 'warn',
                text: data.msg
              })
            }
          }
        }).catch(() => {})
      },
      // 点击核销订单按钮 显示弹窗
      closeOrder(item) {
        this.popshow = true;
        this.popCode = item.CheckCode
        this.hxID = item.ID
        this.OrderCode = item.OrderCode
      },
      // 核销接口
      postCloseOrder(id) {
        this.$post({
          api: '/api2/lindanbypos?access_token=' + this.access_token,
          data: {
            ID: id
          }
        }, this.baseUrl).then(({
          data
        }) => {
          // console.log(data)
          if (data.status) {
            this.popshow = false;
            this.popCode = '';
            this.hxID = '';
            this.OrderCode = '';
            this.$vux.toast.show({
              type: 'success',
              text: data.msg
            })
            this.getOrderList()
          } else {
            // 授权失败
            if (data.errCode == 401) {
              this.$store.dispatch('needRefresh', true)
              // localStorage.removeItem('userinfo')
              // this.$router.replace({name:'login'})
            } else {
              this.$vux.toast.show({
                type: 'warn',
                text: data.msg
              })
            }
          }
        })
      },
      // 点击取消
      cancel() {
        this.popshow = false;
        this.popCode = '';
        this.hxID = '';
        this.OrderCode = ''
      },
      // 点击确定
      confirm() {
        this.getParams()
        this.postCloseOrder(this.hxID)
      }
    },
    mounted() {
      console.log('source:', this.source)
      if (this.source == 'scan') { // 走的扫码登录 保存信息
        this.getInfo()
      } else {
        this.$nextTick(() => {
          console.log('token:', this.$store.state.token.access_token)
          var userinfo = localStorage.getItem('userinfo')
          if (this.access_token == '' || !userinfo) {
            localStorage.removeItem('userinfo')
            this.$router.replace({
              name: 'login'
            })
          } else {
            var access_token = localStorage.getItem('access_token')
            var refresh_token = localStorage.getItem('refresh_token')
            this.$store.dispatch('setAccessToken', access_token)
            this.$store.dispatch('setRefreshToken', refresh_token)
            this.$store.dispatch('needRefresh', true)
            // this.$nextTick(()=>{
            this.getOrderList()
            // })
          }
        })
      }
    }
  };

</script>
<style lang="scss" scoped>
  @import "../../styles/variable.scss";

  .container {
    overflow: hidden;
    box-sizing: border-box;
    margin: 0 Px(20);
  }

  .users-wrap {
    overflow: hidden;
    margin-top: Px(72);

    .nick {
      float: left;
      margin-top: Px(4);
      font-size: Px(25);
      width: Px(270);
    }

    .avatar {
      float: right;
      overflow: hidden;
      width: Px(40);
      height: Px(40);
      border-radius: 50%;

      img {
        display: block;
        width: 100%;
      }
    }
  }

  .site {
    overflow: hidden;
    margin: Px(20) Px(13) 0;
    height: Px(195);
    background: url("../../asset/site-bg.png");
    background-position: 0 0;
    background-size: 100% 100%;

    .sitename {
      font-size: Px(18);
      color: #222222;
      text-align: center;
      margin: Px(30) auto;
    }

    .getmoney {
      height: Px(40);
      width: Px(190);
      line-height: Px(40);
      color: #fff;
      text-align: center;
      background-image: linear-gradient(90deg, #45b7fd 0%, #96b5fd 100%);
      border-radius: Px(40);
      margin: 0 auto;
    }
  }

  // .sc-wrap {
  //   background: pink;
  //   height: Px(265);
  // }
  .order-wrap {
    overflow: hidden;

    .order-title {
      overflow: hidden;
      position: relative;
      // padding-top: Px(10);
      // padding-bottom: Px(5);
      font-size: Px(14);
      color: #000000;
      height: Px(40);
      line-height: Px(40);

      .order-title-refresh {
        height: Px(40);
        width: Px(40);
        position: absolute;
        right: 0;
        top: 0;

        img {
          display: block;
          width: Px(24);
          margin: Px(8) auto;
          animation: spin 1s linear 0s infinite;
        }

        .pause {
          animation-play-state: paused;
        }
      }
    }

    .order-list {
      overflow: hidden;
      padding-bottom: Px(20);

      .order-item {
        overflow: hidden;
        margin-top: Px(10);
        height: Px(75);
        background: #ffffff;
        border: 1px solid #eaeaea;
        box-shadow: 0 Px(2) Px(8) 0 rgba(0, 0, 0, 0.08);
        border-radius: Px(8);
        font-size: Px(12);
        color: #999999;
      }
    }

    .order-list .order-item {
      .item-left {
        float: left;
        width: Px(168);

        div {
          margin-top: Px(8);
          height: Px(30);
          line-height: Px(30);
        }

        div,
        p {
          text-align: left;
          margin-left: Px(16);
        }

        p {
          margin-top: Px(8);
        }
      }

      .item-right {
        float: right;
        width: Px(164);

        p {
          float: right;
          text-align: right;
          margin-right: Px(16);
          margin-top: Px(8);
        }

        .close-order {
          float: right;
          margin-right: Px(16);
          margin-top: Px(8);
          width: Px(100);
          height: Px(30);
          background: #48b7fd;
          border-radius: Px(8);
          color: #fff;
          font-size: Px(14);
          text-align: center;
          line-height: Px(30);
        }
      }
    }
  }

  .mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.2);
    z-index: 5;

    .pop {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #ffffff;
      border-radius: Px(8);
      width: Px(275);
      text-align: center;

      .pop-title {
        margin-top: Px(20);
        font-size: Px(18);
        color: #666;
      }

      .pop-number {
        margin-top: Px(10);
        font-size: Px(18);
        color: #333333;
      }

      .pop-btn-wrap {
        margin-top: Px(20);
        display: flex;
        border-top: 1px solid #eeeeee;
      }

      .pop-btn-wrap .pop-btn {
        flex: 1;
        box-sizing: border-box;
        height: Px(50);
        line-height: Px(50);
        font-size: Px(18);

        &.agree {
          color: #48b7fd;
          border-right: 1px solid #eeeeee;
        }

        &.refuse {
          color: #666666;
        }
      }
    }
  }

  .nodata {
    padding: Px(70) 0;

    img {
      display: block;
      margin: 0 auto;
    }

    div {
      margin-top: Px(10);
      text-align: center;
      font-size: Px(14);
      color: #ccc;
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

</style>
