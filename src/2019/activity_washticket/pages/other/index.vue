<template>
  <div>
     <group title="" >
      <popup-picker :title="title1" :data="list1" v-model="value1" @on-show="onShow" @on-hide="onHide" @on-change="onChange" ></popup-picker>
    </group>
  </div>
</template>
<script>
import { PopupPicker, Group, } from 'vux'
export default {
  components: {
    PopupPicker,
       Group,
  },
  methods: {
    onChange (val) {
      console.log('val change', val)
    },
    onShow () {
      console.log('on show')
    },
    onHide (type) {
      console.log('on hide', type)
    }
  },
  data () {
    return {
      date: '',
      title1: '手机机型',
     list1: [['小米', 'iPhone', '华为', '情怀', '三星', '其他', '不告诉你']],
      
    }
  }
}
</script>

<style scoped>
.picker-buttons {
  margin: 0 15px;
}
</style>