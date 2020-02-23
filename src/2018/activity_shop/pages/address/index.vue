<template>
  <div>
    <div class="input-wrap">
      <input type="text" v-model="username" placeholder="收货人">
      <input type="number" v-model="tel" placeholder="电话号码" maxlength="11">
      <textarea name="" id="" v-model="detailAddress" cols="30" rows="10" placeholder="详细地址"></textarea>
    </div>
    <div class="btn" @click="confrimBtn">确定</div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
        username:'', // 收货人
        tel:'', // 电话
        detailAddress:'', // 详细地址
        updateId: '', // 地址列表id，用于修改
        isclick: false // 防止多次点击提交
      }
    },
    computed:{
      access_token(){
        return this.$store.state.token.access_token || localStorage.getItem('access_token')
      }
    },
    methods: {
      // 获取地址
      getAddress() {
        this.$http.get(`/v1/shop/address?access_token=${this.access_token}`, {}, this.baseUrl).then((data) => {
          console.log('address接口：', data)
          if (data.error) {

          } else {
            this.username = data.Contact 
            this.tel = data.PhoneNum 
            this.detailAddress = data.Address
            if(data.ID) {
              this.updateId = data.ID
            } else {
              this.updateId = ''
            }
          }
        })
      },
      // 添加地址
      addAddress(){
        this.$http.post(`/v1/shop/addaddress?access_token=${this.access_token}`, {
          contact: this.username,
          address: this.detailAddress,
          phoneNum: this.tel
        }, this.baseUrl).then((data) => {
          console.log('address接口：', data)
          if (data.error) {
            this.isclick = false
          } else {
            if(data.result){
              this.$vux.toast.show({
                type: 'success',
                text: '地址添加成功',
                onHide:()=>{
                  this.isclick = false
                  this.$router.back(-1)
                }
              })
            }
          }
        }).catch((err)=>{
          this.isclick = false
        })
      },
      // 更新地址
      updateAddress(){
        this.$http.post(`/v1/shop/updateaddress/${this.updateId}?access_token=${this.access_token}`, {
          contact: this.username,
          address: this.detailAddress,
          phoneNum: this.tel
        }, this.baseUrl).then((data) => {
          console.log('address接口：', data)
          if (data.error) {
            this.isclick = false
            if(data.error.code == 401){

            } else {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else {
            if(data.result){
              this.$vux.toast.show({
                type: 'success',
                text: '地址修改成功',
                onHide:()=>{
                  this.isclick = false
                  this.$router.back(-1)
                }
              })
            } else {
              this.isclick = false
            }
          }
        }).catch((err)=>{
          this.isclick = false
        })
      },
      // 确定按钮
      confrimBtn(){
        if(this.username == ''){
          this.$vux.toast.show({
            type:'warn',
            text:'请输入收货人姓名'
          })
          return false
        }
        if(this.tel == '' || (new RegExp(/^1[3,4,5,6,7,8,9]\d{9}$/)).test(this.tel) == false){
          this.$vux.toast.show({
            type:'warn',
            text:'请输入正确格式的手机号'
          })
          return false
        }
        if(this.detailAddress == ''){
          this.$vux.toast.show({
            type:'warn',
            text:'请输入详细收货地址'
          })
          return false
        }
        if(this.isclick){
          return false
        }
        this.isclick = true
        if(this.updateId == ''){
          this.addAddress()
        } else {
          this.updateAddress()
        }
      }
    },
    mounted() {
      console.log(this.$vux.toast.show)
      this.getAddress()
    }
  }

</script>
<style lang="scss" scoped>
  @import '../../styles/variable.scss';

  .input-wrap {
    overflow: hidden;
    padding: 0 Px(10);
    background: #fff;
  }

  input {
    box-sizing: border-box;
    outline: none;
    border: none;
    font-size: Px(14);
    color: black;
    height: Px(42);
    width: 100%;
    border-bottom: 1px solid #E9E9E9;
  }

  input::-webkit-input-placeholder,
  textarea::-webkit-input-placeholder {
    color: #ccc;
    font-size: Px(14);
  }

  input::-moz-placeholder,
  textarea::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #ccc;
    font-size: Px(14);
  }

  input:-moz-placeholder,
  textarea:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #ccc;
    font-size: Px(14);
  }

  input:-ms-input-placeholder,
  textarea:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: #ccc;
    font-size: Px(14);
  }

  textarea {
    box-sizing: border-box;
    padding: Px(10) 0;
    outline: none;
    resize: none;
    border: 0;
    font-size: Px(14);
    height: Px(84);
    width: 100%;
  }

  .btn {
    margin: Px(20) auto 0;
    color: #fff;
    text-align: center;
    height: Px(44);
    line-height: Px(44);
    width: Px(355);
    background-image: linear-gradient(-180deg, #FBA302 0%, #F56A01 100%);
    border-radius: Px(5);
  }

</style>
