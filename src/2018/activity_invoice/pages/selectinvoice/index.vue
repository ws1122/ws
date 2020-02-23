<template>
  <div class="top-btn-box">
    <!-- <div >
      <x-button class="orderBtnMargin" :class='listStatus==1? "orderBtn":""' @click.native='listStatus=1' mini>加油订单</x-button>
      <x-button class="orderBtnMargin" :class='listStatus==2? "orderBtn":""' @click.native='listStatus=2' mini>飞马加油基金</x-button>
    </div> -->
    <div class="list-wrap" v-show="hasData">
      <div class="list-item" v-for="(item,index) in invoiceList" :key="index" @click="selectItem(index)">
        <div class="item-top">
          <div class="item-top-left">
            <div class="sec-btn" :class="item.isSec?'act':''"></div>
            <div class="site-name">油卡号:{{item.CardNumber}}</div>
            <p>{{item.CreateTime}}</p>
          </div>
          <div class="item-top-right">
            <div>¥{{item.FeePayment}}</div>
            <p>¥{{item.FeeTotal}}</p>
          </div>
        </div>
        <!-- <div class="item-bottom">
          <div class="item-bottom-left">开票单位</div>
          <div class="item-bottom-right">方沁沁加油公司</div>
        </div> -->
      </div>
    </div>
    <div class="nodata" v-show="!hasData">暂无记录</div>
    <div class="bottom-wrap" v-show="invoiceList.length!=0">
      <div class="bottom-con">
        <div class="sec-all" :class="isSecAll ? 'act':''" @click="seclectAll"></div>
        <div class="sec-all-tit" @click="seclectAll">全选</div>
        <div class="money">开票金额：<span>¥{{totalMoney}}</span></div>
      </div>
      <div class="confrim-btn" @click="toDetail">确定</div>
    </div>
    <!-- 弹窗提示 -->
    <pop @closeTank="closePopTip" @onConfirm="confirmCallBack" v-show="secTipShow" :hasConfirm="hasPopConfirm"
      :hasClose="hasPopClose">
      <div slot='poptop'>
        <div class="slot-con">{{slotTips}}</div>
      </div>
      <!-- 确认按钮 -->
      <div slot='leftbtn' v-if="hasPopConfirm">确定</div>
      <!-- 关闭按钮 -->
      <div slot='popbtn' v-if="hasPopClose">确定</div>
    </pop>
  </div>
