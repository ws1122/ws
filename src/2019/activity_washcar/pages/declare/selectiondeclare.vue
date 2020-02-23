<template>
  <div class="main">
    <div class="failue_top">
      <h3>站点名称</h3>
      <div class="ipt_wrap">
        <input class="failue_ipt" type="text" placeholder="请输入站点名称" v-model="locationName">
      </div>
      <!-- <img class="icon" src="../../assets/arrow_right.png" alt=""> -->
    </div>
    <div class="selection_center">
      <ul>
        <li>
          <span class="left">站点位置</span>
          <div class="right">
            <input class="locationIpt" type="text" placeholder="请输入站点位置" v-model="stationLoca">
            <img @click="getAddress" class="icon" src="../../assets/location.png" alt="">
          </div>
        </li>
        <li>
          <span class="left">站点空余供电负载大小</span>
          <div class="right">
            <input type="text" class="power_ipt" v-model="power" placeholder="请输入负载大小">
            <span class="unit">kw</span>
          </div>
        </li>
      </ul>
      <div class="devide_bolder"></div>
      <ul>
        <li @click="tabSwitch('hasTapWater')">
          <span class="left">是否有自来水</span>
          <div class="right icon_is" :class="hasTapWater ? 'act' : ''"></div>
        </li>
        <li @click="tabSwitch('hasDrainage')">
          <span class="left">是否有市政排水：</span>
          <span class="right icon_is" :class="hasDrainage ? 'act' : ''"></span>
        </li>
        <li @click="tabSwitch('hasReconstruction')">
          <span class="left">近期是否有站点改造项目：</span>
          <span class="right icon_is" :class="hasReconstruction ? 'act' : ''"></span>
        </li>
        <li @click="tabSwitch('hasInstallMachinery')">
          <div class="washmachine_loca">
            <span class="left">是否有洗车机安放位置：</span>
            <span class="right icon_is" :class="hasInstallMachinery ? 'act' : ''"></span>
          </div>
          <ul @click.stop="stopPop" class="washmachine_info" v-if="hasInstallMachinery">
            <li>
              <span class="left">洗车机安置位尺寸：</span>
              <div class="right">
                <input type="text" placeholder="请输入尺寸" v-model="washMachineArea">
                <span>mm²</span>
              </div>
            </li>
            <li>
              <span class="left">安置处到加油岛的距离：</span>
              <div class="right">
                <input type="text" placeholder="请输入距离" v-model="washMachineAdd">
                <span>m</span>
              </div>
            </li>
            <li>
              <span class="left">安置处到卸油口的距离：</span>
              <div class="right">
                <input type="text" placeholder="请输入距离" v-model="washMachineDec">
                <span>m</span>
              </div>
            </li>
          </ul>
        </li>
      </ul>
      <div class="devide_bolder"></div>
      <div class="img_wrap">
        <h3>项目位置照片：</h3>
        <span @click="chooseImg('locationImgList')" class="add_img" v-if="locationImgList.length == 0"><img
            src="../../assets/add_jia.png" alt=""></span>
        <ul v-if="locationImgList.length > 0">
          <li class="img_item" v-for="(val,index) in locationImgList" :key="index">
            <img @click="previewImg(index)" :src="val" alt="">
            <i @click="deleteImg(index)" class="delete_icon"></i>
          </li>
          <!-- <li class="img_item">
										<img src="../declaredetail/images/broken.png" alt="">
										<i @click="deleteImg(1)" class="delete_icon"></i>
								</li> -->
          <li @click="chooseImg('locationImgList')" class="add"
            v-if="locationImgList.length < 3 && locationImgList.length > 0">
            <img src="../../assets/add_jia.png" alt=""> <br>
            <span>{{locationImgList.length}}/3</span>
          </li>
          <li class="img_item" v-if="locationImgList.length == 1"></li>
        </ul>
      </div>
      <div class="devide_normal"></div>
      <div class="img_wrap" v-for="(item,index) in imgUploadList" :key="index">
        <h3>{{item.name}}</h3>
        <span @click="chooseImg(item.type)" v-if="item.val.length == 0" class="add_img"><img
            src="../../assets/add_jia.png" alt=""></span>
        <ul v-if="item.val.length > 0">
          <li class="img_item">
            <img @click="previewImg(item.type)" :src="item.val[0]" alt="">
            <i @click="deleteImg(item.type)" class="delete_icon"></i>
          </li>
        </ul>
      </div>
      <div class="devide_bolder"></div>
      <ul>
        <li>
          <span class="left">申报人姓名</span>
          <span class="right"><input class="declare_info_ipt" type="text" placeholder="请输入姓名"
              v-model="declareName"></span>
        </li>
        <li v-if="!hasPhoneNum">
          <span class="left">联系方式</span>
          <span class="right"><input class="declare_info_ipt" type="tel" placeholder="请输入联系方式" maxlength="11"
              v-model="phoneNum"></span>
        </li>
      </ul>
    </div>
    <div class="selection_bottom">
    </div>
    <mybutton @todo="submit" :hastotal="submitClick" :title="btnText"></mybutton>
  </div>
