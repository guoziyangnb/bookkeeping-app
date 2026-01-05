<template>
	<teleport to="body">
		<transition name="fade">
			<div v-if="show" class="date-select-modal-overlay" @click="handleCancel">
				<div class="date-select-modal" @click.stop>
					<!-- 头部 -->
					<div class="modal-header">
						<button class="header-btn cancel-btn" @click="handleCancel">取消</button>
						<div class="header-title">选择日期</div>
						<button class="header-btn confirm-btn" @click="handleConfirm">确认</button>
					</div>

					<!-- 月份选择器 -->
					<div class="month-selector">
						<button class="month-nav-btn" @click="prevMonth">
							<svg viewBox="0 0 24 24">
								<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
							</svg>
						</button>
						<div class="current-month">{{ currentMonthLabel }}</div>
						<button class="month-nav-btn" @click="nextMonth">
							<svg viewBox="0 0 24 24">
								<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
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
									selected: isSelected(cell),
									disabled: isDisabled(cell)
								}"
								@click="handleDateClick(cell)">
								{{ cell.day }}
							</div>
						</div>
					</div>
				</div>
			</div>
		</transition>
	</teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { generateCalendar, formatToLocalISODate, isToday } from '@/utils/date'

const props = defineProps({
	show: {
		type: Boolean,
		default: false
	},
	modelValue: {
		type: [String, Date],
		default: null
	},
	maxDate: {
		type: [String, Date],
		default: () => new Date()
	}
})

const emit = defineEmits(['update:show', 'update:modelValue', 'confirm', 'cancel'])

const currentDate = ref(props.modelValue ? new Date(props.modelValue) : new Date())
const tempSelectedDate = ref(props.modelValue ? formatToLocalISODate(props.modelValue) : null)

const weekdays = ['日', '一', '二', '三', '四', '五', '六']

// 当前年月
const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth())

// 当前月份标签
const currentMonthLabel = computed(() => {
	return `${currentYear.value}年 ${currentMonth.value + 1}月`
})

// 最大日期（ISO格式）
const maxDateISO = computed(() => {
	if (!props.maxDate) return null
	return formatToLocalISODate(props.maxDate)
})

// 生成日历数据
const calendar = computed(() => {
	return generateCalendar(currentYear.value, currentMonth.value)
})

// 判断是否选中
const isSelected = cell => {
	if (cell.type !== 'day' || !tempSelectedDate.value) return false
	return formatToLocalISODate(cell.date) === tempSelectedDate.value
}

// 判断是否禁用（超过最大日期）
const isDisabled = cell => {
	if (cell.type !== 'day' || !maxDateISO.value) return false
	const cellDateStr = formatToLocalISODate(cell.date)
	return cellDateStr > maxDateISO.value
}

// 上个月
function prevMonth() {
	if (currentMonth.value === 0) {
		currentDate.value = new Date(currentYear.value - 1, 11, 1)
	} else {
		currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
	}
}

// 下个月
function nextMonth() {
	if (currentMonth.value === 11) {
		currentDate.value = new Date(currentYear.value + 1, 0, 1)
	} else {
		currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
	}
}

// 点击日期
function handleDateClick(cell) {
	if (cell.type === 'day' && !isDisabled(cell)) {
		tempSelectedDate.value = formatToLocalISODate(cell.date)
	}
}

// 确认
function handleConfirm() {
	if (tempSelectedDate.value) {
		emit('update:modelValue', tempSelectedDate.value)
		emit('confirm', tempSelectedDate.value)
	}
	emit('update:show', false)
}

// 取消
function handleCancel() {
	emit('cancel')
	emit('update:show', false)
}

// 监听显示状态变化，重置临时选择
watch(
	() => props.show,
	newVal => {
		if (newVal) {
			// 打开时，设置当前选中的日期
			if (props.modelValue) {
				const date = new Date(props.modelValue)
				currentDate.value = date
				tempSelectedDate.value = formatToLocalISODate(date)
			} else {
				currentDate.value = new Date()
				tempSelectedDate.value = null
			}
		}
	}
)
</script>

