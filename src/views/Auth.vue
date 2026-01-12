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
			<h1 class="page-title">{{ isLogin ? '登录' : '注册' }}</h1>
			<p class="page-subtitle">{{ isLogin ? '欢迎回来！' : '创建您的账户' }}</p>
		</div>

		<!-- 表单 -->
		<div class="form-section">
			<form @submit.prevent="handleSubmit">
				<!-- 注册时显示用户名 -->
				<div v-if="!isLogin" class="form-group">
					<label class="form-label">用户名</label>
					<div class="input-wrapper">
						<span class="input-icon">
							<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round" />
								<circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" />
							</svg>
						</span>
						<input v-model="formData.username" type="text" placeholder="请输入用户名" required />
					</div>
				</div>

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

				<!-- 密码 -->
				<div class="form-group">
					<label class="form-label">密码</label>
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
						<input v-model="formData.password" :type="showPassword ? 'text' : 'password'" placeholder="请输入密码" required />
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

				<!-- 登录时的额外选项 -->
				<div v-if="isLogin" class="form-options">
					<a href="#" class="forgot-link">忘记密码？</a>
				</div>

				<!-- 提交按钮 -->
				<button type="submit" class="submit-btn" :disabled="isLoading">
					{{ isLoading ? '处理中...' : isLogin ? '登录' : '注册' }}
				</button>

				<!-- 切换登录/注册 -->
				<div class="switch-form">
					<span>{{ isLogin ? '还没有账号？' : '已有账号？' }}</span>
					<button type="button" class="link-btn" @click="toggleMode">
						{{ isLogin ? '立即注册' : '立即登录' }}
					</button>
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
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { message } from '@/utils/message'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 判断是登录还是注册
const isLogin = computed(() => route.path === '/login')

// 表单数据
const formData = reactive({
	username: '',
	account: '', // 账号（可以是邮箱或手机号）
	password: ''
})

// UI状态
const showPassword = ref(false)
const isLoading = ref(false)

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

// 切换登录/注册模式
const toggleMode = () => {
	resetFormData()
	if (isLogin.value) {
		router.push('/register')
	} else {
		router.push('/login')
	}
}

// 处理表单提交
const handleSubmit = async () => {
	// 验证账号格式
	if (!validateAccount()) {
		return
	}

	isLoading.value = true
	try {
		if (isLogin.value) {
			// 登录逻辑
			const userInfo = await userStore.login({
				account: formData.account,
				password: formData.password
			})
			if (userInfo?.session?.access_token) {
				router.push('/')
				message.success('登录成功')
			} else {
				message.error('登录失败，请检查账号和密码是否正确', 6000)
			}
		} else {
			// 注册逻辑
			const userInfo = await userStore.register({
				username: formData.username,
				account: formData.account,
				password: formData.password
			})
			resetFormData()
			if (userInfo?.user?.id) {
				router.push('/login')
				if (accountType.value === 'phone') {
					message.success('注册成功，请查收短信验证码进行验证！', 6000)
				} else {
					message.success('注册成功，你会收到一封邮件，请先点击邮件中的链接进行验证才能登录！', 6000)
				}
			} else {
				message.error('注册失败，请重试')
			}
		}
	} catch (error) {
		console.error('认证失败:', error)
		message.error(error.message || '登录注册操作失败，请重试')
	} finally {
		isLoading.value = false
	}
}

// 定义重置表单的函数
const resetFormData = () => {
	formData.username = ''
	formData.account = ''
	formData.password = ''
}

// 返回
const goBack = () => {
	router.push('/welcome')
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

/* 表单选项 */
.form-options {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	margin-bottom: 24px;
	font-size: 14px;
}

.forgot-link {
	color: #ff7a45;
	text-decoration: none;
	font-size: 14px;
	transition: opacity 0.3s ease;
}

.forgot-link:hover {
	opacity: 0.7;
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
}
</style>
