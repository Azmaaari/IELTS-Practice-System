# UI组件设计规范

> **版本**: v1.0  
> **创建日期**: 2025-10-19  
> **重要**: 本规范基于《JSON与HTML工作流对应指南》，确保Vue组件渲染的UI与现有HTML模板完全一致

---

## 📌 设计原则

1. **HTML结构一致性**：Vue组件渲染的HTML必须与工作流中的HTML结构完全一致
2. **CSS类名复用**：使用工作流中定义的CSS类名（`.blank`, `.card`, `.dropzone`等）
3. **JavaScript逻辑兼容**：确保拖拽、表单交互等逻辑与原工作流一致
4. **答案格式规范**：严格遵循答案规范化规则

---

## 1. 题型组件映射表

### 1.1 组件与HTML对应关系

| 题型代码 | Vue组件名 | HTML元素 | CSS类名 | 工作流名称 |
|---------|----------|---------|---------|-----------|
| `true-false-ng` | `TrueFalseQuestion.vue` | `<input type="radio">` | 无特殊类 | T/F/NG |
| `yes-no-ng` | `YesNoQuestion.vue` | `<input type="radio">` | 无特殊类 | Y/N/NG |
| `multiple-choice-single` | `SingleChoiceQuestion.vue` | `<input type="radio">` | 无特殊类 | Multiple Choice |
| `multiple-choice-multiple` | `MultipleChoiceQuestion.vue` | `<input type="checkbox">` | 无特殊类 | Multiple Choice |
| `notes-completion` | `NotesCompletionQuestion.vue` | `<input class="blank">` | `.blank` | Fill in the Blanks |
| `summary-completion` | `SummaryCompletionQuestion.vue` | `<input class="blank">` | `.blank` | Summary Completion |
| `sentence-completion` | `SentenceCompletionQuestion.vue` | `<input class="blank">` | `.blank` | Sentence Completion |
| `paragraph-matching` | `ParagraphMatchingQuestion.vue` | 拖拽 | `.card`, `.dropzone` | Matching |
| `heading-matching` | `HeadingMatchingQuestion.vue` | 拖拽 | `.card`, `.dropzone` | Heading Matching |
| `feature-matching` | `FeatureMatchingQuestion.vue` | 拖拽 | `.card`, `.dropzone` | Feature Matching |
| `statement-matching` | `StatementMatchingQuestion.vue` | 拖拽 | `.card`, `.dropzone` | Statement Matching |

---

## 2. 判断题组件设计

### 2.1 TrueFalseQuestion.vue

**JSON数据输入**:
```json
{
  "questionNumber": 9,
  "type": "true-false-ng",
  "instruction": "Do the following statements agree with the information?",
  "content": {
    "statement": "Glaeser believes that congestion indicates serious problems."
  },
  "answer": "FALSE"
}
```

**组件模板**:
```vue
<template>
  <div class="question-item">
    <p class="question-text">
      <strong>{{ questionNumber }}</strong>
      {{ content.statement }}
    </p>
    <div class="radio-options">
      <label>
        <input 
          type="radio" 
          :name="`q${questionNumber}`" 
          value="TRUE"
          v-model="userAnswer"
          @change="handleChange"
        >
        TRUE
      </label>
      <label>
        <input 
          type="radio" 
          :name="`q${questionNumber}`" 
          value="FALSE"
          v-model="userAnswer"
          @change="handleChange"
        >
        FALSE
      </label>
      <label>
        <input 
          type="radio" 
          :name="`q${questionNumber}`" 
          value="NOT GIVEN"
          v-model="userAnswer"
          @change="handleChange"
        >
        NOT GIVEN
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { TrueFalseContent } from '@types/question'

interface Props {
  questionNumber: number
  content: TrueFalseContent
  modelValue?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const userAnswer = ref(props.modelValue || '')

watch(() => props.modelValue, (newVal) => {
  userAnswer.value = newVal || ''
})

const handleChange = () => {
  emit('update:modelValue', userAnswer.value)
}
</script>

<style scoped>
.question-item {
  margin-bottom: 1.5rem;
}

.question-text {
  margin-bottom: 0.5rem;
}

.radio-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-left: 1.5rem;
}

.radio-options label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}
</style>
```

