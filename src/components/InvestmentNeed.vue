<template>
  <section class="investments" ref="inWrapper">
    <header class="key">
      <h4>Energy investment needs</h4>
      <label><input type="checkbox" v-model="isStacked">is stacked?</label>
    </header>
    <div v-for="(scenario, key) in dataByScenario" :key="key" class="scenario">
      <InvestmentNeedsStackedBarChart
          :isStacked="isStacked"
          :gap="20"
          :data="scenario"
          :scenario="key"
          :extents="extents"
          :variables="visibleVariables"
        />
    </div>
  </section>
</template>

<script>
import { groupBy, filter, map, forEach, get } from 'lodash'
import datum from 'dsv-loader!@/assets/data/Investments.csv' // eslint-disable-line import/no-webpack-loader-syntax
import InvestmentNeedsStackedBarChart from './InvestmentNeeds-StackedBarChart'

export default {
  name: 'EmiCostsRisk',
  components: {
    InvestmentNeedsStackedBarChart
  },
  props: {
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    },
    mobile: {
      type: Boolean,
      default: true
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
      innerHeight: 0,
      isStacked: true,
      variables: [
        'Coal|w/ CCS',
        'Coal|w/o CCS',
        'Gas|w/ CCS',
        'Gas|w/o CCS',
        'Oil|w/ CCS',
        'Biomass|w/ CCS',
        'Biomass|w/o CCS',
        'Nuclear',
        'Hydro',
        'Solar',
        'Wind',
        'Geothermal',
        'Ocean',
        'Transmission and Distribution',
        'Electricity Storage'
      ]
    }
  },
  computed: {
    data () {
      return map(datum, (d) => {
        return {
          ...d,
          value: parseFloat(get(d, 'value', 0)),
          ref: parseFloat(get(d, 'ref', 0))
        }
      })
    },
    innerWidth () {
      return this.width - (this.margin.left + this.margin.right)
    },
    dataByScenario () {
      return groupBy(this.data, 'scenario')
    },
    extents () {
      // We need the maximum value for each variable for the unstacked chart
      const maxes = {}
      forEach(this.variables, (variable) => {
        const runs = filter(this.data, { variable })
        // Set the max value
        maxes[variable] = Math.max(...map(runs, 'value'))
      })
      return maxes
    },
    visibleVariables () {
      // Here we filter the list of variables by checking if the hightest value for this variable exceeds 15
      return filter(this.variables, (variable) => get(this.extents, variable, 0) > 15)
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

.investments {
  height: 85vh;

  .key {
    width: 90%;
    height: 100px;
    margin: 0 auto;
    padding: 0 0px;
    border-bottom: 0.5px solid grey;
  }
}

</style>
