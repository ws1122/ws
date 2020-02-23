<template>
  <div class="detail-container">
    <div class="ban">
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item,index) in bannerList" :key="index">
            <div class="pic-wrap" @click="showImagePreview(index)">
              <img :src="'//files.cheyuu.com/files/' + item" alt="">
            </div>
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
    </div>
    <div class="price-wrap">
      <div class="price"><span>￥</span>{{goodsInfo && goodsInfo.Price}}</div>
      <div class="price-tip">车友币抵100%</div>
    </div>
    <div class="goods-name">{{goodsInfo && goodsInfo.Title}}</div>
    <div class="num-wrap">
      <span>库存：{{goodsInfo && goodsInfo.Stock}}件</span><span class="money">运费：{{goodsInfo && goodsInfo.ExpressFee}}元</span>
    </div>
    <div class="speaker">
      <img src="./images/speak.png" alt="">
      <div>本商品暂不支持7天无理由，需要退换请联系客服</div>
    </div>
    <div class="intro-wrap" v-html="goodsInfo && goodsInfo.Detail"></div>
    <div class="bot-btn">
      <div class="btn order" @click="toMyOrder">我的订单</div>
      <div class="btn exchange" @click="clickExChange">去兑换</div>
    </div>
    <div class="bot-blank"></div>
    <transition  name="upin">
      <div class="goodspop" v-show="popShow">
        <div class="pop-top">
          <div class="pop-pic-wrap" @click="showPopImage">
            <img :src="'//files.cheyuu.com/files/' + (goodsInfo && goodsInfo.Logo)" alt="">
          </div>
          <div class="pop-goods">
            <div class="close-pop" @click="closePop">
              <img src="./images/close.png" alt="">
            </div>
            <div class="pop-goodname">{{goodsInfo && goodsInfo.Title}}</div>
            <div class="pop-restnum">库存：{{goodsInfo && goodsInfo.Stock}}件</div>
            <div class="pop-sec-color" v-show="sizeIndex != -1">已选择：{{sizelist[sizeIndex]}}</div>
            <div class="pop-sec-color" v-show="sizeIndex == -1">请选择规格</div>
          </div>
        </div>
        <div class="pop-price"><span>￥</span>{{goodsInfo && goodsInfo.Price}}</div>
        <div class="size-wrap">
          <div>规格</div>
          <div class="sizelist">
            <div class="sizeitem" :class="sizeIndex==index?'act':''" v-for="(item,index) in sizelist" :key="index" @click="secGoodsType(index)">{{item}}</div>
          </div>
        </div>
        <div class="pop-num-wrap">
          <div class="num-txt">购买数量</div>
          <div class="changenum">
            <div class="reduce" :class="num <= 1 ? 'act':''" @click="reduceNum">-</div>
            <input type="number" name=""  @blur="blur" v-model="num" id="">
            <div class="add" @click="addNum">+</div>
          </div>
        </div>
        <div class="exchange" @click="toExchange">去兑换</div>
      </div>
    </transition>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Swiper from 'swiper'
  import {ImagePreview} from 'vant';/*图片预览组件vant里面的UI框架 */
  export default {
    beforeRouteLeave (to, from, next) {
      this.$store.dispatch('setMaskShow',false)
      this.popShow = false
      setTimeout(() => {
        next()
      }, 100)
    },
    data() {
      return {
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
        goodsInfo: null,// 商品信息
        current: 0, // swip 的当前页码
        mySwiper: {},
        popShow: false, // 商品信息弹窗
        num: 1, // 弹窗选择数量
        sizeIndex: -1 // 规格（颜色）选择
      }
    },
    computed: {
      access_token(){
        return this.$store.state.token.access_token || localStorage.getItem('access_token')
      },
      goodsId(){
        return this.$route.query.id
      },
      bannerList(){
        if(this.goodsInfo && this.goodsInfo.Banner){
          return this.goodsInfo.Banner.split(',')
        } else {
          return []
        }
      },
      sizelist(){// 规格选择列表
        if(this.goodsInfo && this.goodsInfo.Attr){
          return this.goodsInfo.Attr.split(',')
        } else {
          return []
        }
      }
    },
    mounted() {
      // if(this.goodsId && this.access_token){
      this.getDetail()
      // }
      this.$store.dispatch('setMaskShow',false)
    },
    methods: {
      // 加减中间的输入框如果为空 默认为0
      blur(){
        if(this.num == ''){
          this.num = 0
        } else if(Number(this.num) < 0){
          this.num = 0
        }
      },
      // 去兑换
      toExchange(){
        if(this.sizeIndex == -1){
          this.$vux.toast.show({
            type:'warn',
            text:'请选择规格'
          })
          return false
        } 
        if(this.num <= 0) {
          this.$vux.toast.show({
            type:'warn',
            text:'数量不能小于1'
          })
          return false
        }
        if(Number(this.num)%1 != 0){
          this.$vux.toast.show({
            type:'warn',
            text:'数量不能为小数'
          })
          return false
        }
        this.$router.push({
          name:'orderConfirm',
          query:{
            id: this.goodsId,
            num: this.num,
            sizeIndex: this.sizeIndex
          }
        })
      },
      // 获取详情
      getDetail(){
        this.$http.get(`/v1/shop/goodsdetail/${this.goodsId}?access_token=${this.access_token}`, {}, this.baseUrl).then((data) => {
          console.log('detail接口：', data)
          if(data.error){

          } else {
            this.goodsInfo =  data
            this.$nextTick(() => {
              this.mySwiper = new Swiper('.swiper-container', {
                direction: 'horizontal',
                pagination: '.swiper-pagination',
                paginationType: 'fraction',
              })
            })
          }
          
        })
      },
      // 图片预览
      showImagePreview(index) {
        let that = this
        let templist = []
        this.bannerList.forEach((item,index)=>{
          item = '//files.cheyuu.com/files/' + item
          templist.push(item)
        })
        const instance = ImagePreview({
          images: templist,
          startPosition: index,
          onClose() {
            // console.log(instance.active)
            that.mySwiper.slideTo(instance.active,0)
          }
        })
      },
      // 去 我的订单
      toMyOrder(){
        this.$router.push({
          name:'myorder'
        })
      },
      // 关闭兑换弹窗
      closePop(){
        this.$store.dispatch('setMaskShow',false)
        this.popShow = false
      },
      // 弹窗图片预览
      showPopImage() {
        let templist = []
        this.bannerList.forEach((item,index)=>{
          item = '//files.cheyuu.com/files/' + item
          templist.push(item)
        })
        const instance = ImagePreview({
          images: templist
        })
      },
      // 点击 去兑换按钮 出现弹窗
      clickExChange(){
        console.log(this.$store)
        this.$store.dispatch('setMaskShow',true)
        this.popShow = true
      },
      // 点击选择规格
      secGoodsType(index){
        if(this.sizeIndex == index){
          this.sizeIndex = -1
        } else {
          this.sizeIndex = index
        }
      },
      // 增加num
      addNum(){
        if(this.num == ''){
          this.num == '0'
        }
        this.num = Number(this.num) + 1
      },
      // 减少num
      reduceNum(){
        if(this.num == ''){
          this.num == '0'
        }
        if(Number(this.num) <= 1){
          return false
        } else {
          this.num = Number(this.num) - 1
        }
      }
    }
  };

