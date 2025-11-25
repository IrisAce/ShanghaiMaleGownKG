<template>
	<div class="home-container">
		<div class="header">
			<div class="horizontal-timeline">
				<el-timeline>
					<el-timeline-item v-for="(item, index) in timelineItems" :key="index" placement="top">
						<div class="timeline-node" @click="handleTimelineClick(item)">
							<span class="year">{{ item.year }}</span>
							<div class="circle" :style="{ backgroundColor: item.isSelected? '#67C23A' : '#9d9d9d' }">
							</div>
							<span class="dislabel">{{ item.dislabel }}</span>
						</div>
					</el-timeline-item>
				</el-timeline>
			</div>
			<div class="back-button">
				<el-button type="success" @click="goGrownKG" :icon="DataAnalysis">图谱</el-button>
			</div>
		</div>
		<div class="dress-display">
			<!-- 读取礼服基础信息列表DressBasicInfo -->
			<el-row :gutter="20" type="flex" justify="center">
				<el-col v-for="dress in dresses" :key="dress.id" :span="6">
					<el-card :body-style="{ padding: '0px' }">
						<el-image :src="dress.dressImg" alt="礼服图片"
							style="width: 100%; height: 300px; object-fit: contain;" />
						<div class="dress-info" style="padding: 10px;">
							<h3>{{ dress.dressName }}
								<el-button @click="dressClick(dress.image)" type="primary" round>示例图片</el-button>
								<el-button @click="goDressItem(dress)" type="warning" round>详细介绍</el-button>
							</h3>
						</div>
					</el-card>
				</el-col>
			</el-row>
		</div>
		<div class="dress-display scrollable-container">
			<!-- 读取礼服基础信息对应的资源列表 -->
			<el-row :gutter="20" class="scrollable-row">
				<!-- 为el-col添加span属性 -->
				<el-col v-for="dress in dressMedia" :key="dress.id" :span="6" style="flex-shrink: 0;">
					<el-card :body-style="{ padding: '0px' }">
						<el-image :src="dress.resourceLink" alt="礼服样图" style=" height: 300px; object-fit: fill;" />
						<div class="dress-info" style="padding: 10px;">
							<!-- <h3>{{ dress.resourceName }}</h3> -->
							<!-- <p>{{ dress.description }}</p> -->
						</div>
					</el-card>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script setup>
	import {
		ref,
		computed,
		onMounted
	} from 'vue';
	import {
		getDressesByIds,
		getAllDressBaseInfos,
		getDressByPerid
	} from '/src/api/dress.js';
	import {
		ElMessage
	} from 'element-plus';
	import {
		useRouter
	} from 'vue-router';
	import {
		DataAnalysis
	} from '@element-plus/icons-vue';

	// 礼服数据
	const dresses = ref([]);
	// 模拟资源列表，读取礼服的属性image
	const ids = ref('');
	const period = ref('晚清');
	const router = useRouter();

	// 获取礼服数据
	/**
	 * 1、获取所有礼服信息
	 * 2、通过礼服数据，调用fetchDressImage
	 */
	const fetchDresses = async () => {
		try {
			const response = await getDressByPerid(period.value);
			dresses.value = response.data;
			// ids.value = response.data.image;
		} catch (error) {
			ElMessage.error('获取礼服数据失败：' + error.message);
		}
	};

	//礼服多媒体数据 --初始化为图片数据
	const dressMedia = ref([]);
	const fetchDressImage = async () => {
		try {
			const response = await getDressesByIds(ids.value);
			dressMedia.value = response.data;
		} catch (error) {
			ElMessage.error('获取礼服图片数据失败：' + error.message);
		}
	};

	const dressClick = (param) => {
		ids.value = param;
		fetchDressImage();
		// 可以在这里对选中的值进行处理，例如更新状态等
	};

	//实现时间轴
	const timelineItems = ref([{
			year: '1843年',
			dislabel: '上海开埠',
			label: '晚清',
			isSelected: true
		},
		{
			year: '1912年',
			dislabel: '民国元年',
			label: '民国',
			isSelected: false
		},
		{
			year: '1949年',
			dislabel: '民国末年',
			label: '民国',
			isSelected: false
		}
	]);



	//点击时间轴，切换所属时期
	const handleTimelineClick = (item) => {
		// 取消其他节点的选中状态
		timelineItems.value.forEach(i => {
			i.isSelected = false;
		});
		// 设置当前节点为选中状态
		item.isSelected = true;
		period.value = item.label;
		fetchDresses();
		// 清空dressMedia数据
		dressMedia.value = [];
	};

	//跳转至详情页
	const goDressItem = (dress) => {
		// 将对象序列化为JSON字符串
		const dressString = JSON.stringify(dress);
		// 通过query传递参数
		router.push({
			path: '/dressitem',
			query: {
				dress: dressString
			}
		});
	};

	// 跳转至/kg页面
	const goGrownKG = () => {
		router.push('/kg');
	};

	onMounted(() => {
		fetchDresses();
		fetchDressImage();
	});
</script>

<style scoped>
	.dress-display {
		padding: 20px;
		background-color: #f9f4dc;
	}

	.home-container {
		/* background-color: #f9f4dc; */
	}

	.dress-info h3 {
		margin-top: 0;
		font-size: 18px;
	}

	.dress-info p {
		margin-bottom: 0;
		font-size: 14px;
		color: #666;
	}

	.scrollable-container {
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		/* 增强移动端滚动体验 */
	}

	.scrollable-row {
		display: flex;
		flex-wrap: nowrap;
		/* 防止换行 */
	}

	/**
 * 实现横向时间轴效果
 */
	.horizontal-timeline {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 10px;
		padding-left: 10px;
		padding-right: 10px;
		flex: 1;
	}

	.el-timeline {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		width: 100%;
		font-size: 20px;
	}

	.el-timeline-item {
		flex: 1;
		text-align: center;
		position: relative;
	}

	.el-timeline-item::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		height: 2px;
		background-color: #797a7d;
		z-index: -1;
	}

	.el-timeline-item:not(:last-child)::after {
		content: attr(data-label);
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: #333;
		font-size: 14px;
	}

	.timeline-node {
		display: flex;
		flex-direction: column;
		align-items: center;
		cursor: pointer;
	}

	.year {
		font-size: 14px;
		color: #333;
		margin-bottom: 5px;
	}

	.circle {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background-color: #409eff;
		margin-top: 10px;
	}

	.dislabel {
		font-size: 16px;
		color: #333;
		margin-top: 5px;
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.back-button {
		padding: 10px;
	}
</style>