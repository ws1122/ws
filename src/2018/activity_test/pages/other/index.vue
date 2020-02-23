<template>
  <div>
    <div>other</div>
    <input type="text" placeholder="请输入文字">
  </div>
</template>
<script>
  const jsonp = require('jsonp')
  export default {
    data() {
      return {

      }
    },
    mounted() {
      this.getAddress(30.593099, 114.305393)
    },
    methods: {
      getAddress(lat, lon) {
        // var data = {
        //     location: lat + "," + lng,
        //     /*换成自己申请的key*/
        //     key: "R35BZ-TORRP-FMIDC-LZ7QK-D3ZYZ-AFFSN",
        //     get_poi: 0
        // };
        // var url = "https://apis.map.qq.com/ws/geocoder/v1/?";
        // data.output = "jsonp";
        // $.ajax({
        //     type: "get",
        //     dataType: "jsonp",
        //     data: data,
        //     jsonp: "callback",
        //     jsonpCallback: "QQmap",
        //     url: url,
        //     success: function(json) {
        //         if (json.message == "query ok") {
        //             console.log(json.result.address);
        //         }
        //     },
        //     error: function(err) {
        //         alert("服务端错误，请刷新浏览器后重试");
        //     }
        // });
        // jsonp("https://apis.map.qq.com/ws/geocoder/v1/?", {param: 'QQmap'}, (err, data) => {
        //     if (err) {
        //         console.error(err.message);
        //     } else {
        //         console.log(data);
        //     }
        // });
        // this.$jsonp('https://apis.map.qq.com/ws/geocoder/v1',{
        //     key:'R35BZ-TORRP-FMIDC-LZ7QK-D3ZYZ-AFFSN',
        //     get_poi:0,
        //     location: lat + ',' + lon,
        //     jsonpCallback:'QQmap',
        //     callback: "jsonpCallback"

        // }).then(( data) => {
        //     this.$vux.alert.show({
        //       content: JSON.stringify(data)
        //     })
        // }).catch(err=>{
        //     this.$vux.alert.show({
        //       content: "err"
        //     })
        // })
      }
    }
  }

</script>
<style lang="scss" scoped>

</style>
