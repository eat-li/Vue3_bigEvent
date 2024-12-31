<script setup>
import zh from 'element-plus/es/locale/lang/zh-cn.mjs'
</script>

<template>
  <!-- 国际化处理 -->
  <!-- 配置成中文 -->
  <el-config-provider :locale="zh">
    <router-view />
  </el-config-provider>
</template>
