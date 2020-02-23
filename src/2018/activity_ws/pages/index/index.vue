/* eslint-disable eqeqeq */
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
            <p :class="flag>1||selects==0?'number circle': 'number'">
              <span :class="flag>1?'shu high':'shu'">2</span>
            </p>
            <div :class="flag>1||selects==0?'affirm high':'affirm'">确认安全</div>
          </div>
          <div class="one">
            <p :class="flag>=2?'number circle': ' number'">
              <span :class="flag>=2?'shu high':'shu'">3</span>
            </p>
            <div :class="flag>=2?'affirm high':'affirm'">开始洗车</div>
          </div>
        </div>
      </div>
      <div class="main">
        <div class="center">
          <div class="title">{{flag == 0? '请车俩停入洗车机指定位置':flag == 1?'请确认完成以下操作':'正在洗车'}}</div>
          <div class="explain">
            {{flag == 0 ? '请车俩停入洗车机指定位置':flag == 1?'保证洗车过程安全':'剩余时间'}}
            <span v-if="flag==2&&h>0" class="count">{{h}}</span>
            <span v-if="flag==2&&h>0">:</span>
            <span v-if="flag==2&&m>0" class="count">{{m}}</span>
            <span v-if="flag==2&&m>0">:</span>
            <span v-if="flag==2" class="count">{{s>3?s:s}}</span>
          </div>
        </div>
        <div v-if="flag==0" class="midland">
          <div class="reminder">
            <span>根据语音提示，前进或倒退车辆，确保车头到达绿色区域</span>
          </div>
          <div class="midd-car">
            <img src="../../assets/img/car.png" alt class="cars">
          </div>
          <div class="quit">
            <span>车轮停在黄线内</span>
          </div>
        </div>
        <div v-if="flag==1">
          <div class="center-foot">
            <div class="center-tu">
              <div class="tu">
                <div class="tus">
                  <img src="../../assets/img/empty.png" alt class="tu-img">
                </div>
                <p>挂空档</p>
              </div>
              <div class="tu">
                <div class="tus">
                  <img src="../../assets/img/parking.png" alt class="tu-img">
                </div>
                <P>拉手刹</P>
              </div>
              <div class="tu">
                <div class="tus">
                  <img src="../../assets/img/rearview.png" alt class="tu-img">
                </div>
                <P>收后视镜</P>
              </div>
              <div class="tu">
                <div class="tus">
                  <img src="../../assets/img/papaer.png" alt class="tu-img">
                </div>
                <P>关车窗</P>
              </div>
              <div class="tu">
                <div class="tus">
                  <img src="../../assets/img/rain.png" alt class="tu-img">
                </div>
                <p>关雨刮</p>
              </div>
              <div class="tu">
                <div class="tus">
                  <img src="../../assets/img/antenna.png" alt class="tu-img">
                </div>
                <p>收天线</p>
              </div>
            </div>
            <div class="lower">
              <img src="../../assets/img/unselected.png" alt class="selected" @click="select" v-if="selects">
              <img src="../../assets/img/Selected.png" alt class="selected" @click="select" v-else>
              <span class="safety">已确认车辆安全</span>
            </div>
          </div>
        </div>
        <div v-if="flag==2">
          <div class="circle-round" :style="{height:size}">
            <progress-circle :progressOption="options" :completeness="percent"></progress-circle>
            <div class="circle-wrap">
              <p>{{percentTxt}}</p>
              <div>{{time==0?'已完成':'请稍等'}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="securities" v-if="flag==1&&!selects">使用一张免费洗车劵</div>
      <div class="foot sel-foot" v-if="flag==1&&selects">下一步</div>
      <div class="foot" @click="nextStep" v-else>下一步</div>
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
    <div class="nodata" v-else>
      <other :isnodata="true"></other>
    </div>
  </div>
</template>
<script>
  import progressCircle from '../../components/circle.vue';
  import other from '../other/index.vue';
  import {
    setTimeout
  } from 'timers';
  //     wx.config({
  //     debug: false,
  //     appId: this.appId,
  //     timestamp: this.timestamp,
  //     nonceStr: this.nonceStr,
  //     signature:this.signature,
  //     jsApiList: [
  //     'getLocation',
  //     ]
  // });

  export default {
    data() {
      return {
        options: {
          radius: 80, // 圆圈直径
          strokeWidth: 16, // 进度条的宽度
          outerColor: '#ccc', // 剩余进度条颜色
          innerColor: '#FBA103' // 已完成进度条的颜色
        },
        percent: 0, // 百分比进度，用小数
        timer: null,
        flag: 0,
        time: 150, // 设置倒计时的时间
        initTime: 150, // 保存倒计时的时间
        selects: true, // 默认没有选中
        show: false,
        // baseUrl: "https://api.cheyuu.com/",
        baseUrl: 'http://napi.qikebang.com/',
        // baseUrl: "http://test.api.cheyuu.com/",
        hascard: true, // 有没有劵
        finis: 0, // 未完成
        restper: 0, // 记录剩下5秒的时候进度条位置
        lat: 0, // 获取当前维度
        lng: 0, // 获取当前经度
        lat1: 0, // 返回的维度
        lng1: 0 // 返回的经度
        // access_token: "8916c6527474f9d488ba059d54c74559150a2289"
      };
    },
    components: {
      progressCircle,
      other
    },
    computed: {
      /* 优惠劵的id*/
      couponID() {
        return this.$route.query.couponID
      },
      /* 获取时间 */
      timetimestamp() {
        return this.$route.query.time
      },
      /* 获取用户pid */
      PID() {
        return this.$route.query.pid;
      },
      /* 获取appId*/
      appId() {
        return this.$route.query.appId;
      },
      /* 获取timestamp*/
      timestamp() {
        return this.$route.query.timestamp;
      },
      /* 获取nonceStr*/
      nonceStr() {
        return this.$route.query.nonceStr;
      },
      /* 获取signature*/
      signature() {
        return this.$route.query.signature;
      },
      size() {
        return (document.body.clientWidth / 750) * 198 * 2 + 'px';
      },
      h() {
        return Math.floor(this.time / 3600) < 10
        ? '0' + Math.floor(this.time / 3600)
        : Math.floor(this.time / 3600);
      },
      m() {
        return Math.floor((this.time / 60) % 60) < 10
        ? '0' + Math.floor((this.time / 60) % 60)
        : Math.floor((this.time / 60) % 60);
      },
      s() {
        return Math.floor(this.time % 60) < 10
        ? '0' + Math.floor(this.time % 60)
        : Math.floor(this.time % 60);
      },
      percentTxt() {
        return Math.floor(this.percent * 100);
      }
    },
    created() {

    },
    mounted() {
      let access_token = localStorage.getItem('access_token') || '';
      if (access_token == '') {
        this.getToken();
      } else {
        this.getuserinfo()
      }
      this.$nextTick(() => {
        setTimeout(() => {
          // this.distance()

        }, 500)
      })
    },
    methods: {
      /* 获取经纬度 */
      // distance() {
      //   wx.getLocation({
      //     type: 'gcj02',
      //     success: function (res) {
      //       this.lat = res.latitude,
      //         this.lng = res.longitude
      //       //console.log(3333,res.latitude,res.longitude)
      //     },
      //   });

      // },
      /* 计算距离*/
      // calcDis(lat1, lng1, lat2, lng2) {
      //   lat1 = lat1 || 0;
      //   lng1 = lng1 || 0;
      //   lat2 = lat2 || 0;
      //   lng2 = lng2 || 0;
      //   let rad1 = lat1 * Math.PI / 180.0;
      //   let rad2 = lat2 * Math.PI / 180.0;
      //   let a = rad1 - rad2;
      //   let b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
      //   let r = 6378137; //地球半径
      //   let distance = r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) *
      //     Math.pow(Math.sin(b / 2), 2)));
      //   if (distance > 100) {
      //     this.$router.replace({
      //       path: 'awaits',
      //       query: {
      //         id: 3
      //       }
      //     })
      //   }
      // },
      nextStep() {
        if (this.flag == 0) {
          this.flag = 1;
          this.dostep(2);
          document.title = '确认位置';
        } else if (this.flag == 1) {
          this.vertica()
        }
      },
      // 获取token
      getToken() {
        this.$http.post('v1/authentication/grant', {
          client_id: 'wechat_mobile_app',
          client_secret: '26a8a646db0c94b41141ca563be87876',
          grant_type: 'client_credentials'
        },
            this.baseUrl
          )
          .then(data => {
            if (data.error) {
              this.getToken();
            } else {
              let access_token = data.access_token;
              let refresh_token = data.refresh_token;
              localStorage['access_token'] = access_token;
              localStorage['refresh_token'] = refresh_token;
              this.login();
            }
          });
      },
      // 登录接口
      login() {
        let access_token = localStorage.getItem('access_token') || '';
        this.$http
          .post(
            'v1/authentication/loginwechat?access_token=' + access_token, {
              wechatIdentity: 'oil',
              redirectUrl: 'https://m.cheyuu.com/html/fbox/index.html#/?pid=' + this.PID + '&time=' + this
                .timetimestamp + '&couponID=' + this.couponID + '&appId=' + this.appId + '&timestamp=' + this
                .timestamp + '&nonceStr=' + this.nonceStr + '&signature=' + this.signature + ''
            },
            this.baseUrl, false
          )
          .then(data => {
            // console.log('登录接口:',data)
            if (data.redirectUrl) {
              location.href = data.redirectUrl;
            }
          });
      },
      /* 获取Uid*/
      getuserinfo() {
        let access_token = localStorage.getItem('access_token') || ''
        this.$http.get('v1/members/loginuserinfo?access_token=' + access_token, {},
            this.baseUrl, false
          )
          .then(data => {
            //  console.log('userinfo接口：', data)
            if (Number(data.UID) > 0) {
              localStorage['userinfo'] = data;
              this.gettime();
              if (!this.timer) {
                clearInterval(this.timer)
              }
            } else {
              this.getToken()
            }
          });
      },
      /* 开始洗车*/
      fbox() {
        let access_token = localStorage.getItem('access_token') || '';
        this.$http
          .post(
            'v1/fbox/washstart?access_token=' + access_token, {
              PID: this.PID
            },
            this.baseUrl, false
          )
          .then(data => {
            if (data.code == '000000') {
              this.fbox1();
            }
          });
      },
      /* 开始洗车成功后调用*/
      fbox1() {
        let access_token = localStorage.getItem('access_token') || '';
        this.$http
          .post(
            'v1/fbox/initwashstart?access_token=' + access_token, {
              PID: this.PID
            },
            this.baseUrl
          )
          .then(data => {
            if (data.code == '000000') {
              if (this.flag == 0) {
                this.flag = 1;
              }
              if (this.flag == 1) {
                this.flag = 2;
                this.dostep(3);
                document.title = '洗车中';
                this.cutdown();
              }
            }
          });
      },
      /* 提交操作步骤 */
      dostep(flag) {
        let access_token = localStorage.getItem('access_token') || '';
        // console.log(158,access_token )
        this.$http
          .post(
            'v1/fbox/dostep?access_token=' + access_token, {
              PID: this.PID,
              Step: flag
            },
            this.baseUrl
          )
          .then(data => {
            if (data.code == '000000') {
              if (flag == 4) {
                setTimeout(() => {
                  this.$router.replace({
                    name: 'other'
                  });
                }, 1000);
              }
            }
          });
      },
      /* 获取操作步骤 */
      getdostep() {
        let access_token = localStorage.getItem('access_token') || '';
        this.$http.get(
            'v1/fbox/userstep?access_token=' + access_token, {
              PID: this.PID
            },
            this.baseUrl
          )
          .then(data => {
            if (data.code == '000000') {
              this.lng1 = data.data.space.lng;
              this.lat1 = data.data.space.lat;
              if (data.data.IsWork == 0) {
                this.flag == 0;
                this.dostep(1);
                this.isfinish(true)
              } else if (data.data.IsWork == 1) {
                if (data.data.Step == 3) {
                  this.flag = data.data.Step - 1;
                  this.time = 5;
                  this.percent = (this.initTime - 5) / this.initTime
                  this.cutdown()
                } else if (data.data.Step == 2) {
                  this.flag = 1;
                  this.isfinish(true)
                  // this.hasticket()
                  // this.flag=data.data.Step-1;
                } else {
                  // eslint-disable-next-line eqeqeq
                  this.flag == 0;
                  this.isfinish(true)
                }
              } else {
                this.$router.replace({
                  path: 'awaits',
                  query: {
                    id: 1
                  }
                })
              }
            }
          });
      },
      /* 停止接口*/
      initwashstop() {
        let access_token = localStorage.getItem('access_token') || '';
        this.$http
          .post(
            'v1/fbox/initwashstop?access_token=' + access_token, {
              PID: this.PID
            },
            this.baseUrl
          )
          .then(data => {
            if (data.code == '000000') {
              this.dostep(4);
            }
          });
      },
      /* 是否完成 */
      isfinish(ishome = false) {
        clearInterval(this.timer);
        let access_token = localStorage.getItem('access_token') || '';
        this.$http
          .post(
            'v1/fbox/isfinish?access_token=' + access_token, {
              PID: this.PID
            },
            this.baseUrl, false
          )
          .then(data => {
            if (data.code == '000000') {
              if (ishome) {
                if (data.data.value == 0) {
                  this.$router.replace({
                    path: 'awaits',
                    query: {
                      id: 1
                    }
                  })
                }
              } else {
                this.finis = data.data.value;
                if (data.data.value == 0) {
                  this.isfinish();
                } else {
                  this.cutdown();
                }
              }
            }
          });
      },
      /* 获取当前时间戳*/
      gettime() {
        let currtime = Date.parse(new Date()) / 1000;
        let gaintime = this.timetimestamp - 0
        if (currtime - gaintime > 180) {
          this.$router.replace({
            path: 'awaits',
            query: {
              id: 0
            }
          })
        } else {
          if (this.couponID == '') {
            this.hascard = false
          } else {
            this.hascard = true;
            this.hasticket()
          }
        }

      },
      /* 获取劵 */
      hasticket() {
        let access_token = localStorage.getItem('access_token') || '';
        this.$http
          .post(
            'v1/fbox/hasticket?access_token=' + access_token, {
              PID: this.PID,
              CouponID: this.couponID
            },
            this.baseUrl, false
          )
          .then(data => {
            if (data.code == '000000') {
              if (data.data.value == 1) {
                document.title = '确认停车位置';
                this.hascard = true
                this.getdostep()
              } else {
                this.hascard = false;
              }
            }
          });
      },
      /* 核销劵*/
      vertica() {
        let access_token = localStorage.getItem('access_token') || '';
        this.$http
          .post(
            'v1/fbox/verifiticket?access_token=' + access_token, {
              PID: this.PID,
              CouponID: this.couponID
            },
            this.baseUrl
          )
          .then(data => {
            if (data.code == '000000') {
              if (data.data.value == 1) {
                this.fbox();
              } else {
                this.$router.replace({
                  path: 'awaits',
                  query: {
                    id: 2
                  }
                })
              }
            }
          });
      },
      /* 选中未选中 */
      select() {
        this.selects = !this.selects;
        this.gettime();
      },
      /* 弹窗 */
      jinji() {
        this.show = true;
        clearInterval(this.timer);
      },
      /* 结束事件*/
      finish() {
        this.initwashstop();
      },
      /* 继续事件*/
      follow() {
        this.show = false;
        this.cutdown();
      },
      cutdown() {
        if (this.finis == 0) {
          this.timer = setInterval(() => {
            if (this.time < 6) {
              clearInterval(this.timer);
              this.restper = (100 - this.percent * 100) / 100;
              this.isfinish();
            } else {
              this.percent = (this.percent * this.initTime + 1) / this.initTime;
              this.time--;
            }
          }, 1000);
        } else {
          this.timer = setInterval(() => {
            if (this.time <= 1) {
              clearInterval(this.timer);
              this.dostep(4);
            }
            this.percent = (this.restper * 100 + 500 * this.percent) / 500;
            this.time--;
          }, 500);
        }
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
    text-align: center;
    // margin-top: 20px;
    font-size: Px(24);
    color: #999999;
  }

  .midland {
    margin: Px(50) 0;
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
      width: Px(390);
      height: auto;
      margin: 0 auto;

      .cars {
        width: 100%;
        height: 100%;
      }
    }
  }

  .center-foot {
    width: 100%;
    margin: Px(50) 0;

    .center-tu {
      overflow: hidden;

      .tu {
        width: 33.33%;
        height: Px(200);
        text-align: center;
        float: left;

        .tus {
          margin: 0 auto;
          width: Px(60);
          height: auto;

          .tu-img {
            width: 100%;
            height: 100%;
            background-size: 100% 100%;
          }
        }

        p {
          color: #666666;
          font-size: Px(28);
          margin-top: Px(20);
        }
      }
    }

    .lower {
      margin-top: Px(100);
      text-align: center;

      .safety {
        color: #666666;
        font-size: Px(28);
      }

      .selected {
        position: relative;
        top: Px(5);
        left: Px(0);
        width: Px(36);
        height: Px(36);
        background-size: 100% 100%;
      }
    }
  }

  .sel-foot {
    background: #bfbfbf !important;
  }

  .foot {
    margin-top: Px(60);
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

</style>
