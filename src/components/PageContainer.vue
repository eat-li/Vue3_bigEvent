<script setup>
defineProps({
  title: {
    required: true,
    type: String,
  },
})
</script>

<template>
  <el-card class="page-container">
    <!-- 具名插槽定义按钮 -->
    <template #header>
      <!-- 头部 -->
      <div class="header">
        <span>{{ title }}</span>
        <div class="extra">
          <!-- 额外的按钮 -->
          <slot name="extra"></slot>
        </div>
      </div>
    </template>
    <!-- 页面内容,默认插槽 -->
    <slot></slot>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
