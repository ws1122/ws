<template>
  <div class="container">
    <div class="blank-div"></div>
    <div class="input-wrap">
      <img class="searchbtn" src="../index/images/search.png" @click="searchSite" alt="">
      <input v-model="sitekey" type="text" placeholder="站点查询">
      <img v-show="sitekey!=''" @click="clearKey" class="clear" src="../index/images/close.png" alt="">
      <div class="input-btn" @click="searchSite">搜索</div>
    </div>
    <div class="site-list">
      <div class="site-item" v-for="(item,index) in groupList" :key="index" @click="clickMove(item)">
        <div class="site-tit">{{item.Title}}</div>
      </div>
    </div>
    <div class="mask" v-show="popShow"></div>
    <div class="pop" v-show="popShow">
      <div class="pop-top">
        <div class="pop-topcon">
          移动{{contactName + contact}}至
          <p>{{partName}}？</p>
        </div>
      </div>
      <div class="pop-bot">
        <div @click="cancel">取消</div>
        <div class="confirm" @click="confirm">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
        sitekey: this.$store.state.site.sitekey, // 站点搜索
        popShow: false,
        groupList:[],
        partnerID: '',
        partName:''
      }
    },
    computed: {
      access_token() {
        return this.$store.state.token.access_token || localStorage.getItem('access_token')
      },
      id(){
        return this.$route.query.id
      },
      contactName(){ // 身份
        return this.$route.query.contactName
      },
      contact(){ // 名字
        return this.$route.query.contact
      }
    },
    mounted(){
      if(this.sitekey != ''){
        this.getlist()
      }
    },
    methods: {
      clearKey() {
        this.sitekey = ''
      },
      searchSite() {
        if(this.sitekey != ''){
          this.$store.dispatch('setSiteKey', this.sitekey)
          this.getlist()
        } else {
          this.$store.dispatch('setSiteKey', '')
          this.groupList = []
        }
      },
      getlist(){
        this.$http.get('/v1/partners/searchpartnerlist?access_token=' + this.access_token,{
          title: this.sitekey
        },this.baseUrl).then(data=>{
          if (data.error) {
            if (data.error.code != 401) {
                this.$vux.toast.show({
                  type: 'warn',
                  text: data.error.message
                })
            }
          } else {
            this.groupList = data
          }
        })
      },
      clickMove(item){
        this.partnerID = item.ID
        this.partName = item.Title
        this.popShow = true
      },
      cancel() {
        this.partnerID = ''
        this.partName = ''
        this.popShow = false
      },
      confirm() {
        if(this.partnerID != ''){
          this.$http.post('/v1/contacts/updatecontactpartner?access_token=' + this.access_token,{
            contactID: this.id,
            partnerID: this.partnerID
          },this.baseUrl).then(data=>{
            if (data.error) {
              if (data.error.code != 401) {
                  this.$vux.toast.show({
                    type: 'warn',
                    text: data.error.message
                  })
              }
            } else {
              console.log(data)
              if(data.result == 1){
                this.$vux.toast.show({
                  type: 'success',
                  text: '操作成功'
                })
                this.popShow = false
                this.$router.back(-1)
              } else {
                this.$vux.toast.show({
                  type: 'warn',
                  text: '操作失败'
                })
              }
            }
          })
        }
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
    @include Masks();
  }

  .blank-div {
    height: Px(88);
    margin-bottom: Px(20);
  }

  .input-wrap {
    position: fixed;
    top: 0;
    left: 0;
    background: #fff;
    height: Px(88);
    width: 100%;

    input {
      box-sizing: border-box;
      padding-left: Px(76);
      padding-right: Px(190);
      height: Px(88);
      width: 100%;
      border: 0;
      outline: none;
      font-size: Px(28);
    }

    input::-webkit-input-placeholder {
      /* WebKit, Blink, Edge */
      font-size: Px(28);
    }

    input:-moz-placeholder {
      /* Mozilla Firefox 4 to 18 */
      font-size: Px(28);
    }

    input::-moz-placeholder {
      /* Mozilla Firefox 19+ */
      font-size: Px(28);
    }

    input:-ms-input-placeholder {
      /* Internet Explorer 10-11 */
      font-size: Px(28);
    }

    .searchbtn {
      display: block;
      position: absolute;
      left: Px(20);
      top: 50%;
      transform: translateY(-50%);
      width: Px(40);
    }

    .clear {
      display: block;
      position: absolute;
      right: Px(142);
      top: 50%;
      transform: translateY(-50%);
      width: Px(26);
    }

    .input-btn {
      box-sizing: border-box;
      color: #666;
      background: #e9e9e9;
      position: absolute;
      right: 0;
      top: 0;
      padding-left: Px(30);
      padding-right: Px(30);
      height: Px(88);
      line-height: Px(88);
      font-size: Px(28);
      border-left: 1px solid #e9e9e9;
    }
  }

  .site-list {
    background: #fff;

    .site-item {
      overflow: hidden;
      padding: Px(20) Px(32);
      font-size: Px(32);
      color: #333333;
      border-bottom: 1px solid #F4F4F4;
    }

  }
  
</style>
