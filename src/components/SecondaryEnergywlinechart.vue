<template>
  <div class="secondary-energy" ref="inWrapper">
    <div class="key" :class=" mobile ? 'mobile' : 'desktop'">
      <h4>Energy production (Ej/year) and production costs (log) ($/MWh) </h4>
      <p class="selectors">
        Select a scenario:
        <SensesSelect class="scenario_selector" :options="scenarios" v-model="currentScenario"/>
      </p>
    </div>
    <div></div>
    <svg :width="(2*innerWidth/3)" :height="innerHeight" :transform="`translate(${margin.left}, 0)`">
      <!-- dots is array with 8 key value pairs, one for each energy carrier, g is index 0-7
      v-bind key provides a unique key attribute for each item
      a class is defined for each energy carrier-group
      transform:translate moves the dots 0 px (x-value) and y-value:groupposition(g)
      groupposition is an array with 8 positions, one for each energy carrier-->
      <g v-for="(group, g) in dots" v-bind:key="g + 'group'" :class="`${labels[g]}-group`" :transform="`translate(0, ${groupPosition[g]})`">
        <!-- draws dots for energy carrier with index g   -->
        <g>
        <circle v-for="(dot, d) in group" v-bind:key="d + 'dot'" @mouseover="[active = true, over = d + labels[g]]" @mouseleave="active = false" :class="labels[g]" :cx="dot.year" cy="5" :r="dot.value"/>
        <!-- labels for energy carrier g-->
        <text :x="scale.x(2029)" y="40">{{ labels[g] }}</text>
        </g>
        <!-- year labels for first and last year in dataset-->
        <g v-for="(text, t) in group" :key="t + 'text'" >
          <g v-if="t == 0 || t == 7">
          <text class="year-label" :x="text.year" y="20">{{ years[t] }}</text>
          </g>
        </g>
      </g>
      <g v-for="(group, g) in world" v-bind:key="g + 'wgroup'" :class="`${labels[g]}-wgroup`" :transform="`translate(0, ${groupPosition[g]})`">
          <!--draws hotizontal axis line through dots and small circles at the beginning and end of axis -->
        <g class="axis_group">
          <line class="axis" y1="5" y2="5" :x1="scale.x(2030)" :x2="scale.x(2100)"/>
          <circle class="axis-dot" :cx="scale.x(2030)" cy="5" r="2.5"/>
          <circle class="axis-dot" :cx="scale.x(2100)" cy="5" r="2.5"/>
        </g>
      </g>
    </svg>
    <!--Cost Line Chart on the right side of bubble chart-->
    <svg :width="(innerWidth/3)" :height="innerHeight" :transform="`translate(${margin.left}, ${innerHeight/20})`">
      <!-- x-Axis -->
      <line class="axis" :y1="scaleCo.y(10)" :y2="scaleCo.y(10)" :x1="scaleCo.x(2030)" :x2="scaleCo.x(2105)"/>
      <!-- year labels for x-Axis -->
      <g >
      <text class="year-label" :x="scaleCo.x(2033)" :y="scaleCo.y(8)">2030</text>
      <text class="year-label" :x="scaleCo.x(2098)" :y="scaleCo.y(8)">2100</text>
      </g>
      <!-- y-Axis
      <line class="axis" :y1="scaleCo.y(CostTotalExtremes.max)" :y2="scaleCo.y(10)" :x1="scaleCo.x(2030)" :x2="scaleCo.x(2030)"/> -->
      <!-- label y-Axis
      <text :x="scaleCo.x(2030)" :y="scaleCo.y(0.3*CostTotalExtremes.max)" >Costs (log)</text>  -->
      <!-- Areas for fossils and renewables -->
      <path class="FossilsArea" :d="fossilCostArea" />
      <path class="RenewablesArea" :d="renewableCostArea" />
    </svg>
  </div>
</template>

<script>
import _ from 'lodash'
import * as d3 from 'd3'

import SecondaryEnergyAndTotalCostWorld from 'dsv-loader!@/assets/data/SecondaryEnergyAndTotalCostWorld.csv' // eslint-disable-line import/no-webpack-loader-syntax
import SensesSelect from 'library/src/components/SensesSelect.vue'