</template>

<script>
  import mybutton from "../componnents/button";
  const jsonp = require("jsonp");
  export default {
    data() {
      return {
        baseUrl: this.$isTest ? "https://test.api.cheyuu.com" : "https://api.cheyuu.com",
        locationName: '',
        hasTapWater: 0, //是否有自来水
        hasDrainage: 0, //是否有排水
        hasReconstruction: 0, //近期是否改造
        hasInstallMachinery: 0, //是否有洗车机
        declareName: "", //申报姓名
        phoneNum: "", //联系电话
        hasPhoneNum: false,
        washMachineArea: '', //洗车机安装面积
        washMachineAdd: '', //距离1
        washMachineDec: '', //距离2
        locationImgList: [], //项目位置照片，多张
        locationImgListID: [], //项目位置照片，多张
        entryImg: [], //进站口照片，单张
        entryImgID: [], //进站口照片，单张
        outImg: [], //出口照片，单张
        outImgID: [], //出口照片，单张
        zoomImg: [], //配电房照片，单张
        zoomImgID: [], //配电房照片，单张
        waterImg: [], //排水口照片，单张
        waterImgID: [], //排水口照片，单张
        location: {},
        stationLoca: "",
        power: "", //空余负载,
        submitClick: true,
        btnText: '确认申报',
        submitClickFlag: true
      };
    },
    components: {
      mybutton
    },
    methods: {
      tabSwitch(type) {
        this[type] == 0 ? (this[type] = 1) : (this[type] = 0);
      },
      getWechatParams() {
        this.$http
          .get(
            "/v1/wechat/signpackage?access_token=" + this.access_token, {
              type: "partner",
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
                  type: "warn",
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
                jsApiList: ["chooseImage", "previewImage", "uploadImage"] // 必填，需要使用的JS接口列表
              });
            }
          });
      },
      getApplicant() {
        this.$http.get("/v1/contacts/employeesinfo?access_token=" + this.access_token, {}, this.baseUrl).then(data => {
          if (data.error) {
            if (data.error.code == 401) {
              // token失效
            } else {
              this.$vux.toast.show({
                type: "warn",
                text: data.error.message
              });
            }
          } else {
            // 请求成功
            this.declareName = data.Contact
            this.phoneNum = data.PhoneNum
            if (!this.phoneNum) {
              this.hasPhoneNum = false
            } else {
              this.hasPhoneNum = true
            }
          }
        });
      },
      chooseImg(type) {
        let count = 0;
        if (type == "locationImgList") {
          count = 3 - this.locationImgList.length < 0 ? 0 : 3 - this.locationImgList.length;
        } else {
          count = this[type].length > 0 ? 0 : 1;
        }
        wx.chooseImage({
          count: count, // 默认9
          sizeType: ["original", "compressed"],
          sourceType: ["album", "camera"],
          success: res => {
            // let localIds = res.localIds;
            if (type == "locationImgList") {
              if (this.locationImgList.length < 3) {
                this.locationImgList = this.locationImgList.concat(res.localIds);
              }
            } else {
              this[type] = this[type].concat(res.localIds);
            }
          },
          fail: res => {
            this.$vux.toast.show({
              type: "warn",
              text: res.errMsg
            });
          }
        });
      },
      //上传到微信
      uploadImage(imgLocaIDList) {
        if (imgLocaIDList.length == 0) {
          return false;
        }
        this.btnText = '申报中...'
        wx.uploadImage({
          localId: imgLocaIDList[0].pic, // 需要上传的图片的本地ID，由chooseImage接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: res => {
            // var serverId = res.serverId; // 返回图片的服务器端ID
            if (imgLocaIDList[0].type == "locationImgList") {
              this.locationImgListID.push(res.serverId);
            } else {
              this[imgLocaIDList[0].type + "ID"].push(res.serverId);
            }
            imgLocaIDList.splice(0, 1);
            if (imgLocaIDList.length == 0) {
              this.sendPost();
            }
            this.uploadImage(imgLocaIDList);
          },
          fail: res => {
            this.$vux.toast.show({
              type: "warn",
              text: res.errMsg
            });
            this.submitClick = true
            this.btnText = '确认申报'
          }
        });
      },
      deleteImg(index) {
        if (typeof index == "number") {
          this.locationImgList.splice(index, 1);
        } else {
          this[index] = [];
        }
      },
      previewImg(index) {
        let _this = this;
        if (typeof index == "number") {
          wx.previewImage({
            current: _this.locationImgList[index], // 当前显示图片的http链接
            urls: _this.locationImgList // 需要预览的图片http链接列表
          });
        } else {
          wx.previewImage({
            current: _this[index][0], // 当前显示图片的http链接
            urls: _this[index] // 需要预览的图片http链接列表
          });
        }
      },
      analysisLocation() {
		let data = location.href.split('?')[1]
        if (data != undefined) {
          this.location = {
            latitude: this.getUrlParam(data, 'latng').split(',')[0],
            longitude: this.getUrlParam(data, 'latng').split(',')[1],
            addr: this.getUrlParam(data, 'addr')
          }
          this.stationLoca = this.location.addr
        }
        let businessData = JSON.parse(localStorage.getItem('businessData'))
        if (businessData) {
          this.locationName = businessData.title
          this.power = businessData.power
          this.hasTapWater = businessData.water
          this.hasDrainage = businessData.drainage
          this.hasReconstruction = businessData.reconstruction
          this.hasInstallMachinery = businessData.installMachinery
          this.hasInstallMachinery = businessData.locationInfo
          this.washMachineArea = businessData.washMachineArea
          this.washMachineAdd = businessData.washMachineAdd
          this.washMachineDec = businessData.washMachineDec
          this.locationImgList = businessData.locationImg
          this.entryImg = businessData.inImg
          this.outImg = businessData.outImg
          this.zoomImg = businessData.powerRoomImg
          this.waterImg = businessData.drainageImg
          this.declareName = businessData.applicant
          this.phoneNum = businessData.mobilePhone
          this.hasPhoneNum = businessData.hasPhoneNum
        }
        localStorage.removeItem('businessData')
      },
      getUrlParam(data, name) {
        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        let result = data.match(reg);
        return result ? decodeURIComponent(result[2]) : null;
      },
      getAddress() {

        let data = {
          title: this.locationName,
          power: this.power,
          water: this.hasTapWater,
          drainage: this.hasDrainage,
          reconstruction: this.hasReconstruction,
          installMachinery: this.hasInstallMachinery,
          locationInfo: this.hasInstallMachinery,
          washMachineArea: this.washMachineArea,
          washMachineAdd: this.washMachineAdd,
          washMachineDec: this.washMachineDec,
          locationImg: this.locationImgList,
          inImg: this.entryImg,
          outImg: this.outImg,
          powerRoomImg: this.zoomImg,
          drainageImg: this.waterImg,
          applicant: this.declareName,
          mobilePhone: this.phoneNum,
          hasPhoneNum: this.hasPhoneNum
        }
        localStorage.setItem('businessData', JSON.stringify(data))
        let url = location.href.replace(/#/g, '%23')
        location.href = 'http://apis.map.qq.com/tools/locpicker?search=1&type=0&backurl=' + url +
          '&key=R35BZ-TORRP-FMIDC-LZ7QK-D3ZYZ-AFFSN&referer=testapp'
      },
      stopPop() {},
      submit() {
        this.locationImgListID = [];
        this.entryImgID = [];
        this.outImgID = [];
        this.zoomImgID = [];
        this.waterImgID = [];
        let [...locationImgList] = this.locationImgList;
        let [...entryImg] = this.entryImg;
        let [...outImg] = this.outImg;
        let [...zoomImg] = this.zoomImg;
        let [...waterImg] = this.waterImg;
        let imgList = []
        if (!this.locationName) {
          this.$vux.toast.show({
            text: '请填写站点名称',
            type: 'warn'
          })
          return
        }
        if (!this.location.latitude || !this.location.longitude) {
          this.$vux.toast.show({
            text: '请点击定位图标获取位置信息',
            type: 'warn'
          })
          return
        }
        if (locationImgList.length > 0) {
          locationImgList.forEach((val, index) => {
            imgList.push({
              pic: val,
              type: 'locationImgList'
            })
          })
        }
        if (entryImg.length > 0) {
          imgList.push({
            pic: entryImg[0],
            type: 'entryImg'
          })
        }
        if (outImg.length > 0) {
          imgList.push({
            pic: outImg[0],
            type: 'outImg'
          })
        }
        if (zoomImg.length > 0) {
          imgList.push({
            pic: zoomImg[0],
            type: 'zoomImg'
          })
        }
        if (waterImg.length > 0) {
          imgList.push({
            pic: waterImg[0],
            type: 'waterImg'
          })
        }
        if (!this.declareName) {
          this.$vux.toast.show({
            text: '请填写申请人',
            type: 'warn'
          })
          return
        }
        if (!this.phoneNum && !this.hasPhoneNum) {
          this.$vux.toast.show({
            text: '请填写联系电话',
            type: 'warn'
          })
          return
        }
        if (this.submitClick) {
          if (imgList.length > 0) {
            this.submitClick = false
            this.uploadImage(imgList);
          } else {
            this.btnText = '申报中...'
            this.sendPost()
          }
        }
      },
      sendPost() {
        if (this.submitClickFlag) {
          this.submitClickFlag = false
          this.$http
            .post(
              '/v2/apply/addstationapply?access_token="' + this.access_token, {
                title: this.locationName,
                address: this.stationLoca,
                lat: this.location.latitude,
                lng: this.location.longitude,
                power: this.power,
                water: this.hasTapWater,
                drainage: this.hasDrainage,
                reconstruction: this.hasReconstruction,
                installMachinery: this.hasInstallMachinery,
                locationInfo: this.hasInstallMachinery == 0 ? '' : JSON.stringify({
                  washMachineArea: this.washMachineArea,
                  washMachineAdd: this.washMachineAdd,
                  washMachineDec: this.washMachineDec
                }),
                locationImg: this.locationImgListID.join(",") || "",
                inImg: this.entryImgID[0] || "",
                outImg: this.outImgID[0] || "",
                powerRoomImg: this.zoomImgID[0] || "",
                drainageImg: this.waterImgID[0] || "",
                applicant: this.declareName,
                mobilePhone: this.phoneNum
              },
              this.baseUrl
            )
            .then(data => {
              if (data.error) {
                if (data.error.code == 401) {
                  // token失效
                } else {
                  this.$vux.toast.show({
                    type: "warn",
                    text: data.error.message,
                    onHide: () => {
                      this.submitClick = true
                      this.submitClickFlag = true
                      this.btnText = '确认申报'
                    }
                  });
                }
              } else {
                // 请求成功
                this.$vux.toast.show({
                  text: "申报成功",
                  type: "success",
                  onHide: () => {
                    this.btnText = '确认申报'
                    this.$router.push("/");
                    this.submitClick = true
                    this.submitClickFlag = true
                  }
                });
              }
            });
        }
      }
    },
    mounted() {
      this.getWechatParams();
      if (!localStorage.getItem('businessData')) {
        this.getApplicant()
      }
      this.analysisLocation()
    },
    computed: {
      access_token() {
        return this.$store.state.token.access_token || localStorage.getItem("access_token");
      },
      imgUploadList() {
        return [{
            name: "加油站进口照片：",
            val: this.entryImg,
            type: "entryImg"
          },
          {
            name: "加油站出口照片：",
            val: this.outImg,
            type: "outImg"
          },
          {
            name: "配电房设备照片：",
            val: this.zoomImg,
            type: "zoomImg"
          },
          {
            name: "市政排水口照片：",
            val: this.waterImg,
            type: "waterImg"
          }
        ];
      }
    }
  };

