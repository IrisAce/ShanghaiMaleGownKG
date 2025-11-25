<template>
	<el-card class="crawler-tool" shadow="hover">
		<div slot="header" class="card-header">
			<span>近代上海男性礼服图片爬取工具</span>
		</div>

		<el-form :model="crawlForm" :rules="rules" ref="formRef" label-width="120px" class="crawl-form">
			<el-form-item label="礼服类别" prop="category">
				<el-select v-model="crawlForm.category" placeholder="请选择礼服类别">
					<el-option label="婚礼服" value="婚礼服"></el-option>
					<el-option label="丧礼服" value="丧礼服"></el-option>
					<el-option label="社交礼服" value="社交礼服"></el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="爬取数量" prop="num">
				<el-select v-model="crawlForm.num" placeholder="请选择爬取数量">
					<el-option label="10张" value="10"></el-option>
					<el-option label="20张" value="20"></el-option>
					<el-option label="30张" value="30"></el-option>
					<el-option label="50张" value="50"></el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="历史时期筛选">
				<el-checkbox-group v-model="selectedPeriods">
					<el-checkbox label="1843-1911（清末）"></el-checkbox>
					<el-checkbox label="1912-1927（民初）"></el-checkbox>
					<el-checkbox label="1937-1945（抗战）"></el-checkbox>
					<el-checkbox label="1945-1949（解放前夕）"></el-checkbox>
				</el-checkbox-group>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="startCrawl" :loading="isLoading" :icon="Search">
					开始爬取
				</el-button>
				<el-button @click="resetForm" :disabled="isLoading" style="margin-left: 10px">
					重置
				</el-button>
				<el-button type="success" @click="saveSelectedImages" :disabled="!hasSelectedImages || isLoading"
					style="margin-left: 10px" :icon="Upload">
					保存到知识库
				</el-button>
			</el-form-item>
		</el-form>

		<!-- 加载状态 -->
		<el-progress v-if="isLoading && progress > 0" :percentage="progress" stroke-width="4"
			style="margin: 20px 0"></el-progress>

		<!-- 爬取结果展示 -->
		<div v-if="imageList.length > 0" class="result-container">
			<el-descriptions column="1" border>
				<el-descriptions-item label="爬取结果">
					共获取 {{ imageList.length }} 张图片
					<template v-if="filteredImages.length < imageList.length">
						，筛选后显示 {{ filteredImages.length }} 张
					</template>
				</el-descriptions-item>
			</el-descriptions>

			<el-row :gutter="15" class="image-grid">
				<el-col :span="6" v-for="(img, index) in filteredImages" :key="index" class="image-item">
					<el-card shadow="hover" class="image-card">
						<div class="image-wrapper">
							<el-checkbox v-model="img.selected" class="image-checkbox"
								@change="handleSelectChange"></el-checkbox>
							<el-image :src="img.url" :alt="img.title" lazy fit="contain"
								@error="handleImageError(index)">
								<template #error>
									<div class="image-error">加载失败</div>
								</template>
							</el-image>
							<div class="image-meta">
								<el-tag size="mini">{{ img.period }}</el-tag>
								<el-tag size="mini" type="info">{{ img.category }}</el-tag>
							</div>
						</div>
						<div class="image-info">
							<p class="image-title">{{ img.title || '无标题' }}</p>
							<el-button icon="el-icon-download" size="mini" type="text"
								@click="downloadImage(img.url)"></el-button>
						</div>
					</el-card>
				</el-col>
			</el-row>
		</div>

		<!-- 无结果提示 -->
		<el-empty v-if="!isLoading && imageList.length === 0 && hasSearched" description="未找到相关图片，请尝试其他类别"></el-empty>
	</el-card>
</template>

