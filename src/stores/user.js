import { defineStore } from 'pinia'
import { getStorage, setStorage, removeStorage } from '@/utils/storage'
import router from '@/router'

export const useUserStore = defineStore('user', {
	state: () => {
		// 在初始化时从 localStorage 加载用户数据
		const savedUser = getStorage('currentUser', null)
		const savedUsers = getStorage('users', [])

		return {
			currentUser: savedUser,
			users: savedUsers, // 存储所有注册用户
			isAuthenticated: !!savedUser
		}
	},

	getters: {
		// 获取当前用户信息
		userInfo: state => state.currentUser,

		// 检查是否已登录
		isLoggedIn: state => state.isAuthenticated,

		// 获取用户头像
		userAvatar: state => state.currentUser?.avatar || '',

		// 获取用户名
		userName: state => state.currentUser?.username || '游客'
	},

	actions: {
		// 注册
		async register({ username, email, password }) {
			// 检查邮箱是否已存在
			const existingUser = this.users.find(u => u.email === email)
			if (existingUser) {
				throw new Error('该邮箱已被注册')
			}

			// 检查用户名是否已存在
			const existingUsername = this.users.find(u => u.username === username)
			if (existingUsername) {
				throw new Error('该用户名已被使用')
			}

			// 创建新用户
			const newUser = {
				id: Date.now().toString(),
				username,
				email,
				password, // 在实际应用中应该加密
				avatar: '',
				createdAt: new Date().toISOString()
			}

			// 保存用户列表
			this.users.push(newUser)
			setStorage('users', this.users)

			// 自动登录
			this.currentUser = newUser
			this.isAuthenticated = true
			setStorage('currentUser', newUser)

			return newUser
		},

		// 登录
		async login({ email, password, rememberMe }) {
			// 查找用户
			const user = this.users.find(u => u.email === email)

			if (!user) {
				throw new Error('用户不存在')
			}

			if (user.password !== password) {
				throw new Error('密码错误')
			}

			// 设置当前用户
			this.currentUser = user
			this.isAuthenticated = true
			setStorage('currentUser', user)

			return user
		},

		// 登出
		logout() {
			this.currentUser = null
			this.isAuthenticated = false
			removeStorage('currentUser')
			router.push('/welcome')
		},

		// 更新用户信息
		updateProfile(data) {
			if (!this.currentUser) return

			// 更新当前用户信息
			this.currentUser = {
				...this.currentUser,
				...data
			}

			// 更新用户列表中的信息
			const userIndex = this.users.findIndex(u => u.id === this.currentUser.id)
			if (userIndex !== -1) {
				this.users[userIndex] = this.currentUser
			}

			// 保存到localStorage
			setStorage('currentUser', this.currentUser)
			setStorage('users', this.users)
		},

		// 更新头像
		updateAvatar(avatarUrl) {
			this.updateProfile({ avatar: avatarUrl })
		},

		// 修改密码
		changePassword(oldPassword, newPassword) {
			if (!this.currentUser) {
				throw new Error('未登录')
			}

			if (this.currentUser.password !== oldPassword) {
				throw new Error('原密码错误')
			}

			this.updateProfile({ password: newPassword })
		},

		// 删除账户
		deleteAccount() {
			if (!this.currentUser) return

			// 从用户列表中删除
			this.users = this.users.filter(u => u.id !== this.currentUser.id)
			setStorage('users', this.users)

			// 登出
			this.logout()
		}
	}
})
