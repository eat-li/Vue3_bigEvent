<script setup>
import { ref } from 'vue'
import ChannelSelect from '@/views/article/components/ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
//富文本编辑器相关
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
//导入接口
import { artPublishArticleService, artGetDetailService, artEditArticleService } from '@/api/article'
//导入及地址
import { baseURL } from '@/utils/request'
//导入axios
import axios from 'axios'
//控制抽题显示隐藏
const visibleDrawer = ref(false)

//默认数据
const defaultForm = {
  title: '', //标题
  cate_id: '', //分类id
  cover_img: '', //封面图片 file对象
  content: '', //string内容
  state: '', //状态
}
//图片上传相关逻辑
// 图片上传相关逻辑
const imgUrl = ref('')
const onSelectFile = (uploadFile) => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw) // 预览图片
  // 立刻将图片对象，存入 formModel.value.cover_img 将来用于提交
  formModel.value.cover_img = uploadFile.raw
}
//提供数据
const formModel = ref({
  ...defaultForm,
})

const emit = defineEmits(['success'])
//提交
const onPublish = async (state) => {
  //将已发布还是草稿状态都存入formModel
  formModel.value.state = state
  //注意当前接口需要的是formData对象
  //将普通对象转化为formData对象
  const formData = new FormData()
  for (let key in formModel.value) {
    //将formModel的key-value对添加到formData中
    formData.append(key, formModel.value[key])
  }
  //发送请求
  if (formModel.value.id) {
    //编辑
    // console.log('编辑')
    await artEditArticleService(formData)
    ElMessage.success('修改成功')
    visibleDrawer.value = false
    //通知父组件渲染当前页
    emit('success', 'edit')
  } else {
    //添加
    await artPublishArticleService(formData)
    ElMessage.success('添加成功')
    //关闭抽屉
    visibleDrawer.value = false
    //添加成功通知父组件
    emit('success', 'add')
  }
}
//组件对外暴露一个方法 open 基于open传来的参数，区分添加还是编辑
//open({})=>表单无需渲染，说明添加
//open({id:1,name:'xxx',…………})=>表单渲染，说明编辑
//open调用后会打开抽屉
const editRef = ref()
const open = async (row) => {
  //显示抽屉
  visibleDrawer.value = true
  //
  if (row.id) {
    //需要基于row.id发送请求，获取编辑对应的详情数据，进行回显
    // console.log('编辑回显')
    const res = await artGetDetailService(row.id)
    // console.log(res)
    formModel.value = res.data.data
    //图片需要单独处理回显
    imgUrl.value = baseURL + formModel.value.cover_img
    //注意：提交给后台，需要的格式是file对象格式
    //需要将我们的网络图片地址=》转换成file对象，存储起来，将来便于提交
    const file = await imageUrlToFile(imgUrl.value, formModel.value.cover_img)
    formModel.value.cover_img = file
  } else {
    //添加之前重置数据
    formModel.value = {
      ...defaultForm,
    } //基于默默人数据重置form数据
    //这里重置我们还需要重置图片上传img地址
    //富文本编辑器内容需要手动重置
    imgUrl.value = ''
    editRef.value.setHTML('')
    // console.log('添加')
  }
  // console.log(row)
} // 将网络图片地址转换为File对象
async function imageUrlToFile(url, fileName) {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const imageData = response.data

    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], { type: response.headers['content-type'] })

    // 第三步：创建一个新的File对象
    const file = new File([blob], fileName, { type: blob.type })

    return file
  } catch (error) {
    console.error('将图片转换为File对象时发生错误:', error)
    throw error
  }
}

//
//暴露方法
defineExpose({
  open,
})
</script>

<template>
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.id ? '编辑文章' : '添加文章'"
    direction="rtl"
    size="50%"
  >
    <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <channel-select v-model="formModel.cate_id" width="100%"></channel-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <!-- 此处需要关闭elementplus的自动上传，不需要配置action等参数
         我们此处只需要做前端的本地预览图片即可，无需再提交前上传图标
         语法 URL。createObjectURL(file)创建本地预览的地址来创建 
         auto-upload="false"关闭自动上传-->
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onSelectFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <QuillEditor
            ref="editRef"
            theme="snow"
            v-model:content="formModel.content"
            contentType="html"
          ></QuillEditor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onPublish('已发布')">发布</el-button>
        <el-button type="info" @click="onPublish('草稿')">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
