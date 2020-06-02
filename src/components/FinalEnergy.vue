Final<template>
  <div class="final-energy" ref="inWrapper">
    <div class="key" :class=" mobile ? 'mobile' : 'desktop'">
      <h4>Volume in <SensesTooltip :tooltip="tooltip">secondary energy</SensesTooltip> production (Ej/year)</h4>
      <p class="highlight">{{ model[0] }}</p>
      <p class="selectors">
        Select:
        <SensesSelect class="scenario_selector" :options="scenarios" v-model="currentScenario"/>
        <SensesSelect class="region_selector" :options="regions" v-model="currentRegion"/>
        <SensesSelect class="enduse_selector" :options="enduse" v-model="currentEnduse"/>
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
        <circle v-for="(dot, d) in group" v-bind:key="d + 'dot'" @mouseover="[active = true, over = d + labels[g]]" @mouseleave="active = false" :class="labels[g]" :cx="dot.year" cy="5" :r="dot.value"/>
        <!-- labels for energy carrier g-->
      <!-- labels for energy carrier -->
        <text :x="scale.x(2009)" y="40">{{ labels[g] }}</text>
      </g>
      <g v-for="(group, g) in world" v-bind:key="g + 'wgroup'" :class="`${labels[g]}-wgroup`" :transform="`translate(0, ${groupPosition[g]})`">
          <!--draws hotizontal axis line through dots and small circles at the beginning and end of axis -->
        <g class="axis_group">
          <line class="axis" y1="5" y2="5" :x1="scale.x(2010)" :x2="scale.x(2100)"/>
          <circle class="axis-dot" :cx="scale.x(2010)" cy="5" r="2.5"/>
          <circle class="axis-dot" :cx="scale.x(2100)" cy="5" r="2.5"/>
        </g>
        <g v-for="(text, t) in group" v-bind:key="t + 'text'" :class="active === true & over === t + labels[g] ? 'visible' : 'invisible'">
          <!-- draws little line with dot to indicate value and year of each dot -->
          <circle class="year-dot" :cx="text.year" cy="5" r="2.5"/>
          <text class="year-label" :x="text.year" y="20">{{ years[t] }}</text>
          <text class="year-label" :x="text.year" y="-35">{{ Math.round(text.value) }} Ej/year</text>
          <line class="line-label" :x1="text.year" :x2="text.year" y1="-25" y2="5"/>
        </g>
        <!-- draws dashed dots for world region -->
        <circle v-for="(dot, d) in group" v-bind:key="d + 'wdot'" @mouseover="[active = true, over = d + labels[g]]" @mouseleave="active = false" class="world" :class="labels[g]" :cx="dot.year" cy="5" :r="dot.value"/>
      </g>
    </svg>
  </div>
</template>

<script>
import _ from 'lodash'
import * as d3 from 'd3'

import FinalEnergy from 'dsv-loader!@/assets/data/FinalEnergy.csv' // eslint-disable-line import/no-webpack-loader-syntax
import SensesSelect from 'library/src/components/SensesSelect.vue'
import SensesTooltip from 'library/src/components/SensesTooltip.vue'

export default {
  name: 'RiskPathway',
  components: {
    SensesSelect,
    SensesTooltip
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
      // Dataset FinalEnergy is array with objects
      // [{},...,{}]
      FinalEnergy,
      // groupBy creates object composed of keys (coal, wind, ...)
      // generated from the results of running each
      // element of FinalEnergy thru iteratee d = {}
      // {"coal": [{},{}...],
      //   "wind": [{},{}...],
      //    ...
      //  }
      energy: _.groupBy(FinalEnergy, d => d.EnergySource),
      // map erstellt einen Array mit allen values des keys model
      // set erstellt einen Array mit allen einzigartigen Einträgen für Model
      // Model,Scenario,Region,Unit,Year,Value,Enduse,EnergySource
      model: [...new Set(FinalEnergy.map(r => r.Model))],
      years: [...new Set(FinalEnergy.map(r => r.Year))],
      labels: [...new Set(FinalEnergy.map(r => r.EnergySource))],
      scenarios: [...new Set(FinalEnergy.map(r => r.Scenario))],
      enduse: [...new Set(FinalEnergy.map(r => r.Enduse))],
      regions: [...new Set(FinalEnergy.map(r => r.Region))],
      allValues: [...new Set(FinalEnergy.map(r => r.Value))],
      tooltip: 'Here a description of what Final Energy is!',
      currentScenario: 'NPi_v3',
      currentRegion: 'World',
      currentEnduse: 'Industry',
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
    // filters over regioFilter Array, returns same array only with objects with CurrentEnduse
    enduseFilter () { return _.map(this.scenarioFilter, (end, e) => _.filter(end, d => d.Enduse === this.currentEnduse)) },
    // filters over scenrioFilter Array, returns same array only with objects with CurrentRegion
    regionFilter () { return _.map(this.enduseFilter, (re, r) => _.filter(re, d => d.Region === this.currentRegion)) },
    // filters over scenrioFilter Array, returns same array only with objects with region = World
    worldFilter () { return _.map(this.enduseFilter, (re, r) => _.filter(re, d => d.Region === 'World')) },
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
    // dots returns an array with the size of regionFilter
    // with just that values for year and value in pixel
    dots () {
      return _.map(this.regionFilter, (energy, e) => {
        return _.map(energy, (single, s) => {
          return {
            year: this.scale.x(single.Year),
            value: this.scale.y(Math.sqrt(single.Value))
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
      // length of dotsArray is 8 = nr of energy carrier
      // returns array with the position for each energy carrier
      const dotsArray = this.dots
      let pos = 80
      return _.map(this.regionFilter, (energy, e, l) => {
        if (e !== 0) { pos = pos + this.innerHeight / dotsArray.length }
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

.final-energy {
  height: 170vh;

  .key {
    z-index: 9;
    width: 100%;
    height: 100px;
    margin-bottom: 10%;
    padding: 10px 0px;

    position:sticky;
    top: 50px;

    border-bottom:0.5px solid blue;
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
      padding-left: 10px;
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
    .Electricity {
      fill: getColor(gray, 80);
      stroke: getColor(gray, 40);
    }
    .Gases {
      fill: getColor(red, 80);
      stroke: getColor(red, 40);
    }
    .Heat {
      fill: getColor(orange, 80);
      stroke: getColor(orange, 40);
    }
    .Liquids {
      fill: getColor(blue, 80);
      stroke: getColor(blue, 40);
    }
    .Hydrogen {
      fill: getColor(violet, 80);
      stroke: getColor(violet, 40);
    }
    .Solids {
      fill: lighten(#663333, 40);
      stroke: darken(#663333, 30);
    }
  }
}

</style>
