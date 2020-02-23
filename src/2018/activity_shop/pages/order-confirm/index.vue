<template>
  <div>
    <div class="add-address" v-if="hasAddress==1" @click="toAddress">
      <img src="./images/add.png" alt="">
      <div>新增收货信息</div>
    </div>
    <div class="address" v-if="hasAddress==2" @click="toAddress">
      <img class="ico local" src="./images/address.png" alt="">
      <div class="info-wrap">
        <div class="userinfo">
          <div class="name fl">收货人：{{addressInfo && addressInfo.Contact}}</div>
          <div class="tell fr">{{addressInfo && addressInfo.PhoneNum}}</div>
        </div>
        <div class="place">收货地址：{{addressInfo && addressInfo.Address}}</div>
      </div>
      <img class="ico enter" src="./images/enter.png" alt="">
    </div>
    <div class="goods-wrap">
      <div class="pic-wrap">
        <img :src="'https://files.cheyuu.com/files/' + (goodsInfo && goodsInfo.Logo)" alt="">
      </div>
      <div class="goods-info">
        <div class="name">{{goodsInfo && goodsInfo.Title}}</div>
        <div class="price-wrap">
          <div class="price"><span>￥</span>{{goodsInfo && goodsInfo.Price}}</div>
          <div class="num">x{{num}}</div>
        </div>
        <div class="intro">已选择：{{sizelist[sizeIndex]}}</div>
      </div>
    </div>
    <div class="item-wrap">
      <div class="item">
        <div class="fl">配送运费</div>
        <div class="fr">{{goodsInfo && goodsInfo.ExpressFee}}元</div>
      </div>
      <div class="item bordertop">
        <div class="total orgcolor"><span>￥</span>{{totalMoney && totalMoney.toFixed(2)}}</div>
        <div class="goodsnum">小计：</div>
        <div class="goodsnum">数量{{num}}件</div>
      </div>
    </div>
    <div class="item-wrap">
      <div class="item">
        <div class="cheyoo-money">
          <img class="cheyoo-icon" src="../index/images/coin.png" alt="">
          <div class="cheyoo-num">{{point}}</div>
          <div class="cheyoo-txt">车友币抵扣</div>
        </div>
        <div class="switch-btn" @click="clickSwitch">
          <img v-if="!useCheyooCoin" src="./images/unselec.png" alt="">
          <img v-if="useCheyooCoin" src="./images/selec.png" alt="">
        </div>
      </div>
    </div>
    <transition name="slide-fade">
      <div class="item-wrap margintop0" v-show="useCheyooCoin">
        <div class="item bordertop">
          <div class="fl">车友币抵扣金额</div>
          <div class="orgcolor fr">{{cheyooMoney && cheyooMoney.toFixed(2)}}元</div>
        </div>
      </div>
    </transition>
    <div class="item-wrap">
      <div class="item">
        <div class="cheyoo-money">
          <img class="cheyoo-icon" src="./images/coin1.png" alt="">
          <div class="cheyoo-num">{{balance}}</div>
          <div class="cheyoo-txt">余额抵扣</div>
        </div>
        <div class="switch-btn" @click="clickRestSwitch">
          <img v-if="!useRestCoin" src="./images/unselec.png" alt="">
          <img v-if="useRestCoin" src="./images/selec.png" alt="">
        </div>
      </div>
    </div>
    <transition name="slide-fade">
      <div class="item-wrap margintop0" v-show="useRestCoin">
        <div class="item bordertop">
          <div class="fl">余额抵扣金额</div>
          <div class="orgcolor fr">{{useRestMoney && useRestMoney.toFixed(2)}}元</div>
        </div>
      </div>
    </transition>
    <div class="discount-wrap" @click="clickSecDis">
      <div class="discount-type-wrap">
        <div class="discount-type">
          <div><img src="./images/ico-hui.png" alt=""></div>
          <div>{{(uiPromotionList && uiPromotionList[discountType] && uiPromotionList[discountType].Title) || '未选择优惠'}}</div>
        </div>
        <div class="more-wrap">
          <div>{{reduceMoney == 0 ? '' : (-reduceMoney + '元')}}</div>
          <div><img src="./images/enter.png" alt=""></div>
        </div>
      </div>
    </div>
    <div class="bottom-blank"></div>
    <div class="bottom-wrap">
      <div class="total-money-wrap">
        <div class="total-money-txt">支付金额：</div>
        <div class="total-money orgcolor"><span>￥</span>{{trueMoney && trueMoney.toFixed(2)}}</div>
      </div>
      <div class="sure-btn" @click="clickConfrim">确认</div>
    </div>
    <transition name="slide">
      <div class="pop" v-show="popShow">
        <div class="pop-tit">优惠选择</div>
        <scroller lock-x :height="Height">
          <div class="count-list">
            <div class="clist-item" v-for="(item,index) in uiPromotionList" :key="index" @click="secDiscount(index,item)">
              <div class="count-desc">{{item.Title}}</div>
              <div class="clist-reduce">
                <div class="reduce-num">￥{{item.Reduce}}</div>
                <div class="count-radio">
                  <img :src="discountType == index ? require('./images/radio-on.png'):require('./images/radio-un.png')">
                </div>
              </div>
            </div>
          </div>
        </scroller>
        <div class="btn" @click="closePop">关闭</div>
      </div>
    </transition>
  </div>
