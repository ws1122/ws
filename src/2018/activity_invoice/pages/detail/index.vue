<template>
  <div class="detail-container">
    <div class="info-item bordtop">
      <div class="info-tit"><span>*</span> 开票金额</div>
      <div class="info-desc">￥{{totalmoney}}</div>
    </div>
    <div class="info-item">
      <div class="info-tit"><span>*</span> 开票类型</div>
      <div class="info-desc">
        <div class="type" @click="changeType(0)"><span><em v-show="isSelf==0"></em></span><strong>个人</strong></div>
        <div class="type" @click="changeType(1)"><span><em v-show="isSelf==1"></em></span><strong>单位</strong></div>
      </div>
    </div>
    <div class="info-item" v-show="(type == 0) || (type==1&&isSelf==1)">
      <div class="info-tit"><span>*</span> 发票抬头</div>
      <div class="info-desc" v-show="isSelf==1">
        <input type="text" v-model="company" placeholder="填写您公司全称">
      </div>
      <div class="info-desc" v-show="isSelf==0">
        <input type="text" v-model="selfCompany" placeholder="填写发票抬头">
      </div>
    </div>
    <div class="info-item" v-show="isSelf==1">
      <div class="info-tit"><span>*</span> 税号</div>
      <div class="info-desc">
        <input type="text" v-model="ein" placeholder="联系您公司财务提供">
      </div>
    </div>
    <div class="info-item" v-show="isSelf==1">
      <div class="info-tit">地址、电话</div>
      <div class="info-desc">
        <input type="text" v-model="addressAndTel" placeholder="请输入您公司税务地址和电话">
      </div>
    </div>
    <div class="info-item" v-show="isSelf==1">
      <div class="info-tit">开户行及账号</div>
      <div class="info-desc">
        <input type="text" v-model="bankInfo" placeholder="请输入您公司开户行信息">
      </div>
    </div>
    <div class="info-item">
      <div class="info-tit"><span>*</span> 开票内容</div>
      <div class="info-desc">
        <select>
          <option value="1">*汽油*汽油</option>
        </select>
        <div class="sec-icon"></div>
      </div>
    </div>
    <div class="info-item" v-if="type==0">
      <div class="info-tit"><span>*</span> 电子邮件</div>
      <div class="info-desc">
        <input type="text" v-model="email" placeholder="填写您的电子邮件">
      </div>
    </div>
    <div class="info-item" v-if="type==1">
      <div class="info-tit"><span>*</span> 收件人信息</div>
      <div class="info-desc" @click="toAddress">
        <div class="address" v-if="receiveInfo != ''">{{receiveInfo}}</div>
        <div class="address" v-else>请选择</div>
        <div class="sec-icon"></div>
      </div>
    </div>
    <div class="info-item" v-if="type==1">
      <div class="info-tit bz">开票备注</div>
      <div class="info-desc">
        <textarea v-model="note" name="" id="" cols="30" rows="10"></textarea>
      </div>
    </div>
    <div class="info-item" v-if="type==1" @click="showSendpop">
      <div class="info-tit" style="width:100%;position:relative;">
        <div>发票领取方式：{{sendtype == -1 ? '请选择' : sendlist[sendtype].tit}}</div>
        <div class="sec-icon"></div>
      </div>
    </div>
    <div class="submit-btn" @click="showInfoPop">提交</div>
    <div class="bottom-tip">申领信息提交后不可更改，请仔细填写！<br />请仔细填写税号，税号错误讲不能开具发票！</div>
    <div class="fp-module">
      <img @click="showImagePreview" v-if="type==1" src="https://files.cheyuu.com/files/image/fapiao_t_p.jpg" alt="">
      <img @click="showImagePreview" v-if="type==0" src="https://files.cheyuu.com/files/image/fapiao_y.png" alt="">
      <p>发票模板</p>
    </div>
    <!-- 未选择提示 -->
    <pop @closeTank="closePopTip" v-show="secTipShow">
      <div slot='poptop'>
        <div class="slot-con">{{slotTips}}</div>
      </div>
      <div slot='popbtn'>确定</div>
    </pop>
    <!--确认信息-->
    <pop style="z-index:99" :hasConfirm="true" @closeTank="closeInfoPop" @onConfirm="cofirmSub" v-show="confirmInfoPop">
      <div class="poptops" slot='poptop'>
        <div class="slot-info-con">
          <span>发票抬头：</span>{{isSelf == 0 ? selfCompany : company }}
        </div>
        <div class="slot-info-con">
          <span>开票内容：</span>*汽油*汽油
        </div>
        <div class="slot-info-con" v-if="type==0">
          <span>电子邮件：</span>{{email == '' ? '未填写' : email}}
        </div>
        <div class="slot-info-con" v-show="isSelf==1">
          <span>税号：</span>{{ein == '' ? '未填写' : ein}}
        </div>
        <div class="slot-info-con" v-show="isSelf==1">
          <span>地址、电话：</span>{{addressAndTel == '' ? '未填写': addressAndTel}}
        </div>
        <div class="slot-info-con" v-show="isSelf==1">
          <span>开户行及账号：</span>{{bankInfo == '' ? '未填写': bankInfo}}
        </div>
        <div class="slot-info-con" v-if="type==1">
          <span>收件人信息：</span>{{receiveInfo + detailAddress}}
        </div>
        <div class="slot-info-con" v-if="type==1">
          <span>开票备注：</span>{{note == '' ? '未填写': note}}
        </div>
        <div class="slot-info-con" v-if="type==1">
          <span>领取方式：</span>{{sendtype == -1 ? '未选择' : sendlist[sendtype].tit}}
        </div>
        <div class="slot-extra">确认您已经查看过发票模板，我们将为您开具增值税{{type==0?'电子':'普通'}}发票</div>
      </div>
      <div slot='leftbtn'>确定提交</div>
      <div slot='popbtn'>返回修改</div>
    </pop>
    <pop style="z-index:99" :hasConfirm="true" @closeTank="sessTitBoxStatus = false" @onConfirm="toHistory" v-show="sessTitBoxStatus">
      <div class="sesscetxt" slot='poptop'>
        <p>已提交开票申请，电子发票将在7个工作日内发送致您的邮箱</p>
      </div>
      <div slot='leftbtn'>查看开票</div>
      <div slot='popbtn'>返回</div>
    </pop>
    <van-popup v-model="sendTypeShow" position="bottom">
      <div class="popup-wrap">
        <div class="title">选择发票领取方式</div>
        <div class="sendlist">
          <div class="sendlist-item" v-for="(item,index) in sendlist" :key="index">
            <div class="item-left">
              <div class="tit">{{item.tit}}</div>
              <div class="txt">{{item.txt}}</div>
            </div>
            <div class="check-type" @click="changeSendType(index)">
              <div :class="sendtype==index ? 'act':''"></div>
            </div>
          </div>
        </div>
        <div class="btn" @click="closeSendpop">关闭</div>
      </div>
    </van-popup>
  </div>
