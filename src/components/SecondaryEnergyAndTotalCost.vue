<template>
  <div class="secondary-energy" ref="inWrapper">
    <div class="key" :class=" mobile ? 'mobile' : 'desktop'">
      <h4 v-if="step < 1" >Electricity production (Ej/year)</h4>
      <h4 v-if="step >= 1" >Electricity production (Ej/year) and production costs ($/yr | $/MWh) </h4>
      <p v-if="step < 1" class="selectors">
        Select a scenario:
        <SensesSelect class="scenario_selector" :options="scenarios" v-model="currentScenario"/>
      </p>
      <p v-if="step >= 1" class="selectors">
        Select a scenario and cost type:
        <SensesSelect class="scenario_selector" :options="scenarios" v-model="currentScenario"/>
        <!-- selctor for bar chart between costs and costs per MWh -->
        <SensesSelect class="MWh_selector" :options="MWhSel" v-model="currentMWhSel"/>
          <span class="comparison_selector" v-if="step > 1"> <span
          class="comparison"
          :class="comparison === 'absolute' ? '' : 'active-comparison'"
          v-on:click="comparison = 'absolute'"
          >Absolute</span>
          | <span
          class="comparison"
          :class="comparison === 'relative' ? '' : 'active-comparison'"
          v-on:click="comparison = 'relative'"
          >Relative to baseline</span>
          </span>
      </p>
    </div>
    <div></div>
    <svg :width="(innerWidth)" :height="innerHeight" :transform="`translate(${margin.left}, 0)`">
      <g v-for="(group, g) in dots" v-bind:key="g + 'group'" :class="`${labels[g]}-group`" :transform="`translate(0, ${groupPosition[g]})`">
        <!-- draws dots for energy carrier with index g -->
        <g>
        <circle v-for="(dot, d) in group" v-bind:key="d + 'dot'" @mouseover="[active = true, over = d + labels[g]]" @mouseleave="active = false" :class="labels[g]" :cx="dot.year" cy="5" :r="dot.value"/>
        <!-- labels for energy carrier g-->
        <text class="value-label" :x="scale.x(2019)" y="50">{{ labels[g] }}</text>
        </g>
        <g v-if="comparison == 'relative'">
        <circle v-for="(dot, d) in group" v-bind:key="d + 'Basedot'" @mouseover="[active = true, over = d + labels[g]]" @mouseleave="active = false" :class="`${labels[g]}-base`" :cx="dot.year" cy="5" :r="dot.basevalue"/>
        </g>
        <!-- year labels for first and last year in dataset -->
        <g v-if="step < 1" >
        <g v-for="(text, t) in group" :key="t + 'text'" >
          <g v-if="t == 0 || t == 8">
          <text class="year-label" :x="text.year" y="20">{{ years[t] }}</text>
          </g>
        </g>
      </g>
      </g>
    <g v-for="(group, g) in world" v-bind:key="g + 'wgroup'" :class="`${labels[g]}-wgroup`" :transform="`translate(0, ${groupPosition[g]})`">
      <!--   draws hotizontal axis line through dots and small circles at the beginning and end of axis  -->
        <g  v-if="step < 1" class="axis_group">
          <line class="axis" y1="5" y2="5" :x1="scale.x(2020)" :x2="scale.x(2100)"/>
          <circle class="axis-dot" :cx="scale.x(2020)" cy="5" r="2.5"/>
          <circle class="axis-dot" :cx="scale.x(2100)" cy="5" r="2.5"/>
        </g>
        <!-- Hover over, shows values for each dot -->
        <g v-for="(text, t) in group" v-bind:key="t + 'text'" :class="active === true & over === t + labels[g] & comparison === 'absolute' ? 'visible' : 'invisible'">
          <circle class="year-dot" :cx="text.year" cy="5" r="2.5"/>
          <text class="year-label" :x="text.year" y="20">{{ years[t] }}</text>
          <text class="year-label" :x="text.year" y="-15">{{ Math.round(text.valueEJ) }} Ej/year</text>
          <line class="line-label" :x1="text.year" :x2="text.year" y1="-25" y2="5"/>
        </g>
        <g v-for="(text, t) in dots[g]" v-bind:key="t + 'textDiff'" :class="active === true & over === t + labels[g] & comparison === 'relative' ? 'visible' : 'invisible'">
          <circle class="year-dot" :cx="text.year" cy="5" r="2.5"/>
          <text class="year-label" :x="text.year" y="20">{{ years[t] }}</text>
          <text class="year-label" :x="text.year" y="-28">Diff to baseline:</text>
          <text class="year-label" :x="text.year" y="-15">{{ Math.round(text.valueDiff) }} Ej/year</text>
        </g>
      </g>
    <!--separation line-->
    <g v-if="step >= 1">
    <line class="axis" :x1="0" :y1="(0.5*innerHeight)" :x2="0.95*innerWidth" :y2="(0.5*innerHeight)" />
    <!--barchart-->
    <!--transparent bar for hover over-->
    <rect v-for="(layer, l) in dots[0]" v-bind:key="l + 'layer'"  @mouseover="[activeLayer = true, over = l + labels[0]]" @mouseleave="activeLayer = false" class="HoverLayer" :width="layer.barWidth*4" :x="(layer.year)" :y="(0.5*innerHeight)" :height="(0.4*innerHeight)"/>
    <!--stacked bars for different cost Types-->
    <g v-if="comparison == 'absolute'">
    <g v-for="(group, g) in dots" v-bind:key="g + 'rgroup'" :class="`${labels[g]}-group`" >
        <g>
        <rect v-for="(rec, r) in group" v-bind:key="r + 'rect1'" @mouseover="[activeOM = true, over = r + labels[g]]" @mouseleave="activeOM = false" :class="activeOM === true & over === r + labels[g] ? labels[g] + '-barActive' : labels[g] + '-bar'" :width="rec.barWidth" :x="(rec.year+barXshift[g])" :y="(rec.OmY+0.5*innerHeight)" :height="rec.OmCosts"/>
        <rect v-for="(rec, r) in group" v-bind:key="r + 'rect2'" @mouseover="[activeCap = true, over = r + labels[g]]" @mouseleave="activeCap = false" :class="activeCap === true & over === r + labels[g] ? labels[g] + '-barActive' : labels[g] + '-bar'" :width="rec.barWidth" :x="(rec.year+barXshift[g])" :y="(rec.CapY+0.5*innerHeight)" :height="rec.CapCosts"/>
        <rect v-for="(rec, r) in group" v-bind:key="r + 'rect3'" @mouseover="[activeFuel = true, over = r + labels[g]]" @mouseleave="activeFuel = false" :class="activeFuel === true & over === r + labels[g] ? labels[g] + '-barActive' : labels[g] + '-bar'" :width="rec.barWidth" :x="(rec.year+barXshift[g])" :y="(rec.AllY+0.5*innerHeight)" :height="rec.FuelCosts"/>
        <rect v-for="(rec, r) in group" v-bind:key="r + 'rect4'" @mouseover="[activeCarb = true, over = r + labels[g]]" @mouseleave="activeCarb = false" :class="activeCarb === true & over === r + labels[g] ? labels[g] + '-barActive' : labels[g] + '-bar'" :width="rec.barWidth" :x="(rec.year+barXshift[g])" :y="(rec.AllY+0.5*innerHeight)" :height="rec.CarbCosts"/>
        </g>
    </g>
    </g>
    <!--Only showing bar with total costs for relative values-->
    <g v-else>
      <g v-for="(group, g) in dots" v-bind:key="g + 'rgroup'" :class="`${labels[g]}-group`" >
          <g>
          <rect v-for="(rec, r) in group" v-bind:key="r + 'rect5'" :class="labels[g] + '-bar'" :width="rec.barWidth" :x="(rec.year+barXshift[g])" :y="(rec.AllY+0.5*innerHeight)" :height="rec.AllCosts"/>
          </g>
    </g>
  </g>
    <g v-for="(group, g) in dots" v-bind:key="g + 'textgroup'" :class="`${labels[g]}-group`" >
      <!--Text: Values on mouse over for barchart-->
        <g v-for="(text, t) in group" v-bind:key="t + 'textom'" :class="activeOM === true & over === t + labels[g] ? 'visible' : 'invisible'">
          <text class="cost-label" :x="(scale.x(2014.6)+text.year+barXshift[g])" :y="(text.AllY+0.47*innerHeight)">Operational costs</text>
          <text class="value-label" :x="(scale.x(2014.6)+text.year+barXshift[g])" :y="(text.AllY+0.49*innerHeight)">{{ Math.round(text.OmCostValue) }} {{text.Unit}}</text>
        </g>
        <g v-for="(text, t) in group" v-bind:key="t + 'textcap'" :class="activeCap === true & over === t + labels[g] ? 'visible' : 'invisible'">
          <text class="cost-label" :x="(scale.x(2014.6)+text.year+barXshift[g])" :y="(text.AllY+0.47*innerHeight)">Capital costs</text>
          <text class="value-label" :x="(scale.x(2014.6)+text.year+barXshift[g])" :y="(text.AllY+0.49*innerHeight)">{{ Math.round(text.CapCostValue) }} {{text.Unit}}</text>
        </g>
        <g v-for="(text, t) in group" v-bind:key="t + 'textfuel'" :class="activeFuel === true & over === t + labels[g] ? 'visible' : 'invisible'">
          <text class="cost-label" :x="(scale.x(2014.6)+text.year+barXshift[g])" :y="(text.AllY+0.47*innerHeight)">Fuel costs</text>
          <text class="value-label" :x="(scale.x(2014.6)+text.year+barXshift[g])" :y="(text.AllY+0.49*innerHeight)">{{ Math.round(text.FuelCostValue) }} {{text.Unit}}</text>
        </g>
        <g v-for="(text, t) in group" v-bind:key="t + 'textcarb'" :class="activeCarb === true & over === t + labels[g] ? 'visible' : 'invisible'">
          <text class="cost-label" :x="(scale.x(2014.6)+text.year+barXshift[g])" :y="(text.AllY+0.47*innerHeight)">Carbon costs</text>
          <text class="value-label" :x="(scale.x(2014.6)+text.year+barXshift[g])" :y="(text.AllY+0.49*innerHeight)">{{ Math.round(text.CarbCostValue) }} {{text.Unit}}</text>
        </g>
        <g v-for="(text, t) in group" v-bind:key="t + 'textAll'" :class="activeLayer === true & over === t + labels[g] ? 'visible' : 'invisible'">
        <!--  <text class="cost-label" :x="(scale.x(2013)+text.year+barXshift[0])" :y="(dots[0][t].AllY+0.47*innerHeight)">Fossils</text>-->
          <text class="value-label" :x="(scale.x(2014.45)+text.year)" :y="(0.96*innerHeight)">Fossils: {{ Math.round(dots[0][t].AllCostValue) }} {{text.Unit}}</text>
        <!--  <text class="cost-label" :x="(scale.x(2019)+text.year+barXshift[1])" :y="(dots[1][t].AllY+0.47*innerHeight)">Renewables</text> -->
          <text class="value-label" :x="(scale.x(2014.45)+text.year)" :y="(0.98*innerHeight)">Renewables: {{ Math.round(dots[1][t].AllCostValue) }} {{text.Unit}}</text>
          <line class="line-label" :x1="text.year+barXshift[1]" :x2="text.year+barXshift[1]" :y1="(0.94*innerHeight)" :y2="(0.91*innerHeight)"/>
          <circle class="year-dot" :cx="text.year+barXshift[1]" :cy="(0.91*innerHeight)" r="2"/>
        </g>
        <!--horizontal dashed line at y=0 for case of rel value -->
        <g v-if="comparison == 'relative' && currentMWhSel == 'Total Cost'" >
          <line class="line-label-dashed" :x1="scale.x(2020)" :x2="scale.x(2104.5)" :y1="(0.9*innerHeight) - scaleCoDiff.y(0)" :y2="(0.9*innerHeight)- scaleCoDiff.y(0)"/>
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
        <text class="year-label" x="27" :y="(0.9 * innerHeight) - yTicks[1][v] -3" > {{ val }} </text>
      </g>
      <g>
        <text class="year-label" x="27" :y="(0.765 * innerHeight) - yLabel[1]" > {{ yLabel[0] }} </text>
      </g>
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
    },
    step: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      // Dataset SecondaryEnergy is array with objects
      // [{},...,{}]
      SecondaryEnergyAndAllCosts,
      // groupBy creates object composed of keys (coal, wind, ...)
      // generated from the results of running each
      // element of SecondaryEnergySum thru iteratee d = {}
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
      scenarios: ['1.5ºC', '2.0ºC', 'Current Policies'],
      scenDict: { '1.5ºC': 'NPi2020_400_v3', '2.0ºC': 'NPi2020_1000_v3', 'Current Policies': 'NPi_v3' },
      regions: [...new Set(SecondaryEnergyAndAllCosts.map(r => r.Region))],
      allValues: [...new Set(SecondaryEnergyAndAllCosts.map(r => r.Value))],
      allDiffValues: [...new Set(SecondaryEnergyAndAllCosts.map(r => r.Value_diff))],
      // new Array for all "Total Cost in mwh" values to create yAxis
      allCostTotal: [...new Set(SecondaryEnergyAndAllCosts.map(r => r.CostTotal))],
      allCostTotal_MWh: [...new Set(SecondaryEnergyAndAllCosts.map(r => r.CostTotal_MWh))],
      MWhSel: ['Total Cost', 'Total Cost per MWh'],
      tooltip: 'Here a description of what Secondary Energy is!',
      currentMWhSel: 'Total Cost per MWh',
      currentScenario: '1.5ºC',
      currentRegion: 'World',
      comparison: 'absolute',
      active: false,
      activeOM: false,
      activeCap: false,
      activeFuel: false,
      activeCarb: false,
      activeLayer: false,
      activeBase: false,
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
    // filters world and baseline Values
    worldBaseFilter () { return _.map(this.energy, (sc, s) => _.filter(sc, d => (d.Scenario === 'NPi_v3' && d.Region === this.currentRegion))) },
    // filters only the values of world from all costs
    // since there are "inf" or no values for certain regions in datsets
    worldFilterAllCostTotal () {
      const vals = []
      _.forEach(this.SecondaryEnergyAndAllCosts, (data, d) => {
        if (data.Region === 'World') {
          vals.push(data.CostTotal)
        }
      })
      return vals
    },
    // filters only the values of world from all costs per MWh
    worldFilterAllCostTotal_MWh () {
      const vals = []
      _.forEach(this.SecondaryEnergyAndAllCosts, (data, d) => {
        if (data.Region === 'World') {
          vals.push(data.CostTotal_MWh)
        }
      })
      return vals
    },
    // filters only the values of world from all costs Diff
    worldFilterAllCostDiffTotal () {
      let vals = []
      _.forEach(this.SecondaryEnergyAndAllCosts, (data, d) => {
        if (data.Region === 'World') {
          vals.push(data.CostTotal_diff)
        }
      })
      return vals
    },
    // filters only the values of world from all costs Diff per MWh
    worldFilterAllCostDiffTotal_MWh () {
      let vals = []
      _.forEach(this.SecondaryEnergyAndAllCosts, (data, d) => {
        if (data.Region === 'World') {
          vals.push(data.CostTotal_MWh_diff)
        }
      })
      return vals
    },
    // calculates width between years to calculate width of single bar in dots
    sectWidth () {
      const inwidth = this.innerWidth
      const margleft = this.margin.left
      const margright = this.margin.right
      const yearcount = this.years.length
      const sewidth = (inwidth - ((4 * margleft) + (margright * 4))) / yearcount
      return sewidth
    },
    scale () {
      return {
        x: d3.scaleLinear()
          .range([50, this.innerWidth - (this.margin.right * 12)])
          .domain([2020, 2100]),
        y: d3.scaleLinear()
          .range([2, 1500])
          .domain([d3.min(this.allValues, s => +s), d3.max(this.allValues, s => +s)])
      }
    },
    // Scale fuer die Kreise, Differenz-Werte
    scaleDiff () {
      return {
        x: d3.scaleLinear()
          .range([50, this.innerWidth - (this.margin.right * 12)])
          .domain([2020, 2100]),
        y: d3.scaleLinear()
          .range([2, 1500])
          .domain([d3.min(this.allDiffValues, s => +s), d3.max(this.allDiffValues, s => +s)])
      }
    },
    // ScaleCo for Barchart for Costs
    scaleCo () {
      // console.log('MaxMin', d3.min(this.worldFilterAllCostTotal, s => +s), d3.max(this.worldFilterAllCostTotal, s => +s))
      return {
        x: d3.scaleLinear()
          .range([4 * this.margin.left, this.innerWidth - (this.margin.right * 4)])
          .domain([2020, 2110]),
        y: d3.scaleLinear()
          .range([0, 0.35 * this.innerHeight])
          .domain([0, d3.max(this.worldFilterAllCostTotal, s => +s)])
      }
    },
    // ScaleCo for Barchart for Cost difference to baseline
    scaleCoDiff () {
      console.log('MaxMin', d3.min(this.worldFilterAllCostTotal, s => +s), d3.max(this.worldFilterAllCostTotal, s => +s))
      return {
        x: d3.scaleLinear()
          .range([4 * this.margin.left, this.innerWidth - (this.margin.right * 4)])
          .domain([2020, 2110]),
        y: d3.scaleLinear()
          .range([0, 0.35 * this.innerHeight])
          .domain([d3.min(this.worldFilterAllCostDiffTotal, s => +s), d3.max(this.worldFilterAllCostDiffTotal, s => +s)])
      }
    },
    // ScaleCo_MWh for Barchart for Costs per MWh
    scaleCo_MWh () {
      return {
        x: d3.scaleLinear()
          .range([4 * this.margin.left, this.innerWidth - (this.margin.right * 4)])
          .domain([2020, 2110]),
        y: d3.scaleLinear()
          .range([0, 0.35 * this.innerHeight])
          .domain([0, d3.max(this.worldFilterAllCostTotal_MWh, s => +s)])
      }
    },
    // ScaleCo_MWh for Barchart for Costs per MWh diference to baseline
    scaleCo_MWhDiff () {
      console.log('CostMWHDiffMaxMin', d3.min(this.worldFilterAllCostDiffTotal_MWh, s => +s), d3.max(this.worldFilterAllCostDiffTotal_MWh, s => +s))
      return {
        x: d3.scaleLinear()
          .range([4 * this.margin.left, this.innerWidth - (this.margin.right * 4)])
          .domain([2020, 2110]),
        y: d3.scaleLinear()
          .range([0, 0.35 * this.innerHeight])
          .domain([d3.min(this.worldFilterAllCostDiffTotal_MWh, s => +s), d3.max(this.worldFilterAllCostDiffTotal_MWh, s => +s)])
      }
    },
    dots () {
      let basedata = this.worldBaseFilter
      return _.map(this.worldFilter, (energy, e) => {
        // console.log('e', e)
        return _.map(energy, (single, s) => {
          // console.log('s', s)
          if (this.currentMWhSel === 'Total Cost' && this.comparison === 'absolute') {
            return {
              year: this.scale.x(single.Year),
              barWidth: (0.8 * this.sectWidth) / 4,
              Unit: this.currentMWhSel === 'Total Cost' ? 'K$/yr' : '$/MWh',
              // Values for circles
              value: this.scale.y(Math.sqrt(single.Value)),
              basevalue: this.scale.y(Math.sqrt(basedata[e][s].Value)),
              valueDiff: single.Value_diff,
              // Values for Bars Height
              AllCosts: this.scaleCo.y(single.CostTotal),
              OmCosts: this.scaleCo.y(single.OMCOST),
              CapCosts: this.scaleCo.y(single.CAPCOST),
              FuelCosts: this.scaleCo.y(single.FUELCOST),
              CarbCosts: this.scaleCo.y(single.CARBONCOST),
              AllCostsDiff: this.scaleCo.y(single.CostTotal_diff),
              // Y Values for Barchart
              AllY: (0.4 * this.innerHeight) - this.scaleCo.y(single.CostTotal),
              OmY: (0.4 * this.innerHeight) - this.scaleCo.y(single.OMCOST),
              CapY: (0.4 * this.innerHeight) - this.scaleCo.y(single.OMCOST) - this.scaleCo.y(single.CAPCOST),
              CarbY: (0.4 * this.innerHeight) - this.scaleCo.y(single.CARBONCOST),
              // Hover Over real values
              OmCostValue: single.OMCOST,
              FuelCostValue: single.FUELCOST,
              CapCostValue: single.CAPCOST,
              CarbCostValue: single.CARBONCOST,
              AllCostValue: single.CostTotal
            }
          } else if (this.currentMWhSel === 'Total Cost' && this.comparison === 'relative') {
            return {
              year: this.scale.x(single.Year),
              barWidth: (0.8 * this.sectWidth) / 4,
              Unit: this.currentMWhSel === 'Total Cost' ? 'K$/yr' : '$/MWh',
              // Values for circles
              value: this.scale.y(Math.sqrt(single.Value)),
              basevalue: this.scale.y(Math.sqrt(basedata[e][s].Value)),
              valueDiff: single.Value_diff,
              // Values for Bars Height
              // due to neg values the absolute number of CostTotal_diff is needed
              // need to substract "this.scaleCoDiff.y(0)" because of neg values, y(0) is not 0 but a section from 0.4 *innerHeight
              AllCosts: this.scaleCoDiff.y(Math.abs(single.CostTotal_diff)) - this.scaleCoDiff.y(0),
              OmCosts: this.scaleCoDiff.y(single.OMCOST_diff),
              CapCosts: this.scaleCoDiff.y(single.CAPCOST_diff),
              FuelCosts: this.scaleCoDiff.y(single.FUELCOST_diff),
              CarbCosts: this.scaleCoDiff.y(single.CARBONCOST_diff),
              // Y Values for Barchart
              // case distinction for negative values bc y-value for neg values is O
              AllY: single.CostTotal_diff >= 0 ? (0.4 * this.innerHeight) - this.scaleCoDiff.y(single.CostTotal_diff) : (0.4 * this.innerHeight) - this.scaleCoDiff.y(0),
              OmY: (0.4 * this.innerHeight) - this.scaleCoDiff.y(single.OMCOST_diff),
              CapY: (0.4 * this.innerHeight) - this.scaleCoDiff.y(single.OMCOST_diff) - this.scaleCoDiff.y(single.CAPCOST_diff),
              CarbY: (0.4 * this.innerHeight) - this.scaleCoDiff.y(single.CARBONCOST_diff),
              // Hover Over real values
              OmCostValue: single.OMCOST_diff,
              FuelCostValue: single.FUELCOST_diff,
              CapCostValue: single.CAPCOST_diff,
              CarbCostValue: single.CARBONCOST_diff,
              AllCostValue: single.CostTotal_diff
            }
          } else if (this.currentMWhSel !== 'Total Cost' && this.comparison === 'absolute') {
          // //  block of code to be executed if the condition1 is false and condition2 is false
            return {
              year: this.scale.x(single.Year),
              barWidth: (0.8 * this.sectWidth) / 4,
              Unit: this.currentMWhSel === 'Total Cost' ? 'K$/yr' : '$/MWh',
              // Values for circles
              value: this.scale.y(Math.sqrt(single.Value)),
              basevalue: this.scale.y(Math.sqrt(basedata[e][s].Value)),
              valueDiff: single.Value_diff,
              // Values for Bars Height
              AllCosts: this.scaleCo_MWh.y(single.CostTotal_MWh),
              OmCosts: this.scaleCo_MWh.y(single.OMCOST_MWh),
              CapCosts: this.scaleCo_MWh.y(single.CAPCOST_MWh),
              FuelCosts: this.scaleCo_MWh.y(single.FUELCOST_MWh),
              CarbCosts: this.scaleCo_MWh.y(single.CARBONCOST_MWh),
              // Y Values for Barchart
              AllY: (0.4 * this.innerHeight) - this.scaleCo_MWh.y(single.CostTotal_MWh),
              OmY: (0.4 * this.innerHeight) - this.scaleCo_MWh.y(single.OMCOST_MWh),
              CapY: (0.4 * this.innerHeight) - this.scaleCo_MWh.y(single.OMCOST_MWh) - this.scaleCo_MWh.y(single.CAPCOST_MWh),
              CarbY: (0.4 * this.innerHeight) - this.scaleCo_MWh.y(single.CARBONCOST_MWh),
              // Hover Over real values
              OmCostValue: single.OMCOST_MWh,
              FuelCostValue: single.FUELCOST_MWh,
              CapCostValue: single.CAPCOST_MWh,
              CarbCostValue: single.CARBONCOST_MWh,
              AllCostValue: single.CostTotal_MWh
            }
          } else {
            return {
              year: this.scale.x(single.Year),
              barWidth: (0.8 * this.sectWidth) / 4,
              Unit: this.currentMWhSel === 'Total Cost' ? 'K$/yr' : '$/MWh',
              // Values for circles
              value: this.scale.y(Math.sqrt(single.Value)),
              basevalue: this.scale.y(Math.sqrt(basedata[e][s].Value)),
              valueDiff: single.Value_diff,
              // Values for Bars Height
              AllCosts: this.scaleCo_MWhDiff.y(single.CostTotal_MWh_diff),
              OmCosts: this.scaleCo_MWhDiff.y(single.OMCOST_MWh_diff),
              CapCosts: this.scaleCo_MWhDiff.y(single.CAPCOST_MWh_diff),
              FuelCosts: this.scaleCo_MWhDiff.y(single.FUELCOST_MWh_diff),
              CarbCosts: this.scaleCo_MWhDiff.y(single.CARBONCOST_MWh_diff),
              // Y Values for Barchart
              AllY: (0.4 * this.innerHeight) - this.scaleCo_MWhDiff.y(single.CostTotal_MWh_diff),
              OmY: (0.4 * this.innerHeight) - this.scaleCo_MWhDiff.y(single.OMCOST_MWh_diff),
              CapY: (0.4 * this.innerHeight) - this.scaleCo_MWhDiff.y(single.OMCOST_MWh_diff) - this.scaleCo_MWhDiff.y(single.CAPCOST_MWh_diff),
              CarbY: (0.4 * this.innerHeight) - this.scaleCo_MWhDiff.y(single.CARBONCOST_MWh_diff),
              // Hover Over real values
              OmCostValue: single.OMCOST_MWh_diff,
              FuelCostValue: single.FUELCOST_MWh_diff,
              CapCostValue: single.CAPCOST_MWh_diff,
              CarbCostValue: single.CARBONCOST_MWh_diff,
              AllCostValue: single.CostTotal_MWh_diff
            }
          }
        })
      })
    },
    CostTotalExtremes () {
      return {
        min: d3.min(this.allCostTotal, s => +s),
        max: d3.max(this.allCostTotal, s => +s)
      }
    },
    world () {
      console.log('NPi_v3', Object.keys(this.scenDict)[2])
      console.log('scenfilter', this.scenarioFilter)
      console.log('worldbase', this.worldBaseFilter[1][5].Value)
      return _.map(this.worldFilter, (energy, e) => {
        return _.map(energy, (single, s) => {
          return {
            year: this.scale.x(single.Year),
            value: this.scale.y(Math.sqrt(single.Value)),
            valueEJ: single.Value
          }
        })
      })
    },
    groupPosition () {
      // length of dotsArray is  = nr of energy carrier
      // returns array with the position for each energy carrier
      const dotsArray = this.dots
      let pos = 50
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
    // Calculation of values for 3 y-Axis Scales, (Only 3 bc scale for Cost per MWh stays the same for rel and abs values)
    yTicks () {
      const costMwhTicksArray = [['0', '400', '800', '1200', '1600', '2000'],
        [this.scaleCo_MWh.y(0), this.scaleCo_MWh.y(400), this.scaleCo_MWh.y(800), this.scaleCo_MWh.y(1200), this.scaleCo_MWh.y(1600), this.scaleCo_MWh.y(2000)]]
      const costTicksArray = [['0', '4', '8', '12', '16', '20'],
        [this.scaleCo.y(0), this.scaleCo.y(4000000), this.scaleCo.y(8000000), this.scaleCo.y(12000000), this.scaleCo.y(16000000), this.scaleCo.y(20000000)]]
      const costDiffTicksArray = [['-4', '0', '4', '8', '12'],
        [this.scaleCoDiff.y(-4000000), this.scaleCoDiff.y(0), this.scaleCoDiff.y(4000000), this.scaleCoDiff.y(8000000), this.scaleCoDiff.y(12000000)]]
      const tickVal = this.currentMWhSel === 'Total Cost' && this.comparison === 'absolute' ? costTicksArray : 'Total Cost' && this.comparison === 'relative' ? costDiffTicksArray : costMwhTicksArray
      return tickVal
    },
    yLabel () {
      const labelCost = ['BN$/yr', this.scaleCo.y(14000000)]
      const labelCostMwh = ['$/MWh', this.scaleCo.y(14000000)]
      const ylab = this.currentMWhSel === 'Total Cost' ? labelCost : labelCostMwh
      return ylab
    }
  },
  watch: {
    step (currentStep, previousStep) {
      if (currentStep === 2) {
        this.comparison = 'relative'
      }
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

.secondary-energy {
  height: 75vh;

  .key {
    z-index: 9;
    width: 100%;
    height: 70px;
    margin-bottom: 1%;
    padding: 0px 0px;

    top: 50px;

    background: hsla(0,0%,100%,.90);

    .highlight {
      margin-right: $margin-space*2;
      margin-top: 5px;
      margin-left: 10px;
    }
    .selectors {
      display: inline-block;
      width: 100%;
    }
    .scenario_selector {
      margin-top: $margin-space;
      margin-left: $margin-space;
      margin-right: $margin-space;
    }
    .comparison_selector{
      display: inline-flex;
      display: inline;
      margin: 5px;

    .comparison {

        cursor: pointer;
    }

    .active-comparison {
        color: $color-neon;
        text-decoration: underline;
      }
  }
    h4 {
      padding-bottom: 5px;
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
      .cost-label {
        fill: black;
        font-size: 10px;
        font-weight: bold;
      }
      .value-label {
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
      .line-label-dashed {
        stroke: $color-gray;
        stroke-width: 0.5;
        stroke-dasharray: 4 2;
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
    .Fossils-bar {
      fill: #6A7687;
      stroke: darken(#6A7687, 40);
      fill-opacity: 0.5;
    }
    .Fossils-barActive {
      fill: #6A7687;
      stroke: darken(#6A7687, 40);
      fill-opacity: 1;
    }
    .Fossils-Carb {
      fill: getColor(red, 50);
      stroke: darken(#6A7687, 40);
    }
    .Renewables {
      fill: getColor(green, 80);
      stroke: getColor(green, 40);
    }
    .Renewables-bar {
      fill: getColor(green, 80);
      stroke: getColor(green, 40);
      fill-opacity: 0.6;
    }
    .Renewables-barActive {
      fill: getColor(green, 60);
      stroke: getColor(green, 40);
      fill-opacity: 1;
    }
    .HoverLayer{
      fill-opacity: 0;
    }
    .Fossils-base {
      stroke: darken(#6A7687, 40);
      stroke-dasharray: 4 2;
      fill-opacity: 0;
    }
    .Renewables-base {
      stroke: getColor(green, 40);
      stroke-dasharray: 4 2;
      fill-opacity: 0;
    }
  }
}

</style>