**关键点**:
- ✅ 使用 `type="radio"`（与工作流一致）
- ✅ name属性格式：`q${questionNumber}`
- ✅ value值大写：TRUE/FALSE/NOT GIVEN
- ✅ 三个选项的顺序固定

---

## 3. 单选题组件设计

### 3.1 SingleChoiceQuestion.vue

**JSON数据输入**:
```json
{
  "questionNumber": 40,
  "type": "multiple-choice-single",
  "instruction": "Choose the correct letter, A, B, C or D.",
  "content": {
    "questionText": "The writer's main aim in this passage is to",
    "options": [
      {"label": "A", "text": "explain the meaning of the manuscript."},
      {"label": "B", "text": "determine the true identity."},
      {"label": "C", "text": "describe attempts to decode."},
      {"label": "D", "text": "identify media coverage."}
    ]
  },
  "answer": "C"
}
```

**组件模板**:
```vue
<template>
  <div class="question-item">
    <p class="question-text">
      <strong>{{ questionNumber }}</strong>
      {{ content.questionText }}
    </p>
    <div class="radio-options">
      <label 
        v-for="option in content.options" 
        :key="option.label"
      >
        <input 
          type="radio" 
          :name="`q${questionNumber}`" 
          :value="option.label"
          v-model="userAnswer"
          @change="handleChange"
        >
        <span class="option-label">{{ option.label }}</span>
        {{ option.text }}
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { MultipleChoiceContent } from '@types/question'

interface Props {
  questionNumber: number
  content: MultipleChoiceContent
  modelValue?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const userAnswer = ref(props.modelValue || '')

watch(() => props.modelValue, (newVal) => {
  userAnswer.value = newVal || ''
})

const handleChange = () => {
  emit('update:modelValue', userAnswer.value)
}
</script>

<style scoped>
.question-item {
  margin-bottom: 1.5rem;
}

.radio-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-left: 1.5rem;
}

.radio-options label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
}

.option-label {
  font-weight: 600;
  min-width: 1.5rem;
}
</style>
```

---

## 4. 多选题组件设计

### 4.1 MultipleChoiceQuestion.vue

**JSON数据输入**:
```json
{
  "questionNumber": 20,
  "type": "multiple-choice-multiple",
  "instruction": "Choose TWO letters, A-E.",
  "content": {
    "questionText": "Which TWO benefits are mentioned?",
    "options": [
      {"label": "A", "text": "economic growth"},
      {"label": "B", "text": "reduced pollution"},
      {"label": "C", "text": "improved healthcare"},
      {"label": "D", "text": "cultural diversity"},
      {"label": "E", "text": "lower costs"}
    ],
    "numberOfAnswers": 2,
    "checkboxGroupName": "q20-21"
  },
  "answer": ["A", "D"],
  "occupiesQuestions": 2
}
```

**组件模板**:
```vue
<template>
  <div class="question-item">
    <p class="question-text">
      <strong>{{ questionRange }}</strong>
      {{ content.questionText }}
    </p>
    <div class="checkbox-options">
      <label 
        v-for="option in content.options" 
        :key="option.label"
      >
        <input 
          type="checkbox" 
          :name="content.checkboxGroupName" 
          :value="option.label"
          v-model="selectedAnswers"
          @change="handleChange"
          :disabled="isDisabled(option.label)"
        >
        <span class="option-label">{{ option.label }}</span>
        {{ option.text }}
      </label>
    </div>
    <p v-if="showLimitWarning" class="text-sm text-amber-600 mt-2">
      请选择{{ content.numberOfAnswers }}个选项
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { MultipleChoiceMultipleContent } from '@types/question'

interface Props {
  questionNumber: number
  content: MultipleChoiceMultipleContent
  occupiesQuestions: number
  modelValue?: string[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const selectedAnswers = ref<string[]>(props.modelValue || [])

// 题号范围显示
const questionRange = computed(() => {
  const end = props.questionNumber + props.occupiesQuestions - 1
  return `${props.questionNumber}–${end}`
})

// 是否显示限制警告
const showLimitWarning = computed(() => {
  return selectedAnswers.value.length > props.content.numberOfAnswers
})

// 是否禁用选项
const isDisabled = (label: string) => {
  return (
    selectedAnswers.value.length >= props.content.numberOfAnswers &&
    !selectedAnswers.value.includes(label)
  )
}

watch(() => props.modelValue, (newVal) => {
  selectedAnswers.value = newVal || []
})

const handleChange = () => {
  emit('update:modelValue', selectedAnswers.value)
}
</script>

<style scoped>
.question-item {
  margin-bottom: 1.5rem;
}

.checkbox-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-left: 1.5rem;
}

.checkbox-options label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-options label input:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.option-label {
  font-weight: 600;
  min-width: 1.5rem;
}
</style>
```

