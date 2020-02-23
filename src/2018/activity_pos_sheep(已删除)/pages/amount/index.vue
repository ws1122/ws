<template>
    <div>
        <div class="input-wrap">
            <input type="text" v-model="money" placeholder="请输入金额…">
            <div class="clear" @click="clearText">
                <img src="../../asset/clear.png">
            </div>
        </div>
        <div class="btn-wrap">
           <div class="sure-btn" @click="certain">确认</div>
           <div class="sure-btn bggray" @click="goback">返回</div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            money: ''
        }
    },
    watch:{
      money(val, oldval) {
        if (isNaN(Number(val))) {
          this.money = oldval
        }
      },
    },
    methods: {
        // 清除输入框文字
        clearText(){
            this.money = ''
        },
        // 点击确定
        certain(){
            if(this.money == ''){
                this.$vux.toast.show({type: 'warn',text: '金额不能为空！'})
                return false
            }
            this.$router.push({name:'pay',query:{money:this.money}})
        },
        // 回首页
        goback(){
            history.go(-1)
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../styles/variable.scss';
.input-wrap {
    margin: Px(144) auto 0;
    overflow: hidden;
    width: Px(314);
    position: relative;
    padding-bottom: Px(10);
    .clear {
        position: absolute;
        right: 0;
        top: 0;
        width: Px(54);
        height: Px(40);
        img {
            display: block;
            width: Px(20);
            margin: Px(13) auto;
        }
    }
}
input {
    display: block;
    box-sizing: border-box;
    padding-left: Px(20);
    padding-right: Px(60);
    height: Px(40);
    width: Px(314);
    outline: none;
    border: 0;
    box-shadow: none;
    font-size: Px(14);
    color: #333;
    border: 1px solid #eaeaea;
    box-shadow: 0 Px(2) Px(8) 0 rgba(0,0,0,0.08);
    border-radius: Px(40);
}
input::-webkit-input-placeholder { /* WebKit, Blink, Edge */
    font-size: Px(14);
}
input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    font-size: Px(14);
}
input::-moz-placeholder { /* Mozilla Firefox 19+ */
    font-size: Px(14);
}
input:-ms-input-placeholder { /* Internet Explorer 10-11 */
    font-size: Px(14);
}
.btn-wrap {
    margin: Px(120) Px(30) 0;
    display: flex;
}
.sure-btn {
    flex: 1;
    height: Px(40);
    width: Px(190);
    line-height: Px(40);
    color: #fff;
    text-align: center;
    background-image: linear-gradient(90deg, #45B7FD 0%, #96B5FD 100%);
    border-radius: Px(40);
}
.sure-btn:nth-of-type(1){
    margin-right: Px(20);
}
.bggray {
    background: #DBD8D8;
}
</style>