<style scoped>
.date-select-modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(10px);
	display: flex;
	align-items: flex-end;
	justify-content: center;
	z-index: 9999;
	animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.date-select-modal {
	width: 100%;
	max-width: 600px;
	background: var(--bg-primary);
	border-radius: 24px 24px 0 0;
	padding: 20px;
	padding-bottom: 40px;
	animation: slideUp 0.3s ease;
	box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.1);
}

@keyframes slideUp {
	from {
		transform: translateY(100%);
	}
	to {
		transform: translateY(0);
	}
}

/* 头部 */
.modal-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 20px;
	padding: 0 10px;
}

.header-btn {
	border: none;
	background: none;
	font-size: 16px;
	font-weight: 500;
	cursor: pointer;
	padding: 8px 16px;
	border-radius: 8px;
	transition: all 0.3s ease;
}

.cancel-btn {
	color: var(--text-secondary);
}

.cancel-btn:active {
	background: rgba(0, 0, 0, 0.05);
}

.header-title {
	font-size: 18px;
	font-weight: 600;
	color: var(--text-primary);
}

.confirm-btn {
	color: var(--accent-orange);
}

.confirm-btn:active {
	background: rgba(255, 138, 91, 0.1);
}

/* 月份选择器 */
.month-selector {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 24px;
	margin-bottom: 20px;
}

.month-nav-btn {
	width: 40px;
	height: 40px;
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

.month-nav-btn:active {
	transform: scale(0.95);
	background: var(--bg-glass-hover);
}

.month-nav-btn svg {
	width: 20px;
	height: 20px;
	fill: currentColor;
}

.current-month {
	font-size: 18px;
	font-weight: 600;
	color: var(--text-primary);
	min-width: 140px;
	text-align: center;
}

/* 日历网格 */
.calendar-grid {
	background: var(--bg-glass);
	backdrop-filter: blur(20px);
	border: 1px solid var(--bg-glass-border);
	border-radius: 16px;
	padding: 16px;
}

.weekdays {
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	gap: 4px;
	margin-bottom: 8px;
}

.weekday {
	text-align: center;
	font-size: 14px;
	font-weight: 500;
	color: var(--text-secondary);
	padding: 8px 0;
}

.days {
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	gap: 4px;
}

.day-cell {
	aspect-ratio: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 15px;
	font-weight: 500;
	color: var(--text-primary);
	border-radius: 12px;
	cursor: pointer;
	transition: all 0.2s ease;
	position: relative;
}

.day-cell:not(.empty):not(.disabled):hover {
	background: rgba(25, 137, 250, 0.1);
}

.day-cell:not(.empty):not(.disabled):active {
	transform: scale(0.95);
}

.day-cell.empty {
	cursor: default;
}

.day-cell.today {
	color: var(--accent-orange);
	font-weight: 600;
}

.day-cell.today::after {
	content: '今';
	position: absolute;
	bottom: 2px;
	font-size: 10px;
	font-weight: normal;
	opacity: 0.7;
}

.day-cell.selected {
	background: var(--accent-orange);
	color: #fff;
	font-weight: 600;
}

.day-cell.disabled {
	color: var(--text-disabled);
	cursor: not-allowed;
	opacity: 0.4;
}

/* 暗黑主题适配 */
[data-theme='dark'] {
	.date-select-modal {
		background: var(--bg-primary);
		box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.3);
	}

	.day-cell.today {
		color: #4dabf7;
	}

	.day-cell.selected {
		background: var(--accent-orange);
		color: #fff;
	}

	.confirm-btn {
		color: var(--accent-orange);
	}
}

@media (min-width: 768px) {
	.date-select-modal {
		border-radius: 24px;
		margin-bottom: 20px;
	}
}
</style>
