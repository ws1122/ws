/* eslint-disable space-infix-ops */
<template>
  <div class="failue_top" :class="height == 1 ? 'height1': height==2? 'height2':'height3'">
    <h3 v-if="urlType<3"> 站点名称</h3>
    <h3 v-if="urlType==3">品牌</h3>
    <h3 v-if="urlType==4">机型</h3>
    <div class="ipt_wrap" ref="box" id="ipt_wrap">
      <div class="failue_ipt" id="failue_ipt" :class="showList ? 'act' : ''" v-if="urlType<3">
        {{locationName ? locationName : '请选择站点'}} </div>
      <div class="failue_ipt" id="failue_ipt" :class="showList ? 'act' : ''" v-if="urlType==3">
        {{locationName ? locationName : '请选择品牌'}}</div>
      <div class="failue_ipt" id="failue_ipt" :class="showList ? 'act' : ''" v-if="urlType==4">
        {{locationName ? locationName : '请选择机牌'}}</div>
    </div>
    <ul class="location_warp" v-if="showList&&stationList.length > 0&&urlType<3">
      <li v-for="(item,index) in stationList" :key="index" @click="chooseLocation(index,item.ID)">{{item.Title}}</li>
    </ul>
    <ul class="location_warp" v-if="showList&&urlType==3">
      <li v-for="(item,index) in stationList" :key="index" @click="choosebrand(index)">{{item}}</li>
    </ul>
    <ul class="location_warp" v-if="showList&&urlType==4">
      <li v-for="(item,index) in stationList" :key="index" @click="choosetype(index)">{{item}}</li>
    </ul>
    <ul class="location_warp" v-if="showList&&stationList.length == 0">
      <li v-if="stationList.length == 0">暂无可选站点</li>
    </ul>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
        locationName: '',
        showList: false,
        stationList: []
      };
    },
    props: {
      height: {
        type: Number,
        default: 1 // 1: 141px, 2: 109px
      },
      PID: {
        type: String,
        default: ''
      },
      urlType: {
        type: Number,
        default: -1
      }
    },
    methods: {
      chooseLocation(index, id) {
  
        this.locationName = this.stationList[index]['Title'];
        this.showList = !this.showList;
        this.$emit('todo', {
          name: this.locationName,
          id: id
        });
      },
      choosebrand(index) {
        this.locationName = this.stationList[index];
        this.showList = !this.showList;
        this.$emit('todo', {
          name: this.locationName,
          id: index
        });
      },
      choosetype(index) {
        this.locationName = this.stationList[index];
        this.showList = !this.showList;
        this.$emit('todo', {
          name: this.locationName,
          id: index
        });
      },


      getStationList() {
        let url = '',
          data = {}
        if (this.urlType == 1) {
          url = '/v2/apply/stationapplylistbystate'
          data = {
            state: 2
          }
        } else if (this.urlType == 2) {
          url = '/v1/partners/managerpartner'
          data = {
            type: 2
          }
        } else if (this.urlType == 3 || this.urlType == 4) {
          url = '/v2/apply/brandtypes'
        }
        this.$http
          .get(
            url + '?access_token=' + this.access_token,
            data,
            this.baseUrl
          )
          .then(data => {
            if (data.error) {
              if (data.error.code == 401) {
                // token失效
              } else {
                this.$vux.toast.show({
                  type: 'warn',
                  text: data.error.message
                });
              }
            } else {
              // 请求成功
              if (this.urlType == 3) {
                this.stationList = data.Brand
              } else if (this.urlType == 4) {
                this.stationList = data.Types
              } else {
                this.stationList = data;

              }
            }
          });
      },
      tabShowList() {
        this.showList = !this.showList;
      }
    },
    computed: {
      access_token() {
        return this.$store.state.token.access_token || localStorage.getItem('access_token');
      }
    },
    mounted() {
      this.getStationList()
      document.addEventListener('click', e => {
        if (this.$refs.box && this.$refs.box.contains(e.target)) {
          this.tabShowList()
        } else {
          this.showList = false;
        }
      });
    },
    beforeDestroy() {
      document.removeEventListener('click', this.tabShowList, false)
    }
  };

</script>

<style lang="scss" scoped>
  @import "../../styles/variable.scss";

  .failue_top {
    position: relative;
    padding: Px(22) Px(32) 0;
    background: linear-gradient(87deg, #10aeff 0%, rgba(32, 179, 255, 0.66) 94%);
    box-sizing: border-box;

    &.height1 {
      height: Px(218);
    }

    &.height2 {
      height: Px(291);
    }

    &.height3 {
      height: Px(180);
    }


    h3 {
      font-size: Px(40);
      line-height: Px(56);
      color: #fff;
    }

    .location_title {
      color: #fff;
      font-size: Px(36);
      margin: Px(30) 0 0 Px(20);
    }

    .ipt_wrap {
      position: relative;
      margin-top: Px(23);

      .failue_ipt {
        width: Px(686);
        padding: 0 Px(20);
        font-size: Px(24);
        color: #fff;
        @include Height(Px(66));
        border: 1px solid #fff;
        border-radius: Px(33);
        background-color: transparent;
        box-sizing: border-box;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        /*去除点击高亮的颜色*/
        -webkit-tap-highlight-color: transparent;

        &:before {
          content: "";
          width: Px(14);
          height: Px(22);
          background: transparent url("../../assets/arrow_right.png") no-repeat;
          background-size: 100% 100%;
          position: absolute;
          top: Px(22);
          right: Px(30);
          // transform: translateY(-50%);
          // background-color: #000;
          transition: linear 0.05s;
        }

        &.act:before {
          transform: rotate(90deg);
          transition: transform linear 0.05s;
        }
      }
    }

    .location_warp {
      width: Px(646);
      max-height: Px(400);
      padding: Px(10) Px(20) Px(20);
      z-index: 999;
      position: absolute;
      background-color: rgba(32, 179, 255, 0.9);
      // background: linear-gradient(87deg, #10AEFF 0%, rgba(32,179,255,0.66) 94%);
      color: #fff;
      font-size: Px(32);
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;

      li {
        @include Height(Px(60));
      }
    }
  }

</style>
