<template>
	<div class="container">

		<!-- 图片和介绍 -->
		<div class="content">
			<!-- 图片和按钮 -->
			<div class="image-container">
				<el-image :src="dress.dressImg" alt="礼服图片" class="image" fit="contain" />
				<div class="button-group">
					<el-button type="warning" round class="classic-button"
						@click="goType2Match(dress.dressStyleInfos[0].styleId)">经典款式</el-button>
					<el-button type="danger" round class="classic-button"
						@click="goDressModel(dress.threeDModel)">三维模型</el-button>
					<!-- 					<el-button type="primary" round class="classic-button"
						@click="goType2Match(dress.dressStyleInfos[0].styleId)">查看配伍组合</el-button> -->
				</div>
			</div>

			<!-- 介绍 -->
			<div class="description" v-html="renderedMarkdown"></div>
		</div>
	</div>
</template>

<script setup>
	import {
		ref,
		onMounted,
		computed
	} from 'vue';
	import {
		useRoute,
		useRouter
	} from 'vue-router';
	import {
		HomeFilled
	} from '@element-plus/icons-vue';
	import {
		marked
	} from 'marked'; // 使用命名导入

	const route = useRoute();
	const router = useRouter();
	const dress = ref({});
	// const dressItem = ref({});

	// 跳转查看礼服的经典款式
	const goDressType = () => {
		router.push('/dresstype');
	};

	// 跳转查看3D模型
	const goDressModel = (param) => {
		//dress.DressMatches
		router.push('/3dmatch');
	};

	// 跳转配伍查看页
	const goType2Match = (param) => {
		//参数为styleId
		// router.push('/type2March');
		router.push({
			path: '/type2March',
			query: {
				styleId: param
			}
		});
	};


	// 使用 marked 渲染 Markdown 内容
	const renderedMarkdown = computed(() => {
		return marked(dress.value.dressIntroduction || '');
	});

	onMounted(() => {
		// 从 query 中获取参数
		const dressString = route.query.dress;

		// 将 JSON 字符串反序列化为对象
		if (dressString) {
			dress.value = JSON.parse(dressString);
			console.log(dress);
		}
	});

	// 跳转至配伍展示页面
	const navigateToCompatibility = () => {
		router.push({
			name: 'CompatibilityDisplay',
			params: {
				styleId: dress.value.dressId
			}
			// params: { styleId: "8"}
		})
	}
</script>

<style scoped>
	.container {
		position: relative;
		height: 100%;
		padding: 20px;
	}

	.back-button {
		position: absolute;
		top: 10px;
		right: 20px;
	}

	.content {
		display: flex;
		align-items: center;
		/* 垂直居中 */
		height: calc(90%);
		/* 减去按钮和 padding 的高度 */
		margin-top: 60px;
		/* 为按钮留出空间 */
	}

	.image-container {
		flex: 1;
		display: flex;
		flex-direction: column;
		/* 列方向排列 */
		justify-content: center;
		align-items: center;
	}

	.image {
		max-width: 100%;
		max-height: 70vh;
		/* 调整图片高度，为按钮留出空间 */
	}

	.button-group {
		display: flex;
		flex-direction: row;
		/* 行方向排列 */
		gap: 10px;
		/* 按钮之间的间距 */
		margin-top: 20px;
		/* 按钮与图片的间距 */
	}

	.classic-button {
		/* 按钮样式 */
	}

	.description {
		flex: 2;
		padding: 0 20px;
		overflow-y: auto;
		/* 超出部分纵向滚动 */
		max-height: 80vh;
		/* 限制高度 */
		border-left: 1px solid #ddd;
		/* 添加分隔线 */
		padding-left: 20px;
		text-align: left;
	}
</style>