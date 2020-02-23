<template>
  <div class="main">
    <div class="declare_detail_wrap">
      <div class="detail_top">
        <div class="detail_title">
          <img src="../../assets/logo.png" alt="">
          <span>车友网</span>
        </div>
        <div class="detail_cont">
          <p class="detail_cont_item"><span class="detail_cont_name">申报人</span><span
              class="detail_cont_txt">{{detail.Contact}}</span></p>
          <p class="detail_cont_item"><span class="detail_cont_name">申报时间</span><span
              class="detail_cont_txt">{{detail.CreateTime | formatTime}}</span></p>
          <p class="detail_cont_item"><span class="detail_cont_name">修理人员</span><span
              class="detail_cont_txt">{{detail.Maintainer}}</span></p>
          <p class="detail_cont_item"><span class="detail_cont_name">维修状态</span><span
              :class="detail.State == 1 ? 'fail' : detail.State == 2 ? 'warn' : detail.State == 3 ? 'sucess' :'' "
              class="detail_cont_txt">{{detail.State | formatStatus}}</span></p>
          <p class="detail_cont_item"><span class="detail_cont_name">站点名称</span><span
              class="detail_cont_txt">{{detail.title}}</span></p>
        </div>
      </div>
      <div class="detail_center">
        <h3>故障描述：</h3>
        <p class="detail_des">{{detail.Detail}}</p>
      </div>
      <div class="detail_bottom">
        <h3>故障图片：</h3>
        <ul class="img_wrap">
          <li v-for="(item,index) in imgList" :key="index"><img @click="previewImg(index)" :src="item" alt="" ></li>
        </ul>
      </div>
      <ul class="bottom_circle">
        <li class="circle" v-for="(val,index) in circleList" :key="index"></li>
      </ul>
    </div>
    <div class="detail_btn">
      <span class="btn" :class="(detail.State == 1 || detail.State == 2) ? '' : 'act'"
        @click="handleSolove">{{(detail.State == 1 || detail.State == 2 ) ? '确认解决' : detail.State == 3 ? '已解决':''}}</span>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
        detail: {},
        imgList: [],
        circleList: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
      };
    },
    methods: {
      getStationList() {
        this.$http
          .get(
            '/v1/partners/managerpartner?access_token=' + this.access_token, {
              type: 2
            },
            this.baseUrl
          )
          .then(data => {
            if (data.error) {
              if (data.error.code == 401) {
                // token失效
              } else {
                this.$vux.toast.show({
                  type: 'warn',
                  text: data.error.message
                });
              }
            } else {
              // 请求成功
              this.stationList = data;
              this.getFaultDetail();
            }
          });
      },
      getFaultDetail() {
        this.$http
          .get(
            '/v2/apply/faultdetail?access_token=' + this.access_token, {
              ID: this.ID
            },
            this.baseUrl
          )
          .then(data => {
            if (data.error) {
              if (data.error.code == 401) {
                // token失效
              } else {
                this.$vux.toast.show({
                  type: 'warn',
                  text: data.error.message
                });
              }
            } else {
              // 请求成功
              this.detail = data;
              let flag = this.stationList.find((val, i) => {
                return this.detail.PartnerID == val.ID;
              });
              if (flag) {
                this.detail.title = flag.Title;
              }
              if (data.ImageFile && data.ImageFile.length > 0) {
                this.imgList = data.ImageFile.split(',');
              }
            }
          });
      },
      getWechatParams() {
        this.$http
          .get(
            '/v1/wechat/signpackage?access_token=' + this.access_token, {
              type: 'partner',
              url: location.href.split('#')[0]
            },
            this.baseUrl
          )
          .then(data => {
            let dataTemp = data;
            wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: dataTemp.appId, // 必填，公众号的唯一标识
              timestamp: dataTemp.timestamp, // 必填，生成签名的时间戳
              nonceStr: dataTemp.nonceStr, // 必填，生成签名的随机串
              signature: dataTemp.signature, // 必填，签名
              jsApiList: ['previewImage'] // 必填，需要使用的JS接口列表
            });
          });
      },
      previewImg(index) {
        wx.previewImage({
          current: this.imgList[index], // 当前显示图片的http链接
          urls: this.imgList // 需要预览的图片http链接列表
        });
      },
      handleSolove() {
        let _this = this
        this.$vux.confirm.show({
          content: '确认已解决？',
          onCancel() {},
          onConfirm() {
            if (_this.detail.State == 1 || _this.detail.State == 2) {
              _this.$http
                .post(
                  '/v2/apply/solvefault?access_token=' + _this.access_token, {
                    ID: _this.ID,
                    state: 3
                  },
                  _this.baseUrl
                )
                .then(data => {
                  if (data.error) {
                    if (data.error.code == 401) {
                      // token失效
                    } else {
                      _this.$vux.toast.show({
                        type: 'warn',
                        text: data.error.message
                      });
                    }
                  } else {
                    // 请求成功
                    _this.getStationList();
                  }
                });
            }
          }
        });
      }
    },
    filters: {
      formatStatus: val => {
        return val == 1 ? '未处理' : val == 2 ? '处理中' : val == 3 ? '已解决' : '';
      },
      formatTime: val => {
        if (val) {
          return (
            val.split(' ')[0] +
            ' ' +
            val
            .split(' ')[1]
            .split(':')
            .splice(0, 2)
            .join(':')
          );
        }
      }
    },
    computed: {
      access_token() {
        return this.$store.state.token.access_token || localStorage.getItem('access_token');
      },
      ID() {
        return this.$route.query.id;
      }
    },
    mounted() {
      this.getWechatParams()
      this.getStationList();
    }
  };

