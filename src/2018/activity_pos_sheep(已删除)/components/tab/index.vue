<template>
<div class="tab-wrap">
    <div class="tab-item" v-for="(item,index) in tablist" :key="index" @click="clickTabItem(item)">
        <span :class="index==0?'bordright':''" >{{item.title}}</span>
    </div>
</div>
</template>
<script>
export default {
    data(){
        return {
            tablist:[{title:'收银台',name:'index'},{title:'我的订单',name:'order'}]
        }
    },
    computed:{
        
    },
    methods: {
       clickTabItem(item){
           this.$router.push({name: item.name})
       }
    }
}
</script>
<style lang="scss" scoped>
@import '../../styles/variable.scss';
.tab-wrap {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    height: Px(41);
    width: 100%;
    box-sizing: border-box;
    border-bottom: Px(1) solid #eeeeee;
    background: #fff;
    align-items:center;/*垂直居中*/
    justify-content: center;/*水平居中*/
}
.tab-item {
    box-sizing: border-box;
    flex: 1;
    span {
        display: inline-block;
        width: 100%;
        text-align: center;
    }
}
.bordright {
    border-right: 1px solid #eee; 
}
</style>


