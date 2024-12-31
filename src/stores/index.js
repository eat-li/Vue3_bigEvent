//这里是有关pinia的的配置
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(persist)
export default pinia

// import { useUserStore } from './modules/user'
// export { useUserStore }
// import { useCountStore } from './modules/count'
// export { useCountStore }
export * from './modules/user'
export * from './modules/count'
