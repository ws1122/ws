// 分享类型. 微信好友 朋友圈 温商贷好友
export const shareType = [
  'friend', 'circle'
]

/**
 * 普通分享
 * @param {vm} context 上下文
 * @param {number} type 类型 参考 ./items.js
 */
export function share(context, type) {
  let options = context.config
  let url = 'app://interface?method='
  url = url + 'opensingleshare&type=' + type +
    '&sharetype=' + options.sharetype +
    '&imageurl=' + options.imageurl +
    '&linkurl=' + escape(options.linkurl).replace('%23', '#') +
    '&title=' + (options.title) +
    '&content=' + (options.content) +
    '&logourl=' + (options.logourl) || ''

  window.nativeShareSuccess = () => {
    options.success(type)
    context.$emit('input', false)
  }

  if (window.location.href.indexOf('localhost') !== -1) {
    console.group('分享成功, 数据如下')
    for (let key in options) {
      console.log(key + ': ', options[key])
    }
    console.groupEnd('打印结束')
    setTimeout(() => {
      window.nativeShareSuccess()
    }, 400)
  } else {
    // alert(url)
    location.href = url
  }
}

export default {
  methods: {
    share(type) {
      return share(this, type)
    }
  }
}

