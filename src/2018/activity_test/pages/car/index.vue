<template>
    <div class="container">
        <div class="num-wrap">
            <div :class="['num',secIndex == indexnum ? 'actitem':'']" 
                v-for="(item,indexnum) in carNum" 
                :key="indexnum" 
                @click="secPosInput(indexnum)"
            >{{item}}</div>
        </div>
        <div :class="['confirmbtn',isCanConfirm?'actbtn':'']" @click="doConfirm">确定</div>
        <div class="keyboard" v-show="showKeyboard">
            <header class="pkey-header2">
                <label class="pkey-okbtn" @click="complete">完成</label>
            </header>
            <section class="pkey-keyscontain">
                <ul>
                    <li v-show="txtboardshow">
                        <div class="li-wrap" v-for="(item,index) in cartxt" :key="index">
                            <div v-if="index==(cartxt.length-1)" @click="changeKey">ABC</div>
                            <label v-for="(items,indexi) in item" :key="indexi" @click="txtclick(items,indexi)">{{items}}</label>
                            <div v-if="index==(cartxt.length-1)" @click="deleteCon">
                                <img class="delico" src="./images/del.png"/>
                            </div>
                        </div>
                    </li>
                    <li v-show="numboardshow">
                        <div :class="['li-wrap',index == 2 ? 'extra-padding':'']" v-for="(item,index) in numtxt" :key="index">
                            <div v-if="index==(cartxt.length-1)" @click="changeKey">省份</div>
                            <label v-for="(items,indexi) in item" :key="indexi" @click="numclick(items,indexi)">{{items}}</label>
                            <div v-if="index==(cartxt.length-1)" @click="deleteCon">
                                <img class="delico" src="./images/del.png"/>
                            </div>
                        </div>
                    </li>
                </ul>
            </section>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            showKeyboard: true, // 整个键盘的显示隐藏
            carNum:['','','','','','',''], // 输入的结果数组
            secIndex: 0, // 选择输入的位置下标
            cartxt:[
                ['京','津','渝','沪','冀','晋','辽','吉','黑','苏'],
                ['浙','皖','闽','赣','鲁','豫','鄂','湘','粤','琼'],
                ['川','贵','云','陕','甘','青','蒙','桂','宁','新'],
                ['藏','使','领','警','学','港','澳']
            ],
            numtxt:[
                ['1','2','3','4','5','6','7','8','9','0'],
                ['Q','W','E','R','T','Y','U','I','O','P'],
                ['A','S','D','F','G','H','J','K','L'],
                ['Z','X','C','V','B','N','M']
            ],
            txtboardshow:true, // 文字键盘
            numboardshow:false, // 数字字母键盘
            carStr: '' // 最终车牌号
        }
    },
    computed: {
        // 确定按钮能否点击
        isCanConfirm(){
            // 如果carNum有空的就不能点
            let iscanclick = this.carNum.find((item)=>{return item == ''})
            if(iscanclick == undefined) {
                return true
            } else {
                return false
            }
        }
    },
    methods: {
        // 确定按钮
        doConfirm(){
            console.log(this.$vux)
            if(!this.isCanConfirm) {
                return false
            }
            console.log(this.carNum)
            let carStr = ''
            this.carNum.forEach((item,index)=>{
               carStr = carStr + item
            })
            this.carStr = carStr
            console.log(this.carStr)
            if(!(/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[警京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{0,1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}[A-Z0-9]{0,1}[A-Z0-9]{0,1}$/.test(this.carStr))){
              // 车牌号格式不正确
              this.$vux.toast.show({
                  type: 'warn',
                  text: '车牌号格式不正确'
              })
              return false
            }
            // do submit this.carStr
        },
        // 点击完成，关闭键盘
        complete(){
            this.showKeyboard = false
        },
        // 切换文字和字母
        changeKey(){
            this.txtboardshow = !this.txtboardshow
            this.numboardshow = !this.numboardshow
        },
        // 选择哪个div输入，显示键盘
        // 如果是第0个，显示文字键盘，
        // 如果不是第0个 就是显示ABC键盘
        secPosInput(index){
            this.showKeyboard = true
            this.secIndex = index // 边框高亮，并且在此处开始输入
            if(index==0) { // 显示文字键盘
               this.txtboardshow = true
               this.numboardshow = false
            } else { // 显示ABC键盘
               this.txtboardshow = false
               this.numboardshow = true 
            }   
        },
        // 点击数字输入内容到对应位置
        numclick(items,indexi){
            console.log(items,indexi,length)
            // this.carNum[this.secIndex] = items // 不能直接赋值，要用set
            this.$set(this.carNum,this.secIndex,items)
            if(this.secIndex < 6){
                this.secIndex ++
                this.txtboardshow = false
                this.numboardshow = true 
            }
        },
        // 点击文字输入
        txtclick(items,indexi){
            this.$set(this.carNum,this.secIndex,items)
            if(this.secIndex < 6){// 显示数字键盘
                this.secIndex ++
                this.txtboardshow = false
                this.numboardshow = true 
            }
        },
        // 回撤删除
        deleteCon(){
            this.$set(this.carNum,this.secIndex,'')
            if(this.secIndex > 0){ // 显示数字键盘
                this.secIndex --
                this.txtboardshow = false
                this.numboardshow = true 
            } else { // 等于0时 显示文字键盘
               this.txtboardshow = true
               this.numboardshow = false  
            }
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
.num-wrap {
    margin-top: Px(80);
    width: 100%;
    box-sizing: border-box;
    padding-left: Px(32);
    padding-right:Px(32);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .num {
        box-sizing: border-box;
        width: Px(70);
        height: Px(84);
        line-height: Px(84);
        text-align: center;
        background: #FFFFFF;
        border: 1px solid #FFFFFF;
        border-radius: Px(6);
    }
    .num:nth-of-type(3){
        margin-left: Px(30);
    }
}
.confirmbtn {
    margin-top: Px(100);
    margin-left: Px(20);
    margin-right: Px(20);
    height: Px(88);
    text-align: center;
    line-height: Px(88);
    border-radius: Px(10);
    background: #999999;
    color: #ffffff;
    font-size: Px(32);
}
.actbtn {
    background: #F88602;
}
.actitem {
    border-color:#F88602!important;
}
.keyboard {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
}
.pkey-header2 {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    background: #F1EFED;
    .pkey-okbtn {
        height: Px(70);
        line-height: Px(70);
        color: #8BB0C5;
        padding: 0 Px(30);
    }
}
.pkey-keyscontain {
    box-sizing: border-box;
    padding: Px(10) Px(10) Px(20);
    background: #D3D3DD;
    ul {
        overflow: hidden;
        .li-wrap {
            box-sizing: border-box;
            overflow: hidden;
            display: flex;
            justify-content: space-between;
            margin-top: Px(14);
            label {
                display: inline-block;
                width: Px(60);
                height: Px(84);
                background: #FFFFFF;
                text-align: center;
                line-height: Px(84);
                border-radius: Px(6);
            }
            div {
                position: relative;
                display: inline-block;
                height: Px(84);
                width: Px(84);
                background: #ACB2C2;
                text-align: center;
                line-height: Px(84);
                border-radius: Px(6);
                .delico {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%,-50%);
                    display:block;
                    width: Px(44);
                }
            }
            label:active {
                background: #eeeeee; 
            }
        }
    }
}
.extra-padding {
    padding-left: 21px;
    padding-right: 21px;
}
</style>


