<template>
	<div class="welcome-container">
		<div class="bg-decoration bg-decoration-4"></div>
		<!-- 顶部欢迎语 -->
		<div class="header-section">
			<h1 class="greeting">Hi ~</h1>
			<h1 class="welcome-text">欢迎使用阳阳记账</h1>
		</div>

		<!-- 中心插画 -->
		<div class="illustration-section">
			<img src="/images/bg.png" alt="阳阳记账小店" class="main-illustration" />
		</div>

		<!-- 按钮区域 -->
		<div class="actions-section">
			<button class="btn btn-primary" @click="goToLogin">登录</button>
			<!-- <button class="btn btn-secondary" @click="goToRegister">注册</button> -->
		</div>

		<!-- 用户协议 -->
		<div class="agreement-section">
			<label class="checkbox-label">
				<van-checkbox v-model="hasAgreed" checked-color="var(--accent-orange)"></van-checkbox>
				<span>我已阅读并同意</span>
			</label>
			<div class="agreement-links">
				<a href="#" class="link">《用户协议》</a>
				<span>和</span>
				<a href="#" class="link">《隐私政策》</a>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Image as VanImage, Checkbox as VanCheckbox } from 'vant'
import 'vant/lib/image/style'
import 'vant/lib/checkbox/style'
import { message } from '@/utils/message'

const router = useRouter()
const hasAgreed = ref(false)

const goToLogin = () => {
	if (!hasAgreed.value) {
		message.warning('请先勾选用户协议')
		return
	}
	router.push('/login')
}

const goToRegister = () => {
	router.push('/register')
}
</script>

<style scoped>
.welcome-container {
	min-height: 100vh;
	background: #ffffff;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	overflow: hidden;
}

/* 顶部欢迎语 */
.header-section {
	width: 100%;
	text-align: left;
	margin-bottom: 40px;
	padding: 100px 44px 0;
	animation: fadeInDown 0.8s ease-out;
}

.greeting {
	letter-spacing: 2px;
}

.welcome-text {
	font-size: 28px;
}

/* 中心插画 */
.illustration-section {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 100%;
	margin-bottom: 20px;
	animation: fadeInUp 1s ease-out 0.3s both;
}

.main-illustration {
	max-width: 350px;
	max-height: 300px;
	object-fit: contain;
	filter: drop-shadow(0 8px 24px rgba(255, 122, 69, 0.15));
}

/* 按钮区域 */
.actions-section {
	width: 100%;
	max-width: 320px;
	display: flex;
	flex-direction: column;
	gap: 16px;
	margin-bottom: 32px;
	animation: fadeInUp 1s ease-out 0.5s both;
}

.btn {
	width: 100%;
	height: 56px;
	border: none;
	border-radius: 28px;
	font-size: 18px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
	position: relative;
	overflow: hidden;
}

.btn-primary {
	background: #333333;
	color: #ffffff;
	letter-spacing: 2px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-primary:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.btn-primary:active {
	transform: translateY(0);
}

/* .btn-secondary {
	background: #ff7a45;
	color: #ffffff;
	box-shadow: 0 4px 12px rgba(255, 122, 69, 0.3);
}

.btn-secondary:hover {
	background: #ff6b35;
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(255, 122, 69, 0.4);
}

.btn-secondary:active {
	transform: translateY(0);
} */

/* 用户协议 */
.agreement-section {
	text-align: center;
	font-size: 14px;
	color: #999999;
	animation: fadeIn 1s ease-out 0.7s both;
	display: flex;
	margin-bottom: 60px;
}

.checkbox-label {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	cursor: pointer;
	user-select: none;
}

.checkbox-label input[type='checkbox'] {
	width: 18px;
	height: 18px;
	cursor: pointer;
	accent-color: #ff7a45;
}

.checkbox-label span {
	color: #999999;
}

.agreement-links {
	margin-top: 4px;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 4px;
	flex-wrap: wrap;
	font-weight: bold;
}

.link {
	color: #ff7a45;
	text-decoration: none;
	transition: opacity 0.3s ease;
}

.link:hover {
	opacity: 0.7;
	text-decoration: underline;
}

/* 动画 */
@keyframes fadeInDown {
	from {
		opacity: 0;
		transform: translateY(-30px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(30px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

/* 响应式 */
@media (max-height: 700px) {
	.welcome-container {
		padding: 40px 24px 30px;
	}

	.greeting {
		font-size: 36px;
	}

	.welcome-text {
		font-size: 18px;
	}

	.illustration-section {
		margin-bottom: 40px;
	}

	.main-illustration {
		max-width: 500px;
	}

	.btn {
		height: 50px;
		font-size: 16px;
	}
}

@media (max-width: 375px) {
	.greeting {
		font-size: 40px;
	}

	.main-illustration {
		max-height: 320px;
	}
}
</style>
