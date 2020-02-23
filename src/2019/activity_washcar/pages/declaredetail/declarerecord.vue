<template>
  <div class="main">
    <div class="record_wrap">
      <div class="record_top" @click="toDeclare(type)"><img class="icon" src="../../assets/add.png" alt=""><br><span>
          {{ title }}
        </span>
      </div>
      <div class="record_top record_history" @click="details" v-if="type =='failure'"><img class="icon"
          src="../../assets/history-time.png" alt=""><br><span>历史申报</span></div>
      <div class="record_center" v-if="type !='failure'">
        <ul class="record_title" v-if="declareList.length > 0">
          <li><img class="icon" src="../../assets/time.png" alt=""><span>申报时间</span></li>
          <li><img class="icon" src="../../assets/station.png" alt=""><span>
              {{type=='failure'? '修理人': '站点名称'}}
            </span>
          </li>
          <li>
            <img class="icon" src="../../assets/result.png" alt=""><span>处理结果</span></li>
        </ul>
        <scroller v-show="isShow && declareList.length > 0" :use-pullup="showUp" :pullup-config="pullupDefaultConfig"
          :bounce="isbounce" v-model="scrollerStatus" @on-pullup-loading="onScrollBottom"
          style="width:100%;color: #bfbfbf;font-size: 14px" height="-140px" ref="scroller" :lock-x="true">
          <ul class="record_list">
            <li v-for="(item,index) in declareList" :key="index" @click="toDetail(item.ID)"><span class="time">
                {{item.CreateTime.split(' ')[0]}}
              </span>
              <span class="location"> {{type=='failure'? '----': item.title || '----'}}
              </span><span v-if="type == 'failure'" class="status"
                :class="item.State == 1 ? 'fail' : item.State == 2 ? 'warn' : item.State == 3 ? 'success': ''">
                {{item.State | formatStatusFailure}}
              </span><span v-if="type == 'business' || type == 'material'" class="status"
                :class="item.State == 3 ? 'fail' : item.State == 2 ? 'success' : item.State == 1 ? 'warn' :''">
                {{item.State | formatStatus}}
              </span></li>
          </ul>
          <div>
            <panel :list="declareList" :type="'9'"></panel>
            <p style="color:#bfbfbf;width:100%;text-align:center;font-size:14px" v-if="onFetching">已经到底了</p>
          </div>
        </scroller>
        <div class="nodata_wrap" v-show="nodata"><img class="nodataImg" src="../../assets/no-data.png" alt="">
          <p>暂无数据</p>
        </div>
      </div>
      <div class="record_bottom" v-if="type !='failure'"></div>
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
  }

  from 'vux'

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
        title: ''
      }

      ;
    },


    components: {
      Scroller,
      Panel
    },


    methods: {
      details() {
        this.$router.push({
            name: 'declaredlist',
            query: {
              type: this.type
            }
          }

        );
      },

      getStationList() {
        let url = '',
          data = {}
        if (this.type == 'business') {
          url = '/v2/apply/stationapplylistbystate'
          data = {
            state: 2
          }
        } else if (this.type == 'failure' || this.type == 'material') {
          url = '/v1/partners/managerpartner'
          data = {
            type: 2
          }
        }

        this.$http.get(url + '?access_token=' + this.access_token,
          data,
          this.baseUrl).then(data => {
            if (data.error) {
              if (data.error.code == 401) {
                // token失效
              } else {
                this.$vux.toast.show({
                    type: 'warn',
                    text: data.error.message
                  }

                );
              }
            } else {
              // 请求成功
              this.stationList = data;
              this.getDeclareList();
            }
          }

        );
      },


      getDeclareList() {
        let url = '';
        if (this.type == 'business') {
          url = '/v2/apply/partneropenlist';
        } else if (this.type == 'material') {
          url = '/v2/apply/materialapplylistbycontactid';
        }
        this.$http.get(url + '?access_token=' + this.access_token, {
            pageID: this.pageID,
            pageSize: this.pageSize
          },
          this.baseUrl).then(data => {
            if (data.error) {
              if (data.error.code == 401) {
                // token失效
              } else {
                this.$vux.toast.show({
                    type: 'warn',
                    text: data.error.message
                  }

                );
              }
            } else {
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
                  }

                );
              }
            }
          }

        );
      },


      toDeclare(type) {
        this.$router.push(type + 'declare');
      },
      toDetail(id) {
        if (this.type == 'failure') {
          this.$router.push({
              name: 'declaredetail',
              query: {
                id: id
              }
            }

          );
        }
      },


      pullUpGetData() {
        let url = '';
        if (this.type == 'business') {
          url = '/v2/apply/partneropenlist';
        } else if (this.type == 'material') {
          url = '/v2/apply/materialapplylistbycontactid';
        }
        this.pageID++
        this.$http.get(url + '?access_token=' + this.access_token, {
            pageID: this.pageID,
            pageSize: this.pageSize
          },
          this.baseUrl).then(data => {
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
                }

              );
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
                  }

                )
              }
            }
          }

        );
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
                }

              )
              localStorage.removeItem('access_token')
              localStorage.removeItem('refresh_token')
              this.$store
                .dispatch('setAccessToken', '')
              this.$store.dispatch('setRefreshToken', '') //this.getToken()
            } else {
              // 请求成功
              let access_token = data.access_token
              let refresh_token = data.refresh_token
              localStorage['access_token'] = access_token;
              localStorage['refresh_token'] = refresh_token;
              this.$store.dispatch('setAccessToken', access_token)
              this.$store.dispatch('setRefreshToken', refresh_token)
              this.$nextTick(() => {
                  this.login()
                }

              )
            }
          }

        )
      },


      login() {
        this.$http.post('/v1/authentication/loginwechat?access_token=' + this.access_token, {
          wechatIdentity: 'partner',
          redirectUrl: location.href
        }, this.baseUrl).then(data => {
            if (data.redirectUrl) {
              location.href = data.redirectUrl
            }
          }

        )
      },


      // 获取用户信息，判断token是否登录
      getuserinfo() {
        axios({
            url: this.baseUrl + '/v1/contacts/employeesinfo?access_token=' + this.access_token,
            method: 'get'
          }

        ).then(({
            data
          }) => {
            if (Number(data.ID) > 0) {
              localStorage['userinfo'] = JSON.stringify(data);
              this.$store.dispatch('setUserinfo', JSON.stringify(data)) // this.getuserPoint()
              if (this.type != 'failure') {
                this.getStationList();
              }
            } else {
              this.getToken()
            }
          }

        )
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

      if (this.type == 'business') {
        this.title = '投营申报';
        document.title = this.title;
      } else if (this.type == 'failure') {
        this.title = '故障申报';
        document.title = this.title;
      } else if (this.type == 'material') {
        this.title = '物料申报';
        document.title = this.title;
      }
      this.$nextTick(() => {
          if (this.type != 'failure') {
            this.$refs.scroller.reset()
          }

        }

      )
    }
  };

