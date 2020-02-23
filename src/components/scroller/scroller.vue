<template lang="pug">
  scroller(
    :height = 'height',
    lock-x,
    :scrollbar-y="false",
    use-pulldown,
    use-pullup,
    ref = 'scroller',
    :pulldown-config = 'pulldownConfig',
    :pullup-config = 'pullupConfig',
    @on-pullup-loading = 'loadMore',
    @on-pulldown-loading = 'onRefresh'
    @on-scroll="onScroll"
  )
    slot
    loading(
      :show = "isLoading && showLoading"
      text = "加载中"
    )
</template>

<script>
  import {Scroller, Loading} from 'vux'

  export default {
    name: 'common-Scroller',
    components: {
      Scroller,
      Loading
    },
    data () {
      return {
        pageindex: 1,
        pagesize: 10,
        maxpage: 1,
        pulldownConfig: {
          content: '下拉刷新',
          height: 60,
          autoRefresh: false,
          downContent: '向下拉刷新',
          upContent: '松手刷新',
          loadingContent: '加载中',
          clsPrefix: 'xs-plugin-pulldown-'
        },
        pullupConfig: {
          content: '上拉加载更多',
          pullUpHeight: 60,
          height: 40,
          autoRefresh: false,
          downContent: '上拉加载',
          upContent: '向上拉加载更多',
          loadingContent: '加载中',
          clsPrefix: 'xs-plugin-pullup-'
        },
        check: false,
        isLoading: false
      }
    },
    props: {
      api: {
        type: String,
        default: ''
      },
      baseapi:{
        type: String,
        default: ''
      },
      token: {
        type: String,
        default: ''
      },
      customData: {
        type: Object,
        default () {
          return {}
        }
      },
      height: {
        type: String,
        default: '-140px'
      },
      // 预留接口. 读取字段
      fields: {
        type: Object,
        default () {
          return {
            pageIndex: 'page',
            pageCount: 'pgct',
            pageSize: 'size'
          }
        }
      },
      toOpen: {
        type: Boolean,
        defatult: false
      },
      showLoading: {
        type: Boolean,
        defatult: false
      }
    },
    watch: {
      api () {
        this.autoFetch()
      },
      customData: {
        handler () {
          this.autoFetch()
        },
        deep: true
      },
      // 展开列表
      toOpen: {
        handler () {
        console.log(this.toOpen, 'toOpentoOpen')
        let timer = setTimeout(() => {
        this.resetNoTop()
        clearTimeout(timer)
        }, 400)
        },
        deep: true
      }
    },
    methods: {
      // === -60 
      onScroll (pos) {
        // 防止没反应
        if (pos.top === -60 && !this.check) {
          setTimeout(()=>{
            this.onRefresh()
            this.check = true
          },1000)
          if (this.check = true) {
            setTimeout(()=> {
              this.check = false
            },2000)
          }
          
        } 
      },
      // 获取对应的真实字段
      getFields (field) {
        return this.fields[field]
      },
      autoFetch () {
        this.pageindex = 1
        this.maxpage = 1
        // this.$emit('on-clear')
        this.getData({
          isClear: true
        })
        this.reset()
      },
      // 请求数据
      async getData ({
        isPullUp = false,
        isClear = false
      } = {isPullUp: false, isClear: false}) {
        this.isLoading = true;
        let {data} = await this.$http.get(this.api + '?access_token=' + this.token ,{
            [this.getFields('pageIndex')]: this.pageindex,
            [this.getFields('pageSize')]: this.pagesize,
            ...this.customData
        }, this.baseapi)
        this.isLoading = false;
        // 这样放一块 可以更快的把页面给刷掉. 防止刷新时, 同时出现几个元素
        if (isClear) this.$emit('on-clear')
        this.$emit('on-load', data.content)
        // this.maxpage = data.content.pageCount
        this.maxpage = data.content[this.getFields('pageCount')]
        isPullUp ? '' : this.reset()

      
        if (this.pageindex >= this.maxpage) {
          // load complete
          this.$emit('on-complete', {isLoadComplete: true})
          return this.disablePullup()
        } else {
          this.$nextTick(() => {
            this.$refs.scroller.enablePullup()
            this.$refs.scroller.donePullup()
          })
        }
        // if (this.pageindex >= this.maxpage) {
        //   return this.disablePullup()
        // }
      },
      // 上拉加载更多
      async loadMore () {
       
        if (this.pageindex >= this.maxpage) {
          this.pageindex = this.maxpage
          return this.disablePullup()
        }
        this.pageindex++
        await this.getData({isPullUp: true})
        this.$nextTick(() => {
          // this.$refs.scroller.donePullup()
        })
      },
      // 刷新
      async onRefresh () {
        // alert(123)
        // this.$nextTick(() => {
        //   this.$refs.scroller.enablePullup()
        // })
        this.pageindex = 1
        // this.$emit('on-clear')
        await this.getData({
          isClear: true
        })
        // this.$nextTick(() => {
        //   this.$refs.scroller.donePulldown()
        // })
      },
      // 禁用上拉
      disablePullup () {
        this.$nextTick(() => {
          this.$refs.scroller.donePullup()
          this.$refs.scroller.disablePullup()
          // console.log('请求完成')
        })
        return false
      },
      reset () {
        this.$nextTick(() => {
          this.$refs.scroller.reset({
            top: 0
          })
        })
      },
      resetNoTop () {
          this.$refs.scroller.reset()
      }
    },
    mounted () {
      this.getData()
    }
  }
</script>
