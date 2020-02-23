<template>
  <div class="center">
    <div class="top">
      <datetime format="YYYY" @on-confirm="sure" v-model="chooseyear" :min-year="minyear">
        <div class="times">
          <img src="./images/date.png" alt class="date" />
          <span>{{chooseyear}}年</span>
          <img src="./images/down.png" alt class="dowm" />
        </div>
      </datetime>
    </div>
    <div class="wrapper" ref="wrapper" :style="{height:wrappheight}" v-if="list.length>0">
      <div>
        <div v-for="(item,index) in list" :key="index" class="list-item">
          <div class="list" @click="todetails(item.OrderCode,item.OrderType)">
            <div class="list-top">
              <div class="top-left">
                <img src="./images/grounp.png" alt class="group" />
                <span>{{item.Title}}{{index}}</span>
              </div>
              <div class="top-right nopay">{{item.StatusPayName}}</div>
            </div>
            <div class="list-center">
              <div class="code">验证码:{{item.VerifyCode}}</div>
              <div class="money">￥{{item.FeeTotal}}</div>
              <div class="time">{{item.CreateTime}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="orders" v-else>暂无订单</div>
  </div>
</template>
<script>
  import axios from 'axios';
  import Qs from 'qs';
  import {Datetime} from 'vux';
  import BScroll from 'better-scroll';
  export default {
    data() {
      return {
        chooseyear: '2019',
        scorllOne: true,
        minyear: 2015,
        list: [],
        isshow: false,
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
        wrappheight: 0,
        page: 1,
        pageSize: 10
      };
    },
    components: {
      Datetime,
      BScroll
    },
    mounted() {
      if (!this.access_token) {
        this.getToken();
      } else {
        this.getuserinfo();
      }
      // this.loadData();
      /* 动态计算wrapper的高度 */
      this.wrappheight =
        window.innerHeight - (120 / 750) * window.innerWidth + 'px';
    },
    computed: {
      access_token() {
        return (
          this.$store.state.token.access_token ||
          localStorage.getItem('access_token')
        );
      }
    },
    methods: {
      todetails(code, type) {
        this.$router.push({
          name: 'orderdetails',
          query: {
            id: type,
            code: code
          }
        });
      },
      /* 确定时候请求接口 */
      sure(e) {
        this.chooseyear = e;
        this.isshow = false;
        this.list = [];
        this.loadData(e);
      },
      /* 订单数据列表 */
      loadData(year) {
        if (this.isshow) {
          return false;
        }
        this.$http
          .get(
            '/v1/order/orderlist?access_token=' + this.access_token, {
              page: this.page,
              pageSize: this.pageSize,
              year: year
            },
            this.baseUrl
          )
          .then(res => {
            if (res.error) {
              this.$vux.toast.show({
                type: 'warn',
                text: res.error.message
              });
            } else {
              this.scorllOne = true;
              if (res.length < 1) {
                this.isshow = true;
                return false;
              }
              this.list = this.list.concat(res) || []; /* 数据进行合并 */
              this.page = this.page + 1;

              if (!this.isshow) {
                this.pulldown();
              }
            }
          });
      },
      pulldown() {
        this.$nextTick(() => {
          this.scroll = new BScroll(this.$refs.wrapper, {
            click: true,
            probeType: 3
          });
          // 下拉动作
          this.scroll.on('scroll', pos => {
            this.scrollY = Math.abs(Math.round(pos.y));
            if (this.scrollY > 50) {
              if (!this.isshow && this.scorllOne) this.loadData(this.chooseyear);
              this.scorllOne = false;
            } else {
              // this.scroll.refresh();
            }
          });
        });
      },

      getToken() {
        this.$http
          .post(
            '/v1/authentication/grant', {
              client_id: 'wechat_mobile_app',
              client_secret: '26a8a646db0c94b41141ca563be87876',
              grant_type: 'client_credentials'
            }, this.baseUrl, false)
          .then(data => {
            if (data.error) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.data.error.message
              })
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              this.$store.dispatch('setAccessToken', '');
              this.$store.dispatch('setRefreshToken', '');
              //  this.getToken();
            } else {
              // 请求成功
              let access_token = data.access_token;
              let refresh_token = data.refresh_token;
              localStorage['access_token'] = access_token;
              localStorage['refresh_token'] = refresh_token;
              this.$store.dispatch('setAccessToken', access_token);
              this.$store.dispatch('setRefreshToken', refresh_token);
              console.log('before:', access_token);
              this.$nextTick(() => {
                this.login();
              });
            }
          });
      },
      login() {
        console.log('after:', this.access_token);
        let url = '';
        let timestamp = new Date().getTime();
        url = this.$isTest ?
          `https://test.m.cheyuu.com/html/bindcarplate/index.html#/oillist?v=${timestamp}` :
          `https://m.cheyuu.com/html/bindcarplate/index.html#/oillist?v=${timestamp}`;
        this.$http
          .post(
            '/v1/authentication/loginwechat?access_token=' + this.access_token, {
              wechatIdentity: 'oil',
              redirectUrl: url
            }, this.baseUrl, false).then(data => {
            console.log('登录接口：', data);
            if (data.redirectUrl) {
              location.href = data.redirectUrl

            }
          });
      },
      // 获取用户信息，判断token是否登录
      getuserinfo() {
        axios({
          url: this.baseUrl +
            '/v1/members/loginuserinfo?access_token=' + this.access_token,
          method: 'get'
        }).then(({
          data
        }) => {
          if (Number(data.UID) > 0) {
            this.showpage = true;
            localStorage['userinfo'] = JSON.stringify(data);
            this.$store.dispatch('setUserinfo', JSON.stringify(data));
            this.loadData(this.chooseyear);
          } else {
            this.getToken();
          }
        });
      }
    }
  };

