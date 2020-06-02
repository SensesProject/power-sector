n<template>
  <div class="secondary-energy" ref="inWrapper">
    <div class="key" :class=" mobile ? 'mobile' : 'desktop'">
      <h4>Cost Structure</h4>
      <p class="selectors">
        Select a scenario and a region:
        <SensesSelect class="scenario_selector" :options="scenarios" v-model="currentScenario"/>
        <SensesSelect class="region_selector" :options="regions" v-model="currentRegion"/>
      </p>
    </div>
    <div></div>
    <svg :width="innerWidth" :height="innerHeight" :transform="`translate(${margin.left}, 0)`">
      <!-- dots is array with 8 key value pairs, one for each energy carrier, g is index 0-7
      v-bind key provides a unique key attribute for each item
      a class is defined for each energy carrier-group
      transform:translate moves the dots 0 px (x-value) and y-value:groupposition(g)
      groupposition is an array with 8 positions, one for each energy carrier-->
      <g v-for="(group, g) in dots" v-bind:key="g + 'group'" :class="`${labels[g]}-group`" :transform="`translate(0, ${groupPosition[g]})`">
        <!-- draws dots for energy carrier with index g   -->
        <g v-for="(dot, d) in group" v-bind:key="d + 'dot'">
          <circle :class="labels[g]" :cx="dot.year" cy="5" r="30"/>
        <!-- builds pie chart-->
          <circle :class="'omcost_per'"
          v-bind:r="15" :cx="dot.year" cy="5" fill="transparent"
          :stroke-width="30"
          :stroke-dasharray= "`calc(` + dot.perOM + `*3.142*30/100) calc(3.142*2*15)`"
          :transform="transform(dot, 0)"
          />
          <circle :class="'fuelcost_per'"
          v-bind:r="15" :cx="dot.year" cy="5" fill="transparent"
          :stroke-width="30"
          :stroke-dasharray= "`calc(` + dot.perFuel + `*3.142*30/100) calc(3.142*2*15)`"
          :transform="transform(dot, 1)"
          />
          <circle :class="'capcost_per'"
          v-bind:r="15" :cx="dot.year" cy="5" fill="transparent"
          :stroke-width="30"
          :stroke-dasharray= "`calc(` + dot.perCap + `*3.142*30/100) calc(3.142*2*15)`"
          :transform="transform(dot, 2)"
          />
          <!-- white circle on top to create donut chart-->
          <circle :class="'WhiteCirc'" :cx="dot.year" cy="5" v-bind:r="`calc(30/1.5)`"/>
        </g>        <!-- :transform="`rotate(-10 ${dot.year + margin.left } ${ margin.left + 5 })`"-->
        <text :x="scale.x(2009)" y="40">{{ labels[g] }}</text>
      </g>
      <g v-for="(group, g) in world" v-bind:key="g + 'wgroup'" :class="`${labels[g]}-wgroup`" :transform="`translate(0, ${groupPosition[g]})`">
          <!--draws hotizontal axis line through dots and small circles at the beginning and end of axis -->
        <g class="axis_group">
          <line class="axis" y1="5" y2="5" :x1="scale.x(2010)" :x2="scale.x(2100)"/>
          <circle class="axis-dot" :cx="scale.x(2010)" cy="5" r="2.5"/>
          <circle class="axis-dot" :cx="scale.x(2100)" cy="5" r="2.5"/>
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
import _ from 'lodash'
import * as d3 from 'd3'

import CostStructureAgg from 'dsv-loader!@/assets/data/CostStructureAgg.csv' // eslint-disable-line import/no-webpack-loader-syntax
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
      CostStructureAgg,
      // Dataset SecondaryEnergy is array with objects
      // [{},...,{}]
      energy: _.groupBy(CostStructureAgg, d => d.Variable),
      // map erstellt einen Array mit allen values des keys model
      // set erstellt einen Array mit allen einzigartigen Einträgen für Model
      model: [...new Set(CostStructureAgg.map(r => r.Model))],
      years: [...new Set(CostStructureAgg.map(r => r.Year))],
      labels: [...new Set(CostStructureAgg.map(r => r.Variable))],
      perLabels: ['perCap', 'perFuel', 'perOM'],
      scenarios: [...new Set(CostStructureAgg.map(r => r.Scenario))],
      regions: [...new Set(CostStructureAgg.map(r => r.Region))],
      allValues: [...new Set(CostStructureAgg.map(r => r.Value))],
      tooltip: 'Here a description of what Secondary Energy is!',
      currentScenario: 'NPi_v3',
      currentRegion: 'Asia (No Japan)',
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
    scale () {
      // domain-> observartio EJ/yr, range-> visual variable px
      return {
        x: d3.scaleLinear()
          .range([50, this.innerWidth - (this.margin.right * 10)])
          .domain([2010, 2100]),
        y: d3.scaleLinear()
          .range([2, 500])
          .domain([d3.min(this.allValues), d3.max(this.allValues)])
      }
    },
    // dots returns values for year and value in pixel, and Costs in percentage
    dots () {
      const regionFilter = this.regionFilter
      console.log('regionFilter')
      console.log(regionFilter)
      return _.map(this.regionFilter, (energy, e) => {
        return _.map(energy, (single, s) => {
          return {
            year: this.scale.x(single.Year),
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
            value: this.scale.y(Math.sqrt(single.Value))
          }
        })
      })
    },
    groupPosition () {
      // length of dotsArray is  = nr of energy carrier
      // returns array with the position for each energy carrier
      const dotsArray = this.dots
      console.log('dotsArrayAGG')
      console.log(dotsArray)
      let pos = 70
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
      margin-bottom: 10px;
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
    .Aggregate {
      fill: getColor(gray, 100);
      stroke: getColor(gray, 40);
    }
    .Wind {
      fill: lighten(#336666, 40);
      stroke: darken(#336666, 30);
    }
    .WhiteCirc {
      fill: getColor(gray, 100);
      opacity: 1;
      stroke: getColor(gray, 40);
    }
    .omcost_per{
      stroke: getColor(yellow, 60);
      fill-opacity: 0.6;
    }
    .capcost_per{
      stroke: #8d88ff;
      fill-opacity: 0.6;
    }
    .fuelcost_per{
      stroke: getColor(green, 60);
      fill-opacity: 0.6;
    }
  }
}

</style>
