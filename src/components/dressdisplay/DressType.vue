<!--礼服主题款式陈列组件 -->
<template>
	<div class="container">
		<!-- 添加搜索框 -->
		<div class="search-container">
			<el-input v-model="searchKeyword" placeholder="请输入关键词搜索（支持标签、礼服名称、款式、时期等）" clearable
				@keyup.enter="handleSearch">
				<template #append>
					<el-button type="primary" @click="handleSearch">搜索</el-button>
				</template>
			</el-input>
		</div>

		<div class="content-wrapper">
			<!-- 左侧分类 -->
			<div class="category-list">
				<el-menu class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" default-active="2">
					<el-sub-menu index="1">
						<template #title>
							<span>款式类型</span>
						</template>
						<el-menu-item index="1-1">主体款式</el-menu-item>
						<el-menu-item index="1-2">服饰品</el-menu-item>
					</el-sub-menu>
					<el-sub-menu index="2">
						<template #title>
							<span>时期</span>
						</template>
						<el-menu-item index="2-1">晚清</el-menu-item>
						<el-menu-item index="2-2">民国</el-menu-item>
					</el-sub-menu>
				</el-menu>
			</div>

			<!-- 右侧内容 -->
			<div class="content">
				<!-- 主体款式展示 -->
				<el-row :gutter="30">
					<el-col v-for="dressType in currentPageDressMedia" :key="dressType.id" :span="6">
						<el-card class="item-card">
							<el-image :src="dressType.resourceLink" alt="图片" class="item-image" fit="scale-down" lazy
								@click="goType2Match(dressType.id)" />
						</el-card>
					</el-col>
				</el-row>
				<!-- 分页组件 -->
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
					:current-page="currentPage" :page-sizes="[5, 8, 12]" :page-size="pageSize"
					layout="total, sizes, prev, pager, next, jumper" :total="dressMedia.length">
				</el-pagination>
			</div>
		</div>
	</div>
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
		ElMessage
	} from 'element-plus';
	import {
		HomeFilled
	} from '@element-plus/icons-vue';
	import {
		getDressesByIds,
		getAllDressStyleInfos,
		getDressStyleInfoById,
		getDressStyleByPeriod,
		getAllDressBaseInfos,
		getAllDressMatchingInfos
	} from '/src/api/dress.js';

	const router = useRouter();

	// 分类数据
	const categories = ref([]);

	// 主体款式数据
	const dressTypes = ref([]);
	const filterCondition = ref({
		fcCategory: '', // 过滤类型 dressName/period/dressType
		fcValue: '', //条件值 dressName：婚礼服/社交礼服
	});

	// 礼服多媒体数据 --初始化为图片数据
	const ids = ref('');
	// 礼服多媒体数据 --根据IDS初始化为图片数据
	const dressMedia = ref([]);
	// 当前页码
	const currentPage = ref(1);
	// 每页显示数量
	const pageSize = ref(12);
	// 当前页的礼服数据
	const currentPageDressMedia = ref([]);

	// 跳转配伍查看页
	const goType2Match = (param) => {
		//参数为styleId
		// router.push('/type2March');
		router.push({
			path: '/type2March',
			query: {
				// styleId: param, //多媒体资源缺少styleId
				styleId: 8
			}
		});
	};

	const fetchDressImage = async () => {
		try {
			const response = await getDressesByIds(ids.value);
			dressMedia.value = response.data;
			handleCurrentChange(currentPage.value);
		} catch (error) {
			ElMessage.error('获取礼服图片数据失败：' + error.message);
		}
	};

	// 获取所有主体样式并提取图片ID拼接IDS
	const fetchDresseTypesByName = async () => {
		try {
			const response = await getAllDressStyleInfos();
			dressTypes.value = response.data;

			// 遍历拼接礼服对象的 image 字段
			const imageIds = dressTypes.value.map(dress => dress.image).join(';');

			// 赋值 ids
			ids.value = imageIds;

			// 刷新图片数据
			fetchDressImage();
		} catch (error) {
			ElMessage.error('获取礼服数据失败：' + error.message);
		}
	};

	// 分类选择事件
	const handleCategorySelect = (index) => {
		const categoryId = parseInt(index, 10);
		// fetchData(categoryId);
	};

	// 返回上一页
	const goBack = () => {
		router.go(-1);
	};

	// 每页显示数量改变时触发
	const handleSizeChange = (newSize) => {
		pageSize.value = newSize;
		handleCurrentChange(currentPage.value);
	};

	// 当前页码改变时触发
	const handleCurrentChange = (newPage) => {
		currentPage.value = newPage;
		const start = (newPage - 1) * pageSize.value;
		const end = start + pageSize.value;
		currentPageDressMedia.value = dressMedia.value.slice(start, end);
	};

	// 搜索相关变量
	const searchKeyword = ref('');
	const allDressData = ref([]); // 存储全量数据用于搜索筛选
	const filteredDressMedia = ref([]); // 搜索过滤后的结果
	// 初始化时获取全量数据并缓存
	const initData = async () => {
		try {
			// 获取所有礼服基础信息
			const dressBaseRes = await getAllDressBaseInfos();
			// 获取所有款式信息
			const styleRes = await getAllDressStyleInfos();
			// 获取所有配伍信息
			const matchingRes = await getAllDressMatchingInfos();

			// 整合全量数据用于搜索
			allDressData.value = {
				dressBase: dressBaseRes.data,
				styles: styleRes.data,
				matchings: matchingRes.data
			};
		} catch (error) {
			ElMessage.error('初始化数据失败：' + error.message);
		}
	};

	// 搜索处理函数
	const handleSearch = () => {
		if (!searchKeyword.value.trim()) {
			// 空搜索时显示全部
			fetchDresseTypesByName();
			return;
		}

		const keyword = searchKeyword.value.trim().toLowerCase();
		// 多维度匹配逻辑
		const matchedIds = new Set();

		// 1. 匹配礼服基础信息（dressName、dressType、belongingPeriod）
		allDressData.value.dressBase.forEach(dress => {
			if (
				dress.dressName?.toLowerCase().includes(keyword) ||
				dress.dressType?.toLowerCase().includes(keyword) ||
				dress.belongingPeriod?.toLowerCase().includes(keyword) ||
				dress.dressTag?.toLowerCase().includes(keyword)
				// (dress.dressTag && dress.dressTag.some(tag => tag.toLowerCase().includes(keyword)))
			) {
				if (dress.image) dress.image.split(';').forEach(id => matchedIds.add(id));
			}
		});

		// 2. 匹配款式信息（styleName、styleCategory、styleType、belongingPeriod）
		allDressData.value.styles.forEach(style => {
			if (
				style.styleName?.toLowerCase().includes(keyword) ||
				style.styleCategory?.toLowerCase().includes(keyword) ||
				style.styleType?.toLowerCase().includes(keyword) ||
				style.belongingPeriod?.toLowerCase().includes(keyword) ||
				style.styleTag?.toLowerCase().includes(keyword)
				// (style.styleTag && style.styleTag.some(tag => tag.toLowerCase().includes(keyword)))--数组检索方式
			) {
				if (style.image) style.image.split(';').forEach(id => matchedIds.add(id));
			}
		});

		// 3. 匹配配伍信息（matchingName、styleType、belongingPeriod、matchTag）
		allDressData.value.matchings.forEach(matching => {
			if (
				matching.matchingName?.toLowerCase().includes(keyword) ||
				matching.styleType?.toLowerCase().includes(keyword) ||
				matching.belongingPeriod?.toLowerCase().includes(keyword) ||
				matching.matchTag?.toLowerCase().includes(keyword)
				// (matching.matchTag && matching.matchTag.some(tag => tag.toLowerCase().includes(keyword)))
			) {
				if (matching.image) matching.image.split(';').forEach(id => matchedIds.add(id));
			}
		});

		// 根据匹配到的图片ID获取资源
		if (matchedIds.size > 0) {
			ids.value = Array.from(matchedIds).join(';');
			fetchDressImage();
		} else {
			dressMedia.value = [];
			currentPageDressMedia.value = [];
			ElMessage.info('未找到匹配的礼服信息');
		}
	};



	// 初始化加载默认分类数据
	onMounted(() => {
		fetchDresseTypesByName(); // 先获取所有的主体款式数据，并拼接ids
		initData(); // 加载全量数据用于搜索
	});
