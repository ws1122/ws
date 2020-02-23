<template>
  <div class="container">
    <div class="banner">
      <div class="cheyoo-cell-wrap">
        <div class="cheyoo-cell-ico"><img src="../../assets/ico-cell.png" alt=""></div>
        <div class="cheyoo-cell-tit">可用加油币（元）</div>
      </div>
      <div class="cheyoo-money">
        <div class="cheyoo-num">{{points}}</div>
        <div class="cheyoo-rule-wrap" @click="toRule">
          <div class="cheyoo-rule-ico"><img src="../../assets/ico-tip.png" alt=""></div>
          <div class="cheyoo-rule-tit">加油币使用说明</div>
        </div>
      </div>
    </div>
    <scroller lock-x :height="Height" v-show="hasData">
      <div class="detail-list">
        <div class="list-item" v-for="(item,index) in pointChangelist" :key="index" @click="toDetail(item)">
          <div class="item-wrap">
            <div class="site">{{item.Note}}</div>
            <div class="money" :class="!item.changeType ? 'gray':''">{{(Number(item.Points)/100).toFixed(2)}}</div>
          </div>
          <div class="item-wrap margintop10">
            <div class="time">{{item.CreateTime}}</div>
            <div class="desc">{{item.TypeName}}</div>
          </div>
        </div>
      </div>
    </scroller>
    <div class="nodata" v-show="!hasData">
      <p>暂无记录</p>
    </div>
  </div>
