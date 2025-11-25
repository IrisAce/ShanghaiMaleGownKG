<template>
	<el-container>
		<el-header style="text-align: right; font-size: 12px">
			<el-button type="primary" @click="goToAddPage" style="float: left;">新增主体款式</el-button>
		</el-header>

		<el-table :data="dressStyleInfos" max-height="800px" stripe>
			<el-table-column prop="styleName" label="款式名称"></el-table-column>
			<el-table-column prop="styleIntroduction" label="款式介绍" width='600px' show-overflow-tooltip=true
				resizable=true></el-table-column>
			<el-table-column prop="styleCategory" label="款式分类"></el-table-column>
			<el-table-column prop="styleType" label="款式类型"></el-table-column>
			<el-table-column prop="belongingPeriod" label="归属时期"></el-table-column>
			<el-table-column prop="matchingId" label="配伍ID"></el-table-column>
			<el-table-column prop="styleTag" label="款式标签"></el-table-column>
			<el-table-column label="操作">
				<template #default="scope">
					<el-button type="danger" @click="confirmDelete(scope.row.styleId)">删除</el-button>
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
		getAllDressStyleInfos,
		deleteDressStyleInfo
	} from '/src/api/dress.js';

	const router = useRouter();
	const dressStyleInfos = ref([]);

	const fetchDressStyleInfos = async () => {
		try {
			const response = await getAllDressStyleInfos();
			dressStyleInfos.value = response.data;
		} catch (error) {
			ElMessage.error('获取礼服主体款式信息失败：' + error.message);
		}
	};

	const confirmDelete = (styleId) => {
		ElMessageBox.confirm('确定要删除该礼服主体款式信息吗？', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		}).then(async () => {
			try {
				await deleteDressStyleInfo(styleId);
				ElMessage.success('删除成功');
				fetchDressStyleInfos();
			} catch (error) {
				ElMessage.error('删除失败：' + error.message);
			}
		}).catch(() => {
			ElMessage.info('已取消删除');
		});
	};

	const goToAddPage = () => {
		router.push({
			name: 'DressStyleInfoAdd'
		});
	};

	onMounted(() => {
		fetchDressStyleInfos();
	});
</script>