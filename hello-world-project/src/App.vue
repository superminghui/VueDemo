<template>
  <div id="app">
    <!-- 使用HelloWorld组件 -->
    <HelloWorld />
  </div>
</template>

<script>
// 从components目录导入HelloWorld组件
import HelloWorld from './HelloWorld.vue'

export default {
  name: 'App',
  components: {
    // 注册HelloWorld组件，使其可以在模板中使用
    HelloWorld
  }
}
</script>

<style>
/* 这里是App.vue的样式，根据需要进行修改 */
</style>

