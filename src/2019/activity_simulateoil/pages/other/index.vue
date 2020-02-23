<template>
  <div class="main">
    <div class="main-top">
      <div class="top">
        <div class="tops">
          <div class="top-left">
            <div class="money">金额</div>
            <div class="unit">元</div>
          </div>
          <div class="top-right">
            <div class="nums" v-for="item in 7" :key='item'></div>
            <div class="number" ref="number"></div>
          </div>
        </div>
        <div class="tops">
          <div class="top-left">
            <div class="money">油量</div>
            <div class="unit">升</div>
          </div>
          <div class="top-right">
            <div class="nums" v-for="(item,index) in 7" :key='index'></div>
            <div class="oilmass" ref="oilmass"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="main-foot main-top">
      <div class="top">
        <div class="tops">
          <div class="top-left">
            <div class="money">今日油价</div>
            <div class="unit">元</div>
          </div>
          <div class="top-right oilprice ">
            <div class="nums numss" v-for="(item,index) in oilnum" :key='index'>{{item}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="foot">
      <mybutton @todo="submit" title="完成"></mybutton>
    </div>

  </div>
</template>
<script>
  import Digit from '../../action/number.js'
  import mybutton from '../componnents/button';
  export default {
    data() {
      return {
        oilnum: ['0', '6', '.', '7', '3'],
        baseUrl: this.$isTest ? 'https://test.w.cheyuu.com' : 'https://w.cheyuu.com',
        oilmass: ''
      }
    },
    computed: {
      money() {
        return this.$route.query.money
      },
      partnerID() {
        return this.$route.query.partnerID
      },
      cardNo() {
        return this.$route.query.cardNo
      }
    },
    components: {
      mybutton
    },
    mounted() {
      this.oilmass = (this.money / 6.73).toFixed(2);
      let price = (this.money / 1).toFixed(2);
      this.$nextTick(() => {
        this.init(this.$refs.number, price)
        this.init(this.$refs.oilmass, this.oilmass)
      })
    },
    methods: {
      submit() {
        this.gettestSinopecsync()

      },
      init(dom, number) {
        var digit = new Digit({
          number: number, // 到达指定数值停止滚动
          finish: 5, // 整体完成时间
          speed: 1, // 数值越大，越多数字同时进行翻滚，取值范围（1 ~ 10）
          direction: 'right', // 动画方向
          dom: dom // 在指定dom节点插入动画
        })
        digit.render() // 执行
      },
      gettestSinopecsync() {
        this.$http.post('/test/testSinopecsync', {
          feeTotal: Number(this.money * 100),
          partnerID: this.partnerID,
          cardNo: this.cardNo
        }, this.baseUrl, false).then(data => {
            if (!data.status) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            } else {
              // 请求成功
              // this.actions = data
              this.$router.push({
                  name: 'finish',
                  query: {
                    money: this.money,
                    oilmass: this.oilmass

                  }

                },


              )
            }
          }

        )


      }

    }
  }

</script>
<style lang="scss" scoped>
  @import '../../styles/variable.scss';

  .main {
    width: 100%;
    padding: Px(40) Px(40);
    box-sizing: border-box;

    .main-top {
      width: 100%;
      padding: Px(16);
      height: Px(400);
      box-sizing: border-box;
      background-image: linear-gradient(-180deg, #82C9F8 2%, #C0DFF7 100%);
      border-radius: Px(16);
      overflow: hidden;
    }

  }

  .numss {
    font-size: Px(40);
    //  margin: Px(-18) Px(4) !important;
    text-align: center;
    line-height: Px(80);
    color: #000;

  }

  .number,
  .oilmass {
    width: Px(470);
    font-size: Px(40);
    text-align: right;
    color: #000;
    position: absolute;
    top: Px(32);
    left: Px(6);
  }

  .top {
    padding: Px(40) Px(30) 0;
    box-sizing: border-box;
    background-image: linear-gradient(-180deg, #99D5FF 0%, #C0DFF7 100%);
    border-radius: Px(12);

    .tops {
      display: flex;
      padding-bottom: Px(40);

      .top-left {
        flex: 1;
        height: Px(130);
        text-align: center;
        color: #000;
        padding-bottom: 0;

        .money {
          padding-top: Px(50);
          font-size: Px(30);
        }

        .unit {
          font-size: Px(24);
        }
      }

      .top-right {
        position: relative;
        width: Px(470);
        padding: Px(18) Px(10) Px(18) Px(15);
        box-sizing: border-box;
        height: Px(130);
        background-image: linear-gradient(0deg, #8DC7FF 0%, #70BCFB 100%);
        box-shadow: inset 0 1px 3px 0 #60ABF6;
        border-radius: Px(10);

        .nums {
          display: inline-block;
          text-align: center;
          margin: 0 Px(4);
          width: Px(46);
          height: Px(86);
          background-image: linear-gradient(-180deg, #B3DDFB 0%, #FFFFFF 31%, #FFFFFF 70%, #BDE1FD 100%);
          border: 2px solid #60A5EF;
          border-radius: 1px;

        }
      }
    }
  }

  .main-foot {
    margin-top: Px(20);
    height: Px(230) !important;
  }

  .oilprice {
    width: Px(345) !important;
    position: relative;
  }

  // .oilprice .mumss:first-child{
  //  // margin-top: Px(10)!important;
  // }

  .foot {
    margin-top: Px(80)
  }

</style>
<style>
  .to__led-number {
    /* margin-right: 7px; */
    letter-spacing: 12px;
    display: inline-block;
    vertical-align: middle;
    box-sizing: border-box;
  }

  .to__led-number--no {
    width: 19px;
    background: unset;
    border: none;
    margin-right: 11px;
    /* display: none; */
  }


  @media screen and (max-width: 350px) {
    .to__led-number {
      letter-spacing: 16px;

    }

  }

  @media screen and (min-width:360px) and (max-width:374px) {
    .to__led-number {
      letter-spacing: 19px;
    }

  }

  @media screen and (min-width:374px) and (max-width:400px) {
    .to__led-number {
      letter-spacing: 22px;


    }

  }

  @media screen and (min-width:380px) and (max-width:415px) {
    .to__led-number {
      letter-spacing: 24px;

    }
  }

</style>