**关键点**:
- ✅ 使用 `type="checkbox"`（与工作流一致）
- ✅ name属性使用 `checkboxGroupName`（如"q20-21"）
- ✅ 限制选择数量（如只能选2个）
- ✅ 答案是数组格式
- ✅ 显示题号范围（20–21）

---

## 5. 填空题组件设计

### 5.1 NotesCompletionQuestion.vue

**JSON数据输入**:
```json
{
  "questionNumber": 20,
  "type": "notes-completion",
  "instruction": "Complete the notes below. Choose ONE WORD ONLY.",
  "content": {
    "sentence": "Problems: dirt and ______",
    "wordLimit": "ONE WORD ONLY"
  },
  "answer": "disease"
}
```

**组件模板**:
```vue
<template>
  <div class="question-item">
    <p class="question-text">
      <template v-for="(part, index) in sentenceParts" :key="index">
        <span v-if="part.type === 'text'">{{ part.content }}</span>
        <input 
          v-else
          type="text"
          class="blank"
          :name="`q${questionNumber}`"
          v-model="userAnswer"
          @input="handleInput"
          :placeholder="content.wordLimit"
        >
      </template>
    </p>
    <p class="text-sm text-gray-500 mt-1">
      {{ content.wordLimit }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { CompletionContent } from '@types/question'

interface Props {
  questionNumber: number
  content: CompletionContent
  modelValue?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const userAnswer = ref(props.modelValue || '')

// 解析句子，分割文本和空格
const sentenceParts = computed(() => {
  const parts: Array<{ type: 'text' | 'blank'; content: string }> = []
  const regex = /______+/g
  let lastIndex = 0
  let match
  
  while ((match = regex.exec(props.content.sentence)) !== null) {
    // 添加空格前的文本
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: props.content.sentence.substring(lastIndex, match.index)
      })
    }
    // 添加空格
    parts.push({
      type: 'blank',
      content: ''
    })
    lastIndex = regex.lastIndex
  }
  
  // 添加最后剩余的文本
  if (lastIndex < props.content.sentence.length) {
    parts.push({
      type: 'text',
      content: props.content.sentence.substring(lastIndex)
    })
  }
  
  return parts
})

watch(() => props.modelValue, (newVal) => {
  userAnswer.value = newVal || ''
})

const handleInput = () => {
  emit('update:modelValue', userAnswer.value)
}
</script>

<style scoped>
.question-item {
  margin-bottom: 1.5rem;
}

.question-text {
  line-height: 2;
}

/* 关键：使用工作流中的 .blank 类名 */
.blank {
  display: inline-block;
  min-width: 150px;
  padding: 0.25rem 0.5rem;
  border: none;
  border-bottom: 2px solid #333;
  background-color: transparent;
  font-size: inherit;
  font-family: inherit;
  outline: none;
}

.blank:focus {
  border-bottom-color: #3b82f6;
}
</style>
```

**关键点**:
- ✅ 使用 `class="blank"`（与工作流完全一致）
- ✅ name属性格式：`q${questionNumber}`
- ✅ 空格用下划线表示（______）
- ✅ 显示字数限制提示

---

## 6. 拖拽题组件设计

### 6.1 ParagraphMatchingQuestion.vue

**JSON数据输入**:
```json
{
  "questionNumber": 14,
  "type": "paragraph-matching",
  "instruction": "Which paragraph contains the following information? NB You may use any letter more than once.",
  "content": {
    "statement": "A specific example of a successful project.",
    "options": [
      {"label": "A", "text": ""},
      {"label": "B", "text": ""},
      {"label": "C", "text": ""}
    ],
    "canReuse": true
  },
  "answer": "C"
}
```

