<template>
  <div class="risk-card" :class="mobile ? 'mobileCard' : 'desktopCard'">
    <nav class="risk-menu pathway">
      <section>
        <a class="wrapper">
          <div><span class="glyph-oil"/></div>
          <div><h4>Chapter 1</h4><span>Fossil Fuels</span></div>
        </a>
      </section>
      <section>
        <a class="wrapper active" href="https://dev.climatescenarios.org/">
          <div><span class="glyph-power"/></div>
          <div><h4>Chapter 2</h4><span>Power Sector&nbsp;&nearr;</span></div>
        </a>
      </section>
      <section>
        <a class="wrapper" href="https://dev.climatescenarios.org/">
          <div><span class="glyph-building"/></div>
          <div><h4>Chapter 3</h4><span>End Use&nbsp;&nearr;</span></div>
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

  .glyph-power {
    color: #B035C9;
  }

  .glyph-building, .glyph-oil {
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
