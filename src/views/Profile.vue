<template>
	<div class="profile-page">
		<!-- 返回导航栏 -->
		<BackNavBar title="个人资料" />

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
						accept="image/*">
						<template #default>
							<div class="my-upload">
								<svg class="avatar-icon" viewBox="0 0 24 24">
									<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
								</svg>
								<div>点击上传</div>
							</div>
						</template>
					</van-uploader>
					<!-- 自定义删除按钮 -->
					<div v-if="fileList.length > 0" class="custom-delete-btn" @click="handleDeleteAvatar">
						<svg viewBox="0 0 24 24">
							<path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
						</svg>
					</div>
				</div>
				<p class="avatar-hint">点击上传头像，支持 JPG、PNG 格式，最大 5MB</p>
			</div>

			<!-- 个人资料表单区域 -->
			<FormSection :items="formItems" title="个人资料设置" @click="goToEdit" />

			<!-- 退出/登录区域 -->
			<FormSection v-if="userStore.userId" :items="logoutItems" title="退出登录" @click="handleLogout" />
			<FormSection v-else :items="loginItems" title="登录" @click="handleLogin" />
		</div>
	</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Uploader as VanUploader, showConfirmDialog, showLoadingToast, showSuccessToast, showFailToast } from 'vant'
import 'vant/lib/uploader/style'
import 'vant/lib/loading/style'
import 'vant/lib/dialog/style'
import 'vant/lib/toast/style'
import { message } from '@/utils/message'
import { useUserStore } from '@/stores/user'
import FormSection from '@/components/common/FormSection.vue'
import BackNavBar from '@/components/common/BackNavBar.vue'
import { uploadFile } from '@/service/file'
import Compressor from 'compressorjs'

const router = useRouter()
const userStore = useUserStore()

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

// 表单项配置
const formItems = computed(() => [
	{
		icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
		label: '用户名',
		value: formData.username,
		field: 'username'
	},
	{
		icon: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
		label: '邮箱',
		value: formData.email,
		field: 'email'
	},
	{
		icon: 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z',
		label: '手机号码',
		value: formData.phone,
		field: 'phone'
	}
])

// 退出/登录配置
const logoutItems = computed(() => [
	{
		icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z',
		label: '退出登录',
		field: 'logout'
	}
])
const loginItems = computed(() => [
	{
		icon: 'M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z',
		label: '登录',
		field: 'login'
	}
])

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
	// image/*
	// if (!file.type || !file.type.startsWith('image/')) {
	// 	message.warning('只支持图片格式的文件')
	// 	return false
	// }
	// return true
}

// 文件上传回调
const afterRead = async file => {
	// 如果是数组，取第一个文件
	if (file instanceof Array) {
		file = file[0]
	}
	file.status = 'uploading' // file.status 需要配合预览功能才能显示

	try {
		// 1.压缩图片
		const compressedFile = await compressImage(file.file)
		if (!compressedFile) {
			message.error('图片压缩失败')
			file.status = 'failed'
			throw new Error('图片压缩失败，未生成有效文件')
		}

		// 2.上传压缩后的文件
		const result = await uploadFile(compressedFile)
		avatarUrl.value = result

		// 3.更新 store 中的头像（不等待，避免阻塞）
		const avatarResult = await userStore.updateAvatar({ avatar: avatarUrl.value })
		message.success('头像上传成功！')
		file.status = 'success'
		file.data = result
		// fileList.value = []
	} catch (error) {
		file.status = 'failed'
		fileList.value = []
		console.log('🚀 ~ afterRead ~ error:', error)
		message.error(`头像上传失败：${error.message}`)
	}
}

// 文件过大
const onOversize = () => {
	message.error('图片大小不能超过 5MB')
}

// 删除头像
const handleDeleteAvatar = async () => {
	try {
		const result = await showConfirmDialog({
			title: '删除头像',
			message: '确定要删除头像吗？',
			confirmButtonColor: '#ff8a5b',
			cancelButtonColor: '#8a8a8a'
		})
		if (result) {
			// 清空本地文件列表
			fileList.value = []
			avatarUrl.value = ''
			const loadingToast = showLoadingToast({
				message: '删除中...',
				forbidClick: true
			})

			try {
				// 2. 执行删除头像的异步操作
				await userStore.updateAvatar({ avatar: '' })
				// 3. 关闭加载提示
				loadingToast.close()
				// 4. 显示成功提示
				showSuccessToast('头像删除成功')
			} catch (updateError) {
				// 5. 操作失败时关闭加载提示并显示错误
				loadingToast.close()
				console.error('删除头像失败:', updateError)
				showFailToast('删除头像失败')
			}
		}
	} catch (error) {
		// 用户取消操作不显示错误提示
		if (error !== 'cancel') {
			console.error('删除头像失败:', error)
			showFailToast('删除头像失败')
		}
	}
}