**组件模板**:
```vue
<template>
  <div class="question-item">
    <p class="question-text">
      <a :id="`q${questionNumber}-anchor`"></a>
      <span 
        class="dropzone" 
        :data-target="`q${questionNumber}`"
        @drop="handleDrop"
        @dragover.prevent
        @dragenter.prevent
      >
        <div 
          v-if="droppedCard"
          class="card in-dropzone"
          draggable="true"
          :data-value="droppedCard"
          @dragstart="handleDragStart"
        >
          {{ droppedCard }}
        </div>
      </span>
      <strong>{{ questionNumber }}</strong>
      {{ content.statement }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { MatchingContent } from '@types/question'

interface Props {
  questionNumber: number
  content: MatchingContent
  modelValue?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const droppedCard = ref(props.modelValue || '')

watch(() => props.modelValue, (newVal) => {
  droppedCard.value = newVal || ''
})

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  const value = event.dataTransfer?.getData('text/plain')
  if (value) {
    droppedCard.value = value
    emit('update:modelValue', value)
  }
}

const handleDragStart = (event: DragEvent) => {
  if (droppedCard.value) {
    event.dataTransfer?.setData('text/plain', droppedCard.value)
    // 如果是从dropzone拖出，清空
    setTimeout(() => {
      droppedCard.value = ''
      emit('update:modelValue', '')
    }, 0)
  }
}
</script>

<style scoped>
.question-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

/* 关键：使用工作流中的 .dropzone 类名 */
.dropzone {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
  min-height: 40px;
  padding: 0.25rem 0.5rem;
  border: 2px dashed #ccc;
  border-radius: 4px;
  background-color: #f9fafb;
  transition: all 0.2s;
}

.dropzone:empty::before {
  content: '';
}

.dropzone.drag-over {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

/* 关键：使用工作流中的 .card 类名 */
.card {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  padding: 0.5rem 0.75rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 4px;
  cursor: move;
  user-select: none;
  font-weight: 600;
}

.card.in-dropzone {
  background-color: #2563eb;
}

.card:active {
  opacity: 0.5;
}
</style>
```

### 6.2 拖拽选项池组件 (OptionPool.vue)

**用途**：所有拖拽题共享的选项池

**组件模板**:
```vue
<template>
  <div class="option-pool" :id="poolId">
    <div 
      v-for="option in options"
      :key="option.label"
      class="card"
      draggable="true"
      :data-value="option.label"
      :data-clone="canReuse ? 'true' : 'false'"
      @dragstart="handleDragStart"
      @dragend="handleDragEnd"
    >
      {{ option.text || option.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Option {
  label: string
  text?: string
}

interface Props {
  poolId: string
  options: Option[]
  canReuse: boolean
}

const props = defineProps<Props>()

const handleDragStart = (event: DragEvent) => {
  const target = event.target as HTMLElement
  const value = target.dataset.value
  
  if (value) {
    event.dataTransfer?.setData('text/plain', value)
    
    // 如果可重复使用，克隆卡片
    if (props.canReuse) {
      event.dataTransfer!.effectAllowed = 'copy'
    } else {
      event.dataTransfer!.effectAllowed = 'move'
      target.style.opacity = '0.5'
    }
  }
}

const handleDragEnd = (event: DragEvent) => {
  const target = event.target as HTMLElement
  target.style.opacity = '1'
}
</script>

<style scoped>
/* 关键：使用工作流中的类名和样式 */
.option-pool {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 1rem;
  background-color: #f3f4f6;
  border-radius: 8px;
  margin-top: 1rem;
}

.card {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
  padding: 0.5rem 0.75rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 4px;
  cursor: move;
  user-select: none;
  font-weight: 600;
  transition: all 0.2s;
}

.card:hover {
  background-color: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
```

**关键点**:
- ✅ 使用 `class="dropzone"` 和 `class="card"`（与工作流一致）
- ✅ `data-target` 属性格式：`q${questionNumber}`
- ✅ `data-clone="true"` 控制是否可重复使用
- ✅ 拖拽事件处理与工作流逻辑一致

