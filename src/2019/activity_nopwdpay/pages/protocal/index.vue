<template>
  <div>
    <div class="title">车牌付使用条款</div>
    <div class="pro-item">
      <div>尊敬的用户：</div>
      <div>客户在使用（车牌付）无感支付时，应遵循以下说明及条例：</div>
      <div class="item">1.（车牌付）根据车牌号码进行识别扣款，请您务必保证车牌的真实性。以免给您或者他人带来不便；</div>
      <div class="item">2.在无感支付过程中，如果因为误扣款或套牌车等情况造成您的财产损失我们将无条件退款；</div>
      <div class="item">3.在车辆进入油站后，我们会识别到您的车牌并推送结算信息给您；</div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        
      }
    }
  }
</script>
<style lang="scss" scoped>
 @import '../../styles/variable.scss';
 .title {
   padding: Px(30) Px(20);
   text-align: center;
   font-size: Px(36);
   color: #F56A01;
 }
 .pro-item {
    padding: 0 Px(40);
    font-size: Px(32);
    color: #666666;
    .item {
      margin-top: Px(40);
    }
 }
</style>

