<template>
  <div class="secondary-energy" ref="inWrapper">
    <div class="key" :class=" mobile ? 'mobile' : 'desktop'">
      <h3 v-if="step < 1" >Electricity production </h3>
      <h3 v-else>Electricity production and production costs/revenue</h3>
      <a href="https://docs.messageix.org/projects/global/en/latest/" target="_blank">(Model: MESSAGEix-GLOBIOM_1.0)</a>
    </div>
    <div class="key" :class=" mobile ? 'mobile' : 'desktop'">
      <p v-if="step<1" class="selectors">
        Select a scenario:
        <SensesSelect class="scenario_selector" :options="scenarios" v-model="currentScenario"/>
      </p>
      <p v-else class="selectors">
        Select a scenario and cost type:
        <SensesSelect class="scenario_selector" :options="scenarios" v-model="currentScenario"/>
        <!-- selector for bar chart between revenue and costs per MWh -->
        <SensesSelect class="MWh_selector" :options="MWhSel" v-model="currentMWhSel"/>
        <!-- selector for abs and rel values -->
        <span class="comparison_selector" v-if="step > 2"> <span
          class="comparison"
          :class="comparison === 'absolute' ? '' : 'active-comparison'"
          v-on:click="comparison = 'absolute'"
          >Absolute</span>
          | <span
          class="comparison"
          :class="comparison === 'relative' ? '' : 'active-comparison'"
          v-on:click="comparison = 'relative'"
          >Relative to current policy scenario</span>
        </span>
      </p>
    </div>
    <p class="legend">
      <span class="dot"></span>
      <span > = 3 000 TWh/yr</span>
      <span class="-fossil">Fossil</span>
      <span class="-carbon">Low-carbon</span>
      <span v-if="step >= 1 && currentMWhSel == 'Cost per MWh' && comparison == 'absolute' && currentScenario !== 'Current Policies'" class="-tax">Carbon price </span>
    </p>
    <div></div>
    <svg :width="(innerWidth)" :height="innerHeight" :transform="`translate(${margin.left}, 0)`">
      <!--  <circle class="year-dot" cx="20" cy="12" r="10"/> -->

      <!-- dots Graph -->
      <g v-for="(group, g) in dots.slice(0, 2)" v-bind:key="g + 'group'" :class="`${labels[g]}-group`" :transform="`translate(0, ${groupPosition[g]})`">
        <!-- draws dots for energy carrier with index g -->
        <g>
        <circle v-for="(dot, d) in group" v-bind:key="d + 'dot'" @mouseover="[active = true, over = d + labels[g]]" @mouseleave="active = false" :class="labels[g]" :cx="dot.year" cy="5" :r="dot.value"/>
        <!-- labels for energy carrier g-->
        <!-- <text class="legend-label" :x="scale.x(2009.5)" y="10">{{ labels[g] }}</text> -->
        </g>
        <g v-if="comparison == 'relative'">
        <circle v-for="(dot, d) in group" v-bind:key="d + 'Basedot'" @mouseover="[active = true, over = d + labels[g]]" @mouseleave="active = false" :class="`${labels[g]}-base`" :cx="dot.year" cy="5" :r="dot.basevalue"/>
        </g>
        <!-- year labels for first and last year in dataset -->
        <g v-if="step < 1" >
        <g v-for="(text, t) in group" :key="t + 'text'" >
          <g v-if="t == 0 || t == 8">
          <text class="year-label" :x="text.year" y="22">{{ years[t] }}</text>
          </g>
        </g>
      </g>
      </g>
    <g v-for="(group, g) in world.slice(0, 2)" v-bind:key="g + 'wgroup'" :class="`${labels[g]}-wgroup`" :transform="`translate(0, ${groupPosition[g]})`">
      <!--   draws hotizontal axis line through dots and small circles at the beginning and end of axis  -->
        <g  v-if="step < 1" class="axis_group">
          <line class="axis" y1="5" y2="5" :x1="scale.x(2020)" :x2="scale.x(2100)"/>
          <circle class="axis-dot" :cx="scale.x(2020)" cy="5" r="2.5"/>
          <circle class="axis-dot" :cx="scale.x(2100)" cy="5" r="2.5"/>
        </g>
        <!-- Hover over, shows values for each dot -->
        <g v-for="(text, t) in group" v-bind:key="t + 'text'" :class="active === true & over === t + labels[g] & comparison === 'absolute' ? 'visible' : 'invisible'">
          <circle class="year-dot" :cx="text.year" cy="5" r="2.5"/>
          <text class="year-label" :x="text.year" y="22">{{ years[t] }}</text>
          <text class="year-label" :x="text.year" y="-32">{{ format(Math.round(text.valueTWh)) }} TWh/yr</text>
          <line class="line-label" :x1="text.year" :x2="text.year" y1="-25" y2="5"/>
        </g>
        <g v-for="(text, t) in dots[g]" v-bind:key="t + 'textDiff'" :class="active === true & over === t + labels[g] & comparison === 'relative' ? 'visible' : 'invisible'">
          <circle class="year-dot" :cx="text.year" cy="5" r="2.5"/>
          <text class="year-label" :x="text.year" y="20">{{ years[t] }}</text>
          <text class="year-label" :x="text.year" y="-28">Diff to baseline:</text>
          <text class="year-label" :x="text.year" y="-15">{{ format(Math.round(text.valueDiff)) }} TWh/yr</text>
        </g>
      </g>
    <!-- Bar Graph -->
    <g v-if="step >= 1">
    <!-- <line class="axis" :x1="0" :y1="(0.5*innerHeight)" :x2="0.95*innerWidth" :y2="(0.5*innerHeight)" /> -->
    <!--x Axis-->
    <g v-for="(year, j) in years" v-bind:key="j+'year'">
      <!--vertical lines through all dots-->
      <line class="axis-vertical" :x1="scale.x(year)" y1="50" :x2="scale.x(year)" :y2="(0.75*innerHeight)"/>
      <text class="year-label" :x="scale.x(year)" :y="(0.77*innerHeight)">{{ years[j] }}</text>
    </g>
    <!--y Axis-->
    <g v-for="(val, v) in yTicks[0]" v-bind:key="v+'val'">
      <line class="axis" x1="65" :y1="(0.75 * innerHeight) - yTicks[1][v]" x2="90" :y2="(0.75 * innerHeight) - yTicks[1][v]"/>
      <text class="yAxis" x="50" :y="(0.75 * innerHeight) - yTicks[1][v] -3" > {{ val }} </text>
    </g>
    <!-- <text class="value-label" x="35" :y="(0.47 * innerHeight)" >{{ yAxisLabel[0] }} </text> -->
    <text class="yAxis-label" x="0" y="40" :transform='`translate(${-margin.left * 2.5} ${innerHeight*0.63} ) rotate(-90)`'>{{ yAxisLabel[0] }}</text>
    <g v-if="comparison == 'absolute'">
    <!--bars for Cost per MWh absolute values-->
    <g v-if="currentMWhSel == 'Cost per MWh'">
      <g v-for="(group, g) in dots" v-bind:key="g + 'rgroup'" :class="`${labels[g]}-group`" >
          <g>
            <rect v-for="(rec, r) in group" v-bind:key="r + 'rect6'" @mouseover="[activeLayer = true, over = r + labels[g] ]" @mouseleave="activeLayer = false" :class="activeLayer === true & (over === r + labels[0]|over === r + labels[1]) ? labels[g] + '-barActive' : labels[g] + '-bar'" :width="rec.barWidth" :x="(rec.year+barXshift[g]-1.1*rec.barWidth)" :y="(rec.AllY+0.35*innerHeight)" :height="rec.AllCosts"/>
          </g>
        </g>
    </g>
    <g v-if="currentMWhSel == 'Cost per MWh' && currentScenario !== 'Current Policies'">
    <!--For 1.5 and 2.0 scenarios show costs and display the tax for fossils bar only-->
      <g :class="`${labels[0]}-group`" >
          <g>
            <rect v-for="(rec, r) in dots[0]" v-bind:key="r + 'rect9'" @mouseover="[activeTax = true, over = r + labels[0]]" @mouseleave="activeTax = false" :class="activeTax === true & over === r + labels[0] ? 'Tax-barActive' : 'Tax-bar'" :width="rec.barWidth" :x="(rec.year+barXshift[0]-1.1*rec.barWidth)" :y="(rec.AllY+0.35*innerHeight)" :height="rec.TaxCosts"/>
          </g>
      </g>
    </g>
    <!--stacked bar revenue-->
    <g v-if="currentMWhSel == 'Revenue'">
      <g  :class="`${labels[0]}-group`" >
          <g>
          <rect v-for="(rec, r) in dots[0]" v-bind:key="r + 'rect6'" @mouseover="[activeLayer = true, over = r + labels[0] ]" @mouseleave="activeLayer = false" :class="activeLayer === true & (over === r + labels[0]|over === r + labels[1]) ? labels[0] + '-barActive' : labels[0] + '-bar'" :width="rec.barWidth" :x="(rec.year+barXshift[0]-0.5*rec.barWidth)" :y="(rec.AllY+0.35*innerHeight)" :height="rec.AllCosts"/>
          <rect v-for="(rec, r) in dots[0]" v-bind:key="r + 'rect7'" @mouseover="[activeLayer = true, over = r + labels[1] ]" @mouseleave="activeLayer = false" :class="activeLayer === true & (over === r + labels[1]|over === r + labels[0]) ? labels[1] + '-barActive' : labels[1] + '-bar'" :width="rec.barWidth" :x="(rec.year+barXshift[0]-0.5*rec.barWidth)" :y="(rec.RevVarY+0.35*innerHeight)" :height="rec.RevVar"/>
      </g>
      </g>
    </g>
    </g>
    <!-- bar with costs for relative values-->
    <g v-else>
      <g v-for="(group, g) in dots" v-bind:key="g + 'rgroup'" :class="`${labels[g]}-group`" >
          <g>
          <rect v-for="(rec, r) in group" v-bind:key="r + 'rect5'" @mouseover="[activeLayer = true, over = r + labels[g] ]" @mouseleave="activeLayer = false" :class="activeLayer === true & (over === r + labels[0]|over === r + labels[1]) ? labels[g] + '-barActive' : labels[g] + '-bar'" :width="rec.barWidth" :x="(rec.year+barXshift[g]-1.1*rec.barWidth)" :y="(rec.AllY+0.35*innerHeight)" :height="rec.AllCosts"/>
          </g>
    </g>
  </g>
  <!--transparent bar for hover over-->
