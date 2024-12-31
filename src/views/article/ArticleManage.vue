<script setup>
import { ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
//导入下拉组件
import ChannelSelect from './components/ChannelSelect.vue'
//导入分页组件
import { artGetArticleService, artDeleteArticleService } from '@/api/article'
//导入日期格式化
import { formatTime } from '@/utils/format'
//导入抽屉
import ArticleEdit from './components/ArticleEdit.vue'
// // 假数据
// const articleList = ref([
//   {
//     id: 5961,
//     title: '新的文章啊',
//     pub_date: '2022-07-10 14:53:52.604',
//     state: '已发布',
//     cate_name: '体育',
//   },
//   {
//     id: 5962,
//     title: '新的文章啊',
//     pub_date: '2022-07-10 14:54:30.904',
//     state: '草稿',
//     cate_name: '体育',
//   },
// ])
// 声明数据列表
const articleList = ref([]) //文章列表
//声明总条数
const total = ref(0) //默认为0
//loading状态
const loading = ref(false) //默认为false
//定义请求参数对象
const params = ref({
  pagenum: 1, //当前页数
  pagesize: 5, //当前页生效的条数
  cate_id: '',
  state: '',
})

const getArticleList = async () => {
  //loading状态
  loading.value = true //开始loading
  const res = await artGetArticleService(params.value)
  articleList.value = res.data.data
  total.value = res.data.total
  //请求介乎
  loading.value = false //结束loading
}
//进入页面就基于params参数获取文章列表
getArticleList()
//处理分页逻辑
const onSizeChange = (size) => {
  // console.log('当前每一页条数', size)
  //只要是每一页条数变化了，原本正在访问的当前页的意义就不大了
  // 数据已经不再原来那一页了
  // 从新从第一页渲染即可
  params.value.pagenum = 1
  params.value.pagesize = size
  //从新渲染
  getArticleList()
}
const onCurrentChange = (page) => {
  // console.log('页码变化了', page)
  //更新当前页，基于最新的当前页渲染数据
  params.value.pagenum = page
  getArticleList()
}
//搜索
const onSearch = () => {
  //搜索就是按照最新的条件进行从新检索，，从第一页开始展示
  //重置页码
  params.value.pagenum = 1
  getArticleList()
}
//重置
const onReset = () => {
  //重置就是将筛选条件清空从新检索，从第一页开始展示
  params.value.pagenum = 1
  params.value.cate_id = ''
  params.value.state = ''
  getArticleList()
}

//删除
const onDeleteArticle = async (row) => {
  //如何删除
  // articleEditRef.value.open(row)
  await ElMessageBox.confirm('确认删除该文章吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })
  await artDeleteArticleService(row.id)
  ElMessage.success('删除成功')
  getArticleList()
}

const articleEditRef = ref()
//添加文章
const onAddArticle = () => {
  // visibleDrawer.value = true

  articleEditRef.value.open({})
}
//编辑文章
const onEditArticle = (row) => {
  // console.log(row)
  articleEditRef.value.open(row)
}
//添加或者编辑成功的回调
const onSuccess = (type) => {
  if (type === 'add') {
    //如果是添加，最好渲染最后一页
    const lasePage = Math.ceil((total.value + 1) / params.value.pagesize)
    params.value.pagenum = lasePage //更新成最大页码数
  }
  ///如果是编辑，则直接渲染当前页
  getArticleList()
}
</script>

<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">添加文章</el-button>
    </template>
    <!-- 表单区域 -->
    <el-form inline>
      <el-form-item label="文章分类：" style="width: 240px">
        <!-- 下拉组件 -->
        <!-- v-model 是:value 和@input的简写 vue2
          v-model 是 :modeValue和@update:modeValue的简写 vue3 -->
        <ChannelSelect v-model="params.cate_id"></ChannelSelect>
      </el-form-item>
      <el-form-item label="发布状态：" style="width: 240px">
        <el-select v-model="params.state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格区域 -->
    <el-table :data="articleList" v-loading="loading">
      <el-table-column label="文章标题" prop="title">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发表时间" prop="pub_date">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <!-- 利用作用域插槽row可以获取当前行的数据 可以理解为v-for中item -->
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            circle
            plan
            :icon="Edit"
            type="primary"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            circle
            plan
            :icon="Delete"
            type="danger"
            @click="onDeleteArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 5, 10]"
      :background="true"
      layout="jumper,total, sizes, prev, pager, next "
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; display: flex; justify-content: flex-end"
    />
    <!-- 抽屉区域 -->
    <ArticleEdit ref="articleEditRef" @success="onSuccess"></ArticleEdit>
  </page-container>
</template>

<style lang="scss" scoped></style>
