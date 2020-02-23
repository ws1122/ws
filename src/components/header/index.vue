<docs>
    ## header组件调用
    ## 引入 例如个人中心页面：import vHeader from '../../components/header/index'
    ## 在页面的components里面注册 components: { vHeader }
    ## 标签调用  hasRight 表示 右边按钮有没有，hasBack 表示返回按钮有没有
    ## 右边按钮事件可配置 @rightBtnClick="事件名"
    ## title默认为route.js里面设置的title，也可slot覆盖
    ## 示例
    <v-header :hasRight="true" @rightBtnClick="rightclick">
      <div slot="title">个人中心</div>
      <div slot="rbtn">
        <img src="../../asset/clear.png" alt="">
      </div>
    </v-header>
</docs>

<template>
<div class="header-wrap">
    <div class="header">
        <div class="headbtn back" v-if="hasBack" @click="goBack">
            <img src="./images/back.png" alt="">
        </div>
        <div class="title">
            <slot name="title">{{$route.meta.title}}</slot>
        </div>
        <div class="headbtn right" v-if="hasRight" @click="bindRightBtn">
            <slot name="rbtn"></slot>
        </div>
    </div>
</div>
</template>
<script>
export default {
    data(){
        return {

        }
    },
    props: {
      // 右边按钮有没有，默认没有
      hasRight:{
        type: Boolean,
        default: false 
      },
      // 返回按钮有没有 默认有
      hasBack:{
        type: Boolean,
        default: true   
      }
    },
    computed:{
        
    },
    methods: {
        // 头部右边按钮事件 由外部传入
        bindRightBtn() {
            if(this.hasRight){
                this.$emit('rightBtnClick')
            } else {
                return false
            }
        },
        // 返回
        goBack() {
            history.go(-1)
        }
    },
    mounted(){
        // console.log(555,this.$route)
    }
}
</script>
<style lang="scss" scoped>
@import '../../styles/variable.scss';
.header-wrap {
    position: fixed;
    top: 0;
    left: 0;
    height: Px(41);
    width: 100%;
    box-sizing: border-box;
    border-bottom: Px(1) solid #eeeeee;
}
.header {
    position: relative;
    width: 100%;
    height: Px(40);
    background: #fff;
    .title {
        width: 100%;
        height: Px(40);
        line-height:Px(40);
        text-align: center;
        color: #333333;
        font-size: Px(17);
    }
    .headbtn {
        position: absolute;
        top: 0;
        width: Px(40);
        height: Px(40);
        img {
            display: block;
            margin: Px(10) auto;
            width: Px(20);
        }
        &.back {
          left: 0;
          
        }
        &.right {
          right: 0; 
        }
    }
}
</style>


