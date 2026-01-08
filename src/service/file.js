/**
 * 文件相关的接口
 */
import supabase from '.'
import { supabaseUrl } from './index'
import { useUserStore } from '@/stores/user'

// 上传头像(上传文件也走这个接口) —— 反正基本上都是上传图片
/**
 * 上传文件到Supabase存储的异步函数
 * @param {File} fileData - 需要上传的文件对象
 * @returns {string} 返回文件的签名URL路径，如果上传失败则返回空字符串
 */
export const uploadFile = async fileData => {
	const userStore = useUserStore()
	if (!userStore.userId) {
		throw new Error('用户未登录，无法上传文件')
	}

	// 检查参数有效性，如果fileData不存在或不是File实例，则返回空字符串
	if (!fileData || !(fileData instanceof File)) {
		return ''
	}

	// 获取用户ID作为存储文件夹的名称
	const folder = userStore.userId // 用户所在的文件夹 == 用户id
	const rawName = fileData.name // 获取原始文件名，eg：上传的文件名时123.png,那么rawName就是123.png
	// 获取文件名（不带扩展名），如果没有扩展名则使用原始文件名
	const fileName = rawName.split(/[/\\]/).pop() ?? rawName

	// 构建文件路径，移除所有斜杠和百分号字符
	const file_path = `${folder}/${Date.now()}_${fileName}`
	const { data, error } = await supabase.storage.from('gzynb').upload(file_path, fileData, {
		cacheControl: '3600', // 缓存多少秒
		upsert: false // 覆盖同名文件
	})

	// 处理失败
	if (error) {
		console.error('文件上传失败：', error)
		throw new Error(error.message)
	}
	if (!data) {
		throw new Error('文件上传成功，但未返回文件路径')
	}

	const fileUrl = `${supabaseUrl}/storage/v1/object/public/${data.fullPath}`
	return fileUrl
}

// 增
/**
 * 创建产品函数
 * @param {Object} createProduct - 包含产品信息的对象
 * @returns {Promise} 返回插入数据库的产品数据
 */
export const createProduct = async createProduct => {
	// 第一步先判断是否有文件，如果有先上传文件得到文件地址
	if (createProduct.pictureFile) {
		// 调用updateFile函数上传文件并获取文件URL
		const pictureUrl = await updateFile(createProduct.pictureFile)
		// 将获取到的图片URL添加到产品对象中
		createProduct.pictureUrl = pictureUrl
	}
	// 删除不需要保存到数据库的pictureFile属性
	delete createProduct.pictureFile
	// 第二步将数据插入数据库
	const { data, error } = await supabase.from('products').insert([createProduct]).select().single()
	// 如果插入数据时发生错误，抛出错误信息
	if (error) {
		throw new Error(error.message)
	}
	// 返回插入的产品数据
	return data
}
