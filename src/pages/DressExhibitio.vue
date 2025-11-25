<template>
	<div class="app-container">
		<!-- 顶部导航 -->
		<header class="app-header">
			<div class="logo">
				<i class="el-icon-clothes"></i>
				<span>近代服饰典藏馆</span>
			</div>
			<nav class="nav-links">
				<router-link to="/home" class="nav-item">首页</router-link>
				<router-link to="/collection" class="nav-item active">藏品展示</router-link>
				<router-link to="/timeline" class="nav-item">历史脉络</router-link>
				<router-link to="/knowledge" class="nav-item">服饰知识</router-link>
			</nav>
		</header>

		<!-- 筛选区 -->
		<div class="filter-bar">
			<el-select v-model="periodFilter" placeholder="选择时期" @change="handleFilterChange">
				<el-option label="全部时期" value=""></el-option>
				<el-option label="晚清" value="晚清"></el-option>
				<el-option label="民国" value="民国"></el-option>
			</el-select>

			<el-select v-model="categoryFilter" placeholder="选择类别" @change="handleFilterChange">
				<el-option label="全部类别" value=""></el-option>
				<el-option label="礼服" value="礼服"></el-option>
				<el-option label="配饰" value="配饰"></el-option>
			</el-select>

			<el-select v-model="styleFilter" placeholder="选择风格" @change="handleFilterChange">
				<el-option label="全部风格" value=""></el-option>
				<el-option label="中式" value="中式"></el-option>
				<el-option label="西式" value="西式"></el-option>
				<el-option label="中西融合" value="中西融合"></el-option>
			</el-select>

			<el-input v-model="searchKeyword" placeholder="搜索名称、标签或特征" clearable @keyup.enter="handleSearch">
				<template #append>
					<el-button type="primary" @click="handleSearch">搜索</el-button>
				</template>
			</el-input>
		</div>

		<!-- 主展示区 -->
		<div class="main-content">
			<!-- 左侧缩略图导航 -->
			<div class="thumbnail-sidebar">
				<div class="thumbnail-item" v-for="(item, index) in filteredItems" :key="item.id"
					:class="{ active: activeIndex === index }" @click="activeIndex = index">
					<el-image :src="item.thumbnailUrl" alt="缩略图" fit="cover" />
					<div class="thumbnail-info">
						<h4>{{ item.name }}</h4>
						<p>{{ item.period }}</p>
					</div>
				</div>
			</div>

			<!-- 右侧详情展示 -->
			<div class="detail-view">
				<!-- 主图展示区 -->
				<div class="main-image-container">
					<el-image :src="currentItem.imageUrl" alt="服饰主图" fit="contain" class="main-image"
						@click="openImageViewer" />

					<!-- 图片操作工具栏 -->
					<div class="image-tools">
						<el-button icon="el-icon-zoom-in" @click="zoomIn" :disabled="zoomLevel >= 3"></el-button>
						<el-button icon="el-icon-zoom-out" @click="zoomOut" :disabled="zoomLevel <= 0.5"></el-button>
						<el-button icon="el-icon-refresh-left" @click="resetZoom"></el-button>
						<el-button icon="el-icon-download" @click="downloadImage"></el-button>
					</div>
				</div>

				<!-- 详情信息区 -->
				<div class="detail-info">
					<div class="detail-header">
						<h2>{{ currentItem.name }}</h2>
						<div class="tags">
							<el-tag v-for="tag in currentItem.tags" :key="tag">{{ tag }}</el-tag>
						</div>
					</div>

					<div class="detail-content">
						<el-tabs v-model="activeTab">
							<el-tab-pane label="基本信息">
								<div class="info-grid">
									<div class="info-item">
										<span class="info-label">时期:</span>
										<span class="info-value">{{ currentItem.period }}</span>
									</div>
									<div class="info-item">
										<span class="info-label">类别:</span>
										<span class="info-value">{{ currentItem.category }}</span>
									</div>
									<div class="info-item">
										<span class="info-label">风格:</span>
										<span class="info-value">{{ currentItem.style }}</span>
									</div>
									<div class="info-item">
										<span class="info-label">材质:</span>
										<span class="info-value">{{ currentItem.material }}</span>
									</div>
									<div class="info-item">
										<span class="info-label">工艺:</span>
										<span class="info-value">{{ currentItem.craftsmanship }}</span>
									</div>
									<div class="info-item">
										<span class="info-label">馆藏编号:</span>
										<span class="info-value">{{ currentItem.collectionId }}</span>
									</div>
								</div>
							</el-tab-pane>

							<el-tab-pane label="历史背景">
								<div class="history-content" v-html="currentItem.historyBackground"></div>
							</el-tab-pane>

							<el-tab-pane label="服饰细节">
								<div class="detail-gallery">
									<div class="detail-image-item" v-for="(detail, i) in currentItem.details" :key="i">
										<el-image :src="detail.imageUrl" alt="细节图" fit="cover"
											@click="openDetailViewer(detail.imageUrl, detail.description)" />
										<p class="detail-desc">{{ detail.description }}</p>
									</div>
								</div>
							</el-tab-pane>

							<el-tab-pane label="相关配伍">
								<div class="matching-items">
									<div class="matching-item" v-for="(matching, i) in currentItem.relatedItems"
										:key="i" @click="navigateToMatching(matching.id)">
										<el-image :src="matching.imageUrl" alt="相关配伍" fit="cover" />
										<p>{{ matching.name }}</p>
									</div>
								</div>
							</el-tab-pane>
						</el-tabs>
					</div>
				</div>
			</div>
		</div>

		<!-- 图片查看器 -->
		<el-image-viewer v-if="imageViewerVisible" :url-list="[imageViewerUrl]" @close="imageViewerVisible = false" />
	</div>
