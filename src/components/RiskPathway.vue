<template>
  <div class="risk-card" :class="mobile ? 'mobileCard' : 'desktopCard'">
    <div class="other-chapters">
    </div>
    <nav class="risk-menu pathway">
      <section>
        <a class="wrapper" id="fossil" href="https://climatescenarios.org/fossil-fuels/" target="_blank">
          <div><span class="glyph-oil"/></div>
          <div><p>Chapter 1</p><span>Fossil Fuels&nbsp;&nearr;</span></div>
        </a>
      </section>
      <section>
        <div class="wrapper active">
          <div><span class="glyph-power"/></div>
          <div><p>Chapter 2</p><span>Power Sector</span></div>
        </div>
      </section>
      <section>
        <a class="wrapper not-available" href="#">
          <div><span class="glyph-building"/></div>
          <div><p>Chapter 3</p><span>End Use</span></div>
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
  // border: 1px solid #d8d8e4;
  padding: $spacing/1.5;
  border-radius: 4px;
  //margin-top: $spacing*0.3;
  background-color: rgba(221,214,255,.3);

  #header{
    color: getColor(neon, 40);
    margin-bottom: $spacing*0.5;
  opacity: 0.9;
    font-size: 0.8em;
  }

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
    color: #B035C9;
    }

  .active {
    color: getColor(neon, 40);
    opacity: 0.8;
  }

  .not-available {
    cursor: not-allowed;

    div {
      color: gray;
      opacity: 0.7;
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
    padding: 0 $spacing / 1.5 $spacing / 2 0;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .glyph-building, .glyph-oil, .glyph-power {
    font-size: 5rem;
  }

  .glyph-power {
    color: getColor(neon, 40);
    opacity: 0.9;
  }
  .glyph-oil {
    color: #B035C9;
  }
  .glyph-building {
    color: #75757b;
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
