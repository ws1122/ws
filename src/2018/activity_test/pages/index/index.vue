<template>
  <div>
    <div>55555</div>
    <div :key="itemkey">
      <div v-for="(item,index) in list" :key="index" :class="item.isSec ? 'sec':'unsec'" @click="clickSec(item,index)">{{item.txt}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        list:[],
        itemkey: (new Date()).getTime() // 给循环的父级一个时间戳，更新dom时实现刷新
      }
    },
    components: {
    },
    methods: {
      getlist() {
        let data = [{id:0,txt:'第1条'},{id:1,txt:'第2条'},{id:2,txt:'第3条'}]
        this.list = data // 用list接收请求到的列表数据
        this.list.forEach((item,index) => {
          item.isSec = false // isSec 控制当前那条是否选中
        })
        console.log(this.list)
      },
      clickSec(item,index){
        let num = (new Date()).getTime();
        this.itemkey = num // 更新给父级的key
        this.list[index].isSec = !this.list[index].isSec // 这个也不行，但是给父级设置一个key，更新key就行了
        // item.isSec = !item.isSec // 这个不行
        // this.$set(this.list,index,{id:item.id,txt:item.txt,isSec:!item.isSec}) // 这个可以实现但是在真实数据面前有点不现实
        // this.$set(this.list[index],'isSec',!item.isSec) // 这个不行
        // this.$set(item,'isSec',!item.isSec) // 这个也不行

        // 总结：
        // 直接  this.list[index].isSec = !this.list[index].isSec 或者 item.isSec = !item.isSec 都不行，
        // 因为 vue 页面不会检测到变化，页面不会局部刷新
        //  this.$set 可以用来更新 data 里面的数组和对象，但是对于数组来说，只能对里面的某一整条做更新，
        // 没办法做到更新某一条下面的某个字段（数据是更新了，但是vue的页面检测不到变化，页面不会重新渲染）
        console.log(item)
      }
    },
    mounted() {
      this.getlist()
    }
  }
</script>
<style lang="scss" scoped>
.unsec {
  color: #333;
}
.sec {
  color: red;
}
</style>


