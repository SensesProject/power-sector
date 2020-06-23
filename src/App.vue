<template>
  <div id="app">
    <SensesMenu :id="'power-sector'"/>
    <div class="content" :class="mobile ? 'isMobile' : 'isDesktop'" ref="container">
      <div class="text-wrapper">
        <h1 class="module-title">Power Sector</h1>
        <p>This is the first chapter of the Finance Risks Pathway.
          You can select another chapter below.</p>
      </div>
      <RiskPathway :mobile="mobile"/>
      <div class="text-wrapper">
        <h2 class="chapter-title" id="introduction">
          What risks will be discussed?
        </h2>
        <p>The Paris agreement aims to limit global warming to 2°C and pursue
          efforts to limit to 1.5°C. An essential step for this is to decarbonize
          electricity production. As can be easily seen below, when comparing energy
          production from fossil fuels with renewables, energy is currently
          still mainly being produced from fossil fuels. However if a carbon tax is
          introduced, fuel costs will rise and at some point it will become
          unprofitable to generate electricity from fossil fuels resulting in a
          shift towards renewable energies.
          <br>
          <br>
          In this module we show the risks and opportunities that
          result from the decarbonization of the power sector and explain why investors
          should consider climate policy in their decisions.
        </p>
      </div>
      <div >
        <SecondaryEnergywlinechart :width="width" :height="height" :mobile="mobile"/>
      </div>
      <div class="text-wrapper">
        <p>Let’s have a look at the volume in energy production of different energy carrier:</p>
      </div>
      <div class="vis-wrapper secondaryenergy">
        <SecondaryEnergy :width="width" :height="height" :mobile="mobile"/>
      </div>

      <div class="text-wrapper">
        <h2 class="chapter-title" id="costs">
          Fuel Cost Risk
        </h2>
        <p>One risk we observe in the power sector is the Fuel cost risk. With the
          introduction of the tax, fuel costs will consequently rise and a conversion
          of the power sector from fossil fuel based generation to renewables will take
          place. This shift is also reflected in the fuel costs changes: despite
          increasing costs in the energy production from fossils, the total fuel
          costs decrease at some point because the energy production from fossil
          fuels goes down.
          <br>
          <br>
          Therefor investors face the risk that fossil-based assets, such as coal
          or gas-fired power plants reduce their value under climate policy. </p>
      </div>
      <div class="vis-wrapper">
        <FossilCosts :width="width" :height="height"/>
      </div>
      <div class="text-wrapper">
        <h2 class="chapter-title" id="structure">
          Investment need
        </h2>
        <p>If a Tax is introduced, generating low-carbon energy will become more
          profitable which will lead to a shift in the Power Sector towards
          renewables.
          However this low-carbon transition is expensive for the power sector,
          as both renewables and nuclear are more capital intensive than traditional
          fossil fuel power production.</p>
        <p>Therefore, the transition will cause a large investment need in low-carbon
          electricity production. For investors this opens investment opportunities.</p>
      </div>
      <div class="vis-wrapper">
        <InvestmentNeed :width="width" :height="height"/>
      </div>
      <div class="text-wrapper">
        <h2 class="chapter-title" id="structure">
          Changing Cost Structure risk
        </h2>
        <p>As seen above low-carbon energy technologies, such as solar and wind,
        but also nuclear, require higher capital investments than fossil power
        plants. However, they do not (or barely) need any fuel to operate making
        these technologies less vulnerable to changes in fuel prices.</p>
        <p>Therefore when determining the risk profile in the overall power sector,
        investors need to be aware that the risk structure of the power sector
        will change from capital and fuel-based towards almost purely capital
        based.</p>
      </div>
      <div class="vis-wrapper CostStructure">
        <CostStructure :width="width" :height="height" :mobile="mobile"/>
      </div>
      <div class="vis-wrapper CostStructureAgg">
        <CostStructureAgg :width="width" :height="height" :mobile="mobile"/>
      </div>
      <div class="text-wrapper" id="last-text">
        <h2 class="chapter-title" id="conclusion">
          Assessing risks with the help of climate scenarios
        </h2>
        <p>We have seen that some final sententences here Lorem ipsum dolor sit amet
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
          ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
          voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
          mollit anim id est laborum.
          </p>
      </div>
      <SensesMeta :id="'power-sector'"/>
    </div>
  </div>
</template>

<script>
import SensesMenu from 'library/src/components/SensesMenu.vue'
import RiskPathway from './components/RiskPathway.vue'
// import SecondaryEnergySum from './components/SecondaryEnergySum.vue'
import SecondaryEnergywlinechart from './components/SecondaryEnergywlinechart.vue'
import SecondaryEnergy from './components/SecondaryEnergy.vue'
import InvestmentNeed from './components/InvestmentNeed.vue'
import CostStructure from './components/CostStructure.vue'
import CostStructureAgg from './components/CostStructureAgg.vue'
import FossilCosts from './components/FossilCosts.vue'
import SensesMeta from 'library/src/components/SensesMeta.vue'

export default {
  name: 'App',
  components: {
    SensesMenu,
    RiskPathway,
    // SecondaryEnergySum,
    SecondaryEnergy,
    InvestmentNeed,
    CostStructure,
    CostStructureAgg,
    FossilCosts,
    SecondaryEnergywlinechart,
    SensesMeta
  },
  data () {
    return {
      width: 0,
      height: 0
    }
  },
  computed: {
    mobile () {
      let isMobile = false
      if (this.width < 750) { isMobile = true }
      return isMobile
    }
  },
  methods: {
    calcSizes () {
      const { container: el } = this.$refs
      const totalWidth = el.clientWidth
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

  .content {
    max-width: 900px;
    margin: 0 auto;

    .text-wrapper {
      margin-top: $spacing;

      .module-title {
        font-size: 60px;
        margin-bottom: $spacing / 2;
        padding-top: $spacing;
      }

      .chapter-title {
        margin-bottom: $spacing;
      }

      &#last-text {
        margin-bottom: 100px;
      }

      #conclusion {
        border-top: 1px solid $color-gray;
        padding-top: 30px;
      }
    }

    .vis-wrapper {
      margin-top: $spacing;
      // border: 0.5px solid lightblue;
      height: 100vh;

      &.secondaryenergy  {
        height: 200vh;
      }
      &.coststructure  {
        height: 85vh;
      }
      &.CostStructureAgg  {
        height: 85vh;
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
