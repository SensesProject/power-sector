<template>
  <div class="secondary-energy" ref="inWrapper">
    <div class="key" :class=" mobile ? 'mobile' : 'desktop'">
      <h3>Electricity production and changing costs structure</h3>
      <a href="https://docs.messageix.org/projects/global/en/latest/" target="_blank">(Model: MESSAGEix-GLOBIOM_1.0)</a>
      <p class="selectors">
        Select a scenario and a region:
        <SensesSelect class="scenario_selector" :options="scenarios" v-model="currentScenario"/>
        <SensesSelect class="region_selector" :options="regions" v-model="currentRegion"/>
      </p>
    </div>
    <div></div>
    <svg :width="innerWidth" :height="innerHeight" :transform="`translate(${margin.left}, 0)`">
      <g v-for="(group, g) in dots.slice(0, 2)" v-bind:key="g + 'group'" :class="`${labels[g]}-group`" :transform="`translate(0, ${groupPosition[g]})`">
        <!-- draws dots for energy carrier with index g   -->
        <g v-for="(dot, d) in group" v-bind:key="d + 'dot'" @mouseover="[active = true, over = d + labels[g]]" @mouseleave="active = false">
          <g   v-if="d == 0 || d == 2 || d == 4 || d == 6|| d == 8" >
            <circle :class="labels[g]" :cx="dot.year" cy="5" :r="dot.value"/>
          </g>
          <!-- year labels for first and last year in dataset -->
          <g v-for="(text, t) in group" :key="t + 'text'" >
            <g v-if="t == 0 || t == 8">
            </g>
          </g>
        <g   v-if="d == 0 || d == 2 || d == 4 || d == 6|| d == 8" >
        <!-- builds pie chart-->
          <circle :class="'omcost_per'"
          :r="dot.value/2" :cx="dot.year" cy="5" fill="transparent"
          :stroke-width="dot.value"
          :stroke-dasharray= "(dot.perOM *3.142* dot.value/100)+', '+(3.142*dot.value)"
          :transform="transform(dot, 0)"
          />
          <circle :class="'fuelcost_per'"
          :r="dot.value/2" :cx="dot.year" cy="5" fill="transparent"
          :stroke-width="dot.value"
          :stroke-dasharray= "(dot.perFuel *3.142* dot.value/100)+', '+(3.142*dot.value)"
          :transform="transform(dot, 1)"
          />
          <circle :class="'capcost_per'"
          :r="dot.value/2" :cx="dot.year" cy="5" fill="transparent"
          :stroke-width="dot.value"
          :stroke-dasharray= "(dot.perCap *3.142* dot.value/100)+', '+(3.142*dot.value)"
          :transform="transform(dot, 2)"
          />
          <!-- white circle on top to create donut chart-->
          <circle :class="'WhiteCirc'" :cx="dot.year" cy="5" v-bind:r="(dot.value-margin.left*1.5)"/>
          </g>
        </g>        <!-- :transform="`rotate(-10 ${dot.year + margin.left } ${ margin.left + 5 })`"-->
        <text class="carrier-label" :x="scale.x(2019)" y="45">{{ labelsGraph[g] }}</text>
        <g v-for="(text, t) in group" :key="t + 'text'" >
          <g v-if="t == 0 || t == 8">
          <text class="year-label" :x="text.year" y="20">{{ years[t] }}</text>
          </g>
        </g>
      </g>
      <g v-for="(group, g) in world.slice(0, 2)" v-bind:key="g + 'wgroup'" :class="`${labels[g]}-wgroup`" :transform="`translate(0, ${groupPosition[g]})`">
          <!--draws hotizontal axis line through dots and small circles at the beginning and end of axis -->
        <g class="axis_group">
          <line class="axis" y1="5" y2="5" :x1="scale.x(2020)" :x2="scale.x(2100)"/>
          <circle class="axis-dot" :cx="scale.x(2020)" cy="5" r="2.5"/>
          <circle class="axis-dot" :cx="scale.x(2100)" cy="5" r="2.5"/>
        </g>
        <!--hover over values for data -->
        <g v-for="(text, t) in group" v-bind:key="t + 'text'" :class="active === true & over === t + labels[g] ? 'visible' : 'invisible'">
          <circle class="axis-dot" :cx="text.year" cy="5" r="2.5"/>
          <text class="year-label" :x="text.year" y="-63">Fuel cost: {{ Math.round(text.perFuel) }} % </text>
          <text class="year-label" :x="text.year" y="-93">Oper. cost: {{ Math.round(text.perOM) }} % </text>
          <text class="year-label" :x="text.year" y="-78">Capital cost: {{ Math.round(text.perCap) }} % </text>
          <line class="line-label" :x1="text.year" :x2="text.year" y1="-55" y2="5"/>
        </g>
      </g>
      <!--legend for pie chart  -->
      <g>
      <circle class="legend" id="capital" :r="25" :cx="scale.x(2017)" :cy="innerHeight*0.75" fill="transparent"/>
      <text class="carrier-label" :x="scale.x(2021)" :y="innerHeight*0.74" >Capital cost</text>
      <circle class="legend" id="oper" :r="25" :cx="scale.x(2030)" :cy="innerHeight*0.75" fill="transparent"/>
      <text class="carrier-label" :x="scale.x(2034)" :y="innerHeight*0.74" >Operational cost</text>
      <circle class="legend" id="fuel" :r="25" :cx="scale.x(2045.5)" :cy="innerHeight*0.75" fill="transparent"/>
      <text class="carrier-label" :x="scale.x(2049.5)" :y="innerHeight*0.74" >Fuel cost, incl. carbon emission costs</text>
      </g>
    </svg>
  </div>
