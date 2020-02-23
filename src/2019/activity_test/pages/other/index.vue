<template>
  <div>
    <div>
      <input type="text" v-model="a" name="" id="" @input="oninput" placeholder="请输入数字">
    </div>
  </div>
</template>
<script>
  import twonumber from '../../../../utils/keeptwonumber.js'
  export default {
    // beforeRouteEnter(to, from, next){
    //   if(from.path === '/'){
    //     to.meta.keepAlive = false
    //   } else {
    //     to.meta.keepAlive = true
    //   }
    //   next()
    // },
    data() {
      return {
        a: '',
      }
    },

    methods: {
      oninput(e) {
        // 通过正则过滤小数点后两位
        this.a = twonumber.twonumber(e)
        //this.a = e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
        // console.log('e', e.target.value)
      },
      operate() {
        let test = [
          [2, 23, 56],
          [50, 3, 24],
          [6, 30, 15],
          [19, 30, 12]
        ]
        // 求数组没个子元素中的最大值
        let newArr = test.map((item) => {
          let temp = item.reduce((prev, cur) => {
            return Math.max(prev, cur)
          }, 0)
          return temp
        })
        // console.log(newArr)
      },
      toOther1() {

        this.$router.push({
          name: 'third'
        })
      },
      setA() {
        this.a = 33
        
      },
      filterList() { // fliter() 用法 过滤保留满足条件的元素(不会改变原数组)
        let list = [2, 3, 3, 4, 2, 2, 5, 6, 4]
        let temp = list.filter((item, index) => {
          return item > 3
        })
        console.log(1588, temp)
      },
      mapList() { // map() 遍历 不会改变原数组，创建新数组
        // let list = [2,3,3,4,2,2,5,6,4]
        // let flg = Array.isArray(list)
        // console.log(flg) // 判断是不是数组
        // list.map((item,index)=>{
        //   console.log(item,index)
        // })
        // console.log(list)

        // 给数据新增一个字段，不改变原数组
        // let list = [{num:1,cm:1},{num:2,cm:2}]
        // let temp = list.map((item,index)=>{
        //   return {...item, sec:false}
        // })
        // console.log('temp=',temp)
        // console.log('list=',list)
      },
      reduceList() { // reduce() 用法
        let list = [2, 3, 3, 4, 2, 2, 5, 6, 4]
        // 去重
        let temp = list.reduce((prev, cur) => {
          (prev.indexOf(cur) == -1) && prev.push(cur)
          return prev
        }, [])
        temp.sort((a, b) => {
          return b - a
        })
        console.log(temp)
        // let temp = []
        // for(let i = 0;i<list.length;i++){
        //   if(temp.indexOf(list[i]) == -1){
        //     temp.push(list[i])
        //   }
        // }
        // console.log(temp)

        // 求和
        // let sum = list.reduce((prev,cur)=>{
        //   return prev + cur
        // },0)
        // console.log(sum)

        // 最大项最小项
        // let maxItem = list.reduce((prev,cur)=>{
        //   return Math.max(prev,cur)
        // })
        // let minItem = list.reduce((prev,cur)=>{
        //   return Math.min(prev,cur)
        // })
        // console.log(maxItem,minItem)

        // 数组元素出现次数
        let names = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice'];
        let nameNum = names.reduce((pre, cur) => {
          if (cur in pre) { // {Alice:1} Bob
            pre[cur]++
          } else {
            pre[cur] = 1
          }
          return pre
        }, {})
        // console.log(nameNum); //{Alice: 2, Bob: 1, Tiff: 1, Bruce: 1}
      }
    },
    mounted() {
      //this.operate()
      //this.mapList()
      //this.filterList()
      // this.reduceList()
    }
  }

</script>
<style lang="scss" scoped>
  @import '../../styles/variable.scss';

</style>
