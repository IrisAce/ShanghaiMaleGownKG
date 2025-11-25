<template>
	<el-contains>
		<el-header height="200px">
			<el-carousel :interval="40000000" height="200px" >
				<el-carousel-item v-for="dress in dresses" :key="dress.dressId">
					<el-image class="carousel-image" fit="fill" :src="imageUrl(dress.resourceLink)" alt="三维模型图片" />
					<h4 >{{dress.resourceName}}</h4>
				</el-carousel-item>
			</el-carousel>
		</el-header>
		<el-main class="dress-display">

			<!-- 中间图片陈列区域 -->
			<div class="image-display">
				<el-image :src="imageUrl(dress.resourceLink)" alt="礼服图片" v-for="dress in dresses"
					:key="dress.dressId" />
			</div>

		</el-main>
	</el-contains>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue';
	import {
		ElMessage
	} from 'element-plus';
	import {
		getDressesByPeriod,
		getDressesByIds
	} from '/src/api/dress.js';

	// 时间轴节点
	const periods = ref(['晚清', '民国']);
	// 当前选中的时期
	const activePeriod = ref('晚清');
	const ids = ref('1;2;3');
	// 礼服数据
	const dresses = ref([]);

	// 获取礼服数据
	const fetchDresses = async () => {
		try {
			const response = await getDressesByIds(ids.value);
			dresses.value = response.data;
		} catch (error) {
			ElMessage.error('获取礼服数据失败：' + error.message);
		}
	};

	// 切换时期
	const changePeriod = (period) => {
		activePeriod.value = period;
		fetchDresses();
	};

	// 生成图片 URL
	const imageUrl = (image) => {
		// 这里需要根据实际情况处理图片 URL，例如拼接 MinIO 服务器地址
		return image;
	};

	onMounted(() => {
		fetchDresses();
	});
</script>

<style scoped>
	.dress-display {
		padding: 20px;
	}

	.image-display {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 20px;
	}

	.three-d-model-display {
		display: flex;
		gap: 10px;
		margin-top: 20px;
		overflow-x: auto;
	}
	
	.carousel-image{
		display: flex;
	}
</style>