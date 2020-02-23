<template>
  <div>
    <div v-if="hascard">
      <div class="tops">
        <div class="line">
          <div class="one">
            <div :class="flag<1?'linellae':'linellae lins'"></div>
            <p class="number circle">
              <span class="shu high">1</span>
            </p>
            <div class="affirm high">确认位置</div>
          </div>
          <div class="one">
            <div :class="flag<2?'linellae':'linellae lins'"></div>
            <p :class="flag>=1 ?'number circle': 'number'">
              <span :class="flag>=1?'shu high':'shu'">2</span>
            </p>
            <div :class="flag>=1?'affirm high':'affirm'">确认安全</div>
          </div>
          <div class="one">
            <p :class="flag>=2?'number circle': ' number'">
              <span :class="flag>=2?'shu high':'shu'">3</span>
            </p>
            <div :class="flag>=2?'affirm high':'affirm'">开始洗车</div>
          </div>
        </div>
      </div>
      <div v-if="flag==2" class="flagsty">
        <p class="xiche">正在洗车</p>
        <p class="dengdai">请等待</p>
      </div>
      <div class="main" v-if="flag!=2">
        <div class="center">
          <div class="title">{{flag == 0? '请车俩停入洗车机指定位置':'请确认完成以下操作'}}</div>
          <div class="locationtip"> {{flag==0?'通过洗车机两侧辅助镜查看':'保障洗车过程车辆安全'}}</div>
        </div>
        <div v-if="flag==0" class="midland">
          <div class="reminder">
            <span>根据语音提示，前进或倒退车辆，确保车头到达绿色区域</span>
          </div>
          <div class="midd-car">
            <img class="cars" src="../../assets/images/car.png">
          </div>
          <div class="quit">
            <span>车轮停在黄线内</span>
          </div>
        </div>
        <div v-if="flag==1">
          <div class="center-foot">
            <div class="center-tu">
              <div class="tu" v-for="(item,index) in piclist" :key="index">
                <img class="tu-img" :src="item.pic">
                <p>{{item.tit}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="foot" v-if="flag!=2" :class="(flag==0 && carloc!=0) ? 'sel-foot':''" @click="nextStep">
        {{flag==1 ? '开始洗车' : '下一步'}}</div>
      <div class="foot urgency" v-if="flag==2" @click="jinji">
        <img src="../../assets/img/stop.png" alt class="cease">
        紧急停止
      </div>
      <div class="popup" v-if="show">
        <div class="kuang">
          <div class="wenzi">
            <p class="wenzi-title">提示</p>
            <P>确定要立即停止洗车吗？</P>
            <p>停止后洗车券不退还。</p>
          </div>
          <div class="kuang-botto">
            <span @click="finish">结束洗车</span>
            <span class="continue" @click="follow">继续洗车</span>
          </div>
        </div>
      </div>
    </div>
    <div class="nodata" v-if="!hascard">
      <other :isnodata="true"></other>
    </div>
  </div>
</template>
<script>
  import other from "../other/index.vue";

  export default {
    data() {
      return {
        showPage: false,
        ID: 0,
        /*劵的id */
        piclist: [{
            tit: '挂空档',
            pic: require('../../assets/img/empty.png')
          },
          {
            tit: '拉手刹',
            pic: require('../../assets/img/parking.png')
          },
          {
            tit: '收后视镜',
            pic: require('../../assets/img/rearview.png')
          },
          {
            tit: '关车窗',
            pic: require('../../assets/img/papaer.png')
          },
          {
            tit: '关雨刮',
            pic: require('../../assets/img/rain.png')
          },
          {
            tit: '收天线',
            pic: require('../../assets/img/antenna.png')
          }
        ],
        carloc: -1, // 车的位置 0 正好，1 需要上前，2 需要后退
        options: {
          radius: 80, // 圆圈直径
          strokeWidth: 16, // 进度条的宽度
          outerColor: "#ccc", // 剩余进度条颜色
          innerColor: "#FBA103" // 已完成进度条的颜色
        },
        percent: 0, // 百分比进度，用小数
        timer: null,
        flag: 1,
        time: 150, //设置倒计时的时间
        initTime: 150, //保存倒计时的时间
        show: false,
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
        hascard: true, //有没有劵
       // scoketUrl: 'wss://test.api.cheyuu.com:28888',
        // scoketUrl: 'ws://192.168.30.201:18888',
        scoketUrl: 'wss://api.cheyuu.com:38888',
        websock: null,
        socketCount: 0
      };
    },
    components: {
      other
    },
    computed: {
      /*获取时间 */
      overTime() {
        return this.$route.query.time
      },
      /*获取partnerID*/
      partnerID() {
        return this.$route.query.partnerID;
      },
      size() {
        return (document.body.clientWidth / 750) * 198 * 2 + "px";
      },
      h() {
        return Math.floor(this.time / 3600) < 10 ?
          "0" + Math.floor(this.time / 3600) :
          Math.floor(this.time / 3600);
      },
      m() {
        return Math.floor((this.time / 60) % 60) < 10 ?
          "0" + Math.floor((this.time / 60) % 60) :
          Math.floor((this.time / 60) % 60);
      },
      s() {
        return Math.floor(this.time % 60) < 10 ?
          "0" + Math.floor(this.time % 60) :
          Math.floor(this.time % 60);
      },
      percentTxt() {
        return Math.floor(this.percent * 100);
        
      }
    },
    destroyed() {
      this.websocketclose() //离开路由之后断开websocket连接
    },
    mounted() {
      this.gettime(); // 判断链接是否失效
      // let access_token = localStorage.getItem("access_token") || '';
      // if (access_token == '') {
      //   this.getToken();
      // } else {
      //   this.getuserinfo()
      // }
    },
    methods: {
      nextStep() {
        // if (this.flag == 0) { // 停车到位
        //   // if (this.carloc != 0) {
        //   //   return false
        //   // }
        //   this.goNext()
        // } else if (this.flag == 1) { // 停车到位下一步
        //   console.log('开始核销')
        //   this.startWash()
        // }
        if (this.flag == 0) {
          this.flag = 1;
          document.title = "确认位置";
        } else if (this.flag == 1) {
          //this.initWebSocket()
          this.startWash()
        }
      },
      // 获取token
      getToken() {
        this.$http.post("/v1/authentication/grant", {
          client_id: "thirdparty",
          client_secret: "12323",
          grant_type: "client_credentials"
        }, this.baseUrl, false).then(data => {
          if (data.error) {
            this.getToken();
          } else {
            let access_token = data.access_token;
            let refresh_token = data.refresh_token;
            localStorage["access_token"] = + access_token;
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
          // redirectUrl: "http://localhost:8088/#/?access_token=" + access_token + '&partnerID=' + this.partnerID
          redirectUrl: loginurl + '/html/ws2/index.html#/?partnerID=' + this.partnerID + "&time=" + this.overTime /*重定向url地址 */
        }, this.baseUrl, false).then(data => {
          if (data.redirectUrl) {
            location.href = data.redirectUrl;
          }
        });
      },
      /*获取用户信息*/
      getuserinfo() {
        let access_token = localStorage.getItem('access_token') || this.access_token
        this.$http.get("/v1/wsmember/logininfo?access_token=" + access_token, {},
          this.baseUrl
        ).then(data => {
          if (Number(data.ID) > 0) {
            localStorage["userinfo"] = JSON.stringify(data);
            console.log(1777, data)
            this.getwashstate()
          } else {
            this.getToken()

          }
        });
      },
      /*获取洗车状态*/
      getwashstate() {
        let access_token = localStorage.getItem('access_token') || '';
        this.$http.get('/v1/wsfbox/carwashinfo?access_token=' + access_token, {
          partnerID: this.partnerID
        }, this.baseUrl).then(data => {
          if (data.status) {
            if (data.data.wait == 1) {
              this.$router.replace({
                path: 'awaits',
                query: {
                  id: 1
                }
              })
            } else if (data.data.carWash == 1 && data.data.uid > 0) {
              this.flag = 2;
            } else {
              this.hasticket()
            }
          }
        });
      },

      /*获取当前时间戳*/
      gettime() {
        let currtime = Date.parse(new Date());
        let gaintime = Number(this.overTime) * 1000||(currtime)
       // console.log(17777, currtime-gaintime)
        if (currtime - gaintime > 180000||currtime-gaintime==0) { // 判断链接是否有效
        console.log(3688)
          this.$router.replace({
            path: 'awaits',
            query: {
              id: 0
            }
          })
          this.showPage = true
        } else { // 有效，再判断洗车机是不是在什么状态。有没洗车券
          let access_token = localStorage.getItem("access_token") || '';
          if (access_token == '') {
            this.getToken();
          } else {
            this.getuserinfo()
          }
        }
      },
      /*获取劵 */
      hasticket() {
        let access_token = localStorage.getItem('access_token') || '';
        this.$http.get('/v1/wscoupons/couponbyuid?access_token=' + access_token, {}, this.baseUrl).then(data => {
          if (data.length == 0) {
            this.showPage = true
            this.hascard = false;
          } else {
            //this.flag=0;
            this.ID = data.ID;
          }
        })
      },
      // flag == 0 的下一步
      goNext() {
        let access_token = localStorage.getItem('access_token') || '';
        this.$http.post('/v1/fbox/nextstep?access_token=' + access_token, {
          partnerID: this.PID
        }, this.baseUrl).then(data => {
          // console.log(data)
          this.flag = 1;
          document.title = "确认位置";
        });
      },
      // 核销券（启动洗车机）
      startWash() {
        let access_token = localStorage.getItem('access_token') || '';
        this.$http.post('/v1/wsorder/createorder?access_token=' + access_token, {
          partnerID: this.partnerID,
          couponID: this.ID
        }, this.baseUrl).then(data => {
          if (data.result > 0) {
            this.initWebSocket()
            this.flag = 2
          }
        });
      },
      // 停止洗车
      stopWash() {
        let access_token = localStorage.getItem('access_token') || '';
        this.$http.post('/v1/wsfbox/stopcarwash?access_token=' + access_token, {
        }, this.baseUrl).then(data => {
          console.log(data)
          if (data.status) {
            this.show = false
            this.$router.replace({
              name: 'other'
            })
          }
        });
      },
      /*弹窗 */
      jinji() {
        this.show = true;
      },
      /*结束事件*/
      finish() {
        this.stopWash()
      },
      /*继续事件*/
      follow() {
        this.show = false;

      },
      initWebSocket() { //初始化weosocket
        console.log('执行初始化')
        if (!window.WebSocket) {
          console.log('浏览器不支持WebSocket')
        } else {
          this.websock = new WebSocket(this.scoketUrl);
          this.websock.onmessage = this.websocketonmessage; /*数据接收 */
          this.websock.onopen = this.websocketonopen; /*连接服务 */
          this.websock.onerror = this.websocketonerror; /*连接失败 */
          this.websock.onclose = this.websocketclose; /*断开连接*/
          console.log('window==', this.websock)
        }
      },
      websocketonopen() { //连接建立之后执行send方法发送数据
        console.log('连接服务')
        // fboxid：uid ：access_token
        let access_token = localStorage.getItem('access_token') || '';
        let fboxid = this.partnerID;
        let uid = JSON.parse(localStorage.getItem('userinfo')).ID
        let str = fboxid + ':' + uid + ':' + access_token
        console.log(1887, str)
        this.websocketsend(str);
      },
      websocketonerror(e) { //连接建立失败重连
        console.log('连接失败，重连', e);
        if (this.socketCount >= 3) {
          this.$vux.toast.show({
            type: 'warn',
            text: 'scoket连接失败'
          })
        } else {
          this.socketCount++
          this.initWebSocket();
        }
      },
      websocketonmessage(e) { //数据接收
        let redata = JSON.parse(e.data)
        console.log('接收的消息：', redata)
        if (redata.type == 'data') {
          if (redata.endcarwash == 1) {
            this.$router.push({
              name: 'other'
            })
            return false
          }
          if (redata.carwash == 1) { // 洗车中
            this.flag = 2
          }
          this.showPage = true
        } else if (redata.type == 'jump') {
          if (redata.page == 'other') { // 跳 洗车结束
            this.$router.replace({
              name: 'other'
            })
          } else if (redata.page == 'awaits') { // 跳请稍等 有人在洗车
            this.$router.replace({
              name: 'awaits',
              query: {
                id: 1
              }
            })
          }
        }
      },
      websocketsend(Data) { //数据发送
        console.log('发送数据')
        this.websock.send(Data);
      },
      websocketclose(e) { //关闭
        console.log('断开连接', e);
      }
    }
  };

</script>
<style lang="scss" scoped>
  @import "../../styles/variable.scss";

  .tops {
    overflow: hidden;
    width: 100%;
    height: Px(300);
    background-image: linear-gradient(-180deg, #f46b02 0%, #fa9f02 100%);

    .line {
      margin: Px(50) Px(60);
      display: flex;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-pack: justify;
      -webkit-justify-content: space-between;
      -ms-flex-pack: justify;
      justify-content: space-between;

      .one {
        position: relative;

        .linellae {
          position: absolute;
          width: Px(238);
          height: 2px;
          background: #fbc67a;
          top: Px(18);
          left: Px(60);
        }

        .number {
          position: absolute;
          top: 0;
          left: 30%;
          width: Px(30);
          height: Px(30);
          border-radius: 50%;
          color: #fbc67a;
          border: 2px solid #fbc67a;
          position: relative;

          .shu {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: Px(20);
          }
        }

        .affirm {
          margin-top: Px(10);
          margin-left: Px(-5);
          font-size: Px(22);
          color: #fbc67a;
        }
      }
    }
  }

  .main {
    overflow: hidden;
    position: relative;
    z-index: 5;
    margin: Px(-120) Px(20) Px(0);
    background: #ffffff;
    box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.06);
    border-radius: Px(14);
    box-sizing: border-box;

    .center {
      .title {
        margin-top: Px(50);
        text-align: center;
        color: #000;
      }

      .explain {
        font-size: Px(30);
        color: #ccc;
        text-align: center;
        margin-top: Px(10);

        .count {
          display: inline-block;
          border-radius: Px(2);
          padding: 0 Px(5);
          background: #f76a00;
          color: #ffffff;
        }
      }
    }
  }

  .securities {
    margin-top: Px(10);
    height: Px(30);
    text-align: center;
    // margin-top: 20px;
    font-size: Px(24);
    color: #999999;
  }

  .midland {
    margin: Px(34) 0 0;
    padding-bottom: Px(124);
    position: relative;
    color: #666666;
    text-align: justify;
    line-height: Px(42);
    font-size: Px(28);

    .reminder {
      position: absolute;
      left: Px(15);
      bottom: Px(120);
      width: Px(160);
      height: Px(230);
      padding: Px(5) Px(10);
      border: 1px solid #e4e4e3;
      border-radius: Px(10);
    }

    .quit {
      position: absolute;
      right: Px(15);
      bottom: Px(260);
      width: Px(180);
      height: Px(100);
      border: 1px solid #e4e4e3;
      border-radius: Px(10);
      padding: Px(5) Px(10);
    }

    .midd-car {
      position: relative;
      width: Px(390);
      height: Px(450);
      margin: 0 auto;
      background: url('../../assets/images/loca.png') no-repeat;
      background-size: 100% 100%;
      background-position: 0 0;

      .cars {
        position: absolute;
        top: Px(98);
        left: 50%;
        transform: translateX(-50%);
        display: block;
        width: Px(186);
      }

      .uptip {
        display: block;
        position: absolute;
        top: Px(216);
        left: Px(146);
        width: Px(98);
        animation: upfade 2s ease 0s infinite normal forwards;
      }

      .downtip {
        display: block;
        position: absolute;
        top: Px(358);
        left: Px(146);
        width: Px(98);
        animation: downfade 2s ease 0s infinite normal forwards;
      }
    }
  }

  .center-foot {
    width: 100%;
    margin: Px(140) 0 Px(72);

    .center-tu {
      overflow: hidden;

      .tu {
        width: 33.33%;
        height: Px(217);
        text-align: center;
        float: left;

        .tu-img {
          margin: 0 auto 0;
          display: block;
          width: Px(60);
        }

        p {
          color: #666666;
          font-size: Px(28);
          margin-top: Px(20);
        }
      }
    }
  }

  .sel-foot {
    // background: #bfbfbf !important;
  }

  .foot {
    margin-top: Px(30);
    margin-left: Px(30);
    width: Px(690);
    height: Px(80);
    background-image: linear-gradient(-180deg, #fba302 0%, #f56a01 100%);
    border-radius: Px(10);
    text-align: center;
    line-height: Px(80);
    color: #ffffff;
  }

  .urgency {
    background: #ffffff !important;
    border: 1px solid #f76a00;
    font-size: Px(32);
    color: #f76a00;
    position: fixed;
    left: 0;
    bottom: Px(60);
  }

  .cease {
    position: relative;
    width: Px(44);
    height: Px(40);
    top: Px(5);
    left: Px(5);
    background-size: 100% 100%;
  }

  .circle-round {
    position: relative;
    margin: Px(50) auto Px(200);

    .circle-wrap {
      position: absolute;
      font-size: Px(130);
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);

      p {
        text-align: center;
        font-size: Px(130);
        color: #f76a00;
      }

      div {
        text-align: center;
        font-size: Px(28);
        color: #ccc;
      }
    }
  }

  .high {
    color: #fff !important;
  }

  .circle {
    color: #ffffff !important;
    border: 2px solid #ffffff !important;
  }

  .lins {
    background: #ffffff !important;
  }

  .popup {
    width: 100%;
    height: 100%;
    padding: 0 Px(70);
    box-sizing: border-box;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    background: rgba(0, 0, 0, 0.5);

    .kuang {
      width: Px(610);
      height: Px(370);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #ffffff;
      border-radius: Px(30);
      text-align: center;
      font-size: Px(32);
      color: #999999;
      line-height: 24px;

      .wenzi {
        padding: Px(40) 0 Px(60);
        border-bottom: 1px solid #e9e9e9;

        .wenzi-title {
          font-size: Px(36);
          color: #000;
          line-height: Px(80);
        }
      }

      .kuang-botto {
        display: flex;
        font-size: Px(36);
        color: #999999;

        span {
          padding-top: Px(20);
          flex: 1;
          text-align: center;
        }

        .continue {
          color: #01a2ae !important;
        }
      }
    }
  }

  .locationtip {
    text-align: center;
    color: #999999;
    font-size: Px(30);

    div>img {
      display: block;
      margin-right: Px(10);
      width: Px(40);
    }

    div {
      font-size: Px(40);
      color: #fff;
    }

    &.green {
      background: #09BB07;
    }
  }

  @keyframes upfade {
    0% {
      transform: translateY(0);
    }

    70% {
      opacity: 1;
    }

    100% {
      transform: translateY(Px(-136));
      opacity: 0;
    }
  }

  @keyframes downfade {
    0% {
      transform: translateY(Px(-136));
    }

    70% {
      opacity: 1;
    }

    100% {
      transform: translateY(0);
      opacity: 0;
    }
  }

  .flagsty {
    margin-top: Px(200);
    text-align: center;
  }

  .xiche {
    font-size: Px(40);
    color: #000;
  }

  .dengdai {
    font-size: Px(32);
    color: #ccc;
    line-height: Px(60);
    padding-left: Px(-12)
  }

</style>
