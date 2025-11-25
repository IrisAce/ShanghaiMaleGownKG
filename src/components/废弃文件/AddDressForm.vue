<template>
	<el-form ref="addDressFormRef" :model="newDress" :rules="dressRules" label-width="120px">
		<el-form-item label="礼服名称" prop="name">
			<el-input v-model="newDress.name"></el-input>
		</el-form-item>
		<el-form-item label="归属时期" prop="period">
			<el-input v-model="newDress.period"></el-input>
		</el-form-item>
		<el-form-item label="主题服装款式" prop="style">
			<el-input v-model="newDress.style"></el-input>
		</el-form-item>
		<el-form-item label="服饰品" prop="accessories">
			<el-input v-model="newDress.accessories"></el-input>
		</el-form-item>
		<el-form-item label="成套配伍" prop="match">
			<el-input v-model="newDress.match"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="submitForm">提交</el-button>
			<el-button @click="resetForm">重置</el-button>
		</el-form-item>
	</el-form>
</template>

<script setup>
	import {
		ref
	} from 'vue';

	const addDressFormRef = ref(null);
	const newDress = ref({
		name: '',
		period: '',
		style: '',
		accessories: '',
		match: ''
	});

	const dressRules = {
		name: [{
			required: true,
			message: '请输入礼服名称',
			trigger: 'blur'
		}],
		period: [{
			required: true,
			message: '请输入归属时期',
			trigger: 'blur'
		}],
		style: [{
			required: true,
			message: '请输入主题服装款式',
			trigger: 'blur'
		}],
		accessories: [{
			required: true,
			message: '请输入服饰品',
			trigger: 'blur'
		}],
		match: [{
			required: true,
			message: '请输入成套配伍',
			trigger: 'blur'
		}]
	};

	const submitForm = () => {
		addDressFormRef.value.validate((valid) => {
			if (valid) {
				// 发送请求到后端保存礼服数据
				console.log('提交礼服数据', newDress.value);
			} else {
				console.log('表单校验失败');
			}
		});
	};

	const resetForm = () => {
		addDressFormRef.value.resetFields();
	};
</script>

<style scoped>
	/* 表单样式可根据需求调整 */
</style>