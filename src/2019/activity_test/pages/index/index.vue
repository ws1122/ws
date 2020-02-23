<template>
  <div>
    <div style="background:pink" @click="toOther" v-if="">index</div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        objs: {
          one: 10,
          two: 20,
          three: 30,
          IDS: 147,
          Head: 0,
          ContactID: 14,


        }
      }
    },
    components: {},
    computed: {

    },
    methods: {
      toOther() {
        this.$router.push({
          name: 'other'
        })
      },
      iterate(obj) { // 遍历对象
        for (var item in obj) {
          console.log(11111, item)
          if (obj.hasOwnProperty(item)) {
            console.log(14777, item)
            //判断属性是不是在实例上

          }
        }
      }
    },
    mounted() {
      this.iterate(this.objs)
    }
  }

</script>
<style lang="scss" scoped>
  @import '../../styles/variable.scss';

</style>