</script>

<style scoped>
	.container {
		display: flex;
		height: 100vh;
		position: relative;
		flex-direction: column;
	}

	/* 新增：搜索框下方的内容区域使用水平布局 */
	.content-wrapper {
		display: flex;
		flex: 1;
		/* 占满剩余高度 */
		overflow: hidden;
		/* 防止内容溢出 */
	}

	.category-list {
		margin-top: 0;
		/* 移除顶部margin，避免错位 */
		width: 200px;
		background-color: #f5f5f5;
		border-right: 1px solid #ddd;
		flex-shrink: 0;
		/* 防止被压缩 */
	}

	.content {
		margin-top: 0;
		/* 移除顶部margin */
		flex: 1;
		padding: 20px;
		overflow-y: auto;
		/* 移除height: 90%，由flex布局自动分配高度 */
	}

	.back-button {
		position: absolute;
		top: 10px;
		right: 20px;
		z-index: 1000;
		/* 确保按钮在最上层 */
	}


	.item-card {
		margin-bottom: 20px;
	}

	.item-image {
		width: 100%;
		height: 190px;
	}

	.item-info {
		padding: 10px;
		text-align: center;
	}

	.item-info h3 {
		margin: 0;
		font-size: 16px;
	}

	.item-info p {
		margin: 5px 0 0;
		font-size: 14px;
		color: #666;
	}

	/**搜索框样式*/
	.search-container {
		padding: 15px 20px;
		width: 100%;
		box-sizing: border-box;
		/* 新增以下样式实现居中 */
		display: flex;
		justify-content: center;
		/* 水平居中 */
	}

	.el-input {
		width: 1500px;
	}
</style>