<template>
  <div class="containers">
    <img src="../../assets/img/link.png" alt="" class="failure">
    <div>洗车券领取失败</div>
    <div  class="link">二维码过期，请联系加油员</div>
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
<style lang="scss">
  @import '../../styles/variable.scss';
  
  .containers {
    padding-top: Px(150);
    text-align: center;
    font-size: Px(36);
    color: #000;

    .failure {
      width: Px(202);
      height: Px(170);
      margin-bottom: Px(40);
    }
    div {
      padding-top:Px(20);
      line-height: Px(40);

    }
    .link{
        font-size:Px(28);
      color: #999999;
    }

  }
  

</style>

