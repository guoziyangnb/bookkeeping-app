<template>
  <input
    v-model="inputValue"
    type="date"
    class="date-picker-input"
  >
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const inputValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>

<style scoped>
.date-picker-input {
  width: 100%;
  padding: 16px 18px;
  border: none;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.03);
  font-size: 16px;
  font-weight: 500;
  font-family: inherit;
  color: var(--text-primary);
  transition: all 0.3s ease;
  cursor: pointer;
}

.date-picker-input:focus {
  outline: none;
  background: rgba(0, 0, 0, 0.06);
}

/* 隐藏原生日历图标，使用浏览器默认样式 */
.date-picker-input::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.date-picker-input::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}

/* 暗黑主题适配 */
[data-theme="dark"] .date-picker-input {
  background: rgba(255, 255, 255, 0.08);
}

[data-theme="dark"] .date-picker-input:focus {
  background: rgba(255, 255, 255, 0.12);
}
</style>
