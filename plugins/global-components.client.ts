import Vue from 'vue'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue/src/main'
import VCalendar from 'v-calendar'
import { initLazyMutationObserver } from '~/helpers/intersectionObserverHelpers'
import VueApexCharts from 'vue-apexcharts'

Vue.component('SweetModal', SweetModal)
Vue.component('SweetModalTab', SweetModalTab)

Vue.use(VCalendar, {
  masks: {
    // title: 'MMMM YYYY',
    // weekdays: 'W',
    // navMonths: 'MMM',
    input: ['L', 'DD.MM.YYYY', 'YYYY-MM-DD', 'YYYY/MM/DD'],
    // dayPopover: 'WWW, MMM D, YYYY',
    data: ['L', 'DD.MM.YYYY', 'YYYY-MM-DD', 'YYYY/MM/DD'],
  },
})

// apexchart
Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

// Run after the HTML document has finished loading
document.addEventListener('DOMContentLoaded', function () {
  initLazyMutationObserver()
})
