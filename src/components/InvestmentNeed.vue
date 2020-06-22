<template>
  <div class="emissions-costs" ref="inWrapper">
    <div class="key">
      Legend or selectors if any
    </div>
    <svg :width="innerWidth" :height="innerHeight" :transform="`translate(${margin.left}, 0)`">
    </svg>
  </div>
</template>

<script>
export default {
  name: 'EmiCostsRisk',
  props: {
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      margin: {
        top: 10,
        bottom: 10,
        right: 10,
        left: 10
      },
      innerHeight: 0
    }
  },
  computed: {
    innerWidth () {
      return this.width - (this.margin.left + this.margin.right)
    }
  },
  methods: {
    calcSizes () {
      const { inWrapper: el } = this.$refs
      const innerHeight = el.clientHeight || el.parentNode.clientHeight
      this.innerHeight = Math.max(innerHeight, 500)
    }
  },
  mounted () {
    this.calcSizes()
    window.addEventListener('resize', this.calcSizes, false)
  },
  updated () {
    this.calcSizes()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.calcSizes, false)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "library/src/style/variables.scss";

.emissions-costs {
  height: 85vh;

  .key {
    width: 90%;
    height: 100px;
    margin: 0 auto;
    padding: 0 20px;
    border-bottom:0.5px solid blue;
  }

  svg {
    background-color: lightblue;
  }
}

</style>