<!--  <rect v-for="(layer, l) in dots[0]" v-bind:key="l + 'layer'"  @mouseover="[activeLayer = true, over = l + labels[0]]" @mouseleave="activeLayer = false" class="HoverLayer" :width="layer.barWidth*4" :x="(layer.year)" :y="(0.45*innerHeight)" :height="(0.4*innerHeight)"/> -->
  <g v-for="(group, g) in dots" v-bind:key="g + 'textgroup'" :class="`${labels[g]}-group`" >
      <!--Text: Values on mouse over for barchart-->
      <g v-for="(text, t) in group" v-bind:key="t + 'texttax'" :class="activeTax === true & over === t + labels[g] ? 'visible' : 'invisible'">
        <text class="year-label" :x="(text.year)" :y="(0.84*innerHeight)">Carbon price: {{ format(Math.round(text.TaxValue)) }} {{text.Unit}}</text>
        <!--Line and circle for hover over indicator-->
        <line class="line-label" :x1="text.year" :x2="text.year" :y1="(0.81*innerHeight)" :y2="(0.78*innerHeight)"/>
        <circle class="year-dot" :cx="text.year" :cy="(0.81*innerHeight)" r="2"/>
      </g>
        <g v-for="(text, t) in group" v-bind:key="t + 'textAll'" :class="activeLayer === true & over === t + labels[g] ? 'visible' : 'invisible'">
          <text class="year-label" :x="(text.year)" :y="(0.84*innerHeight)">Fossil: {{ format(Math.round(dots[0][t].AllCostValue)) }} {{text.Unit}}</text>
          <text class="year-label" :x="(text.year)" :y="(0.86*innerHeight)">Low-carbon: {{ format(Math.round(dots[1][t].AllCostValue)) }} {{text.Unit}}</text>
          <text v-if="comparison == 'absolute' && currentMWhSel == 'Revenue'" class="year-label" :x="(text.year)" :y="(0.88*innerHeight)">Total: {{ format(Math.round(dots[0][t].AllCostValue + dots[1][t].AllCostValue)) }} {{text.Unit}}</text>
          <!--Line and circle for hover over indicator-->
          <line class="line-label" :x1="text.year" :x2="text.year" :y1="(0.81*innerHeight)" :y2="(0.78*innerHeight)"/>
          <circle class="year-dot" :cx="text.year" :cy="(0.81*innerHeight)" r="2"/>
        </g>
        <!--horizontal dashed line at y=0 for case of rel value -->
        <g v-if="currentMWhSel == 'Revenue'" >
          <line class="line-label-dashed" :x1="scale.x(2020)" :x2="scale.x(2104.5)" :y1="(0.75*innerHeight) - scaleCoDiff.y(0)" :y2="(0.75*innerHeight)- scaleCoDiff.y(0)"/>
        </g>
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
      liste: ['test', '2.0ºC', 'Current Policies'],
      scenDict: { '1.5ºC': 'NPi2020_400_v3', '2.0ºC': 'NPi2020_1000_v3', 'Current Policies': 'NPi_v3' },
      regions: [...new Set(SecondaryEnergyAndAllCosts.map(r => r.Region))],
      allValues: [...new Set(SecondaryEnergyAndAllCosts.map(r => r.Value))],
      allDiffValues: [...new Set(SecondaryEnergyAndAllCosts.map(r => r.Value_diff))],
      // new Array for all "Total Cost in mwh" values to create yAxis
      allRevenue: [...new Set(SecondaryEnergyAndAllCosts.map(r => r.Revenue))],
      allCostTotal_MWh: [...new Set(SecondaryEnergyAndAllCosts.map(r => r.CostTotal_MWh))],
      MWhSel: ['Revenue', 'Cost per MWh'],
      tooltip: 'Here a description of what Secondary Energy is!',
      currentMWhSel: 'Cost per MWh',
      currentScenario: '1.5ºC',
      currentRegion: 'World',
      currenttest: 'test',
      comparison: 'absolute',
      active: false,
      activeTax: false,
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
    worldFilterAllRevenue () {
      const vals = []
      _.forEach(this.SecondaryEnergyAndAllCosts, (data, d) => {
        if (data.Region === 'World') {
          vals.push(data.Revenue)
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
    worldFilterAllRevenueDiffTotal () {
      const vals = []
      _.forEach(this.SecondaryEnergyAndAllCosts, (data, d) => {
        if (data.Region === 'World') {
          vals.push(data.Revenue_diff)
        }
      })
      return vals
    },
    // filters only the values of world from all costs Diff per MWh
    worldFilterAllCostDiffTotal_MWh () {
      const vals = []
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
          .range([90, this.innerWidth - (this.margin.right * 12)])
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
    // ScaleCo for Barchart for Revenue
    scaleCo () {
      return {
        x: d3.scaleLinear()
          .range([4 * this.margin.left, this.innerWidth - (this.margin.right * 4)])
          .domain([2020, 2110]),
        y: d3.scaleLinear()
          .range([0, 0.2 * this.innerHeight])
          .domain([0, d3.max(this.worldFilterAllRevenue, s => +s)])
      }
    },
    // ScaleCo for Barchart for Revenue difference to baseline
    scaleCoDiff () {
      return {
        x: d3.scaleLinear()
          .range([4 * this.margin.left, this.innerWidth - (this.margin.right * 4)])
          .domain([2020, 2110]),
        y: d3.scaleLinear()
          .range([0, 0.2 * this.innerHeight])
          .domain([d3.min(this.worldFilterAllRevenueDiffTotal, s => +s), d3.max(this.worldFilterAllRevenueDiffTotal, s => +s)])
      }
    },
    // ScaleCo_MWh for Barchart for Costs per MWh
    scaleCo_MWh () {
      return {
        x: d3.scaleLinear()
          .range([4 * this.margin.left, this.innerWidth - (this.margin.right * 4)])
          .domain([2020, 2110]),
        y: d3.scaleLinear()
          .range([0, 0.25 * this.innerHeight])
          .domain([0, d3.max(this.worldFilterAllCostTotal_MWh, s => +s)])
      }
    },
    // ScaleCo_MWh for Barchart for Costs per MWh diference to baseline
    scaleCo_MWhDiff () {
      return {
        x: d3.scaleLinear()
          .range([4 * this.margin.left, this.innerWidth - (this.margin.right * 4)])
          .domain([2020, 2110]),
        y: d3.scaleLinear()
          .range([0, 0.25 * this.innerHeight])
          .domain([d3.min(this.worldFilterAllCostDiffTotal_MWh, s => +s), d3.max(this.worldFilterAllCostDiffTotal_MWh, s => +s)])
      }
    },
    dots () {
      const basedata = this.worldBaseFilter
      return _.map(this.worldFilter, (energy, e) => {
        return _.map(energy, (single, s) => {
          if (this.currentMWhSel === 'Revenue' && this.comparison === 'absolute') {
            return {
              year: this.scale.x(single.Year),
              barWidth: (0.8 * this.sectWidth) / 4,
              Unit: this.currentMWhSel === 'Revenue' ? 'BN$/yr' : '$/MWh',
              // Values for circles
              value: this.scale.y(Math.sqrt(single.Value)),
              basevalue: this.scale.y(Math.sqrt(basedata[e][s].Value)),
              valueDiff: single.Value_diff * 277.78,
              // Values for Bars Height
              AllCosts: this.scaleCo.y(single.Revenue),
              RevVar: this.scaleCo.y(single.Revenue_var),
              AllCostsDiff: this.scaleCo.y(single.Revenue_diff),
              // Y Values for Barchart
              // need to substract "this.scaleCoDiff.y(0)" because of neg values, y(0) is not 0 but a section from 0.4 *innerHeight
              AllY: (0.4 * this.innerHeight) - this.scaleCo.y(single.Revenue) - this.scaleCo.y(single.Revenue_var) - this.scaleCoDiff.y(0),
              // need to substract "this.scaleCoDiff.y(0)" because of neg values, y(0) is not 0 but a section from 0.4 *innerHeight
              RevVarY: (0.4 * this.innerHeight) - this.scaleCo.y(single.Revenue_var) - this.scaleCoDiff.y(0),
              // Hover Over real values
              RevVarValue: parseFloat(single.Revenue_var),
              AllCostValue: parseFloat(single.Revenue),
              RevTotalValue: this.RevVarValue + this.AllCostValue
            }
          } else if (this.currentMWhSel === 'Revenue' && this.comparison === 'relative') {
            return {
              year: this.scale.x(single.Year),
              barWidth: (0.8 * this.sectWidth) / 4,
              Unit: this.currentMWhSel === 'Revenue' ? 'BN$/yr' : '$/MWh',
              // Values for circles
              value: this.scale.y(Math.sqrt(single.Value)),
              basevalue: this.scale.y(Math.sqrt(basedata[e][s].Value)),
              valueDiff: single.Value_diff * 277.78,
              // Values for Bars Height
              // due to neg values the absolute number of CostTotal_diff is needed
              // need to substract "this.scaleCoDiff.y(0)" because of neg values, y(0) is not 0 but a section from 0.4 *innerHeight
              AllCosts: this.scaleCoDiff.y(Math.abs(single.Revenue_diff)) - this.scaleCoDiff.y(0),
              // Y Values for Barchart
              // case distinction for negative values bc y-value for neg values is O
              AllY: single.Revenue_diff >= 0 ? (0.4 * this.innerHeight) - this.scaleCoDiff.y(single.Revenue_diff) : (0.4 * this.innerHeight) - this.scaleCoDiff.y(0),
              // Hover Over real values
              AllCostValue: single.Revenue_diff
            }
          } else if (this.currentMWhSel !== 'Revenue' && this.comparison === 'absolute') {
          // //  block of code to be executed if the condition1 is false and condition2 is false
            return {
              year: this.scale.x(single.Year),
              barWidth: (0.8 * this.sectWidth) / 4,
              Unit: this.currentMWhSel === 'Revenue' ? 'BN$/yr' : '$/MWh',
              // Values for circles
              value: this.scale.y(Math.sqrt(single.Value)),
              basevalue: this.scale.y(Math.sqrt(basedata[e][s].Value)),
              valueDiff: single.Value_diff * 277.78,
              // Values for Bars Height
              AllCosts: this.scaleCo_MWh.y(single.CostTotal_MWh),
              CpolCosts: this.scaleCo_MWh.y(single.Cost_MWh_Cpol),
              TaxCosts: this.scaleCo_MWh.y(single.CostTotal_MWh) - this.scaleCo_MWh.y(single.Cost_MWh_Cpol),
              // Y Values for Barchart
              AllY: (0.4 * this.innerHeight) - this.scaleCo_MWh.y(single.CostTotal_MWh),
              TaxY: (0.4 * this.innerHeight) - this.scaleCo_MWh.y(single.CostTotal_MWh),
              OmY: (0.4 * this.innerHeight) - this.scaleCo_MWh.y(single.OMCOST_MWh),
              // Hover Over real values
              TaxValue: single.CostTotal_MWh - single.Cost_MWh_Cpol,
              AllCostValue: single.CostTotal_MWh
            }
          } else {
            return {
              year: this.scale.x(single.Year),
              barWidth: (0.8 * this.sectWidth) / 4,
              Unit: this.currentMWhSel === 'Revenue' ? 'BN$/yr' : '$/MWh',
              // Values for circles
              value: this.scale.y(Math.sqrt(single.Value)),
              basevalue: this.scale.y(Math.sqrt(basedata[e][s].Value)),
              valueDiff: single.Value_diff * 277.78,
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
        min: d3.min(this.allRevenue, s => +s),
        max: d3.max(this.allRevenue, s => +s)
      }
    },
    world () {
      return _.map(this.worldFilter, (energy, e) => {
        return _.map(energy, (single, s) => {
          return {
            year: this.scale.x(single.Year),
            value: this.scale.y(Math.sqrt(single.Value)),
            // Hover Over real values convert EJ values to TWh by multiplying them with 277,78
            valueTWh: single.Value * 277.78
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
        if (e !== 0) { pos = pos + (1.1 * this.innerHeight) / dotsArray.length - 240 }
        return pos
      })
    },
    barXshift () {
      // length of dotsArray is  = nr of energy carrier
      // returns array with the position for each energy carrier
      const shiftarray = [0, (0.8 * this.sectWidth) / 3.3]
      return shiftarray
    },
    // Calculation of values for 4 y-Axis Scales
    yTicks () {
      const costMwhTicksArray = [['0', '400', '800', '1200', '1600', '2000'],
        [this.scaleCo_MWh.y(0), this.scaleCo_MWh.y(400), this.scaleCo_MWh.y(800), this.scaleCo_MWh.y(1200), this.scaleCo_MWh.y(1600), this.scaleCo_MWh.y(2000)]]
      const costMwhDiffTicksArray = [['0', '400', '800', '1200', '1600', '2000'],
        [this.scaleCo_MWh.y(0), this.scaleCo_MWh.y(400), this.scaleCo_MWh.y(800), this.scaleCo_MWh.y(1200), this.scaleCo_MWh.y(1600), this.scaleCo_MWh.y(2000)]]
      const revTicksArray = [['-4 000', '0', '4 000', '8 000', '12 000'],
        [this.scaleCoDiff.y(-4000), this.scaleCoDiff.y(0), this.scaleCoDiff.y(4000), this.scaleCoDiff.y(8000), this.scaleCoDiff.y(12000)]]
      const revDiffTicksArray = [['-4 000', '0', '4 000', '8 000', '12 000'],
        [this.scaleCoDiff.y(-4000), this.scaleCoDiff.y(0), this.scaleCoDiff.y(4000), this.scaleCoDiff.y(8000), this.scaleCoDiff.y(12000)]]
      const tickVal = this.currentMWhSel === 'Revenue' && this.comparison === 'absolute' ? revTicksArray : this.currentMWhSel === 'Revenue' && this.comparison === 'relative' ? revDiffTicksArray : this.currentMWhSel === 'Cost per MWh' && this.comparison === 'relative' ? costMwhDiffTicksArray : costMwhTicksArray
      return tickVal
    },
    // returns Units for Y axis
    yLabel () {
      const labelCost = ['BN$/yr', this.scaleCo_MWh.y(1450)]
      const labelCostMwh = ['$/MWh', this.scaleCo_MWh.y(1450)]
      const ylab = this.currentMWhSel === 'Revenue' ? labelCost : labelCostMwh
      return ylab
    },
    // returns Units for Y axis
    yAxisLabel () {
      const labelCost = ['Revenue in BN$/yr', this.scaleCo_MWh.y(1450)]
      const labelCostMwh = ['Costs in $/MWh', this.scaleCo_MWh.y(1450)]
      const ylab = this.currentMWhSel === 'Revenue' ? labelCost : labelCostMwh
      return ylab
    }
  },
  watch: {
    step (currentStep, previousStep) {
      if (currentStep === 1) {
        this.currentMWhSel = 'Cost per MWh'
      } if (currentStep === 2) {
        this.currentMWhSel = 'Revenue'
      } if (currentStep === 3) {
        this.comparison = 'relative'
      } else {
        this.comparison = 'absolute'
      }
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
  height: 82vh;

  .key {
    z-index: 9;
    width: 100%;
    height: 10px;
    padding: 20px 0px;
    top: 10px;
    background: hsla(0,0%,100%,.90);

    .highlight {
      margin-right: $margin-space*2;
      margin-top: 5px;
      margin-left: 10px;
    }
    .selectors {
      display: inline-block;
      width: 100%;
      margin-left: $margin-space;
    }
    .scenario_selector {
      margin-top: $margin-space;
      margin-left: $margin-space/2;
      //margin-right: $margin-space/2;
    }
    .comparison_selector{
      display: inline-flex;
      display: inline;
      margin: 5px;
      margin-left: $margin-space*2;

    .comparison {

        cursor: pointer;
    }

    .active-comparison {
        color: getColor(neon, 40);
        text-decoration: underline;
      }
  }
    h3 {
      padding-bottom: 10px;
      display: inline-block;
      margin-left: $margin-space;
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
    margin-top: $margin-space*1.5;
    margin-left: $margin-space;
    font-size: 0.7em;
    display: flex;
    flex-direction: row;
    align-items: center;
    .-fossil{
      background-color: rgba(128,108,198,0.4);
      color: getColor(violet, 40);
      padding: 0 0.25em 0 0.25em;
      border-radius: 2px;
      margin-left:  10px;
    }
    .-carbon{
      background-color: rgba(162, 231, 186, 0.5);
      color: getColor(green, 20);
      padding: 0 0.25em 0 0.25em;
      border-radius: 2px;
      margin-left:  5px;
    }
    .-tax{
      background-color: rgba(243,145,114, 0.5);
      color: getColor(orange, 20);
      padding: 0 0.25em 0 0.25em;
      border-radius: 2px;
      margin-left:  5px;
    }
    .dot {
      border-radius: 50%;
      width: 27px;
      height: 27px;
      display: inline-block;
      border: 1px solid grey;
      margin-right: 3px;
    }
  }

  svg {
    height: 89%;
    .axis {
      stroke: $color-gray;
      stroke-width: 0.3;

    }
    .axis-vertical {
      stroke: $color-gray;
      stroke-width: 0.3;
    }
    circle {
      fill: $color-gray;
      fill-opacity: 0.5;
      transition: r 0.5s;
    }
    .axis-dot {
      fill-opacity: 1;
    }
    .legend-dot {
      fill: none;
      stroke: $color-gray;
      display: inline-block;
    }
    g {
      .year-label {
        text-anchor: middle;
        fill: black;
        font-size: 0.7em;
        text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white;
      }
      .yAxis{
        fill: black;
        font-size: 0.7em;
        text-anchor: middle;
      }
      .yAxis-label{
        fill: black;
        font-size: 0.7em;
        text-anchor: middle;
        letter-spacing: 0.05em;
      }
      .cost-label {
        fill: black;
        font-size: 0.7em;
        font-weight: bold;
        text-anchor: middle;
        text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white;
      }
      .value-label {
        fill: black;
        font-size: 0.7em;
        text-anchor: middle;
        text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white;
      }
      .legend-label {
        fill: black;
        font-size: 0.7em;
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
    .Fossil {
      fill: getColor(violet, 60);
      stroke: getColor(violet, 40);
    }
    .Fossil-bar {
      fill: getColor(violet, 60);
      stroke: getColor(violet, 40);
      fill-opacity: 0.5;
      stroke-opacity: 0.6;
    }
    .Tax-bar-legend {
      fill: getColor(orange, 80);
      stroke: getColor(orange, 40);
      fill-opacity: 0.8;
      stroke-opacity: 0.8;
      stroke-width:1;
    }
    .Tax-bar {
      fill: getColor(orange, 80);
      stroke: getColor(orange, 0);
      fill-opacity: 0.9;
      stroke-opacity: 1;
      stroke-width:0.1;
    }
    .Tax-barActive {
      fill: getColor(orange, 60);
      stroke: getColor(orange, 40);
      fill-opacity: 1;
    }
    .Fossil-barActive {
      fill: getColor(violet, 40);
      stroke: getColor(violet, 0);
      fill-opacity: 0.8;
    }
    .Fossil-Carb {
      fill: getColor(red, 50);
      stroke: darken(#6A7687, 40);
    }
    .Low-carbon {
      fill: getColor(green, 80);
      stroke: getColor(green, 40);
    }
    .Low-carbon-bar {
      fill: getColor(green, 80);
      stroke: getColor(green, 40);
      fill-opacity: 0.5;
      stroke-opacity:0.8;
    }
    .Low-carbon-barActive {
      fill: getColor(green, 40);
      stroke: getColor(green, 40);
      fill-opacity: 0.7;
    }
    .HoverLayer{
      fill-opacity: 0;
    }
    .Fossil-base {
      stroke: darken(#6A7687, 40);
      stroke-dasharray: 4 2;
      fill-opacity: 0;
    }
    .Low-carbon-base {
      stroke: getColor(green, 40);
      stroke-dasharray: 4 2;
      fill-opacity: 0;
    }
  }
}

</style>
