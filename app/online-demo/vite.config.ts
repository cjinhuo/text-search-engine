import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
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
