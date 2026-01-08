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
				</div>
				<p class="avatar-hint">点击上传头像，支持 JPG、PNG 格式，最大 5MB</p>
			</div>

			<!-- 表单区域 -->
			<FormSection :items="formItems" title="个人资料设置" @click="goToEdit" />
		</div>
	</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Uploader as VanUploader, Loading as VanLoading } from 'vant'
import 'vant/lib/uploader/style'
import 'vant/lib/loading/style'
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
		console.log('🚀 ~ afterRead ~ error:', error)
		message.error(`头像上传失败：${error.message}`)
	}
}

// 文件过大
const onOversize = () => {
	message.error('图片大小不能超过 5MB')
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

// 加载用户数据
const loadUserProfile = () => {
	/**
	 * ? 本地舍弃，改成云
	 */
	// let savedProfile = getStorage('userProfile', {})
	fileList.value = userStore.userAvatar ? [{ url: userStore.userAvatar }] : []
	avatarUrl.value = userStore.userAvatar
	formData.username = userStore.userName
	formData.email = userStore.userEmail
	formData.phone = userStore.userPhone
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
