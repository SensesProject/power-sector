<template>
  <div class="secondary-energy" ref="inWrapper">
    <div class="key" :class=" mobile ? 'mobile' : 'desktop'">
      <h4>Energy production (Ej/year) and capital costs ($/yr | $/MWh) </h4>
      <p class="selectors">
        Select a scenario and cost type:
        <SensesSelect class="scenario_selector" :options="scenarios" v-model="currentScenario"/>
        <!-- selctor for bar chart between costs and costs per MWh -->
        <SensesSelect class="MWh_selector" :options="MWhSel" v-model="currentMWhSel"/>
      </p>
    </div>
    <div></div>
    <svg :width="(innerWidth)" :height="innerHeight" :transform="`translate(${margin.left}, 0)`">
      <g v-for="(group, g) in dots" v-bind:key="g + 'group'" :class="`${labels[g]}-group`" :transform="`translate(0, ${groupPosition[g]})`">
        <!-- draws dots for energy carrier with index g   -->
        <g>
        <circle v-for="(dot, d) in group" v-bind:key="d + 'dot'" @mouseover="[active = true, over = d + labels[g]]" @mouseleave="active = false" :class="labels[g]" :cx="dot.year" cy="5" :r="dot.value"/>
        <!-- labels for energy carrier g-->
      <!--  <text :x="scale.x(2019)" y="50">{{ labels[g] }}</text> -->
        </g>
        <!-- year labels for first and last year in dataset
        <g v-for="(text, t) in group" :key="t + 'text'" >
          <g v-if="t == 0 || t == 8">
          <text class="year-label" :x="text.year" y="20">{{ years[t] }}</text>
          </g>
        </g> -->
      </g>
    <g v-for="(group, g) in world" v-bind:key="g + 'wgroup'" :class="`${labels[g]}-wgroup`" :transform="`translate(0, ${groupPosition[g]})`">
      <!--   draws hotizontal axis line through dots and small circles at the beginning and end of axis
        <g class="axis_group">
            <line class="axis" y1="5" y2="5" :x1="scale.x(2020)" :x2="scale.x(2100)"/>
          <circle class="axis-dot" :cx="scale.x(2020)" cy="5" r="2.5"/>
          <circle class="axis-dot" :cx="scale.x(2100)" cy="5" r="2.5"/>
        </g>  -->
        <!-- Hover over, shows values for each dot -->
        <g v-for="(text, t) in group" v-bind:key="t + 'text'" :class="active === true & over === t + labels[g] ? 'visible' : 'invisible'">
          <circle class="year-dot" :cx="text.year" cy="5" r="2.5"/>
          <text class="year-label" :x="text.year" y="20">{{ years[t] }}</text>
          <text class="year-label" :x="text.year" y="-15">{{ Math.round(text.value) }} Ej/year</text>
          <line class="line-label" :x1="text.year" :x2="text.year" y1="-25" y2="5"/>
        </g>
      </g>
    <!--separation line-->
    <line class="axis" :x1="0" :y1="(0.5*innerHeight)" :x2="0.95*innerWidth" :y2="(0.5*innerHeight)" />
    <line class="axis" :x1="0" :y1="(0.9*innerHeight)" :x2="0.95*innerWidth" :y2="(0.9*innerHeight)" />
    <!--barchart-->
      <g v-for="(group, g) in dots" v-bind:key="g + 'rgroup'" :class="`${labels[g]}-group`" >
        <g>
        <rect v-for="(rec, r) in group" v-bind:key="r + 'rect'" :class="`${labels[g]}`" :width="rec.barWidth" :x="(rec.year+barXshift[g])" :y="(rec.barY+0.5*innerHeight)" :height="rec.costs"/>
        </g>
      </g>
      <!--x Axis-->
      <g v-for="(year, j) in years" v-bind:key="j+'year'">
        <line class="axis" :x1="scale.x(year)" y1="0" :x2="scale.x(year)" :y2="(0.9*innerHeight)"/>
        <text class="year-label" :x="scale.x(year)" :y="(0.92*innerHeight)">{{ years[j] }}</text>
      </g>
      <!--y Axis-->
      <g v-for="(val, v) in yTicks[0]" v-bind:key="v+'val'">
        <line class="axis" x1="35" :y1="(0.9 * innerHeight) - yTicks[1][v]" x2="50" :y2="(0.9 * innerHeight) - yTicks[1][v]"/>
        <text class="year-label" x="24" :y="(0.9 * innerHeight) - yTicks[1][v] - 3" > {{ val }} </text>
      </g>
      <g>
        <!--Units y Axis-->
        <text class="year-label" x="27" :y="(0.9 * innerHeight) - yLabel[1]" > {{ yLabel[0] }} </text>
      </g>
      <!--legend  -->
      <g>
        <text :x="scale.x(2020)" :y="innerHeight*0.98" >Fossils</text>
        <circle :cx="scale.x(2018)" :cy="innerHeight*0.974" r="8" :class="'Fossils'"/>
        <text :x="scale.x(2034)" :y="innerHeight*0.98" >Renewables</text>
        <circle :cx="scale.x(2032)" :cy="innerHeight*0.974" r="8" :class="'Renewables'"/>
      </g>
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
      allCAPCOST: [...new Set(SecondaryEnergyAndTotalCostWorld.map(r => r.CAPCOST))],
      allCAPCOST_MWh: [...new Set(SecondaryEnergyAndTotalCostWorld.map(r => r.CAPCOST_MWh))],
      MWhSel: ['Capital Cost', 'Capital Cost per MWh'],
      tooltip: 'Here a description of what Secondary Energy is!',
      currentMWhSel: 'Capital Cost',
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
    worldFilterAllCapcost () {
      let vals = []
      _.forEach(this.SecondaryEnergyAndTotalCostWorld, (data, d) => {
        if (data.Region === 'World') {
          vals.push(data.CAPCOST)
        }
      })
      return vals
    },
    // filters only the values of world from all costs per MWh
    // since there are "inf" or no values for certain regions in datsets
    worldFilterAllCapcost_MWh () {
      let vals = []
      _.forEach(this.SecondaryEnergyAndTotalCostWorld, (data, d) => {
        if (data.Region === 'World') {
          vals.push(data.CAPCOST_MWh)
        }
      })
      return vals
    },
    // calculates width between years to calculate width of single bar in dots
    sectWidth () {
      let inwidth = this.innerWidth
      let margleft = this.margin.left
      let margright = this.margin.right
      let yearcount = this.years.length
      const sewidth = (inwidth - ((4 * margleft) + (margright * 4))) / yearcount
      return sewidth
    },
    // dots returns an array with the size of regionFilter
    // with just that values for year and value in pixel
    scale () {
      // domain-> observartio EJ/yr, range-> visual variable px
      return {
        x: d3.scaleLinear()
          .range([50, this.innerWidth - (this.margin.right * 12)])
          .domain([2020, 2100]),
        y: d3.scaleLinear()
          .range([2, 2000])
          .domain([d3.min(this.allValues, s => +s), d3.max(this.allValues, s => +s)])
      }
    },
    // ScaleCo for Barchart for Costs
    scaleCo () {
      return {
        x: d3.scaleLinear()
          .range([4 * this.margin.left, this.innerWidth - (this.margin.right * 4)])
          .domain([2020, 2110]),
        y: d3.scaleLinear()
          .range([0, 0.4 * this.innerHeight])
          .domain([0, d3.max(this.worldFilterAllCapcost, s => +s)])
      }
    },
    // ScaleCo_MWh for Barchart for Costs per MWh
    scaleCo_MWh () {
      return {
        x: d3.scaleLinear()
          .range([4 * this.margin.left, this.innerWidth - (this.margin.right * 4)])
          .domain([2020, 2110]),
        y: d3.scaleLinear()
          .range([0, 0.4 * this.innerHeight])
          .domain([0, d3.max(this.worldFilterAllCapcost_MWh, s => +s)])
      }
    },
    dots () {
      return _.map(this.worldFilter, (energy, e) => {
        return _.map(energy, (single, s) => {
          return {
            year: this.scale.x(single.Year),
            value: this.scale.y(Math.sqrt(single.Value)),
            yearCO: this.scaleCo.x(single.Year),
            costs: this.currentMWhSel === 'Capital Cost' ? this.scaleCo.y(single.CAPCOST) : this.scaleCo_MWh.y(single.CAPCOST_MWh),
            barWidth: (0.8 * this.sectWidth) / 4,
            // barY determines y value where to draw bar
            barY: this.currentMWhSel === 'Capital Cost' ? (0.4 * this.innerHeight) - this.scaleCo.y(single.CAPCOST) : (0.4 * this.innerHeight) - this.scaleCo_MWh.y(single.CAPCOST_MWh)
          }
        })
      })
    },
    CostTotalExtremes () {
      return {
        min: d3.min(this.allCAPCOST, s => +s),
        max: d3.max(this.allCAPCOST, s => +s)
      }
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
      let pos = 40
      return _.map(this.regionFilter, (energy, e, l) => {
        if (e !== 0) { pos = pos + (1.1 * this.innerHeight) / dotsArray.length - 200 }
        return pos
      })
    },
    barXshift () {
      // length of dotsArray is  = nr of energy carrier
      // returns array with the position for each energy carrier
      const shiftarray = [0, (0.8 * this.sectWidth) / 3.3]
      return shiftarray
    },
    // Calculation of values for y-Axis Scale
    yTicks () {
      const costMwhTicksArray = [['0', '50', '100', '150', '200'],
        [this.scaleCo_MWh.y(0), this.scaleCo_MWh.y(50), this.scaleCo_MWh.y(100), this.scaleCo_MWh.y(150), this.scaleCo_MWh.y(200)]]
      const costTicksArray = [['0', '20', '40', '60', '80', '100', '120'],
        [this.scaleCo.y(0), this.scaleCo.y(2000000), this.scaleCo.y(4000000), this.scaleCo.y(6000000), this.scaleCo.y(8000000), this.scaleCo.y(10000000), this.scaleCo.y(12000000)]]
      let tickVal = this.currentMWhSel === 'Capital Cost' ? costTicksArray : costMwhTicksArray
      return tickVal
    },
    yLabel () {
      const labelCost = ['BN$/yr', this.scaleCo.y(14000000)]
      const labelCostMwh = ['$/MWh', this.scaleCo.y(14000000)]
      let ylab = this.currentMWhSel === 'Capital Cost' ? labelCost : labelCostMwh
      return ylab
    }
  },
  methods: {
    calcSizes () {
      console.log('max', d3.max(this.worldFilterAllCapcost_MWh))
      console.log('tickval', this.yTicks)
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
  height: 80vh;

  .key {
    z-index: 9;
    width: 100%;
    height: 100px;
    margin-bottom: 1%;
    padding: 80px 0px;

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
  svg {
    .axis {
      stroke: $color-gray;
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
      fill: #6A7687;
      stroke: darken(#6A7687, 40);
    }
    .Renewables {
      fill: getColor(green, 80);
      stroke: getColor(green, 40);
    }
    .FossilsArea {
      fill: #6A7687;
      stroke: darken(#6A7687, 40);
      opacity: 0.6;
    }
    .RenewablesArea {
      fill: getColor(green, 80);
      stroke: getColor(green, 40);
      opacity: 0.6;
    }
  }
}

</style>