// 压缩图片并将图片修正
const compressImage = async file => {
	if (!file) {
		return
	}
	return new Promise((reslove, reject) => {
		// compressorjs 默认开启 checkOrientation 选项
		// 会将图片修正为正确方向
		new Compressor(file, {
			quality: 0.6, // 设置压缩质量，范围从 0 到 1，默认0.8
			maxWidth: 800,
			maxHeight: 800,
			convertSize: 1000000, // 超过1MB的图片才转换格式
			checkOrientation: true, // 启用 EXIF 方向修正
			success(result) {
				const compressedImage = new File([result], result.name, { type: result.type })
				reslove(compressedImage)
			},
			error(err) {
				reject(new Error(`图片压缩失败: ${err.message}`))
			}
		})
	})
}

// 退出登录
const handleLogout = async () => {
	try {
		const result = await showConfirmDialog({
			title: '退出登录',
			message: '确定要退出登录吗？',
			confirmButtonColor: '#ff8a5b',
			cancelButtonColor: '#8a8a8a'
		})
		if (result) {
			// 清空本地文件列表
			fileList.value = []
			avatarUrl.value = ''
			const loadingToast = showLoadingToast({
				message: '退出中...',
				forbidClick: true
			})

			try {
				// 2. 执行退出登录的异步操作
				await userStore.logout()
				// 3. 关闭加载提示
				loadingToast.close()
				// 4. 显示成功提示
				showSuccessToast('退出登录成功')
			} catch (updateError) {
				// 5. 操作失败时关闭加载提示并显示错误
				loadingToast.close()
				console.error('退出登录失败:', updateError)
				showFailToast('退出登录失败')
			}
		}
	} catch (error) {
		// 用户取消操作不显示错误提示
		if (error !== 'cancel') {
			console.error('退出登录失败:', error)
			showFailToast('退出登录失败')
		}
	}
}

// 登录
const handleLogin = async () => {
	try {
		const result = await showConfirmDialog({
			title: '登录',
			message: '确定要去登录吗？',
			confirmButtonColor: '#ff8a5b',
			cancelButtonColor: '#8a8a8a'
		})
		if (result) {
			router.push('/welcome')
		}
	} catch (error) {}
}

// 加载用户数据
const loadUserProfile = () => {
	/**
	 * ? 本地舍弃，改成云
	 */
	// let savedProfile = getStorage('userProfile', {})
	// 只有用户登陆了才加载用户数据
	if (userStore.userId) {
		fileList.value = userStore.userAvatar ? [{ url: userStore.userAvatar }] : []
		avatarUrl.value = userStore.userAvatar
		formData.username = userStore.userName
		formData.email = userStore.userEmail
		formData.phone = userStore.userPhone
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
	display: inline-block;
}

/* 自定义删除按钮 */
.custom-delete-btn {
	position: absolute;
	bottom: 5px;
	right: 5px;
	width: 36px;
	height: 36px;
	background: var(--accent-orange);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	z-index: 10;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	transition: all 0.3s ease;
	border: 2px solid var(--bg-glass);
}

.custom-delete-btn:hover {
	transform: scale(1.1);
	box-shadow: 0 4px 12px rgba(255, 138, 91, 0.4);
}

.custom-delete-btn:active {
	transform: scale(0.95);
}

.custom-delete-btn svg {
	width: 20px;
	height: 20px;
	fill: #fff;
}

.avatar-glow {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 200px;
	height: 200px;
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
		opacity: 0.9;
		transform: translate(-50%, -50%) scale(2);
	}
}

.avatar-uploader {
	display: block;
}

.my-upload {
	width: 160px;
	height: 160px;
	border-radius: 50%;
	border: 3px solid var(--accent-orange);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background: var(--bg-glass);
	cursor: pointer;
	transition: all 0.3s ease;
	position: relative;
	overflow: hidden;
}

.my-upload:hover {
	border-color: var(--accent-orange);
	transform: scale(1.05);
	box-shadow: 0 8px 24px rgba(255, 138, 91, 0.3);
}

.my-upload svg {
	width: 48px;
	height: 48px;
	fill: var(--accent-orange);
	opacity: 0.6;
}

.my-upload div {
	font-size: 14px;
	color: var(--accent-orange);
	margin-top: 8px;
	font-weight: 500;
}

/* 覆盖 vant uploader 的预览图样式 */
.avatar-uploader :deep(.van-uploader__preview-image) {
	width: 160px;
	height: 160px;
	border-radius: 50%;
	border: 3px solid var(--accent-orange);
	object-fit: cover;
}

.avatar-uploader :deep(.van-uploader__preview) {
	margin: 0;
	border-radius: 50%;
	overflow: hidden;
}

.avatar-uploader :deep(.van-uploader__mask) {
	border-radius: 50%;
}

/* 隐藏 vant 自带的删除按钮 */
.avatar-uploader :deep(.van-uploader__preview-delete) {
	display: none;
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

.avatar-hint {
	font-size: 13px;
	color: var(--text-secondary);
	text-align: center;
}

/* ==================== 响应式设计 ==================== */
@media (max-width: 480px) {
	.avatar-glow {
		width: 120px;
		height: 120px;
	}
}
</style>
