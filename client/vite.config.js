import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			"@": "/src",
			"@Components": "/src/Components",
			"@Pages": "/src/Components/Pages",
			"@Forms": "/src/Components/Forms",
			"@Composables": "/src/Composables",
		},
	},
	server: {
		port: 3000,
	},
})
