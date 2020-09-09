<template>
  <div class="fossil-costs" ref="inCosts">
    <div class="key" :class=" mobile ? 'mobile' : 'desktop'">
      <h4>Fuel Costs Changes (Mn/$) in relation to Volume (Ej/year)</h4>
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
    <svg :width="innerWidth" :height="innerHeight - margin.bottom" :transform="`translate(${margin.left}, 0)`">
      <g :transform="`translate(${margin.left + 10}, 0)`">
      <text class="yaxis-label" x="0" y="40" :transform='`translate(${-margin.left * 3} 90) rotate(-90)`'>Costs (Mn/$)</text>
      <g class="yaxis" v-for="tick in yTicks" :key="tick" :transform="`translate(${margin.left}, ${scales.y(tick)})`">
        <text :x="5" y="5" text-anchor="end">{{tick / 1000}}</text>
      </g>
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
         <path
         :transform="`translate(${arc.year}, ${arc.yPos})`"
         @mouseover="currentSelection = a"
         @mouseleave="currentSelection = null"
         v-if="comparison === 'relative'"
         :class="[arc.klass, {
           invisible: arc.klass[1] !== currentFuel,
           selected: currentSelection === a,
           no_baseline: comparison === 'relative' & arc.klass[1] === currentFuel
           }]"
         :d="arc.baseline"
         />
         <path
         :transform="`translate(${arc.year}, ${arc.yPos})`"
         @mouseover="currentSelection = a"
         @mouseleave="currentSelection = null"
         :class="[arc.klass, {
           invisible: arc.klass[1] !== currentFuel,
           selected: currentSelection === a,
           baseline: comparison === 'relative'
           }]"
         :d="arc.shape"
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
      <g class="xaxis" v-for="year in years" :key="year" :transform="`translate(${scales.x(year)}, 0)`">
        <line x1="0" x2="0" y1="10" :y2="innerGraph.height" stroke="black"/>
        <text x="5" :y="innerGraph.height + 20" text-anchor="middle">{{year}}</text>
      </g>
    </g>
    <g class="legend" :transform="`translate(${margin.left}, ${innerGraph.height + 60})`">
      <text>Energy Volume (EJ/yr)</text>
      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="Group-8" transform="translate(150, -10)">
              <polygon id="Path-11" fill="#C4CFDE" points="22 49 159 80 159 0 22 31"></polygon>
              <path d="M76.7407407,61.1488428 C88.1762191,61.1488428 97.4465059,51.7468225 97.4465059,40.1488428 C97.4465059,28.550863 88.1762191,19.1488428 76.7407407,19.1488428 L76.7407407,40.1488428 L76.7407407,61.1488428 Z" id="Path-Copy-14" fill="#6A7687" fill-rule="nonzero"></path>
              <path d="M44.5185185,54.1488428 C52.23005,54.1488428 58.4814815,48.1046869 58.4814815,40.6488428 C58.4814815,33.1929987 52.23005,27.1488428 44.5185185,27.1488428 L44.5185185,40.6488428 L44.5185185,54.1488428 Z" id="Path-Copy-15" fill="#6A7687" fill-rule="nonzero"></path>
              <path d="M22,48.66741 C26.8787206,48.66741 30.833705,44.7124256 30.833705,39.833705 C30.833705,34.9549845 26.8787206,31 22,31 L22,39.833705 L22,48.66741 Z" id="Path-Copy-12" fill="#6A7687" fill-rule="nonzero"></path>
              <path d="M159,80 C181.09139,80 199,62.09139 199,40 C199,17.90861 181.09139,1.42108547e-14 159,1.42108547e-14 L159,40 L159,80 Z" id="Path-Copy-11" fill="#6A7687" fill-rule="nonzero"></path>
              <path d="M115.481481,70.1488428 C132.050024,70.1488428 145.481481,56.7173853 145.481481,40.1488428 C145.481481,23.5803003 132.050024,10.1488428 115.481481,10.1488428 L115.481481,40.1488428 L115.481481,70.1488428 Z" id="Path-Copy-13" fill="#6A7687" fill-rule="nonzero"></path>
              <text id="&lt;1-Mn/$" fill="#000000">
                  <tspan x="20" y="100">&lt; 5 EJ/yr</tspan>
              </text>
              <text id="88.2-Mn/$" fill="#000000">
                  <tspan x="160" y="100">&gt; 80 EJ/yr</tspan>
              </text>
              <line x1="22.5" y1="31.5" x2="22" y2="89" id="Path-12" stroke="#000000" stroke-width="0.5"></line>
              <line x1="159.5" y1="0.5" x2="159.5" y2="89.5" id="Path-12-Copy" stroke="#000000" stroke-width="0.5"></line>
          </g>
      </g>
      <text transform="translate(450, -1)">Energy Carriers</text>
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="Group-14" transform="translate(450, 20)">
                <g id="Coal">
                    <path
                    :class="{invisible: currentFuel !== 'Coal'}"
                    @mouseover="currentFuel = 'Coal'"
                    d="M0,32 C8.836556,32 16,24.836556 16,16 C16,7.163444 8.836556,5.32907052e-15 0,5.32907052e-15 L0,16 L0,32 Z" id="Path-Copy-16"
                    stroke="#75757A"
                    fill="#D8D8E4"
                    fill-rule="nonzero"/>
                    <text id="Coal" fill="#000000">
                        <tspan x="29" y="20.374759">Coal</tspan>
                    </text>
                    <g v-if="comparison === 'relative'">
                      <path
                      class="no_baseline"
                      transform="translate(0, 40)"
                      :class="{invisible: currentFuel !== 'Coal'}"
                      @mouseover="currentFuel = 'Coal'"
                      d="M0,32 C8.836556,32 16,24.836556 16,16 C16,7.163444 8.836556,5.32907052e-15 0,5.32907052e-15 L0,16 L0,32 Z" id="Path-Copy-16"
                      stroke="#75757A"
                      fill="#D8D8E4"
                      fill-rule="nonzero"/>
                      <text id="Coal" fill="#000000">
                          <tspan x="29" y="60.374759">Baseline</tspan>
                      </text>
                    </g>
                </g>
                <g id="Gas" transform="translate(97, 0)">
                    <path
                    :class="{invisible: currentFuel !== 'Gas'}"
                    @mouseover="currentFuel = 'Gas'"
                    d="M0,32 C8.836556,32 16,24.836556 16,16 C16,7.163444 8.836556,5.32907052e-15 0,5.32907052e-15 L0,16 L0,32 Z"
                    stroke="#931547"
                    fill="#ED96AB"
                    fill-rule="nonzero"/>
                    <text id="Gas" fill="#000000">
                        <tspan x="33" y="20.374759">Gas</tspan>
                    </text>
                    <g v-if="comparison === 'relative'">
                      <path
                      class="no_baseline"
                      transform="translate(0, 40)"
                      :class="{invisible: currentFuel !== 'Gas'}"
                      @mouseover="currentFuel = 'Gas'"
                      d="M0,32 C8.836556,32 16,24.836556 16,16 C16,7.163444 8.836556,5.32907052e-15 0,5.32907052e-15 L0,16 L0,32 Z"
                      stroke="#931547"
                      fill="#ED96AB"
                      fill-rule="nonzero"/>
                      <text id="Gas" fill="#000000">
                          <tspan x="29" y="60.374759">Baseline</tspan>
                      </text>
                    </g>
                </g>
                <g id="Fossils" transform="translate(195, 0)">
                    <path
                    :class="{invisible: currentFuel !== 'Fossils'}"
                    @mouseover="currentFuel = 'Fossils'"
                    d="M0,32 C8.836556,32 16,24.836556 16,16 C16,7.163444 8.836556,5.32907052e-15 0,5.32907052e-15 L0,16 L0,32 Z"
                    stroke="#36323C"
                    fill="#9B94A6"
                    fill-rule="nonzero"/>
                    <text id="Fossils-(all)" fill="#000000">
                        <tspan x="33" y="20.374759">Fossils (all)</tspan>
                    </text>
                    <g v-if="comparison === 'relative'">
                      <path
                      class="no_baseline"
                      transform="translate(0, 40)"
                      :class="{invisible: currentFuel !== 'Fossils'}"
                      @mouseover="currentFuel = 'Fossils'"
                      d="M0,32 C8.836556,32 16,24.836556 16,16 C16,7.163444 8.836556,5.32907052e-15 0,5.32907052e-15 L0,16 L0,32 Z"
                      stroke="#36323C"
                      fill="#9B94A6"
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
import { arc } from 'd3-shape'
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
      currentScenario: 'NPi_v3',
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
    baseline () { return filter(this.FossilCosts, f => { return f.Scenario === 'NPi_v3' }) },
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
      const rRange = [0, 40]
      const rDomain = comparison === 'relative' ? rDomDiff : rDom
      return {
        x: scaleLinear().domain(xDom).range(xRange),
        y: scaleLinear().domain(yDomain).range(yRange),
        radius: scaleLinear().domain(rDomain).range(rRange)
      }
    },
    arcGenerator () {
      const { scales } = this
      const pi = Math.PI
      return {
        absolute: arc()
          .innerRadius(0)
          .outerRadius(f => scales.radius(Math.sqrt(f.Value)))
          .startAngle(180 * (pi / 180))
          .endAngle(0),
        relative: arc()
          .innerRadius(0)
          .outerRadius(f => scales.radius(Math.sqrt(f.Value)))
          // .outerRadius(f => scales.radius(Math.sqrt(-f.Value_diff)))
          .startAngle(180 * (pi / 180))
          .endAngle(0)
      }
    },
    yTicks () {
      const positiveticks = range(0, this.maxCost, 100000)
      const negativeticks = map(positiveticks, t => {
        return -t
      })
      return this.comparison === 'relative' ? negativeticks : positiveticks
    },
    arcs () {
      const { scales, arcGenerator, comparison } = this
      return map(this.filteredData, (f, i) => {
        const costValue = comparison === 'relative' ? f['Indirect Emission Costs diff'] : f['Indirect Emission Costs']
        const quantityValue = comparison === 'relative' ? f.Value_diff : f.Value
        return {
          klass: [f.Scenario, f.Variable],
          price: Math.round(costValue),
          ej: Math.round(quantityValue),
          year: scales.x(f.Year),
          yPos: scales.y(costValue),
          shape: comparison === 'relative' ? arcGenerator.relative(f) : arcGenerator.absolute(f),
          baseline: arcGenerator.absolute(this.baseline[i])
        }
      })
    }
  },
  watch: {
    comparison (current, previous) {
      if (current === 'relative') {
        const newscenarios = filter(this.scenarios, (s) => { return s !== 'NPi_v3' })
        this.scenarios = newscenarios
        this.currentScenario = 'NPi2020_1000_v3'
      } else {
        this.scenarios = [...new Set(FossilCosts.map(r => r.Scenario))]
        this.currentScenario = 'NPi_v3'
      }
    },
    step (currentStep, previousStep) {
      if (currentStep === 1) {
        this.currentScenario = 'NPi2020_1000_v3'
      } if (currentStep === 2) {
        this.comparison = 'relative'
      } if (currentStep === 4) {
        this.currentScenario = 'NPi_v3'
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

    path.invisible {
      fill-opacity: 0;
      stroke-opacity: 0.5;
    }

    path.selected {
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
      transition: transform 1s ease;
    }

    .NPi2020_1000_v3 {
      transition: transform 1s ease;
    }

    .NPi2020_400_v3 {
      transition: transform 1s ease;
    }

    path {
      stroke: black;
      transition: transform 1s ease;

      &.Fossils {
        fill: #6A7687;
        stroke: darken(#6A7687, 40);
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
