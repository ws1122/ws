<template>
    <div>
     <div class="topss">
      <img src="../../assets/img/await.png"  class="img" v-if='id==1'>
        <img src="../../assets/img/lose.png"  class="img" v-else-if='id==0||id==2'>
        <img src="../../assets/img/place.png"  class="img"  v-else>
    </div>
    <div class="main">
      <div class="title">{{id==0?'连接失效':id==1?'请稍等':'核劵失败'}}</div>
      <div class="explain">{{id==0||id==2?'请重新扫码':' 请稍等前面的车没有洗完'}}</div>
    </div>
    </div>
</template>
<script>
export default {
    data(){
      return{
      }
    },
  computed:{
    /*id为0链接失效,id为1洗车机正在工作，id为2核劵失败 ,id为3 不在指定位置*/
    id(){
      return this.$route.query.id
    }
    
  },
 mounted(){
    if(this.id==0){
     document.title = "链接失效";
    }else if(this.id==1){
       document.title = "请稍等";
    }else if(this.id==2){
      document.title = "核劵失败";
    }
 }   
}
</script>
<style lang="scss" scoped>
@import "../../styles/variable.scss";
.topss {
  margin-top: Px(300);
  width: 100%;
  img {
    width: Px(320);
    height: Px(320);
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-size: 100% 100%;
  }
}
.main {
  .title {
    margin-top: Px(40);
    text-align: center;
    color: #000;
  }
  .explain {
    font-size: Px(28);
    color: #999;
    line-height: Px(60);
    text-align: center;
    margin-top: Px(10);
  }
}
</style>


