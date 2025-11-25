<template>
	<el-container class="dress-management-container" style="flex-direction: column;">
		<!-- 顶部导航栏 -->
		<!--<header class="app-header">
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
		</header> -->

		<!-- 主体内容区 -->
		<el-container style="flex: 1; display: flex; height: calc(100vh - 60px);">
			<!-- 左侧固定菜单栏 -->
			<el-aside class="sidebar">
				<!-- <h3 class="KG-title">管理菜单</h3> -->
				<el-menu :default-active="activeMenu" mode="vertical" active-text-color="#ffd04b"
					@select="handleMenuSelect">
					<el-menu-item index="DressBaseInfoList">
						<template #title>
							<i class="el-icon-s-home"></i>
							<span>礼服基础信息列表</span>
						</template>
					</el-menu-item>
					<el-menu-item index="DressStyleInfoList">
						<template #title>
							<i class="el-icon-s-grid"></i>
							<span>礼服主体款式信息列表</span>
						</template>
					</el-menu-item>
					<el-menu-item index="DressMatchingInfoList">
						<template #title>
							<i class="el-icon-s-order"></i>
							<span>成套配伍信息列表</span>
						</template>
					</el-menu-item>
					<!-- 添加用户管理菜单 -->
					<!-- 					<el-menu-item index="UserList">
						<template #title>
							<i class="el-icon-user"></i>
							<span>用户管理</span>
						</template>
					</el-menu-item> -->
				</el-menu>
			</el-aside>

			<!-- 右侧 iframe 路由展示区域 -->
			<el-container class="main-content3">
				<iframe :src="iframeSrc" frameborder="0" style="width: 100%; height: 100%;"></iframe>
			</el-container>
		</el-container>
	</el-container>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue';
	import {
		useRouter
	} from 'vue-router';

	const router = useRouter();
	// 记录当前激活的菜单
	const activeMenu = ref('DressBaseInfoList');
	// 记录 iframe 的 src
	const iframeSrc = ref('');

	// 处理菜单选择事件
	const handleMenuSelect = (index) => {
		activeMenu.value = index;
		// 根据菜单索引生成对应的 URL
		const route = router.resolve({
			name: index
		});
		iframeSrc.value = route.href;
	};

	onMounted(() => {
		// 页面加载时默认跳转到 DressBaseInfoList 页面
		const defaultRoute = router.resolve({
			name: 'DressBaseInfoList'
		});
		iframeSrc.value = defaultRoute.href;
	});
</script>

<style scoped>
	.dress-management-container {
		height: 90vh;
		overflow: hidden;
	}

	.sidebar {
		width: 200px;
		background-color: rgb(238, 241, 246);
		overflow-y: auto;
	}

	.KG-title {
		color: #409EFF;
		padding: 15px 20px;
		margin: 0;
		border-bottom: 1px solid #eaeaea;
	}

	.main-content3 {
		flex: 1;
		padding: 20px;
		overflow: hidden;
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
</style>