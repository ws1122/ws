<template>
  <div class="main">
    <div class="tab-top">
      <span v-for="(title,index) in tabTitle" @click="changetab(index)" :class="{active:cur==index}"
        :key='index'>{{title}}</span>
    </div>
    <div class="record_wrap">
      <div class="record_center">
        <scroller v-show="isShow && declareList.length > 0" :use-pullup="showUp" :pullup-config="pullupDefaultConfig"
          :bounce="isbounce" v-model="scrollerStatus" @on-pullup-loading="onScrollBottom"
          style="width:100%;color: #bfbfbf;font-size: 14px" height="-40px" ref="scroller" :lock-x="true">
          <div class="list">
            <div v-for="(item,index) in declareList" :key='index' class="lists" @click="toDetail(item.ID)">
              <div class="list-content">
                <div> 申报人：{{item.Contact}}</div>
                <div> 申报时间:{{item.CreateTime}}
                </div>
                <div> 故障描述：{{item.Detail}}</div>
                <div> 处理状态：{{item.State==1?'未处理':'已解决'}}</div>
                <div class="list-person" v-if="item.Head>0">
                  <div>负责人：{{item.HeadName}}</div>
                  <div> 认领时间：{{item.GetTime}}</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <panel :list="declareList" :type="'9'"></panel>
            <p style="color:#bfbfbf;width:100%;text-align:center;font-size:14px" v-if="onFetching">已经到底了</p>
          </div>
        </scroller>
        <div class="nodata_wrap" v-show="nodata">
          <img class="nodataImg" src="../../assets/no-data.png" alt="">
          <p>暂无数据</p>
        </div>
      </div>
      <div class="record_bottom"></div>
    </div>
    <div class="record_btn"></div>
  </div>
</template>