</script>

<style lang="scss" scoped>
  @import "../../styles/variable.scss";

  @mixin border($height) {
    width: 100%;
    height: $height;
    background-color: #efeff4;
  }

  .main {
    height: 100%;
    // background-color: #fff;
    padding-bottom: Px(100);
  }

  .devide_bolder {
    @include border(Px(6));
  }

  .devide_normal {
    @include border(Px(2));
  }

  .failue_top {
    position: relative;
    height: Px(218);
    padding: Px(22) Px(32) 0;
    background: linear-gradient(87deg, #10aeff 0%, rgba(32, 179, 255, 0.66) 94%);

    h3 {
      font-size: Px(40);
      line-height: Px(56);
      color: #fff;
    }

    .ipt_wrap {
      position: relative;
      margin-top: Px(23);

      input {
        width: Px(686);
        padding: Px(17) Px(20);
        color: #fff;
        font-size: Px(24);
        // @include Height(Px(66));
        outline: none;
        border: 1px solid #fff;
        border-radius: Px(33);
        box-sizing: border-box;
        background-color: transparent;
        -webkit-appearance: none;

        &::-webkit-input-placeholder {
          color: #fff;
        }

        &::-moz-input-placeholder {
          color: #fff;
        }

        &::-ms-input-placeholder {
          color: #fff;
        }
      }
    }
  }

  .selection_center {
    background-color: #fff;

    .left {
      float: left;
      font-size: Px(32);
      color: #666;
    }

    .icon_is {
      width: Px(110);
      height: Px(60);
      margin-top: Px(24);
      background: transparent url("../../assets/switch_off.png") no-repeat center center;
      background-size: 100% 100%;

      &.act {
        width: Px(110);
        height: Px(60);
        background: transparent url("../../assets/switch_on.png") no-repeat center center;
        background-size: 100% 100%;
      }
    }

    .right {
      float: right;
      font-size: Px(28);
      color: #bfbfbf;

      input {
        width: Px(100);
        color: #bfbfbf;
        border: 0;
        outline: none;
        text-align: right;
        font-size: Px(28);

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

      .power_ipt {
        width: Px(200);
      }

      .locationIpt {
        width: Px(300);
      }

      .declare_info_ipt {
        width: Px(300);
      }

      .icon {
        width: Px(46);
        height: Px(100);
        padding: Px(35) Px(10);
        box-sizing: border-box;
        margin: 0;
      }
    }

    ul {
      li {
        padding: 0 Px(32);
        border-bottom: Px(1) solid #f4f4f4;
        line-height: Px(100);
        min-height: Px(100);

        img {
          width: Px(26);
          height: Px(30);
          vertical-align: middle;
          margin-left: Px(10);
        }

        .washmachine_loca {
          overflow: hidden;
        }

        .washmachine_info {
          margin-top: Px(10);

          li {
            padding: 0;
            border: 0;
            height: Px(70);
            line-height: Px(70);

            input {
              width: Px(200);
            }
          }
        }
      }
    }

    .img_wrap {
      // height: Px(346);
      padding: Px(20) Px(32);
      box-sizing: border-box;

      h3 {
        font-size: Px(32);
        color: #666;
        font-weight: normal;
      }

      ul {
        border: Px(1) solid #f4f4f4;
        padding: Px(20);
        margin-top: Px(20);
        display: flex;
        justify-content: space-between;

        li {
          // float: left;
          // margin-right: Px(4);
          padding: 0;
          width: Px(202);
          height: Px(202);
          text-align: center;
          position: relative;

          &:last-child {
            margin-right: 0;
          }

          img {
            width: Px(202);
            height: Px(202);
            margin: 0;
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

      .add_img {
        display: inline-block;
        width: 100%;
        height: Px(60);
        border: Px(2) solid #d8d8d8;
        border-radius: 3px;
        margin-top: Px(20);
        text-align: center;

        img {
          width: Px(26);
          height: Px(26);
          margin-top: Px(17);
        }
      }
    }
  }

  .selection_bottom {
    margin: Px(80) 0 Px(74) 0;
    padding: 0 Px(52);
  }

</style>
