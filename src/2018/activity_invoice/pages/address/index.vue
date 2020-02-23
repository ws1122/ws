<template>
  <div>
    <vheader :hasRight="true" @rightBtnClick="rightclick">
      <div slot="rbtn">
        <div class="rbtn" v-if="addressList.length!=0 && isManage">管理</div>
        <div class="rbtn" v-if="!hasdata || !isManage">添加</div>
      </div>
    </vheader>
    <div v-if="!hasdata" class="nodata" @click="toAdd">请先添加收件地址</div>
    <div class="list-wrap" v-if="hasdata">
      <div class="list-item" v-for="(item,index) in addressList" :key="index">
        <div @click="goDetail(item)">
          <div class="user-wrap">
            <div class="name">{{item.Contact}}</div>
            <div class="phone">{{item.PhoneNum}}</div>
          </div>
          <div class="place">{{item.Address}}</div>
        </div>
        <div class="item-bot" v-show="!isManage">
          <div class="radio-wrap" @click="secAlways(item,index)"><span :class="item.IsDefault == 1 ? 'act' : ''"></span>设为默认地址</div>
          <div class="btn del" @click="clickDel(item,index)"><span></span>删除</div>
          <div class="btn edit" @click="toEdit(item.ID)"><span></span>编辑</div>
        </div>
      </div>
    </div>
    <!-- 弹窗 -->
    <pop @closeTank="closePop" @onConfirm="confirmDel" :hasConfirm="true" v-show="popTipShow">
      <div slot='poptop'>
        <div class="padding20">您确定要删除吗？</div>
      </div>
      <div slot='leftbtn'>确定</div>
      <div slot='popbtn'>取消</div>
    </pop>
  </div>
</template>
<script>
  import vheader from '../../components/header/index.vue'
  import pop from '../../components/pop/index.vue'
  export default {
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        if (from.name == 'addAddress') {
          vm.isManage = false
        } else {
          vm.isManage = true
        }
      })
    },
    data() {
      return {
        isManage: true, // 是添加状态还是管理状态
        addressList: [], // 地址列表
        hasdata: true, // 无数据
        popTipShow: false, // 弹窗显示隐藏
        delId: '',
        delIndex: ''
      }
    },
    components: {
      vheader,
      pop
    },
    computed: {
      access_token() {
        // return '87af08e08cb1bd8d4f9c9084219cddad6365bfc0'
        return this.$store.state.token.access_token || localStorage.getItem('access_token')
      }
    },
    mounted() {
      // 发票历史的头部
      this.$store.dispatch('setInvoiceHeader', false)
      this.getAddressList()
    },
    methods: {
      goDetail(item) {
        this.$store.dispatch('setContact', item.Contact)
        this.$store.dispatch('setPhone', item.PhoneNum)
        this.$store.dispatch('setAddress', item.Address)
        this.$router.back(-1)
      },
      getAddressList() {
        this.$http.get('/v1/members/addresslist?access_token=' + this.access_token, {
        }).then(data => {
          console.log(data)
          if (data.error) {
            if (data.error.code != 401) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else {
            this.addressList = data
            if (this.addressList.length <= 0) {
              this.hasdata = false
            } else {
              this.hasdata = true
            }
          }
        })
      },
      setDefault(id, index) {
        this.$http.post('/v1/members/setdefaultaddress?access_token=' + this.access_token, {
          aid: Number(id)
        }).then(data => {
          console.log(data)
          if (data.error) {
            if (data.error.code != 401) {
              this.$vux.toast.show({
                type: 'warn',
                text: data.error.message
              })
            }
          } else {
            this.getAddressList()
            //   this.addressList[index].IsDefault = 1
          }
        })
      },
      delAddress() {
        this.$http.post('/v1/members/deleteaddress/' + this.delId + '?access_token=' + this.access_token, {
          id: Number(this.delId)
        }).then(data => {
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
              text: '删除成功'
            })
            this.getAddressList()
            this.delId = ''
            this.delIndex = ''
            this.$store.dispatch('setMask', false)
            this.popTipShow = false
          }
        })
      },
      // 头部按钮事件
      rightclick() {
        if (this.isManage) {
          this.isManage = false
        } else {
          // 去添加
          this.$router.push({
            name: 'addAddress'
          })
        }
      },
      toAdd() {
        this.$router.push({
          name: 'addAddress'
        })
      },
      // 去编辑 带列表id
      toEdit(id) {
        this.$router.push({
          name: 'addAddress',
          query: {
            id: id
          }
        })
      },
      // 选择默认地址
      secAlways(item, index) {
        if (item.IsDefault == 1) {
          // 点的这个已经是默认的了
          return false
        } else {
          // 提交一个设置默认接口
          this.setDefault(item.ID, index)
        }
      },
      // 点击删除按钮
      clickDel(item, index) {
        this.delId = item.ID
        this.delIndex = index
        this.$store.dispatch('setMask', true)
        this.popTipShow = true
      },
      // 确认删除
      confirmDel() {
        console.log(22)
        this.$store.dispatch('setMask', false)
        // 删除操作
        if (this.delId == '') {
          return false
        }
        this.delAddress()
      },
      // 取消
      closePop() {
        this.delId = ''
        this.delIndex = ''
        this.$store.dispatch('setMask', false)
        this.popTipShow = false
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '../../styles/variable.scss';

  .rbtn {
    border: 1px solid #eee;
    font-size: Px(12);
    color: #F56A01;
    text-align: center;
    margin: Px(8) auto;
    width: Px(40);
    line-height: Px(24);
    border-radius: Px(4);
  }

  .nodata {
    position: fixed;
    top: Px(41);
    left: 0;
    font-size: Px(14);
    color: #616161;
    width: 100%;
    background: #fff;
    padding: Px(10);
  }

  .list-wrap {
    padding-top: Px(41);
    overflow: hidden;
  }

  .list-item {
    overflow: hidden;
    margin-bottom: Px(5);
    background: #fff;
    font-size: Px(14);

    .user-wrap {
      overflow: hidden;
      padding-top: Px(10);

      .name {
        float: left;
        margin-left: Px(10);
      }

      .phone {
        float: right;
        margin-right: Px(10);
      }
    }

    .place {
      margin: 0 Px(10);
      padding-bottom: Px(10);
    }

    .item-bot {
      border-top: 1px solid #eee;
      height: Px(34);
      line-height: Px(34);

      .radio-wrap {
        float: left;
        margin-left: Px(10);

        span {
          position: relative;
          top: Px(3);
          display: inline-block;
          box-sizing: border-box;
          margin-right: Px(4);
          width: Px(16);
          height: Px(16);
          border-radius: 50%;
          border: Px(1) solid #616161;
          background: #fff;

          &.act {
            border: Px(4) solid #F56A01;
          }
        }
      }

      .btn {
        float: right;
        margin-right: Px(10);

        span {
          position: relative;
          top: Px(5);
          width: Px(20);
          height: Px(20);
          display: inline-block;
          margin-right: Px(2);
        }

        &.del span {
          background: url('../../asset/del.png') no-repeat;
          background-size: 100% 100%;
          background-position: 0 0;
        }

        &.edit span {
          background: url('../../asset/edit.png') no-repeat;
          background-size: 100% 100%;
          background-position: 0 0;
        }
      }
    }
  }

  .padding20 {
    padding: Px(20) 0;
  }
</style>