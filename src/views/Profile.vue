<template>
	<div class="profile-page">
		<!-- 返回导航栏 -->
		<div class="profile-nav">
			<button class="nav-back-btn" @click="goBack">
				<svg viewBox="0 0 24 24">
					<path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
				</svg>
			</button>
			<h1 class="profile-title">个人资料</h1>
			<div class="nav-spacer"></div>
		</div>

		<div class="profile-container">
			<!-- 头像上传区域 -->
			<div class="avatar-section">
				<div class="avatar-wrapper">
					<div class="avatar-glow"></div>
					<van-uploader
						v-model="fileList"
						:after-read="afterRead"
						:before-read="beforeRead"
						:max-size="5 * 1024 * 1024"
						@oversize="onOversize"
						class="avatar-uploader"
						:max-count="1"
						:preview-full-image="false"
						:show-upload="false"
						accept=".jpg, .jpeg, .png">
						<div class="avatar-circle" :class="{ 'has-image': avatarUrl }">
							<img v-if="avatarUrl" :src="avatarUrl" class="avatar-image" alt="头像" />
							<div v-else class="avatar-placeholder">
								<svg class="avatar-icon" viewBox="0 0 24 24">
									<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
								</svg>
							</div>
							<div class="avatar-edit-overlay">
								<svg viewBox="0 0 24 24">
									<path
										d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
								</svg>
								<span>更换头像</span>
							</div>
						</div>
					</van-uploader>
				</div>
				<p class="avatar-hint">点击上传头像，支持 JPG、PNG 格式，最大 5MB</p>
			</div>

			<!-- 表单区域 -->
			<div class="form-section">
				<!-- 用户名 -->
				<div class="form-card clickable first-card" @click="goToEdit('username')">
					<svg class="form-icon" viewBox="0 0 24 24">
						<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
					</svg>
					<span class="form-label-text">用户名</span>
					<span class="form-value">{{ formData.username || '未设置' }}</span>
					<div class="arrow-icon">›</div>
				</div>

				<!-- 邮箱 -->
				<div class="form-card clickable" @click="goToEdit('email')">
					<svg class="form-icon" viewBox="0 0 24 24">
						<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
					</svg>
					<span class="form-label-text">邮箱</span>
					<span class="form-value">{{ formData.email || '未设置' }}</span>
					<div class="arrow-icon">›</div>
				</div>

				<!-- 手机号码 -->
				<div class="form-card clickable last-card" @click="goToEdit('phone')">
					<svg class="form-icon" viewBox="0 0 24 24">
						<path
							d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
					</svg>
					<span class="form-label-text">手机号码</span>
					<span class="form-value">{{ formData.phone || '未设置' }}</span>
					<div class="arrow-icon">›</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Uploader as VanUploader } from 'vant'
import 'vant/lib/uploader/style'
import { message } from '@/utils/message'

const router = useRouter()

// 文件列表
const fileList = ref([])

// 头像URL
const avatarUrl = ref('')

// 表单数据
const formData = reactive({
	username: '',
	email: '',
	phone: ''
})

// 返回上一页
const goBack = () => {
	router.back()
}

// 跳转到编辑页面
const goToEdit = field => {
	router.push({
		path: '/settings/edit-field',
		query: { field }
	})
}

// 文件上传前的校验
const beforeRead = file => {
	// 校验文件类型
	const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
	if (!allowedTypes.includes(file.type)) {
		message.warning('只支持 JPG、PNG 格式的图片')
		return false
	}
	return true
}

// 文件上传回调
const afterRead = file => {
	// 这里应该上传到服务器
	// 暂时使用本地预览
	if (file instanceof Array) {
		file = file[0]
	}

	// 更新头像URL
	avatarUrl.value = file.content

	// 保存到 localStorage
	const savedProfile = localStorage.getItem('userProfile')
	const profile = savedProfile ? JSON.parse(savedProfile) : {}
	profile.avatar = file.content
	console.log('🚀 ~ afterRead ~ profile.avatar:', profile.avatar)
	localStorage.setItem('userProfile', JSON.stringify(profile))

	// 清空文件列表，允许重复上传，避免直接显示预览图bug（不想显示预览图，fileList必须为空）
	fileList.value = []

	message.success('头像上传成功！')
}

// 文件过大
const onOversize = () => {
	message.error('图片大小不能超过 5MB')
}

// 加载用户数据
const loadUserProfile = () => {
	const savedProfile = localStorage.getItem('userProfile')
	if (savedProfile) {
		const profile = JSON.parse(savedProfile)
		avatarUrl.value = profile.avatar || ''
		formData.username = profile?.username || ''
		formData.email = profile?.email || ''
		formData.phone = profile?.phone || ''
	}
}

// 初始化时加载数据
onMounted(() => {
	loadUserProfile()
})
</script>

<style scoped>
/* ==================== 页面布局 ==================== */
.profile-page {
	min-height: 100vh;
	background: var(--bg-primary);
	position: relative;
	padding-bottom: 20px;
}

