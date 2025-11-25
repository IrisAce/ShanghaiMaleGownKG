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
			<!-- 左侧礼服类型信息展示区域 -->
			<div class="category-list">
				<el-card v-if="currentDressType" class="type-card">
					<div class="type-info">
						<h3>{{ currentDressType.styleName }}</h3>
						<p><strong>时期：</strong>{{ currentDressType.belongingPeriod }}</p>
						<!-- <p><strong>类型：</strong>{{ currentDressType.styleType }}</p> -->
						<p><strong>类型：</strong>传统男性礼服</p>
						<p><strong>分类：</strong>{{ currentDressType.styleCategory }}</p>
						<p
							v-if="currentDressType.styleTag && currentDressType.styleTag.trim() && currentDressType.styleTag !== 'null'">
							<strong>标签：</strong>
							<el-tag v-for="tag in currentDressType.styleTag.split(',').filter(t => t.trim())" :key="tag"
								style="margin-right: 5px;" :type="getTagType(tag)" effect="dark" round>
								{{ tag }}
							</el-tag>
						</p>
						<!-- 标签为空时显示 -->
						<p v-else>
							<strong>标签：</strong>
							<span class="empty-tag">无标签信息</span>
						</p>
						<!-- <p><strong>介绍：</strong>{{ currentDressType.styleIntroduction }}</p> -->

						<!-- 在左侧礼服信息区域添加HTML内容展示 -->
						<div class="html-content-wrapper">
							<strong>详细介绍：</strong>
							<!-- 折叠状态展示 -->
							<div v-if="showCollapsed" class="collapsed-content">
								<p v-html="truncatedHtml"></p>
								<el-button type="text" @click="showFullHtml = true" class="show-more-btn">
									查看全部 <el-icon>
										<ArrowRight />
									</el-icon>
								</el-button>
							</div>

							<!-- 完整内容弹窗 -->
							<el-dialog v-model="showFullHtml" title="详细介绍" :width="1200" :fullscreen="isMobile">
								<div class="full-html-content" v-html="currentDressType.styleIntroduction"></div>
								<template #footer>
									<el-button @click="showFullHtml = false">关闭</el-button>
									<!-- <el-button type="primary" @click="copyHtmlContent">复制内容</el-button> -->
								</template>
							</el-dialog>
						</div>

					</div>
					<!-- 多图展示区域 -->
					<div class="image-gallery">
						<!-- 主图展示 -->
						<div class="main-image-container">
							<el-image :src="getImageUrl(currentImageId)" alt="款式图片" class="main-image" fit="cover"
								preview-teleported :preview-src-list="previewImageList" />
						</div>

						<!-- 缩略图导航（多图时显示） -->
						<!-- 						<div v-if="imageIds.length > 1" class="thumbnail-list">
							<div v-for="(id, index) in imageIds" :key="id" class="thumbnail-item"
								:class="{ active: currentImageIndex === index }" @click="switchImage(index)">
								<el-image :src="getImageUrl(id)" alt="缩略图" fit="cover" class="thumbnail" />
							</div>
						</div> -->
					</div>
					<!-- 					<el-image v-if="currentDressType.image && currentDressType.image !== 'null'"
						:src="getImageUrl(currentDressType.image)" alt="款式图片" class="type-image" fit="cover" /> -->
				</el-card>
				<el-empty v-else description="未获取到礼服类型信息" />
			</div>

			<!-- 右侧配伍图片展示区域 -->
			<div class="content">
				<el-row :gutter="30">
					<el-col v-for="match in currentPageDressMedia" :key="match.id" :span="6">
						<el-card class="item-card">
							<el-image :src="match.resourceLink" alt="配伍图片" class="item-image" fit="scale-down" lazy />
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
		onMounted,
		computed,
		watch
	} from 'vue';
	import {
		ArrowRight
	} from '@element-plus/icons-vue';
	import {
		useRouter,
		useRoute
	} from 'vue-router';
	import {
		ElMessage,
		ElTag,
		ElEmpty
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
		getAllDressMatchingInfos,
		getDressMatchingInfoById
	} from '/src/api/dress.js';

	const router = useRouter();
	const route = useRoute();

	// 当前礼服类型信息（从路由参数获取）
	const currentDressType = ref(null);
	// 配伍图片数据
	const dressMedia = ref([]);
	// 当前页码
	const currentPage = ref(1);
	// 每页显示数量
	const pageSize = ref(12);
	// 当前页的礼服数据
	const currentPageDressMedia = ref([]);

	// 图片相关变量
	const imageIds = ref([]); // 解析后的图片ID列表（如["249", "250", "251"]）
	const currentImageIndex = ref(0); // 当前显示的图片索引
	const currentImageId = ref(''); // 当前显示的图片ID  左侧主图
	const previewImageList = ref([]); // 用于大图预览的图片URL列表

	// 处理图片URL
	const getImageUrl = (imageId) => {
		// 根据实际图片存储地址规则拼接
		// return imageId ? `http://localhost:9000/grownkg/${imageId}` : '';
		return 'http://localhost:9000/grownkg/9670265c-6a1f-40ca-893d-64dbcf2f6783-左栏 长袍马褂配伍.jpg';
	};


	// 处理图片ID列表；分拆
	const parseImageIds = (imageStr) => {

		if (!imageStr || imageStr === 'null' || imageStr.trim() === '') {
			imageIds.value = [];
			currentImageIndex.value = 0;
			currentImageId.value = '';
			previewImageList.value = [];
			return;
		}

		// 分割字符串（支持分号或逗号分隔）
		const ids = imageStr.split(/[;,.]/).map(id => id.trim()).filter(id => id);
		imageIds.value = ids;
		currentImageIndex.value = 0;
		currentImageId.value = ids[0] || '';

		// 生成预览图URL列表
		previewImageList.value = ids.map(id => getImageUrl(id));
	};

	// 切换图片
	const switchImage = (index) => {
		if (index >= 0 && index < imageIds.value.length) {
			currentImageIndex.value = index;
			currentImageId.value = imageIds.value[index];
		}
	};

	// 监听currentDressType变化，重新解析图片ID
	watch(currentDressType, (newVal) => {
		if (newVal) {
			parseImageIds(newVal.image); // 从image字段解析图片ID列表
		}
	});


	// 响应式变量
	const showFullHtml = ref(false); // 控制弹窗显示
	const showCollapsed = ref(true); // 控制是否折叠
	const isMobile = ref(false); // 判断是否移动端

	// 处理HTML片段：提取纯文本并截断
	const truncatedHtml = computed(() => {
		if (!currentDressType.value?.styleIntroduction) return '无详细介绍';

		// 移除HTML标签，保留纯文本
		const plainText = currentDressType.value.styleIntroduction
			.replace(/<[^>]+>/g, '') // 移除所有HTML标签
			.replace(/\s+/g, ' ').trim(); // 去除多余空格

		// 截断到50字，添加省略号
		return plainText.length > 150 ?
			plainText.slice(0, 150) + '...' :
			plainText;
	});

	// 监听窗口尺寸，判断是否为移动端
	const checkMobile = () => {
		isMobile.value = window.innerWidth < 768;
	};

	// 复制HTML内容到剪贴板
	const copyHtmlContent = () => {
		if (!currentDressType.value?.styleIntroduction) {
			ElMessage.warning('无内容可复制');
			return;
		}

		// 复制纯文本（或保留HTML标签，根据需求选择）
		const plainText = currentDressType.value.styleIntroduction
			.replace(/<[^>]+>/g, '')
			.replace(/\s+/g, ' ').trim();

		navigator.clipboard.writeText(plainText).then(() => {
			ElMessage.success('内容已复制到剪贴板');
		}).catch(() => {
			ElMessage.error('复制失败，请手动复制');
		});
	};


	// // 礼服多媒体数据 --初始化为图片数据
	// const ids = ref('');
	// // 礼服多媒体数据 --根据IDS初始化为图片数据
	// const dressMedia = ref([]);

	// //根据图片IDS获取图片
	// const fetchDressImage = async () => {
	// 	try {
	// 		const response = await getDressesByIds(ids.value);
	// 		dressMedia.value = response.data;
	// 		handleCurrentChange(currentPage.value);
	// 	} catch (error) {
	// 		ElMessage.error('获取礼服图片数据失败：' + error.message);
	// 	}
	// };


	// 根据配伍ID获取图片
	const fetchMatchingImages = async (matchingIds) => {
		console.log(matchingIds);
		if (!matchingIds || matchingIds === 'null') {
			dressMedia.value = [];
			currentPageDressMedia.value = [];
			return;
		}

		try {
			// 1. 分割matchingIds字符串为单个ID数组（处理逗号分隔的ID列表）
			const idList = matchingIds.split(',').map(id => id.trim()).filter(id => id);
			if (idList.length === 0) {
				dressMedia.value = [];
				currentPageDressMedia.value = [];
				return;
			}

			// 2. 循环调用单个查询接口，获取所有配伍记录
			const matchingList = [];
			for (const id of idList) {
				try {
					// 调用只能接收单个ID的接口
					const response = await getDressMatchingInfoById(id);
					if (response.data) {
						matchingList.push(response.data);
					}
				} catch (singleError) {
					// 单个ID查询失败不阻断整体流程，仅打印日志
					console.warn(`获取配伍ID=${id}的信息失败:`, singleError);
				}
			}

			if (matchingList.length === 0) {
				dressMedia.value = [];
				currentPageDressMedia.value = [];
				ElMessage.info('未找到关联的配伍数据');
				return;
			}

			// 2. 提取所有配伍记录中的image字段（图片编码）
			const imageIds = new Set();
			matchingList.forEach(matching => {
				if (matching.image && matching.image !== 'null') {
					// 处理多图分隔符（假设用逗号或分号分隔）
					const ids = matching.image.split(/[,;]/);
					ids.forEach(id => {
						if (id.trim()) imageIds.add(id.trim());
					});
				}
			});

			if (imageIds.size === 0) {
				dressMedia.value = [];
				currentPageDressMedia.value = [];
				ElMessage.info('该款式暂无关联的配伍图片');
				return;
			}

			// 3. 将图片编码转为逗号分隔的字符串，调用接口获取图片资源
			const imageIdStr = Array.from(imageIds).join(';');
			const imageResponse = await getDressesByIds(imageIdStr);
			dressMedia.value = imageResponse.data;
			handleCurrentChange(currentPage.value);

		} catch (error) {
			console.log(error.message);
			ElMessage.error('获取配伍图片失败：' + error.message);
		}

	};

	// 获取当前礼服类型信息
	const fetchCurrentDressType = async () => {
		// 从路由参数获取礼服类型ID
		const {
			styleId
		} = route.query;
		if (!styleId) {
			ElMessage.warning('未指定礼服类型');
			return;
		}

		try {
			// 这里假设使用getDressStyleInfoById接口获取单个款式信息
			const response = await getDressStyleInfoById(styleId);
			currentDressType.value = response.data;

			// 获取配伍图片
			if (currentDressType.value.matchingId) {
				fetchMatchingImages(currentDressType.value.matchingId);
			}
		} catch (error) {
			ElMessage.error('获取礼服类型信息失败：' + error.message);
		}
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

	// 初始化时获取全量数据用于搜索
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

	// 可选：为不同标签设置不同颜色（根据实际标签内容调整）
	const getTagType = (tag) => {
		const tagMap = {
			'晚清': 'primary',
			'民国': 'success',
			'官服': 'warning',
			'中式': 'info',
			'婚礼服': 'danger',
			'民间嫁娶': 'warning',
			'中西融合': 'success',
			// 可根据实际标签扩展
		};
		return tagMap[tag] || 'default';
	};

	// 随机标签颜色（基于Element Plus支持的类型）
	// const getTagType = (index) => {
	// 	// Element Plus支持的tag类型，排除默认的"default"以突出显示
	// 	const tagTypes = ['primary', 'success', 'warning', 'info', 'danger'];

	// 	// 使用索引取余确保同一标签（相同位置）始终显示相同颜色
	// 	// 若想完全随机可改为：Math.floor(Math.random() * tagTypes.length)
	// 	return Math.floor(Math.random() * tagTypes.length);
	// };

	// 搜索处理函数
	const handleSearch = () => {
		if (!searchKeyword.value.trim()) {
			// 空搜索时重新加载当前礼服类型的配伍图片
			if (currentDressType.value?.matchingId) {
				fetchMatchingImages(currentDressType.value.matchingId);
			}
			return;
		}

		const keyword = searchKeyword.value.trim().toLowerCase();
		// 多维度匹配逻辑
		const matchedIds = new Set();

		// 1. 匹配礼服基础信息
		allDressData.value.dressBase.forEach(dress => {
			if (
				dress.dressName?.toLowerCase().includes(keyword) ||
				dress.dressType?.toLowerCase().includes(keyword) ||
				dress.belongingPeriod?.toLowerCase().includes(keyword) ||
				dress.dressTag?.toLowerCase().includes(keyword)
			) {
				if (dress.image) dress.image.split(';').forEach(id => matchedIds.add(id));
			}
		});

		// 2. 匹配款式信息
		allDressData.value.styles.forEach(style => {
			if (
				style.styleName?.toLowerCase().includes(keyword) ||
				style.styleCategory?.toLowerCase().includes(keyword) ||
				style.styleType?.toLowerCase().includes(keyword) ||
				style.belongingPeriod?.toLowerCase().includes(keyword) ||
				style.styleTag?.toLowerCase().includes(keyword)
			) {
				if (style.image) style.image.split(';').forEach(id => matchedIds.add(id));
			}
		});

		// 3. 匹配配伍信息
		allDressData.value.matchings.forEach(matching => {
			if (
				matching.matchingName?.toLowerCase().includes(keyword) ||
				matching.styleType?.toLowerCase().includes(keyword) ||
				matching.belongingPeriod?.toLowerCase().includes(keyword) ||
				matching.matchTag?.toLowerCase().includes(keyword)
			) {
				if (matching.image) matching.image.split(';').forEach(id => matchedIds.add(id));
			}
		});

		// 根据匹配到的图片ID获取资源
		if (matchedIds.size > 0) {
			fetchMatchingImages(Array.from(matchedIds).join(';'));
		} else {
			dressMedia.value = [];
			currentPageDressMedia.value = [];
			ElMessage.info('未找到匹配的礼服信息');
		}
	};

	// 初始化加载数据
	onMounted(() => {
		fetchCurrentDressType(); // 获取当前礼服类型信息
		initData(); // 加载全量数据用于搜索
		checkMobile();
		window.addEventListener('resize', checkMobile);
	});

	// 清理监听
	// onUnmounted(() => {
	// 	window.removeEventListener('resize', checkMobile);
	// });

	// 监听礼服数据变化，重置折叠状态
	watch(currentDressType, () => {
		showCollapsed.value = true;
	});
</script>

<style scoped>
	.container {
		display: flex;
		height: 100vh;
		position: relative;
		flex-direction: column;
	}

	.content-wrapper {
		display: flex;
		flex: 1;
		overflow: hidden;
	}

	/* 左侧礼服类型信息样式 */
	.category-list {
		width: 380px;
		background-color: #f5f5f5;
		border-right: 1px solid #ddd;
		flex-shrink: 0;
		padding: 20px;
		overflow-y: auto;
	}

	.type-card {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.type-info {
		flex: 1;
		margin-bottom: 15px;
	}

	.type-info h3 {
		margin-top: 0;
		margin-bottom: 15px;
		color: #333;
		border-bottom: 1px solid #eee;
		padding-bottom: 10px;
	}

	.type-info p {
		margin: 8px 0;
		line-height: 1.6;
	}

	.type-image {
		width: 100%;
		height: 200px;
		border-radius: 4px;
	}

	/* 右侧配伍图片区域样式 */
	.content {
		flex: 1;
		padding: 20px;
		overflow-y: auto;
	}

	.item-card {
		margin-bottom: 20px;
		transition: transform 0.3s ease;
	}

	.item-card:hover {
		transform: translateY(-5px);
	}

	.item-image {
		width: 100%;
		height: 190px;
	}

	/**搜索框样式*/
	.search-container {
		padding: 15px 20px;
		width: 100%;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
	}

	.el-input {
		width: 1500px;
	}

	.empty-tag {
		color: #999;
		font-style: italic;
	}

	/* 多图展示区域样式 */
	.image-gallery {
		margin-bottom: 15px;
		border: 1px solid #eee;
		border-radius: 4px;
		padding: 10px;
		background-color: #fafafa;
	}

	/* 主图容器 */
	.main-image-container {
		width: 100%;
		height: 280px;
		/* 固定主图高度，保持布局稳定 */
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		background-color: #fff;
		border-radius: 4px;
	}

	.main-image {
		max-width: 100%;
		max-height: 100%;
		transition: transform 0.3s ease;
	}

	.main-image:hover {
		transform: scale(1.02);
		/* hover时轻微放大，提升交互感 */
	}

	/* 缩略图列表 */
	.thumbnail-list {
		display: flex;
		gap: 8px;
		margin-top: 10px;
		padding-top: 10px;
		border-top: 1px dashed #eee;
		overflow-x: auto;
		/* 图片过多时横向滚动 */
		padding-bottom: 5px;
	}

	.thumbnail-item {
		width: 60px;
		height: 60px;
		border-radius: 4px;
		cursor: pointer;
		overflow: hidden;
		border: 2px solid transparent;
		transition: all 0.2s ease;
	}

	.thumbnail-item.active {
		border-color: #409eff;
		/* 选中状态高亮边框 */
	}

	.thumbnail-item:hover {
		transform: translateY(-2px);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.thumbnail {
		width: 100%;
		height: 100%;
	}

	/* 适配移动端 */
	@media (max-width: 768px) {
		.main-image-container {
			height: 200px;
		}

		.thumbnail-item {
			width: 50px;
			height: 50px;
		}
	}
</style>