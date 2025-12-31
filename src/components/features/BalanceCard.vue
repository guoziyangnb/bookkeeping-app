<template>
	<div class="balance-card">
		<div class="balance-label">本月余额</div>
		<div class="balance-amount">
			{{ formatAmount(recordsStore.totalBalance, true) }}
		</div>
		<div class="balance-stats">
			<div class="balance-stat">
				<div class="balance-stat-icon">
					<svg viewBox="0 0 24 24">
						<path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8z" />
					</svg>
				</div>
				<div class="balance-stat-info">
					<span class="balance-stat-label">收入</span>
					<span class="balance-stat-value">{{ formatAmount(recordsStore.totalIncome, false) }}</span>
				</div>
			</div>
			<div class="balance-stat">
				<div class="balance-stat-icon">
					<svg viewBox="0 0 24 24">
						<path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8z" />
					</svg>
				</div>
				<div class="balance-stat-info">
					<span class="balance-stat-label">支出</span>
					<span class="balance-stat-value">{{ formatAmount(recordsStore.totalExpense, false) }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useRecordsStore } from '@/stores/records'
import { formatAmount } from '@/utils/format'

const recordsStore = useRecordsStore()
</script>
