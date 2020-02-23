// let [isTest, href] = [null, window.document.location.href];
var isTest = null
var href = window.document.location.href
if (
  href.indexOf("192.168") > -1 ||
  href.indexOf("localhost") > -1 ||
  href.indexOf("test") > -1 // 添加本地和测试独有的域名
) {
  isTest = true;
} else {
  isTest = false;
}

export default isTest