</script>
<style lang="scss" scoped>
  @import "../../styles/variable.scss";

  .record_wrap {
    .record_top {
      margin: Px(10) 0;
      height: Px(150);
      background-color: #10aeff;
      text-align: center;
      color: #fff;

      .icon {
        width: Px(38);
        height: Px(38);
        margin: Px(26) 0 Px(10) 0;
      }

      span {
        font-size: Px(36);
      }
    }

    .record_center {
      .xs-plugin-pullup-container {
        color: #bfbfbf;
      }

      .record_title {
        display: flex;
        justify-content: space-between;
        padding: 0 Px(40);
        @include Height(Px(88));
        background-color: #fff;
        border-bottom: Px(1) solid #f4f4f4;
        font-size: Px(32);
        color: #666;

        .icon {
          width: Px(32);
          height: Px(32);
          vertical-align: middle;
          margin-right: Px(11);
        }
      }

      .record_list {
        background-color: #fff;
        font-size: Px(28);
        color: #333;
        padding: 0 Px(43);

        li {
          display: flex;
          justify-content: space-between;
          @include Height(Px(60));

          span {
            display: inline-block;
          }

          .time {
            text-align: left;
            flex: 1;
          }

          .location {
            text-align: center;
            flex: 2;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }

          .status {
            text-align: right;
            flex: 1;
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

  .record_history {
    background: #68DE9E !important;
  }

</style>