export default {
  name: 'RiskPathway',
  components: {
    SensesSelect
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
    }
  },
  data () {
    return {
      // Dataset SecondaryEnergy is array with objects
      // [{},...,{}]
      SecondaryEnergyAndTotalCostWorld,
      // groupBy creates object composed of keys (coal, wind, ...)
      // generated from the results of running each
      // element of SecondaryEnergySum thru iteratee d = {}
      // {"coal": [{},{}...],
      //   "wind": [{},{}...],
      //    ...
      //  }
      energy: _.groupBy(SecondaryEnergyAndTotalCostWorld, d => d.Variable),
      // map erstellt einen Array mit allen values des keys model
      // set erstellt einen Array mit allen einzigartigen Einträgen für Model
      model: [...new Set(SecondaryEnergyAndTotalCostWorld.map(r => r.Model))],
      years: [...new Set(SecondaryEnergyAndTotalCostWorld.map(r => r.Year))],
      labels: [...new Set(SecondaryEnergyAndTotalCostWorld.map(r => r.Variable))],
      scenarios: [...new Set(SecondaryEnergyAndTotalCostWorld.map(r => r.Scenario))],
      regions: [...new Set(SecondaryEnergyAndTotalCostWorld.map(r => r.Region))],
      allValues: [...new Set(SecondaryEnergyAndTotalCostWorld.map(r => r.Value))],
      // new Array for all "Total Cost in mwh" values to create yAxis
      allCostTotal: [...new Set(SecondaryEnergyAndTotalCostWorld.map(r => r.CostTotal))],
      tooltip: 'Here a description of what Secondary Energy is!',
      currentScenario: 'NPi_v3',
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
    scenarioFilter () { return _.map(this.energy, (sc, s) => _.filter(sc, d => d.Scenario === this.currentScenario)) },
    // filters over scenrioFilter Array, returns same array only with objects with CurrentRegion
    regionFilter () { return _.map(this.scenarioFilter, (re, r) => _.filter(re, d => d.Region === this.currentRegion)) },
    // filters over scenrioFilter Array, returns same array only with objects with region = World
    worldFilter () { return _.map(this.scenarioFilter, (re, r) => _.filter(re, d => d.Region === 'World')) },
    // dots returns an array with the size of regionFilter
    // with just that values for year and value in pixel
    scale () {
      // domain-> observartio EJ/yr, range-> visual variable px
      return {
        x: d3.scaleLinear()
          .range([50, 1.7 * this.innerWidth / 3])
          .domain([2030, 2100]),
        y: d3.scaleLinear()
          .range([2, 2000])
          .domain([d3.min(this.allValues, s => +s), d3.max(this.allValues, s => +s)])
      }
    },
    // ScaleCo to create Line chart based on Total Costs
    scaleCo () {
      return {
        x: d3.scaleLinear()
          .range([this.margin.left, 0.8 * this.innerWidth / 3])
          .domain([2025, 2100]),
        y: d3.scaleLog()
          .range([0.5 * this.innerHeight, this.margin.top])
          .domain([d3.min(this.allCostTotal, s => +s), d3.max(this.allCostTotal, s => +s)])
      }
    },
    dots () {
      // console.log('maxallcosts', d3.max(this.allCostTotal))
      return _.map(this.regionFilter, (energy, e) => {
        return _.map(energy, (single, s) => {
          return {
            yearOrig: single.Year,
            year: this.scale.x(single.Year),
            value: this.scale.y(Math.sqrt(single.Value)),
            // should return costs, scaled based on yCo not y
            yearCO: this.scaleCo.x(single.Year),
            // costs: (single.CostTotal)
            costs: this.scaleCo.y(single.CostTotal)
          }
        })
      })
    },
    CostTotalExtremes () {
      return {
        min: d3.min(this.allCostTotal, s => +s),
        max: d3.max(this.allCostTotal, s => +s)
      }
    },
    // define area for Fossils
    fossilCostArea () {
      const yVals = _.map(this.dots[0], (dot, d) => dot.costs)
      const xVals = _.map(this.dots[0], (dot, d) => dot.yearCo)
      console.log('xvals', xVals)
      console.log('yvals', yVals)
      const areaplot = d3.area()
        .x(d => { return d.yearCO })
        .y0(this.scaleCo.y(10))
        .y1(d => d.costs)
      return areaplot(this.dots[0])
    },
    // define area for Renewables
    renewableCostArea () {
      const yVals = _.map(this.dots[1], (dot, d) => dot.costs)
      const xVals = _.map(this.dots[1], (dot, d) => dot.yearCO)
      console.log('xvals', xVals)
      console.log('yvals', yVals)
      const areaplot = d3.area()
        .x(d => { return d.yearCO })
        .y0(this.scaleCo.y(10))
        .y1(d => d.costs)
      return areaplot(this.dots[1])
    },
    world () {
      return _.map(this.worldFilter, (energy, e) => {
        return _.map(energy, (single, s) => {
          return {
            year: this.scale.x(single.Year),
            value: this.scale.y(Math.sqrt(single.Value))
          }
        })
      })
    },
    groupPosition () {
      // length of dotsArray is  = nr of energy carrier
      // returns array with the position for each energy carrier
      const dotsArray = this.dots
      let pos = 70
      return _.map(this.regionFilter, (energy, e, l) => {
        if (e !== 0) { pos = pos + (1.1 * this.innerHeight) / dotsArray.length - 100 }
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
    console.log(`thisdots`, this.dots)
    this.calcSizes()
    console.log(this.areachart)
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
  height: 80vh;

  .key {
    z-index: 9;
    width: 100%;
    height: 100px;
    margin-bottom: 5%;
    padding: 20px 0px;

    top: 50px;

    background: hsla(0,0%,100%,.90);

    .highlight {
      margin-right: $margin-space;
      margin-top: 5px;
      margin-left: 10px;
    }
    .selectors {
      display: inline-block;
      width: 70%;
    }
    .scenario_selector {
      margin-top: $margin-space;
      margin-left: $margin-space;
      margin-right: $margin-space;
    }

    h4 {
      padding-left: 0px;
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
  .achart {
    background-color: getColor(yellow, 80);
  }
  svg {
    .axis {
      stroke: $color-gray;
    }
    circle {
      fill: $color-gray;
      fill-opacity: 0.6;
      transition: r 0.5s;
    }
    .axis-dot {
      fill-opacity: 1;
    }
    .world {
      fill-opacity: 0.2;
      stroke-dasharray: 2 2;
    }
    g {
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
    .Fossils {
      fill: getColor(gray, 80);
      stroke: getColor(gray, 40);
    }
    .Renewables {
      fill: getColor(yellow, 80);
      stroke: getColor(yellow, 40);
    }
    .FossilsArea {
      fill: getColor(gray, 80);
      stroke: getColor(gray, 40);
      opacity: 0.6;
    }
    .RenewablesArea {
      fill: getColor(yellow, 80);
      stroke: getColor(yellow, 40);
      opacity: 0.6;
    }
  }
}

</style>
