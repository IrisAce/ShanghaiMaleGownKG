<template>
	<el-container class="dress-management-container">
		<!-- 左侧固定菜单栏 -->
		<el-aside class="sidebar">
			<h3 class="KG-title">礼服知识库管理</h3>
			<el-menu :default-active="activeMenu" mode="vertical"  
				active-text-color="#ffd04b" @select="handleMenuSelect">
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
			</el-menu>
		</el-aside>
		<!-- 右侧 iframe 路由展示区域 -->
		<el-container class="main-content">
			<iframe :src="iframeSrc" frameborder="0" style="width: 100%; height: 100%;"></iframe>
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
		display: flex;
		height: 100vh;
	}

	.sidebar {
		width: 200px;
		height: 100%;
		background-color: rgb(238, 241, 246);
		position: fixed;
		left: 0;
		top: 0;
		overflow-y: auto;
	}

	.KG-title {
		color: #409EFF;
		height: 30px;
		top: 40px;
		overflow-y: auto;
	}

	.main-content {
		flex: 1;
		padding: 20px;
		margin-left: 200px;
	}
</style>