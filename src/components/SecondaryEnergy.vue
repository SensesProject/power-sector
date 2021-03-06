<template>
  <div class="secondary-energy" ref="inWrapper">
    <div class="key" :class=" mobile ? 'mobile' : 'desktop'">
      <h3>Electricity production in the power sector</h3>
      <a href="https://docs.messageix.org/projects/global/en/latest/" target="_blank">(Model: MESSAGEix-GLOBIOM_1.0)</a>
      <p class="selectors">
        Select a scenario and a region:
        <SensesSelect class="scenario_selector" :options="scenarios" v-model="currentScenario"/>
        <SensesSelect class="region_selector" :options="regions" v-model="currentRegion"/>
        <span class="legend">
          <span class="dot"></span>
          <span > = 3 000 TWh/yr</span>
          <span class="dot" id="world"></span>
          <span > World (reference)</span>
        </span>
      </p>
      <p class="Carrier-groups">
        <span>Renewables and nuclear</span>
        <span class="Fossil-group">Fossil fuels</span>
      </p>
    </div>
    <div></div>
    <svg :width="innerWidth" :height="innerHeight" :transform="`translate(0, 0)`">
      <g v-for="(group, g) in dots" v-bind:key="g + 'group'" :class="`${labels[g]}-group`" :transform="`translate(${verticalPosition[g]}, ${groupPosition[g]})`">
        <circle v-for="(dot, d) in group" v-bind:key="d + 'dot'" @mouseover="[active = true, over = d + labels[g]]" @mouseleave="active = false" :class="labels[g]" :cx="dot.year" cy="5" :r="dot.value"/>
        <text class="carrier-label" :x="scale.x(2019)" y="40">{{ labels[g] }}</text>
      </g>
      <g v-for="(group, g) in world" v-bind:key="g + 'wgroup'" :class="`${labels[g]}-wgroup`" :transform="`translate(${verticalPosition[g]}, ${groupPosition[g]})`">
        <g class="axis_group">
          <line class="axis" y1="5" y2="5" :x1="scale.x(2020)" :x2="scale.x(2100)"/>
          <circle class="axis-dot" :cx="scale.x(2020)" cy="5" r="2.5"/>
          <circle class="axis-dot" :cx="scale.x(2100)" cy="5" r="2.5"/>
        </g>
        <g v-for="(text, t) in group" v-bind:key="t + 'text'" :class="active === true & over === t + labels[g] ? 'visible' : 'invisible'">
          <circle class="year-dot" :cx="text.year" cy="5" r="2.5"/>
          <text class="year-label" :x="text.year" y="20">{{ years[t] }}</text>
          <text class="year-label" :x="text.year" y="-35">{{ format(Math.round(text.valueTWh)) }} TWh/yr</text>
          <line class="line-label" :x1="text.year" :x2="text.year" y1="-25" y2="5"/>
        </g>
        <circle v-for="(dot, d) in group" v-bind:key="d + 'wdot'" @mouseover="[active = true, over = d + labels[g]]" @mouseleave="active = false" class="world" :class="labels[g]" :cx="dot.year" cy="5" :r="dot.value"/>
      </g>
    </svg>
  </div>
</template>

<script>
import _ from 'lodash'
import * as d3 from 'd3'

