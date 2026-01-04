import { reactive } from 'vue'

const state = reactive({
	message: '',
	type: 'success',
	visible: false,
	timer: null
})

// 显示 Toast
function show(message, type = 'success', duration = 2000) {
	// 清除之前的定时器
	if (state.timer) {
		clearTimeout(state.timer)
	}

	// 更新状态
	state.message = message
	state.type = type
	state.visible = true

	// 自动关闭
	if (duration > 0) {
		state.timer = setTimeout(() => {
			state.visible = false
		}, duration)
	}

	return {
		close: () => {
			if (state.timer) {
				clearTimeout(state.timer)
			}
			state.visible = false
		}
	}
}

// 导出方法
export const message = {
	success(message, duration) {
		return show(message, 'success', duration)
	},
	warning(message, duration) {
		return show(message, 'warning', duration)
	},
	error(message, duration) {
		return show(message, 'error', duration)
	}
}

// 导出状态供组件使用
export function useToast() {
	return {
		state
	}
}
