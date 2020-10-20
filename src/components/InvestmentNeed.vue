<template>
  <section class="investments" ref="inWrapper">
    <header class="key">
      <h3>Energy investment needs within the power sector</h3>
      <p class="model">(Model: REMIND-MAgPIE)</p>
      <div >
      <label class= "label"><input class = "checkbox" type="checkbox" v-model="isStacked">not stacked</label>
      <label class= "label"><input class = "checkbox" type="checkbox" v-model="showDifference">difference highlighted</label>
      </div>
    </header>
    <div v-for="key in scenarios" :key="key" class="scenario">
      <Chart
        :isStacked="isStacked"
        :showDifference="showDifference"
        :gap="35"
        :data="dataByScenario[key]"
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
import Chart from './InvestmentNeeds/Chart'

export default {
  name: 'EmiCostsRisk',
  components: {
    Chart
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
    },
    step: {
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
      innerHeight: 0,
      isStacked: true,
      showDifference: false,
      variables: [
        'Coal|w/ CCS',
        'Coal|w/o CCS',
        'Gas|w/ CCS',
        'Gas|w/o CCS',
        'Biomass|w/ CCS',
        'Biomass|w/o CCS',
        'Nuclear',
        'Hydro',
        'Solar',
        'Wind',
        'Transmission and Distribution',
        'Electricity Storage'
      ],
      scenarios: ['CPol', 'NDC', '2C', '1.5C']
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
      return filter(this.variables, (variable) => get(this.extents, variable, 0) > 5)
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
  height: 90vh;

  .key {
    // width: 90%;
    height: 70px;
    margin-bottom: 3%;
    padding: 0 0px;
  }
  h3{
    display: inline-block;
    padding-bottom: 5px;
  }
  .model {
    margin-top: 5px;
    color: getColor(neon, 40);
    font-weight: normal;
    display: inline;
    margin-left: 10px;
    text-decoration: none;
    background: none;
  }
  .checkbox{
    margin-right: 5px;
  }
  .label {
    margin-right: 15px;
  }
}

</style>
