<template>
  <div class="history">
    <div class="nodata" v-if="!hasData">
      <span></span>
      您当前还没有开票历史
    </div>
    <div class="history-list" v-if="hasData">
      <div class="list-item" v-for="(item,index) in historyList" :key="index" @click="toHisDetail(item.ID)">
        <div class="item-row">
          <div class="fl">
            {{item.TaxPattern == 1 ? '电子': item.TaxPattern == 2 ? '纸质':''}}{{'发票-' + (item.TitleType == 1 ? '个人':'单位')}}
          </div>
          <div class="fr orgcolor">{{statusList[item.Status]}}</div>
        </div>
        <div class="item-row">
          <div class="fl">开票金额：</div>
          <div class="fr color0">￥{{item.Total}}</div>
        </div>
        <div class="item-row border0">
          <div class="fl">{{item.CreateTime}}</div>
          <div class="fr">点击查看详情</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        hasData: true,
        historyList: [],
        statusList: ['待开票', '已开票', '已邮寄', '自取', '到付', '已冲红', '专票待开票', '客服审核不通过', '财务审核不通过', '系统自动取消', '已领取自取的发票']
      }
    },
    computed: {
      access_token() {
        // return '87af08e08cb1bd8d4f9c9084219cddad6365bfc0'
        return this.$store.state.token.access_token || localStorage.getItem('access_token')
      }
    },
    methods: {
      toHisDetail(id) {
        this.$router.push({
          name: 'historydetail',
          query: {
            id: id
          }
        })
      },
      gethistoryList() {
        this.$http.get('/v1/invoice/invoicelist?access_token=' + this.access_token, {}).then(data => {
          console.log(data)
          if (data.error) {
            if (data.error.code !== 401) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else {
            this.historyList = data
            console.log(this.historyList)
            if (this.historyList.length <= 0) {
              this.hasData = false
            } else {
              this.hasData = true
            }
          }
        })
      }
    },
    mounted() {
      // 隐藏发票历史的头部
      this.$store.dispatch('setInvoiceHeader', false)
      this.gethistoryList()
    }
  }

</script>
<style lang="scss" scoped>
  @import '../../styles/variable.scss';

  .nodata {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: Px(14);
    line-height: Px(40);
    transform: translateY(-50%);

    span {
      position: relative;
      top: Px(5);
      display: inline-block;
      width: Px(20);
      height: Px(20);
      background: url('../../asset/i.png') no-repeat;
      background-size: 100% 100%;
      background-position: 0 0;
    }
  }

  .list-item {
    margin-top: Px(10);
    padding: 0 Px(10);
    background: #fff;
  }

  .list-item .item-row {
    overflow: hidden;
    font-size: Px(12);
    padding: Px(6) 0;
    color: #616161;
    border-bottom: 1px solid #eaeaea;
  }

  .fr {
    float: right;
  }

  .fl {
    float: left;
  }

  .color0 {
    color: #000;
  }

  .orgcolor {
    color: #F56A01;
  }

  .border0 {
    border: 0 !important;
  }

</style>
