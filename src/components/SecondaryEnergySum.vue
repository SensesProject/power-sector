<template>
  <div  class="secondary-energy" ref="inWrapper">
    <div v-if="step < 1">
      <div class="key" :class=" mobile ? 'mobile' : 'desktop'">
      <h4>Electricity production</h4>
      <a href="https://docs.messageix.org/projects/global/en/latest/" target="_blank">(MODEL: MESSAGEix-GLOBIOM_1.0)</a>
      <p class="selectors">
        Select a scenario:
        <SensesSelect class="scenario_selector" :options="scenarios" v-model="currentScenario"/>
      </p>
    </div>
    <div></div>
    <svg  :width="(innerWidth)" :height="innerHeight" :transform="`translate(${margin.left}, 0)`">
      <g v-for="(group, g) in dots.slice(0, 2)" v-bind:key="g + 'group'" :class="`${labels[g]}-group`" :transform="`translate(0, ${groupPosition[g]})`">
        <!-- draws dots for energy carrier with index g   -->
        <g>
        <circle v-for="(dot, d) in group" v-bind:key="d + 'dot'" @mouseover="[active = true, over = d + labels[g]]" @mouseleave="active = false" :class="labels[g]" :cx="dot.year" cy="5" :r="dot.value"/>
        <!-- labels for energy carrier g-->
        <text class="carrier-label" :x="scale.x(2019)" y="50">{{ labels[g] }}</text>
        </g>
        <!-- year labels for first and last year in dataset -->
        <g v-for="(text, t) in group" :key="t + 'text'" >
          <g v-if="t == 0 || t == 8">
          <text class="year-label" :x="text.year" y="20">{{ years[t] }}</text>
          </g>
        </g>
      </g>
    <g v-for="(group, g) in world.slice(0, 2)" v-bind:key="g + 'wgroup'" :class="`${labels[g]}-wgroup`" :transform="`translate(0, ${groupPosition[g]})`">
      <!--   draws hotizontal axis line through dots and small circles at the beginning and end of axis  -->
        <g class="axis_group">
            <line class="axis" y1="5" y2="5" :x1="scale.x(2020)" :x2="scale.x(2100)"/>
          <circle class="axis-dot" :cx="scale.x(2020)" cy="5" r="2.5"/>
          <circle class="axis-dot" :cx="scale.x(2100)" cy="5" r="2.5"/>
        </g>
        <!-- Hover over, shows values for each dot -->
        <g v-for="(text, t) in group" v-bind:key="t + 'text'" :class="active === true & over === t + labels[g] ? 'visible' : 'invisible'">
          <circle class="year-dot" :cx="text.year" cy="5" r="2.5"/>
          <text class="year-label" :x="text.year" y="20">{{ years[t] }}</text>
          <text class="year-label" :x="text.year" y="-30">{{ Math.round(text.valueEJ) }} Ej/year</text>
          <line class="line-label" :x1="text.year" :x2="text.year" y1="-25" y2="5"/>
        </g>
      </g>
    </svg>
  </div>
  <div v-if="step >= 1 && step < 2">
    <CostStructure :width="width" :height="height"/>
  </div>
  <div v-if="step >= 2">
    <CostStructureAgg :width="width" :height="height"/>
  </div>
  </div>
</template>

<script>
import _ from 'lodash'
import * as d3 from 'd3'

import SecondaryEnergyAndAllCosts from 'dsv-loader!@/assets/data/SecondaryEnergyAndAllCosts.csv' // eslint-disable-line import/no-webpack-loader-syntax
import SensesSelect from 'library/src/components/SensesSelect.vue'
import CostStructure from './CostStructure'
import CostStructureAgg from './CostStructureAgg'

