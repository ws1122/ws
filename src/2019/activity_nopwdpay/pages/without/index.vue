<template>
    <div class="container">
    <li class="ul-li" v-for="(item,index) in list" :key="index">
      <div class="board-item">
        <div class="bank-left">
          <div class="bank-ico"><img src="./images/ico-gs.png" alt=""></div>
          <div class="bank-name">
            <div>工商银行</div>
          </div>
        </div>
        <div class="bank-right" >
          <div class="status">已开通</div>
          <div class="endnum" >尾号3699</div>
        </div>
      </div>
      
        <input  type="number" class="cardInput" v-model="cardNumShow" @keyup="showNum" @blur="chargeNum" ref="cardInput">
   
  </li>

  </div>
</template>
<script>
import { XSwitch, Group, Cell } from 'vux'
export default {
    data(){
        return{
           list: [{}, {}, {}, {}],
           value1: true,
           cardNum: '', // 银行卡-传给后台去空格
           cardNumShow: '' 
      // value2: false,
      // stringValue: '0',

        }
    },
  components: {
      XSwitch,
  },
   methods:{
       showNum () {
      let cInput = this.$refs.cardInput
      if (cInput.selectionStart < this.cardNumShow.length) {
        return
      }
      this.cardNumShow = this.cardNumShow.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
      this.cardNum = this.cardNumShow.replace(/\s/g, '')
    },
    chargeNum () {
      this.cardNumShow = this.cardNumShow.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
      this.cardNum = this.cardNumShow.replace(/\s/g, '')
    },

   },

}
</script>
<style lang="scss" scoped>
@import '../../styles/variable.scss';
  .ul-li:not(:nth-of-type(-1)){
    overflow: hidden;
    margin: Px(20);
    border-radius: Px(10);
  }
  .board-item {
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    padding: 0 Px(40);
    height: Px(200);
    width: 100%;
    background: #FFFFFF;
    box-shadow: 0 1px Px(20) 0 rgba(0,0,0,0.06);
    border-radius: Px(6);
    -webkit-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
    img {
      pointer-events: none;
    }
    &.act {
      box-shadow: 0 2px Px(10) 0 rgba(0,0,0,0.60);
    }
    .bank-left {
      display: flex;
      flex-direction: row;
      align-items: center;
      .bank-ico img {
        display: block;
        width: Px(100);
      }
      .bank-name {
        margin-left: Px(20);
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: Px(36);
        color: #222222;
      }
    }
    .bank-right {
      display: flex;
      flex-direction: column;
      align-items: center;
      .status {
        width: Px(188);
        text-align: center;
        font-size: Px(32);
        color: #222222;
      }
      .endnum {
        width: Px(188);
        text-align: center;
        margin-top: Px(10);
        font-size: Px(24);
        color: #999999;
      }

    }
  }
  .container{
    min-height: 100vh;
    background: #F5F5F5;
        overflow: hidden;
  }

</style>


