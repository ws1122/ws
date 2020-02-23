<template>
  <!-- <v-touch v-on:swipeleft="clickTab(1)" v-on:swiperight="clickTab(0)" tag="div"> -->
    <div class="myorder-container">
      <div class="tabwrap">
        <div class="tab-item" v-for="(item,index) in tablist" :key="index" @click="clickTab(index)">
          <span :class="tabindex==index?'act':''">{{item}}</span>
        </div>
      </div>
      <div class="content">
        <div class="list"  v-show="!nodata">
          <div class="list-item" v-for="(item,index) in orderlist" :key="index" @click="toDetail(item.OrderCode)">
            <div class="state-wrap">
              <div class="state">{{item.DeliveryStatus == 0 ?'等待商家发货': item.DeliveryStatus == 1 ? '已发货':'已签收'}}</div>
              <div class="state-tip" v-show="item.DeliveryStatus != 0">{{item.ExpressCompany + item.ExpressCode }}</div>
            </div>
            <div class="goods-wrap">
              <div class="pic-wrap">
                <img :src="'https://files.cheyuu.com/files/' + item.Logo" alt="">
              </div>
              <div class="goods-info">
                <div class="goodname">
                  <div class="goods">{{item.GoodsName}}</div>
                  <div class="price">¥ {{item.GoodsPrice}}</div>
                </div>
                <div class="goodtips">
                  <div class="tips">{{item.GoodsAttr}}</div>
                  <div class="num">x{{item.GoodsNumber}}</div>
                </div>
                <div class="goodtotal">
                  <div class="num">数量{{item.GoodsNumber}}件</div>
                  <div class="money">¥{{item.FeeTotal}}</div>
                  <div class="total">合计：</div>
                </div>
                <!-- <div class="btn-invoice" :class="item.InvoiceStatus == 0 ? '':'gray'" v-show="tabindex==1" @click.stop="clickInvoiceBtn(item)">{{item.InvoiceStatus == 2 ? '已开票':'申请开票'}}</div> -->
                <div class="btn-invoice" :class="item.DeliveryStatus != 1 ? 'gray':''" v-show="tabindex==0 && item.DeliveryStatus == 1" @click.stop="clickConfirmBtn(item)">确认收货</div>
              </div>
            </div>
          </div>
        </div>
        <div class="nodata" v-show="nodata">暂无订单</div>
      </div>
    </div>
  <!-- </v-touch> -->
</template>
<script>
  export default {
    data() {
      return {
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
        tablist: ['进行中', '已完成'],
        tabindex: 0, // 选中
        hasOrder: false, // 是否发货
        orderlist: [], // 订单列表
        nodata: false // 没数据
      }
    },
    computed:{
      access_token(){
        return this.$store.state.token.access_token || localStorage.getItem('access_token')
      }
    },
    methods: {
      clickTab(index) {
        this.tabindex = index
        this.orderlist = [] /// 先清空再赋值 避免闪一下
        this.getOrderList()
      },
      // 订单列表
      getOrderList(){
        this.$http.get(`/v1/shop/orderlist?access_token=${this.access_token}`,{
          type: Number(this.tabindex) + 1
        },this.baseUrl).then((data)=>{
          console.log('orderlist：', data)
          if(data.error){
          } else {
            this.orderlist = data
            if(data.length == 0){
              this.nodata = true
            } else {
              this.nodata = false
            }
          }
        })
      },
      // 去订单详情
      toDetail(orderCode) {
        this.$router.push({
          name: 'orderDetail',
          query: {
            orderCode: orderCode
          }
        })
      },
      // 申请开票按钮
      clickInvoiceBtn(item){
        if(item.InvoiceStatus == 0){ // 未提交
          this.subGeInvoice(item.OrderCode)
        } else if(item.InvoiceStatus == 1){ // 已提交
          this.$vux,toast.show({
            type: 'warn',
            text:'已提交开票申请'
          })
          return false
        } else { // 已开票
          return false
        }
      },
      // 申请开票接口
      subGeInvoice(orderCode){
        this.$http.post(`/v1/shop/applyinvoice?access_token=${this.access_token}`,{
          orderCode: orderCode
        },this.baseUrl).then((data)=>{
          console.log(data)
          if(data.error){

          } else {
            this.$vux.toast.show({
              type:'success',
              text: '已提交开票申请',
              onHide:() => {
                this.getOrderList()
              }
            })
          }
        })
      },
      // 点击确认收货
      clickConfirmBtn(item){
        if(item.DeliveryStatus != 1) { // 只有发货的状态能点
          return false
        } else {
          this.subGetGoodsStatus(item.OrderCode)
        }
      },
      // 确认收货接口
      subGetGoodsStatus(orderCode){
        this.$http.post(`/v1/shop/confirmdelivery?access_token=${this.access_token}`,{
          orderCode: orderCode
        },this.baseUrl).then((data)=>{
          console.log(data)
          if(data.error){

          } else {
            this.$vux.toast.show({
              type:'success',
              text: '已确认收货',
              onHide:() => {
                this.tabindex = 1
                this.orderlist = [] /// 先清空再赋值 避免闪一下
                this.getOrderList()
              }
            })
          }
        })
      }
    },
    mounted(){
      this.getOrderList()
    }
  }

