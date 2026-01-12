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
		console.log('✅ 添加 email:', email)
	}
	if (phone) {
		signUpData.phone = '+' + phone
		console.log('✅ 添加 phone:', '+' + phone)
	}

	console.log('🚀 准备发送给 Supabase 的数据:', JSON.stringify(signUpData, null, 2))

	const { data: user, error } = await supabase.auth.signUp(signUpData)

	console.log('🚀 Supabase 返回结果:', { user, error })

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
	const { username, avatar, phone, email, password } = data
	const { data: user, error } = await supabase.auth.updateUser({
		email: email,
		phone: '+' + phone,
		password: password,
		data: {
			username: username,
			avatar: avatar
		}
	})
	if (error) throw new Error(error.message)
	return user
}
