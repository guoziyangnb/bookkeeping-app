<template>
	<Teleport to="body">
		<div v-if="uiStore.isModalOpen" class="modal-overlay" @click.self="uiStore.closeModal">
			<div class="modal-content">
				<div class="modal-header">
					<div class="modal-title">{{ modalTitle }}</div>
					<button class="modal-close-btn" @click="uiStore.closeModal">
						<svg viewBox="0 0 24 24">
							<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
						</svg>
					</button>
				</div>

				<div class="type-toggle">
					<button class="type-btn expense" :class="{ active: formData.type === 'expense' }" @click="formData.type = 'expense'">支出</button>
					<button class="type-btn income" :class="{ active: formData.type === 'income' }" @click="formData.type = 'income'">收入</button>
				</div>

				<div class="form-group">
					<label class="form-label">金额</label>
					<div class="amount-input-wrapper">
						<span class="currency-symbol">¥</span>
						<input
							ref="amountInput"
							v-model="localAmount"
							type="text"
							inputmode="decimal"
							class="form-input amount-input"
							placeholder="0.00"
							@input="handleAmountInput" />
					</div>
				</div>

				<div class="form-group">
					<label class="form-label">分类</label>
					<div class="category-grid">
						<button
							v-for="category in allCategories"
							:key="category.name"
							class="category-option"
							:class="{ selected: formData.category === category.name }"
							@click="selectCategory(category.name)">
							<svg viewBox="0 0 24 24" v-html="category.icon"></svg>
							<div class="category-name">{{ category.name }}</div>
						</button>
					</div>
				</div>

				<div class="form-group">
					<label class="form-label">备注</label>
					<input v-model="formData.note" type="text" class="form-input" placeholder="添加备注..." />
				</div>

				<div class="form-group">
					<label class="form-label">日期</label>
					<DatePicker v-model="formData.date" />
				</div>

				<div class="form-group">
					<label class="form-label">记录图片（可选）</label>
					<ImageUpload v-model="formData.image" :max-size="5" />
				</div>

				<div class="modal-actions">
					<van-button v-if="isEditMode" :loading="isDelLoading" :disabled="isSaveLoading" class="delete-btn" @click="handleDelete">删除记录</van-button>
					<van-button :loading="isSaveLoading" :disabled="isDelLoading" class="submit-btn" @click="handleSubmit">
						{{ isEditMode ? '保存修改' : '保存记录' }}
					</van-button>
				</div>
			</div>
		</div>
	</Teleport>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { useUIStore } from '@/stores/ui'
import { useUserStore } from '@/stores/user'
import { useRecordsStore } from '@/stores/records'
import DatePicker from '@/components/common/DatePicker.vue'
import ImageUpload from '@/components/common/ImageUpload.vue'
import { formatToLocalISODate } from '@/utils/date'
import { message } from '@/utils/message'
import { Button as VanButton, showConfirmDialog } from 'vant'
import 'vant/lib/button/style'
import 'vant/lib/dialog/style'

const uiStore = useUIStore()
const userStore = useUserStore()
const recordsStore = useRecordsStore()
const amountInput = ref(null)
const isSaveLoading = ref(false)
const isDelLoading = ref(false)

// 本地金额输入状态，避免频繁更新响应式数据导致光标问题
const localAmount = ref('')

// 是否为编辑模式
const isEditMode = computed(() => uiStore.editingRecord !== null)

// 弹窗标题
const modalTitle = computed(() => (isEditMode.value ? '编辑记录' : '添加记录'))

// 所有分类及其图标
const allCategories = [
	{
		name: '餐饮',
		icon: '<path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>',
		type: 'expense'
	},
	{
		name: '交通',
		icon: '<path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>',
		type: 'expense'
	},
	{
		name: '购物',
		icon: '<path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>',
		type: 'expense'
	},
	{
		name: '娱乐',
		icon: '<path d="M21 5.71v12.58c0 1.45-1.38 2.58-2.91 2.58H2.91C1.38 20.87 0 19.74 0 18.29V5.71C0 4.26 1.38 3.13 2.91 3.13h15.18C19.62 3.13 21 4.26 21 5.71zM12 17c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z"/>',
		type: 'expense'
	},
	{
		name: '医疗',
		icon: '<path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/>',
		type: 'expense'
	},
	{
		name: '工资',
		icon: '<path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>',
		type: 'income'
	},
	{
		name: '投资',
		icon: '<path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/>',
		type: 'income'
	},
	{
		name: '礼金',
		icon: '<path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>',
		type: 'income'
	},
	{
		name: '其他',
		icon: '<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>',
		type: 'both'
	}
]

