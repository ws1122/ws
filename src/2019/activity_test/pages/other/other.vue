<template>
     <!-- 下拉选择-->
  <!-- <div>
    <popup-header left-text="取消" right-text="确定" title="请选择银行卡"></popup-header>
    <group>
      <x-switch v-model="show1" title="标题"></x-switch>
    </group>
    <div v-transfer-dom>
      <popup v-model="show1">
        <popup-header left-text="取消" right-text="确定" title="请选择银行卡" :show-bottom-border="false" @on-click-left="left" @on-click-right="right"></popup-header>
        <group gutter="0">
          <radio :options="list"></radio>
        </group>
      </popup>
    </div>
  </div> -->
  <div class="flows">
    <flow>
      <flow-state state="1" title="进行中"></flow-state>
      <flow-line ></flow-line>
      <flow-state state="2">
        <span slot="title">已发货</span>
      </flow-state>
      <flow-line></flow-line>
      <flow-state state="3" title="待收货" ></flow-state>
      <flow-line ></flow-line>
      <flow-line></flow-line>
      <flow-state state="4" title="完成"></flow-state>
       <flow-line></flow-line>
      <flow-state state='5' title="接收"></flow-state>
    </flow>
  </div>
</template>
<script>
  // import {PopupHeader,Popup,TransferDom,Group,XSwitch,Radio} from 'vux'
  import { Flow, FlowState, FlowLine } from 'vux'

  export default {
    // directives: {
    //   TransferDom
    // },
    data() {
      return {

      }

    },
    components: {
      Flow,
      FlowState,
      FlowLine
    },
    mounted() {

    },
    methods: {

    }
  }
</script>
<style lang="scss" scoped>
 .flows{
   width: 100px;
   height: 200px;
   background: yellow;
 }



</style>