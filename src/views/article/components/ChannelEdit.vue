<script setup>
import { ref } from 'vue'
//导入编辑和添加的服务
import { artEditChannelService, artAddChannelService } from '@/api/article'

//弹窗
const dialogVisible = ref(false)
//表单提供一个ref
const fromRef = ref()
//声明form绑定的数据
//这里的数据是从接口中查看的
const formModel = ref({
  cate_name: '',
  cate_alias: '',
})
//表单校验规则
const rules = {
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { pattern: /^\S{1,10}$/, message: '分类名必须是1-10位的非空字符', trigger: 'blur' },
  ],
  cate_alias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '分类名必须是1-15位的字母或数字', trigger: 'blur' },
  ],
}
//设置一个触发事件
const emit = defineEmits(['success'])
const onSubmit = async () => {
  //校验表单
  await fromRef.value.validate()
  //看是添加还是编辑
  const isEdit = formModel.value.id ? true : false
  if (isEdit) {
    await artEditChannelService(formModel.value)
    ElMessage.success('编辑成功')
  } else {
    await artAddChannelService(formModel.value)
    ElMessage.success('添加成功')
  }
  //关闭弹层
  dialogVisible.value = false
  emit('success') //触发父组件的success事件
}

//组件对外暴露一个方法 open 基于open传来的参数，区分添加还是编辑
//open({})=>表单无需渲染，说明添加
//open({id:1,name:'xxx',…………})=>表单渲染，说明编辑
//open调用后会打开弹层
const open = (row) => {
  // console.log(row)
  //打开弹层
  dialogVisible.value = true
  //将传过来的row数据绑定到表单上，这里使用了展开运算符，将row的所有属性都赋值给formModel
  formModel.value = { ...row } //添加=》重置表单内容，编辑=》存储了需要回显的数据
}
//向外暴露这个方法
defineExpose({
  open,
})
</script>
<template>
  <!-- 弹层部分 -->
  <el-dialog v-model="dialogVisible" :title="formModel.id ? '编辑分类' : '添加分类'" width="500">
    <!-- <span>我是内容部分(表单渲染)</span> -->
    <!-- 表单主要内容部分 -->
    <el-form
      ref="fromRef"
      :model="formModel"
      :rules="rules"
      label-width="100px"
      style="padding-right: 30px"
    >
      <el-form-item label="分类名称" prop="cate_name">
        <el-input v-model="formModel.cate_name" placeholder="请输入分类名称"></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input v-model="formModel.cate_alias" placeholder="请输入分类别名"></el-input>
      </el-form-item>
    </el-form>
    <!-- 弹层底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style></style>
