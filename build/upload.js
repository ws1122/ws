/**
 * 将打包后的文件上传到 服务器上
 */
// const path = require('path')
let argv = require('./argv.js')
const ora = require('ora')
var shell = require('shelljs');
// require('shelljs/global')
module.exports = function upload(target) {
  // target 可能值为 '2018/test' 或者 wap
  console.log('target', target)
  let prodoc = ''
  if ((target.split('/')).length <= 1) {
    return false // 只传 app 的活动，其他的不配置
  }
  prodoc = target.split('/')[1]
  let spinner = ora('正在上传...\n')
  spinner.start()
  let pDir = 'app'
  // let dir = path.resolve(__dirname, '../../../dist/' + pDir + '/' + target)
  // let targetDir = 'scp -r -P 23066 ' + dir + ' www@120.25.217.150:/data/htdocs/cheyoo-testing/applications/mobile-master/html/'
  let targetDir = ''
  if (argv.needUpload) {
    targetDir = 'cd ../../dist/' + pDir + '/' + target.split('/')[0] + ' & ' + 'scp -r -P 23066 ' + prodoc + ' www@120.25.217.150:/data/htdocs/cheyoo-testing/applications/mobile-master/html'
  } else if (argv.needUploadp) { // 商家端上传
    targetDir = 'cd ../../dist/' + pDir + '/' + target.split('/')[0] + ' & ' + 'scp -r -P 23066 ' + prodoc + ' www@120.25.217.150:/data/htdocs/cheyoo-testing/applications/partnerwx-master/html'
  }
  // console.log(targetDir)
  // 先cd到本地app/2018,在执行上传的那一句
  // ../dist/app/2018/test
  let obj = shell.exec(targetDir)
  if (obj.code === 0) {
    console.log('上传成功\n')
  } else {
    console.log('上传失败\n')
    console.log(obj.stderr + '\n')
  }
  spinner.stop()
}
