<!-- 完整示例：在 Vue 3 组件中使用 Supabase Realtime -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getRecords } from '@/service/records'
import { useRecordsRealtime } from '@/service/realtime'
import { useUserStore } from '@/stores/user'

// ============================================
// 方式 1: 手动管理订阅（更灵活）
// ============================================
const userStore = useUserStore()
const records = ref([])
let subscription = null

onMounted(async () => {
	// 1. 获取初始数据
	records.value = await getRecords(userStore.user.id)

	// 2. 订阅实时变更
	subscription = subscribeToRecords(userStore.user.id, {
		// 🆕 当有新记录添加时
		onInsert: newRecord => {
			console.log('实时收到新记录:', newRecord)
			// 方式 A: 重新获取所有数据（简单但性能较差）
			// fetchRecords()

			// 方式 B: 直接添加到本地列表（性能好）
			records.value.unshift(newRecord)
		},

		// ✏️ 当记录更新时
		onUpdate: updatedRecord => {
			console.log('实时收到更新记录:', updatedRecord)
			// 在本地列表中找到并更新该记录
			const index = records.value.findIndex(r => r.id === updatedRecord.id)
			if (index !== -1) {
				records.value[index] = updatedRecord
			}
		},

		// 🗑️ 当记录删除时
		onDelete: deletedRecord => {
			console.log('实时收到删除记录:', deletedRecord)
			// 从本地列表中移除该记录
			const index = records.value.findIndex(r => r.id === deletedRecord.id)
			if (index !== -1) {
				records.value.splice(index, 1)
			}
		}
	})
})

onUnmounted(() => {
	// 3. 组件卸载时取消订阅
	if (subscription) {
		unsubscribeFromRecords(subscription)
	}
})

// ============================================
// 方式 2: 使用组合式函数（自动管理生命周期）
// ============================================
import { useRecordsRealtime } from '@/service/realtime'

const { subscribe } = useRecordsRealtime() // 自动在 onUnmounted 时取消订阅

onMounted(async () => {
	records.value = await getRecords(userStore.user.id)

	// 订阅变更，组件卸载时自动取消订阅
	subscribe(userStore.user.id, {
		onInsert: record => records.value.unshift(record),
		onUpdate: record => {
			const index = records.value.findIndex(r => r.id === record.id)
			if (index !== -1) records.value[index] = record
		},
		onDelete: record => {
			const index = records.value.findIndex(r => r.id === record.id)
			if (index !== -1) records.value.splice(index, 1)
		}
	})
})

// ============================================
// 实际应用：多设备同步示例
// ============================================
/*
场景：你在手机上添加了一条记录，电脑上的网页会自动收到通知并更新

手机端（设备 A）:
1. 调用 addRecord({ type: 'expense', amount: 50, ... })
2. 数据写入 Supabase
3. Supabase 检测到 INSERT 事件
4. 推送到所有订阅者

电脑端（设备 B）:
5. WebSocket 收到通知
6. 触发 onInsert 回调
7. UI 自动更新显示新记录
*/
</script>

<template>
	<div>
		<h1>我的记账记录</h1>
		<div v-for="record in records" :key="record.id">
			{{ record.category }}: {{ record.amount }}
		</div>
	</div>
</template>
