<template>
  <div class="option-pool" :id="poolId">
    <div
      v-for="option in options"
      :key="option.label"
      class="card draggable"
      draggable="true"
      :data-value="option.label"
      :data-clone="canReuse ? 'true' : 'false'"
      @dragstart="handleDragStart"
      @dragend="handleDragEnd"
    >
      <div class="font-semibold">{{ option.label }}</div>
      <div v-if="option.text" class="text-sm mt-1">{{ option.text }}</div>
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
  canReuse?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  canReuse: false
})

function handleDragStart(event: DragEvent) {
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

function handleDragEnd(event: DragEvent) {
  const target = event.target as HTMLElement
  target.style.opacity = '1'
}
</script>

<style scoped>
.option-pool {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 1.5rem;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  margin-top: 1rem;
}

.card.draggable {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  padding: 0.75rem 1rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 0.5rem;
  cursor: move;
  user-select: none;
  transition: all 0.2s;
  text-align: center;
}

.card.draggable:hover {
  background-color: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card.draggable:active {
  transform: translateY(0);
}
</style>

