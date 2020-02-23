<template>
  <div class="container">
    <tab></tab>
    <div class="ban"></div>
    <div class="swiper-container">
      <div class="order-num-wrap">
        <div class="order-num">
          <div>今日订单</div>
          <p>{{OrderCount}}</p>
        </div>
        <div class="order-num">
          <div>今日收入</div>
          <p>{{FeeTotal}}</p>
        </div>
      </div>
      <div class="list-wrap">
        <div class="bs-wrap" style="position:relative" v-if="!nodata">
          <base-scroll :data="todayList" :isNoMore='isNoMore' :isLoadMore='isLoadMore' :gotoScrollY='ifScrollTo'
            :listenScroll='true' @scrollToEnd='loadMore'  @scroll='getTopLength'>
            <div class="list-item-wrap">
              <div class="list-item" :class="(index+1)==todayList.length?'border0':''" v-for="(item,index) in todayList"
                :key="index">
                <div class="list-left fl">
                  <div class="date font10">{{item.CreateTime}}</div>
                  <div class="date font12">消费金额：<span class="gray3">{{item.FeeTotal}}元</span></div>
                  <div class="date font12" v-if="item.IsRefund == 2">退款金额：<span class="gray3">{{item.FeeRefund}}元</span></div>
                  <div class="date font12" v-if="item.IsRefund == 1 && item.Status == 2">退款金额：<span class="gray3">{{item.FeeRefund}}元</span></div>
                  <div class="date font12" v-if="item.IsRefund == 1 && item.Status == 1">申请金额：<span class="gray3">{{item.FeeRefund}}元</span></div>
                </div>
                <div class="list-right fr">
                  <div class="font10">校验码：<span class="gray3">{{item.CheckCode}}</span></div>
                  <div class="font12">收银员：<span class="gray3">{{item.Contact}}</span></div>
                  <div class="state-btn-wrap">
                    <div class="font12 state-btn act-refund" v-if="item.IsRefund == 2">已退款</div>
                    <div class="font12 state-btn act-refund" v-if="item.IsRefund == 1 && item.Status == 2">退款中</div>
                    <div class="font12 state-btn act-refuse" v-if="item.IsRefund == 1 && item.Status == 1" @click="clickOperate(item,1)">拒绝</div>
                    <div class="font12 state-btn act-agree" v-if="item.IsRefund == 1 && item.Status == 1" @click="clickAgree(item)">同意</div>
                  </div>
                </div>
              </div>
            </div>
          </base-scroll>
        </div>
        <div class="nodata" v-if="nodata">
          <img src="../../asset/nodata.png" alt="">
          <div>暂无订单</div>
        </div>
      </div>
    </div>
    <div class="mask" v-show="popshow">
      <div class="pop">
        <div class="pop-title">确认加油机显示金额</div>
        <div class="pop-number">{{popItem.FeePayment || 0.00}}</div>
        <div class="pop-tk-money">退款金额：{{popItem.FeeRefund || 0.00}}元</div>
        <div class="pop-btn-wrap">
          <div class="pop-btn agree" @click="clickOperate(popItem,0)">同意退款</div>
          <div class="pop-btn refuse" @click="cancel">取消</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Tab from '../../components/tab/index.vue'
  import BaseScroll from '../../components/BaseScroll.vue'
  export default {
    data() {
      return {
        popshow: false, // 弹窗显示隐藏
        popItem: {}, // 弹窗显示的信息
        todayList: [], // 今日订单列表
        OrderCount: 0, // 今日订单
        FeeTotal: 0, // 今日收入
        baseUrl: this.$isTest ? '//test.w.cheyuu.com' : '//w.cheyuu.com',
        PageIndex: 1, //页码从第一页开始
        PageSize: 5, //每页条数
        count: 0, // 总条数
        isLoadMore: {
          value: false
        },
        isNoMore: {
          value: false
        },
        ifScrollTo: false,
        nodata: false
      };
    },
    components: {
      BaseScroll,
      Tab
    },
    computed: {
      access_token() {
        return localStorage.getItem('access_token') || ''
      },
      userInfo() {
        var userInfo = localStorage.getItem('userinfo') || null
        return JSON.parse(userInfo)
      }
    },
    methods: {
      getTopLength(val){
        // console.log(val)
        this.topLength=val.y;
      },
      // 上拉 加载更多
      loadMore() {
        var totalPage = Math.ceil(Number(this.count) / this.PageSize)
        if (this.PageIndex >= totalPage) {
          this.isNoMore.value = true
          return false
        } else {
          this.isNoMore.value = false
          if (this.isLoadMore.value) {
            return false
          } else {
            this.isLoadMore.value = true;
            this.PageIndex++;
            this.getTodayList(true)
          }
        }
      },
      // 获取今日订单列表
      getTodayList(isPullup = false) {
        var that = this
        this.$get({
          api: '/api2/gettodayorderlistbypos?access_token=' + this.access_token,
          data: {
            page: this.PageIndex,
            pageSize: this.PageSize
          }
        }, this.baseUrl).then(({
          data
        }) => {
          // console.log(data)
          this.isNoMore.value = false;
          this.isLoadMore.value = false;
          if (data.status) {
            this.count = data.count || 0;
            if (!isPullup) { // 如果为false 表示首次加载 不用合并
              this.todayList = data.data || [];
              if(this.todayList.length == 0){
                this.nodata = true // 没数据
              } else {
                this.nodata = false // 有数据
              }
            } else {
              if (data.data && data.data.length > 0) { // 合并数据
                var list = this.todayList.concat(data.data);
                this.todayList = list
              } else { // 没更多数据了
                this.isNoMore.value = true
              }
            }
          } else {
            this.nodata = true // 没数据
            // 授权失败
            if (data.errCode == 401) {
               this.$store.dispatch('needRefresh', true)
              // localStorage.removeItem('userinfo')
              // that.$router.replace({
              //   name: 'login'
              // })
            } else {
              that.$vux.toast.show({
                type: 'warn',
                text: data.msg
              })
            }
          }
        }).catch(()=>{
          this.isNoMore.value = false
          this.isLoadMore.value = false;
        })
      },

      // 今日订单统计
      getTodayNum() {
        var that = this
        this.$get({
          api: '/api2/gettodayorderinfobypos?access_token=' + this.access_token
        }, this.baseUrl).then(({
          data
        }) => {
          // console.log(data)
          if (data.status) {
            this.OrderCount = data.data.OrderCount || 0
            this.FeeTotal = data.data.FeeTotal || 0
          } else {
            // 授权失败
            if (data.errCode == 401) {
               this.$store.dispatch('needRefresh', true)
              // localStorage.removeItem('userinfo')
              // that.$router.replace({
              //   name: 'login'
              // })
            } else {
              that.$vux.toast.show({
                type: 'warn',
                text: data.msg
              })
            }
          }
        })
      },
      // 点击同意按钮
      clickAgree(item){
        this.popshow = true
        this.popItem = item
      },
      // 弹窗里面的取消
      cancel(){
        this.popshow = false
        this.popItem = {}
      },
      // 点击弹窗里的同意 或者 弹窗外面的拒绝
      clickOperate(item,operate){
        var oper = operate // 0 同意，1 拒绝
        var id = item.ID
        this.subAdvice(id,oper) 
      },
      // 退款操作接口
      subAdvice(id, operate) {
        this.$post({
          api: '/api2/refundbycontact?access_token=' + this.access_token,
          data: {
            ID: id,
            Action: operate == 0 ? 'agree' : 'refuse'
          }
        }, this.baseUrl).then(({
          data
        }) => {
          // console.log(data)
          if (data.status) {
            this.$vux.toast.show({type:'success',text:data.msg})
            this.getTodayList()
            this.popshow = false
            this.popItem = {}
          } else {
            // 授权失败
            if (data.errCode == 401) {
              this.$store.dispatch('needRefresh', true)
              // localStorage.removeItem('userinfo')
              // this.$router.replace({
              //   name: 'login'
              // })
            } else {
              this.$vux.toast.show({
                type: 'warn',
                text: data.msg
              })
            }
          }
        })
      }
    },
    mounted() {
      this.getTodayNum()
      this.getTodayList()
    }
  };

