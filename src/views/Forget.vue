<template>
	<div class="auth-container">
		<!-- 返回按钮 -->
		<button class="back-btn" @click="goBack">
			<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M19 12H5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
				<path d="M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</button>

		<!-- 顶部标题 -->
		<div class="header-section">
			<h1 class="page-title">忘记密码</h1>
			<p class="page-subtitle">重置您的密码</p>
		</div>

		<!-- 表单 -->
		<div class="form-section">
			<form @submit.prevent="handleSubmit">
				<!-- 账号 -->
				<div class="form-group">
					<label class="form-label">账号</label>
					<div class="input-wrapper">
						<span class="input-icon">
							<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2" />
								<path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="2" />
							</svg>
						</span>
						<input v-model="formData.account" type="text" placeholder="请输入手机号/邮箱" required />
					</div>
				</div>

				<!-- 验证码 -->
				<!-- <div class="form-group">
					<label class="form-label">验证码</label>
					<div class="input-wrapper">
						<span class="input-icon">
							<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
									stroke="currentColor"
									stroke-width="2" />
								<path
									d="M12 16V12C12 11.4477 11.5523 11 11 11H10"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round" />
								<path d="M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
							</svg>
						</span>
						<input v-model="formData.code" type="text" placeholder="请输入验证码" required />
						<button type="button" class="send-code-btn" :disabled="isSending ||   > 0" @click="sendCode">
							{{ countdown > 0 ? `${countdown}s` : '发送验证码' }}
						</button>
					</div>
				</div> -->

				<!-- 新密码 -->
				<div class="form-group">
					<label class="form-label">新密码</label>
					<div class="input-wrapper">
						<span class="input-icon">
							<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2" />
								<path
									d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round" />
							</svg>
						</span>
						<input v-model="formData.newPassword" :type="showPassword ? 'text' : 'password'" placeholder="请输入新密码" required />
						<button type="button" class="toggle-password" @click="showPassword = !showPassword">
							<svg v-if="!showPassword" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round" />
								<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" />
							</svg>
							<svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round" />
								<line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
							</svg>
						</button>
					</div>
				</div>

				<!-- 确认新密码 -->
				<div class="form-group">
					<label class="form-label">确认新密码</label>
					<div class="input-wrapper">
						<span class="input-icon">
							<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2" />
								<path
									d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round" />
							</svg>
						</span>
						<input v-model="formData.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" placeholder="请再次输入新密码" required />
						<button type="button" class="toggle-password" @click="showConfirmPassword = !showConfirmPassword">
							<svg v-if="!showConfirmPassword" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round" />
								<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" />
							</svg>
							<svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round" />
								<line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
							</svg>
						</button>
					</div>
				</div>

				<!-- 提交按钮 -->
				<button type="submit" class="submit-btn" :disabled="isLoading">
					{{ isLoading ? '处理中...' : '重置密码' }}
				</button>

				<!-- 返回登录 -->
				<div class="switch-form">
					<span>想起密码了？</span>
					<button type="button" class="link-btn" @click="goToLogin">返回登录</button>
				</div>
			</form>
		</div>

		<!-- 底部装饰 -->
		<div class="bottom-decoration">
			<div class="decoration-circle"></div>
		</div>
	</div>
</template>

