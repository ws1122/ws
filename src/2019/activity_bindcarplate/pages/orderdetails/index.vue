<template>
  <div class="content">
    <div class="top">
      <img src="./images/top.jpg" alt="">
    </div>
    <div class="middle">
      <p class="pay">支付完成</p>
      <p class="number">{{datadetails.VerifyCode}}</p>
      <p class="time">{{datadetails.CreateTime}}</p>
      <p class="code">请将验证码告诉工作人员,谢谢:)</p>
    </div>
    <div class="paylist">
      <div class="item">
        <p>支付站点</p>
        <p class="sites">{{datadetails.Title}}</p>
      </div>
      <div class="item">
        <p>商品名称</p>
        <p class="sites">{{datadetails.GoodName}}</p>
      </div>
      <div class="item">
        <p>订单编号</p>
        <p class="sites">{{datadetails.OrderCode}}</p>
      </div>
      <div class="item">
        <p>消费金额</p>
        <p class="sites">{{datadetails.FeeTotal}}元</p>
      </div>
      <div class="item">
        <p>实付金额</p>
        <p class="time">{{datadetails.FeePayment}}元</p>
      </div>
    </div>
    <div class="paylist" @click="refund">
      <div class="item">
        <p>退款</p>
        <img src="./images/more.png" alt="" class="more">
      </div>
    </div>
    <alert v-model="ishow"> 已超过自助退款时限，如需退款 请联系客服：4000 6326 888</alert>
  </div>
</template>
<script>
  import {Alert} from 'vux'
  export default {
    data() {
      return {
        ishow: false,
        datadetails:'',
        baseUrl: this.$isTest ? "https://test.api.cheyuu.com" : "https://api.cheyuu.com",

      }
    },
    computed: {
      access_token() {
        return this.$store.state.token.access_token || localStorage.getItem('access_token')
      },

      type() {
        return this.$route.query.id
      },
      orderCode() {
        return this.$route.query.code
      }

    },
    mounted() {
      this.getorderdetails()
    },
    components: {
      Alert
    },
    methods: {
      refund() {
        this.ishow = true;
      },

      /*获取订单详情*/
      getorderdetails() {
        this.$http.get('/v2/order/orderdetail?access_token=' + this.access_token, {
          orderCode: this.orderCode,
          type:  Number(this.type)
        }, this.baseUrl).then((
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
            console.log(15888777, data)
            this.datadetails=data.order
          }
        })
      },
    }


  }

</script>
<style lang="scss" scoped>
  @import '../../styles/variable.scss';

  .content {
    min-height: 100vh;
    background-color: #F6F6F6;
    overflow: hidden;

    .top {
      margin: Px(10) 0;

      img {
        width: 100%;
        height: auto;
      }

    }

    .middle {
      text-align: center;
      background-color: #fff;

      .pay {
        font-size: Px(40);
        line-height: Px(80);

      }

      .number {
        color: #EC6100;
        font-size: Px(60);
        line-height: Px(110);
      }

      .code {
        color: #979797;
        line-height: Px(80);
        font-size: Px(30);
      }


    }

    .paylist {
      margin: Px(20) 0;
      width: 100%;
      padding: 0 Px(20);
      box-sizing: border-box;
      background-color: #fff;
      color: #808080;

    }
  }

  .item {
    height: Px(100);
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #F6F6F6
  }

  .sites {
    color: #414141
  }

  .time {
    color: #DEA568;

  }

  .more {
    width: Px(24);
    height: Px(44);
    position: relative;
    top: Px(6);
  }

  /deep/ .weui-dialog__bd {
    color: #F66A01;
    padding: 0 Px(20) Px(12);
  }

  /deep/ .weui-dialog__btn_primary {
    color: #01A2AE
  }

</style>