</script>
<style lang="scss" scoped>
  @import '../../styles/variable.scss';

  .myorder-container {
    overflow: hidden;
  }

  .tabwrap {
    overflow: hidden;
    height: Px(44);
    width: 100%;
    text-align: center;
    background: #F9F9F9;

    .tab-item {
      float: left;
      width: 50%;
      font-size: Px(16);

    }

    .tab-item span {
      display: inline-block;
      box-sizing: border-box;
      line-height: Px(42);
      color: #999999;
      border-bottom: Px(2) solid #F9F9F9;

      &.act {
        border-bottom: Px(2) solid #F56A01;
        color: #222;
      }
    }
  }
  .content {
    position: relative;
    overflow: hidden;
    // min-height: 100vh;
    min-height: calc(100vh - 44 * 2 / 750 * 10rem);
  }
  .list-item {
    padding: Px(10);
    margin-top: Px(10);
    background: #fff;
  }

  .state-wrap {
    overflow: hidden;
    font-size: Px(14);
    color: #999999;

    .state {
      float: left;
    }

    .state-tip {
      float: right;
      color: #F56A01;
    }
  }

  .goods-wrap {
    overflow: hidden;
    box-sizing: border-box;
    // padding: 0 Px(10);
    margin-top: Px(5);
    background: #fff;
    font-size: Px(14);
    color: #222222;

    .pic-wrap {
      position: relative;
      overflow: hidden;
      float: left;
      margin: Px(10) Px(10) 0 0;
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
        transform: translate(-50%, -50%);
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

      .goodname .goods,
      .goodtips .tips {
        float: left;
        margin-top: Px(10);
        width: Px(155);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .goodname .price,
      .goodtips .num {
        float: right;
        margin-top: Px(10);
      }

      .goodtotal {
        overflow: hidden;
        margin-top: Px(10);
        font-size: Px(12);
        color: #666;

        .num {
          float: left;
          line-height: Px(21);
        }

        .total {
          float: right;
          line-height: Px(21);
        }

        .money {
          float: right;
          font-size: Px(16);
          color: #222222;
        }
      }

      .btn-invoice {
        float: right;
        margin-top: Px(10);
        box-sizing: border-box;
        height: Px(30);
        line-height: Px(30);
        text-align: center;
        width: Px(88);
        font-size: Px(14);
        color: #F56A01;
        border: 1px solid #F56A01;
        border-radius: Px(100);
      }
    }
  }
.nodata {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 100%;
  text-align: center;
}
.gray {
  color: #ccc!important;
  border-color: #ccc!important;
}
</style>
