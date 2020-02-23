<template>
  <div class="container" v-show="showpage">
    <img class="banner" src="../index/images/ban.png" alt="">
    <div class="info-wrap">
      <img class="avatar" :src="info && info.avatar" alt="">
      <div class="station">{{info && info.roleName}}</div>
      <div class="name">{{info && info.contact}}<span v-show="showState == 1"><strong></strong>待审核</span></div>
      <div class="btn blue" v-if="fromType != 'c'" @click="moveToGroup">移动至</div>
      <div class="btn yellow" v-show="showState == 2 && fromType != 'c'" @click="showPopTip">解绑</div>
      <div class="btn green" v-show="showState == 1 && fromType != 'c'" @click="showPopTip">审核通过</div>
      <div class="btn blue" v-show="info && info.provinceID == 23 && info.userType == 2" @click="showImg(1)">支付宝收银码</div>
      <div class="btn green" v-show="info && info.provinceID == 23 && info.userType == 2" @click="showImg(2)">微信收银码</div>
    </div>
    <div class="mask" v-show="popShow"></div>
    <div class="pop" v-show="popShow">
      <div class="pop-top">
        <div class="pop-topcon">
          {{popTip}}
          <div class="popbtn-wrap" v-show="showState == 1">
            <div :class="popbtnindex == 2 ? 'act':''" @click="secIdentity(2)">员工</div>
            <div :class="popbtnindex == 1 ? 'act':''" @click="secIdentity(1)">站长</div>
          </div>
        </div>
      </div>
      <div class="pop-bot">
        <div @click="cancel">取消</div>
        <div class="confirm" @click="confirm">确定</div>
      </div>
    </div>
    <div class="iosmask"></div>
    <!-- 区域经理样式 -->
    <div class="imgwrap addmask" id="newDb" v-if="fromType != 'c'">
      <div class="imgcon">
        <div class="tit-wrap" :style="{color:'#09A1E8'}">
          <div class="imgtit" :style="{fontSize: fonts}">{{info && info.title}}</div>
          <div class="imguser">收银员：{{info && info.contact}}</div>
        </div>
        <div class="qr-wrap" :style="{backgroundColor:'#09A1E8'}">
          <div class="qr-bord">
            <img class="bordbg" src="./images/qrbg.png" alt="">
            <div class="qr-area zfb">
              <qrcode :size="sizeZfbQr" :value="zfbQrvalue"></qrcode>
            </div>
          </div>
          <div class="imgtype">
            <div><img :style="{width:widthZfbIco}" :src="require('./images/ico-zfb.png')" alt=""></div>
            <div class="imgtxt">支付宝扫码</div>
          </div>
        </div>
      </div>
    </div>
    <div class="imgwrap imgwrap1 addmask" id="newDb1" v-if="fromType != 'c'">
      <div class="imgcon">
        <div class="tit-wrap" :style="{color:'#52C148'}">
          <div class="imgtit" :style="{fontSize: fonts}">{{info && info.title}}</div>
          <div class="imguser">收银员：{{info && info.contact}}</div>
        </div>
        <div class="qr-wrap" :style="{backgroundColor:'#52C148'}">
          <div class="qr-bord">
            <img class="bordbg" src="./images/qrbg.png" alt="">
            <div class="qr-area wx">
              <img :style="{display:'block',width: sizeWxQr + 'px'}" :src="wxQrvalue" alt="">
              <!-- <qrcode :size="sizeWxQr" :value="wxQrvalue"></qrcode> -->
            </div>
          </div>
          <div class="imgtype">
            <div><img :style="{width:widthWxIco}" :src="require('./images/ico-wx.png')" alt=""></div>
            <div class="imgtxt">微信扫码</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 收银员样式 -->
    <div class="imgwrap" id="newDb" v-if="fromType == 'c'">
      <div class="imgcon">
        <div class="tit-wrap" :style="{color:'#09A1E8'}">
          <div class="imgtit" :style="{fontSize: fonts}">{{info && info.title}}</div>
          <div class="imguser">收银员：{{info && info.contact}}</div>
        </div>
        <div class="qr-wrap" :style="{backgroundColor:'#09A1E8'}">
          <div class="qr-bord">
            <img class="bordbg" src="./images/qrbg.png" alt="">
            <div class="qr-area zfb">
              <qrcode :size="sizeZfbQr" :value="zfbQrvalue"></qrcode>
            </div>
          </div>
          <div class="imgtype">
            <div><img :style="{width:widthZfbIco}" :src="require('./images/ico-zfb.png')" alt=""></div>
            <div class="imgtxt">支付宝扫码</div>
          </div>
        </div>
      </div>
    </div>
    <div class="imgwrap imgwrap1" id="newDb1" v-if="fromType == 'c'">
      <div class="imgcon">
        <div class="tit-wrap" :style="{color:'#52C148'}">
          <div class="imgtit" :style="{fontSize: fonts}">{{info && info.title}}</div>
          <div class="imguser">收银员：{{info && info.contact}}</div>
        </div>
        <div class="qr-wrap" :style="{backgroundColor:'#52C148'}">
          <div class="qr-bord">
            <img class="bordbg" src="./images/qrbg.png" alt="">
            <div class="qr-area wx">
              <img ref="qrimg" :style="{display:'block',width: sizeWxQr + 'px'}" :src="wxQrvalue" alt="">
              <!-- <qrcode :size="sizeWxQr" :value="wxQrvalue"></qrcode> -->
            </div>
          </div>
          <div class="imgtype">
            <div><img :style="{width:widthWxIco}" :src="require('./images/ico-wx.png')" alt=""></div>
            <div class="imgtxt">微信扫码</div>
          </div>
        </div>
      </div>
    </div>
    <div class="imgpop" v-show="showCopyImg">
      <div class="copy" v-show="imgType == 1"></div>
      <div class="copy1" v-show="imgType == 2"></div>
      <div class="close-img" @click="closeCopy">
        <img src="./images/close.png" alt="">
      </div>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import Qs from 'qs'
  import { Qrcode } from 'vux'
  export default {
    data() {
      return {
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
        popShow: false,
        showState: 0,
        info: null,
        popbtnindex: 2,
        imgType: 0,
        showCopyImg: false,
        zfbQrvalue: '',
        wxQrvalue:'',
        showpage: false,
        hasCanvasDone: false
      }
    },
    components: {
      Qrcode
    },
    computed:{
      id(){
        return this.$route.query.id
      },
      fromType(){
        return this.$route.query.fromType || ''
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
      popTip(){
        if(this.showState == 2){
          return '确定要解绑加油员' + (this.info && this.info.contact) + '？'
        } else {
          return '确定审核通过？'
        }
      },
      widthWxIco(){
        if(this.fromType == 'c') {
          return (document.body.clientWidth / 750 * 60) + 'px'
        } else {
          return (document.body.clientWidth / 750 * 40) + 'px'
        }
      },
      widthZfbIco(){
        if(this.fromType == 'c') {
          return (document.body.clientWidth / 750 * 58) + 'px'
        } else {
          return (document.body.clientWidth / 750 * 38) + 'px'
        }
      },
      sizeWxQr(){
        if(this.fromType == 'c') {
          return (document.body.clientWidth / 750 * 431)
        } else {
          return (document.body.clientWidth / 750 * 330)
        }
      },
      sizeZfbQr(){
        if(this.fromType == 'c') {
          return (document.body.clientWidth / 750 * 406)
        } else {
          return (document.body.clientWidth / 750 * 306)
        }
      },
      fonts(){
        if(this.info && this.info.title) {
          if(this.info.title.length > 8) {
            if(this.fromType == 'c') {
              return (document.body.clientWidth / 750 * 60) + 'px'
            } else {
              return (document.body.clientWidth / 750 * 40) + 'px'
            }
          } else {
            if(this.fromType == 'c') {
              return (document.body.clientWidth / 750 * 80) + 'px'
            } else {
              return (document.body.clientWidth / 750 * 60) + 'px'
            }
          }
        } else {
          return '0px'
        }
        
      }
    },
    mounted(){
      if (!this.access_token) {
        this.getToken()
      } else {
        this.getuserinfo()
      }
    },
    methods: {
      closeCopy(){
        this.showCopyImg = false
      },
      /*需要了解html2canvas(百度了解) */
      showImg(type){
        this.imgType = type
        if(this.hasCanvasDone){ // 确保图片生成完 再出现弹窗
          this.showCopyImg = true
        }
          // if(type == 1){
          //   let imglist = document.querySelector('.copy').getElementsByTagName('img')
          //   if(imglist.length > 0){
          //     this.$nextTick(()=>{
          //       document.querySelector('.copy').innerHTML = ''
          //     })
          //   }
          //   this.$nextTick(()=>{
          //     this.canvas('#newDb', '.copy')
          //   })
          // } else {
          //   let imglist = document.querySelector('.copy1').getElementsByTagName('img')
          //   if(imglist.length > 0){
          //     this.$nextTick(()=>{
          //       document.querySelector('.copy1').innerHTML = ''
          //     })
          //   }
          //   this.$nextTick(()=>{
          //     this.canvas('#newDb1', '.copy1')
          //   })
          // }
      },
      convertCanvasToImage(iscanvas) {
        var self = this
        var image = new Image()
        image.crossOrigin = 'anonymous'
        image.src = iscanvas.toDataURL('image/png')
        return image
      },
      canvas(domid,imgwrap) {
        var self = this;
        var canvas2 = document.createElement('canvas')
        let _canvas = document.querySelector(domid)
        var w = document.body.clientWidth
        var h = 0
        if(this.fromType == 'c') {
          h = document.body.clientWidth * 1240/992
        }else {
          h = document.body.clientWidth * 1795/1250
        }
        canvas2.width = w * 2
        canvas2.height = h * 2
        canvas2.style.width = w + 'px'
        canvas2.style.height = h + 'px'
        var context = canvas2.getContext('2d')
        context.scale(2, 2)
        html2canvas(document.querySelector(domid), {
          canvas: canvas2
        }).then((canvas_v) => {
          document.querySelector(imgwrap).appendChild(self.convertCanvasToImage(canvas_v))
          document.querySelector(imgwrap + " img").style.width = document.body.clientWidth * 750 / 750 + 'px';
          if(this.fromType == 'c') {
            document.querySelector(imgwrap + " img").style.height = document.body.clientWidth * 1240/992 + 'px';
          } else {
            document.querySelector(imgwrap + " img").style.height = document.body.clientWidth * 1795/1205 + 'px';
          }
          this.hasCanvasDone = true
          // this.showCopyImg = true
        })
      },
      secIdentity(index){
        this.popbtnindex = index
      },
      showPopTip(){
        this.popShow = true
      },
      cancel() {
        this.popShow = false
      },
      confirm() {
        if(this.showState == 1) { // 审核确定
          this.checkOver()
        } else { // 解绑确定
          this.cancelBind()
        }
      },
      moveToGroup() {
        this.$router.push({
          name: 'group',
          query:{
            id: this.id,
            contactName: this.info && this.info.roleName,
            contact: this.info && this.info.contact
          }
        })
      },
      getWxQr(contactID){
        this.$http.get('/v1/contacts/contactqrcode?access_token=' + this.access_token,{
          contactID: contactID
        },this.baseUrl).then(data=>{
          if (data.error) {
            if (data.error.code != 401) {
                this.$vux.toast.show({
                  type: 'warn',
                  text: data.error.message
                })
            }
          } else {
            this.wxQrvalue = data.result || ''
            this.$nextTick(()=>{
              this.canvas('#newDb1', '.copy1')
            })
          }
        })
      },
      getDetail(){
        this.$http.get('/v1/contacts/managecontactinfo?access_token=' + this.access_token,{
          ID: this.id
        },this.baseUrl).then(data=>{
          if (data.error) {
            if (data.error.code != 401) {
                this.$vux.toast.show({
                  type: 'warn',
                  text: data.error.message
                })
            }
          } else {
            this.info = data
            let url = this.$isTest ? 'https://test.m.cheyuu.com':'https://m.cheyuu.com'
            this.zfbQrvalue = `${url}/html/sheep/index.html#/?contactID=${data.contactID}&partnerID=${data.partnerID}`
            if(data.provinceID == 23 && data.userType == 2){
              this.getWxQr(data.contactID)
            }
            if(data.userType == 0) { // 待审核
              this.showState = 1 // 显示审核按钮
            } else  {
              this.showState = 2
            }
            this.$nextTick(()=>{
              this.canvas('#newDb', '.copy')
            })
          }
        })
      },
      // 审核通过
      checkOver(){
        this.$http.post('/v1/contacts/bindingcontact?access_token=' + this.access_token,{
          contactID: this.id,
          status: this.popbtnindex
        },this.baseUrl).then(data=>{
          if (data.error) {
            if (data.error.code != 401) {
                this.$vux.toast.show({
                  type: 'warn',
                  text: data.error.message
                })
            }
          } else {
            console.log(data)
            if(data.result == 1){
              this.$vux.toast.show({
                type: 'success',
                text: '审核通过'
              })
              this.getDetail()
              this.popShow = false
            }
          }
        })
      },
      // 解除绑定
      cancelBind(){
        this.$http.post('/v1/contacts/contactdimission?access_token=' + this.access_token,{
          contactID: this.id
        },this.baseUrl).then(data=>{
          if (data.error) {
            if (data.error.code != 401) {
                this.$vux.toast.show({
                  type: 'warn',
                  text: data.error.message
                })
            }
          } else {
            console.log(data)
            if(data.result == 1){
              this.$vux.toast.show({
                type: 'success',
                text: '解绑成功'
              })
              // this.getDetail()
              this.popShow = false
              this.$router.back(-1)
            }
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
          redirectUrl: this.$isTest ? `https://test.p.cheyuu.com/html/manager/index.html#/operate?id=${this.id}&fromType=${this.fromType}&v=${v}` :
            `https://p.cheyuu.com/html/manager/index.html#/operate?id=${this.id}&fromType=${this.fromType}&v=${v}`
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
            this.getDetail()
          }
        })
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
    @include Masks();
  }

  .banner {
    display: block;
    width: 100%;
  }

  .info-wrap {
    padding-bottom: Px(48);
    position: relative;
    top: Px(-180);
    margin-left: Px(32);
    margin-right: Px(32);
    // height: Px(420);
    background: #fff;
    border-radius: Px(10);

    .avatar {
      position: absolute;
      display: block;
      top: Px(-80);
      left: 50%;
      transform: translateX(-50%);
      width: Px(160);
      height: Px(160);
      // background: pink;
      border-radius: 50%;
    }

    .station {
      padding-top: Px(120);
      text-align: center;
      font-size: Px(40);
      color: #333333;
    }

    .name {
      margin-top: Px(10);
      margin-bottom: Px(50);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: Px(32);
      color: #666666;

      span {
        margin-left: Px(40);
        font-size: Px(28);
        color: #999999;
      }

      span strong {
        position: relative;
        top: Px(-3);
        margin-right: Px(10);
        display: inline-block;
        width: Px(12);
        height: Px(12);
        background: #FF5656;
        border-radius: 50%;
      }
    }
  }

  .btn {
    margin: Px(20) auto 0;
    width: Px(480);
    height: Px(80);
    line-height: Px(80);
    color: #fff;
    text-align: center;
    font-size: Px(32);
    border-radius: Px(6);

    &.blue {
      background: #10AEFF;
    }

    &.yellow {
      background: #F9A73B;
    }

    &.green {
      background: #0CC477;
    }
  }
.popbtn-wrap {
  width: Px(300);
  margin-top: Px(30);
  display: flex;
  justify-content: space-between;
  div {
    box-sizing: border-box;
    width: Px(130);
    height: Px(60);
    line-height: Px(60);
    text-align: center;
    font-size: Px(28);
    color: #BCBCBC;
    border: 1px solid #BCBCBC;
    border-radius: Px(10);
    &.act {
      border: 1px solid #F9A73B;
      color: #FF2400;
    }
  }
}
.iosmask {
  z-index: -1;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
}
.imgwrap {
  overflow: hidden;
  z-index: -2;
  position: fixed;
  top: 0;
  left: 0;
  width: Px(750);
  height: Px(1240*750/992);
  &.imgwrap1 {
    z-index: -3;
  }
}
.tit-wrap {
  overflow: hidden;
  background: #fff;
  // height: Px(230);
  padding-top: Px(28);
  padding-bottom: Px(20);
  .imgtit {
    // margin-top: Px(28);
    text-align: center;
  }
  .imguser {
    margin-top: Px(20);
    font-size: Px(38);
    text-align: center;
  }
}
.qr-wrap {
  overflow: hidden;
  height: Px(1240*750/992 - 230);
  .qr-bord {
    position: relative;
    margin: Px(64) auto Px(60);
    width: Px(472);
    height: Px(478);
    .bordbg {
      position: absolute;
      display: block;
      width: Px(472);
    }
    .qr-area {
      &.zfb {
        position: absolute;
        left: Px(33);
        top: Px(37);
      }
      &.wx {
        position: absolute;
        left: Px(20);
        top: Px(24);
      }
    }
  }
  .imgtype {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: Px(54);
    color: #fff;
    .imgtxt {
      position: relative;
      top: Px(-8);
      margin-left: Px(22);
    }
  }
}
.addmask {
  background: rgba(0,0,0,.8);
  width: Px(750);
  height: Px(1795*750/1205);
  .imgcon {
    width: Px(750*992/1205);
    height: Px(1240*750/1205);
    margin: 0 auto;
    margin-top: Px(1795*750/1205/2 - 1240*750/1205/2);
    .tit-wrap {
      // height: Px(138);
      padding-top: Px(20);
      padding-bottom: Px(20);
      .imgtit {
        // margin-top: Px(20);
      }
      .imguser {
        margin-top: Px(10);
        font-size: Px(28);
      }
    }
    .qr-wrap {
      height: Px(1240*750/1205 - 138);
      .qr-bord {
        width: Px(370);
        height: Px(372);
        .bordbg {
          width: Px(370);
        }
      }
      .imgtype {
        font-size: Px(34);
        .imgtxt {
          position: relative;
          top: Px(-4);
          margin-left: Px(22);
        }
      }
    }
  }
}

.imgpop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,.5);
  .close-img {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: Px(40);
  }
  .close-img img{
    display: block;
    width: Px(80);
  }
}
.copy , .copy1{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
}
.copy>img, .copy1>img {
  display: block;
  width: 100%;
}
</style>