<script setup>
	import {
		ref,
		reactive,
		computed
	} from 'vue';
	import {
		ElMessage,
		ElMessageBox
	} from 'element-plus';
	import axios from 'axios';
	import {
		Search,
		Upload
	} from '@element-plus/icons-vue';
	// import {
	// 	saveToKnowledgeBase
	// } from '../../api/knowledge'; //TODO  保存逻辑暂未设计

	// 表单状态
	const formRef = ref(null);
	const crawlForm = reactive({
		category: '',
		num: '20'
	});

	// 爬取状态
	const isLoading = ref(false);
	const progress = ref(0);
	const imageList = ref([]);
	const hasSearched = ref(false);
	const hasSelectedImages = ref(false);
	const selectedPeriods = ref([]);

	// 表单验证规则
	const rules = {
		category: [{
			required: true,
			message: '请选择礼服类别',
			trigger: 'change'
		}],
		num: [{
			required: true,
			message: '请选择爬取数量',
			trigger: 'change'
		}]
	};

	// 筛选后的图片列表
	const filteredImages = computed(() => {
		if (selectedPeriods.value.length === 0) {
			return imageList.value;
		}
		return imageList.value.filter(img =>
			selectedPeriods.value.includes(img.period)
		);
	});

	// 开始爬取
	const startCrawl = async () => {
		formRef.value.validate(async (valid) => {
			if (valid) {
				try {
					isLoading.value = true;
					progress.value = 10;
					hasSearched.value = true;
					imageList.value = [];

					// 调用后端精准爬取接口
					const response = await axios.post('http://localhost:8080/api/crawl/historical-costumes', {
						category: crawlForm.category,
						num: parseInt(crawlForm.num, 10)
					}, {
						onUploadProgress: (e) => {
							if (e.total) {
								progress.value = Math.min(90, Math.floor((e.loaded / e
									.total) * 100));
							}
						}
					});

					// 处理返回结果
					imageList.value = response.data.map(img => ({
						...img,
						selected: false
					}));
					progress.value = 100;
					ElMessage.success(`成功爬取 ${imageList.value.length} 张图片`);
				} catch (error) {
					ElMessage.error(
					`爬取失败：${error.response?.data?.message || error.message || '网络异常'}`);
				} finally {
					setTimeout(() => {
						isLoading.value = false;
						progress.value = 0;
					}, 500);
				}
			}
		});
	};

	// 其他方法保持不变（重置、下载、保存等）
	const resetForm = () => {
		formRef.value.resetFields();
		imageList.value = [];
		hasSearched.value = false;
		hasSelectedImages.value = false;
		selectedPeriods.value = [];
	};

	const handleImageError = (index) => {
		imageList.value[index].url = 'https://cube.elemecdn.com/e/fd/0fc7d205b32912d4e64e6895790jpeg.jpeg';
	};

	const downloadImage = (url) => {
		try {
			const link = document.createElement('a');
			link.href = url;
			link.download = `costume-${new Date().getTime()}.jpg`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			ElMessage.success('图片下载已开始');
		} catch (error) {
			ElMessage.error('下载失败，请手动保存');
		}
	};

	const handleSelectChange = () => {
		hasSelectedImages.value = imageList.value.some(img => img.selected);
	};

	const saveSelectedImages = async () => {
		const selectedImages = imageList.value.filter(img => img.selected);
		if (selectedImages.length === 0) {
			ElMessage.warning('请先选择要保存的图片');
			return;
		}

		try {
			await saveToKnowledgeBase(selectedImages);
			ElMessage.success(`已成功保存 ${selectedImages.length} 张图片到知识库`);
			// 取消选中状态
			imageList.value.forEach(img => img.selected = false);
			hasSelectedImages.value = false;
		} catch (error) {
			ElMessage.error('保存失败：' + error.message);
		}
	};
</script>

<style scoped>
	/* 样式保持与原有项目一致 */
	.image-meta {
		position: absolute;
		bottom: 5px;
		left: 5px;
		display: flex;
		gap: 5px;
	}

	.image-title {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 12px;
		margin: 0;
	}
</style>