<template>
  <div class="transaction-item" @click="handleClick">
    <div class="transaction-icon" :style="{ background: categoryColor }">
      <svg v-html="categoryIcon"></svg>
    </div>
    <div class="transaction-details">
      <div class="transaction-category">{{ record.category }}</div>
      <div class="transaction-time">{{ formatRelativeTime(record.date) }}</div>
    </div>
    <div class="transaction-amount" :class="record.type">
      {{ formatAmount(record.amount) }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUIStore } from '@/stores/ui'
import { formatAmount, formatRelativeTime } from '@/utils/format'

const uiStore = useUIStore()

const props = defineProps({
  record: {
    type: Object,
    required: true
  }
})

const categoryColors = {
  '餐饮': 'var(--accent-orange)',
  '交通': 'var(--accent-blue)',
  '购物': 'var(--accent-purple)',
  '娱乐': 'var(--accent-orange)',
  '医疗': 'var(--accent-green)',
  '工资': 'var(--accent-green)',
  '投资': 'var(--accent-blue)',
  '礼金': 'var(--accent-purple)',
  '其他': 'var(--text-secondary)'
}

const categoryIcons = {
  '餐饮': '<path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>',
  '交通': '<path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>',
  '购物': '<path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>',
  '娱乐': '<path d="M21 5.71v12.58c0 1.45-1.38 2.58-2.91 2.58H2.91C1.38 20.87 0 19.74 0 18.29V5.71C0 4.26 1.38 3.13 2.91 3.13h15.18C19.62 3.13 21 4.26 21 5.71zM12 17c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z"/>',
  '医疗': '<path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/>',
  '工资': '<path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>',
  '投资': '<path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/>',
  '礼金': '<path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>',
  '其他': '<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>'
}

const categoryColor = computed(() => categoryColors[props.record.category] || 'var(--text-secondary)')
const categoryIcon = computed(() => categoryIcons[props.record.category] || categoryIcons['其他'])

function handleClick() {
  uiStore.openEditModal(props.record)
}
</script>

<style scoped>
.transaction-item {
  cursor: pointer;
  transition: all 0.2s ease;
}

.transaction-item:hover {
  opacity: 0.8;
  transform: translateX(4px);
}
</style>
