<template>
  <ul class="list-wrap">
    <slot />
  </ul>
</template>
<script>
import { ContainerMixin } from 'vue-slicksort';

export default {
  mixins: [ContainerMixin]
}
</script>
<style lang="scss" scoped>
@import '../../../styles/variable.scss';
.list-wrap {
  overflow: hidden;
  margin: 0 auto;
  width: Px(710);
}
</style>


