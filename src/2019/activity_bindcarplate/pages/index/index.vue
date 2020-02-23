<template>
  <div class="container" v-show="showpage">
    <!-- <div class="banner">
      <div class="ban-txt">我的车牌</div>
      <div class="ban-delete" v-if="showDelete" @click="clickDelCarNum">删除</div>
    </div> -->
    <div class="top-wrap">
      <div class="num-wrap" v-show="canSet">
        <div :class="['num',secIndex == indexnum ? 'actitem':'']" v-for="(item,indexnum) in carNum" :key="indexnum"
          @click="secPosInput(indexnum)">{{item}}</div>
      </div>
      <div class="num-wrap" v-show="!canSet">
        <div :class="['num',secIndex == indexnum ? 'actitem':'']" v-for="(item,indexnum) in carNum" :key="indexnum">
          {{item}}</div>
      </div>
      <div class="photo-wrap">
        <div class="uploadbtn" @click="toSecPho(0)" v-show="picList.length == 0">
          <img class="upload-ico" src="./images/add.png" alt="">
          <div class="upload-txt">上传行车证正面</div>
        </div>
        <div class="photo-con" v-show="picList.length != 0">
          <img class="pho" @click="toSecPho(0)" :src="picList[0]" alt="">
          <div class="close-wrap" @click.prevent="delPic(0)">
            <img src="./images/close.png" alt="">
          </div>
        </div>
        <div class="uploadbtn" @click="toSecPho(1)" v-show="picBackList.length == 0">
          <img class="upload-ico" src="./images/add.png" alt="">
          <div class="upload-txt">上传行车证背面</div>
        </div>
        <div class="photo-con" v-show="picBackList.length != 0">
          <img class="pho" @click="toSecPho(1)" :src="picBackList[0]" alt="">
          <div class="close-wrap" @click.prevent="delPic(1)">
            <img src="./images/close.png" alt="">
          </div>
        </div>
      </div>
      <div :class="['confirmbtn',isCanConfirm ? 'actbtn':'']" @click="doConfirm">{{doConfirmTxt}}</div>
    </div>
    <!-- <div class="keyboard" v-show="showKeyboard">
      <header class="pkey-header2">
        <label class="pkey-okbtn" @click="complete">完成</label>
      </header>
      <section class="pkey-keyscontain">
        <ul>
          <li v-show="txtboardshow">
            <div class="li-wrap" v-for="(item,index) in cartxt" :key="index">
              <div v-if="index==(cartxt.length-1)" @click="changeKey">ABC</div>
              <label v-for="(items,indexi) in item" :key="indexi" @click="txtclick(items,indexi)">{{items}}</label>
              <div v-if="index==(cartxt.length-1)" @click="deleteCon">
                <img class="delico" src="./images/del.png" />
              </div>
            </div>
          </li>
          <li v-show="numboardshow">
            <div :class="['li-wrap',index == 2 ? 'extra-padding':'']" v-for="(item,index) in numtxt" :key="index">
              <div v-if="index==(cartxt.length-1)" @click="changeKey">省份</div>
              <label v-for="(items,indexi) in item" :key="indexi" @click="numclick(items,indexi)">{{items}}</label>
              <div v-if="index==(cartxt.length-1)" @click="deleteCon">
                <img class="delico" src="./images/del.png" />
              </div>
            </div>
          </li>
        </ul>
      </section>
    </div> -->
    <pop v-show="popshow" :onebtn="popOnebtn" :rightTxt="rightbtntxt" @cancelBtn="popCancel" @confirmBtn="popConfirm">
      <div slot="poptit">
        <div class="pop-tit">
          <img v-if="atenIcoShow" class="aten" src="./images/atention.png" alt="">
          <div>{{poptit}}</div>
        </div>
      </div>
      <div slot="popcon">
        <div class="pop-con-txt">{{popcon1}}</div>
        <div class="pop-con-txt">{{popcon2}}</div>
      </div>
    </pop>
  </div>
