<template>
  <div class="container" v-show="showpage">
    <group>
      <popup-picker :data="citylist" v-model="cityName" @on-change="onChange" :columns="1" value-text-align='left'></popup-picker>
    </group>
    <div class="date">
      <span v-for="(tab ,index) in tabs" :class="{active:iscur==index}" @click="tabChange(index)" :key='index'>
        {{tab.name}}
      </span>
      <p class="result" v-if="list.length>0">数据结果(交易量排名)</p>
    </div>
    <div v-if="list.length>0">
      <div class="list-item" v-for="(item,index) in list" :key='index'>
        <div class="title">
          <p class="character">{{item.Title}}</p>
          <p :class="[index==0?'number firstone':index==1?'number secondtwo':index==2?'number third':'number others']"
            v-if="index<9">
            0{{index+1}}</p>
          <p class="number others" v-else>{{index+1}}</p>
          <div class="line"></div>
        </div>
        <div class="content">
          <div>
            <P class="liang">交易量</P>
            <p class="money">{{item.amount}}</p>
          </div>
          <div>
            <P class="liang">交易金额</P>
            <p class="money">{{item.FeeTotal}}元</p>
          </div>
          <div>
            <P class="liang">新用户</P>
            <p class="money">{{item.newUser}}</p>
          </div>
          <div>
            <P class="liang">复购率</P>
            <p class="rate">{{item.repurchase}}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="nodata">
      暂无数据</div>
  </div>
