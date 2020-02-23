<template>
  <div class="container">
    <div class="list">
      <div class="list-item  bank-top">
        <div class="item-tit">
          <div>银行卡号：</div>
          <!-- <div class="item-ico"><img src="./images/ico-gs.png" alt=""></div> -->
        </div>
        <div><input class="width1" placeholder="请输入银行卡卡号" v-model="cardNumShow" @keyup="showNum" @blur="chargeNum"
            ref="cardInput">
        </div>
      </div>
      <div class="list-item">
        <div class="item-tit">姓名：</div>
        <div><input class="width2" type="text" placeholder="请输入您的姓名" v-model="name"></div>
      </div>
      <div class="list-item">
        <div class="item-tit">性别</div>
        <div class="input-wrap">
          <div class="radio-wrap" @click="gender = true">
            <div><img :src="gender? require('../index/images/sec-yes.png'):require('../index/images/sec-no.png')"
                alt=""></div>
            <div>男</div>
          </div>
          <div class="radio-wrap marginleft" @click="gender= false">
            <div><img :src="!gender ? require('../index/images/sec-yes.png'):require('../index/images/sec-no.png')"
                alt=""></div>
            <div>女</div>
          </div>
        </div>
      </div>
      <div class="list-item">
        <div class="item-tit">身份证号码：</div>
        <div><input class="width1" type="text" placeholder="请输入您的有效证件号" v-model="IDcard"></div>
      </div>
      <div class="list-item">
        <datetime style="width:100%;height:100%" title="身份证签发日期：" placeholder="选择日期" v-model="date" :minYear=year>
        </datetime>
      </div>
      <div class="list-item">
        <popup-radio style="width:100%;" title="职业：" placeholder="选择职业" :options="options1" v-model="option1">
        </popup-radio>
      </div>
    </div>
    <div class="btn" @click="affirm">确认</div>
  </div>
