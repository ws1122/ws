<template>
  <div class="container" v-show="showpage">
    <div class="blank-div"></div>
    <div class="input-wrap">
      <img class="searchbtn" src="./images/search.png" @click="searchSite" alt="">
      <input v-model="sitekey" type="text" placeholder="站点查询">
      <img v-show="sitekey!=''" @click="clearKey" class="clear" src="./images/close.png" alt="">
      <div class="input-btn" @click="searchSite">搜索</div>
    </div>
    <div class="site-list" v-show="allList.length > 0">
      <div class="site-item" v-for="(item,index) in allList" :key="index">
        <div class="site-tit" @click="openOrClose(index)">
          <div class="sitetxt">{{item.Title}}</div>
          <div :class="openIndex == index ? 'anim':''"><img src="./images/more.png" alt=""></div>
        </div>
        <div class="site-con" v-show="(openIndex == index) && item.contactList.length>0">
          <div class="site-con-item" v-for="(iteminner,indexinner) in item.contactList" :key="indexinner"
            @click="clickToInfo(iteminner.ID)">
            <div class="site-contit">{{iteminner.Contact}}</div>
            <div class="site-contxt">{{iteminner.status}}<span></span></div>
          </div>
        </div>
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
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
        allList: [],
        sitekey: this.$store.state.site.sitekey, // 站点搜索
        showpage: false,
        openIndex: -1
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
      openOrClose(index) {
        if (this.openIndex == index) {
          this.openIndex = -1
        } else {
          this.openIndex = index
        }
      },
      clearKey() {
        this.sitekey = ''
      },
      searchSite() {
        if (this.sitekey != '') {
          this.$store.dispatch('setSiteKey', this.sitekey)
          this.getlist()
        } else {
          this.$store.dispatch('setSiteKey', '')
          this.allList = []
        }
      },
      getlist() {
        this.$http.get('/v1/contacts/searchpartnercontact?access_token=' + this.access_token, {
          title: this.sitekey
        }, this.baseUrl).then(data => {
          if (data.error) {
            if (data.error.code != 401) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else {
            this.allList = data
          }
        })
      },
      clickToInfo(id) {
        this.$router.push({
          name: 'operate',
          query: {
            id: id
          }
        })
      },
      getToken() {
        this.$http.post('/v1/authentication/grant', {
          client_id: 'wechat_partner_app',
          client_secret: this.$isTest ? '7b80e058274bf47aa1acdf0fc9c89cda' : 'fc175860ebd8e9f207826459f0b6695d',
          // client_id: 'wechat_mobile_app',
          // client_secret: '26a8a646db0c94b41141ca563be87876',
          grant_type: 'client_credentials'
        }, this.baseUrl, false).then((data) => {
          console.log(data)
          if (data.error) {
           this.$vux.toast.show({type: 'warn',text: data.data.error.message})
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            this.$store.dispatch('setAccessToken', '')
            this.$store.dispatch('setRefreshToken', '')
           // this.getToken()
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
        let v = new Date().getTime()
        this.$http.post('/v1/authentication/loginwechat?access_token=' + this.access_token, {
          wechatIdentity: 'partner',
          // wechatIdentity: 'travel',
          redirectUrl: this.$isTest ? 'https://test.p.cheyuu.com/html/manager/index.html#/?v=' + v :
            'https://p.cheyuu.com/html/manager/index.html#/?v=' + v
        }, this.baseUrl, false).then((data) => {
          console.log('登录接口：', data)
          if (data.redirectUrl) {
            location.href = data.redirectUrl
          } else {
            this.$vux.toast.show({
              type: 'warn',
              text: data.error.message
            })
          }
        })
      },
      // 获取用户信息，判断token是否登录
      getuserinfo() {
        let access_token = localStorage.getItem('access_token')
        let refresh_token = localStorage.getItem('refresh_token')
        axios({
          url: this.baseUrl + '/v1/contacts/employeesinfo?access_token=' + access_token,
          method: 'get'
        }).then(({
          data
        }) => {
          if (data.error) {
            this.getToken()
          } else {
            this.showpage = true
            localStorage['userinfo'] = JSON.stringify(data);
            this.$store.dispatch('setUserinfo', JSON.stringify(data))
            this.$store.dispatch('setAccessToken', access_token)
            this.$store.dispatch('setRefreshToken', refresh_token)
            console.log('store:', this.$store.state.token)
            /// 执行页面的列表 到这里已经授权了
            if (this.sitekey != '') {
              this.getlist()
            }
          }
        })
      },
    },
    mounted() {
      // 开始对接口时 可以打开执行下面的方法。
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

  .container {
    box-sizing: border-box;
    min-height: 100vh;
    background: #F4F4F4;
  }

  .blank-div {
    height: Px(88);
    margin-bottom: Px(20);
  }

  .input-wrap {
    z-index: 100;
    position: fixed;
    top: 0;
    left: 0;
    background: #fff;
    height: Px(88);
    width: 100%;

    input {
      box-sizing: border-box;
      padding-left: Px(76);
      padding-right: Px(190);
      height: Px(88);
      width: 100%;
      border: 0;
      outline: none;
      font-size: Px(28);
    }

    input::-webkit-input-placeholder {
      /* WebKit, Blink, Edge */
      font-size: Px(28);
    }

    input:-moz-placeholder {
      /* Mozilla Firefox 4 to 18 */
      font-size: Px(28);
    }

    input::-moz-placeholder {
      /* Mozilla Firefox 19+ */
      font-size: Px(28);
    }

    input:-ms-input-placeholder {
      /* Internet Explorer 10-11 */
      font-size: Px(28);
    }

    .searchbtn {
      display: block;
      position: absolute;
      left: Px(20);
      top: 50%;
      transform: translateY(-50%);
      width: Px(40);
    }

    .clear {
      display: block;
      position: absolute;
      right: Px(142);
      top: 50%;
      transform: translateY(-50%);
      width: Px(26);
    }

    .input-btn {
      box-sizing: border-box;
      color: #666;
      background: #e9e9e9;
      position: absolute;
      right: 0;
      top: 0;
      padding-left: Px(30);
      padding-right: Px(30);
      height: Px(88);
      line-height: Px(88);
      font-size: Px(28);
      border-left: 1px solid #e9e9e9;
    }
  }

  .site-list {
    background: #fff;

    .site-item {
      overflow: hidden;
    }

    .site-item .site-tit {
      box-sizing: border-box;
      border-bottom: 1px solid #F4F4F4;
      padding: Px(20) Px(14) Px(20) Px(32);
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      .sitetxt {
        height: Px(48);
        line-height: Px(48);
        font-size: Px(32);
        color: #333333;
      }

      div>img {
        display: block;
        width: Px(48);
      }
    }

    .site-item .site-con {
      border-bottom: 1px solid #F4F4F4;

      .site-con-item {
        padding: Px(20) Px(20) Px(20) Px(40);
        display: flex;
        justify-content: space-between;
        align-items: center;

        .site-contit {
          font-size: Px(28);
          color: #666666;
        }

        .site-contxt {
          display: flex;
          align-items: center;
          font-size: Px(28);
          color: #333333;
        }

        .site-contxt span {
          width: Px(42);
          height: Px(42);
          display: inline-block;
          background: url('./images/more.png') no-repeat;
          background-size: 100%;
          background-position: 0 0;
        }
      }
    }
  }

  .anim {
    animation: roll .2s ease-in-out 0s 1 alternate forwards;
  }

  @keyframes roll {
    from {
      transform: rotateZ(0deg)
    }

    to {
      transform: rotateZ(90deg)
    }
  }

</style>
