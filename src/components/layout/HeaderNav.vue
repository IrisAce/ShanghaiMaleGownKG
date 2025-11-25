<template>
	<el-header class="header-nav">
		<div class="header-left">
			<h2>礼服知识库管理系统</h2>
		</div>
		<div class="header-right">
			<el-dropdown trigger="click">
				<div class="user-info">
					<el-avatar :size="36" class="user-avatar">
						<img src="https://cube.elemecdn.com/0/88/03b0d3983f48206b64e6a751997jpeg.jpeg" alt="用户头像">
					</el-avatar>
					<span class="user-name">{{ userInfo.nickname || '管理员' }}</span>
					<el-icon class="user-arrow">
						<ArrowDown />
					</el-icon>
				</div>
				<template #dropdown>
					<el-dropdown-menu>
<!-- 						<el-dropdown-item @click="handleProfile">个人中心</el-dropdown-item>
						<el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item> -->
						<el-dropdown-item @click="handleProfile">个人中心</el-dropdown-item>
						<el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>
	</el-header>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue';
	import {
		useRouter
	} from 'vue-router';
	import {
		ArrowDown
	} from '@element-plus/icons-vue';
	import {
		ElMessage
	} from 'element-plus';
	// import {
	// 	logout
	// } from '@/api/auth';

	const router = useRouter();
	const userInfo = ref({});

	// 获取用户信息
	const getUserInfo = () => {
		// 实际项目中从接口获取用户信息
		const nickname = localStorage.getItem('nickname');
		if (nickname) {
			userInfo.value.nickname = nickname;
		}
	};

	// 退出登录
	const handleLogout = async () => {
		try {
			await logout();
			localStorage.removeItem('token');
			localStorage.removeItem('nickname');
			ElMessage.success('退出登录成功');
			// router.push('/login');
		} catch (error) {
			ElMessage.error('退出登录失败');
		}
	};

	// 个人中心
	const handleProfile = () => {
		// router.push('/user/profile');
	};

	onMounted(() => {
		getUserInfo();
	});
</script>

<style scoped>
	.header-nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20px;
		background-color: #409EFF;
		color: white;
		height: 60px;
	}

	.header-left h2 {
		margin: 0;
		font-size: 18px;
	}

	.header-right {
		display: flex;
		align-items: center;
	}

	.user-info {
		display: flex;
		align-items: center;
		cursor: pointer;
	}

	.user-avatar {
		margin-right: 10px;
	}

	.user-name {
		margin-right: 5px;
	}

	.user-arrow {
		font-size: 14px;
	}
</style>