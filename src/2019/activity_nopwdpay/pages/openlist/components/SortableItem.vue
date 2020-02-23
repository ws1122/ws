<template>
  <li class="ul-li">
    <!-- <slide-delete> -->
      <div class="board-item" @touchstart="touchStart" @touchend="touchEnd">
        <div class="bank-left">
          <div class="bank-ico"><img :src="item.Icon" alt=""></div>
          <div class="bank-name">
            <div>{{item.Name}}</div>
            <div class="count-tip" v-show="item.count != ''">{{item.Description}}</div>
          </div>
        </div>
        <div class="bank-right">
          <div class="status">{{item.Status==1?'已开通':'未开通' }}</div>
          <div class="endnum" v-show="item.endnum != ''">尾号{{item.BankCard}}</div>
          <x-switch  title='' @on-change="toOpen" v-model="item.Status==1"></x-switch>
        </div>
      </div>
    <!-- </slide-delete> -->
  </li>
</template>
<script>
 import { XSwitch} from 'vux'
  import {ElementMixin} from 'vue-slicksort';
  import  slideDelete from './slideDelete.vue'
  export default {
    mixins: [ElementMixin],
    props: {
      item: {
        type: Object,
        default: ()=>{}
      },
      index: {
        type: Number,
        default: 0
      }
    },
    components: {
      slideDelete,
      XSwitch,
    },
    computed: {
      
    },
    methods: {
      toOpen(e){
        this.$emit('toOpenCard', {switch:e,index:this.index})
      },
      touchStart(e){
        // console.log('start=',e)
      },
      touchEnd(e){
        // console.log('end=',e)
      },
      ischange(e){
        // console.log(99999,e)
      }
    },

  }

</script>
<style lang="scss" scoped>
@import '../../../styles/variable.scss';
  .ul-li:not(:nth-of-type(-1)){
    overflow: hidden;
    margin-bottom: Px(20);
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
        .count-tip {
          box-sizing: border-box;
          padding: Px(2) Px(10);
          margin-top: Px(10);
          border: 1px solid #F77E23;
          border-radius: Px(10);
          font-size: Px(24);
          color: #F77E23;
        }
      }
    }
    .bank-right {
      display: flex;
      flex-direction: column;
      align-items: center;
      .status {
        width: Px(188);
        text-align: center;
        font-size: Px(30);
        color: #333333;
        font-weight: 600;
      }
      .endnum {
        width: Px(188);
        text-align: center;
        margin-top: Px(2);
        margin-bottom: Px(10);
        font-size: Px(24);
        color: #999999;
      }
      .operatebtn {
        width: Px(188);
        padding: Px(14) 0;
        text-align: center;
        font-size: Px(32);
        color: #FFFFFF;
        background: #F56A01;
        border-radius: Px(40);
      }
    }
  }
/deep/ .weui-switch:checked, .weui-switch-cp__input:checked ~ .weui-switch-cp__box{
  border-color:#F77E23;
  background-color: #F77E23;
}
   

</style>