</template>

<script setup>
	import {
		ref,
		computed,
		onMounted
	} from 'vue';
	import {
		useRouter
	} from 'vue-router';
	import {
		ElMessage
	} from 'element-plus';
	// import {
	// 	getCollectionItems,
	// 	getCollectionDetails
	// } from '/src/api/collection.js';

	// 状态管理
	const router = useRouter();
	const allItems = ref([]);
	const filteredItems = ref([]);
	const activeIndex = ref(0);
	const zoomLevel = ref(1);
	const imageViewerVisible = ref(false);
	const imageViewerUrl = ref('');

	// 筛选条件
	const periodFilter = ref('');
	const categoryFilter = ref('');
	const styleFilter = ref('');
	const searchKeyword = ref('');

	// 标签页状态
	const activeTab = ref('0');

	// 当前展示项
	const currentItem = ref({
		id: '',
		name: '',
		period: '',
		category: '',
		style: '',
		imageUrl: '',
		thumbnailUrl: '',
		tags: [],
		material: '',
		craftsmanship: '',
		collectionId: '',
		historyBackground: '',
		details: [],
		relatedItems: []
	});

	// 获取藏品数据
	const fetchCollectionItems = async () => {
		try {
			const response = await getCollectionItems();
			allItems.value = response.data;
			filteredItems.value = [...allItems.value];

			// 加载第一个 item 的详情
			if (filteredItems.value.length > 0) {
				fetchItemDetails(filteredItems.value[0].id);
			}
		} catch (error) {
			ElMessage.error('获取藏品数据失败: ' + error.message);
		}
	};

	// 获取单个藏品详情
	const fetchItemDetails = async (id) => {
		try {
			const response = await getCollectionDetails(id);
			currentItem.value = response.data;
		} catch (error) {
			ElMessage.error('获取藏品详情失败: ' + error.message);
		}
	};

	// 处理筛选变化
	const handleFilterChange = () => {
		filteredItems.value = allItems.value.filter(item => {
			const periodMatch = !periodFilter.value || item.period === periodFilter.value;
			const categoryMatch = !categoryFilter.value || item.category === categoryFilter.value;
			const styleMatch = !styleFilter.value || item.style === styleFilter.value;
			const searchMatch = !searchKeyword.value ||
				item.name.includes(searchKeyword.value) ||
				item.tags.some(tag => tag.includes(searchKeyword.value)) ||
				item.description.includes(searchKeyword.value);

			return periodMatch && categoryMatch && styleMatch && searchMatch;
		});

		if (filteredItems.value.length > 0) {
			activeIndex.value = 0;
			fetchItemDetails(filteredItems.value[0].id);
		} else {
			currentItem.value = {
				name: '未找到匹配藏品',
				imageUrl: '',
				details: [],
				relatedItems: []
			};
		}
	};

	// 搜索处理
	const handleSearch = () => {
		handleFilterChange();
	};

	// 图片缩放控制
	const zoomIn = () => {
		zoomLevel.value += 0.2;
	};

	const zoomOut = () => {
		zoomLevel.value -= 0.2;
	};

	const resetZoom = () => {
		zoomLevel.value = 1;
	};

	// 打开图片查看器
	const openImageViewer = () => {
		imageViewerUrl.value = currentItem.value.imageUrl;
		imageViewerVisible.value = true;
	};

	const openDetailViewer = (url, desc) => {
		imageViewerUrl.value = url;
		imageViewerVisible.value = true;
	};

	// 下载图片
	const downloadImage = () => {
		const link = document.createElement('a');
		link.href = currentItem.value.imageUrl;
		link.download = currentItem.value.name;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	// 导航到相关配伍
	const navigateToMatching = (id) => {
		const targetIndex = filteredItems.value.findIndex(item => item.id === id);
		if (targetIndex !== -1) {
			activeIndex.value = targetIndex;
			fetchItemDetails(id);
		}
	};

	// 监听activeIndex变化加载详情
	watch(activeIndex, (newVal) => {
		if (filteredItems.value[newVal]) {
			fetchItemDetails(filteredItems.value[newVal].id);
		}
	});

	// 初始化
	onMounted(() => {
		fetchCollectionItems();
	});
</script>

<style scoped>
	.app-container {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background-color: #f9f7f5;
	}

	.app-header {
		background-color: #1a365d;
		color: #fff;
		padding: 0 40px;
		height: 60px;
		display: flex;
		align-items: center;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	.logo {
		display: flex;
		align-items: center;
		font-size: 1.2rem;
		font-weight: bold;
	}

	.logo i {
		margin-right: 10px;
		font-size: 1.5rem;
		color: #ffd700;
	}

	.nav-links {
		margin-left: auto;
		display: flex;
		gap: 30px;
	}

	.nav-item {
		color: #e2e8f0;
		text-decoration: none;
		padding: 8px 0;
		position: relative;
	}

	.nav-item.active {
		color: #ffd700;
	}

	.nav-item.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 2px;
		background-color: #ffd700;
	}

	.filter-bar {
		padding: 15px 40px;
		background-color: #fff;
		display: flex;
		gap: 15px;
		align-items: center;
		flex-wrap: wrap;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
	}

	.filter-bar .el-select,
	.filter-bar .el-input {
		width: 200px;
	}

	.main-content {
		display: flex;
		flex: 1;
		padding: 20px 40px;
		gap: 20px;
	}

	.thumbnail-sidebar {
		width: 280px;
		overflow-y: auto;
		max-height: calc(100vh - 180px);
		padding-right: 10px;
	}

	.thumbnail-item {
		background-color: #fff;
		border-radius: 8px;
		padding: 10px;
		margin-bottom: 15px;
		cursor: pointer;
		transition: all 0.3s;
		border: 2px solid transparent;
	}

	.thumbnail-item.active {
		border-color: #1a365d;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
	}

	.thumbnail-item .el-image {
		width: 100%;
		height: 160px;
		border-radius: 4px;
	}

	.thumbnail-info {
		padding: 10px 5px 0;
	}

	.thumbnail-info h4 {
		margin: 0 0 5px;
		font-size: 15px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.thumbnail-info p {
		margin: 0;
		font-size: 13px;
		color: #666;
	}

	.detail-view {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.main-image-container {
		background-color: #fff;
		border-radius: 8px;
		padding: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		min-height: 500px;
	}

	.main-image {
		max-width: 100%;
		max-height: 500px;
		transition: transform 0.3s;
		transform: scale(v-bind(zoomLevel));
	}

	.image-tools {
		position: absolute;
		bottom: 20px;
		right: 20px;
		display: flex;
		gap: 10px;
		background-color: rgba(255, 255, 255, 0.8);
		padding: 8px;
		border-radius: 4px;
		backdrop-filter: blur(4px);
	}

	.detail-info {
		background-color: #fff;
		border-radius: 8px;
		padding: 20px;
		flex: 1;
		overflow-y: auto;
	}

	.detail-header {
		margin-bottom: 20px;
		padding-bottom: 15px;
		border-bottom: 1px solid #eee;
	}

	.detail-header h2 {
		margin: 0 0 10px;
		color: #1a365d;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 15px;
		margin-top: 10px;
	}

	.info-item {
		display: flex;
		padding: 8px 0;
		border-bottom: 1px dashed #eee;
	}

	.info-label {
		color: #666;
		width: 80px;
		flex-shrink: 0;
	}

	.info-value {
		flex: 1;
	}

	.history-content {
		line-height: 1.8;
		color: #333;
	}

	.history-content p {
		margin: 0 0 15px;
	}

	.detail-gallery {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 15px;
		margin-top: 10px;
	}

	.detail-image-item {
		cursor: pointer;
	}

	.detail-image-item .el-image {
		width: 100%;
		height: 150px;
		border-radius: 4px;
	}

	.detail-desc {
		margin: 8px 0 0;
		font-size: 13px;
		color: #333;
	}

	.matching-items {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 15px;
		margin-top: 10px;
	}

	.matching-item {
		cursor: pointer;
		text-align: center;
	}

	.matching-item .el-image {
		width: 100%;
		height: 120px;
		border-radius: 4px;
	}

	.matching-item p {
		margin: 8px 0 0;
		font-size: 13px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>