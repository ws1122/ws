<template>
  <div class="container">
    <div class="wrap">
      <img src="../../assets/suc.png" alt="">
      <p>加油券已核销</p>
    </div>
    <!-- <img class="ban" @click="toActive" src="../../assets/banner.jpg" alt=""> -->
  </div>
</template>
<script>
  export default {
    data() {
      return {
  
      }
    },
    methods: {
      toActive() {
        this.$router.push({name: 'active'})
      }
    }
  }
</script>
<style lang="scss" scoped>
 @import '../../styles/variable.scss';
 .container {
   position: relative;
   overflow: hidden;
   min-height: 100vh;
   width: 100%;
   background: #F5F5F5;
 }
 .wrap {
   overflow: hidden;
   margin: Px(20);
   background: #fff;
   height: Px(516);
   border-radius: Px(6);
   img {
     display: block;
     margin: Px(140) auto 0;
     width: Px(84);
   }
   p {
     margin-top: Px(30);
     font-size: Px(32);
     color: #333333;
     text-align: center;
   }
 }
 .ban {
   display: block;
   margin: 0 auto;
   width: Px(710);
   border-radius: Px(6);
 }
</style>

