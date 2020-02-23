<template>
  <div class="container">
      <div class="qrcode-wrap">
        <qrcode :size="size" :value="qrvalue"></qrcode>
      </div>
      <div class="tip">微信扫描二维码完成支付</div>
      <div class="back-home" @click="gobackHome">返回首页</div>
  </div>
</template>

<script>
import { Qrcode } from 'vux'
  export default {
    data() {
      return {
        qrvalue: '',
        baseUrl: this.$isTest ? '//test.m.cheyuu.com' : '//m.cheyuu.com',
        websock: null,
        scoketUrl:'ws://120.25.217.150:8888'
      }
    },
    computed:{
      size(){
        return (document.body.clientWidth * 2 / 750 * 195)
      },
      userInfo(){
        var userInfo =  localStorage.getItem('userinfo') || null
        return JSON.parse(userInfo)
      },
      dp(){ // money化成 分
       return Number(this.$route.query.money) * 100
      }
    },
    components:{
      Qrcode
    },
    created() {
      this.initWebSocket();
    },
    destroyed() {
      this.websock.close() //离开路由之后断开websocket连接
    },
    mounted(){
      this.$nextTick(()=>{
       this.qrvalue = this.baseUrl + '/pay/index.html?scene=JY&quickpay=15&partnerID='+ this.userInfo.PartnerID +'&cd='+ this.userInfo.ContactID +'&dp=' + this.dp
      //  console.log(this.qrvalue)
      })
    },
    methods: {
      gobackHome(){
        this.$router.replace({name:'index'})
      },
      initWebSocket(){ //初始化weosocket
        this.websock = new WebSocket(this.scoketUrl);
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        this.websock.onclose = this.websocketclose;
      },
      websocketonopen(){ //连接建立之后执行send方法发送数据
        console.log('连接服务')
        var uid = JSON.parse(localStorage.getItem('userinfo')).PartnerID
        var data = {uid:uid};
        console.log(data)
        this.websocketsend(JSON.stringify(data));
      },
      websocketonerror(){//连接建立失败重连
        this.initWebSocket();
      },
      websocketonmessage(e){ //数据接收
        console.log('数据接收:',e.data);
        const redata = JSON.parse(e.data);
        console.log(redata)
        if(redata.status){
          this.$router.push({
            name: 'success',
            query: {
              CheckCode:redata.msg.CheckCode,
              FeeTotal:redata.msg.FeeTotal,
              CreateTime:redata.msg.CreateTime
            }
          })
        }
      },
      websocketsend(Data){//数据发送
        this.websock.send(Data);
      },
      websocketclose(e){  //关闭
        console.log('断开连接',e);
      }
    }
  }
</script>
<style lang="scss" scoped>
@import '../../styles/variable.scss';
.qrcode-wrap {
    overflow: hidden;
    text-align:center;
    margin: Px(140) auto 0;
}
.tip {
    margin: Px(25) auto Px(42);
    font-size: Px(20);
    color: #222222;
    text-align: center;
}
.back-home {
    margin: 0 auto;
    background: #DBD8D8;
    border-radius: Px(40);
    height: Px(40);
    color: #fff;
    line-height: Px(40);
    text-align: center;
    width: Px(190);
}
</style>