---

## 7. 答案规范化

### 7.1 答案格式处理

**composable: useAnswerNormalization.ts**

```typescript
export function useAnswerNormalization() {
  /**
   * 规范化答案格式
   * 规则来自《JSON与HTML工作流对应指南》第4节
   */
  function normalizeAnswer(answer: string | string[], questionType: string): string | string[] {
    // 多选题答案必须是数组
    if (questionType === 'multiple-choice-multiple') {
      if (Array.isArray(answer)) {
        return answer.map(a => a.trim().toUpperCase()) // 选项字母大写
      }
      return []
    }
    
    // 单个答案
    if (Array.isArray(answer)) {
      answer = answer[0] || ''
    }
    
    // 去除首尾空格
    answer = answer.trim()
    
    // 判断题和选项字母保持大写
    if (questionType === 'true-false-ng' || questionType === 'yes-no-ng') {
      return answer.toUpperCase() // TRUE/FALSE/NOT GIVEN
    }
    
    // 选择题和匹配题的选项字母大写
    if (
      questionType === 'multiple-choice-single' ||
      questionType.includes('matching')
    ) {
      return answer.toUpperCase() // A, B, C, D...
    }
    
    // 填空题答案小写
    return answer.toLowerCase() // disease, political
  }
  
  /**
   * 验证答案格式
   */
  function validateAnswer(
    userAnswer: string | string[], 
    correctAnswer: string | string[],
    questionType: string
  ): boolean {
    const normalizedUser = normalizeAnswer(userAnswer, questionType)
    const normalizedCorrect = normalizeAnswer(correctAnswer, questionType)
    
    // 多选题比较
    if (Array.isArray(normalizedUser) && Array.isArray(normalizedCorrect)) {
      if (normalizedUser.length !== normalizedCorrect.length) return false
      const sortedUser = [...normalizedUser].sort()
      const sortedCorrect = [...normalizedCorrect].sort()
      return sortedUser.every((ans, idx) => ans === sortedCorrect[idx])
    }
    
    // 单答案比较
    return normalizedUser === normalizedCorrect
  }
  
  return {
    normalizeAnswer,
    validateAnswer
  }
}
```

---

## 8. 练习页面布局设计

### 8.1 整体布局（与工作流一致）

```vue
<template>
  <div class="practice-container">
    <!-- 顶部工具栏 -->
    <div class="practice-header">
      <div class="timer">⏱️ {{ formattedTime }}</div>
      <button @click="handleSubmit" class="btn-primary">Submit</button>
    </div>
    
    <!-- 主要内容区：左右分栏 -->
    <div class="practice-main">
      <!-- 左侧：文章 -->
      <div class="passage-panel">
        <h2 class="passage-title">{{ passage.title }}</h2>
        <div 
          v-for="(para, index) in passage.paragraphs" 
          :key="index"
          class="paragraph"
        >
          <h4 v-if="para.label" class="paragraph-label">
            {{ para.label }}
          </h4>
          <p 
            class="paragraph-content"
            @mouseup="handleTextSelection"
          >
            {{ para.content }}
          </p>
        </div>
      </div>
      
      <!-- 右侧：题目 -->
      <div class="question-panel">
        <div 
          v-for="question in questions" 
          :key="question.questionNumber"
          class="question-group"
        >
          <h4 class="instruction">{{ question.instruction }}</h4>
          
          <component 
            :is="getQuestionComponent(question.type)"
            :question-number="question.questionNumber"
            :content="question.content"
            v-model="userAnswers[`q${question.questionNumber}`]"
          />
        </div>
        
        <!-- 拖拽题的选项池（只渲染一次） -->
        <OptionPool
          v-if="hasMatchingQuestions"
          pool-id="pool-para"
          :options="paragraphOptions"
          :can-reuse="true"
        />
      </div>
    </div>
    
    <!-- 底部导航栏 -->
    <div class="practice-footer">
      <div class="question-nav">
        <button
          v-for="q in questions"
          :key="q.questionNumber"
          :id="`q${q.questionNumber}-nav`"
          :class="['nav-button', getNavButtonClass(q.questionNumber)]"
          @click="scrollToQuestion(q.questionNumber)"
        >
          {{ q.questionNumber }}
        </button>
      </div>
    </div>
  </div>
</template>
```

