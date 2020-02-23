<template>
  <div class="main">
    <div class="bgs">
      <myheader @todo="chooseLocation" :height="3" :PID="PID" :urlType="2"></myheader>
      <myheader @todo="choosebrand" :height="3" :PID="PID" :urlType="3"></myheader>
      <myheader @todo="choosetype" :height="3" :PID="PID" :urlType="4"></myheader>
    </div>
    <div class="failue_center">
      <div class="failue_cont_top">
        <h3>故障描述</h3>
        <textarea name="" id="" cols="30" rows="10" placeholder="请输入文字说明" v-model="falutDetail"></textarea>
      </div>
      <div class="failue_img">
        <h3>上传故障图片</h3>
        <span @click="chooseImg" class="add_img" v-if="faultImgList == 0"><img src="../../assets/add_jia.png"
            alt=""></span>
        <ul v-if="faultImgList.length > 0">
          <li v-for="(item,index) in faultImgList" :key="index">
            <img @click="previewImg(index)" :src="item" alt="">
            <i @click="deleteImg(index)" class="delete_icon"></i>
          </li>
          <li @click="chooseImg" class="add" v-if="faultImgList.length < 9">
            <img src="../../assets/add_jia.png" alt=""> <br>
            <span>{{faultImgList.length}}/(最多9张)</span>
          </li>
          <li v-if="faultImgList.length == 1 || faultImgList.length == 4 || faultImgList.length == 7"></li>
        </ul>
      </div>
    </div>
    <mybutton @todo="submit" :title="btnText"></mybutton>
  </div>
</template>

<script>
  import mybutton from '../componnents/button';
  import myheader from '../componnents/header';
  export default {
    data() {
      return {
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
        locationName: '',
        locationID: '',
        brandName: '',
        detail: '', // 故障描述详情
        faultImgList: [], // 故障图片
        faultImgListID: [], // 上传后图片地址
        falutDetail: '',
        submitClick: true,
        PID: '',
        btnText: '确认申报',
        submitBtnClick: true,
        machineTypes: '' // 机型
      };
    },
    components: {
      mybutton,
      myheader
    },
    methods: {
      chooseLocation(params) {
        this.locationName = params.name;
        this.locationID = params.id;
      },
      choosebrand(params) {
        this.brandName = params.id
      },
      choosetype(params) {
        this.machineTypes = params.id

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
              let dataTemp = data;
              wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: dataTemp.appId, // 必填，公众号的唯一标识
                timestamp: dataTemp.timestamp, // 必填，生成签名的时间戳
                nonceStr: dataTemp.nonceStr, // 必填，生成签名的随机串
                signature: dataTemp.signature, // 必填，签名
                jsApiList: ['chooseImage', 'previewImage', 'uploadImage'] // 必填，需要使用的JS接口列表
              });
            }
          });
      },
      chooseImg() {
        let count = 9 - this.faultImgList.length < 0 ? 0 : 9 - this.faultImgList.length;
        wx.chooseImage({
          count: count, // 默认9
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success: res => {
            // let localIds = res.localIds;
            if (this.faultImgList.length < 9) {
              this.faultImgList = this.faultImgList.concat(res.localIds);
            }
          },
          fail: res => {
            this.$vux.toast.show({
              type: 'warn',
              text: res.errMsg
            });
          }
        });
      },
      // 上传到微信
      uploadImage(imgLocaID) {
        if (imgLocaID.length == 0) {
          this.sendPost()
          this.btnText = '申报中...'
          return false;
        }
        this.btnText = '申报中...'
        wx.uploadImage({
          localId: imgLocaID[0], // 需要上传的图片的本地ID，由chooseImage接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: res => {
            // var serverId = res.serverId; // 返回图片的服务器端ID
            this.faultImgListID.push(res.serverId);
            imgLocaID.splice(0, 1);
            this.uploadImage(imgLocaID);
            if (this.faultImgListID.length == this.faultImgList.length) {
              this.sendPost();
            }
          },
          fail: res => {
            this.$vux.toast.show({
              type: 'warn',
              text: res.errMsg
            });
            this.submitClick = true
            this.btnText = '确认申报'
          }
        });
      },
      deleteImg(index) {
        this.faultImgList.splice(index, 1);
      },
      previewImg(index) {
        wx.previewImage({
          current: this.faultImgList[index], // 当前显示图片的http链接
          urls: this.faultImgList // 需要预览的图片http链接列表
        });
      },
      submit() {
        console.log(1888, this.brandName, this.machineTypes)
        if (!this.locationID) {
          this.$vux.toast.show({
            type: 'warn',
            text: '请选择申报站点'
          });
        } else if (this.brandName == "") {
          this.$vux.toast.show({
            type: 'warn',
            text: '请选择品牌'
          });
        } else if (this.machineTypes == '') {
          this.$vux.toast.show({
            type: 'warn',
            text: '请选择机型'
          });
        } else if (!this.falutDetail) {
          this.$vux.toast.show({
            type: 'warn',
            text: '请填写故障描述'
          });
        } else {
          let [...imgList] = this.faultImgList;
          if (this.submitClick) {
            this.submitClick = false
            this.uploadImage(imgList)
          }
        }
      },
      sendPost() {
        if (this.submitBtnClick) {
          this.submitBtnClick = false
          this.$http
            .post(
              '/v2/apply/addfault?access_token=' + this.access_token, {
                partnerID: this.locationID,
                detail: this.falutDetail,
                machineBrand: this.brandName,
                machineTypes: this.machineTypes,
                faultImg: this.faultImgListID.join(',') || ''
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
                    text: data.error.message,
                    onHide: () => {
                      this.btnText = '确认申报'
                      this.submitBtnClick = true
                    }
                  });
                }
                this.submitClick = true
              } else {
                // 请求成功
                this.$vux.toast.show({
                  text: '申报成功',
                  type: 'success',
                  onHide: () => {
                    this.btnText = '确认申报'
                    this.$router.push('declarerecord?type=failure');
                    this.submitClick = true
                    this.submitBtnClick = true
                  }
                });
              }
            });
        }
      }
    },
    mounted() {
      this.getWechatParams();
    },
    computed: {
      access_token() {
        return this.$store.state.token.access_token || localStorage.getItem('access_token');
      }
    }
  };