</template>
<script>
  import {
    Scroller
  } from 'vux';
  export default {
    data() {
      return {
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
        payUrl: 'https://m.cheyuu.com/pay', // 支付页面
        hasAddress: 0, // 是否有地址
        useCheyooCoin: false, // 是否用车友币抵扣
        useRestCoin: false, // 是否用余额抵扣
        addressInfo: null, // 地址信息
        goodsInfo: null, // 商品信息
        isclick: false, // 防止多次点击确认创建订单
        uiPromotionList: [],
        discountType: -1,
        couponID: 0,
        popShow: false
      }
    },
    components: {
      Scroller
    },
    computed: {
      point() {
        return this.$store.state.user.points // 用户车友币
      },
      balance() {
        return this.$store.state.user.balance // 用户余额
      },
      access_token() {
        return this.$store.state.token.access_token || localStorage.getItem('access_token')
      },
      goodsId() {
        return this.$route.query.id
      },
      sizeIndex() { // 规格颜色索引
        return this.$route.query.sizeIndex
      },
      num() { // 数量
        return this.$route.query.num
      },
      sizelist() { // 规格选择列表
        if (this.goodsInfo && this.goodsInfo.Attr) {
          return this.goodsInfo.Attr.split(',')
        } else {
          return []
        }
      },
      totalMoney() { // 总价金额
        if (this.goodsInfo && this.goodsInfo.Price) {
          return (this.goodsInfo.Price * this.$route.query.num + Number(this.goodsInfo.ExpressFee))
        }
      },
      reduceMoney() { // 优惠券抵扣
        if(this.discountType == -1){
          // 没选择优惠券
          return 0
        } else { // 只要选了优惠券
          // 优惠券面额大于总价 抵掉总价，小于时 有多少抵多少
          let reduce = this.uiPromotionList && this.uiPromotionList[this.discountType] && Number(this.uiPromotionList[this.discountType].Reduce)
          if(reduce >= this.totalMoney){
            return this.totalMoney
          } else {
            return reduce
          }
        }
      },
      cheyooMoney() { // 车友币抵扣
        if (this.useCheyooCoin) {
          if(this.reduceMoney  >= this.totalMoney) {
            // 用来抵扣的优惠券大于等于总价时 不用车友币了
            return 0
          } else {
            let needMoney = this.totalMoney - this.reduceMoney
            if (needMoney >= this.point) {
              return this.point
            } else { // 否则全部用车友币
              return needMoney
            }
          }
        } else {
          return 0
        }
      },
      useRestMoney() { // 用余额
        if (this.useRestCoin) {
          if (this.reduceMoney  >= this.totalMoney) { 
            // 用来抵扣的优惠券大于等于总价时，不用余额了
            return 0
          } else if (this.cheyooMoney >= (this.totalMoney - this.reduceMoney)) { 
            // 用来抵扣的车友币大于等于(总价-优惠券抵扣)时 不用余额了
            return 0
          } else {
            let needMoney = this.totalMoney - this.reduceMoney - this.cheyooMoney // 抵扣了优惠券 和 车友币之后，，还需要的钱数
            if (needMoney >= this.balance) { // 如果比余额多，（余额有多少扣多少）余额扣完，其他的用现金支付
              return this.balance
            } else { // 全部用余额，不需要现金
              return needMoney
            }
          }
        } else {
          return 0
        }
      },
      trueMoney() { // 现金支付的金额
        return (this.totalMoney - this.reduceMoney - this.cheyooMoney - this.useRestMoney)
      },
      Height() {
        return (document.body.clientWidth / 750 * 400) + 'px'
      }
    },
    methods: {
      // 选择某条优惠券
      secDiscount(index,item) {
        console.log(item.CouponID)
        if(this.discountType == index) {
          this.discountType = -1
          this.couponID = 0
        } else {
          this.discountType = index
          this.couponID = Number(item.CouponID)
        }
      },
      // 关闭弹窗时
      closePop() {
        this.popShow = false
        this.$store.dispatch('setMaskShow',false)
      },
      // 点击选择优惠券，显示弹窗
      clickSecDis(){
        if(this.uiPromotionList.length == 0){
          this.$vux.toast.show({
            type: 'text',
            text: '暂无优惠券'
          })
          return false
        }
        this.$store.dispatch('setMaskShow',true)
        this.popShow = true
      },
      getDisCountList(){
        this.$http.get('/v1/shop/couponlist?access_token=' + this.access_token, {
          goodsID: this.goodsId
        }, this.baseUrl).then((data) => {
          if (data.error) {
            if (data.error.code == 401) { // token失效

            } else {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else { // 请求成功
            this.uiPromotionList = data || []
          }
        })
      },
      getuserPoint() {
        this.$http.get('/v1/shop/userpoints?access_token=' + this.access_token, {}, this.baseUrl).then((data) => {
          console.log('积分接口：', data)
          if (data.error) {
            if (data.error.code == 401) { // token失效

            } else {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else { // 请求成功
            this.$store.dispatch('setPoints', data.Points)
            this.$store.dispatch('setBalance', data.Balance)
          }
        })
      },
      // 确认按钮 提交订单
      clickConfrim() {
        // console.log(333, this.isclick)
        if (this.hasAddress == 1) {
          this.$vux.toast.show({
            type: 'warn',
            text: '请填写收货人及地址信息'
          })
          return false
        } else {
          if (this.addressInfo == null) {
            this.$vux.toast.show({
              type: 'warn',
              text: '请填写收货人及地址信息'
            })
            return false
          } else if (this.addressInfo.Contact == '' || this.addressInfo.PhoneNum == '' || this.addressInfo.Address ==
            '') {
            this.$vux.toast.show({
              type: 'warn',
              text: '请填写收货人及地址信息'
            })
            return false
          }
        }
        if (this.isclick) {
          return false
        }
        this.isclick = true
        this.subOrder()
      },
      // 提交订单的接口
      subOrder() {
        this.$http.post(`/v1/shop/createorder?access_token=${this.access_token}`, {
          goodsID: this.goodsId,
          couponID: this.couponID,
          goodsNum: this.num,
          feeBalance: this.useRestMoney,
          feePoints: this.cheyooMoney,
          address: this.addressInfo.Address,
          contact: this.addressInfo.Contact,
          phoneNum: this.addressInfo.PhoneNum,
          goodsAttr: this.sizelist[this.sizeIndex]
        }, this.baseUrl).then(data => {
          this.isclick = false
          if (data.error) {
            // console.log('创建订单接口：', data)
            if (data.error.code == 401) {

            } else {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else {
            let url = `${this.payUrl}/waitpay?orderCode=${data.OrderCode}&access_token=${this.access_token}`
            window.location.href = url
          }
        }).catch((err) => {
          this.isclick = false
        })
      },
      // 获取详情
      getDetail() {
        this.$http.get(`/v1/shop/goodsdetail/${this.goodsId}?access_token=${this.access_token}`, {}, this.baseUrl).then(
          (data) => {
            console.log('detail接口：', data)
            if (data.error) {

            } else {
              this.goodsInfo = data
            }
          })
      },
      // 点击切换按钮 是否使用车友币
      clickSwitch() {
        this.useCheyooCoin = !this.useCheyooCoin
      },
      // 点击是否使用余额
      clickRestSwitch() {
        this.useRestCoin = !this.useRestCoin
      },
      // 跳转到地址 新增或者修改
      toAddress() {
        this.$router.push({
          name: 'address'
        })
      },
      // 获取地址
      getAddress() {
        this.$http.get(`/v1/shop/address?access_token=${this.access_token}`, {}, this.baseUrl).then((data) => {
          // console.log('address接口：', data)
          if (data.error) {

          } else {
            this.addressInfo = data
            if (data.length == 0) {
              this.hasAddress = 1 // 没有地址
            } else {
              this.hasAddress = 2 // 有地址
            }
          }
        })
      }
    },
    mounted() {
      this.$store.dispatch('setMaskShow',false)
      this.getuserPoint()
      this.getAddress()
      this.getDetail()
      this.getDisCountList()
    }
  }

</script>
<style lang="scss" scoped>
  @import '../../styles/variable.scss';

  .add-address {
    overflow: hidden;
    background: #fff;
    height: Px(54);
    line-height: Px(54);

    img {
      display: block;
      float: left;
      margin-top: Px(14);
      margin-left: Px(122);
      width: Px(25);
    }

    div {
      float: left;
      margin-left: Px(10);
      font-size: Px(16);
      color: #666666;
    }
  }

  .address {
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    width: 100%;
    padding: Px(15) Px(42);
    background: #fff;
    font-size: Px(14);
    color: #222222;

    .ico {
      display: block;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);

      &.local {
        left: Px(12);
        width: Px(15);
      }

      &.enter {
        right: Px(12);
        width: Px(10);
      }
    }

    .info-wrap {
      overflow: hidden;

      .userinfo {
        overflow: hidden;
      }

      .place {
        margin-top: Px(10);
      }
    }
  }

  .goods-wrap {
    overflow: hidden;
    margin-top: Px(10);
    box-sizing: border-box;
    padding: 0 Px(10);
    height: Px(120);
    width: 100%;
    background: #fff;

    .pic-wrap {
      position: relative;
      float: left;
      margin: Px(10) Px(10) Px(10) 0;
      width: Px(100);
      height: Px(100);
      background: #F4F4F4;

      img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: Px(100);
        max-height: Px(100);
      }
    }
  }

  .goods-info {
    float: left;
    width: Px(245);

    .name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-top: Px(10);
      font-size: Px(16);
      color: #222222;
    }

    .price-wrap {
      overflow: hidden;
      margin-top: Px(20);

      .price {
        float: left;
        font-size: Px(18);
        color: #F56A01;
      }

      .price span {
        font-size: Px(12);
      }

      .num {
        float: right;
        margin-top: Px(2);
        font-size: Px(14);
        color: #666666;
      }
    }

    .intro {
      overflow: hidden;
      margin-top: Px(20);
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: Px(12);
      color: #999999;
    }
  }

  .item-wrap {
    overflow: hidden;
    box-sizing: border-box;
    margin-top: Px(10);
    padding: 0 Px(10);
    font-size: Px(14);
    color: #666666;
    background: #fff;

    .item {
      overflow: hidden;
      height: Px(45);
      line-height: Px(45);
      width: 100%;

      .cheyoo-money,
      .cheyoo-money .cheyoo-txt {
        overflow: hidden;
        float: left;
      }

      .goodsnum {
        float: right;
        margin-left: Px(10);
        font-size: Px(12);
        color: #666666;
      }

      .total {
        float: right;
        font-size: Px(18);
      }

      .total span {
        font-size: Px(12);
      }

      .cheyoo-money .cheyoo-icon {
        float: left;
        display: block;
        margin-top: Px(13);
        width: Px(19);
      }

      .cheyoo-money .cheyoo-num {
        float: left;
        margin-left: Px(5);
        margin-right: Px(10);
        font-size: Px(12);
        color: #222222;
      }

      .switch-btn {
        overflow: hidden;
        float: right;
        margin-top: Px(7);
        width: Px(51);

        // height: Px(31);
        img {
          display: block;
          width: Px(51);
        }
      }

    }
  }
  .discount-wrap {
    margin-top: Px(10);
    padding: 0 Px(10);
    background: #fff;
  }
  .discount-wrap .discount-type-wrap {
    display: flex;
    height: Px(45);
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .discount-type {
      display: flex;
      flex-direction: row;
      align-items: center;
      div {
        font-size: Px(14);
        color: #666666;
      }
      div>img {
        display: block;
        margin-right: Px(5);
        width: Px(19);
      }
    }
    .more-wrap {
      display: flex;
      flex-direction: row;
      align-items: center;
      div {
        font-size: Px(14);
        color: #F56A01;
      }
      div>img {
        display: block;
        margin-left: Px(5);
        margin-right: Px(3);
        width: Px(10);
      }
    }
  }

  .bottom-blank {
    width: 100%;
    height: Px(74);
  }

  .bottom-wrap {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: Px(64);
    background: #fff;

    .total-money-wrap {
      position: absolute;
      top: 50%;
      left: Px(10);
      transform: translateY(-50%);
      overflow: hidden;
      float: left;
      width: Px(178);
    }

    .total-money-wrap .total-money-txt {
      float: left;
      line-height: Px(24);
      font-size: Px(14);
      color: #222222;
    }

    .total-money-wrap .total-money {
      float: left;
      font-size: Px(18);

      span {
        font-size: Px(12);
      }
    }

    .sure-btn {
      float: right;
      margin: Px(10);
      width: Px(166);
      height: Px(44);
      line-height: Px(44);
      text-align: center;
      font-size: Px(16);
      color: #fff;
      background-image: linear-gradient(-180deg, #FBA302 0%, #F56A01 100%);
      border-radius: Px(5);
    }
  }

  .fl {
    float: left;
  }

  .fr {
    float: right;
  }

  .bordertop {
    border-top: 1px solid #E9E9E9;
  }

  .margintop0 {
    margin-top: 0;
  }

  .orgcolor {
    color: #F56A01;
  }
  
  .pop {
    z-index: 21;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 0 Px(10) Px(30);
    background: #fff;

    .pop-tit {
      padding-top: Px(10);
      height: Px(40);
      line-height: Px(40);
      font-size: Px(16);
      font-weight: 600;
    }

    .count-list .clist-item {
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      height: Px(50);
      border-bottom: 1px solid #E9E9E9;

      .count-desc {
        font-size: Px(14);
        color: #333333;
      }
      .clist-reduce {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      .clist-reduce .reduce-num {
        font-size: Px(14);
        color: #333333;
      }
      .clist-reduce .count-radio>img {
        display: block;
        margin-left: Px(5);
        width: Px(22);
      }
    }
  }
  .btn {
    margin: Px(30) auto 0;
    height: Px(44);
    line-height: Px(44);
    width: Px(355);
    text-align: center;
    font-size: Px(16);
    color: #FFFFFF;
    background-image: linear-gradient(180deg, #FBA302, #F56A01);
    border-radius: Px(5);
  }
  // 动画
  .slide-fade-enter-active {
    transition: all .5s ease;
  }

  .slide-fade-leave-active {
    transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-fade-enter,
  .slide-fade-leave-to

  /* .slide-fade-leave-active for below version 2.1.8 */
    {
    transform: translateY(Px(-45));
    opacity: 0;
  }
  

  .slide-enter-active {
    transition: all .5s ease;
  }

  .slide-leave-active {
    transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-enter,
  .slide-leave-to {
    transform: translateY(Px(600));
  }
</style>
