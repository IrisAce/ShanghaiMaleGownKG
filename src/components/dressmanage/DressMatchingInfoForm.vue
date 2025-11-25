<template>
	<el-form ref="formRef" :model="dressMatchingInfo" :rules="rules" label-width="120px" style="max-width: 1000px">
		<!-- 配伍名称 -->
		<el-form-item label="配伍名称" prop="matchingName">
			<el-input v-model="dressMatchingInfo.matchingName"></el-input>
		</el-form-item>
		<!-- 配伍介绍 -->
		<el-form-item label="配伍介绍" prop="matchingIntroduction">
			<el-input type="textarea" v-model="dressMatchingInfo.matchingIntroduction"></el-input>
		</el-form-item>
		<!-- 配伍组成 -->
		<el-form-item label="配伍组成" prop="matchingComposition">
			<el-input type="textarea" v-model="dressMatchingInfo.matchingComposition"></el-input>
		</el-form-item>
		<!-- 款式类型 -->
		<el-form-item label="款式类型" prop="styleType">
			<el-select v-model="dressMatchingInfo.styleType">
				<el-option label="官服" value="官服"></el-option>
				<el-option label="民服" value="民服"></el-option>
				<el-option label="中式" value="中式"></el-option>
				<el-option label="西式" value="西式"></el-option>
				<el-option label="中西融合式" value="中西融合式"></el-option>
				<el-option label="五服制" value="五服制"></el-option>
			</el-select>
		</el-form-item>
		<!-- 归属时期 -->
		<el-form-item label="归属时期" prop="belongingPeriod">
			<el-select v-model="dressMatchingInfo.belongingPeriod">
				<el-option label="民国" value="民国"></el-option>
				<el-option label="晚清" value="晚清"></el-option>
			</el-select>
		</el-form-item>
		<!-- 所属礼服 ID -->
		<!-- 	<el-form-item label="所属礼服 ID" prop="dressId">
			<el-input v-model="dressMatchingInfo.dressId"></el-input>
		</el-form-item> -->
		<!-- 所属礼服 ID -->
		<el-form-item label="所属礼服" prop="dressId">
			<el-select v-model="dressMatchingInfo.dressId" placeholder="请选择所属礼服">
				<el-option v-for="dress in dressOptions" :key="dress.dressId" :label="dress.dressName"
					:value="dress.dressId"></el-option>
			</el-select>
		</el-form-item>
		<!-- 自定义服装款式标签 -->
		<el-form-item label="标签" prop="matchTag">
			<el-input-tag v-model="dressMatchingInfo.matchTag" placeholder="请输入标签" />
		</el-form-item>
		<!-- 图片上传 -->
		<el-form-item label="图片">
			<el-upload ref="imageUploadRef" :show-file-list="true" :action="uploadUrl"
				:data="{ resourceType: 'image', typeCode: 1 }" :before-upload="beforeUpload"
				:on-success="handleImageSuccess" :on-error="handleImageError">
				<el-button type="primary">选择图片</el-button>
			</el-upload>
		</el-form-item>
		<!-- 三维模型上传 -->
		<el-form-item label="三维模型">
			<el-upload ref="threeDModelUploadRef" :show-file-list="true" :action="uploadUrl"
				:data="{ resourceType: '3d_model', typeCode: 2 }" :before-upload="beforeUpload"
				:on-success="handleThreeDModelSuccess" :on-error="handleImageError">
				<el-button type="primary">选择三维模型</el-button>
			</el-upload>
		</el-form-item>
		<!-- 视频上传 -->
		<el-form-item label="视频">
			<el-upload ref="videoUploadRef" :show-file-list="true" :action="uploadUrl"
				:data="{ resourceType: 'video', typeCode: 3 }" :before-upload="beforeUpload"
				:on-success="handleVideoSuccess" :on-error="handleImageError">
				<el-button type="primary">选择视频</el-button>
			</el-upload>
		</el-form-item>
		<!-- 提交和重置按钮 -->
		<el-form-item>
			<el-button type="primary" @click="submitForm">提交</el-button>
			<el-button @click="resetForm">重置</el-button>
		</el-form-item>
	</el-form>
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
		saveDressMatchingInfo,
		getAllDressBaseInfos
	} from '/src/api/dress.js';

	// 表单引用
	const formRef = ref(null);
	// 图片上传组件引用
	const imageUploadRef = ref(null);
	// 三维模型上传组件引用
	const threeDModelUploadRef = ref(null);
	// 视频上传组件引用
	const videoUploadRef = ref(null);

	// 成套配伍信息数据
	const dressMatchingInfo = ref({
		matchingName: '',
		matchingIntroduction: '',
		matchingComposition: '',
		styleType: '',
		belongingPeriod: '',
		dressId: null,
		matchTag: null,
		image: '', // 图片
		threeDModel: '', // 三维模型
		video: '', // 视频
	});

	// 礼服选项数据
	const dressOptions = ref([]);

	// 表单验证规则
	const rules = {
		matchingName: [{
			required: true,
			message: '请输入配伍名称',
			trigger: 'blur'
		}],
		matchingIntroduction: [{
			required: true,
			message: '请输入配伍介绍',
			trigger: 'blur'
		}],
		matchingComposition: [{
			required: true,
			message: '请输入配伍组成',
			trigger: 'blur'
		}],
		styleType: [{
			required: true,
			message: '请选择款式类型',
			trigger: 'change'
		}],
		belongingPeriod: [{
			required: true,
			message: '请选择归属时期',
			trigger: 'change'
		}],
		dressId: [{
			required: true,
			message: '请选择所属礼服',
			trigger: 'change'
		}],
	};

	// 图片上传的接口地址
	const uploadUrl = 'http://localhost:8080/multimedia/upload';

	// 文件上传前的校验函数
	const beforeUpload = (file) => {
		return true;
	};

	// 图片上传成功后的回调
	const handleImageSuccess = (response, file) => {
		if (response.id) {
			ElMessage.success('图片上传成功');
			dressMatchingInfo.value.image = !dressMatchingInfo.value.image ?
				response.id :
				dressMatchingInfo.value.image + ';' + response.id;
		} else {
			ElMessage.error('图片上传失败：' + (response.message || '未知错误'));
		}
	};

	// 三维模型上传成功后的回调
	const handleThreeDModelSuccess = (response, file) => {
		if (response.id) {
			ElMessage.success('三维模型上传成功');
			dressMatchingInfo.value.threeDModel = !dressMatchingInfo.value.threeDModel ?
				response.id :
				dressMatchingInfo.value.threeDModel + ';' + response.id;
		} else {
			ElMessage.error('三维模型上传失败：' + (response.message || '未知错误'));
		}
	};

	// 视频上传成功后的回调
	const handleVideoSuccess = (response, file) => {
		if (response.id) {
			ElMessage.success('视频上传成功');
			dressMatchingInfo.value.video = response.id;
			dressMatchingInfo.value.video = !dressMatchingInfo.value.video ?
				response.id :
				dressMatchingInfo.value.video + ';' + response.id;
		} else {
			ElMessage.error('视频上传失败：' + (response.message || '未知错误'));
		}
	};

	// 图片上传失败后的回调
	const handleImageError = (error, file) => {
		ElMessage.error('上传失败：' + error.message);
	};

	// 获取所有礼服数据
	const fetchDressOptions = async () => {
		try {
			const response = await getAllDressBaseInfos();
			dressOptions.value = response.data; // 假设返回的数据是一个数组
		} catch (error) {
			ElMessage.error('获取礼服数据失败：' + error.message);
		}
	};


	// 提交表单函数
	const submitForm = async () => {
		formRef.value.validate(async (valid) => {
			if (valid) {
				try {
					// 调用 API 保存成套配伍信息
					const response = await saveDressMatchingInfo(dressMatchingInfo.value,
						dressMatchingInfo.value.dressId);
					ElMessage.success('保存成功');
					resetForm();
				} catch (error) {
					ElMessage.error('保存失败：' + error.message);
				}
			} else {
				ElMessage.error('表单校验失败');
			}
		});
	};

	// 重置表单函数
	const resetForm = () => {
		formRef.value.resetFields();
		dressMatchingInfo.value = {
			matchingName: '',
			matchingIntroduction: '',
			matchingComposition: '',
			styleType: '',
			belongingPeriod: '',
			dressId: null,
			matchTag: null,
			image: '', // 图片
			threeDModel: '', // 三维模型
			video: '', // 视频
		};
		imageUploadRef.value.clearFiles();
		threeDModelUploadRef.value.clearFiles();
		videoUploadRef.value.clearFiles();
	};

	// 组件加载时获取礼服数据
	onMounted(() => {
		fetchDressOptions();
	});
</script>

<style>
</style>