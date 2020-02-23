<template>
  <div class="main">
		<myheader @todo="chooseLocation" :height="1" :PID="PID" :urlType="1"></myheader>
		<div class="business_center">
			<ul>
				<li v-for="(val,index) in renderList1.data" :key="index">
						<span>{{val.FieldName}}</span>
						<div @click="tabSwitch(val.Field,1,index)" class="icon icon_is" :class="val[val.Field] ? 'act' : ''"></div>
				</li>
			</ul>
			<div class="material_wrap">
				<h3>物料准备情况</h3>
				<ul>
						<li v-for="(val,index) in renderList2.data" :key="index" v-show="val.Field != 'train'">
								<span>{{val.FieldName}}</span>
								<div @click="tabSwitch(val.Field,2,index)" class="icon icon_has" :class="val['is'+val.Field] ? 'act' : ''"></div>
								<div class="material_loss" v-if="!val['is'+val.Field]">
										<span>缺件</span>
										<input type="text" :ref="'ipt'+index" placeholder="请输入缺件" v-model="val[val.Field]">
								</div>
						</li>
				</ul>
			</div>
			<ul class="train_wrap">
				<li>
						<span>操作人员是否培训完毕</span>
						<div @click="tabSwitch('isTrain')" class="icon icon_is" :class="isTrain ? 'act' : ''"></div>
				</li>
				<li class="devide"></li>
				<li class="train_sign" v-if="isTrain">
						<span>培训人签名</span>
						<input type="text" :disabled="isSame == 1" placeholder="请输入名字" v-model="trainName">
				</li>
				<li @click="tabSwitch('isSame')" class="isOne" v-if="isTrain">
						<span class="icon_isread" :class="isSame ? 'act' : ''"></span>
						<span>同于申请人</span>
				</li>
				<li class="train_sign">
						<span>申报人</span>
						<input type="text" placeholder="市场经理姓名" v-model="declareName">
				</li>
			</ul>
		</div>
		<div class="business_bottom">

		</div>
		<mybutton @todo="submit" :title="btnText"></mybutton>
  </div>
</template>

