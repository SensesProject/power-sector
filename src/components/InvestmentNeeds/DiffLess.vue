<template>
  <g>
    <rect
      :x="x"
      :width="widthRef"
      :height="height"
      :y="y"
      :style="{ fill: 'rgba(255, 255, 255, 0.8)' }"
    />
    <line
      :x1="x + widthRef"
      :x2="x + widthRef"
      :y1="y"
      :y2="height"
      class="more"
    />
  </g>
</template>

<script>
export default {
  props: ['widthRef', 'x', 'y', 'height']
}
</script>
