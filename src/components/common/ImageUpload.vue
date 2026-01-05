<template>
	<div class="image-upload-container">
		<!-- van-uploader 组件 -->
		<van-uploader
			ref="uploaderRef"
			v-model="fileList"
			:after-read="handleImageRead"
			:before-read="beforeImageRead"
			:max-size="maxSize * 1024 * 1024"
			@oversize="handleImageOversize"
			:max-count="1"
			:preview-full-image="true"
			accept=".jpg, .jpeg, .png"
			class="hidden-uploader">
		</van-uploader>

		<!-- 上传按钮 -->
		<div v-if="!modelValue" class="upload-button" @click="triggerUpload">
			<svg viewBox="0 0 24 24">
				<path
					d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z" />
			</svg>
			<span>添加图片</span>
		</div>

		<!-- 删除按钮（当有图片时显示） -->
		<div v-if="modelValue" class="image-preview-wrapper" @click="previewImage">
			<img :src="modelValue" class="preview-img" alt="上传图片" />
			<van-button type="warning" size="small" icon="delete" class="delete-image-btn" @click.stop="handleDeleteImage"> </van-button>
		</div>
	</div>
	<p class="upload-hint">支持 JPG、PNG 格式，最大 {{ maxSize }}MB</p>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Uploader as VanUploader, Button as VanButton } from 'vant'
import 'vant/lib/uploader/style'
import 'vant/lib/button/style'
import { message } from '@/utils/message'

const props = defineProps({
	modelValue: {
		type: String,
		default: ''
	},
	maxSize: {
		type: Number,
		default: 5
	}
})

const emit = defineEmits(['update:modelValue'])

const fileList = ref([])
const uploaderRef = ref(null)

// 监听 modelValue 变化，同步更新 fileList
watch(
	() => props.modelValue,
	newVal => {
		if (newVal && fileList.value.length === 0) {
			fileList.value.push({
				url: newVal,
				isImage: true
			})
		} else if (!newVal && fileList.value.length > 0) {
			fileList.value = []
		}
	},
	{ immediate: true }
)

// 图片上传前校验
const beforeImageRead = file => {
	const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
	if (!allowedTypes.includes(file.type)) {
		message.warning('只支持 JPG、PNG 格式的图片')
		return false
	}
	return true
}

// 图片读取与压缩
const handleImageRead = async file => {
	if (file instanceof Array) file = file[0]

	try {
		const compressedImage = await compressImage(file.file, 800, 0.8)
		emit('update:modelValue', compressedImage)
		fileList.value = [
			{
				url: compressedImage,
				isImage: true
			}
		]
		message.success('图片添加成功')
	} catch (error) {
		message.error('图片处理失败')
		console.error(error)
	}
}

// 图片压缩函数
const compressImage = (file, maxWidth, quality) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = e => {
			const img = new Image()
			img.onload = () => {
				const canvas = document.createElement('canvas')
				let width = img.width
				let height = img.height

				if (width > maxWidth) {
					height = (maxWidth / width) * height
					width = maxWidth
				}

				canvas.width = width
				canvas.height = height
				const ctx = canvas.getContext('2d')
				ctx.drawImage(img, 0, 0, width, height)

				resolve(canvas.toDataURL('image/jpeg', quality))
			}
			img.onerror = reject
			img.src = e.target.result
		}
		reader.onerror = reject
		reader.readAsDataURL(file)
	})
}

// 文件过大处理
const handleImageOversize = () => {
	message.error(`图片大小不能超过 ${props.maxSize}MB`)
}

// 删除图片
const handleDeleteImage = () => {
	emit('update:modelValue', '')
	fileList.value = []
	message.success('图片已删除')
}

// 触发文件选择
const triggerUpload = () => {
	const inputElement = uploaderRef.value?.$el?.querySelector('input[type="file"]')
	if (inputElement) {
		inputElement.click()
	}
}

// 预览图片
const previewImage = () => {
	// vant 的 ImagePreview 会自动处理
	// 这里我们让点击预览图也可以重新上传
	triggerUpload()
}
</script>

<style scoped>
.image-upload-container {
	width: 120px;
	height: 120px;
	position: relative;
}

.hidden-uploader {
	position: absolute;
	width: 0;
	height: 0;
	overflow: hidden;
	opacity: 0;
}

.upload-button {
	width: 100%;
	height: 120px;
	border-radius: 16px;
	border: 2px dashed var(--bg-glass-border);
	background: rgba(0, 0, 0, 0.02);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 8px;
	cursor: pointer;
	transition: all 0.3s ease;
}

.upload-button:hover {
	background: rgba(0, 0, 0, 0.04);
	border-color: var(--accent-orange);
}

.upload-button svg {
	width: 32px;
	height: 32px;
	fill: var(--text-secondary);
}

.upload-button span {
	font-size: 14px;
	color: var(--text-secondary);
}

.image-preview-wrapper {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 2;
	border-radius: 16px;
	overflow: hidden;
	cursor: pointer;
}

.preview-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	border-radius: 16px;
}

.delete-image-btn {
	position: absolute;
	top: 2px;
	right: 2px;
	z-index: 10;
	min-width: 15px;
	border-radius: 15px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.upload-hint {
	font-size: 12px;
	color: var(--text-tertiary);
	margin-top: 8px;
	text-align: center;
}
</style>
