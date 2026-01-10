<template>
	<div class="page fade-in-up">
		<Header title="财务统计" />

		<div class="container">
			<!-- 支出占比 - 扇形图 -->
			<div class="glass-card">
				<div class="section-header">
					<div class="section-title">本月支出占比</div>
					<div class="section-title" style="font-size: 14px">总支出: &nbsp;¥ {{ totalExpense.toFixed(2) }}</div>
				</div>
				<PieChart v-if="totalExpense > 0" :data="expenseStats" />
				<div v-else class="empty-state">
					<p>本月暂无支出记录</p>
				</div>
			</div>

			<!-- 支出分析 - 柱状图 -->
			<div class="glass-card" style="margin-top: 24px">
				<div class="section-header">
					<div class="section-title">本月支出详情</div>
				</div>

				<div v-if="totalExpense > 0">
					<div v-for="(item, index) in expenseStats" :key="item.category" class="stat-bar-item">
						<div class="stat-bar-header">
							<span class="stat-bar-label">{{ item.category }}</span>
							<span class="stat-bar-value">¥{{ item.amount.toFixed(2) }}</span>
						</div>
						<div class="stat-bar-track">
							<div
								class="stat-bar-fill"
								:style="{
									width: item.percentage + '%',
									background: getCategoryColor(index)
								}"></div>
						</div>
					</div>
				</div>
				<div v-else class="empty-state">
					<p>本月暂无支出记录</p>
				</div>
			</div>

			<!-- 理财小贴士 -->
			<div class="glass-card" style="margin-top: 24px">
				<div class="section-header">
					<div class="section-title">理财小贴士</div>
				</div>
				<p class="tips-text">{{ tipsText }}</p>
			</div>
		</div>
	</div>
	<Overlay :show="isLoading" />
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRecordsStore } from '@/stores/records'
import { useUserStore } from '@/stores/user'
import Header from '@/components/layout/Header.vue'
import PieChart from '@/components/features/PieChart.vue'
import Overlay from '@/components/common/Overlay.vue'
import { message } from '@/utils/message'
import { getStorage } from '@/utils/storage'

const recordsStore = useRecordsStore()
const userStore = useUserStore()
const isLoading = computed(() => recordsStore.loading)

// 加载当前月份的记录数据
onMounted(async () => {
	const now = new Date()
	const year = now.getFullYear()
	const month = now.getMonth() // 0-11
	const settings = getStorage('backupSettings', {})
	const isCloud = settings['cloudBackup']

	if (userStore.userId && isCloud) {
		try {
			await recordsStore.fetchMonthlyRecords(userStore.userId, year, month)
		} catch (error) {
			console.error('加载本月统计数据失败:', error)
			message.error('加载记录失败', error.message)
		}
	}
})

// 总支出
const totalExpense = computed(() => recordsStore.totalExpense)

// 支出统计
const expenseStats = computed(() => {
	const stats = recordsStore.expenseByCategory
	const total = totalExpense.value

	return Object.entries(stats)
		.map(([category, amount]) => ({
			category,
			amount,
			percentage: total > 0 ? (amount / total) * 100 : 0
		}))
		.sort((a, b) => b.amount - a.amount)
})

// 分类颜色
// const categoryColors = ['var(--accent-orange)', 'var(--accent-blue)', 'var(--accent-purple)', 'var(--accent-green)', 'var(--text-secondary)']
const categoryColors = ['#ffd10a', '#587bf3', '#0db8f5', '#b6d634', '#585b7d', '#ff6b98', '#785db0', '#ff994d']

function getCategoryColor(index) {
	return categoryColors[index % categoryColors.length]
}

// 理财小贴士
const tipsText = computed(() => {
	if (expenseStats.value.length === 0) {
		return '开始记录你的每一笔支出，养成良好的理财习惯！'
	}

	const topCategory = expenseStats.value[0]
	const percentage = topCategory.percentage

	if (percentage > 50) {
		return `本月${topCategory.category}支出占比最高（${percentage.toFixed(0)}%），建议适当控制，合理分配支出。`
	} else if (percentage > 30) {
		return `本月${topCategory.category}支出较多（${percentage.toFixed(0)}%），可以尝试寻找更经济实惠的替代方案。`
	} else {
		return '支出分布比较均衡，继续保持良好的消费习惯！'
	}
})
</script>

<style scoped>
.tips-text {
	font-size: 14px;
	line-height: 1.8;
	color: var(--text-secondary);
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
