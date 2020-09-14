<template>
  <text
    ref="label"
    :x="0"
    :style="`transform: translateX(${x}px)`"
    :y="height + 10"
    dominant-baseline="hanging"
    class="label"
    style="opacity: 0;"
  >{{ showDifference ? diff : label }}</text>
</template>

<script>
export default {
  props: ['x', 'y', 'height', 'diff', 'label', 'showDifference', 'widths', 'id'],
  mounted () {
    this.show()
  },
  updated () {
    this.show()
  },
  methods: {
    show () {
      const { label } = this.$refs
      const { width } = label.getBBox()
      label.style.opacity = width < this.widths ? 1 : 0
    }
  }
}
</script>

<style lang="scss">

</style>