const formData = reactive({
	type: 'expense',
	amount: '',
	category: '餐饮',
	note: '',
	date: formatToLocalISODate(new Date()),
	image: ''
})

// 根据类型显示不同的分类
const currentCategories = computed(() => {
	return allCategories.filter(cat => cat.type === formData.type || cat.type === 'both')
})

// 监听弹窗打开，重置表单或填充编辑数据
watch(
	() => uiStore.isModalOpen,
	isOpen => {
		if (isOpen) {
			if (isEditMode.value) {
				// 编辑模式：填充现有数据
				const record = uiStore.editingRecord
				formData.type = record.type
				formData.category = record.category
				const absAmount = Math.abs(record.amount)
				localAmount.value = absAmount.toString()
				formData.note = record.note || ''
				formData.date = record.date.split('T')[0]
				formData.image = record.image_url || ''
			} else {
				// 添加模式：重置表单
				formData.type = uiStore.modalType
				// 如果有指定的默认分类，使用它；否则使用该类型的第一个分类
				if (uiStore.defaultCategory) {
					formData.category = uiStore.defaultCategory
				} else {
					const firstCategory = allCategories.find(cat => cat.type === formData.type || cat.type === 'both')
					formData.category = firstCategory?.name || '餐饮'
				}
				localAmount.value = ''
				formData.note = ''
				formData.date = formatToLocalISODate(new Date())
				formData.image = ''
			}
			// ? 不要一打开就触发焦点事件
			// nextTick(() => {
			// 	amountInput.value?.focus()
			// })
		}
	}
)

// 监听类型变化，更新默认分类
watch(
	() => formData.type,
	newType => {
		const firstCategory = allCategories.find(cat => cat.type === newType || cat.type === 'both')
		formData.category = firstCategory?.name || '餐饮'
	}
)

function selectCategory(categoryName) {
	formData.category = categoryName
}

// 处理金额输入，限制小数点后最多两位
function handleAmountInput(event) {
	let value = event.target.value
	const cursorPosition = event.target.selectionStart

	// 空值处理
	if (value === '' || value === null || value === undefined) {
		localAmount.value = ''
		formData.amount = ''
		return
	}

	// 只允许数字和一个小数点
	value = value.replace(/[^0-9.]/g, '')
	// 移除多余的小数点
	const dotIndex = value.indexOf('.')
	if (dotIndex !== -1) {
		value = value.substring(0, dotIndex + 1) + value.substring(dotIndex + 1).replace(/\./g, '')
	}

	// 检查是否包含小数点
	if (value.includes('.')) {
		const parts = value.split('.')
		let integerPart = parts[0] || ''
		let decimalPart = parts[1] || ''

		// 特殊处理：如果整数部分为空，只有小数点，不自动补0
		// 这样用户可以删除"0."中的"0"
		if (integerPart === '' && decimalPart === '') {
			value = '.'
		} else {
			// 如果整数部分为空但有小数部分，补0
			if (integerPart === '') {
				integerPart = '0'
			}

			// 如果小数部分超过2位，截断
			if (decimalPart.length > 2) {
				decimalPart = decimalPart.substring(0, 2)
			}

			value = `${integerPart}.${decimalPart}`
		}
	}

	// 更新本地状态
	localAmount.value = value
	// 同时更新 formData 用于提交
	formData.amount = value

	// 恢复光标位置
	nextTick(() => {
		const newPos = Math.min(cursorPosition, value.length)
		event.target.setSelectionRange(newPos, newPos)
	})
}

