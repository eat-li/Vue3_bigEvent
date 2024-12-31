<script setup>
//导入获取文章列表api
import { artGetChannelService } from '@/api/article'
import { ref } from 'vue'

defineProps({
  modeValue: {
    // 接收父组件传过来的modeValue
    type: [String, Number],
  },
  width: {
    type: String,
  },
})
const emit = defineEmits(['update:modeValue'])

const channelList = ref([])
const getChannelList = async () => {
  const res = await artGetChannelService()
  channelList.value = res.data.data
  // console.log(channelList.value)
}
//进入页面就触发

getChannelList()
</script>
<template>
  <!-- 将下拉菜单封装成组件 -->
  <el-select
    :modeValue="modeValue"
    @updata:modelValue="emit('update:modeValue', $event)"
    :style="{ width }"
  >
    <el-option
      v-for="channel in channelList"
      :label="channel.cate_name"
      :value="channel.id"
      :key="channel.id"
    ></el-option>
  </el-select>
</template>

<style></style>