<script>
  import axios from 'axios'
  import Qs from 'qs'
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
        declareList: [],
        nodata: false,
        pageID: 1,
        pageSize: 10,
        stationList: [],
        title: '',
        tabTitle: ['我的申报', '已解决'],
        cur: 0
      };

    },
    components: {
      Scroller,
      Panel
    },
    methods: {
      toDetail(id) {
        if (this.type == 'failure') {
          this.$router.push({
              name: 'details',
              query: {
                id: id
              }
            }

          );
        }
      },
      changetab(index) {
        this.cur = index
        this.getDeclareList()
      },
      getDeclareList() {
        this.declareList = [];
        let url = '/v2/apply/faultlistbycontactid';
        this.$http.get(
          url + '?access_token=' + this.access_token, {
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
            console.log(7777, data)
            // 请求成功
            this.declareList = data;
            if (this.declareList.length < this.pageSize) {
              this.scrollerStatus.pullupStatus = 'disabled'
              this.isShow = true
            } else {
              this.scrollerStatus.pullupStatus = 'default'
              this.isShow = true
            }
            if (this.declareList.length == 0) {
              this.nodata = true;
            } else {
              this.nodata = false;
              this.declareList.forEach((item, index) => {
                let id = ''
                if (this.type == 'business') {
                  id = item.SID
                } else {
                  id = item.PartnerID
                }
                let flag = this.stationList.find((val, i) => {
                  return id == val.ID;
                });
                if (flag != undefined) {
                  item.title = flag.Title;
                }
              });
            }
          }
        });
      },
      toDeclare(type) {
        this.$router.push(type + 'declare');
      },
      pullUpGetData() {
        let url = '';
        if (this.type == 'business') {
          url = '/v2/apply/partneropenlist';
        } else if (this.type == 'failure') {
          url = '/v2/apply/faultlistbycontactid';
        } else if (this.type == 'material') {
          url = '/v2/apply/materialapplylistbycontactid';
        }
        this.pageID++
        this.$http.get(url + '?access_token=' + this.access_token, {
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
              let upDataList = data;
              upDataList.forEach((item, index) => {
                let id = ''
                if (this.type == 'business') {
                  id = item.SID
                } else {
                  id = item.PartnerID
                }
                let flag = this.stationList.find((val, i) => {
                  return id == val.ID;
                });
                if (flag != undefined) {
                  item.title = flag.Title;
                }
              });
              this.declareList = this.declareList.concat(upDataList)
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
      },
      getToken() {
        this.$http.post('/v1/authentication/grant', {
          client_id: 'wechat_partner_app',
          // client_secret: 'fc175860ebd8e9f207826459f0b6695d', //正式
          client_secret: '7b80e058274bf47aa1acdf0fc9c89cda', //测试
          grant_type: 'client_credentials'
        }, this.baseUrl).then(data => {
          if (data.error) {
            this.$vux.toast.show({
              type: 'warn',
              text: data.data.error.message
            })
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            this.$store.dispatch('setAccessToken', '')
            this.$store.dispatch('setRefreshToken', '')
            //this.getToken()
          } else { // 请求成功
            let access_token = data.access_token
            let refresh_token = data.refresh_token
            localStorage['access_token'] = access_token;
            localStorage['refresh_token'] = refresh_token;
            this.$store.dispatch('setAccessToken', access_token)
            this.$store.dispatch('setRefreshToken', refresh_token)
            this.$nextTick(() => {
              this.login()
            })
          }
        })
      },
      login() {
        this.$http.post('/v1/authentication/loginwechat?access_token=' + this.access_token, {
          wechatIdentity: 'partner',
          redirectUrl: location.href
        }, this.baseUrl).then(data => {
          if (data.redirectUrl) {
            location.href = data.redirectUrl
          }
        })
      },
      // 获取用户信息，判断token是否登录
      getuserinfo() {
        axios({
          url: this.baseUrl + '/v1/contacts/employeesinfo?access_token=' + this.access_token,
          method: 'get'
        }).then(({
          data
        }) => {
          if (Number(data.ID) > 0) {
            localStorage['userinfo'] = JSON.stringify(data);
            this.$store.dispatch('setUserinfo', JSON.stringify(data))
            this.getDeclareList();
          } else {
            this.getToken()
          }
        })
      }
    },
    filters: {
      formatStatusFailure: val => {
        return val == 1 ? '未处理' : val == 2 ? '处理中' : val == 3 ? '已结束' : '';
      },
      formatStatus: val => {
        return val == 3 ? '驳回' : val == 2 ? '通过' : val == 1 ? '待审批' : '';
      }
    },
    computed: {
      access_token() {
        return this.$store.state.token.access_token || localStorage.getItem('access_token');
      },
      refresh_token() {
        return this.$store.state.token.refresh_token || localStorage.getItem('refresh_token')
      },
      userinfo() {
        return this.$store.state.token.userinfo || localStorage.getItem('userinfo')
      },
      type() {
        return this.$route.query.type;
      }
    },
    mounted() {
      if (!this.access_token) {
        this.getToken()
      } else {
        this.getuserinfo()
      }
      this.$nextTick(() => {
        this.$refs.scroller.reset()
      })
    }
  };

</script>

<style lang="scss" scoped>
  @import "../../styles/variable.scss";

  .record_wrap {
    .record_center {
      .xs-plugin-pullup-container {
        color: #bfbfbf;
      }

      .lists {
        width: 100%;
        padding: 0 Px(32) Px(40);
        box-sizing: border-box;
        margin-bottom: Px(20);
        background-color: #fff;

        .list-top {
          line-height: Px(80);
          color: #000000;
          background-color: #fff;

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

      .success {
        color: #008000;
      }

      .warn {
        color: #ffd700;
      }

      .fail {
        color: #ff0000;
      }
    }
  }

  .tab-top {
    display: flex;
    font-size: Px(32);
    background-color: #fff;
    margin-bottom: Px(10);

    span {
      flex: 1;
      padding: Px(20) 0;
      text-align: center;
    }

  }

  .active {
    color: #12B0FF;
    border-bottom: 2px solid #12b0ff;
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
