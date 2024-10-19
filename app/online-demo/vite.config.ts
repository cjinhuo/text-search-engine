import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: 'autoUpdate',
			strategies: 'generateSW',
			devOptions: {
				enabled: true,
			},
			workbox: {
				// 其他 Workbox 配置选项
			},
			manifest: {
				name: 'Text Search Engine',
				short_name: 'Text Search Engine',
				start_url: 'https://cjinhuo.github.io/text-search-engine/',
				display: 'standalone',
				theme_color: 'white',
				background_color: '#ffffff',
				description: 'Text Search Engine',
				icons: [
					{
						src: '/text-search-engine/192x192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: '/text-search-engine/512x512.png',
						sizes: '512x512',
						type: 'image/png',
					},
				],
			},
		}),
	],
	base: '/text-search-engine',
	server: {
		open: '/text-search-engine',
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					// 把相关包单独打包成一个文件
					reactVendor: ['react', 'react-dom', 'react-router-dom'],
					//
					search: ['text-search-engine'],
					ui: ['@mui/material', '@mui/styles', '@emotion/react', '@emotion/styled'],
				},
			},
		},
	},
})