</script>
<style lang="scss" scoped>
  @import "../../styles/variable.scss";

  .ban {
    margin-top: Px(41);
    height: Px(100);
    background-image: linear-gradient(0deg, #4db7fd 36%, #8cb5fd 100%);
  }

  .order-num-wrap {
    margin: 0 Px(20);
    background: #fff;
    display: flex;
    height: Px(80);
    border: 1px solid #eaeaea;
    box-shadow: 0 Px(2) Px(8) 0 rgba(0, 0, 0, 0.08);
    border-radius: Px(8);

    .order-num {
      flex: 1;
      text-align: center;

      div {
        margin-top: Px(15);
        font-size: Px(18);
        color: #222222;
      }

      p {
        margin-top: Px(10);
        font-size: Px(14);
        color: #666666;
      }
    }
  }

  .swiper-container {
    position: relative;
    top: Px(-20);
  }

  .bs-wrap {
    overflow: hidden;
    height: Px(320)
  }

  .list-wrap {
    margin: Px(20);
    box-sizing: border-box;
    padding: 0 Px(10);
    border: 1px solid #eaeaea;
    box-shadow: 0 Px(2) Px(8) 0 rgba(0, 0, 0, 0.08);
    border-radius: Px(8);
    .list-item-wrap {
      // padding-bottom:Px(20);
      min-height: Px(300);
    }

    .list-item {
      overflow: hidden;
      font-size: Px(12);
      color: #666666;
      box-sizing: border-box;
      padding: Px(10);
      border-bottom: 1px solid #eeeeee;

      .list-left {
        overflow: hidden;
        width: Px(180);
      }

      .list-right {
        overflow: hidden;
        width: Px(110);
      }

      .date {
        width: 100%;
      }
    }
  }

  .list-wrap .list-item {
    .list-right div {
      float: right;
    }

    .list-left div {
      float: left;
    }
  }

  .font10 {
    font-size: Px(10);
    color: #999999;
  }

  .font12 {
    margin-top: Px(10);
    font-size: Px(12);
    color: #666666;
  }

  .gray3 {
    color: #333 !important;
  }

  .state-btn {
    height: Px(16);
    width: Px(50);
    border-radius: Px(20);
    text-align: center;
    line-height: Px(16);
    font-size: Px(12);
    color: #fff;
  }

  .act-refund {
    background: #ff5f4e;
  }

  .act-agree {
    background: #48b7fd;
  }

  .act-refuse {
    margin-left: Px(10);
    background: #d8d8d8;
  }

  .fr {
    float: right;
  }

  .fl {
    float: left;
  }

  .border0 {
    border: 0 !important;
  }

  .mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.2);
    z-index: 5;

    .pop {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #FFFFFF;
      border-radius: Px(8);
      width: Px(275);
      text-align: center;

      .pop-title {
        margin-top: Px(24);
        font-size: Px(18);
        color: #999999;
      }

      .pop-number {
        margin-top: Px(10);
        font-size: Px(40);
        color: #333333;
      }

      .pop-tk-money {
        margin-top: Px(15);
        font-size: Px(18);
        color: #FF5F4E;
      }

      .pop-btn-wrap {
        margin-top: Px(25);
        display: flex;
        border-top: 1px solid #EEEEEE;
      }

      .pop-btn-wrap .pop-btn {
        flex: 1;
        box-sizing: border-box;
        height: Px(50);
        line-height: Px(50);
        font-size: Px(18);

        &.agree {
          color: #48B7FD;
          border-right: 1px solid #EEEEEE;
        }

        &.refuse {
          color: #666666;
        }
      }
    }
  }
.nodata {
  padding: Px(70) 0;
  img {
    display: block;
    margin: 0 auto;
  }
  div {
    margin-top: Px(10);
    text-align:center;
    font-size: Px(14);
    color: #ccc;
  }
}
</style>