async function handleSubmit() {
	if (!userStore.userId) {
		message.warning('请先到设置页 -> 个人资料 -> 登录')
		return
	}

	const amountNum = parseFloat(localAmount.value)

	if (!localAmount.value || isNaN(amountNum) || amountNum <= 0) {
		message.warning('请输入有效金额')
		return
	}

	// 检查最小金额（0.01元，即1分）
	if (amountNum < 0.01) {
		message.warning('金额不能低于 0.01 元')
		return
	}

	// 使用 localAmount 的值
	formData.amount = amountNum

	isSaveLoading.value = true
	try {
		if (isEditMode.value) {
			// 编辑模式：更新记录，保留原有时间
			const originalTime = uiStore.editingRecord.date.split('T')[1]
			await recordsStore.updateRecord(uiStore.editingRecord.id, {
				type: formData.type,
				amount: formData.amount,
				category: formData.category,
				note: formData.note,
				date: `${formData.date}T${originalTime}`,
				image_url: formData.image
			})
			message.success('记录更新成功')
		} else {
			// 添加模式：创建新记录，使用用户选择的日期和当前时间
			const now = new Date()
			const dateTime = new Date(formData.date)
			dateTime.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds())

			await recordsStore.addRecord(userStore.userId, {
				type: formData.type,
				amount: formData.amount,
				category: formData.category,
				note: formData.note,
				date: dateTime.toISOString(),
				image_url: formData.image
			})
			message.success('记录添加成功')
		}

		uiStore.closeModal()
	} catch (error) {
		message.error('操作失败: ' + error.message)
		console.error('提交记录失败:', error)
	} finally {
		isSaveLoading.value = false
	}
}

// 删除记录
async function handleDelete() {
	if (isEditMode.value) {
		isDelLoading.value = true
		showConfirmDialog({
			title: '删除记录',
			message: '确定要清除记录吗？',
			confirmButtonColor: '#ff8a5b',
			cancelButtonColor: '#8a8a8a'
		})
			.then(async () => {
				await recordsStore.deleteRecord(uiStore.editingRecord.id)
				message.success('记录删除成功')
				isDelLoading.value = false
				uiStore.closeModal()
			})
			.catch(error => {
				isDelLoading.value = false
				// 用户取消操作不显示错误提示
				if (error !== 'cancel') {
					console.error('删除记录失败:', error)
					message.error('删除失败: ' + error.message)
				}
			})
		// if (confirm('确定要删除这条记录吗？')) {
		// 	try {
		// 		await recordsStore.deleteRecord(uiStore.editingRecord.id)
		// 		message.success('记录删除成功')
		// 		uiStore.closeModal()
		// 	} catch (error) {
		// 		message.error('删除失败: ' + error.message)
		// 		console.error('删除记录失败:', error)
		// 	}
		// }
	}
}
</script>

<style scoped>
/* 弹窗遮罩 - 与原型图一致 */
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.3);
	backdrop-filter: blur(8px);
	-webkit-backdrop-filter: blur(8px);
	z-index: 2000;
	display: flex;
	align-items: flex-start;
	justify-content: center;
	animation: fadeIn 0.3s ease;
	padding: 10vh 20px 20px;
	overflow-y: auto;
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

/* 弹窗内容 - 使用纯色背景而非玻璃拟态 */
.modal-content {
	background: var(--bg-primary);
	border-radius: 32px;
	padding: 32px;
	width: 100%;
	max-width: 420px;
	max-height: 60vh;
	overflow-y: auto;
	box-shadow: var(--shadow-medium);
	animation: scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);

	/* 隐藏滚动条 */
	scrollbar-width: none; /* Firefox */
	-ms-overflow-style: none; /* IE 10+ */
}

/* 隐藏滚动条 - Chrome, Safari, Opera */
.modal-content::-webkit-scrollbar {
	display: none;
	width: 0;
	height: 0;
}

@keyframes scaleIn {
	from {
		opacity: 0;
		transform: scale(0.9);
	}
	to {
		opacity: 1;
		transform: scale(1);
	}
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 28px;
}

.modal-title {
	font-size: 24px;
	font-weight: 600;
	color: var(--text-primary);
}

.modal-close-btn {
	width: 36px;
	height: 36px;
	border-radius: 50%;
	background: rgba(0, 0, 0, 0.05);
	border: none;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.3s ease;
}

