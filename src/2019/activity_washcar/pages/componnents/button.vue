<template>
  <div class="failue_btn">
    <span @click="btnClick" :class="hastotal ? 'act' : ''">{{title}}</span>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    props: {
      hastotal: {
        type: Boolean,
        default: true
      },
      title: {
        type: String,
        default: ''
      }
    },
    methods: {
      btnClick() {
        this.$emit('todo')
      }
    },
  }

</script>

<style lang="scss" scoped>
  @import '../../styles/variable.scss';

  .failue_btn {
    width: 100%;
    text-align: center;

    span {
      display: inline-block;
      width: Px(686);
      @include Height(Px(88));
      background-color: #bfbfbf;
      color: #fff;
      border-radius: Px(44);
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      /*去除点击高亮的颜色*/
      -webkit-tap-highlight-color: transparent;

      &.act {
        background-color: #10AEFF;
      }
    }
  }

</style>
