<template>
  <div class="masks">
    <div class="pop">
      <div class="pop-top">
        <div class="pop-tit">
          <slot name="poptit"></slot>
        </div>
        <div class="pop-con">
          <slot name="popcon"></slot>
        </div>
      </div>
      <div class="pop-bot">
        <div class="pop-btn" v-if="!onebtn" @click="closePop">取消</div>
        <div class="pop-btn org" @click="todo">{{rightBtnTxt}}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props:{
    onebtn:{
      type: Boolean,
      default: false
    },
    rightTxt: {
      type: String,
      default: '' 
    }
  },
  computed:{
    rightBtnTxt(){
      if(this.rightTxt == ''){
        return '确认'
      } else {
        return this.rightTxt
      }
    }
  },
  data(){
    return {

    }
  },
  mounted(){
    console.log(this.onebtn)
  },
  methods: {
    closePop(){
      this.$emit('cancelBtn')
    },
    todo(){
      this.$emit('confirmBtn')
    }
  }
}
</script>

<style lang="scss" scoped>
 @import '../../styles/variable.scss';
.masks {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,.6);
}
.pop {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  background: #FFFFFF;
  width: Px(560);
  border-radius: Px(8);
}
.pop-top {
  padding-top: Px(50);
  padding-bottom: Px(50);
  text-align: center;
  border-bottom: Px(1) solid #E5E5E5;
}
.pop-tit {
  margin-bottom: Px(20);
  font-size: Px(36);
  color: #222222;
}
.pop-bot {
  display: flex;
}
.pop-btn {
  font-size: Px(36);
  color: #222222;
  flex: 1;
  text-align: center;
  height: Px(100);
  line-height: Px(100);
}
.org {
  color: #F56A01;
}
</style>

