/**
 * 获取参数
 */
const argvs = process.argv.splice(2)
// console.log(3232 ,argvs)
module.exports = {
  isPublish: argvs.includes('publish'), // 始终是 false
  isOnline: argvs.includes('isonline'), // 始终是 false
  isPc: argvs.includes('pc'),
  needUpload: argvs.includes('upload'),
  needUploadp: argvs.includes('uploadp') // 商家端上传
}
