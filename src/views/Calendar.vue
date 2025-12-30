<template>
  <div class="page fade-in-up">
    <Header title="记账日历" />

    <div class="container">
      <!-- 月份选择器 -->
      <div class="month-selector">
        <button class="month-nav-btn" @click="prevMonth">
          <svg viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>
        <div class="current-month">{{ currentMonthLabel }}</div>
        <button class="month-nav-btn" @click="nextMonth">
          <svg viewBox="0 0 24 24">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </button>
      </div>

      <!-- 日历网格 -->
      <div class="calendar-grid">
        <div class="weekdays">
          <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
        </div>
        <div class="days">
          <div
            v-for="(cell, index) in calendar"
            :key="index"
            class="day-cell"
            :class="{
              empty: cell.type === 'empty',
              today: cell.isToday,
              'has-record': cell.hasRecord,
              selected: selectedDate === cell.dateStr
            }"
            @click="handleDateClick(cell)"
          >
            {{ cell.day }}
          </div>
        </div>
      </div>

      <!-- 选中日期的记录 -->
      <div class="selected-date-section">
        <div class="section-header">
          <div class="section-title">{{ selectedDateLabel }}</div>
        </div>
        <div class="glass-card">
          <div v-if="selectedDateRecords.length > 0">
            <TransactionItem
              v-for="record in selectedDateRecords"
              :key="record.id"
              :record="record"
            />
          </div>
          <div v-else class="empty-state">
            <p>这一天没有记录</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRecordsStore } from '@/stores/records'
import { generateCalendar } from '@/utils/date'
import Header from '@/components/layout/Header.vue'
import TransactionItem from '@/components/features/TransactionItem.vue'

const recordsStore = useRecordsStore()

const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth())
const selectedDate = ref(new Date().toISOString().split('T')[0])

const weekdays = ['日', '一', '二', '三', '四', '五', '六']

// 当前月份标签
const currentMonthLabel = computed(() => {
  return `${currentYear.value}年 ${currentMonth.value + 1}月`
})

// 选中日期标签
const selectedDateLabel = computed(() => {
  const date = new Date(selectedDate.value)
  const today = new Date()
  const isToday = (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
  return isToday ? '今天的记录' : `${selectedDate.value} 的记录`
})

// 生成日历数据
const calendar = computed(() => {
  const cal = generateCalendar(currentYear.value, currentMonth.value)

  // 标记有记录的日期
  const monthlyRecords = recordsStore.getMonthlyRecords(currentYear.value, currentMonth.value)
  const datesWithRecords = new Set(
    monthlyRecords.map(r => r.date.split('T')[0])
  )

  return cal.map(cell => {
    if (cell.type === 'day') {
      const dateStr = cell.date.toISOString().split('T')[0]
      return {
        ...cell,
        hasRecord: datesWithRecords.has(dateStr),
        dateStr
      }
    }
    return cell
  })
})

// 获取选中日期的记录
const selectedDateRecords = computed(() => {
  return recordsStore.getRecordsByDate(selectedDate.value)
})

// 上个月
function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

// 下个月
function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

// 点击日期
function handleDateClick(cell) {
  if (cell.type === 'day' && cell.dateStr) {
    selectedDate.value = cell.dateStr
  }
}
</script>

<style scoped>
.month-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-bottom: 24px;
}

.month-nav-btn {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--bg-glass-border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-normal);
  color: var(--text-primary);
}

.month-nav-btn:hover {
  background: var(--bg-glass-hover);
  transform: scale(1.05);
}

.month-nav-btn svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.current-month {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  min-width: 140px;
  text-align: center;
}

.selected-date-section {
  margin-top: 24px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-secondary);
}

.empty-state p {
  font-size: 14px;
}
</style>