<script setup>
import { ref, reactive, computed, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { message } from '@/utils/message'
import supabase from '@/service/index'

const router = useRouter()

// 表单数据
const formData = reactive({
	account: '', // 账号（可以是邮箱或手机号）
	// code: '',
	newPassword: '',
	confirmPassword: ''
})

// UI状态
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
// const isSending = ref(false)
const countdown = ref(0)

// 判断输入的是手机号还是邮箱
const accountType = computed(() => {
	const account = formData.account.trim()
	if (!account) return null

	// 手机号正则（中国大陆手机号）
	const phoneRegex = /^1[3-9]\d{9}$/
	if (phoneRegex.test(account)) {
		return 'phone'
	}

	// 邮箱正则
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	if (emailRegex.test(account)) {
		return 'email'
	}

	return null
})

// 验证账号输入
const validateAccount = () => {
	const account = formData.account.trim()
	if (!account) {
		message.error('请输入手机号或邮箱')
		return false
	}

	if (!accountType.value) {
		message.error('请输入有效的手机号或邮箱')
		return false
	}

	return true
}

// // 发送验证码
// const sendCode = async () => {
// 	// 验证账号
// 	if (!validateAccount()) {
// 		return
// 	}

// 	// TODO: 实现发送验证码的逻辑
// 	isSending.value = true
// 	try {
// 		// 这里暂时只显示提示，实际逻辑待实现
// 		message.success('验证码发送成功（模拟）')

// 		// 倒计时60秒
// 		countdown.value = 60
// 		const timer = setInterval(() => {
// 			countdown.value--
// 			if (countdown.value <= 0) {
// 				clearInterval(timer)
// 			}
// 		}, 1000)
// 	} catch (error) {
// 		message.error(error.message || '发送验证码失败')
// 	} finally {
// 		isSending.value = false
// 	}
// }

// 处理表单提交
const handleSubmit = async () => {
	// 验证账号
	if (!validateAccount()) {
		return
	}

	// // 验证验证码
	// if (!formData.code.trim()) {
	// 	message.error('请输入验证码')
	// 	return
	// }

	// 验证新密码
	if (!formData.newPassword) {
		message.error('请输入新密码')
		return
	}

	if (formData.newPassword.length < 6) {
		message.error('密码长度不能少于6位')
		return
	}

	// 验证确认密码
	if (!formData.confirmPassword) {
		message.error('请再次输入新密码')
		return
	}

	if (formData.newPassword !== formData.confirmPassword) {
		message.error('两次输入的密码不一致')
		return
	}

	const { data1, error1 } = await supabase.auth.resetPasswordForEmail('2263831821@qq.com')
	console.log('🚀 ~ handleSubmit ~ error1:', error1)
	console.log('🚀 ~ handleSubmit ~ data1:', data1)

	watchEffect(() => {
		supabase.auth.onAuthStateChange(async (event, session) => {
			if (event == 'PASSWORD_RECOVERY') {
				//  const newPassword = prompt("What would you like your new password to be?");
				const { data, error } = await supabase.auth.updateUser({ password: formData.newPassword })
				console.log('🚀 ~ handleSubmit ~ error:', error)
				console.log('🚀 ~ handleSubmit ~ data:', data)
				if (data) message.info('Password updated successfully!')
				if (error) message.info('There was an error updating your password.')
			}
		})
	})

	// TODO: 实现重置密码的逻辑
	// const { data, error } = await supabase.auth.updateUser({
	// 	password: formData.newPassword
	// })

	// if (data.user) {
	// 	message.info('重置密码功能完成')
	// }
}

// 返回登录
const goToLogin = () => {
	router.push('/login')
}

// 返回
const goBack = () => {
	router.push('/login')
}
</script>

<style scoped>
.auth-container {
	min-height: 100vh;
	background: #ffffff;
	display: flex;
	flex-direction: column;
	padding: 20px 24px 40px;
	position: relative;
	overflow: hidden;
}

/* 返回按钮 */
.back-btn {
	position: absolute;
	top: 20px;
	left: 20px;
	width: 38px;
	height: 38px;
	background: #f5f5f5;
	border: none;
	border-radius: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #333333;
	cursor: pointer;
	transition: all 0.3s ease;
}

.back-btn:hover {
	background: #eeeeee;
	transform: translateX(-2px);
}

/* 顶部标题 */
.header-section {
	text-align: center;
	margin-top: 60px;
	margin-bottom: 40px;
	animation: fadeInDown 0.6s ease-out;
}

.page-title {
	font-size: 32px;
	font-weight: 700;
	color: #333333;
	margin: 0 0 8px 0;
}

.page-subtitle {
	font-size: 16px;
	color: #999999;
	margin: 0;
}

/* 表单区域 */
.form-section {
	flex: 1;
	max-width: 400px;
	width: 100%;
	margin: 0 auto;
	animation: fadeInUp 0.6s ease-out 0.2s both;
}

.form-group {
	margin-bottom: 20px;
}

.form-label {
	display: block;
	font-size: 14px;
	font-weight: 500;
	color: #666666;
	margin-bottom: 8px;
}

.input-wrapper {
	position: relative;
	display: flex;
	align-items: center;
	background: #f5f5f5;
	border: 2px solid transparent;
	border-radius: 12px;
	transition: all 0.3s ease;
}

.input-wrapper:focus-within {
	background: #ffffff;
	border-color: #ff7a45;
	box-shadow: 0 0 0 3px rgba(255, 122, 69, 0.1);
}

.input-icon {
	padding: 0 12px;
	display: flex;
	align-items: center;
	color: #999999;
}

.input-wrapper:focus-within .input-icon {
	color: #ff7a45;
}

.input-wrapper input {
	flex: 1;
	border: none;
	outline: none;
	padding: 14px 12px 14px 0;
	font-size: 16px;
	color: #333333;
	background: transparent;
}

.input-wrapper input::placeholder {
	color: #cccccc;
}

.send-code-btn {
	padding: 8px 16px;
	white-space: nowrap;
	background: #ff7a45;
	color: #ffffff;
	border: none;
	border-radius: 8px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.3s ease;
	margin-right: 8px;
}

.send-code-btn:hover:not(:disabled) {
	background: #ff6b35;
}

.send-code-btn:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.toggle-password {
	padding: 8px 12px;
	background: none;
	border: none;
	cursor: pointer;
	color: #999999;
	display: flex;
	align-items: center;
	transition: color 0.3s ease;
}

.toggle-password:hover {
	color: #ff7a45;
}

/* 提交按钮 */
.submit-btn {
	width: 100%;
	height: 54px;
	background: #ff7a45;
	color: #ffffff;
	border: none;
	border-radius: 27px;
	font-size: 18px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
	box-shadow: 0 4px 12px rgba(255, 122, 69, 0.3);
	margin-top: 8px;
}

.submit-btn:hover:not(:disabled) {
	background: #ff6b35;
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(255, 122, 69, 0.4);
}

.submit-btn:active:not(:disabled) {
	transform: translateY(0);
}

.submit-btn:disabled {
	opacity: 0.6;
	cursor: not-allowed;
	transform: none;
}

/* 切换表单 */
.switch-form {
	text-align: center;
	margin-top: 24px;
	font-size: 14px;
	color: #999999;
}

.link-btn {
	background: none;
	border: none;
	color: #ff7a45;
	font-size: 14px;
	font-weight: 600;
	cursor: pointer;
	padding: 0 4px;
	transition: opacity 0.3s ease;
}

.link-btn:hover {
	opacity: 0.7;
}

/* 底部装饰 */
.bottom-decoration {
	position: absolute;
	bottom: -50px;
	right: -90px;
	width: 200px;
	height: 200px;
	opacity: 0.3;
	filter: blur(30px);
}

.decoration-circle {
	width: 100%;
	height: 100%;
	background: #ff7a45;
	border-radius: 50%;
}

/* 动画 */
@keyframes fadeInDown {
	from {
		opacity: 0;
		transform: translateY(-20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

/* 响应式 */
@media (max-height: 700px) {
	.header-section {
		margin-top: 40px;
		margin-bottom: 30px;
	}

	.page-title {
		font-size: 28px;
	}

	.form-section {
		max-width: 360px;
	}
}

@media (max-width: 375px) {
	.auth-container {
		padding: 20px 20px 30px;
	}

	.form-section {
		max-width: 100%;
	}

	.send-code-btn {
		font-size: 12px;
		padding: 6px 12px;
	}
}
</style>