</template>
<script>
  import {Datetime,PopupRadio} from 'vux'
  export default {
    beforeRouteLeave(to, from, next) {
      if (to.path == '/identity') { // 详情页跳地址时 需要把自己设置成 keep-alive
        from.meta.keepAlive = true;
      } else {
        from.meta.keepAlive = false;
      }
      next()
    },
    data() {
      return {
        gender: true,
        date: '',
        option1: '公务员',
        options1: ['公务员', '事业单位员工', '公司员工', '军人警察', '工人', '农民', '管理人员', '技术人员', '私营业主', '文体明星', '自由职业者', '学生', '无职业'],
        timer: null,
        time: 59,
        phone: '',
        iscut: false,
        name: '',
        IDcard: '',
        banknumber: '',
        cardNumShow: '',
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
        year: 1940,
      }
    },
    computed: {
      access_token() {
        return this.$store.state.token.access_token || localStorage.getItem('access_token')
      },
      option() {
        let option = null
        this.options1.forEach((item, index) => {
          if (this.option1 === item) {
            option = index + 1
          }
        })
        return option
      }
    },
    components: {
      Datetime,
      PopupRadio
    },
    mounted() {
      this.getuserinfo()
    },
    methods: {
      showNum() {
        let cInput = this.$refs.cardInput
        if (cInput.selectionStart < this.cardNumShow.length) {
          return
        }
        this.cardNumShow = this.cardNumShow.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
        this.banknumber = this.cardNumShow.replace(/\s/g, '')
      },
      chargeNum() {
        this.cardNumShow = this.cardNumShow.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
        this.banknumber = this.cardNumShow.replace(/\s/g, '')
      },
      hint(tiptext) {
        this.$vux.toast.show({
          type: 'warn',
          text: tiptext
        })

      },
      affirm() {
        var tiptext = '';
        console.log(1477,this.name)
        var sex = this.gender == true ? '1' : '2';
        if (this.banknumber == '') {
          console.log(777)
          tiptext = '银行卡号不能为空';
          this.hint(tiptext)
          return false;
        } else if (this.name== '') {
          console.log(588)
          tiptext = '姓名不能为空';
          this.hint(tiptext)
          return false;
        } else if (new RegExp(/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/).test(this .IDcard) == false) {
          tiptext = '身份证号错误';
          this.hint(tiptext)
          return false;
        } else if (this.date == '') {
          tiptext = '请选择签发日期';
          this.hint(tiptext)
          return false;
        } else if (this.option1 == '') {
          tiptext = '请选择职业';
          this.hint(tiptext)
          return false;
        }else{
          console.log(588)
        }
        let writedate = {
          banknumber: this.banknumber,
          name: this.name,
          IDcard: this.IDcard,
          date: this.date,
          profession: this.option,
          gender: sex,
        };
        writedate = JSON.stringify(writedate);
        localStorage.setItem("temp", writedate);
        this.$router.push({
          name: 'identity',
          query: {
            isbank: '1'
          }
        })

      },
      /*获取用户信息 */
      getuserinfo() {
        this.$http.post('/v1/payment/getaccount?access_token=' + this.access_token, {}, this.baseUrl).then((data) => {
          if (data.error) {
            if (data.error.code == 401) { // token失效
            } else {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else { // 请求成功
            this.name = data.cust_name||'';
            this.IDcard = data.cert_no||'';
            this.option1 = this.options1[Number(data.occupation) - 1]||''
            this.date = data.sign_date||'';
            let sex = data.gender == 1 ? true : false;
            this.gender = sex;
          }
        })
      }
    },
  }

</script>
<style lang="scss" scoped>
  @import '../../styles/variable.scss';
  .container {
    overflow: hidden;
    width: 100%;
    min-height: 100vh;
    background: #F5F5F5;
  }

  .list {
    margin-top: Px(20);

    .list-item {
      box-sizing: border-box;
      padding: 0 Px(20);
      display: flex;
      flex-direction: row;
      width: 100%;
      height: Px(100);
      align-items: center;
      justify-content: space-between;
      background: #fff;
      border-bottom: 1px solid #F5F5F5;

      .item-tit {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: Px(32);
        color: #222222;

        .item-ico img {
          position: relative;
          top: Px(2);
          display: block;
          width: Px(34);
        }
      }

      input {
        height: Px(80);
        outline: none;
        text-align: right;
        border: 0;

        &.width1 {
          width: Px(460)
        }

        &.width2 {
          width: Px(580)
        }

        &.width3 {
          width: Px(320)
        }

        &.width4 {
          width: Px(550)
        }
      }
    }

    .input-wrap {
      display: flex;
      flex-direction: row;
      align-items: center;

      .getvcode {
        box-sizing: border-box;
        margin-left: Px(20);
        height: Px(60);
        width: Px(204);
        text-align: center;
        line-height: Px(58);
        font-size: Px(28);
        color: #BFBFBF;
        border: 1px solid #BFBFBF;
        border-radius: Px(40);

        &.act {
          color: #F56A01;
          border: 1px solid #F56A01;
        }

        &.cut {
          font-size: Px(24);
        }
      }

      .radio-wrap {
        display: flex;
        flex-direction: row;
        align-items: center;

        div>img {
          display: block;
          width: Px(46);
          margin-right: Px(20);
        }

        &.marginleft {
          margin-left: Px(80);
        }
      }
    }
  }

  .btn {
    margin: Px(60) auto 0;
    width: Px(670);
    height: Px(88);
    background-image: linear-gradient(-180deg, #FBA302 0%, #F56A01 100%);
    border-radius: Px(10);
    font-size: Px(32);
    color: #FFFFFF;
    text-align: center;
    line-height: Px(88);
  }

  .bank-top {
    margin-bottom: Px(60);
  }

</style>
<style lang="scss">
  @import '../../styles/variable.scss';

  .list-item .weui-cell {
    padding: 0 !important;
    text-decoration: none;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .list-item .vux-datetime>div>p,
  .list-item .vux-cell-bd>p {
    height: Px(100);
    line-height: Px(100);
    font-size: Px(32);
    color: #222222;
  }

  .list-item .vux-datetime-value {
    box-sizing: border-box;
    padding-right: Px(32);
    background: url('./images/open.png') no-repeat;
    background-size: Px(22) Px(12);
    background-position: top Px(44) right 0;
    height: Px(100);
    line-height: Px(100);
    font-size: Px(32);
    color: #222222;
    text-align: right;
  }

  .list-item .weui-cell__ft {
    box-sizing: border-box;
    padding-right: Px(32);
    background: url('./images/open.png') no-repeat;
    background-size: Px(22) Px(12);
    background-position: top Px(44) right 0;
    font-size: Px(32);
    color: #222222;
    height: Px(100);
    line-height: Px(100);
    text-align: right;
  }

  .list-item .vux-cell-placeholder {
    color: #BFBFBF;
    font-size: Px(28);
  }

  input {
    font-size: Px(32) !important
  }

</style>
<style>
  .weui-cells_radio {
    height: 300px !important
  }

</style>
