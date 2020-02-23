<template>
  <div class="wrap">
    <div class="banner">
      <img src="./images/suc.png" alt="">
      <div class="ban">
        <div>购买成功</div>
        <p>恭喜获得以下优惠券</p>
      </div>
    </div>
    <div class="content">
      <div class="quan-list-wrap" v-for="(item,index) in qlist" :key="index" :class="index == 0 ? 'wrap1': index == 1 ? 'wrap2':'wrap3'">
        <div class="list-title">{{item.title}}</div>
        <div class="place">{{item.place}}</div>
        <div class="list-wrap">
          <div class="list-item" v-for="(citem,i) in item.list" :key="i">
            <div class="price" :class="index == 0 ? 'orgcolor': index == 1 ? 'pinkcolor': 'purcolor'"><span>{{citem.price}}</span>元</div>
            <p>{{citem.rule}}</p>
            <div class="num" :class="index == 0 ? 'orgbg': index == 1 ? 'pinkbg': 'purbg'">{{citem.num}}张</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        qlist: [
          {
            title:'加油券',
            place:'湖北省内使用',
            list: [
              { price: 6, rule:'满300元可用', num: 1 },
              { price: 5, rule:'满300元可用', num: 2 },
              { price: 4, rule:'满300元可用', num: 2 },
              { price: 3, rule:'满200元可用', num: 3 },
              { price: 2, rule:'满200元可用', num: 5 },
              { price: 5, rule:'满400元可用', num: 5 },
              { price: 4, rule:'满400元可用', num: 5 }
            ]
          },
          {
            title:'自驾游券',
            place:'湖北省内使用',
            list: [
              { price: 88, rule:'满300元可用', num: 1 },
              { price: 100, rule:'满800元可用', num: 1 },
              { price: 200, rule:'满2000元可用', num: 1 }
            ]
          },
          {
            title:'4S保养券',
            place:'武汉市内使用',
            list: [
              { price: 88, rule:'满600元可用', num: 1 },
              { price: 100, rule:'满1500元可用', num: 1 },
              { price: 200, rule:'满2000元可用', num: 1 },
              { price: 500, rule:'捷豹路虎专享', num: 1 }
            ]
          }
        ]
      }
    }
  }
</script>
<style lang="scss" scoped>
@import '../../styles/variable.scss';
.wrap {
  overflow: hidden;
}
.banner {
  height: Px(125);
  background: #000;
  img {
    display: block;
    margin-top: Px(36);
    margin-left: Px(87);
    width: Px(46);
    float: left;
  }
  .ban {
    float: left;
    margin-left: Px(10);
    margin-top: Px(36);
    div {
      font-size: Px(18);
      color: #FFFFFF;
    }
    p {
      font-size: Px(14);
      color: #FFFFFF;
    }
  }
}
.content {
  position: relative;
  overflow: hidden;
  background: #fff;
  top: Px(-12);
  border: Px(12) solid #fff;
  border-top-left-radius: Px(10);
  border-top-right-radius: Px(10);
  border-bottom: 0; 
  img {
    display: block;
    width: 100%;
  }
}
.quan-list-wrap {
  position: relative;
  // background: pink;
  margin-bottom: Px(10);
  border-radius: Px(10);
  .list-title {
    text-align: center;
    font-size: Px(18);
    line-height: Px(66);
  }
  .place {
    position: absolute;
    right: 0;
    top: Px(24);
    padding: 2px 6px 2px 10px;
    border-bottom-left-radius: Px(20);
    border-top-left-radius: Px(20);
    background: #939393;
    color: #fff;
    font-size: Px(12);
    text-align: center;
  }
  .list-wrap {
    overflow: hidden;
    .list-item {
      position: relative;
      float: left;
      margin: 0 Px(7) Px(10);
      width: Px(102);
      height:Px(64);
      background: #fff;
    }
  }
}
.list-item {
  .price {
    margin-left: Px(10);
    margin-top: Px(4);
    width: Px(60);
    font-size: Px(14);
    // color: #FF6604;
    span {
      display: inline-block;
      margin-right: Px(2);
      font-size: Px(20);
    }
  }
  p {
    margin-top: Px(8);
    font-size: Px(14);
    color: #A5A5A5;
    text-align: center;
  }
  .num {
    position: absolute;
    right: Px(-3);
    top: Px(6);
    width: Px(36);
    height: Px(20);
    // background: #FF6604;
    color: #fff;
    text-align: center;
    line-height: Px(20);
    font-size: Px(14);
    border-radius: Px(10);
  }
}
.orgcolor {
  color: #FF6604;
}
.orgbg {
  background: #FF6604;
}
.pinkcolor {
  color: #FF345F;
}
.pinkbg {
  background: #FF345F;
}
.purcolor {
  color: #AF38FF;
}
.purbg {
  background: #AF38FF;
}
.wrap1 {
  background: #FFF2E7;
}
.wrap2 {
 background: #FFECF0;
}
.wrap3 {
 background: #F8EDFF;
}
</style>

