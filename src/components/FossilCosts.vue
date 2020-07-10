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
        :class="comparison === 'absolute' ? 'active-comparison' : ''"
        v-on:click="comparison = 'absolute'"
        >Absolute</span>
        | <span
        class="comparison"
        :class="comparison === 'relative' ? 'active-comparison' : ''"
        v-on:click="comparison = 'relative'"
        >Relative to baseline</span>
      </p>
    </div>
    <svg :width="innerWidth" :height="innerHeight - margin.bottom" :transform="`translate(${margin.left}, 0)`">
      <g :transform="`translate(${margin.left}, 0)`">
      <text class="yaxis-label" x="10" :y="scales.y(maxCost + 160000)">Costs (Mn/$)</text>
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
        :class="[arc.klass, {
          invisible: arc.klass[1] !== currentFuel,
          selected: currentSelection === a
          }]"
        :d="arc.shape"
        />
        <text
        :class="currentSelection === a ? 'selected' : 'not-selected'"
        :x="arc.year !== scales.x(2020) ? arc.year - 10 : arc.year + 45"
        :y="arc.yPos - 5"
        :text-anchor="arc.year !== scales.x(2020) ? 'end' : 'start'"
        >
        {{arc.ej}} Ej/yr
      </text>
      <text
      :class="currentSelection === a ? 'selected' : 'not-selected'"
      :x="arc.year !== scales.x(2020) ? arc.year - 10 : arc.year + 45"
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
      <text>Price change (Mn/$)</text>
      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="Group-8" transform="translate(120, -5)">
              <polygon id="Path-11" fill="#C4CFDE" points="22 49 159 80 159 0 22 31"></polygon>
              <path d="M76.7407407,61.1488428 C88.1762191,61.1488428 97.4465059,51.7468225 97.4465059,40.1488428 C97.4465059,28.550863 88.1762191,19.1488428 76.7407407,19.1488428 L76.7407407,40.1488428 L76.7407407,61.1488428 Z" id="Path-Copy-14" fill="#6A7687" fill-rule="nonzero"></path>
              <path d="M44.5185185,54.1488428 C52.23005,54.1488428 58.4814815,48.1046869 58.4814815,40.6488428 C58.4814815,33.1929987 52.23005,27.1488428 44.5185185,27.1488428 L44.5185185,40.6488428 L44.5185185,54.1488428 Z" id="Path-Copy-15" fill="#6A7687" fill-rule="nonzero"></path>
              <path d="M22,48.66741 C26.8787206,48.66741 30.833705,44.7124256 30.833705,39.833705 C30.833705,34.9549845 26.8787206,31 22,31 L22,39.833705 L22,48.66741 Z" id="Path-Copy-12" fill="#6A7687" fill-rule="nonzero"></path>
              <path d="M159,80 C181.09139,80 199,62.09139 199,40 C199,17.90861 181.09139,1.42108547e-14 159,1.42108547e-14 L159,40 L159,80 Z" id="Path-Copy-11" fill="#6A7687" fill-rule="nonzero"></path>
              <path d="M115.481481,70.1488428 C132.050024,70.1488428 145.481481,56.7173853 145.481481,40.1488428 C145.481481,23.5803003 132.050024,10.1488428 115.481481,10.1488428 L115.481481,40.1488428 L115.481481,70.1488428 Z" id="Path-Copy-13" fill="#6A7687" fill-rule="nonzero"></path>
              <text id="&lt;1-Mn/$" fill="#000000">
                  <tspan x="-20" y="106">&lt; 450.000 Mn/$</tspan>
              </text>
              <text id="88.2-Mn/$" fill="#000000">
                  <tspan x="132" y="106">&gt; 900.000 Mn/$</tspan>
              </text>
              <line x1="22.5" y1="31.5" x2="22" y2="89" id="Path-12" stroke="#000000" stroke-width="0.5"></line>
              <line x1="159.5" y1="0.5" x2="159.5" y2="89.5" id="Path-12-Copy" stroke="#000000" stroke-width="0.5"></line>
          </g>
      </g>
      <text transform="translate(450, -1)">Energy Carriers</text>
            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(450, 20)">
                <g id="Group-11" transform="translate(1.000000, 0.625241)">
                    <path
                    :class="{invisible: currentFuel !== 'Coal'}"
                    @mouseover="currentFuel = 'Coal'"
                    d="M0,32 C8.836556,32 16,24.836556 16,16 C16,7.163444 8.836556,7.10542736e-15 0,7.10542736e-15 L0,16 L0,32 Z"
                    id="Path-Copy-16"
                    stroke="#75757A"
                    fill="#D8D8E4"
                    fill-rule="nonzero"/>
                    <path
                    :class="{invisible: currentFuel !== 'Gas'}"
                    @mouseover="currentFuel = 'Gas'"
                    d="M110,32 C118.836556,32 126,24.836556 126,16 C126,7.163444 118.836556,7.10542736e-15 110,7.10542736e-15 L110,16 L110,32 Z"
                    id="Path-Copy-17"
                    stroke="#931547"
                    fill="#ED96AB"
                    fill-rule="nonzero"/>
                    <path
                    :class="{invisible: currentFuel !== 'Fossils'}"
                    @mouseover="currentFuel = 'Fossils'"
                    d="M326,32 C334.836556,32 342,24.836556 342,16 C342,7.163444 334.836556,7.10542736e-15 326,7.10542736e-15 L326,16 L326,32 Z"
                    id="Fossils"
                    stroke="#36323C"
                    fill="#6A7687"
                    fill-rule="nonzero"/>
                    <text id="Coal" fill="#000000"><tspan x="29" y="20.374759">Coal</tspan></text>
                    <text id="Gas" fill="#000000"><tspan x="143" y="20.374759">Gas</tspan></text>
                    <text id="Fossils-(all)" fill="#000000"><tspan x="359" y="20.374759">Fossils (all)</tspan></text>
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
// import SensesTooltip from 'library/src/components/SensesTooltip.vue'

