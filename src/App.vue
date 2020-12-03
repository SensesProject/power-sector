<template>
  <div id="app">
    <SensesMenu :id="'power-sector'" :minWidth="900"/>
    <div class="content" :class="mobile ? 'isMobile' : 'isDesktop'" ref="container">
      <div class="title-wrapper">
        <h1 class="module-title">Transition Risks <br>Power Sector Transformation</h1>
      </div>
      <div class="text-wrapper">
        <p class="intro-paragraph"> This is the second chapter of the Transition Risks modules. You can select another chapter below.
        The Transition Risks modules are based on the Risk Factor Pathways as created by the UNEP Finance Initiative and
        Olyver Wyman in their report <a id="link" href="https://www.unepfi.org/wordpress/wp-content/uploads/2018/04/EXTENDING-OUR-HORIZONS.pdf" target="_blank">Extending Our Horizons</a>.
        These Risk Factor Pathways (RFPs) structure the different
        types of risks that emerge for the finance sector from the transition to a low-carbon future.
      </p>
      </div>
      <h3 id="header">Transition Risks modules:</h3>
      <RiskPathway :mobile="mobile"/>
      <div class="text-wrapper">
        <h3 class="chapter-title" id="introduction">
          What risks will be discussed?
        </h3>
        <p class="cost-risk-paragraph">The Paris agreement aims to limit global warming to well-below 2°C. An essential step in
          reaching that goal is to decarbonize global electricity production. In this module we explore the risks and
          opportunities that result from the decarbonization of the power sector and we explain why investors should take
          climate policy into account in their decision-making. We analyze these risks on the basis of transition
          scenarios that are developed with global Integrated Assessment Models.
          We use three scenarios in this module: a Current Policies scenario that only includes the currently implemented
          policies, and two scenarios that aim to stabilize global mean temperature at 2 degrees and 1.5 degrees
          above pre-industrial by 2100.
          <br>
          In this module, we will explore <strong>the changes in electricity production and revenues</strong>,
          <strong>the changing risk structure</strong> of the power sector, <strong>the risk of fuel costs and emission costs</strong>,
          and <strong>the need for clean investments</strong>. Each of these risks relates to one of the Risk Factor Pathways developed
          by the UNEP Finance Initiative.
          <br>
          <br>
          In this module we group technologies by “renewables and nuclear” and “fossil-based” electricity production,
          based on their different risk profiles during the transition. Fossil electricity production, especially when
          based on natural gas, can be combined with carbon capture and sequestration (CCS) to produce low-carbon electricity,
          but this technology will then still be exposed to fuel costs and high operational expenditures and therefore is treated
          as a single category in this module.
        </p>
      </div>
      <h2 class="chapter-title" id="transition">
        Physical transition
      </h2>
      <LayoutScrollytelling>
        <template v-slot:vis="{ width, height, step }">
          <div class="vis-inner" :style="{width: `${width}px`, height: `${height}px`}">
            <SecondaryEnergyAndTotalCost :width="width" :height="height" :step="step"/>
          </div>
        </template>
        <div slot="text" class="observer">
        <IntersectionObserver :step="0"  align="right">
          <p>In climate stabilization scenarios, the power sector is expected to go through a major transition from
            fossil fuel electricity production (based on coal and gas) to renewable and nuclear-based electricity.
          </p>
        </IntersectionObserver>
        <IntersectionObserver :step="1"  align="right">
          <p>In the scenarios, this transition is driven by a carbon price that increases the relative costs per
            MWh of fossil fuels compared to renewables and nuclear technologies.
          </p>
        </IntersectionObserver>
        <IntersectionObserver :step="2"  align="right">
          <p>As a result, total revenues within the power sector (based on the MWh’s produced times the electricity price)
            shifts from fossil utilities to renewable and nuclear based utilities.
          </p>
        </IntersectionObserver>
        <IntersectionObserver no-styling :step="3"  align="right" class="changeheight">
          <p>
          </p>
        </IntersectionObserver>
      </div>
      </LayoutScrollytelling>
      <div class="text-wrapper">
        <p>Let’s have a look at the volume in electricity production of different energy carriers:</p>
      </div>
      <LayoutScrollytelling>
        <template v-slot:vis="{ width, height, step }">
          <div class="vis-inner" :style="{width: `${width}px`, height: `${height}px`}">
            <SecondaryEnergy :width="width" :height="height" :step="step"/>
          </div>
        </template>
        <div slot="text" class="observer">
        <IntersectionObserver :step="0"  align="right" class="changeheight">
          <p>Coal is quickly phased out under mitigation scenarios. However, natural gas can play a substantial
            role in power production until mid-century (partly combined with carbon capture and sequestation, CCS).
            Rapid growth is expected in low-carbon technologies like solar, wind and nuclear under the 2.0ºC and 1.5ºC
            scenarios.
          </p>
        </IntersectionObserver>
      </div>
      </LayoutScrollytelling>
      <div class="text-wrapper">
        <h2 class="chapter-title" id="structure">
          Changing risk Structure
        </h2>
        <p class="cost-risk-paragraph">Renewable energy technologies, such as solar and wind, but nuclear electricity
          as well, require higher upfront capital investments than fossil power plants. However, most renewable
          technologies do barely require fuel to operate (and to some extend this holds for nuclear as well). This
          means that the operational costs of renewable and nuclear technologies are lower and over the lifetime of the
          power plant and renewable and nuclear electricity can be produced for lower costs per MWh than fossil-based
          electricity. As a result of this difference in cost structure between fossil and renewable and nuclear
          technologies, the cost structure of the power sector will change during the transition. The sector will require
          more capital investment (CAPEX) and becomes less exposed to volatility and other changes in fuel prices,
          which as part of the operational expenditures (OPEX).

          The risk structure of the overall power sector changes in line with this development,
          from capital and fuel-related risks towards almost purely capital-related risks.
        </p>
      </div>
      <LayoutScrollytelling>
        <template v-slot:vis="{ width, height, step }">
          <div class="vis-inner" :style="{width: `${width}px`, height: `${height}px`}">
            <SecondaryEnergySum :width="width" :height="height" :step="step"/>
          </div>
        </template>
        <div slot="text" class="observer">
        <IntersectionObserver :step="0"  align="right" class="halfheight">
          <p>As we have seen above, the physical transition changes electricity production from fossil to
            renewable and nuclear technologies, which have different cost structures.
        </p>
        </IntersectionObserver>
        <IntersectionObserver :step="1"  align="right">
          <p>Capital expenditure (CAPEX) currently accounts for about 1/3rd of total fossil electricity costs
            (including fossil + CCS technologies), but this declines over time as the rising fuel costs and
            emission costs increases operational expenditures (OPEX).
            <br>
            Renewable technologies, such as solar and wind but also nuclear, have a much higher share of
            capital expenditures, accounting for more than 90% of the cost structure.
          </p>
        </IntersectionObserver>
        <IntersectionObserver :step="2"  align="right" class="changeheightstructure">
          <p>As a result of the transition, the cost structure of the total power sector evolves from
            the current balance between capital/operational expenditures towards a capital-dominated structure.</p>
        </IntersectionObserver>
      </div>
      </LayoutScrollytelling>
      <div class="text-wrapper">
        <h2 class="chapter-title" id="costs">
          Fuel Cost Risk
        </h2>
        <p class="cost-risk-paragraph">
          One of the risks that we observe in the power sector is the fuel cost risk. Fuel cost risks include all
          potential changes to fuel costs, either due to market developments or as result of the introduction of a
          carbon price. As such, the indicator shown here includes both the Direct Emission Costs indicator as well
          as the Indirect Emission Cost indicator from the
          <a id="link" href="https://www.unepfi.org/wordpress/wp-content/uploads/2018/04/EXTENDING-OUR-HORIZONS.pdf" target="_blank">UNEP-FI RFPs</a>.
          With the introduction of a carbon price,
          fuel costs per MWh will rise, increasing the costs of fossil-based electricity production and driving a
          transition in the power sector from carbon-emitting generation to low-carbon electricity. Therefore
          investors face the risk that fossil-based assets, such as coal or gas-fired power plants without CCS
          lose their value under climate policy.
          This shift is reflected in the fuel costs changes depicted in the figure below.
          </p>
      </div>
      <LayoutScrollytelling>
        <template v-slot:vis="{ width, height, step }">
          <div class="vis-inner" :style="{width: `${width}px`, height: `${height}px`}">
            <FossilCosts :width="width" :height="height" :step="step"/>
          </div>
        </template>
        <div slot="text" class="observer">
        <IntersectionObserver :step="0"  align="right">
          <p>When selecting the Current Policy scenario, we see that total fuel cost expenditures for electricity
            power sector and changes in fossil fuel prices. However, later in the century total fuel costs decline in
            this scenario due to fuel price developments.
          </p>
        </IntersectionObserver>
        <IntersectionObserver :step="1"  align="right">
          <p>In a 2.0ºC scenario the total fuel costs decrease both absolute and relative to the Current Policy scenario,
            despite increasing costs per unit of electricity production from fossil sources. This is the result
            of declining energy production from fossil fuels, reducing fuel use and therefore fuel costs.
          </p>
        </IntersectionObserver>
        <IntersectionObserver :step="2"  align="right">
          <p> In a 1.5ºC scenario, the increase in fuel prices and carbon prices is so significant that, although
            fossil fuels are almost phased out later in the century, their small share still leads to an increase in
            total fuel costs after 2040.
          </p>
        </IntersectionObserver>
        <IntersectionObserver :step="3"  align="right">
          <p>Relative to the Current Policy scenario, fuel costs are reduced strongly under mitigation,
            saving the total global power sector up to 800 million USD per year by mid-century.</p>
        </IntersectionObserver>
        <IntersectionObserver no-styling :step="4"  align="right" class="changeheight">
          <p></p>
        </IntersectionObserver>
      </div>
      </LayoutScrollytelling>
      <div class="text-wrapper">
        <h2 class="chapter-title" id="structure">
          Investment need
        </h2>
        <p class="cost-risk-paragraph">As discussed above, if a carbon price is introduced, generating
          low-carbon energy will become more attractive which will lead to a shift in the power sector
          towards renewables and nuclear. However this transition requires a growth in investments
          in the power sector, because both renewables and nuclear are more capital intensive than fossil fuel
          power production. Therefore, the transition comes with a large investment need in low-carbon
          electricity production.</p>
      </div>
      <LayoutScrollytelling>
        <template v-slot:vis="{ width, height, step }">
          <div class="vis-inner" :style="{width: `${width}px`, height: `${height}px`}">
            <InvestmentNeed :width="width" :height="height" :step="step"/>
          </div>
        </template>
        <div slot="text" class="observer">
          <IntersectionObserver :step="0"  align="right">
            <p>Just under  half of the 1066 Billion USD per year for power sector investments in the Current Policy
              scenario goes to Transmission and Distribution, the rest is distributed over a range of fossil,
              renewable and nuclear electricity production technologies.
              With more stringent climate goals, moving from the Nationally Determined Contributions (NDCs)
              to the 2 degree and 1.5 degree scenarios, the investments in fossil power generation decrease
              and the investments in low-carbon technologies increase considerably.
            </p>
          </IntersectionObserver>
          <IntersectionObserver :step="1"  align="right">
            <p>This figure provides just a single example from a single model. For more insights on the
              uncertainty investment requirements see the module
              <a  id="link" href="https://climatescenarios.org/investment/" target="_blank">↗ Investment Opportunities and Alignment</a>.
            </p>
          </IntersectionObserver>
        </div>
      </LayoutScrollytelling>
      <div class="text-wrapper" id="last-text">
        <h2 class="chapter-title" id="conclusion">
          Assessing risks with the help of climate scenarios
        </h2>
        <p class="cost-risk-paragraph">In this module we have seen that the transition in the electricity production sector leads to a
          changing cost structure that is strongly dominated by capital expenditures. However, while fossil fuels
          are around, their prices and taxation still pose a fuel cost risk and emission cost risk. Finally,
          to facilitate the transition towards low-carbon technologies, investment needs provide an opportunity
          for the financial sector.
          The examples shown in this module are all based on a single Integrated Assessment Model.
          For more information on uncertainty across models, see the <a id="link" href="https://climatescenarios.org/gems/#/transition-risk" target="_blank">↗ Guided Explore Module</a>.
          </p>
      </div>
      <SensesMeta :id="'power-sector'"/>
    </div>
  </div>
