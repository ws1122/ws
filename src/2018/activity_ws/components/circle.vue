
<template>
<div class="nav" :style="{height:option.size + 'px',width:option.size + 'px'}">
    <svg :height="option.size" :width="option.size" x-mlns="http://www.w3.org/200/svg">
        <circle
        :r="option.radius"
        :cx="option.cx"
        :cy="option.cy"
        :stroke="option.outerColor"
        :stroke-width="option.strokeWidth"
        fill="none"
        stroke-opacity="0.8"
        stroke-linecap="round"/>
        <circle
        id="progressRound"
        :stroke-dasharray="completenessHandle"
        :r="option.radius"
        :cx="option.cx"
        :cy="option.cy"
        :stroke-width="option.strokeWidth"
        :stroke="option.innerColor"
        stroke-linecap="round"
        fill="none"
        class="progressRound"
        />
    </svg>
    </div>
</template>
<script>
export default {
  name: 'CommonLoopProgress',
  props: {
    completeness: {
      type: Number,
      required: true,
    },
    progressOption: {
      type: Object,
      default: () => {},
    },
  },
  data () {
    return {
    }
  },
  computed: {
    completenessHandle () {
      let circleLength = Math.floor(2 * Math.PI * this.option.radius)
      let completenessLength = this.completeness * circleLength
      return `${completenessLength},100000000`
    },
    option () {
      // 所有进度条的可配置项
      let baseOption = {
        radius: 20,
        strokeWidth: 5,
        outerColor: '#E6E6E6',
        innerColor: '#FFDE00',
      }
      Object.assign(baseOption, this.progressOption)
      // 中心位置自动生成
      baseOption.cy = baseOption.cx = baseOption.radius + baseOption.strokeWidth
      baseOption.size = (baseOption.radius + baseOption.strokeWidth) * 2
      return baseOption
    },
  },
}
</script>
<style scoped lang='scss'>
.progressRound {

  transform-origin: center;
  transform: rotate(-90deg);
  transition: stroke-dasharray 0.3s ease-in;
}
.nav{
  position: absolute;
  left: 50%;
  top:50%;
  transform: translate(-50%,-50%);
}
</style>

