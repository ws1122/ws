<docs>
  ## 入口文件.
  > 尽量从App.vue里开发.而不是直接从 html里开发
</docs>

<template>
  <div class="app">
    <router-view></router-view>
    <masks></masks>
  </div>
</template>

<script>
// 不知道为啥，用mask命名报错说重复了
import masks from '../../components/mask/mask.vue'
  export default {
    name: 'app',
    components: {
      masks
    },
    data() {
      return {
     
      }
    },
    computed:{
      
    },
    methods:{
    
    },
    created() {
      
    },
    mounted() {
      
    }
  }
</script>

<style lang="scss">
[v-cloak] {
  display: none;
}
  @import './styles/variable';
  body {
    font-size: $font-size-normal;
    background: #F5F5F5;
  }
  .app {
    position: relative;
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
