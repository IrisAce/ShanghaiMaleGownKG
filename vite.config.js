const {
	defineConfig
} = require('vite');
const vue = require('@vitejs/plugin-vue');

module.exports = defineConfig({
	plugins: [vue()],
	server: {
		port: 80, // 核心：将端口改为 80
		strictPort: true, // 可选：若 80 端口被占用，直接报错（避免自动切换到其他端口）
		open: true, // 可选：启动后自动打开浏览器
		proxy: {
			// 这里的 '/api' 是你想要代理的请求前缀，可根据实际情况修改
			'/api': {
				target: 'http://localhost:8080', // 后端Spring Boot服务的地址和端口
				changeOrigin: true, // 允许跨域
				rewrite: (path) => path.replace(/^\/api/, '') // 重写请求路径，去掉 '/api' 前缀
			}
		}
	}
});