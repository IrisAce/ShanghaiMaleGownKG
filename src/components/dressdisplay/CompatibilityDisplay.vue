<template>
	<div class="compatibility-container">
		<!-- 页面标题 -->
		<el-page-header @back="handleBack" content="礼服配伍展示"></el-page-header>

		<!-- 主内容区 - 左右布局 -->
		<div class="main-content">
			<!-- 左侧：主题款式图片和标签 -->
			<div class="left-panel">
				<!-- 主题款式图片展示 -->
				<div class="main-image-container">
					<el-image :src="mainStyle.imageUrl" :alt="mainStyle.name" fit="contain" preview-teleported
						:preview-src-list="[mainStyle.imageUrl, ...mainStyle.detailImages]">
						<template #error>
							<div class="image-error">
								<el-icon>
									<Picture />
								</el-icon>
							</div>
						</template>
					</el-image>

					<!-- 图片切换指示器 -->
					<div class="image-indicators" v-if="mainStyle.detailImages && mainStyle.detailImages.length">
						<el-radio-group v-model="activeImageIndex" size="small">
							<el-radio-button :label="0">主图</el-radio-button>
							<el-radio-button :label="index + 1" v-for="(img, index) in mainStyle.detailImages"
								:key="index">
								细节 {{ index + 1 }}
							</el-radio-button>
						</el-radio-group>
					</div>
				</div>

				<!-- 主题款式信息 -->
				<div class="main-style-info">
					<h2>{{ mainStyle.name }}</h2>
					<p class="description">{{ mainStyle.description }}</p>

					<!-- 标签展示 -->
					<div class="tags-container">
						<el-tag :type="tag.type" :color="tag.color" v-for="(tag, index) in mainStyle.styleTag"
							:key="index" effect="dark">
							{{ tag.name }}
						</el-tag>
					</div>
				</div>
			</div>

			<!-- 右侧：配伍数据展示 -->
			<div class="right-panel">
				<el-card>
					<div slot="header">
						<h3>配伍组合 ({{ compatibilityItems.length }})</h3>
					</div>

					<!-- 配伍数据为空时的提示 -->
					<el-empty v-if="compatibilityItems.length === 0 && !loading" description="暂无相关配伍数据"></el-empty>

					<!-- 加载状态 -->
					<el-skeleton v-if="loading" :rows="6" style="width: 100%"></el-skeleton>

					<!-- 配伍列表 -->
					<div class="compatibility-grid" v-else>
						<div class="compatibility-item" v-for="(item, index) in compatibilityItems" :key="index">
							<el-card shadow="hover">
								<div class="compatibility-image">
									<el-image :src="item.imageUrl" :alt="item.name" fit="cover" preview-teleported
										:preview-src-list="item.images"></el-image>
								</div>
								<div class="compatibility-info">
									<h4>{{ item.name }}</h4>
									<p class="compatibility-desc">{{ item.description }}</p>
									<div class="compatibility-type">
										<el-tag size="small">{{ item.type }}</el-tag>
									</div>
								</div>
							</el-card>
						</div>
					</div>
				</el-card>
			</div>
		</div>
	</div>
</template>

