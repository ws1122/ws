<template>
  <div class="pop-tip">
    <div class="pop-tit" v-if="hasTit">
      <slot name="poptit"></slot>
    </div>
    <div class="tip-con">
      <slot name="poptop"></slot>
    </div>
    <div class="tip-btn-wrap">
      <!-- 确定按钮 -->
      <div class="tip-btn rightborder" v-if="hasConfirm" @click="confirmBtn">
        <!-- 传入确定按钮的 文字 -->
        <slot name="leftbtn"></slot>
      </div>
      <!-- 关闭按钮 -->
      <div class="tip-btn" v-if="hasClose" @click="closePop">
        <!-- 传入关闭按钮的 文字 -->
        <slot name="popbtn"></slot>
      </div>
    </div>

  </div>
</template>
<script>
  export default {
    props: {
      hasTit: { // 弹窗标题 默认不要 
        type: Boolean,
        default: false
      },
      hasConfirm: { // 左边确定按钮 默认不要
        type: Boolean,
        default: false
      },
      hasClose: { // 右边关闭按钮 默认 要
        type: Boolean,
        default: true
      }
    },
    methods: {
      // 关闭弹窗
      closePop() {
        this.$emit('closeTank', false)
      },
      // 确定时的事件
      confirmBtn(){
        this.$emit('onConfirm')
      }
    }
  }

</script>

<style lang="scss" scoped>
  @import '../../styles/variable.scss';

  .pop-tip {
    z-index: 6;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    border-radius: Px(6);
    .pop-tit {
      text-align: center;
      font-size: Px(16);
      color: #000;
      height: Px(40);
      line-height: Px(40);
      border-bottom: 1px solid #eee;
    }
    .tip-con {
      width: Px(280);
      padding: Px(10) Px(20);
      color: #FBA302;
      font-size: Px(16);
      text-align: center;
    }
    .tip-btn-wrap {
        display: flex;
    }
    .tip-btn {
      flex: 1;
      box-sizing: border-box;
      text-align: center;
      font-size: Px(18);
      color: #2FB2BC;
      height: Px(40);
      line-height: Px(40);
      border-top: 1px solid #eee;
    }
  }
  .rightborder {
    border-right: 1px solid #eee;
}
</style>