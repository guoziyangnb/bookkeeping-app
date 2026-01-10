import { defineStore } from 'pinia'
import { getStorage, setStorage, removeStorage } from '@/utils/storage'
import router from '@/router'
import { signUp, signIn, logout, getCurrentUser, updateUser } from '@/service/user'

export const useUserStore = defineStore('user', {
	state: () => {
		// 在初始化时从 localStorage 加载用户数据
		const savedUser = getStorage('userProfile', null)

		return {
			userProfile: savedUser,
			isAuthenticated: !!savedUser
		}
	},

	getters: {
		// 获取当前用户信息
		userInfo: state => state.userProfile,

		// 检查是否已登录
		isLoggedIn: state => state.isAuthenticated,

		// 获取用户头像
		userAvatar: state => state.userProfile?.user?.user_metadata?.avatar?.avatar || '',

		// 获取用户名
		userName: state => state.userProfile?.user?.user_metadata?.username || state.userProfile?.user?.email?.split('@')[0] || '',

		// 获取用户ID
		userId: state => state.userProfile?.user?.id || '',

		// 获取用户邮箱
		userEmail: state => state.userProfile?.user?.user_metadata?.email || '',

		// 获取用户电话
		userPhone: state => state.userProfile?.user?.user_metadata?.phone || ''
	},

	actions: {
		// 初始化：检查用户登录状态
		async initializeAuth() {
			try {
				// 先检查本地是否有用户信息
				if (this.userProfile) {
					this.isAuthenticated = true
					return this.userProfile
				}

				// 尝试从supabase获取当前用户
				const user = await getCurrentUser()
				if (user) {
					this.userProfile = user
					this.isAuthenticated = true
					setStorage('userProfile', user)
				}
				return user
			} catch (error) {
				console.error('初始化认证状态失败:', error)
				return null
			}
		},

		// 注册
		async register({ username, email, password }) {
			try {
				// 调用supabase注册接口，并传递username
				const user = await signUp({ email, password, username })

				// 存储用户元数据（包含username）
				if (user) {
					this.userProfile = user
					// this.isAuthenticated = true
					// setStorage('userProfile', user)
				}

				return user
			} catch (error) {
				console.error('注册失败:', error)
				throw error
			}
		},

		// 登录
		async login({ email, password }) {
			try {
				// 调用supabase登录接口
				const user = await signIn({ email, password })

				// 设置当前用户
				this.userProfile = user
				this.isAuthenticated = true
				setStorage('userProfile', user)

				return user
			} catch (error) {
				console.error('登录失败:', error)
				throw error
			}
		},

		// 登出
		async logout() {
			try {
				// 调用supabase登出接口
				await logout()
			} catch (error) {
				console.error('退出登录失败:', error)
			} finally {
				// 清除本地状态
				this.userProfile = null
				this.isAuthenticated = false
				removeStorage('userProfile')
				router.push('/welcome')
			}
		},

		// 更新用户信息（Supabase需要通过updateUser方法更新user_metadata）
		async updateProfile(data) {
			if (!this.userProfile) {
				throw new Error('未登录')
			}

			try {
				// 调用supabase更新用户信息接口
				const user = await updateUser({ ...data })
				if (user) {
					this.userProfile = user
					this.isAuthenticated = true
				}

				// 保存到localStorage
				setStorage('userProfile', user)

				return user
			} catch (error) {
				console.error('更新用户信息失败:', error)
				throw error
			}
		},

		// 更新头像
		async updateAvatar(avatarUrl) {
			await this.updateProfile({ avatar: avatarUrl })
		},

		// 修改密码（需要通过supabase的updateUser方法）
		async changePassword(newPassword) {
			if (!this.userProfile) return

			// 调用supabase更新用户信息接口
			try {
				const user = await updateUser({ password: newPassword })
				if (user) {
					this.userProfile = user
					this.isAuthenticated = true
				}

				// 保存到localStorage
				setStorage('userProfile', user)
				return user
			} catch (error) {
				console.error('修改密码失败:', error)
				throw error
			}
		},

		// 删除账户（需要通过supabase的admin API）
		async deleteAccount() {
			if (!this.userProfile) return

			// 先登出
			await this.logout()

			// Supabase的账户删除需要使用admin API，这里需要后续添加
			throw new Error('此功能需要集成Supabase的admin API')
		}
	}
})
