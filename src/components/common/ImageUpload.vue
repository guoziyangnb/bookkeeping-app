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
			accept="image/*"
			class="hidden-uploader">
			<template #default>
				<!-- 上传按钮 -->
				<div class="upload-button">
					<svg viewBox="0 0 24 24">
						<path
							d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z" />
					</svg>
					<span>添加图片</span>
				</div>
			</template>
		</van-uploader>

		<!-- 删除按钮（当有图片时显示） -->
		<div v-if="modelValue" class="image-preview-wrapper">
			<van-button type="warning" size="small" icon="delete" class="delete-image-btn" @click.stop="handleDeleteImage"> </van-button>
		</div>
	</div>
	<p class="upload-hint">支持 JPG、PNG 格式，最大 {{ maxSize }}MB</p>
</template>

<script setup>
import { ref } from 'vue'
import { Uploader as VanUploader, Button as VanButton, showLoadingToast, showSuccessToast, showFailToast } from 'vant'
import 'vant/lib/uploader/style'
import 'vant/lib/button/style'
import 'vant/lib/toast/style'
import { message } from '@/utils/message'
import { uploadFile, deleteFile } from '@/service/file'
import Compressor from 'compressorjs'

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

const fileList = ref(props.modelValue ? [{ url: props.modelValue, isImage: true }] : [])
const uploaderRef = ref(null)

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
	file.status = 'uploading'
	try {
		const compressedImage = await compressImage(file.file, 800, 0.6)
		if (!compressedImage) {
			message.error('图片压缩失败')
			file.status = 'failed'
			throw new Error('图片压缩失败，未生成有效文件')
		}
		const result = await uploadFile(compressedImage)
		emit('update:modelValue', result)
		file.status = 'success'
		file.data = result
		fileList.value = [
			{
				url: result,
				isImage: true
			}
		]
		message.success('图片添加成功')
	} catch (error) {
		file.status = 'failed'
		fileList.value = []
		console.error('图片上传失败:', error)
		message.error(`图片上传失败：${error.message}`)
	}
}

// 图片压缩函数
const compressImage = (file, maxWidth, quality) => {
	if (!file) {
		return
	}
	return new Promise((reslove, reject) => {
		// compressorjs 默认开启 checkOrientation 选项
		// 会将图片修正为正确方向
		new Compressor(file, {
			quality: quality, // 设置压缩质量，范围从 0 到 1，默认0.8
			maxWidth: maxWidth,
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

// 文件过大处理
const handleImageOversize = () => {
	message.error(`图片大小不能超过 ${props.maxSize}MB`)
}

// 删除图片
const handleDeleteImage = async () => {
	const loadingToast = showLoadingToast({
		message: '删除中...',
		forbidClick: true
	})

	try {
		// 2. 执行删除图片的异步操作
		await deleteFile(fileList.value[0]['url'])
		emit('update:modelValue', '')
		fileList.value = []
		// 3. 关闭加载提示
		loadingToast.close()
		// 4. 显示成功提示
		showSuccessToast('图片已删除')
	} catch (updateError) {
		// 5. 操作失败时关闭加载提示并显示错误
		loadingToast.close()
		console.error('删除图片失败:', updateError)
		showFailToast('删除图片失败')
	}
}
</script>

<style scoped>
.image-upload-container {
	width: 120px;
	height: 120px;
	position: relative;
}

.hidden-uploader {
	width: 100%;
	height: 100%;
}

.van-uploader :deep(.van-uploader__input-wrapper) {
	width: 100%;
	height: 100%;
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

/* 通过父容器触发 hover，因为 van-uploader 的 input 元素会覆盖 */
.hidden-uploader:hover .upload-button {
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

/* 覆盖 vant uploader 的预览图样式 */
.hidden-uploader :deep(.van-uploader__preview-image) {
	width: 120px;
	height: 120px;
	border-radius: 16px;
	border: 2px solid var(--accent-orange);
	object-fit: cover;
}

.hidden-uploader :deep(.van-uploader__preview) {
	margin: 0;
	border-radius: 16px;
	overflow: hidden;
}

.hidden-uploader :deep(.van-uploader__mask) {
	border-radius: 16px;
}

/* 隐藏 vant 自带的删除按钮 */
.hidden-uploader :deep(.van-uploader__preview-delete) {
	display: none;
}

.image-preview-wrapper {
	position: absolute;
	top: 0;
	right: 0;
	width: 36px;
	height: 36px;
	z-index: 2;
	border-radius: 16px;
	overflow: hidden;
	cursor: pointer;
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
