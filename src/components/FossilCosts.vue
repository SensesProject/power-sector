<template>
  <div class="fossil-costs" ref="inCosts">
    <div class="key" :class=" mobile ? 'mobile' : 'desktop'">
      <h4>Fuel Costs Changes (BN/$) in relation to Volume (Ej/year)</h4>
      <p class="selectors">
        Select a scenario and a region:
        <SensesSelect class="scenario_selector" :options="scenarios" v-model="currentScenario"/>
      </p>
    </div>
    <svg :width="innerWidth" :height="innerHeight - margin.bottom" :transform="`translate(${margin.left}, 0)`">
      <g :transform="`translate(${margin.left}, 0)`">
      <g class="yaxis" v-for="tick in yTicks" :key="tick" :transform="`translate(${margin.left}, ${scales.y(tick)})`">
        <text :x="5" y="5" text-anchor="end">{{tick}}</text>
      </g>
      <g v-for="(arc, a) in arcs" :key="`${a}-arc`">
        <line class="yaxis" :x1="scales.x(2020)" :x2="arc.year" :y1="arc.yPos" :y2="arc.yPos" stroke="black"/>
        <path :transform="`translate(${arc.year}, ${arc.yPos})`" :class="arc.klass" :d="arc.shape"/>
      </g>
      <g class="xaxis" v-for="year in years" :key="year" :transform="`translate(${scales.x(year)}, 0)`">
        <line x1="0" x2="0" y1="10" :y2="innerGraph.height" stroke="black"/>
        <text x="5" :y="innerGraph.height + 20" text-anchor="middle">{{year}}</text>
      </g>
    </g>
    <g class="legend" :transform="`translate(${margin.left}, ${innerGraph.height + 60})`">
      <text>Price change (BN/$)</text>
      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="Group-8" transform="translate(120, -5)">
              <polygon id="Path-11" fill="#C4CFDE" points="22 49 159 80 159 0 22 31"></polygon>
              <path d="M76.7407407,61.1488428 C88.1762191,61.1488428 97.4465059,51.7468225 97.4465059,40.1488428 C97.4465059,28.550863 88.1762191,19.1488428 76.7407407,19.1488428 L76.7407407,40.1488428 L76.7407407,61.1488428 Z" id="Path-Copy-14" fill="#6A7687" fill-rule="nonzero"></path>
              <path d="M44.5185185,54.1488428 C52.23005,54.1488428 58.4814815,48.1046869 58.4814815,40.6488428 C58.4814815,33.1929987 52.23005,27.1488428 44.5185185,27.1488428 L44.5185185,40.6488428 L44.5185185,54.1488428 Z" id="Path-Copy-15" fill="#6A7687" fill-rule="nonzero"></path>
              <path d="M22,48.66741 C26.8787206,48.66741 30.833705,44.7124256 30.833705,39.833705 C30.833705,34.9549845 26.8787206,31 22,31 L22,39.833705 L22,48.66741 Z" id="Path-Copy-12" fill="#6A7687" fill-rule="nonzero"></path>
              <path d="M159,80 C181.09139,80 199,62.09139 199,40 C199,17.90861 181.09139,1.42108547e-14 159,1.42108547e-14 L159,40 L159,80 Z" id="Path-Copy-11" fill="#6A7687" fill-rule="nonzero"></path>
              <path d="M115.481481,70.1488428 C132.050024,70.1488428 145.481481,56.7173853 145.481481,40.1488428 C145.481481,23.5803003 132.050024,10.1488428 115.481481,10.1488428 L115.481481,40.1488428 L115.481481,70.1488428 Z" id="Path-Copy-13" fill="#6A7687" fill-rule="nonzero"></path>
              <text id="&lt;1-Bn/$" fill="#000000">
                  <tspan x="0" y="106">&lt;1 Bn/$</tspan>
              </text>
              <text id="88.2-Bn/$" fill="#000000">
                  <tspan x="132" y="106">88.2 Bn/$</tspan>
              </text>
              <line x1="22.5" y1="31.5" x2="22" y2="89" id="Path-12" stroke="#000000" stroke-width="0.5"></line>
              <line x1="159.5" y1="0.5" x2="159.5" y2="89.5" id="Path-12-Copy" stroke="#000000" stroke-width="0.5"></line>
          </g>
      </g>
      <text transform="translate(380, -1)">Energy Carriers</text>
            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(380, 20)">
                <g id="Group-11" transform="translate(1.000000, 0.625241)">
                    <path d="M0,32 C8.836556,32 16,24.836556 16,16 C16,7.163444 8.836556,7.10542736e-15 0,7.10542736e-15 L0,16 L0,32 Z" id="Path-Copy-16" stroke="#75757A" fill="#D8D8E4" fill-rule="nonzero"></path>
                    <path d="M110,32 C118.836556,32 126,24.836556 126,16 C126,7.163444 118.836556,7.10542736e-15 110,7.10542736e-15 L110,16 L110,32 Z" id="Path-Copy-17" stroke="#931547" fill="#ED96AB" fill-rule="nonzero"></path>
                    <path d="M221,32 C229.836556,32 237,24.836556 237,16 C237,7.163444 229.836556,7.10542736e-15 221,7.10542736e-15 L221,16 L221,32 Z" id="Path-Copy-18" stroke="#84341C" fill="#F39172" fill-rule="nonzero"></path>
                    <path d="M326,32 C334.836556,32 342,24.836556 342,16 C342,7.163444 334.836556,7.10542736e-15 326,7.10542736e-15 L326,16 L326,32 Z" id="Path-Copy-19" stroke="#36323C" fill="#6A7687" fill-rule="nonzero"></path>
                    <text id="Coal" fill="#000000"><tspan x="29" y="20.374759">Coal</tspan></text>
                    <text id="Gas" fill="#000000"><tspan x="143" y="20.374759">Gas</tspan></text>
                    <text id="Oil" fill="#000000"><tspan x="254" y="20.374759">Oil</tspan></text>
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
import FossilCosts from 'dsv-loader!@/assets/data/SecondaryEnergyAndEmissionCosts.csv' // eslint-disable-line import/no-webpack-loader-syntax
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
      const yDom = [0, this.maxEj]
      const yRange = [this.innerHeight - this.margin.bottom * 25, 100]
      const rDom = [0, Math.sqrt(this.maxCost)]
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
        .outerRadius(f => scales.radius(Math.sqrt(f['Indirect Emission Costs'])))
        .startAngle(180 * (pi / 180))
        .endAngle(0)
    },
    yTicks () { return range(0, 110, 10) },
    arcs () {
      const { scales, arcGenerator } = this
      return map(this.filteredData, (f, i) => {
        return {
          klass: [f.Scenario, f.Variable],
          year: scales.x(f.Year),
          yPos: scales.y(f.Value),
          shape: arcGenerator(f)
        }
      })
    }
  },
  methods: {
    calcSizes () {
      const { inCosts: el } = this.$refs
      console.log(this.filteredData)
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

  svg {
    // background-color: lightblue;
    .yaxis {
        stroke: $color-gray;
        stroke-dasharray: 1 1;

        text {
          stroke: none;
        }
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
