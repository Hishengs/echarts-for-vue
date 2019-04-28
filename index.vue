<template>
  <div class="vue-for-echarts" :id="id" :style="{width, height, margin: '0 auto'}" @click.prevent.stop='handleClick' ref="chart">
    <!-- echarts 图表渲染在这里 -->
  </div>
</template>

<script>
  import echarts from 'echarts/lib/echarts';
  import 'echarts/lib/component/tooltip';
  import 'echarts/lib/component/legend';
  import erd from 'element-resize-detector';

  export default {
    name: 'vue-for-echarts',
    props: {
      // 图表容器宽度
      width: {
        type: String,
        required: true,
      },
      // 图表容器高度
      height: {
        type: String,
        required: true,
      },
      // 图表容器 ID
      id: {
        type: String,
        default: () => {
          return `vue-for-echarts-${new Date().getTime()}-${Math.random().toString().split('.')[1]}`;
        },
      },
      // echarts 图表具体配置项和数据
      options: {
        type: Object,
        required: true,
      },
      // 是否在组件挂载时立即渲染
      renderOnMounted: {
        type: Boolean,
        default: true,
      },
      // 是否自动 resize
      autoResize: {
        type: Boolean,
        default: true,
      },
    },
    data () {
      return {
        // 注意，不要在 data 直接定义实例属性
        // 防止实例属性被响应式追踪，导致产生的性能问题
        // ins: null,
        // erdIns: null,
        lock: false,
        // 防抖
        debouncedTimeoutIns: null,
      };
    },
    created () {
      // 用于检测父元素尺寸变化
      this.erdIns = erd();
    },
    mounted () {
      this.init();
    },
    beforeDestroy () {
      if (this.debouncedTimeoutIns) {
        clearTimeout(this.debouncedTimeoutIns);
        this.debouncedTimeoutIns = null;
      }
      try {
        if (this.autoResize && this.$refs.chart) {
          this.erdIns.uninstall(this.$refs.chart);
        }
        this.erdIns = null;
      } catch (err) {
        console.warn('vue-for-echarts erd uninstall failed ', err.message, err.stack);
      }
      if (this.ins) {
        // 销毁实例
        this.ins.off('legendselectchanged');
        this.ins.dispose();
        this.ins = null;
      }
    },
    methods: {
      init () {
        if (!this.$refs.chart) return;

        this.initEcharts();

        if (this.renderOnMounted) {
          this.render();
        }

        if (this.autoResize) {
          this.erdIns.listenTo(this.$refs.chart, this.onresize);
        }
      },
      initEcharts () {
        if (this.ins) return;
        this.ins = echarts.init(this.$refs.chart);
        // In order to solve bug 1011 1025
        this.ins.on('legendselectchanged', () => {
          this.lock = true;
        });
      },
      // 监听 window resize 事件
      onresize (e) {
        clearTimeout(this.debouncedTimeoutIns);
        this.debouncedTimeoutIns = setTimeout(() => {
          console.log('>>> ==== vue-for-echarts resize');
          this.resize();
        }, 100);
      },
      render (options) {
        if (!this.ins) {
          this.initEcharts();
        }
        // notMerge 改为 true
        this.ins.setOption(options || this.options, true);
      },
      update () {
        this.render();
        this.resize();
      },
      resize () {
        if (!this.ins) return;
        this.ins.resize();
      },
      // 处理点击事件
      handleClick () {
        if (!this.lock) {
          this.$emit('on-click');
        }
        else {
          this.lock = false;
        }
      }
    },
  };
</script>
