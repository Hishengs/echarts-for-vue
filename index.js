import VueEcharts from './index.vue';

export default {
  install: Vue => {
    Vue.component('vue-for-echarts', VueEcharts);
  },
};