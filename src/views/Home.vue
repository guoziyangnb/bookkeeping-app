<template>
	<div class="page fade-in-up">
		<Header title="我的钱包" />

		<div class="container">
			<!-- 余额卡片 -->
			<div class="balance-section">
				<BalanceCard />
			</div>

			<!-- 折线图 -->
			<div class="chart-section">
				<LineChart />
			</div>

			<!-- 快捷操作 -->
			<div class="quick-actions-section">
				<QuickActions @click="handleQuickAction" />
			</div>

			<!-- 最近交易 -->
			<div class="transactions-section">
				<div class="section-header">
					<div class="section-title">最近交易</div>
					<router-link to="/calendar" class="view-all-btn">查看全部</router-link>
				</div>

				<div v-if="recentRecords.length > 0">
					<TransactionItem v-for="record in recentRecords" :key="record.id" :record="record" />
					<div v-if="hasMoreRecords" class="records-limit-hint">最近记录最多显示30条，其余请点击查看更多查看</div>
				</div>
				<div v-else class="empty-state">
					<p>暂无记录，点击下方按钮添加</p>
				</div>
			</div>
		</div>
	</div>
	<Overlay :show="isLoading" />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRecordsStore } from '@/stores/records'
import { useUserStore } from '@/stores/user'
import { useUIStore } from '@/stores/ui'
import Header from '@/components/layout/Header.vue'
import BalanceCard from '@/components/features/BalanceCard.vue'
import LineChart from '@/components/features/LineChart.vue'
import QuickActions from '@/components/features/QuickActions.vue'
import TransactionItem from '@/components/features/TransactionItem.vue'
import Overlay from '@/components/common/Overlay.vue'
import { message } from '@/utils/message'
import { getStorage } from '@/utils/storage'

const recordsStore = useRecordsStore()
const userStore = useUserStore()
const uiStore = useUIStore()
const isLoading = computed(() => recordsStore.loading)

const recentRecords = computed(() => recordsStore.records.slice(0, 30))

const hasMoreRecords = computed(() => recordsStore.records.length > 30)

// 加载最近记录
onMounted(async () => {
	const settings = getStorage('backupSettings', {})
	const isCloud = settings['cloudBackup']
	console.log('🚀 ~ isCloud:', isCloud)
	if (userStore.userId && isCloud) {
		try {
			await recordsStore.fetchRecentRecords(userStore.userId, 30)
		} catch (error) {
			console.error('加载记录失败:', error)
			message.error('加载记录失败', error.message)
		}
	}
})

function handleQuickAction(action) {
	uiStore.openModal(action.type, action.category)
}
</script>

<style scoped>
.balance-section,
.chart-section,
.quick-actions-section {
	margin-bottom: 24px;
}

.transactions-section {
	margin-bottom: 24px;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;
}

.section-title {
	font-size: 20px;
	font-weight: 600;
	color: var(--text-primary);
}

.view-all-btn {
	font-size: 13px;
	font-weight: 500;
	color: var(--accent-orange);
	text-decoration: none;
	transition: opacity 0.3s;
}

.view-all-btn:hover {
	opacity: 0.8;
}

.empty-state {
	text-align: center;
	padding: 60px 20px;
	color: var(--text-secondary);
}

.empty-state p {
	font-size: 14px;
}

.records-limit-hint {
	font-size: 12px;
	color: var(--text-secondary);
	text-align: center;
	padding: 12px 20px;
	margin-top: 8px;
}
</style>
