<docs>
# 背景色, 遮罩
</docs>

<template>
  <!-- <transition name="vux-fade"> -->
    <div v-if='show'></div>
  <!-- </transition> -->
</template>

<script>
export default {
  computed: {
    show () {
      return this.$store.state.dialog.maskShow
    }
  },
  mounted(){
    // console.log(this.show,333)
  }
}
</script>

<style scoped>
  div {
    position: fixed;
    z-index: 20;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .5);
  }
</style>
