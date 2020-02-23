const getQuery = val => {
  let hash = location.hash
  if (hash.indexOf('?') !== -1) {
    let hashParamsStr = hash.split('?')[1]
    let hashParamsList = hashParamsStr.split('&')
    if (hashParamsList.length > 0) {
      let queryVal = ''
      hashParamsList.forEach(item => {
        if (val === item.split('=')[0]) {
          queryVal = item.split('=')[1] || ''
          return false
        }
      })
      return queryVal
    } else {
      return ''
    }
  } else {
    return ''
  }
}
const getRouter = () => {
  let hash = location.hash
  let path = hash.split('?')[0]
  console.log(path)
  return path // #/other 或者 #/
}

export default {
  getQuery,
  getRouter
}
