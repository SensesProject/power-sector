<template>
  <div class="fossil-costs" ref="inCosts">
    <div class="key" :class=" mobile ? 'mobile' : 'desktop'">
      <h4>Fuel costs changes (MN$) and electricity production (Ej/year)</h4>
      <a href="https://docs.messageix.org/projects/global/en/latest/" target="_blank">(MODEL: MESSAGEix-GLOBIOM_1.0)</a>
      <div>
        <p class="selectors">
        Select a scenario:
        <SensesSelect class="scenario_selector" :options="scenarios" v-model="currentScenario"/>
      </p>
      <p class="comparison_selector">
        <span
        class="comparison"
        :class="comparison === 'absolute' ? '' : 'active-comparison'"
        v-on:click="comparison = 'absolute'"
        >Absolute</span>
        | <span
        class="comparison"
        :class="comparison === 'relative' ? '' : 'active-comparison'"
        v-on:click="comparison = 'relative'"
        >Relative to current policy scenario</span>
      </p>
      </div>
    </div>
    <svg :width="innerWidth" :height="innerHeight - margin.bottom" :transform="`translate(${margin.left}, 0)`">
      <g :transform="`translate(${margin.left + 10}, 0)`">
      <text class="yaxis-label" x="0" y="40" :transform='`translate(${-margin.left * 3} 90) rotate(-90)`'>Costs (Mn$)</text>
      <g v-for="(arc, a) in arcs" :key="`${a}-arc`">
        <line
        class="yaxis"
        :class="{selected: currentSelection === a}"
        :x1="scales.x(2020)"
        :x2="arc.year"
        :y1="arc.yPos"
        :y2="arc.yPos"
         stroke="black"
         />
         <circle
         @mouseover="currentSelection = a"
         @mouseleave="currentSelection = null"
         v-if="comparison === 'relative'"
         :class="[arc.klass, {
           invisible: arc.klass[1] !== currentFuel,
           selected: currentSelection === a,
           no_baseline: comparison === 'relative' & arc.klass[1] === currentFuel
           }]"
         :r="arc.baseline"
         :cx="arc.year"
         :cy="arc.yPos"
         />
         <circle
         @mouseover="currentSelection = a"
         @mouseleave="currentSelection = null"
         :class="[arc.klass, {
           invisible: arc.klass[1] !== currentFuel,
           selected: currentSelection === a,
           baseline: comparison === 'relative'
           }]"
         :r="arc.shape"
         :cx="arc.year"
         :cy="arc.yPos"
         />
         <text
         class="shadow"
         :class="currentSelection === a ? 'selected' : 'not-selected'"
         :x="arc.year !== scales.x(2020) ? arc.year - 10 : arc.year + 5"
         :y="arc.yPos - 5"
         :text-anchor="arc.year !== scales.x(2020) ? 'end' : 'start'"
         >
         {{arc.ej}} Ej/yr
       </text>
        <text
        :class="currentSelection === a ? 'selected' : 'not-selected'"
        :x="arc.year !== scales.x(2020) ? arc.year - 10 : arc.year + 5"
        :y="arc.yPos - 5"
        :text-anchor="arc.year !== scales.x(2020) ? 'end' : 'start'"
        >
        {{arc.ej}} Ej/yr
        </text>
        <text
          class="shadow"
          :class="currentSelection === a ? 'selected' : 'not-selected'"
          :x="arc.year !== scales.x(2020) ? arc.year - 10 : arc.year + 5"
          :y="arc.yPos + 15"
          :text-anchor="arc.year !== scales.x(2020) ? 'end' : 'start'"
          >
          {{arc.price / 1000}} Mn/$
        </text>
        <text
        :class="currentSelection === a ? 'selected' : 'not-selected'"
        :x="arc.year !== scales.x(2020) ? arc.year - 10 : arc.year + 5"
        :y="arc.yPos + 15"
        :text-anchor="arc.year !== scales.x(2020) ? 'end' : 'start'"
        >
        {{arc.price / 1000}} Mn/$
      </text>
      </g>
      <g class="yaxis" v-for="tick in yTicks" :key="tick" :transform="`translate(${margin.left}, ${scales.y(tick)})`">
        <text :x="5" y="5" text-anchor="end">{{tick / 1000}}</text>
      </g>
      <g class="xaxis" v-for="year in years" :key="year" :transform="`translate(${scales.x(year)}, 0)`">
        <line x1="0" x2="0" y1="10" :y2="innerGraph.height" stroke="black"/>
        <text x="5" :y="innerGraph.height + 20" text-anchor="middle">{{year}}</text>
      </g>
    </g>
    <g class="legend" :transform="`translate(${margin.left}, ${innerGraph.height + 60})`">
      <text>Electricity production (EJ/yr)</text>
          <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="Group-11" transform="translate(150, 10)">
                  <text id="&lt;-5-EJ/yr" fill="#000000" fill-rule="nonzero">
                      <tspan x="-7.10542736e-15" y="47">&lt; 10 EJ/yr</tspan>
                  </text>
                  <text id="&gt;-80-EJ/yr" fill="#000000" fill-rule="nonzero">
                      <tspan x="169" y="48">&gt; 130 EJ/yr</tspan>
                  </text>
                  <line x1="158" y1="51" x2="204" y2="51" id="Path-12-Copy" stroke="#000000" stroke-width="0.5"></line>
                  <line x1="18" y1="51" x2="64" y2="51" id="Path-12-Copy-Copy" stroke="#000000" stroke-width="0.5"></line>
                  <g id="Group-8" transform="translate(64, 0)" fill-rule="nonzero" stroke="#4E40B2">
                      <circle id="Oval" cx="3.98" cy="48.98" r="3.98" stroke="#4E40B2"></circle>
                      <circle id="Oval" cx="46.9827628" cy="46.9827628" r="46.9827628" stroke="#4E40B2"></circle>
                      <circle id="Oval-Copy" cx="41.3380862" cy="47.3380862" r="41.3380862" stroke="#4E40B2"></circle>
                      <circle id="Oval-Copy" cx="34.5" cy="47.3380862" r="34.5" stroke="#4E40B2"></circle>
                      <circle id="Oval-Copy" cx="26.5" cy="47.3380862" r="26.5" stroke="#4E40B2"></circle>
                      <circle id="Oval-Copy" cx="17.5" cy="47.3380862" r="17.5" stroke="#4E40B2"></circle>
                  </g>
              </g>
          </g>
      <text transform="translate(450, -1)">Energy Carriers</text>
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="Group-14" transform="translate(450, 20)">
                <g id="Coal">
                    <circle
                    :class="{invisible: currentFuel !== 'Coal'}"
                    @mouseover="currentFuel = 'Coal'"
                    r="10"
                    cx="10"
                    cy="15"
                    id="Path-Copy-16"
                    stroke="#75757A"
                    fill="#D8D8E4"
                    fill-rule="nonzero"/>
                    <text id="Coal" fill="#000000">
                        <tspan x="29" y="20.374759">Coal</tspan>
                    </text>
                    <g v-if="comparison === 'relative'">
                      <circle
                      class="no_baseline"
                      transform="translate(0, 40)"
                      :class="{invisible: currentFuel !== 'Coal'}"
                      @mouseover="currentFuel = 'Coal'"
                      r="10"
                      cx="10"
                      cy="15"
                      id="Path-Copy-16"
                      stroke="#75757A"
                      fill="#D8D8E4"
                      fill-rule="nonzero"/>
                      <text id="Coal" fill="#000000">
                          <tspan x="29" y="60.374759">Baseline</tspan>
                      </text>
                    </g>
                </g>
                <g id="Gas" transform="translate(97, 0)">
                    <circle
                    :class="{invisible: currentFuel !== 'Gas'}"
                    @mouseover="currentFuel = 'Gas'"
                    r="10"
                    cx="10"
                    cy="15"
                    id="Path-Copy-16"
                    stroke="#931547"
                    fill="#ED96AB"
                    fill-rule="nonzero"/>
                    <text id="Gas" fill="#000000">
                        <tspan x="33" y="20.374759">Gas</tspan>
                    </text>
                    <g v-if="comparison === 'relative'">
                      <circle
                      class="no_baseline"
                      transform="translate(0, 40)"
                      :class="{invisible: currentFuel !== 'Gas'}"
                      @mouseover="currentFuel = 'Gas'"
                      r="10"
                      cx="10"
                      cy="15"
                      id="Path-Copy-16"
                      stroke="#931547"
                      fill="#ED96AB"
                      fill-rule="nonzero"/>
                      <text id="Gas" fill="#000000">
                          <tspan x="29" y="60.374759">Baseline</tspan>
                      </text>
                    </g>
                </g>
                <g id="Fossils" transform="translate(195, 0)">
                    <circle
                    :class="{invisible: currentFuel !== 'Fossils'}"
                    @mouseover="currentFuel = 'Fossils'"
                    r="10"
                    cx="10"
                    cy="15"
                    id="Path-Copy-16"
                    stroke="#36323C"
                    fill="#4E40B2"
                    fill-rule="nonzero"/>
                    <text id="Fossils-(all)" fill="#000000">
                        <tspan x="33" y="20.374759">Fossils (all)</tspan>
                    </text>
                    <g v-if="comparison === 'relative'">
                      <circle
                      class="no_baseline"
                      transform="translate(0, 40)"
                      :class="{invisible: currentFuel !== 'Fossils'}"
                      @mouseover="currentFuel = 'Fossils'"
                      r="10"
                      cx="10"
                      cy="15"
                      id="Path-Copy-16"
                      stroke="#36323C"
                      fill="#4E40B2"
                      fill-rule="nonzero"/>
                      <text id="Gas" fill="#000000">
                          <tspan x="29" y="60.374759">Baseline</tspan>
                      </text>
                    </g>
                </g>
            </g>
        </g>
    </g>
    </svg>
  </div>