</script>

<style lang="scss" scoped>
  @import "../../styles/variable.scss";

  .main {
    padding-bottom: Px(100);
  }

  .declare_detail_wrap {
    position: relative;
    background-color: #fff;
    margin: Px(20) Px(32) 0 Px(32);
    padding: 0 Px(20);

    .detail_top {
      .detail_title {
        border-bottom: 1px dashed #999;
        @include Height(Px(112));

        img {
          width: Px(63);
          height: Px(63);
          margin-right: Px(21);
          vertical-align: middle;
        }

        span {
          font-size: Px(32);
          color: #333333;
        }
      }

      .detail_cont {
        padding: Px(37) 0;
        border-bottom: 1px dashed #999;

        .detail_cont_item {
          font-size: Px(28);
          @include Height(Px(48));
          display: flex;

          .detail_cont_name {
            flex: 1;
            color: #999;
          }

          .detail_cont_txt {
            color: #333;
            // text-align: right;
            // flex: 1;
            // justify-content: right;
            // align-items: right;
          }

          .success {
            color: #008000;
          }

          .warn {
            color: #ffd700;
          }

          .fail {
            color: #ff0000;
          }
        }
      }
    }

    .detail_center {
      padding: Px(26) 0;
      border-bottom: 1px dashed #999;

      h3 {
        font-size: Px(32);
        @include Height(Px(44));
        color: #333;
        font-weight: normal;
      }

      .detail_des {
        margin-top: Px(20);
        font-size: Px(28);
        line-height: Px(44);
        color: #999;
      }
    }

    .detail_bottom {
      padding: Px(24) 0;

      h3 {
        font-size: Px(32);
        @include Height(Px(44));
        color: #333;
        font-weight: normal;
      }

      ul {
        display: flex;
        justify-content: space-between;
        margin: Px(23) 0 Px(80) 0;

        li {
          // flex: 1;
          list-style: none;
          padding: 0;
          width: Px(202);
          height: Px(206);

          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    .bottom_circle {
      position: absolute;
      bottom: Px(-20);
      right: 0;
      padding: 0 Px(5);
      box-sizing: border-box;
      width: 100%;
      height: Px(40);
      display: flex;
      justify-content: space-around;

      .circle {
        width: Px(40);
        height: Px(40);
        border-radius: 50%;
        background-color: #efeff4;
      }
    }
  }

  .detail_btn {
    text-align: center;
    margin-top: Px(60);

    .btn {
      display: inline-block;
      width: Px(646);
      @include Height(Px(88));
      background-color: #10aeff;
      color: #fff;
      border-radius: Px(44);
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      /*去除点击高亮的颜色*/
      -webkit-tap-highlight-color: transparent;

      &.act {
        background-color: #bfbfbf;
      }
    }
  }

</style>