</template>
<script>
  import { PopupPicker,Group,} from 'vux'
  import axios from 'axios'
  export default {
    data() {
      return {
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
        iscur: 0, //默认选中第一个 
        tabs: [{
          name: "昨天"
        }, {
          name: "前天"
        }, {
          name: "一周"
        }],
        list: [],//站点数据结果
        isshow: false,
        cityname: [],
        cityid: 153, //默认城市id
        citylist: [],
        cityName: ['武汉市'], //默认城市名
        idList: [],
        showpage: false

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
      },
      /*manageSign*/
      manageSign() {
        return this.$route.query.manageSign;
      },
    },

    components: {
      PopupPicker,
      Group,
    },
    mounted() {
      // this.cityID()
      // this.orderstat()
      if (!this.access_token) {
        this.getToken()
      } else {
        this.getuserinfo()
      }
    },
    methods: {
      onChange(val) {
        this.citylist.forEach((item,index)=>{
        if(val[0] == item){
           console.log(item,index)
           this.cityid = this.idList[index]
            return false
          }
        })
         this.orderstat() 
      },
      /*日期选择切换*/
      tabChange(tab) {
        this.iscur = tab
        this.orderstat()
      },
      /*获取城市列表*/
      cityID() {
        this.$http.get('/v1/partners/nosensepaycitylist?access_token=' + this.access_token, {}, this.baseUrl).then(data => {
          console.log(158, data)
          if (data.error) {
            if (data.error.code != 401) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else {
            let tempIdlist = []
            let templist = []
            data.forEach((item, index) => {
            tempIdlist.push(item.ID)  
            templist.push(item.cityName)
            })
            this.idList = tempIdlist
            this.citylist = templist 
        
          }
        })
      },
      /*站点数据结果 */
      orderstat() {
        this.list = []
        this.$http.get('/v1/order/nosensepayorderstat?access_token=' + this.access_token, {
          timeType: this.iscur + 1,
          cityID: this.cityid,
          manageSign:this.manageSign
        }, this.baseUrl).then(data => {
          console.log(369, data)
          if (data.error) {
            if (data.error.code != 401) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else {
            this.list = data
          }
        })
      },
      /*从新生成access-token*/
      getToken() {
        this.$http.post('/v1/authentication/grant', {
          // client_id: 'wechat_mobile_app',
          // client_secret: '26a8a646db0c94b41141ca563be87876',
          // grant_type: 'client_credentials',
          client_id: 'wechat_partner_app',
          client_secret: this.$isTest ? '7b80e058274bf47aa1acdf0fc9c89cda' : 'fc175860ebd8e9f207826459f0b6695d',
          grant_type: 'client_credentials'
        }, this.baseUrl,false).then((data) => {
          console.log(data)
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
            console.log('before:', access_token)
            this.$nextTick(() => {
              this.login()
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
        }).then(({ data}) => {
          if (data.error) {
            this.getToken()
          }else{
            this.showpage = true
            localStorage['userinfo'] = JSON.stringify(data);
            this.$store.dispatch('setUserinfo', JSON.stringify(data))
            this.$store.dispatch('setAccessToken', access_token)
            this.$store.dispatch('setRefreshToken', refresh_token)
            /// 执行页面的列表 到这里已经授权了
            this.cityID()
            this.orderstat()
          }
        })
      },
      login() {
        let v = new Date().getTime()
        this.$http.post('/v1/authentication/loginwechat?access_token=' + this.access_token, {
        wechatIdentity: 'partner',
        //   wechatIdentity: 'travel',
        redirectUrl: this.$isTest ? 'http://test.p.cheyuu.com/html/washticket/index.html#/record?v=' +v+"&manageSign="+this.manageSign:
            'https://p.cheyuu.com/html/washticket/index.html#/record?v=' +v+"&manageSign="+this.manageSign
        }, this.baseUrl,false).then((data) => {
          console.log('登录接口：', data)
          if (data.redirectUrl) {
            location.href = data.redirectUrl
          }
        })
      },

    }
  }

</script>
<style lang="scss" scoped>
  @import '../../styles/variable.scss';
  .container {
    margin-top: Px(-28);
    min-height: 100vh;
    background: #EFEFF4;

    .selects {
      width: 100%;
      height: Px(100);
      line-height: Px(100);
      padding-left: Px(32);
      box-sizing: border-box;
      background-color: #fff;
      font-size: Px(32);
      color: #333333;
    }

    ul {
      position: absolute;
      left: 0;
      top: Px(100);
      z-index: 5;
      background-color: #fff;
      width: 100%;

      height: Px(240);
      overflow-y: scroll;
      border: Px(2) solid #eaeaea;

      li {
        width: 100%;
        padding: 0 Px(32);
        box-sizing: border-box;
        height: Px(80);
        line-height: Px(80);
        font-size: Px(32);
        color: #333333;
      }
    }

    .date {
      width: 100%;
      padding-left: Px(32);
      box-sizing: border-box;

      span {
        display: inline-block;
        margin-top: Px(20);
        margin-right: Px(20);
        width: Px(134);
        height: Px(54);
        background-color: #fff;
        border-radius: Px(27);
        text-align: center;
        font-size: Px(24);
        color: #333333;
        line-height: Px(54);
      }

      .result {
        margin-top: Px(40);
        font-size: Px(28);
        color: #999999;
        padding-bottom: Px(20);
      }
    }

    .list-item {
      width: 100%;
      height: Px(200);
      background: #ffffff;
      margin-top: Px(10);

      .title {
        position: relative;
        width: 100%;
        height: Px(90);
        padding: 0 Px(32);
        box-sizing: border-box;
        border-bottom: Px(2) solid #F4F4F4;

        .character {
          font-size: Px(36);
          color: #333333;
          line-height: Px(90);
        }

        .number {
          width: Px(36);
          height: px(36);
          border-radius: Px(4);
          font-size: Px(24);
          color: #FFFFFF;
          text-align: center;
          position: absolute;
          right: Px(32);
          top: Px(27);
        }

        .line {
          position: absolute;
          left: 0;
          top: 0;
          width: Px(5);
          height: Px(90);
          background: #12B0FF;
          border-radius: 0 2.5px 2.5px 0;
        }
      }

      .content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: Px(130);
        padding: 0 Px(32);
        box-sizing: border-box;

        div {
          text-align: center;

          .liang {
            font-size: Px(24);
            color: #999999;
          }

          .money {
            font-size: Px(32);
            color: #151515;
          }

          .rate {
            color: #F28681
          }

        }

      }

    }
  }
 
  .nodata {
    text-align: center;
    margin-top: Px(60);
    font-size: Px(40);
    color: #999999
  }

  .below {
    position: absolute;
    right: Px(32);
    top: Px(36);
    width: Px(33);
    height: Px(18);

  }

  .active {
    background: #12B0FF !important;
    color: #FFFFFF !important;
  }

  .firstone {
    background: #FF6364;
  }

  .secondtwo {
    background: #FEA35A;
  }

  .third {
    background: #68DE9E;
  }

  .others {
    background: #AAA8A9;
  }

</style>
