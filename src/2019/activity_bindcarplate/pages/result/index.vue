<template>
  <div class="container">
    <img class="status" src="" alt="">
    <div class="tips">等待客服审核</div>
    <div class="extra">客服将在1个工作日内审核完成</div>
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
.container {
    overflow: hidden;
    min-height: 100vh;
    background: #F6F6F6;
}
.status {
  display: block;
  margin-top: Px(100);
  width: Px(186);
}
.tips {
  
  margin-top: Px(50);
  text-align: center;
  font-size: Px(40);
  color: #222222;
}
.extra {
  margin-top: Px(30);
  text-align: center;
  font-size: Px(28);
  color: #888888;
}
</style>


