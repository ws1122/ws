<template>
  <div>
    <div class="ban">
      <div class="ban-left">
        <div class="state">{{(orderDetail && orderDetail.DeliveryStatus) == 0 ? '等待商家发货': (orderDetail && orderDetail.DeliveryStatus == 1) ? '已发货': (orderDetail && orderDetail.DeliveryStatus == 2) ? '已签收':''}}</div>
        <div class="orde-code" v-show="(orderDetail && orderDetail.DeliveryStatus != 0)">{{orderDetail && (orderDetail.ExpressCompany + orderDetail.ExpressCode)}}</div>
      </div>
      <img v-if="(orderDetail && orderDetail.DeliveryStatus != 0)" src="./images/pic-fahuo.png" alt="">
      <img v-if="(orderDetail && orderDetail.DeliveryStatus == 0)" src="./images/pic-order.png" alt="">
    </div>
    <div class="address-wrap">
        <img src="./images/ico-local.png" alt="">
        <div class="userdesc">
            <div class="name">收货人：{{orderDetail && orderDetail.Contact}}</div>
            <div class="phone">{{orderDetail && orderDetail.PhoneNumber}}</div>
        </div>
        <div class="address">收货地址：{{orderDetail && orderDetail.Address}}</div>
    </div>
    <div class="goods-wrap">
        <div class="pic-wrap">
            <img :src="'https://files.cheyuu.com/files/' + (orderDetail && orderDetail.Logo)" alt="">
        </div>
        <div class="goods-info">
            <div class="goodname">
                <div class="goods">{{orderDetail && orderDetail.GoodsName}}</div>
                <div class="price">¥ {{orderDetail && orderDetail.GoodsPrice}}</div>
            </div>
            <div class="goodtips">
                <div class="tips">{{orderDetail && orderDetail.GoodsAttr}}</div>
                <div class="num">x{{orderDetail && orderDetail.GoodsNumber}}</div>
            </div>
        </div>
    </div>
    <div class="price-desc">
        <div class="price-item">
            <div class="tit">商品总价</div>
            <div class="price-num">¥{{(orderDetail && orderDetail.GoodsPrice)*(orderDetail && orderDetail.GoodsNumber)}}</div>
        </div>
        <div class="price-item">
            <div class="tit">运费</div>
            <div class="price-num">¥{{orderDetail && orderDetail.ExpressFee}}</div>
        </div>
        <div class="price-item font14 blackcolor borderbot">
            <div class="tit">订单总价</div>
            <div class="price-num">¥{{orderDetail && orderDetail.FeeTotal}}</div>
        </div>
        <div class="price-item">
            <div class="tit">车友币抵扣</div>
            <div class="price-num">¥{{orderDetail && orderDetail.FeePoints}}</div>
        </div>
        <div class="price-item">
            <div class="tit">余额抵扣</div>
            <div class="price-num">¥{{orderDetail && orderDetail.FeeBalance}}</div>
        </div>
        <div class="price-item font14">
            <div class="tit blackcolor">实际支付金额</div>
            <div class="price-num orgcolor">¥{{orderDetail && orderDetail.FeePayment}}</div>
        </div>
    </div>
    <div class="notice-tip">注：如需开票请拨打客服电话：400-6326-888。</div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
          baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
          isOut: false, /// 是否发货
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
    methods:{
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

  .ban {
    position: relative;
    overflow: hidden;
    height: Px(134);
    width: 100%;
    background-image: linear-gradient(90deg, #FF8F00 4%, #FE5200 100%);

    .ban-left {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: Px(30);
      width: Px(205);
      color: #fff;
      .state {
        font-size: Px(16);
      }
      .orde-code {
        margin-top: Px(8);
        font-size: Px(14);
      }
    }

    img {
      display: block;
      float: right;
      width: Px(134);
    }
  }
.address-wrap {
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    padding: Px(15) Px(10) Px(15) Px(50);
    margin-top: Px(10);
    background: #fff;
    font-size: Px(14);
    color: #222222;
    img {
        position: absolute;
        left: Px(10);
        top: 50%;
        transform: translateY(-50%);
        display: block;
        width: Px(30);
    }
    .userdesc {
        overflow: hidden;
        .name {
            float: left;
        }
        .phone {
            float: right;
        }
    }
    .address {
        margin-top: Px(10);
    }
}
.goods-wrap {
    overflow: hidden;
    box-sizing: border-box;
    height: Px(120);
    padding: 0 Px(10);
    margin-top: Px(10);
    background: #fff;
    font-size: Px(14);
    color: #222222;
    .pic-wrap {
        position: relative;
        overflow: hidden;
        float: left;
        margin: Px(10) Px(10) Px(10) 0;
        width: Px(100);
        height: Px(100);
        background: #F4F4F4;
        img {
            position: absolute;
            display: block;
            max-width: Px(100);
            max-height: Px(100);
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
        }
    }
    .goods-info {
        float: left;
        overflow: hidden;
        width: Px(244);
        .goodname {
            overflow: hidden;
            font-size: Px(14);
            color: #222222;
        }
        .goodtips {
            overflow: hidden;
            font-size: Px(12);
            color: #999999;
        }
        .goodname .goods,.goodtips .tips {
            float: left;
            margin-top: Px(10);
            width: Px(155);
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
        .goodname .price,.goodtips .num {
            float: right;
            margin-top: Px(10);
        }
    }
}
.price-desc {
    overflow: hidden;
    margin-top: Px(10);
    background: #fff;
    padding: 0 Px(10) Px(10) Px(10);
    font-size: Px(12);
    color: #999999;
    .price-item {
        overflow: hidden;
        margin-top: Px(10);
        .tit {
            float: left;
        }
        .price-num {
            float: right;
        }
    }
}
.font14 {
    font-size: Px(14);
}
.blackcolor {
    color: #222222;
}
.orgcolor {
    color: #F56A01;
}
.borderbot {
    padding-bottom: Px(10);
    border-bottom: 1px solid #E9E9E9;
}
.notice-tip {
    font-size: Px(14);
    color: #999;
    text-align: center;
    line-height: Px(30);
}
</style>