/* 暗黑主题适配 */
[data-theme='dark'] .modal-close-btn {
	background: rgba(255, 255, 255, 0.08);
}

.modal-close-btn:hover {
	background: rgba(0, 0, 0, 0.1);
	transform: rotate(90deg);
}

.modal-close-btn svg {
	width: 18px;
	height: 18px;
	stroke: var(--text-primary);
}

/* 类型切换 - 与原型图一致 */
.type-toggle {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 12px;
	margin-bottom: 24px;
}

.type-btn {
	padding: 16px;
	border-radius: 16px;
	background: rgba(0, 0, 0, 0.03);
	border: none;
	font-size: 15px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.3s ease;
	text-align: center;
	color: var(--text-primary);
}

/* 暗黑主题适配 */
[data-theme='dark'] .type-btn {
	background: rgba(255, 255, 255, 0.08);
}

.type-btn:hover {
	background: rgba(0, 0, 0, 0.06);
}

.type-btn.expense.active {
	background: var(--accent-orange);
	color: white;
}

.type-btn.income.active {
	background: var(--accent-green);
	color: white;
}

/* 表单组 */
.form-group {
	margin-bottom: 20px;
}

.form-label {
	display: block;
	font-size: 13px;
	font-weight: 500;
	color: var(--text-secondary);
	margin-bottom: 10px;
}

/* 输入框 - 与原型图一致 */
.form-input {
	width: 100%;
	padding: 16px 18px;
	border: none;
	border-radius: 16px;
	background: rgba(0, 0, 0, 0.03);
	font-size: 16px;
	font-weight: 500;
	font-family: inherit;
	color: var(--text-primary);
	transition: all 0.3s ease;
}

/* 暗黑主题适配 */
[data-theme='dark'] .form-input {
	background: rgba(255, 255, 255, 0.08);
}

.form-input:focus {
	outline: none;
	background: rgba(0, 0, 0, 0.06);
}

.form-input::placeholder {
	color: var(--text-tertiary);
}

/* 金额输入框 */
.amount-input-wrapper {
	position: relative;
}

.currency-symbol {
	position: absolute;
	left: 18px;
	top: 50%;
	transform: translateY(-50%);
	font-size: 28px;
	font-weight: 600;
	color: var(--text-primary);
	z-index: 1;
}

.amount-input {
	padding-left: 50px;
	font-size: 32px;
	font-weight: 600;
}

/* 分类选择 - 与原型图一致 */
.category-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 12px;
}

.category-option {
	padding: 16px;
	border-radius: 16px;
	background: rgba(0, 0, 0, 0.03);
	border: none;
	cursor: pointer;
	text-align: center;
	transition: all 0.3s ease;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 6px;
}

/* 暗黑主题适配 */
[data-theme='dark'] .category-option {
	background: rgba(255, 255, 255, 0.08);
}

.category-option:hover {
	background: rgba(0, 0, 0, 0.06);
}

.category-option.selected {
	background: var(--accent-orange);
	color: white;
}

.category-option svg {
	width: 28px;
	height: 28px;
	fill: currentColor;
}

.category-name {
	font-size: 12px;
	font-weight: 500;
}

/* 底部操作按钮 */
.modal-actions {
	display: flex;
	gap: 12px;
	margin-top: 12px;
}

.delete-btn {
	flex: 1;
	padding: 18px;
	border: none;
	border-radius: 18px;
	background: var(--text-secondary);
	color: white;
	font-size: 16px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
}

.delete-btn:hover {
	opacity: 0.8;
}

.submit-btn {
	flex: 2;
	padding: 18px;
	border: none;
	border-radius: 18px;
	background: var(--accent-orange);
	color: white;
	font-size: 16px;
	font-weight: 600;
	cursor: pointer;
	box-shadow: 0 4px 16px rgba(255, 138, 91, 0.3);
	transition: all 0.3s ease;
}

.submit-btn:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(255, 138, 91, 0.4);
}

/* 响应式 */
@media (max-width: 480px) {
	.modal-overlay {
		padding: 8vh 16px 16px;
	}

	.modal-content {
		padding: 24px;
		max-height: 70vh;
	}

	.category-grid {
		gap: 8px;
	}

	.category-option {
		padding: 12px;
	}
}
</style>
