<template>
  <div class="risk-card" :class="mobile ? 'mobileCard' : 'desktopCard'">
    <div class="other-chapters">
      <p>This is the second chapter of the Risk Factors Pathway. Available chapters:
      </p>
    </div>
    <nav class="risk-menu pathway">
      <section>
        <a class="wrapper">
          <div><span class="glyph-oil" href="https://climatescenarios.org/fossil-fuels/"/></div>
          <div><h4>Chapter 1</h4><span>Fossil Fuels&nbsp;&nearr;</span></div>
        </a>
      </section>
      <section>
        <a class="wrapper active">
          <div><span class="glyph-power"/></div>
          <div><h4>Chapter 2</h4><span>Power Sector</span></div>
        </a>
      </section>
      <section>
        <a class="wrapper not-available" href="#">
          <div><span class="glyph-building"/></div>
          <div><h4>Chapter 3</h4><span>End Use</span></div>
        </a>
      </section>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'RiskPathway',
  props: {
    mobile: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "library/src/style/variables.scss";

.risk-card {
  border: 1px solid #d8d8e4;
  padding: $spacing;
  border-radius: 4px;
  margin-top: $spacing;

  .other-chapters {
    text-align: center;
    font-size: 11px;
    // text-transform: uppercase;
  }
}

.pathway {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  max-width: 1100px;
  flex-direction: column;

  a {
    text-decoration: none;
    background: none;
    color: #000;
  }

  .active {
    color: #B035C9;
  }

  .not-available {
    cursor: not-allowed;

    div {
      color: gray;
      opacity: 0.8;
    }
  }

  .risk-menu {
    display: flex;
  }

  .intro {
    display: flex;
    grid-template-columns: repeat(1, 1fr);
  }

  .wrapper {
    padding: $spacing / 2 $spacing / 1.5 $spacing / 2 0;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .glyph-building, .glyph-oil, .glyph-power {
    font-size: 5rem;
  }

  .glyph-power, .glyph-oil {
    color: #B035C9;
  }

  .glyph-building {
    color: #d8d8e4;
  }
}

.mobileCard {
  margin: 20px;
  .pathway {
    grid-template-columns: repeat(1, 1fr);

    .wrapper {
      padding: $spacing;
    }

    section {
      height: 50%;
      display: grid;
    }
  }
}

</style>