</template>

<script>
import _ from 'lodash'
import * as d3 from 'd3'

import SecondaryEnergyAndAllCosts from 'dsv-loader!@/assets/data/SecondaryEnergyAndAllCosts.csv' // eslint-disable-line import/no-webpack-loader-syntax
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
      SecondaryEnergyAndAllCosts,
      // groupBy creates object composed of keys (coal, wind, ...)
      // generated from the results of running each
      // element of SecondaryEnergyAndAllCost thru iteratee d = {}
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
      labelsGraph: ['Fossil fuels', 'Renewables and nuclear'],
      perLabels: ['perCap', 'perFuel', 'perOM'],
      scenarios: ['1.5ºC', '2.0ºC', 'Current Policies'],
      scenDict: { '1.5ºC': 'NPi2020_400_v3', '2.0ºC': 'NPi2020_1000_v3', 'Current Policies': 'NPi_v3' },
      regions: [...new Set(SecondaryEnergyAndAllCosts.map(r => r.Region))],
      allValues: [...new Set(SecondaryEnergyAndAllCosts.map(r => r.Value))],
      tooltip: 'Here a description of what Secondary Energy is!',
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
    // dots returns values for year and value in pixel, and Costs in percentage
    dots () {
      return _.map(this.regionFilter, (energy, e) => {
        return _.map(energy, (single, s) => {
          return {
            year: this.scale.x(single.Year),
            value: this.scale.y(Math.sqrt(single.Value)),
            perCap: single.CAPCOST_p,
            perFuel: single.FUELCOST_p,
            perOM: single.OMCOST_p
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
            perCap: single.CAPCOST_p,
            perFuel: single.FUELCOST_p,
            perOM: single.OMCOST_p
          }
        })
      })
    },
    groupPosition () {
      // length of dotsArray is  = nr of energy carrier
      // returns array with the position for each energy carrier
      const dotsArray = this.dots.slice(0, 2)
      let pos = 100
      return _.map(this.regionFilter, (energy, e, l) => {
        if (e !== 0) { pos = pos + this.innerHeight / dotsArray.length - 100 }
        return pos
      })
    }
  },
  methods: {
    // compute rotation for each pieces of pie chart
    transform (dot, ind) {
      let perIni = 0
      let deg = 0
      if (ind === 0) {
        perIni = 0
      } else if (ind === 1) {
        perIni = dot.perOM
      } else if (ind === 2) {
        perIni = parseFloat(dot.perOM) + parseFloat(dot.perFuel)
      }
      // conversion of percentage to degree
      deg = perIni / 100 * 360 - 90
      return `rotate(${deg} ${dot.year} ${5})`
    },
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
$margin-space: $spacing / 2;

.secondary-energy {
  height: 85vh;

  .key {
    z-index: 9;
    width: 100%;
    height: 100px;
    margin-bottom: 2%;
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
      margin-bottom: $margin-space/10;
      }
      a {
        margin-top: 5px;
        color: getColor(neon, 40);
        font-weight: normal;
        display: inline;
        margin-left: $margin-space/2;
        text-decoration: none;
        background: none;
      }
    .scenario_selector {
      margin-top: $margin-space;
      margin-left: $margin-space/2;
      //margin-right: $margin-space;
    }

    h3 {
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
  svg {
    height: 80%;
    .axis {
      stroke: $color-gray;
      stroke-width: 0.3;
    }
    circle {
      transition: r 0.5s;
    }
    .axis-dot {
      fill-opacity: 1;
      fill: $color-gray;
    }
    .world {
      fill-opacity: 0.2;
      stroke-dasharray: 2 2;
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
      fill: getColor(gray, 100);
      stroke: getColor(gray, 40);
    }
    .Low-carbon {
      fill: getColor(gray, 100);
      stroke: getColor(gray, 40);
    }
    .WhiteCirc {
      fill: getColor(gray, 100);
      opacity: 1;
      stroke: getColor(gray, 40);
    }
    .omcost_per{
      // stroke: getColor(yellow, 60);
      stroke: $color-yellow ;
      fill-opacity: 0.6;
      stroke-opacity: 0.6;
    }
    .capcost_per{
      stroke: getColor(blue, 60);
      fill-opacity: 0.7;
      stroke-opacity: 0.5;
    }
    .fuelcost_per{
      stroke: getColor(blue, 20) ;
      fill-opacity: 0.6;
      stroke-opacity: 0.7;
    }

    .legend{
      stroke-dasharray: 0 135 60;
      stroke-width: 14;
      stroke-opacity: 0.7;
        &#capital {
          stroke: getColor(blue, 60);
        }
        &#fuel {
          stroke: getColor(blue, 20);
        }
        &#oper {
          stroke: $color-yellow;
        }
    }
  }
}

</style>
