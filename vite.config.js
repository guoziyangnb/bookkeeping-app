import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
	plugins: [vue()],
	base: './',
	build: {
		// 可选：确保打包输出目录
		outDir: 'dist',
		assetsDir: 'assets'
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	},
	server: {
		port: 3000,
		open: true
	}
})
