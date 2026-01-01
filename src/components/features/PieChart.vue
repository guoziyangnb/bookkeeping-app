<template>
	<div class="pie-chart-container">
		<div ref="chartRef" class="chart-wrapper"></div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import { useUIStore } from '@/stores/ui'

const props = defineProps({
	data: {
		type: Array,
		required: true,
		default: () => []
	}
})

const chartRef = ref(null)
const uiStore = useUIStore()
let chartInstance = null
let resizeObserver = null

// 分类颜色
const categoryColors = ['#ffd10a', '#587bf3', '#0db8f5', '#b6d634', '#585b7d', '#ff6b98', '#785db0', '#ff994d']

// 总金额
const totalAmount = computed(() => {
	return props.data.reduce((sum, item) => sum + item.amount, 0)
})

// 转换数据为 ECharts 格式
const chartData = computed(() => {
	return props.data.map((item, index) => ({
		name: item.category,
		value: item.amount,
		percentage: item.percentage,
		itemStyle: {
			color: categoryColors[index % categoryColors.length]
		}
	}))
})

// 获取图表配置
function getChartOption() {
	const isDark = uiStore.isDark
	const isMobile = window.innerWidth <= 480

	return {
		title: {
			text: `总支出 ¥${totalAmount.value}`,
			left: 'left',
			top: 0,
			textStyle: {
				color: '#2c343c'
			}
		},
		// 提示框
		tooltip: {
			trigger: 'item', // 触发类型为数据项触发,可选值还有 axis（坐标轴触发，适用于柱状图 / 折线图）、none（不触发）
			// formatter: '{b}: ¥{c} ({d}%)' // b: 数据项名称，c: 数据项值，d: 数据项百分比
			formatter: '{b}: ¥{c}'
			// backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
			// borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
			// borderWidth: 1,
			// textStyle: {
			// 	color: isDark ? '#fff' : '#2c2c2c',
			// 	fontSize: 13
			// },
			// padding: [8, 12],
			// extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); border-radius: 8px;'
		},
		// 图例
		legend: isMobile
			? {
					// 移动端：图例放在右侧垂直排列
					orient: 'vertical',
					right: '0',
					top: 'center',
					itemWidth: 10,
					itemHeight: 10,
					itemGap: 8,
					textStyle: {
						fontSize: 11,
						color: isDark ? 'rgba(255, 255, 255, 0.9)' : '#2c2c2c'
					},
					formatter: name => {
						const item = props.data.find(d => d.category === name)
						const percentage = item ? item.percentage.toFixed(1) : 0
						return `${name} ${percentage}%`
					}
				}
			: {
					// 桌面端：图例在底部水平排列
					orient: 'horizontal',
					bottom: '0%',
					left: 'center',
					itemGap: 16,
					textStyle: {
						fontSize: 13,
						color: isDark ? 'rgba(255, 255, 255, 0.9)' : '#2c2c2c'
					},
					formatter: name => {
						const item = props.data.find(d => d.category === name)
						const percentage = item ? item.percentage.toFixed(1) : 0
						return `${name} ${percentage}%`
					}
				},
		// 环形图系列
		series: [
			{
				type: 'pie',
				radius: ['40%', '70%'], //饼图半径（环形）
				avoidLabelOverlap: true, //是否防止标签重叠
				center: isMobile ? ['40%', '50%'] : ['50%', '45%'], //饼图中心位置
				// 每一项之间的边框设置
				itemStyle: {
					borderColor: '#ffffff',
					borderWidth: 1,
					borderRadius: 10
				},
				label: {
					show: false, // 扇形内部是否显示标签
					position: 'center' // 标签位置（inside、outside、center）
				},
				//鼠标悬浮高亮状态配置
				emphasis: {
					label: {
						show: true, // 高亮时显示标签
						fontSize: 40, // 标签字体大小
						fontWeight: 'bold', // 标签字体加粗
						// 核心：自定义格式化函数，同时显示name和value
						formatter: function (params) {
							// params 包含当前悬浮扇形的所有数据：name、value、percent等
							// 换行用 \n，可自定义排版（比如分行显示）
							return `{nameStyle|${params.name}}\n{valueStyle|${params.percent.toFixed(1)}%}`
							// 可选：如果想显示百分比，可加 params.percent + '%'
							// return `${params.name}\n数值：${params.value}\n占比：${params.percent.toFixed(1)}%`;
						},
						// 定义富文本样式
						rich: {
							nameStyle: {
								fontSize: 20,
								color: '#333',
								fontWeight: 'bold',
								lineHeight: 36
							},
							valueStyle: {
								fontSize: 22,
								color: '#666',
								marginTop: 8
							}
						}
					}
				},
				// 显示在扇形外部标签的连接线（当 label.position: 'outside' 时生效）
				labelLine: {
					show: false
				},
				data: chartData.value
			}
		],
		// 动画配置
		animationDuration: 1500,
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
		chartInstance.clear()
		chartInstance.setOption(getChartOption())
	}
}

// 处理窗口 resize
function handleResize() {
	if (chartInstance) {
		chartInstance.resize()
		// 重新设置配置以适应可能的布局变化（移动端/桌面端）
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
	() => props.data,
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
			// 重新设置配置以适应可能的布局变化
			chartInstance.setOption(getChartOption())
		}
	})

	if (chartRef.value) {
		resizeObserver.observe(chartRef.value)
	}

	// 监听窗口 resize 事件
	window.addEventListener('resize', handleResize)
})

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
.pie-chart-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	/* padding:  0 20px; */
	width: 100%;
}

.chart-wrapper {
	width: 100%;
	height: 320px;
	position: relative;
}

/* 响应式 */
@media (max-width: 480px) {
	.chart-wrapper {
		height: 300px;
	}
}
</style>
