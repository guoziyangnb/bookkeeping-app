<template>
	<div class="field-edit-page">
		<!-- 导航栏 -->
		<div class="edit-nav">
			<button class="nav-back-btn" @click="goBack">
				<svg viewBox="0 0 24 24">
					<path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
				</svg>
			</button>
			<h1 class="edit-title">{{ fieldConfig.title }}</h1>
			<van-button :loading="loading" class="nav-save-btn" @click="handleSave">
				<span>保存</span>
			</van-button>
		</div>

		<div class="edit-container">
			<!-- 输入区域 -->
			<div class="input-section">
				<div class="input-wrapper">
					<van-field
						v-model="inputValue"
						:type="fieldConfig.inputType || 'text'"
						:placeholder="fieldConfig.placeholder"
						:maxlength="fieldConfig.maxlength"
						class="edit-input"
						:border="false"
						clearable
						clear-trigger="always" />
				</div>

				<!-- 提示信息 -->
				<div v-if="fieldConfig.hint" class="input-hint">
					<svg viewBox="0 0 24 24">
						<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
					</svg>
					<span>{{ fieldConfig.hint }}</span>
				</div>
			</div>

			<!-- 键盘遮挡时自动滚动到的保存按钮区域 -->
			<!-- <div class="save-area">
				<button class="save-btn" @click="handleSave">
					<span class="save-btn-text">保存修改</span>
					<svg class="save-btn-icon" viewBox="0 0 24 24">
						<path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
					</svg>
				</button>
			</div> -->
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Field as VanField } from 'vant'
import 'vant/lib/field/style'
import { message } from '@/utils/message'
import { Button as VanButton } from 'vant'
import 'vant/lib/button/style'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 字段配置
const fieldConfigs = {
	username: {
		title: '修改用户名',
		placeholder: '请输入用户名',
		inputType: 'text',
		hint: '用户名将用于显示和识别',
		validate: value => {
			if (!value.trim()) {
				return '请输入用户名'
			}
			if (value.length < 2) {
				return '用户名至少需要2个字符'
			}
			if (value.length > 20) {
				return '用户名不能超过20个字符'
			}
			return null
		}
	},
	email: {
		title: '修改邮箱',
		placeholder: '请输入邮箱地址',
		inputType: 'email',
		hint: '用于接收重要通知和账单信息',
		validate: value => {
			if (!value) {
				return null // 邮箱可以为空
			}
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
			if (!emailRegex.test(value)) {
				return '请输入有效的邮箱地址'
			}
			return null
		}
	},
	phone: {
		title: '修改手机号码',
		placeholder: '请输入手机号码',
		inputType: 'tel',
		maxlength: 11,
		hint: '用于账户安全验证',
		validate: value => {
			if (!value) {
				return null // 手机号可以为空
			}
			const phoneRegex = /^1[3-9]\d{9}$/
			if (!phoneRegex.test(value)) {
				return '请输入有效的手机号码'
			}
			return null
		}
	}
}

const loading = ref(false)
const fieldType = route.query.field
const fieldConfig = fieldConfigs[fieldType] || fieldConfigs.username
const inputValue = ref('')
// 枚举项
const fieldMap = {
	username: userStore.userName,
	email: userStore.userEmail,
	phone: userStore.userPhone
}

// 返回上一页
const goBack = () => {
	router.back()
}

// 保存修改
const handleSave = async () => {
	// 验证输入
	const error = fieldConfig.validate(inputValue.value)
	if (error) {
		message.warning(error)
		return
	}
	loading.value = true
	// 更新 localStorage
	// const savedProfile = userStore.userProfile
	// const profile = savedProfile ? savedProfile : {}

	// profile[fieldType] = inputValue.value.trim()
	// setStorage('userProfile', profile)
	try {
		const result = await userStore.updateProfile({ [fieldType]: inputValue.value.trim() })
		if (result && !result.error) {
			message.success('个人信息更新成功')
			// 仅在成功时延迟返回
			setTimeout(() => {
				router.back()
			}, 500)
		} else {
			message.error('个人信息更新失败' + result.error)
		}
	} catch (error) {
		message.error('个人信息更新失败' + error)
	} finally {
		loading.value = false
	}
}

// 加载当前值
onMounted(() => {
	// 确保登录了
	const savedProfile = userStore.userProfile
	if (savedProfile) {
		/**
		 * ! 现在全部改用pinia状态变量
		 */
		// const profile = savedProfile
		inputValue.value = fieldMap[fieldType]
	}

	// // 自动聚焦输入框
	// setTimeout(() => {
	// 	const input = document.querySelector('.edit-input input')
	// 	if (input) {
	// 		input.focus()
	// 	}
	// }, 300)
})

