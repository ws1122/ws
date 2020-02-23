<docs>
  下单成功 or 失败页面
</docs>
<template>
  <div>
    <div class="banner">
      <img v-if="isSuc" src="./images/order-suc.png" alt="">
      <img v-if="!isSuc" src="./images/order-fail.png" alt="">
      <p :class="isSuc? '':'failcolor'">{{isSuc ? '下单成功':'下单失败'}}</p>
    </div>
    <div class="con" v-if="isSuc">
      <div class="con-item">
        <div class="tit">商品：</div>
        <div class="desc">{{orderDetail && orderDetail.GoodsName}}</div>
      </div>
      <div class="con-item">
        <div class="tit">规格：</div>
        <div class="desc">{{orderDetail && orderDetail.GoodsAttr}}</div>
      </div>
      <div class="con-item">
        <div class="tit">数量：</div>
        <div class="desc">{{orderDetail && orderDetail.GoodsNumber}}件</div>
      </div>
      <div class="con-item total">
        <div class="tit">合计：</div>
        <div class="desc">{{orderDetail && orderDetail.FeeTotal}}</div>
      </div>
    </div>
    <div class="con" v-if="!isSuc">
      <div class="con-item fail">支付失败原因：当前支付方式余额不足。</div>
    </div>
    <div class="refresh"  v-if="!isSuc" @click="reTest">请重试</div>
    <div class="btn-wrap"  v-if="isSuc">
      <div class="btn lookorder" @click="goDetail">查看订单</div>
      <div class="btn continue" @click="goHome">继续逛逛</div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        isSuc: true,
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
        orderDetail: null
      }
    },
    computed:{
      orderCode(){
        return this.$route.query.orderCode
      },
      access_token(){
        return this.$store.state.token.access_token || localStorage.getItem('access_token')
      }
    },
    methods: {
      // 重试
      reTest(){
        history.go(-1)
      },
      // 
      goHome(){
        this.$router.push({
          name:'index'
        })
      },
      //查看订单
      goDetail(){
        this.$router.push({
          name:'orderDetail',
          query: {
            orderCode: this.orderCode
          }
        })
      },
      getOrderDetail(){
        this.$http.get(`/v1/shop/orderinfo?access_token=${this.access_token}`,{
          orderCode: this.orderCode
        },this.baseUrl).then((data)=>{
          console.log(data)
          if(data.error){

          } else {
            this.orderDetail = data
          }
        })
      }
    },
    mounted(){
        this.getOrderDetail()
    }
  }

</script>
<style lang="scss" scoped>
  @import '../../styles/variable.scss';

  .banner {
    overflow: hidden;
    padding: Px(30);
    background: #fff;

    img {
      display: block;
      margin: 0 auto;
      width: Px(42);
    }

    p {
      margin-top: Px(7);
      font-size: Px(18);
      color: #F67A02;
      text-align: center;
      &.failcolor {
        color: #222222;
      }
    }
  }

  .con {
    margin-top: Px(10);
    padding: 0 Px(10) Px(10);
    overflow: hidden;
    font-size: Px(14);
    background: #fff;

    .con-item {
      overflow: hidden;
      margin-top: Px(10);

      .tit {
        float: left;
        color: #999999;
      }

      .desc {
        float: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: Px(310);
        color: #222222;
        text-align: right;
      }

      &.fail {
        text-align: center;
        color: #999999;
      }

      &.total {
        box-sizing: border-box;
        border-top: 1px solid #E9E9E9;
        padding-top: Px(10);
      }
    }
  }

  .refresh {
    box-sizing: border-box;
    margin: Px(20) Px(10);
    height: Px(44);
    line-height: Px(44);
    text-align: center;
    font-size: Px(16);
    border-radius: Px(5);
    background-image: linear-gradient(-180deg, #FBA302 0%, #F56A01 100%);
    color: #fff;
  }

  .btn-wrap {
    overflow: hidden;
    margin: Px(20) Px(10);

    .btn {
      box-sizing: border-box;
      height: Px(44);
      line-height: Px(44);
      width: Px(166);
      text-align: center;
      font-size: Px(16);
      border-radius: Px(5);

      &.lookorder {
        float: left;
        line-height: Px(42);
        // background: #fff;
        border: Px(2) solid #F56A01;
        color: #F56A01;
      }

      &.continue {
        float: right;
        background-image: linear-gradient(-180deg, #FBA302 0%, #F56A01 100%);
        color: #fff;
      }
    }
  }

</style>
