<template>
	<div id="app">
		<!-- 顶部导航栏 -->
		<header class="app-header">
			<div class="logo">
				<i class="el-icon-clothes"></i>
				<span>近代上海地区男性礼服数据库</span>
			</div>
			<nav class="nav-links">
				<router-link to="/home" class="nav-item" :class="{ active: $route.path === '/home' }">首页</router-link>
				<router-link to="/dresstype" class="nav-item"
					:class="{ active: $route.path === '/dresstype' }">款式分类</router-link>
				<router-link to="/kg" class="nav-item" :class="{ active: $route.path === '/kg' }">知识图谱</router-link>
<!-- 				<router-link to="/image-crawler" class="nav-item" :class="{ active: $route.path === '/image-crawler' }">
					图片爬取
				</router-link> -->
			</nav>

		</header>

		<!--<Header></Header> -->
		<!-- 页面内容区域 -->
		<main class="app-main">
			<router-view></router-view>
		</main>
		<!-- 底部版权信息 -->
		<!--<footer class="copyright">
			<div class="copyright-content">
				<p>© {{ currentYear }} 礼服知识库 版权所有</p>
				<p>免责声明：本网站内容仅供学习交流，未经许可不得用于商业用途</p>
			</div>
		</footer> -->
	</div>
</template>

<script setup>
	// 可在此处添加导航相关逻辑
	import {
		ref,
		onMounted
	} from 'vue';
	import Header from '/src/components/layout/AppHeader.vue';
	// 获取当前年份
	const currentYear = ref(new Date().getFullYear());
</script>

<style>
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: #2c3e50;
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	/* 顶部导航栏样式 */
	.app-header {
		background-color: #1A365D;
		/* 典雅藏蓝色 - 主色调 */
		color: #fff;
		height: 60px;
		display: flex;
		align-items: center;
		padding: 0 40px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.logo {
		display: flex;
		align-items: center;
		font-size: 1.4rem;
		font-weight: bold;
	}

	.logo i {
		margin-right: 10px;
		font-size: 1.8rem;
		color: #FFD700;
		/* 金色图标 - 点缀色 */
	}

	.nav-links {
		margin-left: auto;
		display: flex;
		gap: 30px;
	}

	.nav-item {
		color: #E2E8F0;
		/* 浅灰蓝色 - 导航文字色 */
		text-decoration: none;
		font-size: 1rem;
		padding: 8px 0;
		position: relative;
		transition: color 0.3s;
	}

	.nav-item:hover {
		color: #FFD700;
		/* 金色 hover 效果 */
	}

	.nav-item.active {
		color: #FFD700;
	}

	.nav-item.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 2px;
		background-color: #FFD700;
		/* 金色下划线标识当前页 */
	}

	/* 主内容区域样式 */
	.app-main {
		flex: 1;
		width: 100%;
	}

	/* 底部版权样式 */
	.copyright {
		margin-top: auto;
		/* 自动推到页面底部 */
		padding: 20px 0;
		background-color: #f5f5f5;
		border-top: 1px solid #eaeaea;
		width: 100%;
	}

	.copyright-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px;
	}

	.copyright p {
		margin: 5px 0;
		font-size: 14px;
		color: #666;
	}
</style>