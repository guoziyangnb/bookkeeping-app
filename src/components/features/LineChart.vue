<template>
  <div class="chart-card glass-card">
    <div class="chart-header">
      <div class="chart-title">支出趋势</div>
      <div class="chart-period">本周</div>
    </div>
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { useUIStore } from '@/stores/ui'
import { useRecordsStore } from '@/stores/records'

const chartRef = ref(null)
const uiStore = useUIStore()
const recordsStore = useRecordsStore()
let chartInstance = null

// 获取本周数据
function getWeekData() {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const weekData = []

  // 获取过去7天的数据
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    date.setHours(0, 0, 0, 0)

    const nextDate = new Date(date)
    nextDate.setDate(date.getDate() + 1)

    const dayRecords = recordsStore.records.filter(r => {
      const recordDate = new Date(r.date)
      return recordDate >= date && recordDate < nextDate
    })

    const dayExpense = dayRecords
      .filter(r => r.type === 'expense')
      .reduce((sum, r) => sum + Math.abs(r.amount), 0)

    weekData.push({
      date: date.toLocaleDateString('zh-CN', { weekday: 'short' }),
      amount: dayExpense
    })
  }

  return weekData
}

// 获取图表配置
function getChartOption() {
  const weekData = getWeekData()
  const isDark = uiStore.isDark

  return {
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: weekData.map(d => d.date),
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
        }
      },
      axisLabel: {
        color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
        fontSize: 11
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisLabel: {
        color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
        fontSize: 11
      },
      splitLine: {
        lineStyle: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: weekData.map(d => d.amount),
        lineStyle: {
          width: 3,
          color: '#FF8A5B'
        },
        itemStyle: {
          color: '#FF8A5B',
          borderColor: '#fff',
          borderWidth: 2
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(255, 138, 91, 0.3)' },
              { offset: 1, color: 'rgba(255, 138, 91, 0)' }
            ]
          }
        },
        animationDelay: (idx) => idx * 100
      }
    ],
    animationDuration: 1000,
    animationEasing: 'cubicOut'
  }
}

// 初始化图表
function initChart() {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption(getChartOption())
}

// 更新图表
function updateChart() {
  if (chartInstance) {
    chartInstance.setOption(getChartOption())
  }
}

// 监听主题变化
watch(() => uiStore.theme, () => {
  updateChart()
})

// 监听数据变化
watch(() => recordsStore.records, () => {
  updateChart()
}, { deep: true })

onMounted(() => {
  initChart()
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
  }
})
</script>

<style scoped>
.chart-card {
  padding: 24px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.chart-period {
  font-size: 13px;
  color: var(--text-secondary);
  background: var(--bg-glass);
  padding: 6px 14px;
  border-radius: 12px;
}

.chart-container {
  width: 100%;
  height: 200px;
}
</style>
