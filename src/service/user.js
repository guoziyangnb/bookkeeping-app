/**
 * 用户相关操作的接口
 */
import supabase from '.' // 引入supabase实例

// 账户注册
export const signUp = async ({ email, phone, password, username }) => {
	// 验证：必须提供邮箱或手机号之一
	if (!email && !phone) {
		console.error('❌ email 和 phone 都为空！')
		throw new Error('请提供有效的手机号或邮箱')
	}

	// 构建注册参数
	const signUpData = {
		password,
		options: {
			data: {
				username: username || '',
				avatar: ''
			}
		}
	}

	// 根据提供的凭证添加对应字段
	if (email) {
		signUpData.email = email
	}
	if (phone) {
		signUpData.phone = '+' + phone
	}

	const { data: user, error } = await supabase.auth.signUp(signUpData)

	if (error) {
		console.error('❌ Supabase 注册错误:', error)
		throw new Error(error.message)
	}
	return user
}

// 登录
export const signIn = async data => {
	const { email, phone, password } = data

	// 判断使用手机号还是邮箱登录
	const credentials = {}
	if (phone) {
		credentials.phone = '+' + phone
	} else if (email) {
		credentials.email = email
	} else {
		throw new Error('请提供手机号或邮箱')
	}

	credentials.password = password

	const { data: user, error } = await supabase.auth.signInWithPassword(credentials)
	if (error) throw new Error(error.message)
	return user
}

// 退出登录
export const logout = async () => {
	const { error } = await supabase.auth.signOut()
	if (error) throw new Error(error.message)
}

// 判断用户是否登陆，即拿到用户信息
export const getCurrentUser = async () => {
	const { data: session } = await supabase.auth.getSession()
	if (!session.session) return null

	const { data, error } = await supabase.auth.getUser()
	if (error) throw new Error(error.message)
	return data?.user
}

// 更新用户信息
export const updateUser = async data => {
	// 1. 创建空的更新配置对象
	const updateConfig = {}

	// 2. 处理基础用户信息字段，只添加存在的字段
	if (data.email) updateConfig.email = data.email
	if (data.phone) updateConfig.phone = '+' + data.phone
	if (data.password) updateConfig.password = data.password

	// 3. 处理自定义用户数据（data 字段）
	const userMetadata = {}
	if (data.username) userMetadata.username = data.username
	if (data.avatar) userMetadata.avatar = data.avatar

	// 只有当自定义数据不为空时，才添加到更新配置中
	if (Object.keys(userMetadata).length > 0) {
		updateConfig.data = userMetadata
	}

	// 4. 调用 supabase 更新接口（确保配置对象不为空）
	if (Object.keys(updateConfig).length === 0) {
		throw new Error('没有可更新的用户信息字段')
	}

	const { data: user, error } = await supabase.auth.updateUser(updateConfig)
	if (error) throw new Error(error.message)
	return user
}
