<template>
	<el-form ref="addStyleFormRef" :model="newStyle" :rules="styleRules" label-width="120px">
		<el-form-item label="款式名称" prop="name">
			<el-input v-model="newStyle.name"></el-input>
		</el-form-item>
		<el-form-item label="款式描述" prop="description">
			<el-input v-model="newStyle.description"></el-input>
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

	const addStyleFormRef = ref(null);
	const newStyle = ref({
		name: '',
		description: ''
	});

	const styleRules = {
		name: [{
			required: true,
			message: '请输入款式名称',
			trigger: 'blur'
		}],
		description: [{
			required: true,
			message: '请输入款式描述',
			trigger: 'blur'
		}]
	};

	const submitForm = () => {
		addStyleFormRef.value.validate((valid) => {
			if (valid) {
				// 发送请求到后端保存款式数据
				console.log('提交款式数据', newStyle.value);
			} else {
				console.log('表单校验失败');
			}
		});
	};

	const resetForm = () => {
		addStyleFormRef.value.resetFields();
	};
</script>

<style scoped>
	/* 表单样式可根据需求调整 */
</style>