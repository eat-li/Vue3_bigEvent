import { defineStore } from 'pinia'
import { ref } from 'vue'
import { UserGetInfoService } from '@/api/user'

// 用户模块
export const useUserStore = defineStore(
  'big-user',
  () => {
    const token = ref('') // 定义 token
    const setToken = (t) => (token.value = t) // 设置 token
    const removeToken = () => (token.value = '')

    //提供user对象和getUser方法
    const user = ref({}) // 定义用户信息是一个空对象
    const getUser = async () => {
      const res = await UserGetInfoService() //请求获取数据
      // console.log(res.data)
      user.value = res.data.data //
    }
    // 设置用户信息
    const setUser = (obj) => {
      user.value = obj // 设置用户信息
    }
    return {
      token,
      setToken,
      removeToken,
      user,
      getUser,
      setUser,
    }
  },
  {
    persist: true, // 持久化
  },
)
