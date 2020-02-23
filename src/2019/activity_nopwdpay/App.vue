<docs>
  ## 入口文件.
  > 尽量从App.vue里开发.而不是直接从 html里开发
</docs>
<template>
  <div>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <!-- 包裹动态组件，避免组件重新渲染-->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
  </div>
</template>

<script>
  export default {
    name: 'app',
    components: {

    },
    data() {
      return {

      }
    },

    mounted() {

    },
    computed: {

    },
    methods: {

    }
  }

</script>

<style lang="scss">
  @import './styles/variable';

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
