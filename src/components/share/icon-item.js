export default {
  'wechat': {
    text: '微信',
    img: require('./icons/wechat.png'),
    wap: true,
    invite: true,
    index: 0
  },
  'circle': {
    text: '朋友圈',
    img: require('./icons/circle.png'),
    wap: true,
    invite: true,
    index: 1
  },
  'weibo': {
    text: '微博',
    img: require('./icons/weibo.png'),
    invite: true,
    index: 4
  },
  'qq': {
    text: 'QQ',
    img: require('./icons/QQ.png'),
    invite: true,
    index: 2
  }
}

// 参数还是跟老样子一样
// case 0: //微信好友
// case 1: //微信朋友圈
// case 2: //QQ
// case 3: //短信
// case 4: //微博
