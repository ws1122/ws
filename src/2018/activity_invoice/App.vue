<docs>
  ## 入口文件.
  > 尽量从App.vue里开发.而不是直接从 html里开发
</docs>

<template>
  <div>
    <inheader :hasBack="hasBackbtn" v-show="inHeadShow"></inheader>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <div class="mask" v-show="maskShow"></div>
  </div>
</template>

<script>
  import inheader from './components/invoice-header/index'
  export default {
    name: 'app',
    beforeRouteEnter(to, from, next) {
      if (to.path === '/selectinvoice') {
        if (from.path === '/') {
          to.meta.keepAlive = false /*这个地方是进行页面缓存的 */
        } else {
          to.meta.keepAlive = true
        }
      }
      if (to.path === '/detail') {
        if (from.path === '/selectinvoice') {
          to.meta.keepAlive = false
        } else {
          to.meta.keepAlive = true
        }
      }
      next()
    },
    components: {
      inheader
    },
    data() {
      return {
        hasBackbtn: true
      }
    },
    watch: {
      routeName(val) {
        // console.log(111,val)
        if (val == 'index') {
          this.hasBackbtn = false
        } else {
          this.hasBackbtn = true
        }
      }
    },
    mounted() {

    },
    computed: {
      routeName() {
        return this.$route.name
      },
      maskShow() {
        return this.$store.state.dialog.maskShow
      },
      inHeadShow() {
        return this.$store.state.dialog.inHeadShow
      }
    },
    methods: {

    }
  }

</script>

<style lang="scss">
  @import './styles/variable.scss';

  body {
    font-size: $font-size-normal;
    background: #F5F5F5;
  }

  .mask {
    z-index: 5;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .2);
  }

</style>

<style>
  /*reset*/
  * {
    margin: 0;
    padding: 0;
  }

  em {
    font-style: normal;
  }

  ul,
  li {
    list-style: none;
  }

</style>
