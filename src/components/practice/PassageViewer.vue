<template>
  <div class="passage-viewer bg-white rounded-lg shadow-sm p-6">
    <!-- 文章标题 -->
    <h2 class="text-2xl font-bold text-gray-900 mb-6">
      {{ passage.title }}
    </h2>

    <!-- 段落列表 -->
    <div class="space-y-4">
      <div
        v-for="(paragraph, index) in passage.paragraphs"
        :key="index"
        class="paragraph"
      >
        <!-- 段落标签 -->
        <h4
          v-if="paragraph.label"
          class="paragraph-label"
        >
          {{ paragraph.label }}
        </h4>

        <!-- 段落内容 -->
        <p
          class="paragraph-content"
          :data-paragraph-label="paragraph.label"
          @mouseup="handleTextSelection"
        >
          {{ paragraph.content }}
        </p>
      </div>
    </div>

    <!-- 无段落数据提示 -->
    <div
      v-if="passage.paragraphs.length === 0"
      class="text-center py-12 text-gray-500"
    >
      <p>⚠️ 该文章暂无段落数据</p>
      <p class="text-sm mt-2">请联系管理员补充内容</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Passage } from '@/types/exam'

interface Props {
  passage: Passage
}

defineProps<Props>()

// 文本选择处理（后续实现高亮功能）
function handleTextSelection(event: MouseEvent) {
  const selection = window.getSelection()
  if (selection && selection.toString().length > 0) {
    // 后续实现高亮功能
    console.log('Selected text:', selection.toString())
  }
}
</script>

<style scoped>
.passage-viewer {
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}

.paragraph {
  margin-bottom: 1.5rem;
}

.paragraph-label {
  font-size: 1.25rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 0.5rem;
}

.paragraph-content {
  line-height: 1.8;
  color: #1f2937;
  text-align: justify;
}

.paragraph-content::selection {
  background-color: #fef08a;
}
</style>