export default {
  name: 'FossilCosts',
  components: {
    SensesSelect
    // SensesTooltip
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
    maxEj () { return max(map(this.FossilCosts, el => { return Number(el.Value) })) },
    maxCost () { return max(map(this.FossilCosts, el => { return Number(el['Indirect Emission Costs']) })) },
    scales () {
      const xDom = [min(map(this.years, y => { return y })), max(map(this.years, y => { return y }))]
      const xRange = [this.margin.left + this.margin.right, this.innerGraph.width]
      const yDom = [0, this.maxCost]
      const yRange = [this.innerHeight - this.margin.bottom * 25, 100]
      const rDom = [0, Math.sqrt(this.maxEj)]
      const rRange = [0, 40]
      return {
        x: scaleLinear().domain(xDom).range(xRange),
        y: scaleLinear().domain(yDom).range(yRange),
        radius: scaleLinear().domain(rDom).range(rRange)
      }
    },
    arcGenerator () {
      const { scales } = this
      const pi = Math.PI
      return arc()
        .innerRadius(0)
        .outerRadius(f => scales.radius(Math.sqrt(f.Value)))
        .startAngle(180 * (pi / 180))
        .endAngle(0)
    },
    yTicks () { return range(0, this.maxCost, 100000) },
    arcs () {
      const { scales, arcGenerator } = this
      return map(this.filteredData, (f, i) => {
        return {
          klass: [f.Scenario, f.Variable],
          price: Math.round(f['Indirect Emission Costs']),
          ej: Math.round(f.Value),
          year: scales.x(f.Year),
          yPos: scales.y(f['Indirect Emission Costs']),
          shape: arcGenerator(f)
        }
      })
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
    // background-color: lightblue;
    .yaxis {
      stroke-opacity: 0;
        stroke: $color-gray;
        stroke-dasharray: 1 1;

        text {
          stroke: none;
        }
    }

    .yaxis-label {
      transform: translate(-20px, 100px) rotate(-90deg);
      // transform: translate(5px, 0px);
    }

    path.invisible {
      fill-opacity: 0;
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
    }
  }
}
</style>
