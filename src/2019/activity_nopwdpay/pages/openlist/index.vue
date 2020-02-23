<template>
  <div class="container">
    <div class="top-tip">
      <div>系统将根据下面的排列顺序扣款</div>
      <div>拖到</div>
    </div>
    <sortable-list lockAxis="y" 
      :pressDelay="600" 
      :distance="distance"
      v-model="lists" 
      helperClass="active" 
      :shouldCancelStart="shouldCancelStart" 
      @input="inputNewlist" 
      @sortStart="sortStart" 
      @sortEnd="sortEnd">
      <sortable-item v-for="(item, index) in lists" @toOpenCard="changeOpen" :index="index" :key="index" :item="item"></sortable-item>
    </sortable-list>
    
  </div>
</template>
<script>
import  SortableItem from './components/SortableItem.vue'
import  SortableList from './components/SortableList.vue'
export default {
  data(){
    return {
      options: {
        sort: true,
        delay: 30,
        chosenClass: "act",
        dragClass: "act",
        scroll: true
      },
      distance: 0,
      lists: [],
      newlist: [],
      baseUrl: this.$isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com',
    }
  },
  computed:{
    access_token() {
      return this.$store.state.token.access_token || localStorage.getItem('access_token')
    }
  },
  mounted(){
    this.getlist()
  },
  components: {
    SortableItem,
    SortableList
  },
  methods: {
    // 点击开通
    changeOpen(e){
      this.lists[e.index].Status = e.switch ? 1 : 0
      this.newlist[e.index].Status = e.switch ? 1 : 0
      this.sortList()
    },
    shouldCancelStart(e){},
    inputNewlist(e){
      e.forEach((item,index) => {
        this.newlist[index].MID = item.MID
        this.newlist[index].Status = item.Status
      });
      this.sortList()
    },
    sortStart(event, node, index, collection){},
    sortEnd(e){},
    sortList(){
      this.$http.post('/v1/payment?access_token=' + this.access_token, {
        List : this.newlist
      }, this.baseUrl).then((data) => {
        if (data.error) {
          if (data.error.code !== 401) { // token失效
            this.$vux.toast.show({
              type: 'warn',
              text: data.error.message
            })
          }
        } else { // 请求成功
         
          
        }
      })
    },
    /*获取签约列表*/
    getlist(){
      this.$http.get('/v1/payment/all?access_token=' + this.access_token, {}, this.baseUrl).then((data) => {
        if (data.error) {
          if (data.error.code !== 401) { // token失效
            this.$vux.toast.show({
              type: 'warn',
              text: data.error.message
            })
          }
        } else { // 请求成功
          this.lists = data
          let temp = []
          this.lists.forEach((item,index) => {
            let tempObj = { MID : item.MID , Status : item.Status }
            temp.push(tempObj)
          })
          this.newlist = temp
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/variable.scss';
.container {
  width: 100%;
  min-height: 100vh;
  background: #F5F5F5;
  -webkit-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
  img {
    pointer-events: none;
  }
}
.top-tip {
  padding: 0 Px(20);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: Px(80);
  line-height: Px(80);
  font-size: Px(28);
  color: #999999;
}

  .active {
    box-shadow: 0 2px Px(10) 0 rgba(0,0,0,0.60);
  }
</style>
<style>
.vux-x-switch.weui-cell_switch {
    padding-top: 0!important;
    padding-bottom: 0!important;
}
</style>


