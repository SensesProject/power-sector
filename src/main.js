import Vue from 'vue'
import App from './App.vue'
import VTooltip from 'v-tooltip'
import store from './store'

Vue.config.productionTip = false
Vue.use(VTooltip)
VTooltip.options.defaultClass = 'senses'

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