</template>

<script>
import { map, range, filter } from 'lodash'
import { max, min } from 'd3-array'
import { scaleLinear } from 'd3-scale'
// import { arc } from 'd3-shape'
import FossilCosts from 'dsv-loader!@/assets/data/SecondaryEnergyAndEmissionCosts-new.csv' // eslint-disable-line import/no-webpack-loader-syntax
import SensesSelect from 'library/src/components/SensesSelect.vue'

export default {
  name: 'FossilCosts',
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
    },
    step: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      FossilCosts,
      currentScenario: 'Current Policies',
      currentRegion: 'World',
      currentFuel: 'Fossils',
      currentSelection: null,
      comparison: 'absolute',
      active: false,
      over: '',
      margin: {
        top: 10,
        bottom: 10,
        right: 10,
        left: 10
      },
      innerHeight: 0,
      years: [...new Set(FossilCosts.map(r => r.Year))],
      scenarios: [...new Set(FossilCosts.map(r => r.Scenario))]
    }
  },
  computed: {
    innerWidth () { return this.width - this.margin.left },
    innerGraph () {
      return {
        width: this.innerWidth - (this.margin.left + this.margin.right) - 100,
        height: (this.innerHeight - this.margin.bottom * 25) + this.margin.bottom
      }
    },
    filteredData () { return filter(this.FossilCosts, f => { return f.Scenario === this.currentScenario }) },
    baseline () { return filter(this.FossilCosts, f => { return f.Scenario === 'Current Policies' }) },
    maxEj () { return max(map(this.FossilCosts, el => { return Number(el.Value) })) },
    maxCost () { return max(map(this.FossilCosts, el => { return Number(el['Indirect Emission Costs']) })) },
    scales () {
      const { comparison, years, maxEj, maxCost } = this
      const xDom = [min(map(years, y => { return y })), max(map(years, y => { return y }))]
      const xRange = [this.margin.left + this.margin.right, this.innerGraph.width]

      const yDom = [0, maxCost]
      const yDiffDom = [0, -maxCost]
      const yDomain = comparison === 'relative' ? yDiffDom : yDom

      const yRan = [this.innerHeight - this.margin.bottom * 25, 100]
      const yRangeDiff = [100, this.innerHeight - this.margin.bottom * 25]
      const yRange = comparison === 'relative' ? yRangeDiff : yRan

      const rDom = [0, Math.sqrt(maxEj)]
      const rDomDiff = [0, Math.sqrt(maxEj)]
      const rRange = [0, 5]
      const rDomain = comparison === 'relative' ? rDomDiff : rDom
      return {
        x: scaleLinear().domain(xDom).range(xRange),
        y: scaleLinear().domain(yDomain).range(yRange),
        radius: scaleLinear().domain(rDomain).range(rRange)
      }
    },
    // arcGenerator () {
    //   const { scales } = this
    //   const pi = Math.PI
    //   return {
    //     absolute: arc()
    //       .innerRadius(0)
    //       .outerRadius(f => scales.radius(Math.sqrt(f.Value)))
    //       .startAngle(180 * (pi / 180))
    //       .endAngle(0),
    //     relative: arc()
    //       .innerRadius(0)
    //       .outerRadius(f => scales.radius(Math.sqrt(f.Value)))
    //       // .outerRadius(f => scales.radius(Math.sqrt(-f.Value_diff)))
    //       .startAngle(180 * (pi / 180))
    //       .endAngle(0)
    //   }
    // },
    yTicks () {
      const positiveticks = range(0, this.maxCost, 100000)
      const negativeticks = map(positiveticks, t => {
        return -t
      })
      return this.comparison === 'relative' ? negativeticks : positiveticks
    },
    arcs () {
      const { scales, comparison } = this
      return map(this.filteredData, (f, i) => {
        const costValue = comparison === 'relative' ? f['Indirect Emission Costs diff'] : f['Indirect Emission Costs']
        const quantityValue = comparison === 'relative' ? f.Value_diff : f.Value
        return {
          klass: [f.Scenario, f.Variable],
          price: Math.round(costValue),
          ej: Math.round(quantityValue),
          year: scales.x(f.Year),
          yPos: scales.y(costValue),
          shape: scales.radius(f.Value),
          baseline: scales.radius(this.baseline[i].Value)
        }
      })
    }
  },
  watch: {
    comparison (current, previous) {
      if (current === 'relative') {
        const newscenarios = filter(this.scenarios, (s) => { return s !== 'Current Policies' })
        this.scenarios = newscenarios
        this.currentScenario = '2.0ºC'
      } else {
        this.scenarios = [...new Set(FossilCosts.map(r => r.Scenario))]
        this.currentScenario = 'Current Policies'
      }
    },
    step (currentStep, previousStep) {
      if (currentStep === 0) {
        this.currentScenario = 'Current Policies'
        this.comparison = 'absolute'
      } else if (currentStep === 1) {
        this.currentScenario = '2.0ºC'
        this.comparison = 'absolute'
      } else if (currentStep === 2) {
        this.currentScenario = '1.5ºC'
        this.comparison = 'absolute'
      } else if (currentStep === 3) {
        this.currentScenario = '2.0ºC'
        this.comparison = 'relative'
      } else if (currentStep === 4) {
        this.currentScenario = 'Current Policies'
        this.comparison = 'absolute'
      }
    }
  },
  methods: {
    calcSizes () {
      const { inCosts: el } = this.$refs
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
.fossil-costs {
  height: 90%;

  .key {
    margin-bottom: 2%;
  }

  .selectors {
    margin-top: 10px;
    display: inline-flex;

    .senses-select {
      margin-left: 5px;
    }
  }

  .comparison_selector {
    margin-left: 5%;
    display: inline-flex;

    .comparison {
      margin: 0 5px;
      cursor: pointer;
    }

    .active-comparison {
      color: $color-neon;
      text-decoration: underline;
    }
  }
  a {
    margin-top: 5px;
    color: #424ab9;
    font-weight: normal;
    display: inline;
    margin-left: $margin-space;
    font-size: 0.8em;
  }
  h4 {
    display: inline-block;
  }

  svg {
    .yaxis {
      stroke-opacity: 0;
        stroke: $color-gray;
        stroke-dasharray: 1 1;

        text {
          stroke: none;
          font-size: 10px;
        }
    }

    circle.invisible {
      fill-opacity: 0;
      stroke-opacity: 0.3;
    }

    circle.selected {
      fill-opacity: 1;
    }

    .legend {
      .invisible {
        fill-opacity: 0.2;
      }
    }

    line.selected {
      stroke-opacity: 1;
    }

    text.selected {
      font-size: 11px;
    }

    text.shadow {
      fill: none;
      stroke: white;
      stroke-width: 3px;
    }

    text.not-selected {
      visibility: hidden;
    }

    .NPi_v3 {
      transition: cy 0.5s, cx 0.5s;
    }

    .NPi2020_1000_v3 {
      transition: cy 0.5s, cx 0.5s;
    }

    .NPi2020_400_v3 {
      transition: cy 0.5s, cx 0.5s;
    }

    circle {
      stroke: black;
      transition: cy 0.5s, cx 0.5s;
      fill-opacity: 0.5;

      &.Fossils {
        fill: getColor(violet, 60);
        stroke: getColor(violet, 40);
      }

      &.Oil {
        fill: getColor(orange, 80);
        stroke: getColor(orange, 40);
      }

      &.Gas {
        fill: getColor(red, 80);
        stroke: getColor(red, 40);
      }

      &.Coal {
        fill: getColor(gray, 80);
        stroke: getColor(gray, 40);
      }
      &.baseline {
        &.invisible {
          fill-opacity: 0.1;
          stroke-opacity: 0.1;
        }
        fill-opacity: 1;
      }
      &.no_baseline {
        stroke-dasharray: 4 2;
        fill: white;
        // fill: red;
      }
    }
  }
}
</style>
