<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
//导入注册接口,导入登录接口
import { userRegisterService, userLoginService } from '@/api/user'
//导入仓库
import { useUserStore } from '@/stores'
//导入路由（登录成功跳转首页
import { useRouter } from 'vue-router'
const isRegister = ref(false)
// 整个的用于提交的form数据对象，接口文档中查找的（注册）
const form = ref()
const formModel = ref({
  username: '',
  password: '',
  repassword: '',
})
// 整个表单的校验规则，通过rules来提供,rules不需要响应式，所以写成普通对象就好
// 官方文档中擦好看rules的配置
// 和上面的formModel的名字要统一

// 1. 非空校验 required:true message:消息提示，trigger触发校验时机: blur change （失焦、改变触发)
// 2. 长度校验 min:xxx,max:xxx
// 3. 正则校验 pattern:正则规则 \S 非空字符
// 4. 自定义校验 => 自己写逻辑校验(校验函数)
//  validaor:(rule,value,callback)
//  (1)rule 当前的校验规则相关的信息
//  (2)value 所校验的表单元素，目前的表单值
//  (3)callback =>(无论成功还是失败都需要callback回调)
//      callback() 校验成功，
//      callback(new Error(错误信息)) 校验失败
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 10, message: '用户名必须是5-10位的字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { pattern: /^\S{6,15}$/, message: '密码必须是6-15位的非空字符', trigger: 'blur' },
  ],
  repassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { pattern: /^\S{6,15}$/, message: '密码必须是6-15位的非空字符', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        //判断value 和当前form中收集的password是否一致
        if (value !== formModel.value.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback() //校验成功需要正常回调，callback
        }
      },
      trigger: 'blur',
    },
  ],
}
//validate对整个表单的内容进行验证。 接收一个回调函数，或返回 Promise。
const register = async () => {
  //注册成功之前先进行校验 校验成功->请求 校验失败->自动提示
  await form.value.validate()
  // console.log('开始注册请求')
  await userRegisterService(formModel.value)
  ElMessage.success('注册成功')
  //切换到登录
  isRegister.value = false
}
//导入store中的user仓库
//设置我们的token
const userStore = useUserStore()
const router = useRouter()
//登录之前进行一个预校验
const login = async () => {
  await form.value.validate()
  const res = await userLoginService(formModel.value)
  userStore.setToken(res.data.token)
  // console.log('开始登录', res)
  ElMessage.success('登录成功')
  //跳转到首页
  router.push('/')
}

//切换的时候需要重置表单的内容
watch(isRegister, () => {
  formModel.value = {
    username: '',
    password: '',
    repassword: '',
  }
})
</script>

<template>
  <!-- el-row表示的是一行，分成24分 
    1 结构相关
      左右el-col表示的是列各占12分 
      :span="12"表示代表在一行中占12分
      :span="6" 表示在一行中占6分
      :offset="3"表示在一行中 ，左侧的margin的分数
      el-form :整个表单组件
      el-form-item:表单的一行（一个表单域）
      el-input 表单元素（输入框）
   -->
  <!-- 2校验相关
      (1) el-form=> :model = 'ruleForm'绑定的整个form数据对象{xxx,xxx,xxx}
      (2) el-form-> :rules="rules" 绑定的整个rules校验规则对象 {xxx,xxx,xxx}
      (3) 表单元素=> v-model="ruleForm.xxx" 给表单元素，绑定form的子属性
      (4) el-form-item => prop配置生效的是哪个校验规则
      -->
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- 注册相关表单 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="formModel.repassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入再次密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="register" class="button" type="primary" auto-insert-space>
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false"> ← 返回 </el-link>
        </el-form-item>
      </el-form>
      <!-- 登录相关 -->
      <el-form :model="formModel" :rules="rules" ref="form" size="large" autocomplete="off" v-else>
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="login" class="button" type="primary" auto-insert-space>登录</el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true"> 注册 → </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background:
      url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
