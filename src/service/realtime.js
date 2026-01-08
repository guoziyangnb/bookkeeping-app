/**
 * Supabase Realtime 实时订阅工具
 * 用于监听数据库数据变更并实时更新前端 UI
 */
import supabase from './index'

/**
 * 订阅用户记录变更
 * @param {string} userId - 用户ID
 * @param {Function} callbacks - 回调函数集合
 * @param {Function} [callbacks.onInsert] - 插入记录时的回调
 * @param {Function} [callbacks.onUpdate] - 更新记录时的回调
 * @param {Function} [callbacks.onDelete] - 删除记录时的回调
 * @returns {Object} subscription 对象，用于取消订阅
 *
 * @example
 * const subscription = subscribeToRecords(userId, {
 *   onInsert: (newRecord) => {
 *     console.log('新记录添加:', newRecord)
 *     // 更新 UI，例如添加到列表
 *   },
 *   onUpdate: (updatedRecord) => {
 *     console.log('记录已更新:', updatedRecord)
 *     // 更新 UI，例如替换列表中的记录
 *   },
 *   onDelete: (deletedRecord) => {
 *     console.log('记录已删除:', deletedRecord)
 *     // 更新 UI，例如从列表移除
 *   }
 * })
 */
export const subscribeToRecords = (userId, callbacks = {}) => {
	const channelName = `records_${userId}`

	const subscription = supabase
		.channel(channelName)
		.on(
			'postgres_changes',
			{
				event: 'INSERT', // 监听插入事件
				schema: 'public',
				table: 'records',
				filter: `user_id=eq.${userId}` // 只监听当前用户的数据
			},
			payload => {
				console.log('🆕 新记录已添加:', payload.new)
				if (callbacks.onInsert) {
					callbacks.onInsert(payload.new)
				}
			}
		)
		.on(
			'postgres_changes',
			{
				event: 'UPDATE', // 监听更新事件
				schema: 'public',
				table: 'records',
				filter: `user_id=eq.${userId}`
			},
			payload => {
				console.log('✏️ 记录已更新:', payload.new)
				if (callbacks.onUpdate) {
					callbacks.onUpdate(payload.new)
				}
			}
		)
		.on(
			'postgres_changes',
			{
				event: 'DELETE', // 监听删除事件
				schema: 'public',
				table: 'records',
				filter: `user_id=eq.${userId}`
			},
			payload => {
				console.log('🗑️ 记录已删除:', payload.old)
				if (callbacks.onDelete) {
					callbacks.onDelete(payload.old)
				}
			}
		)
		.subscribe(error => {
			if (error) {
				console.error('❌ Realtime 订阅失败:', error)
			} else {
				console.log('✅ Realtime 订阅成功，正在监听 records 表变更...')
			}
		})

	return subscription
}

/**
 * 取消订阅
 * @param {Object} subscription - subscribeToRecords 返回的订阅对象
 */
export const unsubscribeFromRecords = subscription => {
	if (subscription) {
		supabase.removeChannel(subscription)
		console.log('🔌 已取消 Realtime 订阅')
	}
}

/**
 * 在 Vue 组件中使用的组合式函数
 * 自动管理订阅生命周期，组件卸载时自动取消订阅
 *
 * @example
 * // 在 Vue 组件中使用
 * import { useRecordsRealtime } from '@/service/realtime'
 *
 * const { subscribe } = useRecordsRealtime()
 *
 * subscribe(userId, {
 *   onInsert: (record) => {
 *     // 直接操作响应式数据
 *     records.value.push(record)
 *   },
 *   onDelete: (record) => {
 *     const index = records.value.findIndex(r => r.id === record.id)
 *     if (index !== -1) records.value.splice(index, 1)
 *   }
 * })
 */
export const useRecordsRealtime = () => {
	let subscription = null

	/**
	 * 订阅记录变更
	 */
	const subscribe = (userId, callbacks) => {
		// 先取消之前的订阅
		if (subscription) {
			unsubscribeFromRecords(subscription)
		}

		// 创建新订阅
		subscription = subscribeToRecords(userId, callbacks)
	}

	/**
	 * 取消订阅
	 */
	const unsubscribe = () => {
		if (subscription) {
			unsubscribeFromRecords(subscription)
			subscription = null
		}
	}

	// 组件卸载时自动取消订阅
	onUnmounted(() => {
		unsubscribe()
	})

	return {
		subscribe,
		unsubscribe
	}
}