</template>

<script>
// Library Components
import SensesMenu from 'library/src/components/SensesMenu.vue'
import SensesMeta from 'library/src/components/SensesMeta.vue'
// Scrollytelling
import LayoutScrollytelling from 'library/src/components/LayoutScrollytelling.vue'
import IntersectionObserver from 'library/src/components/IntersectionObserver.vue'
// Visualization Components
import RiskPathway from './components/RiskPathway.vue'
import SecondaryEnergyAndTotalCost from './components/SecondaryEnergyAndTotalCost.vue'
import SecondaryEnergy from './components/SecondaryEnergy.vue'
import InvestmentNeed from './components/InvestmentNeed.vue'
import FossilCosts from './components/FossilCosts.vue'
import SecondaryEnergySum from './components/SecondaryEnergySum.vue'

export default {
  name: 'App',
  components: {
    SensesMenu,
    LayoutScrollytelling,
    IntersectionObserver,
    SensesMeta,
    RiskPathway,
    SecondaryEnergy,
    InvestmentNeed,
    FossilCosts,
    SecondaryEnergyAndTotalCost,
    SecondaryEnergySum
  },
  data () {
    return {
      width: 0,
      height: 0
    }
  },
  computed: {
    mobile () {
      return this.width < 750
    }
  },
  methods: {
    calcSizes () {
      const { container: el } = this.$refs
      const totalWidth = el.clientWidth || el.parentNode.clientWidth
      const totalHeight = el.clientHeight || el.parentNode.clientHeight
      this.width = Math.max(totalWidth, 400)
      this.height = Math.max(totalHeight, 400)
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

<style lang="scss">
@import "library/src/style/base.scss";
@import "library/src/style/variables.scss";

#app {
  margin: 0 auto;

  .changeheight {
    padding-bottom: 2000px;
  }
  .changeheightstructure {
    padding-bottom: 1000px;
  }
  #link {
    background: none;
    outline: none;
  }
  .content {
    max-width: 900px;
    margin: 0 auto;
    .title-wrapper {
      margin-bottom: $spacing;
      .module-title {
        font-size: 40px;
        margin-bottom: $spacing *1.5;
        padding-top: $spacing;
      }
    }
    .not-available {
      cursor: not-allowed;
        color: gray;
        opacity: 0.7;
        background: none;
    }
    #header {
      margin-bottom: $spacing/2;
    }
    .text-wrapper {
      margin-top: $spacing;
      margin-bottom: $spacing;

      .cost-risk-paragraph {
        margin-bottom: $spacing * 2;
        column-count: 2;
      }
      .intro-paragraph {
        margin-bottom: $spacing * 0.5;
        column-count: 2;
      }
      .chapter-title {
        margin-bottom: $spacing;
        padding-top: $spacing;
        &#introduction {
          margin-bottom: $spacing/3;

        }

      }

      &#last-text {
        margin-bottom: 100px;
      }

      #conclusion {
        padding-top: 30px;
      }
    }
    .intersection-observer .default.right {
      -webkit-box-shadow: 2px 2px 9px 0px rgba(128,128,128,0.12);
      -moz-box-shadow: 2px 2px 9px 0px rgba(128,128,128,0.12);
      box-shadow: 2px 2px 9px 0px rgba(128,128,128,0.12);
    }
    .vis-wrapper {
      margin-top: $spacing;
      // border: 0.5px solid lightblue;
      // height: 100vh;

      &.secondaryenergy  {
        height: 100vh;
      }
      &.CostStructure  {
        height: 75vh;
      }
      &.CostStructureAgg  {
        height: 45vh;
      }
    }

    .module-meta {
      margin-bottom: $spacing;
    }

    &.isMobile {
      .text-wrapper {
        padding: 0 20px;
      }
      .module-title {
        padding-left: $spacing/2;
      }
      #header {
        padding-left: $spacing/2;
      }
    }
  }
}
</style>