**关键CSS类名（与工作流一致）**:
```css
/* 这些类名必须与工作流中的HTML一致 */
.practice-container { }
.passage-panel { }
.question-panel { }
.paragraph { }
.paragraph-label { }  /* 对应 <h4>A</h4> */
.paragraph-content { }
.question-group { }   /* 对应工作流的 .group */
.instruction { }      /* 对应工作流的题目说明 */
.question-item { }
.blank { }            /* 填空题输入框 */
.card { }             /* 拖拽卡片 */
.dropzone { }         /* 拖拽目标区域 */
.option-pool { }      /* 选项池 */
```

---

## 9. 实现检查清单

### 9.1 组件实现检查

- [ ] **判断题组件**
  - [ ] 使用 `<input type="radio">`
  - [ ] 三个选项固定顺序
  - [ ] name属性：`q${questionNumber}`
  - [ ] value大写：TRUE/FALSE/NOT GIVEN

- [ ] **单选题组件**
  - [ ] 使用 `<input type="radio">`
  - [ ] 动态渲染选项
  - [ ] 选项字母加粗显示

- [ ] **多选题组件**
  - [ ] 使用 `<input type="checkbox">`
  - [ ] name属性：`checkboxGroupName`
  - [ ] 限制选择数量
  - [ ] 显示题号范围（20–21）

- [ ] **填空题组件**
  - [ ] 使用 `class="blank"`
  - [ ] 解析 `______` 为输入框
  - [ ] 显示字数限制提示

- [ ] **拖拽题组件**
  - [ ] 使用 `class="dropzone"` 和 `class="card"`
  - [ ] 实现HTML5拖拽API
  - [ ] `data-clone="true"` 支持克隆
  - [ ] 选项池共享

### 9.2 样式实现检查

- [ ] CSS类名与工作流完全一致
- [ ] `.blank` 样式：下划线边框
- [ ] `.card` 样式：蓝色背景，可拖拽
- [ ] `.dropzone` 样式：虚线边框
- [ ] 响应式布局

### 9.3 功能实现检查

- [ ] 答案收集格式正确（小写键名）
- [ ] 答案验证逻辑正确
- [ ] 拖拽交互流畅
- [ ] 题号导航正常工作

---

## 10. 与工作流的完全对应

### 10.1 HTML元素对应

| 工作流HTML | Vue组件渲染 | 说明 |
|-----------|-----------|------|
| `<input type="radio" name="q1">` | 判断题/单选题 | 完全一致 |
| `<input type="checkbox" name="q20-21">` | 多选题 | 完全一致 |
| `<input class="blank" name="q22">` | 填空题 | class名一致 |
| `<div class="card" draggable="true">` | 拖拽卡片 | class和属性一致 |
| `<span class="dropzone" data-target="q14">` | 放置区域 | class和属性一致 |

### 10.2 JavaScript逻辑对应

| 工作流逻辑 | Vue实现 | 说明 |
|-----------|---------|------|
| 答案收集：`const userAnswers = {}` | `userAnswers.value = {}` | 相同结构 |
| 答案键：`q14: "b"` | `q14: "b"` | 小写键名 |
| 拖拽逻辑 | HTML5 Drag API | 相同API |
| 答案验证 | `useAnswerNormalization` | 规则一致 |

---

## 11. 下一步实施计划

1. **创建基础题型组件**（按优先级）
   - TrueFalseQuestion.vue
   - SingleChoiceQuestion.vue
   - NotesCompletionQuestion.vue

2. **创建拖拽相关组件**
   - OptionPool.vue（选项池）
   - ParagraphMatchingQuestion.vue

3. **创建QuestionRenderer父组件**
   - 动态加载对应题型组件
   - 统一答案收集

4. **集成到练习页面**
   - 实现左右分栏布局
   - 实现题号导航
   - 实现计时器

5. **测试和优化**
   - 对比工作流HTML输出
   - 确保样式完全一致
   - 测试拖拽交互

---

**重要**: 所有组件开发必须严格遵循本规范，确保与《JSON与HTML工作流对应指南》完全一致！

