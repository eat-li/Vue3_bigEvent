import { defineStore } from 'pinia'
import { ref } from 'vue'

// 计数器模块
export const useCountStore = defineStore('counts', () => {
  const count = ref('100') // 定义 token
  const add = (t) => (count.value += t) // 设置 token
  return { count, add }
})