<script setup>
	import {
		ref,
		onMounted,
		watch
	} from 'vue'
	import {
		useRoute,
		useRouter
	} from 'vue-router'
	import {
		getDressStyleInfoById,
		getDressMatchingInfoById
	} from '/src/api/dress.js';
	import {
		Picture
	} from '@element-plus/icons-vue'

	// 路由相关
	const route = useRoute();
	const router = useRouter();
	// const styleId = ref(route.params.styleId);
	const styleId = 33;

	// 数据状态
	const mainStyle = ref({
		id: '',
		name: '',
		description: '',
		imageUrl: '',
		detailImages: [],
		tags: []
		// styleId: null,
		// styleName: '',
		// styleIntroduction: '',
		// image: '',
		// styleType: '',
		// belongingPeriod: '',
		// styleTag:''
	})
	const compatibilityItems = ref([])
	const loading = ref(true)
	const activeImageIndex = ref(0)

	// 返回上一页
	const handleBack = () => {
		router.back()
	}

	// 获取主题款式详情
	const fetchMainStyleDetail = async () => {
		try {
			loading.value = true
			// const response = await getDressStyleInfoById(styleId.value)
			const response = await getDressStyleInfoById(8)
			mainStyle.value = response.data
		} catch (error) {
			console.error('获取主题款式详情失败', error)
			ElMessage.error('获取款式信息失败')
		}
	}

	// 获取配伍数据
	const fetchCompatibilityItems = async () => {
		try {
			// const response = await getDressMatchingInfoById(styleId.value)
			const response = await getDressMatchingInfoById(6)
			compatibilityItems.value = response.data
		} catch (error) {
			console.error('获取配伍数据失败', error)
			ElMessage.error('获取配伍信息失败')
		} finally {
			loading.value = false
		}
	}

	// 当图片索引变化时更新显示的图片
	watch(activeImageIndex, (newVal) => {
		if (newVal === 0) {
			// 显示主图
			return
		}
		// 这里可以根据需要实现切换图片的逻辑
	})

	// 页面加载时获取数据
	onMounted(() => {
		fetchMainStyleDetail().then(() => {
			fetchCompatibilityItems()
		})
	})

	// 监听路由参数变化
	watch(
		() => route.params.styleId,
		(newId) => {
			if (newId && newId !== styleId.value) {
				styleId.value = newId
				fetchMainStyleDetail().then(() => {
					fetchCompatibilityItems()
				})
			}
		}
	)
</script>

<style scoped>
	.compatibility-container {
		padding: 20px;
		max-width: 1400px;
		margin: 0 auto;
	}

	.main-content {
		display: flex;
		gap: 20px;
		margin-top: 20px;
		height: calc(100vh - 120px);
	}

	.left-panel {
		width: 35%;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.right-panel {
		flex: 1;
		overflow-y: auto;
		padding: 10px 0;
	}

	.main-image-container {
		background-color: #f5f7fa;
		border-radius: 8px;
		padding: 20px;
		display: flex;
		flex-direction: column;
		gap: 15px;
		flex: 1;
		min-height: 400px;
	}

	.main-image-container img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.image-error {
		width: 100%;
		height: 400px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #eef2f7;
		color: #909399;
	}

	.image-indicators {
		margin-top: 10px;
	}

	.main-style-info {
		padding: 10px;
	}

	.main-style-info h2 {
		margin-bottom: 10px;
		color: #303133;
	}

	.description {
		color: #606266;
		line-height: 1.6;
		margin-bottom: 15px;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.tags-container {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 10px;
	}

	.compatibility-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 20px;
		padding: 10px 0;
	}

	.compatibility-item {
		transition: transform 0.3s ease;
	}

	.compatibility-item:hover {
		transform: translateY(-5px);
	}

	.compatibility-image {
		height: 200px;
		overflow: hidden;
		border-radius: 4px 4px 0 0;
	}

	.compatibility-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.5s ease;
	}

	.compatibility-item:hover .compatibility-image img {
		transform: scale(1.05);
	}

	.compatibility-info {
		padding: 15px;
	}

	.compatibility-info h4 {
		margin-bottom: 8px;
		font-size: 16px;
		color: #303133;
	}

	.compatibility-desc {
		color: #606266;
		font-size: 14px;
		line-height: 1.5;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		margin-bottom: 10px;
	}

	.compatibility-type {
		margin-top: auto;
	}

	/* 响应式调整 */
	@media (max-width: 992px) {
		.main-content {
			flex-direction: column;
			height: auto;
		}

		.left-panel,
		.right-panel {
			width: 100%;
		}

		.main-image-container {
			min-height: 300px;
		}
	}
</style>