/* 导航栏 */
.profile-nav {
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

.nav-back-btn:hover {
	background: var(--bg-glass-hover);
	transform: translateX(-2px);
}

.nav-back-btn svg {
	width: 20px;
	height: 20px;
	fill: var(--text-primary);
}

.profile-title {
	font-size: 18px;
	font-weight: 600;
	color: var(--text-primary);
}

.nav-spacer {
	width: 40px;
}

/* 主容器 */
.profile-container {
	max-width: 600px;
	margin: 0 auto;
	padding: 0 20px;
}

/* ==================== 头像区域 ==================== */
.avatar-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40px 0;
	position: relative;
}

.avatar-wrapper {
	position: relative;
	margin-bottom: 16px;
}

.avatar-glow {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 140px;
	height: 140px;
	background: var(--accent-orange);
	border-radius: var(--radius-full);
	filter: blur(40px);
	opacity: 0.3;
	animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
	0%,
	100% {
		opacity: 0.3;
		transform: translate(-50%, -50%) scale(1);
	}
	50% {
		opacity: 0.4;
		transform: translate(-50%, -50%) scale(1.05);
	}
}

.avatar-uploader {
	display: block;
}

/* 隐藏 Vant Uploader 的默认预览 */
.avatar-uploader :deep(.van-uploader__preview) {
	display: none !important;
}

.avatar-uploader :deep(.van-uploader__preview-image) {
	display: none !important;
}

.avatar-circle {
	width: 120px;
	height: 120px;
	border-radius: var(--radius-full);
	background: var(--bg-glass);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border: 3px solid var(--bg-glass-border);
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
	position: relative;
	overflow: hidden;
	cursor: pointer;
	transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.avatar-circle:hover {
	transform: scale(1.05);
	border-color: var(--accent-orange);
	box-shadow: 0 12px 40px rgba(255, 138, 91, 0.3);
}

.avatar-circle.has-image {
	border-color: var(--accent-orange);
}

.avatar-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.avatar-placeholder {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, rgba(255, 138, 91, 0.1), rgba(255, 176, 135, 0.1));
}

.avatar-icon {
	width: 48px;
	height: 48px;
	fill: var(--text-secondary);
	opacity: 0.5;
}

.avatar-edit-overlay {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 40px;
	background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	opacity: 0;
	transition: opacity 0.3s ease;
}

.avatar-circle:hover .avatar-edit-overlay {
	opacity: 1;
}

.avatar-edit-overlay svg {
	width: 16px;
	height: 16px;
	fill: white;
}

.avatar-edit-overlay span {
	font-size: 10px;
	color: white;
	margin-top: 2px;
	font-weight: 500;
}

.avatar-hint {
	font-size: 13px;
	color: var(--text-secondary);
	text-align: center;
}

/* ==================== 表单区域 ==================== */
.form-section {
	margin-bottom: 32px;
	display: flex;
	flex-direction: column;
}

.form-card {
	background: var(--bg-glass-border);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	/* border-bottom: 0.5px solid var(--van-gray-5); */
	border-radius: 0;
	padding: 16px 20px;
	display: flex;
	align-items: center;
	gap: 12px;
	transition: all 0.3s ease;
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
	position: relative;
}

.form-card::after {
	content: '';
	position: absolute;
	bottom: 0;
	right: 0;
	width: calc(100% - 44px);
	border-bottom: 0.5px solid var(--van-gray-5);
}

.form-card:last-child::after {
	border-bottom: none;
}

.form-card.clickable {
	cursor: pointer;
	overflow: hidden;
}

.form-card.clickable:active {
	background: var(--bg-glass-hover);
}

.form-card.clickable:hover {
	background: var(--bg-glass-hover);
}

/* 第一个卡片：顶部圆角 */
.form-card.first-card {
	border-top-left-radius: var(--radius-md);
	border-top-right-radius: var(--radius-md);
}

/* 最后一个卡片：底部圆角 */
.form-card.last-card {
	border-bottom-left-radius: var(--radius-md);
	border-bottom-right-radius: var(--radius-md);
}

/* 图标 */
.form-icon {
	width: 20px;
	height: 20px;
	fill: var(--accent-orange);
	flex-shrink: 0;
}

/* 标签文本 */
.form-label-text {
	font-size: 15px;
	font-weight: 600;
	color: var(--text-primary);
	min-width: 80px;
	flex-shrink: 0;
}

/* 值 */
.form-value {
	font-size: 15px;
	font-weight: 500;
	color: var(--text-secondary);
	flex: 1;
	text-align: right;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

/* 箭头图标 */
.arrow-icon {
	font-size: 24px;
	color: var(--text-tertiary);
	font-weight: 300;
	transition: transform 0.3s ease;
	flex-shrink: 0;
	margin-left: 4px;
}

.form-card.clickable:hover .arrow-icon {
	transform: translateX(4px);
}

/* ==================== 响应式设计 ==================== */
@media (max-width: 480px) {
	.avatar-circle {
		width: 100px;
		height: 100px;
	}

	.avatar-glow {
		width: 120px;
		height: 120px;
	}

	.form-card {
		padding: 10px 16px;
	}

	.form-icon {
		width: 18px;
		height: 18px;
	}

	.form-label-text {
		font-size: 14px;
		min-width: 70px;
	}

	.form-value {
		font-size: 14px;
	}
}
</style>
