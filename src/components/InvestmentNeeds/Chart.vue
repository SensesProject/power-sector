<template>
  <div class="bars">
    <span class="label" v-html="label" />
    <div class="intro">
      <span>{{ region }}: <strong>{{ sumThis }}</strong> Billion US-Dollar per year.</span>
    </div>
    <svg ref="vis" class="vis">
      <g v-if="width">
        <g v-for="(el, i) in elements" :key="el.id">
          <Bar
            v-bind="el" />
          <g v-if="el.widthRef !== el.width && isStacked" :class="['difference', { showDifference }]">
            <DiffLess
              v-if="el.widthRef < el.width"
              v-bind="el" />
            <DiffMore
              v-else
              v-bind="el" />
          </g>
          <Label
            v-bind="el"
            :widths="widths[i]"
            v-if="!(showDifference && scenario === 'CPol') && isStacked"
            :showDifference="showDifference" />
        </g>
      </g>
      <PatternDefs />
    </svg>
  </div>
</template>

<script>
import { scaleLinear } from 'd3-scale'
import { map, sum, filter, get } from 'lodash'
import { format } from 'd3-format'
import Bar from './Bar'
import PatternDefs from './PatternDefs'
import DiffLess from './DiffLess'
import DiffMore from './DiffMore'
import Label from './Label'

const colors = {
  'Coal|w/ CCS': '#8c8c94',
  'Coal|w/o CCS': '#d7d7e3',
  'Gas|w/ CCS': '#f8cbd4',
  'Gas|w/o CCS': '#ed96ab',
  'Oil|w/ CCS': '#fcb69f',
  'Biomass|w/ CCS': '#e31a1c',
  'Biomass|w/o CCS': '#dca0e5',
  Nuclear: '#a3d1ea',
  Hydro: '#ac9bd9',
  Solar: '#ffd89a',
  Wind: '#99cccc',
  Geothermal: '#cc9999',
  Ocean: '#8d88ff',
  'Transmission and Distribution': '#47474c',
  'Electricity Storage': '#a2e7c0'
}

function getColorFromVariable (variable) {
  return get(colors, variable, '#000')
}

export default {
  name: 'InvestmentNeedsStackedBarChart',
  props: ['data', 'scenario', 'extents', 'variables', 'gap', 'isStacked', 'showDifference'],
  components: {
    Bar,
    PatternDefs,
    DiffLess,
    DiffMore,
    Label
  },
  data: () => {
    return {
      width: 0,
      height: 100,
      margin: {
        left: 0,
        right: 0,
        top: 70,
        bottom: 10
      },
      region: 'World'
    }
  },
  computed: {
    label () {
      const labels = {
        CPol: 'What we are <strong>currently</strong> investing <small>(Current policies)</small>',
        NDC: 'What we <strong>pledged</strong> to invest <small>(Nationally Determined Contributions)</small>',
        '2C': 'What we <strong>should</strong> invest for <strong>2°C</strong>',
        '1.5C': 'What we <strong>should</strong> invest for <strong>1.5°C</strong>'
      }
      return get(labels, this.scenario)
    },
    total () {
      // The total sum of values. This marks the max value for the x-scale
      return sum(map(this.variables, (variable) => {
        return get(this.extents, variable, 0)
      }))
    },
    scaleX () {
      return scaleLinear()
        .range([this.margin.left, this.width - (this.variables.length - 1) * this.gap - this.margin.right])
        .domain([0, this.total])
    },
    widths () {
      return map(this.elements, (d) => get(d, 'x1', 0) - this.gap)
    },
    sumThis () {
      return this.formatNumber(sum(map(this.elements, 'value')))
    },
    barHeight () {
      return this.height / 2
    },
    elements () {
      let x0 = 0
      return map(this.variables, (variable) => {
        const color = getColorFromVariable(variable)
        const data = get(filter(this.data, { variable }), 0)

        const value = get(data, 'value', 0)
        const ref = get(data, 'ref', 0)
        const extent = get(this.extents, variable, 0)

        const diff = value - ref

        const width = this.scaleX(value)
        const widthRef = this.scaleX(ref)
        const widthExtent = this.scaleX(extent) + this.gap

        const x1 = this.isStacked ? widthExtent : width // End

        const obj = {
          id: variable,
          x: x0, // Start
          label: this.formatNumber(value),
          height: this.barHeight,
          x1,
          width,
          widthRef,
          value,
          color,
          diff: (diff > 0 ? '+' : '') + this.formatNumber(diff).replace('-', '–')
        }

        x0 += x1
        return obj
      })
    }
  },
  mounted () {
    this.calcSizes()
    window.addEventListener('resize', this.calcSizes, false)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.calcSizes, false)
  },
  methods: {
    calcSizes () {
      const { vis: el } = this.$refs
      if (el !== 'undefined') {
        this.width = el.clientWidth || el.parentNode.clientWidth
      }
    },
    formatNumber (n) {
      return format(',.2r')(n)
    }
  }
}
</script>

<style lang="scss">
@import "library/src/style/variables.scss";

  .bars {
    .label {
      margin-bottom: $spacing / 8;
      display: block;
      font-size: 12px;

      small {
        font-size: 10px;
        color: getColor(gray, 60);
      }
    }

    .intro {
      font-size: 10px;
      margin-bottom: $spacing / 2;
      display: block;
      color: getColor(gray, 40);
    }

    .vis {
      width: 100%;
      height: calc(100px + 5px + #{8px});

      rect, text {
        transition: opacity 0.3s, width 0.3s, height 0.3s, y 0.3s, x 0.3s;
      }

      line {
        transition: opacity 0.3s, x1 0.3s, x2 0.3s, y1 0.3s, y2 0.3s;
      }

      line {
        &.more {
          stroke: #fff;
          stroke-width: 2px;
          stroke-dasharray: 1px, 1px;
        }
      }

      .difference {
        rect, line {
          opacity: 0;
        }

        &.showDifference {
          rect, line {
            opacity: 1;
          }
        }
      }

      .label {
        font-size: 8px;
        fill: getColor(gray, 60);
      }
    }

    .labels {
      display: grid;
      font-size: 8px;
      color: getColor(gray, 60);
    }
  }

</style>