</script>

<style lang="scss" scoped>
  @import '../../styles/variable.scss';

  .ban {
    position: relative;
    overflow: hidden;
    height: Px(300);
    background: #fff;
  }

  .van-swipe {
    width: 100%;
    &-item {
      float: left;
      width: 100%;
    }
  }

  .pic-wrap {
    position: relative;
    height: Px(300);
    width: 100%;
    overflow: hidden;
    img {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      max-width: 100%;
    }
  }

  .custom-indicator {
    position: absolute;
    right: Px(15);
    bottom: Px(15);
    box-sizing: border-box;
    padding: Px(2) Px(5);
    font-size: Px(12);
    color: #999999;
    background: #FFFDFF;
    border: 1px solid #979797;
    border-radius: Px(5);
  }

  .price-wrap {
    padding: 0 Px(10);
    overflow: hidden;
    box-sizing: border-box;
    width: 100%;
    height: Px(42);
    color: #F56A01;
    border-bottom: 1px solid #E9E9E9;
    background: #fff;
    .price {
      float: left;
      font-size: Px(18);
      line-height: Px(42);
      span {
        font-size: Px(12);
      }
    }

    .price-tip {
      padding: Px(4) Px(8) Px(2);
      float: left;
      margin-top: Px(10);
      margin-left: Px(15);
      font-size: Px(12);
      background: #FFF7F2;
      border-radius: Px(10);
    }
  }

  .goods-name {
    box-sizing: border-box;
    padding: Px(10);
    font-size: Px(16);
    color: #222222;
    background: #fff;
  }

  .num-wrap {
    padding: 0 Px(10);
    font-size: Px(12);
    color: #999999;
    background: #fff;
    padding-bottom: Px(15);
    span {
      display: inline-block;
    }
    .money {
      margin-left: Px(30);
    }
  }

  .speaker {
    box-sizing: border-box;
    padding: 0 Px(10);
    background: #F4F4F4;
    font-size: Px(12);
    color: #F56A01;
    height: Px(28);
    line-height: Px(28);
    img {
      display: block;
      float: left;
      margin: Px(8) Px(6) Px(6) 0;
      width: Px(12);
    }

    div {
      float: left;
    }
  }

  .intro-wrap {
    overflow: hidden;
    background: #fff;
    padding: Px(10);
    font-size: Px(14);
    color: #222222;
    img {
      display: block;
      width: 100%;
    }
  }

  .bot-blank {
    height: Px(64);
    width: 100%;
  }

  .bot-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    overflow: hidden;
    box-sizing: border-box;
    padding: 0 Px(10);
    height: Px(64);
    width: 100%;
    background: #fff;

    .btn {
      margin-top: Px(10);
      box-sizing: border-box;
      height: Px(44);
      line-height: Px(44);
      width: Px(166);
      text-align: center;
      font-size: Px(16);
      border-radius: Px(5);

      &.order {
        float: left;
        line-height: Px(42);
        // background: #fff;
        border: Px(2) solid #F56A01;
        color: #F56A01;
      }

      &.exchange {
        float: right;
        background-image: linear-gradient(-180deg, #FBA302 0%, #F56A01 100%);
        color: #fff;
      }
    }
  }

  .swiper-slide {
    width: 100%;
    .pic-wrap {
      position: relative;
      overflow: hidden;
      width: 100%;
      height: Px(300);
      img {
        display: block;
        max-width: 100%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
      }
    }
  }

  .swiper-container {
    height: Px(300) !important;
    width: 100%;
  }

  .swiper-container-horizontal>.swiper-pagination-bullets,
  .swiper-pagination-custom,
  .swiper-pagination-fraction {
    position: absolute;
    bottom: Px(15) !important;
    // left: Px(320) !important;
    left: unset;
    right: Px(15);
    box-sizing: border-box;
    width: Px(40);
    height: Px(20);
    line-height: Px(20);
    font-size: Px(12);
    color: #999999;
    background: #FFFDFF;
    border: 1px solid #979797;
    border-radius: Px(5);
    text-align: center;
  }
