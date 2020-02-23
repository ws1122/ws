<template>
  <div class="add-address">
    <vheader :title="title"></vheader>
    <div class="info-wrap">
      <div class="info-item">
        <div class="info-tit">收件人</div>
        <div class="info-desc">
          <input type="text" v-model="username" placeholder="请输入收件人姓名">
        </div>
      </div>
      <div class="info-item">
        <div class="info-tit">收件电话</div>
        <div class="info-desc">
          <input type="text" :maxlength="11" v-model="phone" placeholder="请输入收件电话">
        </div>
      </div>
      <div class="info-item" @click="secAddress">
        <div class="info-picker">
          <div class="address" v-show="address == ''">请选择地址</div>
          <div class="address" v-show="address != ''">{{address}}</div>
          <div class="sec-icon"></div>
        </div>
      </div>
      <div class="info-item">
        <div class="info-tit">详细地址</div>
        <div class="info-desc">
          <input type="text" v-model="detailAdress" placeholder="请输入详细地址">
        </div>
      </div>
    </div>
    <div class="submit-btn" @click="submitAddress">提交</div>
    <van-popup v-model="areaShow" position="bottom">
      <van-area :area-list="areaList" @cancel="cancel" @confirm="confirm" :value="addressVal"/>
    </van-popup>
  </div>
</template>
<script>
  import vheader from '../../components/header/index.vue'
  import { Area,Popup } from 'vant';
  import Vue from 'vue';
  Vue.use(Area)
  Vue.use(Popup)
  export default {
    data() {
      return {
        title: '',
        areaShow: false,
        areaList: null,
        address: '',
        addressVal:'',
        username:'',
        phone:'',
        detailAdress:''
      }
    },
    components: {
      vheader
    },
    watch:{
      phone(val, oldval) {
        if (isNaN(Number(val))) {
          this.phone = oldval
        }
      }
    },
    computed: {
      id() {
        return this.$route.query.id || 0
      },
      access_token() {
        // return '87af08e08cb1bd8d4f9c9084219cddad6365bfc0'
        return this.$store.state.token.access_token || localStorage.getItem('access_token')
      }
    },
    mounted() {
      this.getAreaJson()
      console.log(this.id)
      if(this.id !== 0){
        document.title = '编辑收货地址'
        this.title = '编辑收货地址'
      } else {
        document.title = '添加收货地址'
        this.title = '添加收货地址'
      }
    },
    methods: {
      getEditAdress(){
        this.$http.get('/v1/members/addressdetail/'+ this.id +'?access_token=' + this.access_token, {
          id: this.id,
          contact: this.username,
          phoneNum: this.phone,
          districtCode: Number(this.addressVal),
          address: this.detailAdress
        }).then(data=>{
          console.log(data)
          if (data.error) {
            if (data.error.code != 401) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else {
            this.addressVal = String(data.DistrictCode)
            this.address = data.AddressStr || ''
            this.username = data.Contact
            this.phone = data.PhoneNum
            this.detailAdress = data.Address
          }
        })
      },
      postAddress(){
        this.$http.post('/v1/members/addaddress?access_token=' + this.access_token, {
          id: this.id,
          contact: this.username,
          phoneNum: this.phone,
          districtCode: Number(this.addressVal),
          address: this.detailAdress
        }).then(data=>{
          console.log(data)
          if (data.error) {
            if (data.error.code != 401) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else {
              this.$vux.toast.show({
                type: 'success',
                text: this.id == 0 ? '添加成功' : '修改成功'
              })
              this.$router.back(-1)
          }
        })
      },
      getAreaJson(){
        this.$http.get('/v1/area/areatojson', {
        }).then(data=>{
          if (data.error) {
            if (data.error.code != 401) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else {
            this.areaList = data
            if(this.id != 0) {
              this.getEditAdress()
            }
          }
        })
      },
      submitAddress(){
        if(this.username == ''){
          this.$vux.toast.show({
            type:'warn',
            text:'请输入收件人姓名'
          })
          return false
        }
        if(this.phone == '' || (new RegExp(/^1[3,4,5,6,7,8,9]\d{9}$/)).test(this.phone) === false){
          this.$vux.toast.show({
            type:'warn',
            text:'请输入正确格式的手机号'
          })
          return false
        }
        if(this.address == ''){
          this.$vux.toast.show({
            type:'warn',
            text:'请选择地址'
          })
          return false
        }
        if(this.detailAdress == ''){
          this.$vux.toast.show({
            type:'warn',
            text:'请输入详细地址'
          })
          return false
        }
        this.postAddress()
      },
      secAddress(){
        this.areaShow = true
      },
      cancel(){
        this.areaShow = false
      },
      confirm(res){
        this.areaShow = false
        this.addressVal = res[2].code
        this.address = res[0].name + '/' + res[1].name + '/' + res[2].name
      }
    }
  }

</script>
<style lang="scss" scoped>
  @import '../../styles/variable.scss';

  .info-wrap {
    padding-top: Px(41);
  }

  .info-item {
    overflow: hidden;
    background: #fff;
    width: 100%;
    box-sizing: border-box;
    padding: Px(10);
    border-bottom: 1px solid #eee;

    .info-tit {
      float: left;
      width: Px(84);
      font-size: Px(14);
      color: #808080;
    }

    .info-desc {
      position: relative;
      float: left;
      font-size: Px(14);
      color: black;
    }
  }

  .submit-btn {
    margin: Px(20) Px(10) 0;
    background-image: linear-gradient(-180deg, #FBA302 0%, #F56A01 100%);
    border-radius: Px(5);
    font-size: Px(16);
    color: #FFFFFF;
    text-align: center;
    height: Px(44);
    line-height: Px(44);
  }

  input {
    outline: none;
    border: none;
    font-size: Px(14);
    color: black;
    width: Px(270);
  }

  input::-webkit-input-placeholder {
    color: #ccc;
  }

  input::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #ccc;
  }

  input:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #ccc;
  }

  input:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: #ccc;
  }

  .info-picker {
    overflow: hidden;
    position: relative;
    font-size: Px(14);
    color: #808080;
    .sec-icon {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-width: Px(6) Px(6) 0;
      border-style: solid;
      border-color: #aaa transparent transparent;
      /*灰 透明 透明 */
    }
    .address {
      overflow: hidden;
      width: Px(340);
      // background: pink;
    }
  }
</style>
<style lang="scss">
.van-picker__cancel, .van-picker__confirm {
    color: #2FB2BC!important;
}
</style>



