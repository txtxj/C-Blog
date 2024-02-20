import Tov from './presets'
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
	resolve: {
		alias: {
			'~/': `${resolve(__dirname, 'src')}/`,
		},
		extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue', '.md'],
	},
	plugins: [Tov()],
	server: { host: 'localhost', port: 1314 },
})
