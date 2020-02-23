import Vue from 'vue'
import axios from 'axios'
import Qs from 'qs'

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
const baseApi = isTest ? '//test.m.cheyuu.com' : '//m.cheyuu.com';
const tokenApi = isTest ? 'http://test.api.cheyuu.com' : '//api.cheyuu.com';
var filter = {
  post: 'data',
  get: 'params'
};
const request = (url, options, baseUrl,isLoading) => {
  return new Promise((resolve, reject) => {
    var innerUrl = '';
    var api = url
    if (baseUrl !== undefined) {
      innerUrl = baseUrl
    } else {
      innerUrl = baseApi
    }
    if (isLoading) {
      Vue.$vux.loading.show({
        text: 'Loading'
      })
    }

    axios({
      url: innerUrl + api,
      method: options.method,
      [filter[options.method]]: options.data,
      header: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    }).then(({
        data
    }) => {
    //  console.log('data:', data) // code 要根据返回的data改
      if (isLoading) {
        Vue.$vux.loading.hide()
      }
      resolve(data)
    }).catch(err => {
      if (isLoading) {
        Vue.$vux.loading.hide()
      }
      reject(err)
    })
  })
}

const get = (url, options = {}, baseUrl, isLoading = true) => {
  return request(url, {
    method: 'get',
    data: options
  }, baseUrl, isLoading)
}

const post = (url, options, baseUrl, isLoading = true) => {
  return request(url, {
    method: 'post',
    data: Qs.stringify(options)
  }, baseUrl, isLoading)
}

export default {
  get,
  post
}
