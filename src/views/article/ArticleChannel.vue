<script setup>
import { ref } from 'vue'
//请求
import { artGetChannelService, artDeleteChannelService } from '@/api/article'
//导入图标
import { Edit, Delete } from '@element-plus/icons-vue'
//导入组件ChannelEdit
import ChannelEdit from '@/views/article/components/ChannelEdit.vue'
import PageContainer from '@/components/PageContainer.vue'
//文章信息列表
const channelList = ref([])
//加载
const loading = ref(false)
//提供一个和ChannelEdit绑定的dialog
const dialog = ref()
//获取分类列表
const getChannelList = async () => {
  //发请求之前loading为true
  loading.value = true
  const res = await artGetChannelService()
  channelList.value = res.data.data
  // console.log(channelList.value)
  // channelList.value = [] //空状态显示
  //请求结束loading为false
  loading.value = false
}
//调用
getChannelList()

//删除分类
/**
 *
 * @param row 每一行的数据
 */
const onDelChannel = async (row) => {
  //删除之前确认
  await ElMessageBox.confirm('确认删除该分类吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })
  // console.log(row, $index)
  //发请求
  await artDeleteChannelService(row.id)
  ElMessage.success('删除成功')
  //删除成功从新渲染
  getChannelList()
}
//编辑显示弹层
const onEditChannel = (row) => {
  // console.log(row, $index)
  dialog.value.open(row)
}
//添加分类显示弹层
const onAddChannel = () => {
  dialog.value.open({})
}
//通知刷新
const onSuccess = () => {
  getChannelList()
}


</script>

<template>
  <PageContainer title="文章分类">
    <template #extra>
      <el-button type="primary" @click="onAddChannel">添加分类</el-button>
    </template>
    <!-- 表格部分 -->
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <!-- type属性是用来显示序号 -->
      <el-table-column type="index" width="50" />
      <!-- prop属性是用来绑定数据，label属性是用来显示表头 -->
      <el-table-column label="序号" width="100"></el-table-column>
      <el-table-column prop="cate_name" label="分类名称"></el-table-column>
      <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
      <el-table-column label="操作" width="150">
        <!-- 作用域插槽 row就是channel的每一项即item，$index是下标-->
        <template #default="{ row, $index }">
          <el-button
            :icon="Edit"
            circle
            type="primary"
            plain
            @click="onEditChannel(row, $index)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            type="danger"
            plain
            @click="onDelChannel(row, $index)"
          ></el-button>
        </template>
      </el-table-column>
      <!-- 作用域插槽 表格没有数据的时候显示该信息 -->
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <!-- 弹层部分 -->
    <ChannelEdit ref="dialog" @success="onSuccess"></ChannelEdit>
  </PageContainer>
</template>

<style lang="scss" scoped></style>
