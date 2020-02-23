<template>
  <div class="main" v-if="ispage">
    <div class="inform">
      <div class="inform-content">
        <div class="inform-top ">
          <div>故障申报通知</div>
          <div v-if="isshow&&objectdetail.ContactID!=147">
            <div :class="[objectdetail.State==1?'status solve':objectdetail.State==2?'status dispose':'status solve']">
              {{objectdetail.State==1?'未处理':objectdetail.State==2?'处理中':'已解决'}}</div>
          </div>
        </div>
        <div class="inform-ban" v-if="ispersonne">
          <div class="inform-name">
            <div class="name-lf">站点名称：</div>
            <div class="name-rt"> {{objectdetail.Title}}</div>
          </div>
          <div class="inform-name">
            <div class="name-lf">申报人:</div>
            <div class="name-rt"> {{objectdetail.Contact}}</div>
          </div>
           <div class="inform-name">
            <div class="name-lf">品牌:</div>
            <div class="name-rt"> {{objectdetail.MachineBrand}}</div>
          </div>
              <div class="inform-name">
            <div class="name-lf">类型:</div>
            <div class="name-rt"> {{objectdetail.MachineTypes}}</div>
          </div>

          <div class="inform-name">
            <div class="name-lf">申报时间:</div>
            <div class="name-rt">{{objectdetail.CreateTime}}</div>
          </div>

        </div>
        <div class="inform-personne" v-if="objectdetail.Head>0">
          <div class="inform-name">
            <div class="name-lf">负责人：</div>
            <div class="name-rt">{{objectdetail.headName}}</div>
          </div>
          <div class="inform-name">
            <div class="name-lf">接收时间:</div>
            <div class="name-rt">{{objectdetail.GetTime}}</div>
          </div>
        </div>
        <div class="fault">
          <div class="fault-title">故障描述</div>
          <div class="fault-content">{{objectdetail.Detail}}</div>
        </div>
        <div class="fault">
          <div class="fault-title">故障图片</div>
          <div class="fault-listimg" v-for="(item,index) in img" :key='index'>
            <div class="fault-img">
              <div><img :src="item" alt="" @click="previewImg(index)"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
    <div class="btndeclare">
      <div v-if='!(IDS==objectdetail.Head||IDS==objectdetail.ContactID)'>
        <mybutton @todo="submit" :title="btnText" v-if="PartnerID==147&&objectdetail.Head==0"></mybutton>
      </div>
      <div >
      <mybutton @todo="tosolve(objectdetail.State)" :title="objectdetail.State!=3?'已解决':'重新申请'" v-if="PartnerID!=147&&IDS==objectdetail.ContactID">
      </mybutton>
      </div>
      <div  >
      <mybutton @todo="todeclare" :title="objectdetail.State=2?'已解决':''"
        v-if="PartnerID==147&&isstatus==1&&objectdetail.State==2"></mybutton>
        </div>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import mybutton from '../componnents/button';
  export default {
    data() {
      return {
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
        ispersonne: true,
        ispage: false,
        isshow: false,
        btnText: '接收工单',
        objectdetail: {},
        img: [],
        PartnerID: 0,
        IDS: 0
      }
    },
    components: {
      mybutton
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
      ID() {
        return this.$route.query.id;
      },
      isstatus() {
        return this.$route.query.isstatus;
      }

    },
    mounted() {
      if (!this.access_token) {
        this.getToken()
      } else {
        this.getuserinfo()
      }

    },
    methods: {
      previewImg(index) {
        wx.previewImage({
          current: this.img[index], // 当前显示图片的http链接
          urls: this.img // 需要预览的图片http链接列表
        });
      },
      todeclare() {
        this.solvefault()
      },
      submit() {
        this.getfaultrecord()
      },
      tosolve(state) {
        if (state == 3) {
          this.repeatrecord()
        } else {
          this.solvefault()
        }
      },
      getToken() {
        this.$http.post('/v1/authentication/grant', {
          client_id: 'wechat_partner_app',
          // client_secret: 'fc175860ebd8e9f207826459f0b6695d', //正式
          client_secret: this.$isTest ? '7b80e058274bf47aa1acdf0fc9c89cda' :
          'fc175860ebd8e9f207826459f0b6695d', //测试
          grant_type: 'client_credentials'
        }, this.baseUrl).then(data => {
          if (data.error) {
            // this.$vux.toast.show({
            //   type: 'warn',
            //   text: data.data.error.message
            // })
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
      login() {
        this.$http.post('/v1/authentication/loginwechat?access_token=' + this.access_token, {
          wechatIdentity: 'partner',
          redirectUrl: this.$isTest ? 'https://test.p.cheyuu.com/html/washcar/index.html#/details?id=' + this.ID :
            'https://p.cheyuu.com/html/washcar/index.html#/details?id=' + this.ID
        }, this.baseUrl).then(data => {
          if (data.redirectUrl) {
            location.href = data.redirectUrl
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
            this.IDS = data.ID
            this.PartnerID = data.PartnerID
            localStorage['userinfo'] = JSON.stringify(data);
            this.$store.dispatch('setUserinfo', JSON.stringify(data))
            this.$store.dispatch('setAccessToken', access_token)
            this.$store.dispatch('setRefreshToken', refresh_token)
            this.faultdetail()
            /// 执行页面的列表 到这里已经授权了
          }
        })
      },
      /*故障详情 */
      faultdetail() {
        this.$http
          .get('/v2/apply/faultdetail?access_token=' + this.access_token, {
            ID: this.ID
          }, this.baseUrl)
          .then(data => {
            if (data.error) {
              if (data.error.code == 401) {} else {
                this.$vux.toast.show({
                  type: 'warn'
                });
              }
            } else {
              this.ispage = true
              this.objectdetail = data
              if (data.ImageFile != '') {
                this.img = data.ImageFile.split(',')
              }
              if (data.state != 1) {
                this.isshow = true
              }
            }
          });
      },
      /*重新申报故障 */
      repeatrecord() {
        this.$http.post('/v2/apply/repeatrecord?access_token=' + this.access_token, {
            ID: this.ID
          }, this.baseUrl)
          .then(data => {
            if (data.error) {
              if (data.error.code == 401) {} else {
                this.$vux.toast.show({
                  type: 'warn',
                  text: data.error.message
                });
              }
            } else {
              if (data.result != 0) {
                this.$vux.toast.show({
                  type: 'success',
                  text: '申报成功'
                });
                this.faultdetail()
              }
            }
          });
      },
      /*解决故障*/
      solvefault() {
        this.$http.post('/v2/apply/solvefault?access_token=' + this.access_token, {
            ID: this.ID,
            state: '3'
          }, this.baseUrl)
          .then(data => {
            if (data.error) {
              if (data.error.code == 401) {} else {
                this.$vux.toast.show({
                  type: 'warn',
                  text: data.error.message
                });
              }
            } else {
              if (data.result != 0) {
                this.$vux.toast.show({
                  type: 'success',
                  text: '解决成功'
                });
                this.faultdetail()
              }
            }
          });
      },

      /*接收工单*/
      getfaultrecord() {
        this.$http.post('/v2/apply/getfaultrecord?access_token=' + this.access_token, {
            ID: this.ID,
          }, this.baseUrl)
          .then(data => {
            if (data.error) {
              if (data.error.code == 401) {} else {
                this.$vux.toast.show({
                  type: 'warn',
                  text: data.error.message
                });
              }
            } else {
              if (data.result != 0) {
                this.$vux.toast.show({
                  type: 'success',
                  text: '接收成功'
                });
                this.$router.replace({
                  path: 'workorder'
                })

              }
            }
          });
      }
    }
  }

</script>
<style lang="scss" scoped>
  @import "../../styles/variable.scss";

  .main {
    width: 100%;
    padding: 0 Px(16);
    box-sizing: border-box;

    .inform {
      margin-top: Px(20);
      width: 100%;
      padding-bottom: Px(30);
      background-color: #fff;
      box-shadow: 2px 2px 9px 0 rgba(168, 168, 168, 0.35);
      border-radius: Px(10);
      overflow: hidden;

      .inform-content {
        width: 100%;
        padding: 0 Px(24);
        box-sizing: border-box;

        .inform-top {
          padding: Px(20) 0;
          border-bottom: 1px dashed #BFBFBF;
          color: #000000;
          font-size: Px(32);
          display: flex;
          justify-content: space-between;
        }

        .inform-ban {
          padding-bottom: Px(20);
        }

        .fault {
          padding-bottom: Px(20);

          .fauilt-title {
            color: #000000;
            font-size: Px(32);
            line-height: Px(60);
          }

          .fault-content {
            font-size: Px(28);
            color: #999999;
          }

          .fault-listimg {
            width: 103%;
            margin-top: Px(20);

            .fault-img {
              width: 33.33%;
              height: Px(207);
              float: left;
              padding-right: Px(16);
              box-sizing: border-box;

              div {
                width: 100%;
                height: 100%;
                position: relative;

                img {
                  position: absolute;
                  width: 100%;
                  height: 100%;

                }
              }

            }
          }
        }


      }
    }

    .btndeclare {
      margin-top: Px(40);
    }
  }

  .inform-name {
    display: flex;
    justify-content: space-between;
    font-size: Px(28);
    line-height: Px(60);

    .name-lf {
      color: #999999;
    }

    .name-rt {
      color: #000000;

    }
  }

  .status {
    border-radius: 2px;
    color: #fff;
    font-size: Px(24);
    padding: Px(3) Px(10) 0;

  }

  .dispose {
    background: #FEA35A;
  }

  .solve {
    background: #68DE9E;
  }

  .fault-title {
    padding: Px(20) 0;
  }

</style>
