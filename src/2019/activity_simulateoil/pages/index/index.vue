<template>
  <div>
    <div class="top"><img src="../../assets/bg.png"></div>
    <div class="midland">
      <div @click="pulldowm(0)"><input type="text" placeholder="选择站点" class="inps" v-model="Title" disabled="disabled">
        <img src="../../assets/id.png" alt=" " class="imgs">
        <img src="../../assets/down.png" alt="" class="down">
      </div>
      <div @click="pulldowm(1)">
        <input type="text" placeholder="选择油卡" class="inps" v-model="oilstate" disabled="disabled">
        <img src="../../assets/id.png" alt=" " class="imgs">
        <img src="../../assets/down.png" alt="" class="down"></div>
      <div><input type="number" placeholder="输入金额" class="inps" v-model="money"  pattern="number" onkeyup="value=value.replace(/[^\d\.]/g,'')">
        <img src="../../assets/money.png" alt=" " class="imgs">
      </div>
    </div>
    <mybutton @todo="submit" title="确定"></mybutton>
    <div v-if="isstate">
      <van-actionsheet v-model="show" cancel-text="取消" @select="onSelect" @cancel="onCancel">
        <p class="statid" @click="onSelect(item.ID,item.Title)" v-for="(item,index) in actions" :key="index">
          {{item.Title}}</p>
      </van-actionsheet>
    </div>
    <div v-if="!isstate">
      <van-actionsheet v-model="iscard" cancel-text="取消" @select="onSelect" @cancel="onCancel">
        <p class="statid" @click="onSelectoil(item.CardNumber)" v-for="(item,index) in actions" :key="index">
          {{item.CardNumber}}</p>
      </van-actionsheet>
    </div>
  </div>
</template>
<script>
  import mybutton from '../componnents/button';
  import axios from 'axios'
  import Qs from 'qs'
  import {
    Actionsheet
  }

  from 'vant';
  import Vue from 'vue';
  Vue.use(Actionsheet);

  export default {
    data() {
      return {
        Title: '',
        oilstate: '',
        oilcardid: '',
        show: false,
        iscard: false,
        isstate: false,
        money: '',
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
        actions: []
      }
    },


    computed: {},


    components: {
      [Actionsheet.name]: Actionsheet,
      mybutton
    },


    methods: {
      submit() {
        if (this.oilcardid == '') {
          this.$vux.toast.show({
            type: 'warn',
            text: '请选择站点ID'
          })
          return false
        } else if (this.oilstate == '') {
          this.$vux.toast.show({
            type: 'warn',
            text: '请选择加油卡号'
          })
          return false
        } else if (isNaN(this.money) != false || this.money.trim() == '') {
          console.log(1588)
          this.$vux.toast.show({
            type: 'warn',
            text: '请输入正确的金额'
          })
          return false
        }
        this.$router.push({
          name: 'other',
          query: {
            money: this.money,
            partnerID: this.oilcardid,
            cardNo: this.oilstate
          }

        })
      },


      pulldowm(index) {
        if (index == 0) {
          this.isstate = true
          this.show = !this.show;
          this.iscard = false
          this.getoilcardlist()
        } else if (index == 1) {
          if (this.oilcardid == '') {
            this.$vux.toast.show({
                type: 'warn',
                text: '请选择站点ID'
              }

            )
            return false
          } else {
            this.show = false;
            this.isstate = false
            this.iscard = !this.iscard;
            this.oilcardlist()
          }

        }
      },
      onSelectoil(id) {
        this.oilstate = id;
        this.iscard = false;

      },

      onSelect(value, title) {
        this.Title = title
        this.oilcardid = value
        this.show = false;
      },

      onCancel() {},
      getoilcardlist() {
        this.$http.get('/v1/nosensepaytest/partnerlist', {}, this.baseUrl, false).then(data => {
            if (data.error) {
              if (data.error.code == 401) {
                // token失效
              } else {
                this.$vux.toast.show({
                    type: 'warn',
                    text: data.error.message
                  }

                )
              }
            } else {
              console.log(1588, data)
              // 请求成功
              this.actions = data
            }
          }

        )
      },


      oilcardlist() {
        this.$http.get('/v1/nosensepaytest/oilcardlist', {
          partnerID: Number(this.oilcardid)
        }, this.baseUrl, false).then(data => {
            if (data.error) {
              if (data.error.code == 401) {
                // token失效
              } else {
                this.$vux.toast.show({
                    type: 'warn',
                    text: data.error.message
                  }

                )
              }
            } else {
              // 请求成功
              console.log(2588, data)
              this.actions = data
            }
          }

        )
      }


    },


    mounted() {}
  }

</script>
<style lang="scss" scoped>
  @import '../../styles/variable.scss';

  .top {
    img {
      width: 100%;
    }
  }

  .midland {
    width: 100%;
    padding: 0 Px(40);
    box-sizing: border-box;

    div {
      position: relative;
      margin-bottom: Px(60);
      overflow: hidden;

      .inps {
        font-size: Px(28);
        width: 100%;
        height: Px(90);
        background: #EFF8FF;
        color: #000;
        border-radius: Px(10);
        border: none;
        padding-left: Px(80);
      }

      .imgs {
        position: absolute;
        left: Px(24);
        top: 50%;
        transform: translateY(-50%);
        width: Px(30);


      }
    }
  }

  input-placeholder {
    color: #BFBFBF;

  }

  .down {
    position: absolute;
    right: Px(24);
    top: 50%;
    transform: translateY(-50%);
    width: Px(20);

  }

  .statid {
    text-align: center;
    font-size: 16px;
    line-height: 50px;
    background-color: #fff;
  }

</style>
