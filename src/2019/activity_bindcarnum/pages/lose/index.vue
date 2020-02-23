<template>
  <div class="fail-wrap">
    <img class="fail-ico" src="../result/images/ico-fail.png" alt="">
    <div class="fail-tip">链接已失效</div>
  </div>
</template>
<style lang="scss" scoped>
 @import '../../styles/variable.scss';
  .fail-wrap {
    overflow: hidden;
  }
  .fail-ico {
    display: block;
    margin: Px(70) auto 0;
    width: Px(256);
  }
  .fail-tip {
    margin-top: Px(44);
    font-size: Px(36);
    color: #333333;
    text-align: center;
  }
</style>
