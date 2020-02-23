<template>
  <div class="container">
    <div class="title">{{siteinfo && siteinfo.Title}}</div>
    <div class="item">
      <div>车牌付</div>
      <div @click="changebtn(0)"><img
          :src="carpay == 1 ? require('../index/images/btn-yes.png'): carpay == 0 ? require('../index/images/btn-no.png'):''">
      </div>
    </div>
    <div class="item" v-show="(siteinfo && siteinfo.RelationPartner) != '0'">
      <div>洗车发放加油券</div>
      <div @click="changebtn(1)"><img
          :src="washcarsend == 1 ?require('../index/images/btn-yes.png'): washcarsend == 0 ? require('../index/images/btn-no.png'):''">
      </div>
    </div>
    <div class="status-wrap">
      <div>油站状态</div>
      <div class="status-list">
        <div :class="['sta-item',statusindex==index?'act':'']" v-for="(item,index) in statuslist" :key="index"
          @click="changeStatus(index)">{{item}}</div>
      </div>
    </div>
    <div class="btn-wrap">
      <div @click="subStatus">确认提交</div>
    </div>
    <div class="popmask" v-show="popshow">
      <div class="pop">
        <div class="poptit">确认提交？</div>
        <div class="popbtn">
          <div class="left" @click="cancel">取消</div>
          <div @click="confirm">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
        statuslist: ['可用', '关闭', '维护中', '试点', '开站准备'],
        statusindex: -1,
        carpay: -1, // 车牌付
        washcarsend: -1, // 洗车发放加油券
        siteinfo: null,
        popshow: false
      }
    },
    computed: {
      access_token() {
        return this.$store.state.token.access_token || localStorage.getItem('access_token')
      },
      PID() {
        return this.$route.query.id
      }
    },
    mounted() {
      this.getSiteDetail()
    },
    methods: {
      changeStatus(index) {
        this.statusindex = index
      },
      changebtn(type) {
        if (type == 0) {
          this.carpay = this.carpay == 0 ? 1 : 0
        } else if (type == 1) {
          this.washcarsend = this.washcarsend == 0 ? 1 : this.washcarsend == 1 ? 0 : -1
        }
      },
      // 提交按钮
      subStatus() {
        this.popshow = true
      },
      cancel(){
        this.popshow = false
      },
      confirm(){
        this.subResult()
      },
      // 最终提交结果
      subResult(){
        this.$http.post('/v1/partners/partnerstatus?access_token=' + this.access_token, {
          partnerID: this.PID,
          status: Number(this.statusindex) + 1,
          nosensePay: this.carpay,
          unconsciousPay: this.washcarsend == -1 ? 0: this.washcarsend
        }, this.baseUrl).then(data => {
          console.log(data)
          if (data.error) {
            if (data.error.code != 401) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else {
            // this.getSiteDetail()
            if(data.result){
              this.popshow = false
              this.$vux.toast.show({
                type: 'success',
                text: '提交成功'
              })
            }
          }
        })
      },
      getSiteDetail() {
        this.$http.get('/v1/partners/partnerstatus?access_token=' + this.access_token, {
          PID: this.PID
        }, this.baseUrl).then(data => {
          console.log(data)
          if (data.error) {
            if (data.error.code != 401) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else {
            this.siteinfo = data
            this.statusindex = Number(data.Status) - 1
            this.carpay = data.NosensePay
            this.washcarsend = data.UnconsciousPay
            if(data.RelationPartner == '0') {
              this.washcarsend = -1
            }
          }
        })
      },
    }
  }

</script>

<style lang="scss" scoped>
  @import '../../styles/variable.scss';

  .container {
    box-sizing: border-box;
    min-height: 100vh;
    background: #F4F4F4;
    padding-bottom: Px(30);

    .title {
      height: Px(80);
      line-height: Px(80);
      padding: 0 Px(20);
    }
  }

  .item {
    background: #fff;
    padding: Px(20) Px(24);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: Px(32);
    color: #333333;
    border-bottom: 1px solid #F4F4F4;

    div>img {
      display: block;
      width: Px(110);
    }
  }

  .status-wrap {
    background: #fff;
    padding: Px(20) Px(24);
    font-size: Px(32);
    color: #333333;
    border-bottom: 1px solid #F4F4F4;

    .status-list {
      overflow: hidden;

      .sta-item {
        box-sizing: border-box;
        float: left;
        margin-right: Px(60);
        margin-top: Px(20);
        width: Px(112);
        height: Px(44);
        line-height: Px(44);
        text-align: center;
        border: 1px solid #999999;
        border-radius: Px(10);
        font-size: Px(24);
        color: #5A5A5A;

        &.act {
          background: #10AEFF;
          border: 1px solid #10AEFF;
          color: #fff;
        }
      }

      .sta-item:nth-of-type(4n + 4) {
        margin-right: 0;
      }
    }
  }

  .btn-wrap {
    padding: Px(40) 0;
    background: #fff;

    div {
      margin: 0 auto;
      width: Px(638);
      height: Px(88);
      line-height: Px(88);
      text-align: center;
      background: #10AEFF;
      border-radius: Px(10);
      font-size: Px(32);
      color: #FFFFFF;
    }
  }
 .popmask {
   position: fixed;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   background: rgba(0,0,0,.5);
   .pop {
     position: absolute;
     left: 50%;
     top: 50%;
     transform: translate(-50%,-50%);
     background: #fff;
     width: Px(560);
     border-radius: Px(30);
     .poptit {
        padding: Px(68) 0;
        font-size: Px(36);
        color: #333333;
        text-align: center;
     }
     .popbtn {
       box-sizing: border-box;
       display: flex;
       text-align: center;
       align-items: center;
       border-top: 1px solid #e9e9e9;
     }
     .popbtn div{
       flex: 1;
       height: Px(88);
       line-height: Px(88);
       font-size: Px(36);
       color: #5785FF;
     }
     .popbtn .left {
       box-sizing: border-box;
       border-right: 1px solid #e9e9e9;
       color: #999999;
     }
   }
 }
</style>