// 监听键盘弹出，滚动到输入框
// watch(inputValue, () => {
// 	setTimeout(() => {
// 		const input = document.querySelector('.edit-input input')
// 		if (input) {
// 			input.scrollIntoView({ behavior: 'smooth', block: 'center' })
// 		}
// 	}, 100)
// })
</script>

<style scoped>
/* ==================== 页面布局 ==================== */
.field-edit-page {
	min-height: 100vh;
	background: var(--bg-primary);
	display: flex;
	flex-direction: column;
}

/* 导航栏 */
.edit-nav {
	position: sticky;
	top: 0;
	z-index: 100;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 10px 12px;
	background: var(--bg-secondary);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border-bottom: 1px solid var(--bg-glass-border);
}

.nav-back-btn {
	width: 40px;
	height: 40px;
	border-radius: var(--radius-full);
	background: var(--bg-glass);
	border: 1.5px solid var(--bg-glass-border);
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.3s ease;
}

.nav-back-btn:active {
	background: var(--bg-glass-hover);
	transform: scale(0.95);
}

.nav-back-btn svg {
	width: 20px;
	height: 20px;
	fill: var(--text-primary);
}

.edit-title {
	font-size: 18px;
	font-weight: 600;
	color: var(--text-primary);
	flex: 1;
	text-align: center;
}

.nav-save-btn {
	padding: 8px 20px;
	border: none;
	border-radius: var(--radius-md);
	background: var(--gradient-orange);
	color: white;
	font-size: 14px;
	line-height: 1.2;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
}

.nav-save-btn:active {
	transform: scale(0.95);
	opacity: 0.9;
}

/* 主容器 */
.edit-container {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 20px;
	padding-bottom: 40px;
}

/* ==================== 输入区域 ==================== */
.input-section {
	flex: 1;
}

.input-wrapper {
	background: var(--bg-glass);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border: 2px solid var(--bg-glass-border);
	border-radius: var(--radius-lg);
	transition: all 0.3s ease;
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.input-wrapper:focus-within {
	border-color: var(--accent-orange);
	box-shadow: 0 0 0 3px rgba(255, 138, 91, 0.1);
}

.edit-input {
	background: transparent !important;
}

.edit-input :deep(.van-field__control) {
	color: var(--text-primary) !important;
	font-size: 18px !important;
	font-weight: 500 !important;
	padding: 16px !important;
	min-height: 56px !important;
}

.edit-input :deep(.van-field__control::placeholder) {
	color: var(--text-tertiary) !important;
	font-size: 16px !important;
}

.edit-input :deep(.van-field__clear) {
	color: var(--text-secondary) !important;
	font-size: 18px !important;
}

/* 提示信息 */
.input-hint {
	display: flex;
	align-items: flex-start;
	gap: 8px;
	margin-top: 16px;
	padding: 0 4px;
	color: var(--text-secondary);
	font-size: 13px;
	line-height: 1.6;
}

.input-hint svg {
	width: 16px;
	height: 16px;
	fill: var(--accent-orange);
	flex-shrink: 0;
	margin-top: 2px;
}

/* ==================== 保存按钮区域 ==================== */
.save-area {
	padding: 20px 0;
}

.save-btn {
	width: 100%;
	padding: 18px 32px;
	border: none;
	border-radius: var(--radius-lg);
	background: var(--gradient-orange);
	color: white;
	font-size: 16px;
	font-weight: 600;
	cursor: pointer;
	box-shadow: 0 8px 24px rgba(255, 138, 91, 0.4);
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	position: relative;
	overflow: hidden;
}

.save-btn::before {
	content: '';
	position: absolute;
	top: 0;
	left: -100%;
	width: 100%;
	height: 100%;
	background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
	transition: left 0.5s ease;
}

.save-btn:active::before {
	left: 100%;
}

.save-btn:active {
	transform: translateY(0);
	box-shadow: 0 4px 12px rgba(255, 138, 91, 0.3);
}

.save-btn-text {
	font-size: 16px;
	font-weight: 600;
}

.save-btn-icon {
	width: 20px;
	height: 20px;
	fill: white;
}

/* ==================== 响应式设计 ==================== */
@media (max-width: 480px) {
	.edit-container {
		padding: 16px;
	}

	.save-btn {
		padding: 16px 24px;
	}
}
</style>