.goodspop {
  overflow: hidden;
  z-index: 21;
  position: fixed;
  bottom: 0;
  left: 0;
  // height: Px(480);
  width: 100%;
  background: #fff;
}
.pop-top {
  overflow: hidden;
}
.pop-pic-wrap {
  position: relative;
  float: left;
  width: Px(100);
  height: Px(100);
  margin: Px(10);
  background: #f9f9f9;
  img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%); 
    display: block;
    max-width: Px(100);
    max-height: Px(100);
  }
}
.pop-goods {
  overflow: hidden;
  width:Px(245);
  float: left;
  .close-pop {
    position: absolute;
    right: 0;
    top: 0;
    width:Px(40);
    height: Px(40);
    img {
      display: block;
      width: Px(21);
      margin: Px(9) auto;
    }
  }
  .pop-goodname {
    overflow: hidden;
    float: right;
    width: 100%;
    padding-top: Px(40);
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: Px(16);
    color: #222222;
  }
  .pop-restnum {
    float: left;
    width: 100%;
    margin-top: Px(5);
    font-size: Px(12);
    color: #999;
  }
  .pop-sec-color {
    float: left;
    margin-top: Px(5);
    font-size: Px(12);
    color: #666;
  }
}
.pop-price {
  box-sizing: border-box;
  padding: Px(15) Px(10) Px(20);
  width: 100%;
  font-size: Px(18);
  color: #F56A01;
  span {
    font-size: Px(12);
  }
}
.size-wrap {
  overflow: hidden;
  margin: 0 Px(10);
  padding: Px(15) 0;
  font-size:  Px(14);
  color: #666666;
  border-top: 1px solid #E9E9E9;
  .sizelist {
    overflow: hidden;
    font-size: Px(12);
    color: #999999;
    .sizeitem {
      float: left;
      margin-top: Px(10);
      margin-right: Px(10);
      padding: Px(2) Px(9) Px(2);
      background: #F4F4F4;
      border-radius: Px(33);
      &.act {
        background: #F56A01;
        color: #fff;
      }
    }
  }
}
.pop-num-wrap {
  overflow: hidden;
  margin: 0 Px(10);
  padding: Px(15) 0;
  font-size:  Px(14);
  color: #666666;
  border-top: 1px solid #E9E9E9;
  .num-txt {
    float: left;
  }
  .changenum {
    overflow: hidden;
    float: right;
  }
  .changenum .add,.changenum .reduce {
    float: left;
    height: Px(32);
    line-height: Px(32);
    width: Px(39);
    text-align: center;
    border-bottom: 1px solid #999;
    border-top: 1px solid #999;
  }
  .changenum .add{
    border-right: 1px solid #999;
  }
  .changenum .reduce{
    border-left: 1px solid #999;
    &.act {
      border-color:#E9E9E9!important;
      color: #E9E9E9;
    }
  }
  .changenum input {
    float: left;
    width: Px(48);
    height: Px(32);
    border: 0;
    outline: none;
    text-align: center;
    border: 1px solid #999;
  }
}
.exchange {
  margin: Px(30) Px(10) Px(10);
  height: Px(44);
  line-height: Px(44);
  font-size: Px(16);
  color: #FFFFFF;
  text-align: center;
  background-image: linear-gradient(-180deg, #FBA302 0%, #F56A01 100%);
  border-radius: Px(5);
}
// 弹窗进入动画 upin
.upin-enter-active {
  animation: up-in .5s;
}
.upin-leave-active {
  animation: up-in .5s reverse;
}
@keyframes up-in {
  0% {
    bottom: -100%
  }
  100% {
    bottom: 0
  }
}
</style>
