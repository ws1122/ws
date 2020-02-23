<template>
  <div class="main">
    <div class="tab-top">
      <span v-for="(title,index) in tabTitle" @click="changetab(index)" :class="{active:cur==index}"
        :key='index'>{{title}}</span>
    </div>
    <scroller v-show="isShow && list.length > 0" :use-pullup="showUp" :pullup-config="pullupDefaultConfig"
      :bounce="isbounce" v-model="scrollerStatus" @on-pullup-loading="onScrollBottom"
      style="width:100%;color: #bfbfbf;font-size: 14px" height="-45px" ref="scroller" :lock-x="true">
      <div class="list">
        <div v-for="(item,index) in list" :key='index' @click="todetails(item.ID)" class="lists">
          <div class="list-top">{{item.Title}} </div>
          <div class="list-content">
            <div> 申报人：{{item.Contact}}</div>
            <div> 申报时间{{item.CreateTime}}</div>
            <div> 故障描述：{{item.Detail}}</div>
            <div v-if="cur==1"> 处理状态：{{item.State}}</div>
            <div class="list-person" v-if="cur!=0">
              <div>负责人：{{item.headName}}</div>
              <div> 认领时间：{{item.GetTime}}</div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <panel :list="list" :type="'9'"></panel>
        <p style="color:#bfbfbf;width:100%;text-align:center;font-size:14px" v-if="onFetching">已经到底了</p>
      </div>
    </scroller>
    <div class="nodata_wrap" v-if="list.length==0">
      <img class="nodataImg" src="../../assets/no-data.png" alt="">
      <p>暂无数据</p>
    </div>
  </div>
</template>
<script>
  import {
    Scroller,
    Panel
  } from 'vux'
  const pullupDefaultConfig = {
    content: '上拉加载更多',
    pullUpHeight: 40,
    height: 40,
    color: '#bfbfbf',
    autoRefresh: false,
    downContent: '释放后加载',
    upContent: '上拉加载更多',
    loadingContent: '加载中...',
    clsPrefix: 'xs-plugin-pullup-'
  }
  export default {
    data() {
      return {
        baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
        pullupDefaultConfig: pullupDefaultConfig,
        scrollerStatus: {
          pullupStatus: 'default'
        },
        isbounce: true,
        isShow: false,
        showUp: true,
        onFetching: false,
        nodata: false,
        tabTitle: ['未认领工单', '我的工单', '已解决'],
        pageID: 1,
        pageSize: 10,
        cur: 0,
        list: []

      }
    },
    mounted() {
      this.faultrecord()
      this.$nextTick(() => {
        this.$refs.scroller.reset()

      })
    },
    components: {
      Scroller,
      Panel
      
    },

    computed: {
      access_token() {
        return this.$store.state.token.access_token || localStorage.getItem('access_token');
      }
    },
    methods: {
      /* 去详情*/
      todetails(id) {
        this.$router.push({
          name: 'details',
          query: {
            id: id,
            isstatus: '1'
          }
        })

      },


      changetab(index) {
        this.cur = index
        this.pageID = 1;
        this.faultrecord()
      },
      faultrecord(type) {
        this.list = [];
        this.$http.get('/v2/apply/faultrecord?access_token=' + this.access_token, {
          type: Number(this.cur + 1),
          pageID: this.pageID,
          pageSize: this.pageSize
        }, this.baseUrl).then(data => {
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
            this.list = data.list || [];
            if (this.list.length < this.pageSize) {
              this.scrollerStatus.pullupStatus = 'disabled'
              this.isShow = true
            } else {
              this.scrollerStatus.pullupStatus = 'default'
              this.isShow = true
            }
            if (this.list.length == 0) {
              this.nodata = true;
            } else {
              this.nodata = false;
            }
          }
        });
      },
      pullUpGetData() {
        this.pageID++
        this.$http.get('/v2/apply/faultrecord?access_token=' + this.access_token, {
          type: Number(this.cur + 1),
          pageID: this.pageID,
          pageSize: this.pageSize
        },
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
              let upDataList = data.list;
              this.list = this.list.concat(upDataList)
              if (upDataList.length == 0) {
                // 没有就显示底线以及禁用上拉
                this.onFetching = true
                this.scrollerStatus.pullupStatus = 'disabled'
              } else {
                // 还有数据就开启上拉，并重置
                this.scrollerStatus.pullupStatus = 'default'
                this.$nextTick(() => {
                  this.$refs.scroller.donePullup()
                  this.$refs.scroller.reset()
                })
              }
            }
          });
      },
      onScrollBottom() {
        this.pullUpGetData()
      }
    }
  }

</script>
<style lang="scss" scoped>
  @import "../../styles/variable.scss";

  .main {
    .tab-top {
      display: flex;
      font-size: Px(32);
      background-color: #fff;
      margin-bottom: Px(10);
      box-shadow: 0 1px 4px 0 rgba(153, 153, 153, 0.50);


      span {
        flex: 1;
        padding: Px(20) 0;
        text-align: center;
      }

    }

    .lists {
      width: 100%;
      padding: 0 Px(32) Px(40);
      box-sizing: border-box;
      background-color: #fff;
      margin-bottom: Px(10);

      .list-top {
        line-height: Px(80);
        color: #000000;
        border-bottom: 1px solid #dddddd;

      }

      .list-content {
        padding-top: Px(30);
        font-size: Px(28);
        color: #999999;
        div {
          width: 100%;
          line-height: Px(50);
          overflow: hidden;
          text-overflow: ellipsis;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .list-person {
          padding-top: Px(40);

        }

      }


    }

  }

  .active {
    color: #12B0FF;
    border-bottom: 2px solid #12b0ff;
  }

  .nodata {
    text-align: center;
    margin-top: Px(200);
    color: #999;

  }

  .nodata_wrap {
    padding: 0 Px(20);

    p {
      text-align: center;
      color: #666;
      font-size: Px(32);
    }

    .nodataImg {
      width: 100%;
    }
  }

</style>
<style>

</style>