</script>

<style lang="scss" scoped>
  @import "../../styles/variable.scss";

  .main {
    height: 100%;
    // background-color: #fff;
    padding-bottom: Px(100);
  }

  .failue_center {
    margin: 0 Px(32);
    background-color: #fff;
    position: relative;
    top: Px(-70);
    padding: Px(28) Px(20) 0;
    border-radius: Px(10);
    box-shadow: 0 2px 6px 2px rgba(0, 0, 0, 0.08);

    h3 {
      font-size: Px(32);
      line-height: Px(44);
      color: #333;
      font-weight: normal;
      padding-bottom: Px(28);
      border-bottom: 1px solid #f4f4f4;
    }

    .failue_cont_top {
      textarea {
        width: 100%;
        height: Px(300);
        padding: Px(20) 0;
        outline: none;
        border: 0;
        font-size: Px(28);
        line-height: Px(40);
        color: #666;
        resize: none;

        &::-webkit-input-placeholder {
          color: #bfbfbf;
        }

        &::-moz-input-placeholder {
          color: #bfbfbf;
        }

        &::-ms-input-placeholder {
          color: #bfbfbf;
        }
      }
    }

    .failue_img {
      .add_img {
        display: inline-block;
        width: 100%;
        height: Px(60);
        border: Px(2) solid #d8d8d8;
        border-radius: 3px;
        text-align: center;
        margin: Px(48) 0;

        img {
          width: Px(26);
          height: Px(26);
          margin-top: Px(17);
        }
      }

      ul {
        padding: Px(48) 0;
        display: flex;
        justify-content: space-between;
        flex-flow: row wrap;

        li {
          width: Px(202);
          height: Px(202);
          text-align: center;
          position: relative;
          margin-bottom: Px(10);

          img {
            width: Px(202);
            height: Px(202);
          }

          .delete_icon {
            position: absolute;
            width: Px(34);
            height: Px(34);
            top: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.6) url("../../assets/delete.png") no-repeat center center;
            background-size: 70% 70%;
            border-bottom-left-radius: Px(4);
          }
        }

        .add {
          border: 1px dashed #999;
          box-sizing: border-box;

          span {
            display: inline-block;
            color: #999;
            font-size: Px(24);
            line-height: Px(34);
            margin-top: Px(20);
          }

          img {
            width: Px(80);
            height: Px(80);
            margin-top: Px(36);
          }
        }
      }
    }
  }

  .bgs {
    background: linear-gradient(87deg, #10aeff 0%, rgba(32, 179, 255, 0.66) 94%);
    padding-bottom: Px(80);
  }

</style>
