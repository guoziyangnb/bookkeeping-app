/**
 * 用户相关操作的接口
 */
import supabase from '.' // 引入supabase实例

// 账户注册
export const signUp = async ({ email, phone, password, username }) => {
	const { data: user, error } = await supabase.auth.signUp({
		email,
		phone,
		password,
		options: {
			data: {
				username: username || '',
				avatar: '',
				phone: ''
			}
		}
	})
	if (error) throw new Error(error.message)
	return user
}

// 登录
export const signIn = async data => {
	const { email, phone, password } = data

	// 判断使用手机号还是邮箱登录
	const credentials = {}
	if (phone) {
		credentials.phone = phone
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
		password: password,
		data: {
			username: username,
			avatar: avatar,
			phone: phone
		}
	})
	if (error) throw new Error(error.message)
	return user
}
