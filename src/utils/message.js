import { createApp, reactive, h } from 'vue'
import Toast from '@/components/common/Toast.vue'

// Toast 实例容器
let toastInstance = null
let toastContainer = null

// 创建 Toast 容器和实例
function createToastInstance() {
	if (toastInstance) return toastInstance

	// 创建容器元素
	toastContainer = document.createElement('div')
	toastContainer.id = 'toast-container'
	document.body.appendChild(toastContainer)

	// 创建 Toast 状态
	const state = reactive({
		message: '',
		type: 'success',
		visible: false,
		timer: null
	})

	// 创建 Vue 应用实例
	const app = createApp({
		render() {
			return h(Toast, {
				message: state.message,
				type: state.type,
				visible: state.visible
			})
		}
	})

	// 挂载到容器
	toastInstance = app.mount(toastContainer)

	return { state, app }
}

// 显示 Toast
function show(message, type = 'success', duration = 2000) {
	// 创建或获取 Toast 实例
	const { state } = createToastInstance()

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
	success(msg, duration) {
		return show(msg, 'success', duration)
	},
	warning(msg, duration) {
		return show(msg, 'warning', duration)
	},
	error(msg, duration) {
		return show(msg, 'error', duration)
	}
}
