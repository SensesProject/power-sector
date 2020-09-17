<template>
  <div id="app">
    <SensesMenu :id="'power-sector'"/>
    <div class="content" :class="mobile ? 'isMobile' : 'isDesktop'" ref="container">
      <div class="text-wrapper">
        <h1 class="module-title">Transition Risks – Power Sector Transformation</h1>
        <p>This is the second chapter of the Finance Risks Pathway.
          You can select another chapter below.</p>
      </div>
      <RiskPathway :mobile="mobile"/>
      <div class="text-wrapper">
        <h2 class="chapter-title" id="introduction">
          What risks will be discussed?
        </h2>
        <p class="cost-risk-paragraph">The Paris agreement aims to limit global warming to well-below 2°C.
          An essential step in reaching that goal is to decarbonize global electricity production.
          In this module we explore the risks and opportunities that result from the decarbonization of
          the power sector and we explain why investors should take climate policy into account in their
          decision-making. We will explore the changes in electricity production and revenue, the <b>changing risk structure </b>
          of the power sector, the <b>risk of fuel costs </b> and emission costs, and the need for clean investments.
        </p>
      </div>
      <LayoutScrollytelling>
        <template v-slot:vis="{ width, height, step }">
          <div class="vis-inner" :style="{width: `${width}px`, height: `${height}px`}">
            <SecondaryEnergyAndTotalCost :width="width" :height="height" :step="step"/>
          </div>
        </template>
        <div slot="text" class="observer">
        <IntersectionObserver :step="0"  align="right">
          <p>In climate stabilization scenarios, the power sector is expected to go through a
            major transition from fossil fuel electricity production to low carbon electricity. </p>
        </IntersectionObserver>
        <IntersectionObserver :step="1"  align="right">
          <p>In the scenarios, this transition is driven by a carbon tax that increases the relative costs
            of fossil fuels compared to renewables and other low-carbon technologies
          </p>
        </IntersectionObserver>
        <IntersectionObserver :step="2"  align="right">
          <p>As a result, revenue within the power sector shifts from fossil utilities to low-carbon
            based utilities.
          </p>
        </IntersectionObserver>
        <IntersectionObserver :step="3"  align="right" class="changeheight">
          <p>
          </p>
        </IntersectionObserver>
      </div>
      </LayoutScrollytelling>
      <div class="text-wrapper">
        <p>Let’s have a look at the volume in electricity production of different energy carrier:</p>
      </div>
      <LayoutScrollytelling>
        <template v-slot:vis="{ width, height, step }">
          <div class="vis-inner" :style="{width: `${width}px`, height: `${height}px`}">
            <SecondaryEnergy :width="width" :height="height" :step="step"/>
          </div>
        </template>
        <div slot="text" class="observer">
        <IntersectionObserver :step="0"  align="right" class="changeheight">
          <p>Under mitigation scenarios coal is quickly phased out. However, natural gas can play a
            substantial role in power production until mid-century. Rapid growth is expected in low-carbon
            technologies like solar, wind and nuclear under the 2.0ºC and 1.5ºC scenarios.
          </p>
        </IntersectionObserver>
      </div>
      </LayoutScrollytelling>
      <div class="text-wrapper">
        <h2 class="chapter-title" id="structure">
          Changing risk Structure
        </h2>
        <p class="cost-risk-paragraph">Low-carbon energy technologies, such as solar and wind, but also nuclear, require higher
          upfront capital investments than fossil power plants. However, most low-carbon technologies do
          barely need any fuel to operate. This means that the operational costs of low-carbon technologies
          are lower and over the lifetime of the power plant low carbon electricity can be produced for
          less costs per MWh than fossil-based electricity. As a result of this difference in cost structure
          between fossil and low-carbon technologies, the cost structure of the power sector will change
          during the transition. The sector will require more capital investment (CAPEX) and becomes less
          exposed to changes in fuel prices as operational expenditures (OPEX).
          The risk structure of the overall power sector changes in line with this development, from capital
          and fuel-based towards almost purely capital based.
        </p>
      </div>
      <LayoutScrollytelling>
        <template v-slot:vis="{ width, height, step }">
          <div class="vis-inner" :style="{width: `${width}px`, height: `${height}px`}">
            <SecondaryEnergySum :width="width" :height="height" :step="step"/>
          </div>
        </template>
        <div slot="text" class="observer">
        <IntersectionObserver :step="0"  align="right">
          <p>The transition changes electricity production from fossil to low-carbon technologies,
            which have different cost structures.
        </p>
        </IntersectionObserver>
        <IntersectionObserver :step="1"  align="right">
          <p>Capital expenditure (CAPEX) currently accounts for about 1/3rd of total fossil electricity costs,
            but this shrinks over time as the increase of fuel costs and emission costs raises operational
            expenditures (OPEX)
            Low-carbon options have a much higher share of capital expenditure, accounting for more than 90%
            of the cost structure.
          </p>
        </IntersectionObserver>
        <IntersectionObserver :step="2"  align="right" class="changeheight">
          <p>As a result of the transition, the cost structure of the total power sector evolves from the current
            balance between  capital/operational expenditures towards a capital-dominated structure. </p>
        </IntersectionObserver>
      </div>
      </LayoutScrollytelling>
      <div class="text-wrapper">
        <h2 class="chapter-title" id="costs">
          Fuel Cost Risk
        </h2>
        <p class="cost-risk-paragraph">
          One of the risks that we observe in the power sector is the fuel cost risk. With the introduction of
          a carbon tax, fuel costs will consequently rise and drive a transition in the power sector from
          fossil fuel based generation to low-carbon. Therefore investors face the risk that fossil-based assets,
          such as coal or gas-fired power plants lose their value under climate policy. This shift is reflected in the fuel costs changes depicted in the figure below.
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
          <p>Without climate policy, total fuel costs for electricity production increase as gas becomes
            more dominant in the power sector.
          </p>
        </IntersectionObserver>
        <IntersectionObserver :step="1"  align="right">
          <p>Despite increasing costs per unit of electricity production from fossil sources, the total
            fuel costs decrease because energy production from fossil fuels is declining.
            Later in the century, fossil fuels are almost phased out and the increase in fuel prices and
            carbon taxes is leading to an increase in total fuel costs.
          </p>
        </IntersectionObserver>
        <IntersectionObserver :step="2"  align="right">
          <p>Relative to the current policy scenario, fuel costs are reduced strongly under mitigation,
            saving the total global sector up to 800 million USD per year by mid-century. </p>
        </IntersectionObserver>
        <IntersectionObserver :step="4"  align="right" class="changeheight">
          <p></p>
        </IntersectionObserver>
      </div>
      </LayoutScrollytelling>
      <div class="text-wrapper">
        <h2 class="chapter-title" id="structure">
          Investment need
        </h2>
        <p class="cost-risk-paragraph">As seen above, if a carbon price is introduced, generating low-carbon energy will become
          more attractive which will lead to a shift in the power sector towards renewables.
          However this low-carbon transition requires a growth in investments in the power sector,
          because both renewables and nuclear are more capital intensive than traditional fossil fuel
          power production. Therefore, the transition comes with a large investment need in low-carbon
        electricity production.</p>
      </div>
      <div class="vis-wrapper">
        <InvestmentNeed :width="width" :height="height"/>
      </div>
      <div class="text-wrapper" id="last-text">
        <h2 class="chapter-title" id="conclusion">
          Assessing risks with the help of climate scenarios
        </h2>
        <p class="cost-risk-paragraph">In this module we have seen that the transition in the electricity production sector leads to a
          changing cost structure that is strongly dominated by capital expenditures. However, while fossil fuels
          are around, their prices and taxation still pose a fuel cost risk and emission cost risk. Finally,
          to facilitate the transition towards low-carbon technologies, investment needs provide an opportunity
          for the financial sector.
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

  .content {
    max-width: 900px;
    margin: 0 auto;

    .text-wrapper {
      margin-top: $spacing*2;
      margin-bottom: $spacing;

      .module-title {
        font-size: 40px;
        margin-bottom: $spacing / 2;
        padding-top: $spacing;
      }

      .cost-risk-paragraph {
        margin-bottom: $spacing * 2;
        column-count: 2;
      }

      .chapter-title {
        margin-bottom: $spacing;
        border-top: 1px solid $color-gray;
        padding-top: $spacing * 2;
      }

      &#last-text {
        margin-bottom: 100px;
      }

      #conclusion {
        border-top: 1px solid $color-gray;
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
      height: 100vh;

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
    }
  }
}
</style>
