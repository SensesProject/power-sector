<template>
  <rect
    :x="x"
    :width="width"
    :height="height"
    :class="[id, label]"
    :y="y"
    :style="{ fill: color }"
  />
</template>

<script>
export default {
  props: ['x', 'width', 'height', 'id', 'label', 'y', 'color']
}
</script>
