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
				avatar: ''
			}
		}
	})
	if (error) throw new Error(error.message)
	return user
}

// 登录
export const signIn = async data => {
	const { email, password } = data
	const { data: user, error } = await supabase.auth.signInWithPassword({
		email,
		password
	})
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
