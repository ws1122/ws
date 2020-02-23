<template>
  <div>
    <div :class="$style.wrap">
      <span :class="$style.title">{{title}}</span>
      <input 
        type="text" :class="$style.input"  
        :placeholder = "placeholder"
        v-model = "val"
        v-if = "type === 'text'"
        :maxlength = 'maxlength'
        :readonly = 'readonly'>
       <input 
        type="password" :class="$style.input"  
        :placeholder = "placeholder"
        v-model = "val"
        v-if = "type === 'password'"
        :maxlength = 'maxlength'
        :readonly = 'readonly'>  
      <img src="./clear.png" :class="$style.clear" alt="" @click="clear()"  v-show = 'val && val.length > 0 && showClear'>  
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      value: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: '请输入内容:'
      },
      placeholder: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: 'text'
      },
      maxlength: {
        type: String,
        default: '19'
      },
      showClear: {
        type: Boolean,
        default: true
      },
      readonly: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        val: ''
      }
    },
    methods: {
      clear () {
        this.val = ''
      }
    },
    watch: {
      val (val) {
        this.$emit('input', val)
      },
      value (val) {
        this.val = val
      }
    },
    mounted () {
      this.val = this.value
    }
  }
</script>
<style lang="scss" scoped>
@import '@styles/bass.scss';
.wrap {
  width: 100%;
  height: Px(70);
  line-height: Px(70);
  position: relative;
}
.title {
  float: left;
  font-size: Px(28);
  color: #5E5E5E;
  display: inline-block;
  line-height: Px(70);
}
.input {
  display: inline-block;
  outline: none;
  height: Px(60);
  width: 60%;
  font-size: Px(28);
  border: none;
  
}
.clear {
  width: Px(28);
  height: Px(28);
  position: absolute;
  display: block;
  right: Px(30)!important;
  top: Px(25)!important
}

::-webkit-input-placeholder {
    color: #c9c9cf;
}
:-moz-placeholder { 
    color: #c9c9cf;
}
::-moz-placeholder { 
    color: #c9c9cf;
}
:-ms-input-placeholder {
    color: #c9c9cf;
}

</style>
