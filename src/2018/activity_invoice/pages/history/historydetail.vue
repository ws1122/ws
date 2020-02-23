<template>
  <div>
    <div class="item-wrap">
      <div class="item">
        <div class="txt">开票状态：</div>
        <div class="tit org">{{statusList[(invoiceInfo && Number(invoiceInfo.Status))]}}</div>
      </div>
      <div class="item">
        <div class="txt">开票金额：</div>
        <div class="tit">￥{{invoiceInfo && invoiceInfo.Total}}</div>
      </div>
      <div class="item">
        <div class="txt">发票抬头：</div>
        <div class="tit">{{(invoiceInfo && invoiceInfo.TitleType)==1 ? '个人' : (invoiceInfo && invoiceInfo.Title)}}</div>
      </div>
      <div class="item" v-if="(invoiceInfo && invoiceInfo.TitleType)==2">
        <div class="txt">税号：</div>
        <div class="tit">{{invoiceInfo && invoiceInfo.TaxNumber}}</div>
      </div>
      <div class="item" v-if="(invoiceInfo && invoiceInfo.TitleType)==2">
        <div class="txt">地址电话：</div>
        <div class="tit">{{invoiceInfo && invoiceInfo.TaxAddress}}</div>
      </div>
      <div class="item" v-if="(invoiceInfo && invoiceInfo.TitleType)==2">
        <div class="txt">开户行及账号：</div>
        <div class="tit">{{invoiceInfo && invoiceInfo.TaxAccount}}</div>
      </div>
      <div class="item">
        <div class="txt">开票内容：</div>
        <div class="tit">*汽油*汽油</div>
      </div>
      <div class="item" v-if="(invoiceInfo && invoiceInfo.TaxPattern)==2">
        <div class="txt">收件人信息：</div>
        <div class="tit">{{receiverInfo}}</div>
      </div>

      <div class="item" v-if="(invoiceInfo && invoiceInfo.TaxPattern)==1">
        <div class="txt">邮件地址：</div>
        <div class="tit">{{invoiceInfo && invoiceInfo.Email}}</div>
      </div>
    </div>
    <!-- <div class="btn" v-if="(invoiceInfo && invoiceInfo.TaxPattern)==1" @click="sendEmail">重发邮件</div> -->
    <div class="item border0">
      <div class="txt">开票明细：</div>
    </div>
    <div class="detail-list">
      <div class="list-item" v-for="(item,index) in orderList" :key="index">
        <div class="item-top">
          <div class="ico">
            <img src="../../asset/oil-ico.png" alt="">
          </div>
          <div class="item-right">
            <div class="item-title">{{item.Title}}</div>
            <div class="ordercode">{{item.OrderCode}}</div>
          </div>
        </div>
        <div class="item-bot">
          <div class="txt">订单金额：{{item.FeeTotal.toFixed(2)||0}}</div>
          <div class="tit">{{item.CreateTime}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      invoiceInfo: null,
      orderList: [],
      receiverInfo: '',
      statusList: ['待开票', '已开票', '已邮寄', '自取', '到付', '已冲红', '专票待开票', '客服审核不通过', '财务审核不通过', '系统自动取消', '已领取自取的发票']
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    access_token() {
      // return '87af08e08cb1bd8d4f9c9084219cddad6365bfc0'
      return this.$store.state.token.access_token || localStorage.getItem('access_token')
    }
  },
  mounted() {
    this.getInvoiceInfo()
  },
  methods: {
    sendEmail() {
      // 重发邮件
    },
    getInvoiceInfo() {
      this.$http.get('/v1/invoice/invoicedetail/' + this.id + '?access_token=' + this.access_token, {
        id: Number(this.id)
      }).then(data => {
        console.log(data)
        if (data.error) {
          if (data.error.code !== 401) {
            this.$vux.toast.show({
              type: 'warn',
              text: data.error.message
            })
          }
        } else {
          this.invoiceInfo = data.invoice
          this.orderList = data.Order
          this.receiverInfo = data.invoice.ContactName + '(' + data.invoice.PhoneNum + ')'
        }
      })
    }
  }
}
</script>


<style lang="scss" scoped>
@import '../../styles/variable.scss';
.item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  width: 100%;
  box-sizing: border-box;
  padding: Px(10);
  border-top: 1px solid #eee;
  .txt {
    font-size: Px(14);
    color: #808080;
  }
  .tit {
    font-size: Px(14);
    color: #333;
    &.org {
      color: #F56A01;
    }
  }
  &.border0 {
    margin-top: Px(10);
    border: 0
  }
}
.btn {
  margin: Px(20) Px(10);
  height: Px(44);
  text-align: center;
  line-height: Px(44);
  box-sizing: border-box;
  font-size: Px(16);
  border-radius: Px(5);
  color: #FFFFFF;
  background-image: linear-gradient(-180deg, #FBA302 0%, #F56A01 100%);
}
.list-item {
  margin-top: Px(10);
  background: #fff;
  padding: 0 Px(10);
  .item-top {
    padding: Px(20) 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    .ico img {
      display: block;
      width: Px(38);
      margin-right: Px(20);
    }
    .item-right .item-title {
      font-size: Px(14);
      color: #333;
    }
    .item-right .ordercode {
      margin-top: Px(15);
      font-size: Px(14);
      color: #808080;
    }
  }
  .item-bot {
    box-sizing: border-box;
    padding: Px(6) 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-top: 1px solid #eee;
    .txt {
      font-size: Px(14);
      color: #333;
    }
    .tit {
      font-size: Px(14);
      color: #333;
    }
  }
}
</style>

