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
let resizeObserver = null

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

		const dayExpense = dayRecords.filter(r => r.type === 'expense').reduce((sum, r) => sum + Math.abs(r.amount), 0)

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
			left: '3%', // 绘图区域距离容器左侧的距离
			right: '4%',
			bottom: '3%',
			top: '10%',
			containLabel: true // 网格是否包含坐标轴的标签（防止标签超出容器）
		},
		//有文字提示
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				//选中的时候有阴影
				type: 'shadow'
			}
		},
		xAxis: {
			type: 'category', // 轴类型：'category' 类目轴（文本类数据，如日期、名称），'value' 数值轴，'time' 时间轴
			data: weekData.map(d => d.date), // 数组数据
			boundaryGap: false, // 轴两端是否留白：false 表示折线从X轴最左端开始，true 会留空白（默认true）
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
				show: false // 隐藏Y轴的轴线（只保留刻度和标签，更简洁）
			},
			axisLabel: {
				color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
				fontSize: 11
			},
			// Y轴网格线（横向分割线）样式
			splitLine: {
				lineStyle: {
					color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
					type: 'dashed' // 网格线类型：虚线（'solid' 是实线）
				}
			}
		},
		series: [
			{
				name: '支出',
				type: 'line', // 图表类型：'line' 折线图，'bar' 柱状图，'pie' 饼图等
				smooth: true, // 折线是否平滑：true 是平滑曲线，false 是折线（默认false）
				symbol: 'circle', // 数据点标记符号：'circle' 圆形，'square' 正方形，'none' 隐藏
				symbolSize: 6, // 数据点标记的大小（像素）
				data: weekData.map(d => d.amount),
				// 折线的样式
				lineStyle: {
					width: 3,
					color: '#FF8A5B'
				},
				// 数据点标记的样式
				itemStyle: {
					color: '#FF8A5B', // 标记填充色（和折线同色）
					borderColor: '#fff',
					borderWidth: 2
				},
				// 折线下方的面积填充样式（实现“面积图”效果）
				areaStyle: {
					color: {
						type: 'linear', // 填充色类型：线性渐变
						x: 0,
						y: 0, // 渐变起始点：(0,0) 即左上角
						x2: 0,
						y2: 1, // 渐变结束点：(0,1) 即左下角（垂直渐变）
						colorStops: [
							{ offset: 0, color: 'rgba(255, 138, 91, 0.3)' }, // 顶部：橙红色半透明（0.3透明度）
							{ offset: 1, color: 'rgba(255, 138, 91, 0)' } // 底部：完全透明
						]
					}
				}
				// animationDelay: idx => idx * 100 // 每个数据点的动画延迟：第idx个点延迟 idx*100 毫秒（逐点动画）
			}
		],
		animationDuration: 1500, // 图表动画总时长：2000毫秒（2秒）
		animationEasing: 'cubicOut' // 动画缓动效果：'cubicOut' 先快后慢，更自然（还有 'linear' 匀速等）
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
		chartInstance.clear() // ! 想要动画显现的话需要先清除数据
		chartInstance.setOption(getChartOption())
	}
}

// 监听主题变化
watch(
	() => uiStore.theme,
	() => {
		updateChart()
	}
)

// 监听数据变化
watch(
	() => recordsStore.records,
	() => {
		updateChart()
	},
	{ deep: true }
)

onMounted(() => {
	initChart()

	// 监听容器尺寸变化
	resizeObserver = new ResizeObserver(() => {
		if (chartInstance) {
			chartInstance.resize()
		}
	})

	if (chartRef.value) {
		resizeObserver.observe(chartRef.value)
	}

	// 监听窗口resize事件
	window.addEventListener('resize', handleResize)
})

// 处理窗口resize
function handleResize() {
	if (chartInstance) {
		chartInstance.resize()
	}
}

onUnmounted(() => {
	if (chartInstance) {
		chartInstance.dispose()
	}
	if (resizeObserver && chartRef.value) {
		resizeObserver.unobserve(chartRef.value)
		resizeObserver.disconnect()
	}
	window.removeEventListener('resize', handleResize)
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
