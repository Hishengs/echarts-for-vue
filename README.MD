## vue-for-echarts
一个用于简化在 Vue 中使用 echarts 的库。

### 安装
```js
npm install -D vue-for-echarts --registry http://10.86.168.3:4873
```

> 该库仅发布在内网私有 NPM，内部使用。

### 使用
```html
<template>
  <!-- 业绩走势图 -->
  <vue-for-echarts
    width='100%'
    height="400px"
    :options="options"
    ref="accountPerformanceLine"
  ></vue-for-echarts>
</template>

<script>
  import 'echarts/lib/chart/line';

  export default {
    ...,
    data () {
      return {
        options: {
          ...
        },
      };
    },
    mounted () {
      this.$refs.accountPerformanceLine.render();
    },
  };
</script>
```

### 配置
#### props
```js
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
// 图表容器 ID（可选）
id: {
  type: String,
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
```

#### methods
**render (options)**

渲染函数，相当于重新 `setOption`

`options` 可选用于覆盖原有 options 的 echarts 配置项。

### 版本更新

- 0.0.4

  Fix: 修复 `echarts` 实例和 `element-resize-detector` 实例被 Vue 响应式追踪导致的页面性能问题。