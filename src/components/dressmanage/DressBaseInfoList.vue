<template>
	<el-container>
		<el-header style="text-align: right; font-size: 12px">
			<el-button type="primary" @click="goToAddPage" style="float: left;">新增礼服</el-button>
		</el-header>

		<el-table :data="dressBaseInfos" max-height="800px" stripe>
			<el-table-column prop="dressName" label="礼服名称"></el-table-column>
			<el-table-column prop="dressIntroduction" label="礼服介绍" width='600px' show-overflow-tooltip=true
				resizable=true></el-table-column>
			<el-table-column prop="dressType" label="礼服风格"></el-table-column>
			<el-table-column prop="belongingPeriod" label="归属时期"></el-table-column>
			<el-table-column label="操作">
				<template #default="scope">
					<el-button type="danger" @click="confirmDelete(scope.row.dressId)">删除</el-button>
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
		getAllDressBaseInfos,
		deleteDressBaseInfo
	} from '/src/api/dress.js';

	const router = useRouter();
	const dressBaseInfos = ref([]);

	const fetchDressBaseInfos = async () => {
		try {
			const response = await getAllDressBaseInfos();
			dressBaseInfos.value = response.data;
		} catch (error) {
			ElMessage.error('获取礼服基础信息失败：' + error.message);
		}
	};

	const confirmDelete = (dressId) => {
		ElMessageBox.confirm('确定要删除该礼服基础信息吗？', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		}).then(async () => {
			try {
				await deleteDressBaseInfo(dressId);
				ElMessage.success('删除成功');
				fetchDressBaseInfos();
			} catch (error) {
				ElMessage.error('删除失败：' + error.message);
			}
		}).catch(() => {
			ElMessage.info('已取消删除');
		});
	};

	const goToAddPage = () => {
		router.push({
			name: 'DressBaseInfoAdd'
		});
	};

	onMounted(() => {
		fetchDressBaseInfos();
	});
</script>

<style>
	/* 表格样式优化 */
	.el-table {
		background-color: #FFFFF0;
		/* 象牙白背景 */
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
	}

	.el-table th {
		background-color: #1A365D;
		/* 藏蓝表头 */
		color: white;
	}

	.el-table tr:hover>td {
		background-color: rgba(248, 200, 220, 0.1);
		/* 柔粉hover效果 */
	}

	/* 按钮样式 */
	.el-button--primary {
		background-color: #1A365D;
		border-color: #1A365D;
	}

	.el-button--primary:hover {
		background-color: #2C5282;
		border-color: #2C5282;
	}

	.el-button--danger {
		background-color: #E53E3E;
		border-color: #E53E3E;
	}

	/* 操作列按钮 */
	.el-table-column__content .el-button {
		margin-right: 8px;
	}
</style>