import SecondaryEnergy from 'dsv-loader!@/assets/data/SecondaryEnergy.csv' // eslint-disable-line import/no-webpack-loader-syntax
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
      SecondaryEnergy,
      energy: _.groupBy(SecondaryEnergy, d => d.Variable),
      model: [...new Set(SecondaryEnergy.map(r => r.Model))],
      years: [...new Set(SecondaryEnergy.map(r => r.Year))],
      labels: [...new Set(SecondaryEnergy.map(r => r.Variable))],
      scenarios: ['1.5ºC', '2.0ºC', 'Current Policies'],
      scenDict: { '1.5ºC': 'NPi2020_400_v3', '2.0ºC': 'NPi2020_1000_v3', 'Current Policies': 'NPi_v3' },
      regions: [...new Set(SecondaryEnergy.map(r => r.Region))],
      allValues: [...new Set(SecondaryEnergy.map(r => r.Value))],
      tooltip: 'Here a description of what Secondary Energy is!',
      currentScenario: '1.5ºC',
      currentRegion: 'World',
      active: false,
      over: '',
      margin: {
        top: 10,
        bottom: 400,
        right: 10,
        left: 10
      },
      innerHeight: 0
    }
  },
  computed: {
    innerWidth () { return this.width - (this.margin.left + this.margin.right) },
    scenarioFilter () { return _.map(this.energy, (sc, s) => _.filter(sc, d => d.Scenario === this.scenDict[this.currentScenario])) },
    regionFilter () { return _.map(this.scenarioFilter, (re, r) => _.filter(re, d => d.Region === this.currentRegion)) },
    worldFilter () { return _.map(this.scenarioFilter, (re, r) => _.filter(re, d => d.Region === 'World')) },
    scale () {
      return {
        x: d3.scaleLinear()
          .range([35, (this.innerWidth - (this.margin.right * 10)) / 2])
          .domain([2020, 2100]),
        y: d3.scaleLinear()
          .range([2, 800])
          .domain([d3.min(this.allValues, s => +s), d3.max(this.allValues, s => +s)])
      }
    },
    dots () {
      return _.map(this.regionFilter, (energy, e) => {
        return _.map(energy, (single, s) => {
          return {
            year: this.scale.x(single.Year),
            value: this.scale.y(Math.sqrt(single.Value)),
            valueTWh: single.Value * 277.78 // conversion from EJ to TWh
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
            valueTWh: single.Value * 277.78 // conversion from EJ to TWh
          }
        })
      })
    },
    groupPosition () {
      console.log('dots', this.dots)
      console.log('world', this.world)
      // const dotsArray = this.dots
      let pos = -70
      let posDx = -70
      const positions = []
      _.map(this.regionFilter, (energy, e, l) => {
        if (e > 3) {
          pos = pos + this.innerHeight / 5
          positions.push(pos)
        } else {
          posDx = posDx + this.innerHeight / 5
          positions.push(posDx)
        }
      })
      return positions
    },
    verticalPosition () {
      let pos = 0
      return _.map(this.regionFilter, (energy, e, l) => {
        if (e <= 3) { pos = this.innerWidth / 2 + 5 } else { pos = 0 }
        return pos
      })
    }
  },
  methods: {
    calcSizes () {
      const { inWrapper: el } = this.$refs
      const innerHeight = el.clientHeight || el.parentNode.clientHeight
      this.innerHeight = Math.max(innerHeight, 500)
    },
    format (value) {
      return d3.format(',')(value).replace(/,/g, ' ')
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
  height: 80%;

  .key {
    z-index: 9;
    width: 100%;
    height: 110px;
    margin-bottom: 0.5%;
    position:sticky;
    top: 50px;

    //border-bottom:0.5px solid grey;
    background: hsla(0,0%,100%,.90);

    .highlight {
      margin-right: $margin-space;
      margin-top: 5px;
      margin-left: 10px;
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
    .Carrier-groups {
      margin-top: 3%;
      padding-left: 10px;
      margin-left: $margin-space;
      font-size: 0.7em;
      font-weight: bold;
      .Fossil-group{
        margin-left: 35%;
      }
    }
    .selectors {
      padding-left: 10px;
      display: flex;
      width: 100%;
      margin-left: $margin-space;
      .legend{
        padding-bottom: 0.5%;
        margin-left: $margin-space*1.5;
        font-size: 0.7em;
        flex-direction: row;
        align-items: center;
        .dot {
          border-radius: 50%;
          width: 27px;
          height: 27px;
          display: inline-block;
          border: 1px solid grey;
          margin-right: 3px;
          &#world {
            border-style: dashed;
            margin-left: $margin-space;
            margin-right: $margin-space/3;
            }
        }
      }
    }
    .scenario_selector {
      margin-left: $margin-space/2;
      margin-right: $margin-space/2;
    }
    .region_selector {
      margin-right: $margin-space*2;
    }

    h3 {
      padding-left: 10px;
      padding-bottom: 10px;
      display: inline-block;
      margin-left: $margin-space;
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
    padding-bottom: 2%;
    margin-left: $margin-space*1.5;
    font-size: 0.7em;
    display: flex;
    flex-direction: row;
    align-items: center;
    .dot {
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: inline-block;
      border: 1px solid grey;
      margin-right: 3px;
      &#world {
        border-style: dashed;
        margin-left: $margin-space;
        margin-right: $margin-space/3;
        }
    }
  }
  svg {
    height: 100%;
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
      .carrier-label {
        font-size: 0.7em;
      }
      .year-label {
        text-anchor: middle;
        fill: black;
        font-size: 10px;
        text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white;
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
    .Coal {
      fill: getColor(gray, 80);
      stroke: getColor(gray, 40);
    }
    .Gas.without.CCS {
      fill: getColor(red, 80);
      stroke: getColor(red, 40);
    }
    .Gas.with.CCS {
      fill: getColor(red, 80);
      stroke: getColor(red, 40);
    }
    .Oil {
      fill: getColor(orange, 80);
      stroke: getColor(orange, 40);
    }
    .Nuclear {
      fill: getColor(purple, 80);
      stroke: getColor(purple, 40);
    }
    .Hydro {
      fill: getColor(blue, 80);
      stroke: getColor(blue, 40);
    }
    .Geothermal {
      fill: lighten(#663333, 40);
      stroke: darken(#663333, 30);
    }
    .Solar {
      fill: getColor(yellow, 80);
      stroke: getColor(yellow, 40);
    }
    .Wind {
      fill: lighten(#336666, 40);
      stroke: darken(#336666, 30);
    }
  }
}

</style>
