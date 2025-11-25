<template>
	<el-container>
		<el-header style="text-align: right; font-size: 12px">
			<el-button type="primary" @click="goToAddPage" style="float: left;">新增配伍</el-button>
		</el-header>
	
		<el-table :data="dressMatchingInfos"  max-height="800px" stripe>
			<el-table-column prop="matchingName" label="配伍名称"></el-table-column>
			<el-table-column prop="matchingIntroduction" label="配伍介绍"  width='600px' show-overflow-tooltip=true resizable=true></el-table-column>
			<el-table-column prop="matchingComposition" label="配伍组成"></el-table-column>
			<el-table-column prop="styleType" label="款式类型"></el-table-column>
			<el-table-column prop="belongingPeriod" label="归属时期"></el-table-column>
			<el-table-column label="操作">
				<template #default="scope">
					<el-button type="danger" @click="confirmDelete(scope.row.matchingId)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
	</el-container>
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
		ElMessage,
		ElMessageBox
	} from 'element-plus';
	import {
		getAllDressMatchingInfos,
		deleteDressMatchingInfo
	} from '/src/api/dress.js';

	const router = useRouter();
	const dressMatchingInfos = ref([]);

	const fetchDressMatchingInfos = async () => {
		try {
			const response = await getAllDressMatchingInfos();
			dressMatchingInfos.value = response.data;
		} catch (error) {
			ElMessage.error('获取成套配伍信息失败：' + error.message);
		}
	};

	const confirmDelete = (matchingId) => {
		ElMessageBox.confirm('确定要删除该成套配伍信息吗？', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		}).then(async () => {
			try {
				await deleteDressMatchingInfo(matchingId);
				ElMessage.success('删除成功');
				fetchDressMatchingInfos();
			} catch (error) {
				ElMessage.error('删除失败：' + error.message);
			}
		}).catch(() => {
			ElMessage.info('已取消删除');
		});
	};

	const goToAddPage = () => {
		router.push({
			name: 'DressMatchingInfoAdd'
		});
	};

	onMounted(() => {
		fetchDressMatchingInfos();
	});
</script>