</script>
<style lang="scss" scoped>
  @import "../../styles/variable.scss";

  .center {
    min-height: 100vh;
    background: #f6f6f6;
    position: relative;
    border-top: Px(2) solid #efefef;
  }

  .top {
    width: 100%;
    height: Px(120);
    //position: relative;
  }

  .times {
    width: Px(260);
    height: Px(60);
    background-color: #fff;
    // margin: Px(40) auto;
    border-radius: Px(40);
    text-align: center;
    line-height: Px(60);
    color: #565656;
    position: fixed;
    left: 50%;
    top: 4%;
    transform: translate(-50%, -50%);
    z-index: 1000;
  }

  .date {
    position: relative;
    width: Px(36);
    height: Px(34);
    top: Px(5);
    left: Px(10);
  }

  .dowm {
    position: relative;
    width: Px(28);
    height: Px(21);
  }

  span {
    padding: 0 Px(15);
  }

  .list {
    width: 100%;
    overflow: hidden;
    margin-top: Px(-20);
    margin-bottom: Px(20);
  }

  .list-top {
    display: flex;
    background-color: #fff;
    justify-content: space-between;
    padding: 0 Px(20);
    box-sizing: border-box;
    height: Px(80);
    border-bottom: Px(2) solid #efefef;
    line-height: Px(80);
    padding-top: Px(15);
  }

  .group {
    width: Px(38);
    height: Px(38);
    position: relative;
    top: Px(5);
    left: 0;
  }

  .list-center {
    background-color: #fff;
    padding: 0 Px(20);
    box-sizing: border-box;
    position: relative;

    .code {
      padding-top: Px(30);
    }

    .money {
      position: absolute;
      top: Px(30);
      right: Px(20);
    }

    .time {
      margin-bottom: Px(20);
      padding: Px(20) 0 Px(30);
      color: #aeaeae;
      font-size: Px(28);
    }
  }

  .nopay {
    color: #d78a3f;
  }

  .ypay {
    color: #4bbcbf;
  }

  .finish {
    color: #d2d2d2;
  }

  .orders {
    text-align: center;
    margin-top: Px(200);
  }

  .wrapper {
    overflow: hidden;
  }

</style>
