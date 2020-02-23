<template>
  <div class="main">
    <myheader @todo="chooseLocation" :height="2" :PID="PID" :urlType="2"></myheader>
    <div class="material_center">
      <ul class="material_cont">
        <li class="material_first_li" @click="showMore(Outindex)" v-for="(item,Outindex) in renderList" :key="Outindex">
          <img class="icon" :src="item.Icon" alt="">
          <span>{{item.Title}}</span>
          <i class="arrow" :class="tabIndex == Outindex ? 'act' : ''"></i>
          <ul @click.stop="secondulClick" class="material_cont_second" v-if="tabIndex == Outindex">
            <li class="material_second_li" v-for="(innerItem,innerIndex) in item.data" :key="innerIndex">
              <span class="left">{{innerItem.FieldName}}</span>
              <div class="right">
                <input type="text" v-model="innerItem[innerItem.Field]"
                  :placeholder="innerItem.Field == 'serviceTool1' ? '请输入明细' : '请输入数量'">
                <span>{{innerItem.Unit}}</span>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="material_bottom">
      <div class="declare_info">
        <span>总价</span>
        <input @change="hasWriteTotal" type="number" placeholder="请输入总价" v-model="total">
      </div>
      <div class="declare_info">
        <span>申报人</span>
        <input type="text" placeholder="市场经理姓名" v-model="declareName">
      </div>
    </div>
    <mybutton :hastotal="hasTotal" @todo="submit" :title="btnText"></mybutton>
  </div>
</template>

<script>
  import mybutton from "../componnents/button";
  import myheader from "../componnents/header";

  const wash = require("../../assets/wash.png");
  const fix = require("../../assets/fix.png");
  const clean = require("../../assets/clean.png");
  const addver = require("../../assets/addver.png");
  const guide = require("../../assets/guide.png");

  export default {
    data() {
      return {
        baseUrl: this.$isTest ? "https://test.api.cheyuu.com" : "https://api.cheyuu.com",
        tabIndex: -1,
        renderList: [],
        total: "", //总价
        hasTotal: false,
        locationName: "", //已选站点名称
        locationID: "",
        declareName: "",
        PID: '',
        btnText: '确认申报',
        submitBtnClick: true
      };
    },
    components: {
      mybutton,
      myheader
    },
    methods: {
      showMore(index) {
        if (this.tabIndex == index) {
          this.tabIndex = -1;
        } else {
          this.tabIndex = index;
        }
      },
      //阻止点击内层ul冒泡
      secondulClick() {},
      chooseLocation(params) {
        this.locationName = params.name;
        this.locationID = params.id;
      },
      hasWriteTotal() {
        if (this.total != "") {
          this.hasTotal = true;
        } else {
          this.hasTotal = false;
        }
      },
      submit() {
        if (this.hasTotal) {
          let data = {}
          this.renderList.forEach((val, index) => {
            val.data.forEach((valInner, indexInner) => {
              data[valInner.Field] = this.renderList[index].data[indexInner][valInner.Field]
            })
          })
          if (!this.locationID) {
            this.$vux.toast.show({
              type: "warn",
              text: "请选择申报站点"
            });
          } else {
            if (this.submitBtnClick) {
              this.submitBtnClick = false
              this.btnText = '申报中...'
              this.$http
                .post(
                  "/v2/apply/addmaterialapply?access_token=" + this.access_token, {
                    partnerID: this.locationID,
                    content: JSON.stringify(data),
                    totalPrice: this.total
                  },
                  this.baseUrl
                )
                .then(data => {
                  if (data.error) {
                    if (data.error.code == 401) {
                      // token失效
                    } else {
                      this.$vux.toast.show({
                        type: "warn",
                        text: data.error.message,
                        onHide: () => {
                          this.submitBtnClick = true
                          this.btnText = '确认申报'
                        }
                      });
                    }
                  } else {
                    // 请求成功
                    this.$vux.toast.show({
                      text: "申报成功",
                      type: "success",
                      onHide: () => {
                        this.btnText = '确认申报'
                        this.$router.push("declarerecord?type=material");
                        this.submitBtnClick = true
                      }
                    });
                  }
                });
            }
          }
        }
      },
      getApplicant() {
        this.$http.get("/v1/contacts/employeesinfo?access_token=" + this.access_token, {}, this.baseUrl).then(data => {
          if (data.error) {
            if (data.error.code == 401) {
              // token失效
            } else {
              this.$vux.toast.show({
                type: "warn",
                text: data.error.message
              });
            }
          } else {
            // 请求成功
            this.declareName = data.Contact;
            this.PID = data.PartnerID
          }
        });
      },
      getRenderList() {
        this.$http.get("/v2/apply/documentcontent?sign=materialApply", {}, this.baseUrl).then(data => {
          if (data.error) {
            if (data.error.code == 401) {
              // token失效
            } else {
              this.$vux.toast.show({
                type: "warn",
                text: data.error.message
              });
            }
          } else {
            // 请求成功
            this.renderList = data;
          }
        });
      }
    },
    computed: {
      access_token() {
        return this.$store.state.token.access_token || localStorage.getItem("access_token");
      }
    },
    mounted() {
      this.getApplicant();
      this.getRenderList();
    }
  };