export default {
  name: 'RiskPathway',
  components: {
    SensesSelect,
    CostStructure,
    CostStructureAgg
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
      default: false
    },
    step: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      // Dataset SecondaryEnergy is array with objects
      // [{},...,{}]
      SecondaryEnergyAndAllCosts,
      // groupBy creates object composed of keys (coal, wind, ...)
      // generated from the results of running each
      // element of SecondaryEnergySum thru iteratee d = {}
      // {"coal": [{},{}...],
      //   "wind": [{},{}...],
      //    ...
      //  }
      energy: _.groupBy(SecondaryEnergyAndAllCosts, d => d.Variable),
      // map erstellt einen Array mit allen values des keys model
      // set erstellt einen Array mit allen einzigartigen Einträgen für Model
      model: [...new Set(SecondaryEnergyAndAllCosts.map(r => r.Model))],
      years: [...new Set(SecondaryEnergyAndAllCosts.map(r => r.Year))],
      labels: [...new Set(SecondaryEnergyAndAllCosts.map(r => r.Variable))],
      scenarios: ['1.5ºC', '2.0ºC', 'Current Policies'],
      scenDict: { '1.5ºC': 'NPi2020_400_v3', '2.0ºC': 'NPi2020_1000_v3', 'Current Policies': 'NPi_v3' },
      regions: [...new Set(SecondaryEnergyAndAllCosts.map(r => r.Region))],
      allValues: [...new Set(SecondaryEnergyAndAllCosts.map(r => r.Value))],
      // new Array for all "Total Cost in mwh" values to create yAxis
      allCostTotal: [...new Set(SecondaryEnergyAndAllCosts.map(r => r.CostTotal))],
      allCostTotal_MWh: [...new Set(SecondaryEnergyAndAllCosts.map(r => r.CostTotal_MWh))],
      MWhSel: ['Total Cost', 'Total Cost per MWh'],
      tooltip: 'Here a description of what Secondary Energy is!',
      currentMWhSel: 'Total Cost',
      currentScenario: '1.5ºC',
      currentRegion: 'World',
      active: false,
      over: '',
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
    innerWidth () { return this.width - (this.margin.left + this.margin.right) },
    // scenario Filter takes Energy Array and returns Array where Objects with Scenario = currentScenario are filtered
    // ["coal": [{scenario: 1.5,...},{scenario: 1.5,...}...],
    //   "wind": [{scenario: 1.5,...},{scenario: 1.5,...}...],
    //    ...
    //  ]
    scenarioFilter () { return _.map(this.energy, (sc, s) => _.filter(sc, d => d.Scenario === this.scenDict[this.currentScenario])) },
    // filters over scenrioFilter Array, returns same array only with objects with CurrentRegion
    regionFilter () { return _.map(this.scenarioFilter, (re, r) => _.filter(re, d => d.Region === this.currentRegion)) },
    // filters over scenrioFilter Array, returns same array only with objects with region = World
    worldFilter () { return _.map(this.scenarioFilter, (re, r) => _.filter(re, d => d.Region === 'World')) },
    // calculates width between years to calculate width of single bar in dots
    sectWidth () {
      const inwidth = this.innerWidth
      const margleft = this.margin.left
      const margright = this.margin.right
      const yearcount = this.years.length
      const sewidth = (inwidth - ((4 * margleft) + (margright * 4))) / yearcount
      return sewidth
    },
    // dots returns an array with the size of regionFilter
    // with just that values for year and value in pixel
    scale () {
      // domain-> observartio EJ/yr, range-> visual variable px
      return {
        x: d3.scaleLinear()
          .range([52, this.innerWidth - (this.margin.right * 12)])
          .domain([2020, 2100]),
        y: d3.scaleLinear()
          .range([2, 1500])
          .domain([d3.min(this.allValues, s => +s), d3.max(this.allValues, s => +s)])
      }
    },
    dots () {
      return _.map(this.worldFilter, (energy, e) => {
        return _.map(energy, (single, s) => {
          return {
            year: this.scale.x(single.Year),
            value: this.scale.y(Math.sqrt(single.Value)),
            valueEJ: single.Value
          }
        })
      })
    },
    world () {
      return _.map(this.worldFilter, (energy, e) => {
        return _.map(energy, (single, s) => {
          return {
            year: this.scale.x(single.Year),
            value: this.scale.y(Math.sqrt(single.Value)),
            valueEJ: single.Value
          }
        })
      })
    },
    groupPosition () {
      // console.log('dots', this.dots)
      // length of dotsArray is  = nr of energy carrier
      // returns array with the position for each energy carrier
      const dotsArray = this.dots.slice(0, 2)
      let pos = 70
      return _.map(this.regionFilter, (energy, e, l) => {
        if (e !== 0) { pos = pos + this.innerHeight / dotsArray.length - 100 }
        return pos
      })
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
    // console.log('thisdots', this.dots)
    this.calcSizes()
    // console.log(this.areachart)
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
$margin-space: $spacing / 2;

.secondary-energy {
  height: 85vh;

  .key {
    z-index: 9;
    width: 100%;
    height: 100px;
    margin-bottom: 5%;
    padding: 40px 0px;

    top: 50px;

    background: hsla(0,0%,100%,.90);

    .highlight {
      margin-right: $margin-space;
      margin-top: 5px;
    }
    .selectors {
      display: inline-block;
      width: 70%;
      margin-left: $margin-space*2.8;
    }

    a {
      margin-top: 5px;
      color: #424ab9;
      font-weight: normal;
      display: inline;
      margin-left: $margin-space;
      font-size: 0.8em;
    }
    .scenario_selector {
      margin-top: $margin-space;
      margin-left: $margin-space;
      margin-right: $margin-space;
    }

    h4 {
      margin-left: $margin-space*2.8;
      margin-bottom: 10px;
      display: inline-block;
    }

    .v-popover {
      display: inline;
    }

    &.mobile {
        width: 90%;
        height: 150px;
        top: 100px;

      .selectors {
        width: 90%;
        margin-top: 15px;
        margin-left: 10px;
      }
    }
  }
  .legend{
    padding-top: 1.5%;
    margin-left: $margin-space*2.8;
    font-size: 0.7em;
    display: flex;
    flex-direction: row;
    align-items: center;
    .dot {
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: inline-block;
      border: 1px solid grey;
      margin-right: 3px;
    }
  }
  svg {
    height: 60%;
    .axis {
      stroke: $color-gray;
      stroke-width: 0.3;
    }
    circle {
      fill: $color-gray;
      fill-opacity: 0.5;
      transition: r 0.5s;
    }
    .axis-dot {
      fill-opacity: 1;
    }
    g {
      .carrier-label {
        font-size: 0.7em;
      }
      .year-label {
        text-anchor: middle;
        fill: black;
        font-size: 10px;
      }
      .shadow-label {
        fill-opacity: 0.6;
        fill: white;
      }

      .line-label {
        stroke: $color-gray;
        stroke-width: 0.5;
      }
      .visible {
        opacity: 1;
        transition: opacity 0.5s;
      }
      .invisible {
        opacity: 0;
        transition: opacity 0.5s;
      }
    }
    .Fossil {
      fill: getColor(violet, 60);
      stroke: getColor(violet, 40);
    }
    .Low-carbon {
      fill: getColor(green, 80);
      stroke: getColor(green, 40);
    }
  }
}

</style>
