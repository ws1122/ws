<template>
  <div class="container">
    <div class="detail-list">
      <div class="detail-item">
        <div class="item-tit">支付类型</div>
        <div class="item-txt">{{orderInfo && orderInfo.Title}}</div>
      </div>
      <div class="detail-item">
        <div class="item-tit">商品类型</div>
        <div class="item-txt">{{orderInfo && orderInfo.Description}}</div>
      </div>
      <div class="detail-item">
        <div class="item-tit">本次充值加油币</div>
        <div class="item-txt">{{orderInfo && (orderInfo.FeeTotal/100).toFixed(2)}}</div>
      </div>
      <div class="detail-item">
        <div class="item-tit">实际付款</div>
        <div class="item-txt org">¥{{orderInfo && (orderInfo.FeePayment/100).toFixed(2)}}</div>
      </div>
      <div class="detail-item">
        <div class="item-tit">已用加油币</div>
        <div class="item-txt org">¥{{orderInfo && ((orderInfo.FeeTotal - orderInfo.FreePoint)/100).toFixed(2)}}</div>
      </div>
    </div>
    <div class="extra">{{(orderInfo && Number(orderInfo.AllowRefund) > 0) ? '':'消费金额大于充值金额，不能申请退款'}}</div>
    <div class="btn" :class="(orderInfo && Number(orderInfo.AllowRefund) > 0) ? '':'cantclick'" @click="toPayBack">申请退款</div>
    <div class="kf">如有疑问请咨询客服电话：<a href="tel:400-6326-888">400-6326-888</a></div>
    <transition class="fade">
      <div class="popmask" v-show="popShow">
        <div class="popalert">
          <div class="pop-con">
            <div>退款将扣除优惠</div>
            <div>本单可退款金额{{orderInfo && (Number(orderInfo.AllowRefund)/100).toFixed(2)}}元</div>
          </div>
          <div class="pop-btn">
            <div @click="closeAlert">取消</div>
            <div class="green" @click="confirmDo">确认</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  data(){
    return {
      baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
      popShow: false,
      orderInfo: null,
      canDoPayBack: false
    }
  },
  computed:{
    access_token() {
      return this.$store.state.token.access_token || localStorage.getItem('access_token')
    },
    orderCode(){
      return this.$route.query.orderCode
    }
  },
  mounted(){
    // console.log('ordercode===',this.orderCode)
    this.getCheyooOrder()
  },
  methods: {
    // 取消按钮
    closeAlert(){
      this.popShow = false
    },
    // 确定按钮
    confirmDo(){
      this.postPayBack()
    },
    // 点击申请退款
    toPayBack(){
      if(!this.canDoPayBack) {
        return false
      }
      this.popShow = true
    },
    // 退款接口
    postPayBack(){
      this.$http.post('/v1/cyborder/refund?access_token=' + this.access_token,{
        orderCode: this.orderCode
      },this.baseUrl).then(data=>{
        if (data.error) {
          if (data.error.code != 401) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
          }
        } else {
          this.popShow = false
          this.getCheyooOrder()
        }
      })
    },
    // 查询某行cybOrder
    getCheyooOrder(){
      this.$http.get('/v1/cyborder?access_token=' + this.access_token, {
        OrderCode: this.orderCode
      },this.baseUrl).then(data=>{
        console.log(data)
        if (data.error) {
          if (data.error.code != 401) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
          }
        } else {
          this.orderInfo = data
          if(Number(data.AllowRefund) > 0) {
            this.canDoPayBack = true
          } else {
            this.canDoPayBack = false
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
    min-height: 100vh;
    background: #F5F5F5;
  }
  .detail-list {
    background: #fff;
    padding: 0 Px(20);
    .detail-item {
      padding: Px(22) 0;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .item-tit {
        font-size: Px(32);
        color: #666666;
      }
      .item-txt {
        font-size: Px(28);
        color: #333333;
        &.org {
          color: #F67A02;
        }
      }
    }
    .detail-item:not(:last-child){
      border-bottom: 1px solid #E9E9E9;
    }
  }
  .extra {
    font-size: Px(28);
    color: #999999;
    text-align: center;
    height: Px(80);
    line-height: Px(80);
  }
  .btn {
    margin: 0 auto;
    height: Px(88);
    line-height: Px(88);
    width: Px(710);
    text-align: center;
    font-size: Px(32);
    color: #FFFFFF;
    background-image: linear-gradient(180deg, #FBA302, #F56A01);
    border-radius: Px(10);
  }
  .kf {
    margin-top: Px(60);
    font-size: Px(32);
    color: #666666;
    text-align: center;
    span {
      color: #F56A01;
    }
  }
  a {
    color: #F56A01;
  }
  .popmask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .5);
  }
  .popalert {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    background: #fff;
    width: Px(610);
    border-radius: Px(30);
    .pop-con {
      text-align: center;
      padding: Px(84) 0 Px(80) 0;
      font-size: Px(36);
      color: #F56A01;
    }
    .pop-btn {
      display: flex;
      height: Px(88);
      width: 100%;
      border-top: 1px solid #E9E9E9;
      div {
        flex: 1;
        line-height: Px(88);
        text-align: center;
        font-size: Px(36);
        color: #999999;
        &.green {
          color: #01A2AE;
        }
      }
    }
  }
  .cantclick {
    background: #999999;
  }
  .fade-enter-active {
    transition: opacity .5s;
  }
  .fade-leave-active {
    transition: opacity .8s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>

