<template>
	<div class="date-picker-wrapper">
		<input ref="inputRef" v-model="inputValue" type="date" class="date-picker-input" />
		<svg class="calendar-icon" viewBox="0 0 24 24" @click="inputRef?.showPicker?.() || inputRef?.click()">
			<path
				d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"
			/>
		</svg>
	</div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
	modelValue: {
		type: String,
		default: ''
	}
})

const emit = defineEmits(['update:modelValue'])

const inputRef = ref(null)

const inputValue = computed({
	get() {
		return props.modelValue
	},
	set(value) {
		emit('update:modelValue', value)
	}
})
</script>

<style scoped>
.date-picker-wrapper {
	position: relative;
	width: 100%;
}

.date-picker-input {
	width: 100%;
	padding: 16px 18px;
	padding-right: 50px;
	border: none;
	border-radius: 16px;
	background: rgba(0, 0, 0, 0.03);
	font-size: 16px;
	font-weight: 500;
	font-family: inherit;
	color: var(--text-primary);
	transition: all 0.3s ease;
	cursor: pointer;
}

.date-picker-input:focus {
	outline: none;
	background: rgba(0, 0, 0, 0.06);
}

/* 隐藏原生日历图标 */
.date-picker-input::-webkit-calendar-picker-indicator {
	display: none;
}

.date-picker-input::-moz-calendar-picker-indicator {
	display: none;
}

/* 自定义日历图标 */
.calendar-icon {
	position: absolute;
	right: 18px;
	top: 50%;
	transform: translateY(-50%);
	width: 20px;
	height: 20px;
	fill: var(--text-secondary);
	pointer-events: auto;
	cursor: pointer;
	transition: fill 0.3s ease;
}

.date-picker-input:focus ~ .calendar-icon {
	fill: var(--text-primary);
}

/* 暗黑主题适配 */
[data-theme='dark'] .date-picker-input {
	background: rgba(255, 255, 255, 0.08);
}

[data-theme='dark'] .date-picker-input:focus {
	background: rgba(255, 255, 255, 0.12);
}

[data-theme='dark'] .calendar-icon {
	fill: var(--text-secondary);
}

[data-theme='dark'] .date-picker-input:focus ~ .calendar-icon {
	fill: var(--text-primary);
}
</style>
