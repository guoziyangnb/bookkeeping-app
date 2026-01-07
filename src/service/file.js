/**
 * 文件相关的接口
 */
import supabase from '.'

// 上传头像(上传文件也走这个接口) —— 反正基本上都是上传图片
const updateFile = async fileData => {
	if (!fileData || !(fileData instanceof File)) {
		return ''
	}
	// 获取文件名
	const file_path = `${Date().now()}-${fileData.name}`.replaceAll('/', '').replaceAll('%', '')
	// 上传文件
	const { data, error } = await supabase.storage.from('products').upload(file_path, fileData)
	// 处理失败
	if (error) {
		throw new Error(error.message)
	}
	if (data.fullPath) {
		return `${supabaseUrl}/storage/v1/object/public/${data.fullPath}`
	}
	return ''
}

// 增
export const createProduct = async createProduct => {
	// 第一步先判断是否有文件，如果有先上传文件得到文件地址
	if (createProduct.pictureFile) {
		const pictureUrl = await updateFile(createProduct.pictureFile)
		createProduct.pictureUrl = pictureUrl
	}
	delete createProduct.pictureFile
	// 第二步将数据插入数据库
	const { data, error } = await supabase.from('products').insert([createProduct]).select().single()
	if (error) {
		throw new Error(error.message)
	}
	return data
}
