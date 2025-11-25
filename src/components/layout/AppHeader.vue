<template>
	<!-- 顶部导航栏 -->
	<header class="app-header">
		<div class="logo">
			<i class="el-icon-clothes"></i>
			<span>近代上海地区男性礼服知识库</span>
		</div>
		<nav class="nav-links">
			<router-link to="/home" class="nav-item" :class="{ active: $route.path === '/home' }">首页</router-link>
			<router-link to="/dresstype" class="nav-item"
				:class="{ active: $route.path === '/dresstype' }">款式分类</router-link>
			<router-link to="/kg" class="nav-item" :class="{ active: $route.path === '/kg' }">知识图谱</router-link>
		</nav>
	</header>
</template>

<script>
	import {
		ref,
		onMounted
	} from 'vue';
</script>

<style>
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
</style>