</template>
<script>
  import Vue from 'vue'
  import pop from '../../components/pop/index.vue'
  import {
    ImagePreview,
    Popup
  } from 'vant'
  Vue.use(Popup);
  const images = ['https://files.cheyuu.com/files/image/fapiao_y.png'] // 普通
  const images1 = ['https://files.cheyuu.com/files/image/fapiao_y.png'] // 电子
  export default {
    data() {
      return {
        confirmInfoPop: false, // 最后确认的弹窗
        sendlist: [{
            tit: '付费邮寄(EMS快递)',
            txt: '[您需要支付8元邮费]'
          },
          {
            tit: '到付邮寄',
            txt: '[目前仅支持顺丰快递，具体价格请咨询顺丰快递95338]'
          },
          {
            tit: '上门自取',
            txt: '[请于武汉市江汉区世贸写字楼2205自取]'
          }
        ],
        sendTypeShow: false, // 邮寄方式弹出
        sendtype: 0,
        sendtypeTxt: '',
        isSelf: 0, // 个人还是 单位
        slotTips: '', // 弹窗提示内容
        secTipShow: false, // 未选择提示弹窗
        company: '', // 公司名称发票抬头
        selfCompany: '个人',
        ein: '', // 税号
        sessTitBoxStatus: false, // 等待开票提示框开关状态
        addressAndTel: '', // 地址电话
        bankInfo: '', // 开户行信息
        email: '', // 电子邮件
        note: '', // 开票备注
        receiveInfo: '', // 收件人信息
        contactName: '', // 联系人姓名.
        phoneNum: '', // 联系人电话.
        detailAddress: '', // 联系人地址.
        jumpout: false // 最后一个弹窗的确定按钮要跳转 true 表示最后一个提示框
      }
    },
    components: {
      pop
    },
    computed: {
      // 发票类型
      type() {
        return this.$route.query.type
      },
      totalmoney() {
        return this.$route.query.total
      },
      orderStr() {
        return this.$route.query.orderStr
      },
      access_token() {
        // return '87af08e08cb1bd8d4f9c9084219cddad6365bfc0'
        return this.$store.state.token.access_token || localStorage.getItem('access_token')
      }
    },
    methods: {
      closeInfoPop() {
        this.confirmInfoPop = false
        this.$store.dispatch('setMask', false)
      },
      toHistory() {
        this.sessTitBoxStatus = false;
        this.$store.dispatch('setMask', false)
        this.secTipShow = false
        this.$router.push({
          name: 'history'
        })
      },
      showInfoPop() {
        if (this.company == '' || this.selfCompany == '') {
          this.slotTips = '请输入发票抬头'
          this.$store.dispatch('setMask', true)
          this.secTipShow = true
          return false
        }
        if (this.isSelf == 1) { // 单位（个人的时候这个可以为空）
          if (this.ein == '') { // 税号正则匹配也判断
            this.slotTips = '请仔细确认税号'
            this.$store.dispatch('setMask', true)
            this.secTipShow = true
            return false
          }
        }
        if (this.type == 1) { // 纸质
          if (this.receiveInfo == '') {
            this.slotTips = '请选择收件人信息'
            this.$store.dispatch('setMask', true)
            this.secTipShow = true
            return false
          }
        } else { // 电子
          if (this.email == '' || new RegExp(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/).test(this.email) === false) {
            this.slotTips = '请输入正确的邮箱'
            this.$store.dispatch('setMask', true)
            this.secTipShow = true
            return false
          }
        }
        this.$store.dispatch('setMask', true)
        this.confirmInfoPop = true
      },
      cofirmSub() {
        // 下面提交数据给接口
        this.createInvoice()
      },
      changeSendType(index) {
        this.sendtype = index
      },
      showSendpop() {
        this.sendTypeShow = true
      },
      closeSendpop() {
        this.sendTypeShow = false
      },
      getAddressList() {
        this.$http.get('/v1/members/addresslist?access_token=' + this.access_token, {}).then(data => {
          if (data.error) {
            if (data.error.code != 401) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else {
            if (data.length > 0) {
              let defaultInfo = data.find((item, index) => {
                return item.IsDefault == 1
              })
              if (!defaultInfo) { // 没找到
                this.receiveInfo = ''
              } else {
                this.$store.dispatch('setContact', defaultInfo.Contact)
                this.$store.dispatch('setPhone', defaultInfo.PhoneNum)
                this.$store.dispatch('setAddress', defaultInfo.Address)
                this.contactName = defaultInfo.Contact
                this.phoneNum = defaultInfo.PhoneNum
                this.detailAddress = defaultInfo.Address
                this.receiveInfo = defaultInfo.Contact + '(' + defaultInfo.PhoneNum + ')'
              }
            } else {
              this.receiveInfo = ''
            }
          }
        })
      },
      // 图片预览
      showImagePreview() {
        ImagePreview({
          images: this.type == 0 ? images1 : images,
          startPosition: 0
        })
      },
      getContact() { // 获取税务信息（单位）
        this.$http.get('/v1/members/taxinfo?access_token=' + this.access_token, {
        }).then(data => {
          console.log(data)
          if (data.error) {
            if (data.error.code != 401) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else {
            this.company = data.TaxTitle // 公司名称发票抬头
            this.ein = data.TaxNumber // 税号
            this.addressAndTel = data.TaxAddress // 地址电话
            this.bankInfo = data.TaxAccount // 开户行信息
            this.email = data.Email // 开户行信息
          }
        })
      },
      createInvoice() {
        this.$http.post('/v1/invoice/create?access_token=' + this.access_token, {
          attach: this.orderStr, // 订单id的拼接
          taxPattern: Number(this.type) + 1, // 发票类型 1 电子 2 纸质
          titleType: (this.isSelf) + 1, //  1：个人 2：企业单位.
          title: this.isSelf == 0 ? this.selfCompany : this.company, //抬头
          total: this.totalmoney, // 金额
          taxNumber: this.ein, // 税号
          taxAccount: this.bankInfo, // 开户行账号
          taxAddress: this.addressAndTel, // 单位开票选项，地址、电话.
          payType: this.sendtype == 0 ? 1 : this.sendtype == 1 ? 4 : this.sendtype == 2 ? 3 : 1, //发票领取方式 默认 1：自付邮费 3：上门自取 4：到付.
          mail: this.email, // 邮箱地址.
          contactName: this.contactName, // 联系人姓名.
          phoneNum: this.phoneNum, // 联系人电话.
          address: this.detailAddress, // 联系人地址.
          remark: this.note //  备注信息.
        }).then(data => {
          if ('error' in data && data.error.code != 401) {
            this.$vux.toast.show({
              type: 'warn',
              text: data.error.message
            })
            return;
          }

          switch (data.status) {
            case 'free':
              // this.$store.dispatch('setMask', true)
              this.confirmInfoPop = false
              // this.slotTips = '已提交开票申请，5个工作日内处理'
              this.jumpout = true
              this.secTipShow = true
              this.toHistory();
              break;
            case 'waitpay':
              this.toPayOut(data.data.OrderCode)
              break;
            case 'wait':
              this.$store.dispatch('setMask', true)
              this.confirmInfoPop = false
              this.jumpout = true
              this.sessTitBoxStatus = true
              break;
            default:
              break;
          }

        })
      },
      // 关闭提示
      closePopTip() {
        this.$store.dispatch('setMask', false)
        this.secTipShow = false
        this.slotTips = ''
        if (this.jumpout) {
          this.$router.replace({
            name: 'history'
          })
          this.jumpout = false
        }
      },
      // 个人还是 单位
      changeType(isSelf) {
        this.isSelf = isSelf
      },
      // 去地址
      toAddress() {
        this.$router.push({
          name: 'address'
        })
      },
      // 支付接口 获取支付的 字段对象
      toPayOut(orderCode) {
        this.$http.post('/v2/pay/payout?access_token=' + this.access_token, {
          orderCode: orderCode,
          scene: 'FP',
          orderFrom: 9
        }, this.baseUrl).then(data => {
          if (data.error) {
            if (data.error.code != 401) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else {
            this.$store.dispatch('setMask', false)
            this.confirmInfoPop = false
            let PayType = data.PayType
            let jssdkParamsStr = data.SdkParams
            if (PayType == 'AliOffcially') {
              this.needCallAliPay(jssdkParamsStr.trade_no)
            } else {
              let jssdkParams = JSON.parse(jssdkParamsStr)
              if (this.$isTest) {
                this.paySuc(orderCode)
              } else {
                this.needCallPay2(jssdkParams)
              }
            }
          }
        })
      },
      // 支付宝支付
      needCallAliPay(outTradeNo) {
        if (window.AlipayJSBridge) {
          this.aliCallPay(outTradeNo);
        } else {
          // 如果没有注入则监听注入的事件
          document.addEventListener('AlipayJSBridgeReady', () => {
            this.aliCallPay(outTradeNo);
          }, false)
        }
      },
      // 支付宝支付
      aliCallPay(tradeNo) {
        AlipayJSBridge.call("tradePay", {
          tradeNO: tradeNo
        }, (res) => {
          //alert(JSON.stringify(res));
          if (res.resultCode == '9000') {
            // 支付成功回调
            this.$router.replace({
              name: 'history'
            })
          } else if (res.resultCode != '6001') {
            this.$vux.toast.show({
              type: 'warn',
              text: '支付失败'
            })
          }
        });
      },
      // 微信支付
      needCallPay2(jssdkParams) {
        if (typeof(WeixinJSBridge) == "undefined") {
          if (document.addEventListener) {
            document.addEventListener("WeixinJSBridgeReady", () => {
              this.wxCallPay2(jssdkParams);
            }, false);
          } else if (document.attachEvent) {
            document.attachEvent("WeixinJSBridgeReady", () => {
              this.wxCallPay2(jssdkParams);
            });
            document.attachEvent("onWeixinJSBridgeReady", () => {
              this.wxCallPay2(jssdkParams);
            });
          }
        } else {
          this.wxCallPay2(jssdkParams);
        }
      },
      wxCallPay2(jssdkParams) {
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest',
          jssdkParams,
          (res) => {
            if (res.err_msg != "get_brand_wcpay_request:ok") {
              WeixinJSBridge.invoke('closeWindow', {}, (e) => {});
            } else {
              // 支付成功回调
              this.$router.replace({
                name: 'history'
              })
            }
          }
        );
      },
      // 模拟支付成功
      paySuc(orderCode) {
        this.$http.post('/v2/pay/cibnotificationfake?access_token=' + this.access_token, {
          orderCode: orderCode
        }, this.baseUrl).then(data => {
          console.log(data)
          if (data.error) {
            if (data.error.code != 401) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else {
            if (data == "success") {
              // 跳到券列表

            }
          }
        })
      }
    },
    activated() {
      let contact = this.$store.state.token.contact
      let phone = this.$store.state.token.phone
      let address = this.$store.state.token.address
      this.contactName = contact
      this.phoneNum = phone
      this.detailAddress = address
      if (contact == '' || phone == '') {
        this.receiveInfo = ''
      } else {
        this.receiveInfo = contact + '(' + phone + ')'
      }
      this.$store.dispatch('setInvoiceHeader', true)
    },
    mounted() {
      this.getContact()
      this.getAddressList()
    }
  }
</script>
<style lang="scss" scoped>
  @import '../../styles/variable.scss';

  .detail-container {
    box-sizing: border-box;
    width: 100%;
    padding-top: Px(42);
    background: #fff;
    padding-bottom: Px(10);
    min-height: 100vh;
  }

  .info-item {
    position: relative;
    overflow: hidden;
    background: #fff;
    width: 100%;
    box-sizing: border-box;
    padding: Px(10);
    border-bottom: 1px solid #eee;

    .info-tit {
      float: left;
      width: Px(104);
      font-size: Px(14);
      color: #808080;

      span {
        font-size: Px(12);
        color: #F56A01;
      }

      &.bz {
        width: Px(84);
      }
    }

    .info-desc {
      position: relative;
      float: left;
      font-size: Px(14);
      color: black;

      .type {
        float: left;
        margin-right: Px(20);
      }

      .type strong {
        font-weight: 500;
        position: relative;
        top: Px(-2);
      }

      .type span {
        position: relative;
        top: Px(2);
        display: inline-block;
        width: Px(18);
        height: Px(18);
        margin-right: Px(6);
        box-sizing: border-box;
        border-radius: 50%;
        border: 1px solid #ccc;
        background: #fff;
      }

      .type span em {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        display: inline-block;
        width: Px(12);
        height: Px(12);
        box-sizing: border-box;
        border-radius: 50%;
        background: #F56A01;
      }

      .address {
        width: Px(250);
        color: #F56A01;
      }
    }
  }

  .sec-icon {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-width: Px(6) Px(6) 0;
    border-style: solid;
    border-color: #aaa transparent transparent;
    /*灰 透明 透明 */
  }

  .submit-btn {
    margin: Px(20) Px(10) 0;
    background-image: linear-gradient(-180deg, #FBA302 0%, #F56A01 100%);
    border-radius: Px(5);
    font-size: Px(16);
    color: #FFFFFF;
    text-align: center;
    height: Px(44);
    line-height: Px(44);
  }

  .bottom-tip {
    margin: Px(10) Px(40);
    font-size: Px(14);
    color: #808080;
    text-align: center;
  }

  .sesscetxt {
    color: #808080;
    padding: Px(10)
  }

  .fp-module {
    overflow: hidden;
    margin: Px(10) Px(10) 0;
    box-sizing: border-box;
    padding: Px(10);
    border: 1px solid #eee;
    box-shadow: 0 Px(2) Px(8) 0 rgba(0, 0, 0, 0.08);

    img {
      display: block;
      width: 100%;
    }

    p {
      text-align: center;
      font-size: Px(14);
      color: #808080;
    }
  }

  .popup-wrap {
    padding: Px(20);

    .title {
      font-weight: 600;
      font-size: Px(18);
      color: #333333
    }

    .sendlist .sendlist-item {
      margin-top: Px(20);
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      .item-left {
        .tit {
          font-size: Px(14);
          color: #333333;
        }

        .txt {
          margin-top: Px(6);
          font-size: Px(12);
          color: #999999;
        }
      }

      .check-type div {
        height: Px(19);
        width: Px(19);
        background: url('../../asset/unsec.png') no-repeat;
        background-size: Px(19) Px(19);
        background-position: 100% 100%;

        &.act {
          background: url('../../asset/sec.png') no-repeat;
          background-size: Px(19) Px(19);
          background-position: 100%;
        }
      }
    }

    .btn {
      margin: Px(20) 0 0;
      background-image: linear-gradient(-180deg, #FBA302 0%, #F56A01 100%);
      border-radius: Px(50);
      font-size: Px(16);
      color: #FFFFFF;
      text-align: center;
      height: Px(40);
      line-height: Px(40);
    }
  }

  /*去除select默认样式*/
  select {
    /*Chrome和Firefox里面的边框是不一样的，所以复写了一下*/
    border: none;
    width: Px(250);
    /*很关键：将默认的select选择框样式清除*/
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    outline: none;
    /*将背景改为红色*/
    background: #fff;
    /*加padding防止文字覆盖*/
    padding-right: 14px;
  }

  /*清除ie的默认选择框样式清除，隐藏下拉箭头*/
  select::-ms-expand {
    display: block;
  }

  input {
    outline: none;
    border: none;
    font-size: Px(14);
    color: black;
    width: Px(250);
  }

  input::-webkit-input-placeholder {
    color: #ccc;
  }

  input::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #ccc;
  }

  input:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #ccc;
  }

  input:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: #ccc;
  }

  textarea {
    // box-sizing: border-box;
    outline: none;
    resize: none;
    border: none;
    width: Px(250);
    height: Px(50);
    padding-top: Px(4);
    font-size: Px(14);
    color: black;
    // border: 1px solid #f4f4f4;
  }

  .bordbot0 {
    border-bottom: 0 !important;
  }

  .bordtop {
    border-top: 1px solid #eee;
  }

  .slot-con {
    padding-top: Px(10);
    padding-bottom: Px(10);
  }

  .poptops {
    padding-top: Px(10);
  }

  .slot-info-con {
    text-align: left !important;
    overflow: hidden;
    width: 100%;
    font-size: Px(12);
    color: #333;

    span {
      color: #808080;
    }
  }

  .slot-extra {
    margin-top: Px(10);
    text-align: left !important;
    font-size: Px(12);
    color: #808080;
  }
</style>