import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import babel from 'vite-plugin-babel'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		babel({
			babelConfig: {
				// plugins: ['istanbul'],
			},
		}),
	],
	server: {
		port: 6060,
	},
})
