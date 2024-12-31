## 路由

创建路由实例
1 .createWebHashHistoryhash模式 带#
2 .createWebHistoryhistory模式 不带 #

```js
就是vite.config.js中的配置项
history: createWebHistory(import.meta.env.BASE_URL),
base: '/',
能够配置一些基地址
```

## 引入element plus组件库

官网
https://element-plus.org/zh-CN/guide/quickstart.html

```npm
npm install element-plus
按需引入
pnpm add -D unplugin-vue-components unplugin-auto-import
```

vite-config.js配置

```js
// vite.config.ts
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  // ...
  plugins: [
    // ...
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
})
```

此时可以在任何地方引入elementplus组件库

```html
<div>我是App</div>
<el-button @click="$router.push('/home')">首页</el-button>
<el-button @click="goList">列表页</el-button>
```

创建一个组件也不用导入APP.vue了，可以直接在APP中使用

```html
<template>
  <div>我是App</div>
  <TestDemo></TestDemo>
</template>
```

## pinia配置

用户模块的store
store/user.js

```js
import { defineStore } from 'pinia'

//用户模块
// token setToken removeToken

//唯一标识big-user
export const useUserStore = defineStore('big-user', () => {
  const token = ref('')
  //设置token和移除token方法
  const setToken = (newToken) => {
    token.value = newToken
  }
  const removeToken = () => {
    token.value = ''
  }
  //暴露token
  return {
    token,
    setToken,
    removeToken,
  }
})
```

此时的token并没有持久化，我们需要让他进行持久化
装包

```npm
pnpm add pinia-plugin-persistedstate -D
```

插件安装和使用
main.js

```
import persist from 'pinia-plugin-persistedstate'
app.use(createPinia().use(persist))

```

```js
  {
    persist: true, // 持久化
  },
```

将pinia相关配置写在store下的index中
store/index.js

```js
//这里是有关pinia的的配置
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(persist)
export default pinia
```

最后将storeindex下的pinia的配置导出到main.js中
main.js

```js
import pinia from './stores'
App.use(pinia)
```

## axios请求配置

接口文档
https://apifox.com/apidoc/shared-26c67aee-0233-4d23-aab7-08448fdf95ff/api-93850049

```js
import axios from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import { router } from '@/router'
const baseURL = 'http://big-event-vue-api-t.itheima.net'

const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 10000,
})

//请求拦截器
instance.interceptors.request.use(
  (config) => {
    // TODO 2. 携带token
    const useStore = useUserStore()
    if (useStore.token) {
      config.headers.Authorization = useStore.token
    }
    return config
  },

  (err) => Promise.reject(err),
)
//响应拦截器
instance.interceptors.response.use(
  (res) => {
    // TODO 3. 处理业务失败
    // TODO 4. 摘取核心响应数据
    // res.data数据
    if (res.data.code === 0) {
      return res
    }
    //处理业务失败,给出错误提示，抛出错误
    ElMessage.error(res.data.message || '服务异常')
    return Promise.reject(res.data)
  },
  (err) => {
    // TODO 5. 处理401错误
    //错误的特殊情况401权限不足或者token过期，则拦截登录
    if (err.response?.status === 401) {
      router.push('./login')
    }
    //错误的默认情况,给提示就好
    ElMessage.error(err.response.data.message || '服务异常')
    return Promise.reject(err)
  },
)

export default instance
export { baseURL }
```

## 路由基本设置

- 登录 一级路由
- 架子 一级路由
  - 文章分类 二级路由
  - 文章管理 二级路由
  - 基本资料 二级路由
  - 更换头像 二级路由
  - 重置密码 二级路由

## 登录注册页面element-plus表单

1. 注册登录 静态结构偶&基本切换
2. 注册功能（校验——注册）
3. 登录功能（校验+登录+存token）

安装element-plus图标库

```npm1
pnpm i @element-plus/icons-vue
```

图标地址：`https://element-plus.org/zh-CN/component/icon.html`

### 注册登录表单校验

整个表单的校验规则，通过rules来提供,rules不需要响应式，所以写成普通对象就好
官方文档中擦好看rules的配置
和上面的formModel的名字要统一

1. 非空校验 required:true message:消息提示，trigger触发校验时机: blur change （失焦、改变触发)
2. 长度校验 min:xxx,max:xxx
3. 正则校验 pattern:正则规则 \S 非空字符
4. 自定义校验 => 自己写逻辑校验(校验函数)
   validaor:(rule,value,callback)
   (1)rule 当前的校验规则相关的信息
   (2)value 所校验的表单元素，目前的表单值
   (3)callback =>(无论成功还是失败都需要callback回调)
   callback() 校验成功，
   callback(new Error(错误信息)) 校验失败

### 表单预校验-封装api实现注册功能

validate对整个表单的内容进行验证。 接收一个回调函数，或返回 Promise。
新建`api/user.js`

## 首页layout架子

基本静态结构搭建
静态接口和组件库分析

### 登录访问拦截

需要有token才能进入
在路由index里添加登录访问拦截
路由守卫

### 首页用户基本信息的获取和渲染和退出

用户的基本信息
存在pinia中
封装用户信息接口

## 首页文章分类页面

- 基本架子
- 文章分类
- 文章添加编辑
- 文章分类删除

### 文章分类渲染

archive接口获取文章分类列表

### 添加分类显示弹层

element-plus的弹层组件
https://element-plus.org/zh-CN/component/dialog.html#dialog-%E5%AF%B9%E8%AF%9D%E6%A1%86

### 文章分类添加

- 表单校验
- 接口请求
- 刷新分类列表

### 分类删除功能

https://apifox.com/apidoc/shared-26c67aee-0233-4d23-aab7-08448fdf95ff/api-93850049

## 文章管理模块

- 列表渲染
- 添加文章
- 编辑文章（共用抽屉）
- 删除文章

### 静态列表编写

### 中英文语言切换

https://element-plus.org/zh-CN/component/config-provider.html