</script>

<style lang="scss" scoped>
  @import "../../styles/variable.scss";

  .main {
    height: 100%;
    // background-color: #fff;
    padding-bottom: Px(100);
  }

  .material_center {
    margin: 0 Px(32);
    background-color: #fff;
    position: relative;
    top: Px(-70);
    padding: 0 Px(20);
    border-radius: Px(10);
    box-shadow: 0 2px 6px 2px rgba(0, 0, 0, 0.08);

    .material_cont {
      .material_first_li {
        display: inline-block;
        width: 100%;
        min-height: Px(90);
        line-height: Px(90);
        border-bottom: Px(1) solid #f4f4f4;

        &:last-child {
          border-bottom: 0;
        }

        .icon {
          float: left;
          width: Px(32);
          height: Px(32);
          margin: Px(34) Px(18) 0 0;
        }

        span {
          font-size: Px(32);
          color: #666;
        }

        .arrow {
          float: right;
          width: Px(22);
          height: Px(42);
          background-color: pink;
          margin-top: Px(24);
          background: url("../../assets/arrow_r.png") no-repeat;
          background-size: Px(22) Px(42);
          background-position: center center;
          transition: linear 0.05s;

          &.act {
            transform: rotate(90deg);
            transition: linear 0.05s;
          }
        }

        .material_cont_second {
          padding: 0 0 Px(20) Px(50);

          .material_second_li {
            overflow: hidden;
            @include Height(Px(60));

            .left {
              float: left;
            }

            .right {
              float: right;

              span {
                font-size: Px(28);
                color: #666;
              }

              input {
                width: Px(200);
                border: 0;
                outline: none;
                text-align: right;
                color: #bfbfbf;
                font-size: Px(28);

                &::-webkit-input-placeholder {
                  color: #bfbfbf;
                }

                &::-moz-input-placeholder {
                  color: #bfbfbf;
                }

                &::-ms-input-placeholder {
                  color: #bfbfbf;
                }
              }
            }
          }
        }
      }
    }
  }

  .material_bottom {
    margin: Px(-20) 0 Px(74) 0;
    padding: 0 Px(52);

    .declare_info {
      margin-bottom: Px(20);

      span {
        font-size: Px(32);
        @include Height(Px(44));
        color: #666;
      }

      input {
        float: right;
        text-align: right;
        font-size: Px(28);
        color: #bfbfbf;
        background-color: transparent;
        border: 0;
        outline: none;
        line-height: Px(44);

        &::-webkit-input-placeholder {
          color: #bfbfbf;
        }

        &::-moz-input-placeholder {
          color: #bfbfbf;
        }

        &::-ms-input-placeholder {
          color: #bfbfbf;
        }
      }
    }
  }

</style>