</template>
<script>
  import pop from '../../components/pop/index.vue'
  export default {
    beforeRouteEnter(to, from, next) {
      if (from.path == '/history') { // 列表跳详情是 详情页不用keep-alive
        next(vm => {
          vm.$router.back(-1)
        })
      } else {
        next()
      }
    },
    data() {
      return {
        hasPopClose: true, // 弹窗是否有关闭按钮
        hasPopConfirm: true, // 弹窗是否有确认按钮
        secTipShow: false, // 弹窗提示
        slotTips: '', // 弹窗提示内容
        invoiceList: [], // 发票列表
        isSecAll: false, // 当前是否全选了 初始化列表的时候赋值
        hasData: true, // 列表是否有数据，反着写，避免dom闪烁的问题
        listStatus: 1, // 列表状态,显示不同的
        orderStr: ''
      }
    },
    components: {
      pop
    },
    computed: {
      invoiceType() {
        return this.$route.query.type
      },
      access_token() {
        // return '87af08e08cb1bd8d4f9c9084219cddad6365bfc0'
        return this.$store.state.token.access_token || localStorage.getItem('access_token')
      },
      totalMoney() { // 要开票的总金额
        let money = 0
        if (this.invoiceList.length > 0) {
          this.invoiceList.forEach((item, index) => {
            if (item.isSec) {
              money += Number(item.FeePayment)
            }
          })
        }
        return money.toFixed(2) || 0
      }
    },
    activated() {
      this.$store.dispatch('setMask', false)
    },
    watch: {
      listStatus(val) {
        switch (val) {
          case 1:
            break;
          case 2:
            break;
          default:
            break;
        }
      }
    },
    mounted() {
      // 发票历史的头部
      this.$store.dispatch('setInvoiceHeader', true)
      this.$store.dispatch('setMask', false)
      this.getInvoiceList()
    },
    methods: {
      getInvoiceList() {
        this.$http.get('/v1/invoice/uninvoiceoilcardorderlist?access_token=' + this.access_token, {}).then(data => {
          console.log(data)
          if (data.error) {
            if (data.error.code != 401) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else {
            if (data.length > 0) {
              data.forEach((item) => {
                this.$set(item, 'isSec', false)
              })
            }
            this.invoiceList = data
            console.log(this.invoiceList)
            if (this.invoiceList.length <= 0) {
              this.hasData = false
            } else {
              this.hasData = true
            }
          }
        })
      },
      // 点击选择
      selectItem(index) {
        this.invoiceList[index].isSec = !this.invoiceList[index].isSec
        let isNotAll = this.invoiceList.find((item, index) => {
          return !item.isSec
        })
        // 数组中是否存在没有选的 如果 isNotAll 是undefined 表示全选了
        if (isNotAll == undefined) {
          this.isSecAll = true
        } else {
          this.isSecAll = false
        }
      },
      // 点击全选
      seclectAll() {
        if (this.isSecAll) {
          this.isSecAll = false
          this.invoiceList.forEach((item, index) => {
            item.isSec = false
          })
          return false
        }
        this.isSecAll = true
        this.invoiceList.forEach((item, index) => {
          item.isSec = true
        })
      },
      // 确认回调事件
      confirmCallBack() {
        this.$router.push({
          name: 'detail',
          query: {
            type: this.invoiceType,
            total: this.totalMoney,
            orderStr: this.orderStr
          }
        })
        this.$store.dispatch('setMask', false)
        this.secTipShow = false

      },
      // 关闭弹窗
      closePopTip() {
        this.$store.dispatch('setMask', false)
        this.secTipShow = false
        this.slotTips = ''
      },
      // 点击确定去详情
      toDetail() {
        let hasNoSec = this.invoiceList.find((item, index) => {
          return item.isSec
        });
        this.$store.dispatch('setMask', true)
        this.secTipShow = true
        if (!hasNoSec) { // 表示没有选
          this.hasPopConfirm = false
          this.hasPopClose = true
          this.slotTips = '请选择要开发票的订单'
        } else {
          this.hasPopConfirm = true
          this.hasPopClose = false
          this.slotTips = '该订单不可退款，确定申请发票'
          let orderStr = ''
          this.invoiceList.forEach((item, index) => {
            if (item.isSec) {
              this.orderStr = orderStr + '_' + item.ID
            }
          })

        }
      }
    }
  }

</script>
<style lang="scss" scoped>
  @import '../../styles/variable.scss';

  .list-wrap {
    overflow: hidden;
    padding-bottom: Px(90);

    .list-item {
      margin-top: Px(10);
      background: #fff;
    }

    .list-item .item-top {
      overflow: hidden;
      padding: Px(15) 0;

      .item-top-left {
        position: relative;
        padding-left: Px(40);
        float: left;
      }

      .item-top-left .sec-btn {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        height: Px(40);
        width: Px(40);
        background: url('../../asset/unsec.png') no-repeat;
        background-size: Px(19) Px(19);
        background-position: center center;

        &.act {
          background: url('../../asset/sec.png') no-repeat;
          background-size: Px(20) Px(20);
          background-position: center center;
        }
      }

      .item-top-right {
        float: right;
        margin-right: Px(10);
      }

      .item-top-left>.site-name,
      .item-top-right>div {
        font-size: Px(18);
        color: #222222;
      }

      .item-top-left>p,
      .item-top-right>p {
        margin-top: Px(8);
        font-size: Px(14);
        color: #999999;
      }

      .item-top-right>div,
      .item-top-right>p {
        text-align: right;
      }
    }

    // .list-item .item-bottom {
    //   border-top: 1px solid #E9E9E9;
    //   height: Px(44);
    //   line-height: Px(44);
    //   font-size: Px(14);
    //   color: #999999;
    //   .item-bottom-left {
    //     float: left;
    //     margin-left: Px(40);
    //   }
    //   .item-bottom-right {
    //     float: right;
    //     margin-right: Px(10);
    //   }
    // }
  }

  .top-btn-box {
    margin-top: Px(41);
  }

  .orderBtnMargin {
    margin-left: Px(14);
  }

  .orderBtn {
    background-image: linear-gradient(-180deg, #FBA302 0%, #F56A01 100%);
    color: #fff;
  }

  .orderBtn:active {
    color: #fff;
  }

  .nodata {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    font-size: Px(14);
    text-align: center;
  }

  .bottom-wrap {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    background: #fff;
    padding-bottom: Px(10);

    .bottom-con {
      position: relative;
      padding-left: Px(40);
      height: Px(45);
      line-height: Px(45);

      .sec-all {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        height: Px(40);
        width: Px(40);
        background: url('../../asset/unsec.png') no-repeat;
        background-size: Px(19) Px(19);
        background-position: center center;

        &.act {
          background: url('../../asset/sec.png') no-repeat;
          background-size: Px(20) Px(20);
          background-position: center center;
        }
      }

      .sec-all-tit {
        float: left;
        font-size: Px(16);
        color: #666666;
      }

      .money {
        float: right;
        margin-right: Px(10);
        font-size: Px(14);
        color: #666666;

        span {
          color: #F56A01;
        }
      }
    }

    .confrim-btn {
      margin: 0 Px(10);
      background-image: linear-gradient(-180deg, #FBA302 0%, #F56A01 100%);
      border-radius: Px(5);
      font-size: Px(16);
      color: #FFFFFF;
      text-align: center;
      height: Px(44);
      line-height: Px(44);
    }
  }

  .slot-con {
    padding-top: Px(10);
    padding-bottom: Px(10);
  }

</style>
