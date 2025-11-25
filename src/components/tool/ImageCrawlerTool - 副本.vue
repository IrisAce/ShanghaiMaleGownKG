<template>
	<el-card class="crawler-tool" shadow="hover">
		<div slot="header" class="card-header">
			<span>影视作品关联图片爬取工具</span>
		</div>

		<el-form :model="crawlForm" :rules="rules" ref="formRef" label-width="120px" class="crawl-form">
			<el-form-item label="搜索关键词" prop="keyword">
				<el-input v-model="crawlForm.keyword" placeholder="例如：晚清婚礼服" clearable maxlength="50"></el-input>
			</el-form-item>

			<el-form-item label="爬取数量" prop="count">
				<el-select v-model="crawlForm.count" placeholder="请选择爬取数量">
					<el-option label="5张" value="5"></el-option>
					<el-option label="10张" value="10"></el-option>
					<el-option label="20张" value="20"></el-option>
					<el-option label="30张" value="30"></el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="爬取来源">
				<el-radio-group v-model="crawlForm.source" size="small">
					<el-radio label="baidu">百度图片</el-radio>
					<el-radio label="bing">必应图片</el-radio>
				</el-radio-group>
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
					保存选中图片
				</el-button>
			</el-form-item>
		</el-form>

		<!-- 加载状态 -->
		<el-progress v-if="isLoading && progress > 0" :percentage="progress" stroke-width="4"
			style="margin: 20px 0"></el-progress>

		<!-- 爬取结果展示 -->
		<div v-if="imageList.length > 0" class="result-container">
			<el-descriptions column="1" border>
				<el-descriptions-item label="爬取结果">共获取 {{ imageList.length }} 张图片</el-descriptions-item>
			</el-descriptions>

			<el-row :gutter="15" class="image-grid">
				<el-col :span="6" v-for="(img, index) in imageList" :key="index" class="image-item">
					<el-card shadow="hover" class="image-card">
						<div class="image-wrapper">
							<el-checkbox v-model="img.selected" class="image-checkbox"
								@change="handleSelectChange"></el-checkbox>
							<el-image :src="img.url" alt="爬取图片" lazy fit="contain" @error="handleImageError(index)">
								<template #error>
									<div class="image-error">加载失败</div>
								</template>
							</el-image>
						</div>
						<div class="image-info">
							<el-tag size="small" type="info">{{ img.width }}×{{ img.height }}</el-tag>
							<el-button icon="el-icon-download" size="mini" type="text"
								@click="downloadImage(img.url)"></el-button>
						</div>
					</el-card>
				</el-col>
			</el-row>
		</div>

		<!-- 无结果提示 -->
		<el-empty v-if="!isLoading && imageList.length === 0 && hasSearched" description="未找到相关图片，请尝试其他关键词"></el-empty>
	</el-card>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted
	} from 'vue';
	import {
		ElMessage,
		ElMessageBox
	} from 'element-plus';
	import axios from 'axios';
	import {
		Search,
		Upload,
		Download
	} from '@element-plus/icons-vue';
	import {
		saveDressStyleInfo
	} from '../../api/dress'; // 复用礼服款式保存接口

	// 表单状态
	const formRef = ref(null);
	const crawlForm = reactive({
		keyword: '',
		count: '10',
		source: 'baidu'
	});

	// 爬取状态
	const isLoading = ref(false);
	const progress = ref(0);
	const imageList = ref([]);
	const hasSearched = ref(false);
	const hasSelectedImages = ref(false);

	// 表单验证规则
	const rules = {
		keyword: [{
				required: true,
				message: '请输入搜索关键词',
				trigger: 'blur'
			},
			{
				min: 2,
				message: '关键词长度至少为2个字符',
				trigger: 'blur'
			}
		],
		count: [{
			required: true,
			message: '请选择爬取数量',
			trigger: 'change'
		}]
	};

	// 开始爬取 - 主要修改此处接口调用参数
	const startCrawl = async () => {
		formRef.value.validate(async (valid) => {
			if (valid) {
				try {
					isLoading.value = true;
					progress.value = 10;
					hasSearched.value = true;
					imageList.value = [];
					// axios.post(`${baseUrl}/dress-matching-info`,
					// 调用后端爬虫接口 - 修改接口路径和参数格式
					//url
					const response = await axios.post('http://localhost:8080/api/image-crawl', {
						keyword: crawlForm.keyword,
						num: parseInt(crawlForm.count, 10), // 转换为数字类型
						source: crawlForm.source
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
					ElMessage.error(`爬取失败：${error.message || '网络异常'}`);
				} finally {
					setTimeout(() => {
						isLoading.value = false;
						progress.value = 0;
					}, 500);
				}
			}
		});
	};

	// 其他方法保持不变
	const resetForm = () => {
		formRef.value.resetFields();
		imageList.value = [];
		hasSearched.value = false;
		hasSelectedImages.value = false;
	};

	const handleImageError = (index) => {
		imageList.value[index].url = 'https://cube.elemecdn.com/e/fd/0fc7d205b32912d4e64e6895790jpeg.jpeg'; // 占位图
	};

	const downloadImage = (url) => {
		try {
			const link = document.createElement('a');
			link.href = url;
			link.download = `crawl-${new Date().getTime()}.jpg`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			ElMessage.success('下载已开始');
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
			ElMessageBox.prompt('请输入礼服款式名称', '保存图片', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputValidator: (value) => {
					if (!value) return '款式名称不能为空';
					if (value.length > 50) return '名称长度不能超过50个字符';
					return true;
				}
			}).then(async ({
				value
			}) => {
				isLoading.value = true;
				// 调用礼服款式保存接口（复用现有接口）
				const styleData = {
					styleName: value,
					styleIntroduction: `自动爬取图片：${crawlForm.keyword}`,
					styleCategory: '礼服',
					styleType: '传统',
					belongingPeriod: crawlForm.keyword.includes('晚清') ? '晚清' : crawlForm.keyword
						.includes('民国') ? '民国' : '近代',
					styleTag: crawlForm.keyword,
					image: selectedImages.map(img => img.url).join(';') // 存储图片URL
				};

				await saveDressStyleInfo(styleData, null); // dressId可为空
				ElMessage.success('图片已成功保存到礼服库');
				// 取消选中状态
				imageList.value.forEach(img => img.selected = false);
				hasSelectedImages.value = false;
			});
		} catch (error) {
			if (error !== 'cancel') {
				ElMessage.error('保存失败：' + error.message);
			}
		} finally {
			isLoading.value = false;
		}
	};

	onMounted(() => {
		// 组件挂载时初始化
	});
</script>


<style scoped>
	.crawler-tool {
		max-width: 1200px;
		margin: 20px auto;
		padding: 20px;
	}

	.card-header {
		font-size: 18px;
		font-weight: bold;
	}

	.crawl-form {
		margin-bottom: 30px;
	}

	.result-container {
		margin-top: 20px;
	}

	.image-grid {
		margin-top: 15px;
	}

	.image-item {
		margin-bottom: 20px;
	}

	.image-card {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.image-wrapper {
		position: relative;
		width: 100%;
		height: 200px;
		overflow: hidden;
		background-color: #f5f5f5;
	}

	.image-checkbox {
		position: absolute;
		top: 10px;
		right: 10px;
		z-index: 10;
		background-color: rgba(255, 255, 255, 0.8);
		border-radius: 50%;
	}

	.el-image {
		width: 100%;
		height: 100%;
	}

	.image-error {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #999;
		background-color: #f5f5f5;
	}

	.image-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 0;
		margin-top: auto;
	}
</style>