</template>
<script>
  import axios from 'axios'
  import Qs from 'qs'
  import pop from '../../components/pop/index.vue'
  export default {
    data() {
      return {
        showpage: false,
        canSet: true, //是否让键盘弹起来
        popshow: false,
        popType: 0, // 1 表示删除 , 2 表示绑定失败验证身份
        poptit: '', // 弹窗标题
        popcon1: '',
        popcon2: '', // 弹窗内容
        rightbtntxt: '', // 弹窗右边按钮
        popOnebtn: false, // 弹窗btn数量 false 表示两个，true 1个
        showKeyboard: true, // 整个键盘的显示隐藏
        carNum: ['', '', '', '', '', '', ''], // 输入的结果数组
        bindcarStr: '', // 原来的 绑定的车牌号
        secIndex: 0, // 选择输入的位置下标
        cartxt: [
          ['京', '津', '渝', '沪', '冀', '晋', '辽', '吉', '黑', '苏'],
          ['浙', '皖', '闽', '赣', '鲁', '豫', '鄂', '湘', '粤', '琼'],
          ['川', '贵', '云', '陕', '甘', '青', '蒙', '桂', '宁', '新'],
          ['藏', '使', '领', '警', '学', '港', '澳']
        ],
        numtxt: [
          ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
          ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
          ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
          ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
        ],
        txtboardshow: true, // 文字键盘
        numboardshow: false, // 数字字母键盘
        carStr: '', // 最终车牌号
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
        showIdentity: false, // 显示上传
        showDelete: false, // 显示删除按钮
        doConfirmTxt: '确认',
        confirmType: 0, // 确认按钮类型： 0 确认绑定或者确认修改， 1 ，去修改车牌， 2 提交审核
        atenIcoShow: false,
        picList: [], // 图片
        picBackList: [], // 图片背面
        // serverId1: '',
        // serverId2:'',
        serverIdList: [], // 上传的图片 [0]是正面，[1]是反面
        isClickSub: false // 防止多次点击提交
      }
    },
    components: {
      pop
    },
    computed: {
      // 确定按钮能否点击
      isCanConfirm() {
        // 如果carNum有空的就不能点
        let iscanclick = this.carNum.find((item) => {
          return item == ''
        })
        if (iscanclick == undefined) { // 全都不是空（填满了）
          if (this.confirmType == 1) { // 修改的时候 如果和原来一样（没有做修改）也不能点
            let carStr = ''
            this.carNum.forEach((item, index) => {
              carStr = carStr + item
            })
            if (this.bindcarStr == carStr) { // 没做修改时 不能点
              return false
            } else {
              return true
            }
          } else if (this.confirmType == 2) { // 提交审核时 图片路径不能为空
            if (this.picList.length == 0 || this.picBackList.length == 0) {
              return false
            } else {
              return true
            }
          } else {
            return true
          }
        } else { // 没填满
          return false
        }
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
      fromType() {
        return this.$route.query.from || 'oil'
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
      // 获取微信签名参数
      getWechatParams() {
        // console.log(location.href)
        this.$http.get('/v1/wechat/signpackage?access_token=' + this.access_token, {
          type: 'oil',
          url: location.href
        }, this.baseUrl).then(data => {
          let dataTemp = data;
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: dataTemp.appId, // 必填，公众号的唯一标识
            timestamp: dataTemp.timestamp, // 必填，生成签名的时间戳
            nonceStr: dataTemp.nonceStr, // 必填，生成签名的随机串
            signature: dataTemp.signature, // 必填，签名
            jsApiList: ['chooseImage', 'uploadImage'] // 必填，需要使用的JS接口列表
          });
        })
      },
      delPic(type) {
        if (type == 0) {
          this.picList = []
        } else {
          this.picBackList = []
        }
      },
      // 点击调用 相册选择图片
      toSecPho(type) {
        wx.ready(() => {
          wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
              let localIds = res.localIds
              if (type == 0) {
                this.picList = localIds
              } else {
                this.picBackList = localIds
              }
            }
          })
        })
      },
      uploadPic(localIds) {
        if (localIds.length == 0) {
          this.submitPic()
          return false
        }
        wx.uploadImage({
          localId: localIds[0], //需要上传的图片的本地ID,由chooseImage接口获得
          isShowProgressTips: 1, //默认为1，显示进度提示
          success: (res) => {
            this.serverIdList.push(res.serverId)
            localIds.splice(0, 1)
            this.uploadPic(localIds)
          },
          fail: (res) => {
            this.isClickSub = false
          }
        })
      },
      // 提交审核接口
      submitPic() {
        console.log('this.serverIdList===', this.serverIdList)
        console.log(this.serverIdList[0], '==&&&&==', this.serverIdList[1])
        this.$http.post('/v1/members/uploaddrivinglicense?access_token=' + this.access_token, {
          licensePlateNumber: this.carStr,
          pic1: this.serverIdList[0],
          pic2: this.serverIdList[1]
        }, this.baseUrl).then(data => {
          console.log('subpic===', data)
          this.isClickSub = false // 还原可点
          if (data.error) {
            if (data.error.code != 401) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else {
            if (data.result == 1) {
              this.$vux.toast.show({
                type: 'success',
                text: '绑定成功'
              })
              // 提交成功
              this.getCarNumber()
            } else {
              this.$vux.toast.show({
                type: 'warn',
                text: data.msg
              })
            }
          }
        }).catch(err => {
          this.isClickSub = false
        })
      },
      // 弹窗取消
      popCancel() {
        this.popshow = false
        this.poptit = '' // 弹窗标题
        this.popcon1 = ''
        this.popcon2 = '' // 弹窗内容
        this.rightbtntxt = '' // 弹窗右边按钮
        this.popOnebtn = false
        this.popType = 0
        this.atenIcoShow = false
      },
      // 弹窗确定按钮
      popConfirm() {
        if (this.popType == 1) { // 删除弹窗
          this.delCarNumber()
        }
        this.popCancel()
      },
      // 确定按钮
      doConfirm() {
        if (!this.isCanConfirm) {
          return false
        }
        console.log(this.carNum)
        let carStr = ''
        this.carNum.forEach((item, index) => {
          carStr = carStr + item
        })
        this.carStr = carStr
        console.log(this.carStr)
        if (!(
            /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[警京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{0,1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}[A-Z0-9]{0,1}[A-Z0-9]{0,1}$/
            .test(this.carStr))) {
          // 车牌号格式不正确
          this.$vux.toast.show({
            type: 'warn',
            text: '车牌号格式不正确'
          })
          return false
        }
        // do submit this.carStr
        if (this.confirmType == 0 || this.confirmType == 1) {
          this.saveCarNumber()
        } else {
          // 提交审核
          if (this.isClickSub) {
            return false
          }
          this.isClickSub = true
          let templist = this.picList.concat(this.picBackList)
          this.uploadPic(templist)
          // this.submitPic()
        }

      },
      // 点击完成，关闭键盘
      complete() {
        this.showKeyboard = false
      },
      // 切换文字和字母
      changeKey() {
        this.txtboardshow = !this.txtboardshow
        this.numboardshow = !this.numboardshow
      },
      // 选择哪个div输入，显示键盘
      // 如果是第0个，显示文字键盘，
      // 如果不是第0个 就是显示ABC键盘
      secPosInput(index) {
        this.showKeyboard = true
        this.secIndex = index // 边框高亮，并且在此处开始输入
        if (index == 0) { // 显示文字键盘
          this.txtboardshow = true
          this.numboardshow = false
        } else { // 显示ABC键盘
          this.txtboardshow = false
          this.numboardshow = true
        }
      },
      // 点击数字输入内容到对应位置
      numclick(items, indexi) {
        // this.carNum[this.secIndex] = items // 不能直接赋值，要用set
        this.$set(this.carNum, this.secIndex, items)
        if (this.secIndex < 6) {
          this.secIndex++
          this.txtboardshow = false
          this.numboardshow = true
        }
      },
      // 点击文字输入
      txtclick(items, indexi) {
        this.$set(this.carNum, this.secIndex, items)
        if (this.secIndex < 6) { // 显示数字键盘
          this.secIndex++
          this.txtboardshow = false
          this.numboardshow = true
        }
      },
      // 回撤删除
      deleteCon() {
        this.$set(this.carNum, this.secIndex, '')
        if (this.secIndex > 0) { // 显示数字键盘
          this.secIndex--
          this.txtboardshow = false
          this.numboardshow = true
        } else { // 等于0时 显示文字键盘
          this.txtboardshow = true
          this.numboardshow = false
        }
      },
      getToken() {
        this.$http.post('/v1/authentication/grant', {
          client_id: 'wechat_mobile_app',
          client_secret: '26a8a646db0c94b41141ca563be87876',
          grant_type: 'client_credentials'
        }, this.baseUrl, false).then((data) => {
          console.log(data)
          if (data.error) {
            this.$vux.toast.show({
              type: 'warn',
              text: data.data.error.message
            })
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            this.$store.dispatch('setAccessToken', '')
            this.$store.dispatch('setRefreshToken', '')
            //  this.getToken()
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
        console.log('after:', this.access_token)
        let url = ''
        let timestamp = new Date().getTime()
        url = this.$isTest ?
          `https://test.m.cheyuu.com/html/bindcarplate/index.html#/?from=${this.fromType}&v=${timestamp}` :
          `https://m.cheyuu.com/html/bindcarplate/index.html#/?from=${this.fromType}&v=${timestamp}`
        this.$http.post('/v1/authentication/loginwechat?access_token=' + this.access_token, {
          wechatIdentity: this.fromType,
          redirectUrl: url
        }, this.baseUrl, false).then((data) => {
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
        }).then(({
          data
        }) => {
          if (Number(data.UID) > 0) {
            this.showpage = true
            localStorage['userinfo'] = JSON.stringify(data);
            this.$store.dispatch('setUserinfo', JSON.stringify(data))
            this.getCarNumber()
            this.getWechatParams()
          } else {
            this.getToken()
          }
        })
      },
      getCarNumber() {
        this.$http.get('/v1/members/licenseplate?access_token=' + this.access_token, {}, this.baseUrl).then((
          data) => {
          if (data.error) {
            if (data.error.code == 401) { // token失效

            } else {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else { // 请求成功
            this.carStr = data.LicensePlateNumber
            this.bindcarStr = data.LicensePlateNumber
            this.showIdentity = false
            if (this.carStr != '') {
              this.carNum = this.carStr.split('')
              this.showDelete = true
              this.doConfirmTxt = '修改车牌'
              this.confirmType = 1
              this.canSet = true
            } else {
              this.carNum = ['', '', '', '', '', '', '']
              this.doConfirmTxt = '确认'
              this.showDelete = false
              this.confirmType = 0
            }
            this.showKeyboard = true
            this.secIndex = 0
          }
        })
      },
      // 点击删除车牌的按钮
      clickDelCarNum() {
        this.popshow = true
        this.popType = 1
        this.poptit = '确定要删除车牌吗？'
      },
      // 删除车牌接口
      delCarNumber() {
        this.$http.post('/v1/members/dellicenseplatenumber?access_token=' + this.access_token, {}, this.baseUrl).then((
          data) => {
          if (data.error) {
            if (data.error.code == 401) { // token失效

            } else {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else { // 请求成功
            if (data.result == 1) {
              this.$vux.toast.show({
                type: 'warn',
                text: '删除成功'
              })
              this.getCarNumber()
            }
          }
        })
      },
      saveCarNumber() {
        this.$http.post('/v1/members/licenseplatenumber?access_token=' + this.access_token, {
          licensePlateNumber: this.carStr,
        }, this.baseUrl).then((data) => {
          console.log('updatelicenseplatenumber==', data)
          if (data.error) {
            if (data.error.code == 401) { // token失效

            } else {
              if (data.error.code != 0) {
                this.$vux.toast.show({
                  type: 'warn',
                  text: data.error.message
                })
              } else {
                this.canSet = false
                this.popOnebtn = true
                this.popcon1 = '请上传行车证验证身份'
                this.poptit = '车牌绑定失败'
                this.popType = 2
                this.atenIcoShow = true
                this.popshow = true
                // 上传身份信息 提交审核
                this.showKeyboard = false
                this.secIndex = -1
                this.showIdentity = true
                this.confirmType = 2
                this.doConfirmTxt = '修改车牌'
                this.showDelete = false
              }
            }
          } else { // 请求成功
            if (data.result == 1) {
              this.$vux.toast.show({
                type: 'success',
                text: '绑定成功'
              })
              this.getCarNumber()
              this.showKeyboard = true
              this.secIndex = 0
              this.showDelete = true
              this.doConfirmTxt = '修改车牌'
              this.confirmType = 1
              this.canSet = true
            } else {
              this.$vux.toast.show({
                type: 'warn',
                text: data.message
              })
            }
          }
        })
      }
    }
  }

</script>
<style lang="scss" scoped>
  @import '../../styles/variable.scss';

  .container {
    overflow: hidden;
    min-height: 100vh;
    background: #F6F6F6;
    position: relative;
  }

  .banner {
    box-sizing: border-box;
    padding-left: Px(20);
    padding-right: Px(20);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    height: Px(312);
    background-image: linear-gradient(-180deg, #F46B02 0%, #FA9F02 100%);

    .ban-txt {
      font-size: Px(32);
      color: #FFFFFF;
      line-height: Px(88);
      height: Px(88);

    }

    .ban-delete {
      @extend .ban-txt;
      padding-left: Px(20);
    }
  }

  .top-wrap {
    overflow: hidden;
    padding-top: Px(60);
    padding-bottom: Px(40);
    width: Px(710);
    margin: Px(-224) auto 0;
    background: #FFFFFF;
    border-radius: Px(6);
  }

  .num-wrap {
    width: 100%;
    box-sizing: border-box;
    padding-left: Px(32);
    padding-right: Px(32);
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .num {
      box-sizing: border-box;
      width: Px(70);
      height: Px(84);
      line-height: Px(84);
      text-align: center;
      background: #FFFFFF;
      border: 1px solid #E9E9E9;
      border-radius: Px(6);
    }

    .num:nth-of-type(3) {
      margin-left: Px(30);
    }
  }

  .photo-wrap {
    margin-top: Px(60);
    margin-left: Px(20);
    margin-right: Px(20);
    display: flex;
    justify-content: space-between;

    .uploadbtn {
      box-sizing: border-box;
      width: Px(324);
      height: Px(208);
      background: rgba(0, 0, 0, 0.02);
      border: 1px dashed rgba(0, 0, 0, 0.15);
      border-radius: Px(8);

      .upload-ico {
        display: block;
        width: Px(50);
        margin: Px(48) auto Px(28);
      }

      .upload-txt {
        font-size: Px(28);
        color: #888888;
        text-align: center;
      }
    }

    .photo-con {
      position: relative;
      box-sizing: border-box;
      width: Px(324);
      height: Px(208);
      background: rgba(0, 0, 0, 0.02);
      border: 1px solid rgba(0, 0, 0, 0.15);
      border-radius: Px(8);

      .pho {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: block;
        width: Px(292);
        height: Px(176);
      }

      .close-wrap {
        width: Px(40);
        position: absolute;
        right: Px(4);
        top: Px(4);

        img {
          display: block;
          width: 100%;
        }
      }
    }
  }

  .confirmbtn {
    margin-top: Px(120);
    margin-left: Px(20);
    margin-right: Px(20);
    height: Px(88);
    text-align: center;
    line-height: Px(88);
    border-radius: Px(10);
    background: #999999;
    color: #ffffff;
    font-size: Px(32);
  }

  .actbtn {
    background: #F88602;
  }

  .actitem {
    border-color: #F88602 !important;
  }

  .keyboard {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
  }

  .pkey-header2 {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    background: #F1EFED;

    .pkey-okbtn {
      height: Px(70);
      line-height: Px(70);
      color: #8BB0C5;
      padding: 0 Px(30);
    }
  }

  .pkey-keyscontain {
    box-sizing: border-box;
    padding: Px(10) Px(10) Px(20);
    background: #D3D3DD;

    ul {
      overflow: hidden;

      .li-wrap {
        box-sizing: border-box;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        margin-top: Px(14);

        label {
          display: inline-block;
          width: Px(60);
          height: Px(84);
          background: #FFFFFF;
          text-align: center;
          line-height: Px(84);
          border-radius: Px(6);
        }

        div {
          position: relative;
          display: inline-block;
          height: Px(84);
          width: Px(84);
          background: #ACB2C2;
          text-align: center;
          line-height: Px(84);
          border-radius: Px(6);

          .delico {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            display: block;
            width: Px(44);
          }
        }

        label:active {
          background: #eeeeee;
        }
      }
    }
  }

  .extra-padding {
    padding-left: 21px;
    padding-right: 21px;
  }

  .pop-con-txt {
    font-size: Px(28);
    color: #888888;
  }

  .pop-tit {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .aten {
    display: block;
    width: Px(50);
    margin-right: Px(10);
  }

</style>
