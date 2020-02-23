import {Scroller} from 'vux'

export default {
  components: {Scroller},
  data () {
    return {
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
      }
    }
  },
  methods: {
    // 禁用上拉
    disablePullup () {
      this.$nextTick(() => {
        this.$refs.scroller.donePullup()
        this.$refs.scroller.disablePullup()
      })
      return false
    },
    reset () {
      this.$nextTick(() => {
        this.$refs.scroller.reset({
          top: 0
        })
      })
    }
  }
}