<script>
import mybutton from '../componnents/button';
import myheader from '../componnents/header';
export default {
  data() {
	  return {
  baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
    renderList1: [],
  renderList2: [],
  isTrain: 0, //是否培训
  isSame: 0, //是否同一人
  declareName: '', //申报人姓名
  trainName: '', //培训人签名
  stationList: [],
  locationName: '',
  locationID: '',
  PID: '',
  btnText: '确认申报',
  submitBtnFlag: true
};
},
  components: {
  mybutton,
  myheader
},
  methods: {
		// focusOn(index) {
		// 	console.log(this.$refs['ipt'+index])
		// 	this.$nextTick(() => {
		// 		this.$refs['ipt1'].focus()
		// 	})
		// },
  tabSwitch(type, listIndex, index) {
  if (listIndex == 1) {
  this.renderList1.data[index][type] == 0 ? this.renderList1.data[index][type] = 1 : this.renderList1.data[index][type] = 0
} else if (listIndex == 2) {
  this.renderList2.data[index]['is' + type] == 0 ? this.renderList2.data[index]['is' + type] = 1 : this.renderList2.data[index]['is' + type] = 0
  if (this.renderList2.data[index]['is' + type] == 0) {
  this.renderList2.data[index][type] = ''
}
}
  this[type] == 0 ? (this[type] = 1) : (this[type] = 0);
  if (type == 'isTrain' && this.isTrain == 0) {
  this.isSame = 0;
  this.trainName = '';
}
  if (this.isSame == 1) {
  this.trainName = ''
}
},
  chooseLocation(params) {
  this.locationName = params.name;
  this.locationID = params.id;
},
  getApplicant() {
  this.$http.get('/v1/contacts/employeesinfo?access_token=' + this.access_token, {}, this.baseUrl).then(data => {
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
  this.declareName = data.Contact;
  this.PID = data.PartnerID
}
});
},
  getRenderList() {
  this.$http.get('/v2/apply/documentcontent?sign=openApply', {}, this.baseUrl).then(data => {
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
  this.renderList1 = data[0];
  this.renderList1.data.forEach((val, index) => {
  val[val.Field] = 0
})
  this.renderList2 = data[1];
  this.renderList2.data.forEach((val, index) => {
  this.$set(val, 'is' + val.Field, 1)
})
}
});
},
  submit() {
  if (!this.locationID) {
  this.$vux.toast.show({
  type: 'warn',
  text: '请选择申报站点'
});
} else {
  if (this.submitBtnFlag) {
  let data1 = {}, data2 = {}, data3 = {train: this.isTrain}
  this.renderList1.data.forEach((val, index) => {
  data1[val.Field] = this.renderList1.data[index][val.Field]
})
  this.renderList2.data.forEach((val, index) => {
  if (val.Field != 'train') {
  if (this.renderList2.data[index]['is' + val.Field] == 0) {
  data2[val.Field] = this.renderList2.data[index][val.Field]
} else {
  data2[val.Field] = ''
}
}
})
  let data = Object.assign(data1, data2, data3)
  this.submitBtnFlag = false
  this.btnText = '申报中...'
  this.$http
						.post(
								'/v2/apply/addpartneropen?access_token=' + this.access_token,
  {
    SID: this.locationID,
    content: JSON.stringify(data),
    signature: this.trainName
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
  text: data.error.message,
  onHide: () => {
  this.submitBtnFlag = true
  this.btnText = '确认申报'
}
});
}
} else {
										// 请求成功
  this.$vux.toast.show({
  text: '申报成功',
  type: 'success',
  onHide: () => {
  this.btnText = '确认申报'
  this.$router.push('declarerecord?type=business');
  this.submitBtnFlag = true
}
});
}
});
}
}
}
},
  computed: {
  access_token() {
  return this.$store.state.token.access_token || localStorage.getItem('access_token');
}
},
  beforeDestroy() {
  document.removeEventListener('click', () => {}, false)
},
  mounted() {
  this.getApplicant();
  this.getRenderList()
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
.business_center {
    ul {
        background-color: #fff;
        li {
            padding: Px(26) Px(32);
            border-bottom: Px(1) solid #f4f4f4;
            box-sizing: border-box;
            .icon {
                width: Px(110);
                height: Px(60);
                float: right;
            }
            .icon_is {
                background: url("../../assets/switch_off.png") no-repeat;
                background-size: Px(110) Px(60);
                background-position: center center;
                &.act {
                    background: url("../../assets/switch_on.png") no-repeat;
                    background-size: Px(110) Px(60);
                    background-position: center center;
                }
            }
            .icon_has {
                background: url("../../assets/switch_no.png") no-repeat;
                background-size: Px(110) Px(60);
                background-position: center center;
                &.act {
                    background: url("../../assets/switch_all.png") no-repeat;
                    background-size: Px(110) Px(60);
                    background-position: center center;
                }
            }
            .icon_isread {
                display: inline-block;
                width: Px(24);
                height: Px(24);
                background: url("../../assets/unread.png") no-repeat;
                background-size: Px(24) Px(24);
                background-position: center center;
                vertical-align: middle;
                &.act {
                    background: url("../../assets/isread.png") no-repeat;
                    background-size: Px(24) Px(24);
                    background-position: center center;
                    vertical-align: middle;
                }
            }
            span {
                font-size: Px(32);
                color: #666;
            }
        }
    }
    .material_wrap {
        h3 {
            font-size: Px(28);
            @include Height(Px(80));
            color: #999;
            padding: 0 Px(32);
            font-weight: normal;
        }
        .material_loss {
            width: 100%;
            margin: Px(40) Px(-32) 0;
            padding: 0 Px(32);
            background-color: #fff;
            span {
                font-size: Px(28);
            }
            input {
                height: Px(50);
                float: right;
                text-align: right;
                border: 0;
                outline: none;
                color: #666;
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
    .train_wrap {
        li {
            border: 0;
        }
        .devide {
            width: 100%;
            height: Px(10);
            padding: 0;
            background-color: #efeff4;
        }
        margin-top: Px(10);
        .train_sign {
            input {
                height: Px(50);
                float: right;
                text-align: right;
                border: 0;
                outline: none;
                color: #666;
                font-size: Px(28);
                // background-color: transparent;
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
        .isOne {
            @include Height(Px(60));
            background-color: #efeff4;
            text-align: right;
            padding: 0 Px(32);
            span {
                font-size: Px(24);
                color: #999;
                line-height: Px(42);
            }
        }
    }
}
.business_bottom {
    margin: Px(20) 0 Px(90) 0;
    padding: 0 Px(52);
}
</style>


