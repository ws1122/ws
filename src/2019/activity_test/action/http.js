import Vue from 'vue'
import axios from 'axios'
import Qs from 'qs'
import store from '../store/index'
import isTest from '../../../utils/istest'
import getHref from '../../../utils/getquery'
const tokenApi = isTest ? 'https://test.api.cheyuu.com' : 'https://api.cheyuu.com';
var filter = {
  post: 'data',
  get: 'params'
};
const request = (url, options, baseUrl, isLoading) => {
  return new Promise((resolve, reject) => {
    var innerUrl = '';
    var api = url
    if (baseUrl !== undefined || baseUrl === '') {
      innerUrl = baseUrl
    } else {
      innerUrl = tokenApi
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
    }).then(({data}) => {
      // console.log('第一次直接拿到的数据:', {data}) // code 要根据返回的data改
      if (isLoading) {
        Vue.$vux.loading.hide()
      }
      if (data.error) {
        if (data.error.code === 401) { // token失效
          let contactID = getHref.getQuery('contactID')
          let partnerID = getHref.getQuery('partnerID')
          let couponCode = getHref.getQuery('couponCode')
          let v = new Date().getTime()
          let refresh_token = store.state.token.refresh_token || localStorage.getItem('refresh_token');
          let access_token = store.state.token.access_token || localStorage.getItem('access_token');
          let config = {
            client_id: 'wechat_mobile_app', // 商家端参数 wechat_partner_app
            refresh_token: refresh_token
          }
          axios({
            method: 'post',
            url: tokenApi + '/v1/authentication/refresh?access_token=' + access_token,
            data: Qs.stringify(config)
          }).then(res => {
            console.log('refresh:', res)
            let beforehref = getHref.getRouter()
            if (res.error) {
              // if (res.error.code === 400) { // refresh 还失效
                // 跳登录(把token,userinfo 清掉跳首页)
              store.dispatch('setAccessToken', '')
              store.dispatch('setRefreshToken', '')
              localStorage.clear()
              if (beforehref === '#/detail') {
                location.href = isTest ? `https://test.m.cheyuu.com/html/sheep/index.html#/detail?couponCode=${couponCode}&v=${v}` : `//m.cheyuu.com/html/sheep/index.html#/detail?couponCode=${couponCode}&v=${v}`
              } else {
                location.href = isTest ? `https://test.m.cheyuu.com/html/sheep/index.html#/?contactID=${contactID}&partnerID=${partnerID}&v=${v}` : `//m.cheyuu.com/html/sheep/index.html#/?contactID=${contactID}&partnerID=${partnerID}&v=${v}`
              }
            } else {
              if (res.data.scope == null || (res.data.scope).indexOf('member') === -1) { // 还是未授权
                store.dispatch('setAccessToken', '')
                store.dispatch('setRefreshToken', '')
                localStorage.clear()
                if (beforehref === '#/detail') {
                  location.href = isTest ? `https://test.m.cheyuu.com/html/sheep/index.html#/detail?couponCode=${couponCode}&v=${v}` : `//m.cheyuu.com/html/sheep/index.html#/detail?couponCode=${couponCode}&v=${v}`
                } else {
                  location.href = isTest ? `https://test.m.cheyuu.com/html/sheep/index.html#/?contactID=${contactID}&partnerID=${partnerID}&v=${v}` : `//m.cheyuu.com/html/sheep/index.html#/?contactID=${contactID}&partnerID=${partnerID}&v=${v}`
                }
              } else {
                store.dispatch('setAccessToken', res.data.access_token)
                store.dispatch('setRefreshToken', res.data.refresh_token)
                localStorage['access_token'] = res.data.access_token;
                localStorage['refresh_token'] = res.data.refresh_token;
                var accessToken = res.data.access_token;
                var api1 = api.split('access_token=')[0]
                axios({
                  url: innerUrl + api1 + 'access_token=' + accessToken,
                  [filter[options.method]]: {
                    ...options.data
                  }
                }).then(({data}) => {
                    // console.log('refresh之后再次请求到的数据：', {data})
                  resolve(data)
                }).catch(errors => reject(errors))
              }
            }
          })
        } else {
          // Vue.$vux.toast.show({
          //   type: 'warn',
          //   text: data.error.message || '数据交互失败'
          // })
          resolve(data)
        }
        // 执行刷新接口 再刷新接口成功的时候 再用一次axios 再resolve
      } else { // 请求成功
        resolve(data)
      }
    }).catch(err => reject(err))
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