</template>
<script>
import {Scroller} from 'vux';
import axios from 'axios'
import Qs from 'qs'
export default {
  data(){
    return {
      baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
      pointChangelist: [],
      points: '',
      hasData: true
    }
  },
  components: {
    Scroller
  },
  computed: {
    Height(){
      return -(document.body.clientWidth / 750 * 236) + 'px'
    },
    access_token() {
      return this.$store.state.token.access_token || localStorage.getItem('access_token')
    },
    refresh_token() {
      return this.$store.state.token.refresh_token || localStorage.getItem('refresh_token')
    },
    userinfo() {
      return this.$store.state.token.userinfo || localStorage.getItem('userinfo')
    },
    fromType(){
      return this.$route.query.from || 'oil'
    }
  },
  mounted(){
    // this.getPointsChange()
    if (!this.access_token) {
      this.getToken()
    } else {
      this.$nextTick(()=>{
        this.getuserinfo()
      })
    }
  },
  methods: {
    toRule(){
      this.$router.push({name:'rule'})
    },
    toDetail(item){
      console.log('item.Group===',item.Group)
      console.log('item.ordercode===',item.OrderCode)
      if(item.Group == 2 && item.OrderCode != ''){
        this.$router.push({
          name:'detail',
          query: {
            orderCode: item.OrderCode
          }
        })
      }
    },
    getPointsChange(){
      axios({
        url: this.baseUrl + '/v2/users/pointslog?access_token=' + this.access_token,
        method: 'get'
      }).then(({data}) =>{
        if (data.error) {
            if (data.error.code == 401) {
              this.refreshToken()
            } else {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
        } else {
          this.points = data.points
          this.pointChangelist = data.log
          if(this.pointChangelist.length > 0) {
            this.hasData = true
            this.pointChangelist.forEach((item,index)=>{
              if(item.Points.indexOf('-') != -1){
                item.changeType = false
              } else {
                item.changeType = true
              }
            })
          } else {
            this.hasData = false
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
      refreshToken(){
        let config = {
          client_id: 'wechat_mobile_app',
          refresh_token: this.refresh_token
        }
        axios({
            method: 'post',
            url: this.baseUrl + '/v1/authentication/refresh?access_token=' + this.access_token,
            data: Qs.stringify(config)
          }).then(res => {
            if (res.error) {
              this.$store.dispatch('setAccessToken', '')
              this.$store.dispatch('setRefreshToken', '')
              localStorage.clear()
              location.href = this.isTest ? `https://test.m.cheyuu.com/html/carpay/index.html#/rest?from=${this.fromType}` : `//m.cheyuu.com/html/carpay/index.html#/rest?from=${this.fromType}`
            } else {
              if (res.data.scope == null || (res.data.scope).indexOf('member') === -1) { // 还是未授权
                this.$store.dispatch('setAccessToken', '')
                this.$store.dispatch('setRefreshToken', '')
                localStorage.clear()
                location.href = this.isTest ? `https://test.m.cheyuu.com/html/carpay/index.html#/rest?from=${this.fromType}` : `//m.cheyuu.com/html/carpay/index.html#/rest?from=${this.fromType}`
              } else {
                this.$store.dispatch('setAccessToken', res.data.access_token)
                this.$store.dispatch('setRefreshToken', res.data.refresh_token)
                localStorage['access_token'] = res.data.access_token;
                localStorage['refresh_token'] = res.data.refresh_token;
                this.getPointsChange()
              }
            }
          })
      },
      login() {
        let v = Math.random()
        this.$http.post('/v1/authentication/loginwechat?access_token=' + this.access_token, {
          wechatIdentity: this.fromType,
          redirectUrl: this.$isTest ? `https://test.m.cheyuu.com/html/carpay/index.html#/rest?from=${this.fromType}&v=${v}` :
            `https://m.cheyuu.com/html/carpay/index.html#/rest?from=${this.fromType}&v=${v}`
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
        }).then(({data}) => {
          console.log(333,data)
          if (Number(data.UID) > 0) {
            localStorage['userinfo'] = JSON.stringify(data);
            this.$store.dispatch('setUserinfo', JSON.stringify(data))
            console.log(33355)
            this.getPointsChange()
          } else {
            this.getToken()
          }
        })
      }
  }
}
</script>
<style lang="scss" scoped>
@import '../../styles/variable.scss';
  .container {
    position: relative;
    min-height: 100vh;
    background: #F5F5F5;
  }
  .banner {
    overflow: hidden;
    height: Px(236);
    background-image: linear-gradient(-0deg, #FBA302, #F56A01);
    .cheyoo-cell-wrap {
      margin-top: Px(60);
      padding: 0 Px(20);
      display: flex;
      flex-direction: row;
      align-items: center;
      .cheyoo-cell-ico>img {
        display: block;
        margin-right: Px(10);
        width: Px(38);
      }
      .cheyoo-cell-tit {
        opacity: 0.6;
        font-size: Px(28);
        color: #FFFFFF;
      }
    }
    .cheyoo-money {
      margin-top: Px(20);
      padding: 0 Px(20);
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .cheyoo-num {
        font-size: Px(60);
        color: #FFFFFF;
      }
      .cheyoo-rule-wrap {
        display: flex;
        flex-direction: row;
        align-items: center;
        .cheyoo-rule-ico>img {
          display: block;
          margin-right: Px(10);
          width: Px(26);
        }
        .cheyoo-rule-tit {
          opacity: 0.7;
          font-size: Px(24);
          color: #FFFFFF;
        }
      }
    }
  }
  .detail-list {
    padding: 0 Px(20);
    background: #fff;
    .list-item {
      padding: Px(30) 0;
    }
    .list-item:not(:last-child){
      border-bottom: 1px solid #E9E9E9;
    }
    .list-item .item-wrap {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      &.margintop10 {
        margin-top: Px(10);
      }
      .site {
        font-size: Px(32);
        color: #333333;
        font-weight: 600;
      }
      .money {
        font-size: Px(32);
        color: #F67A02;
      }
      .time {
        font-size: Px(24);
        color: #999999;
      }
      .desc {
        font-size: Px(28);
        color: #333333;
      }
    }
  }
  .nodata {
    font-size: Px(28);
    p {
      line-height: Px(800);
      text-align: center;
    }
  }
  .gray {
    color: #999999!important;
  }
</style>


