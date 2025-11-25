<template>
	<el-form ref="formRef" :model="dressBaseInfo" :rules="rules" label-width="120px" style="max-width: 1000px">
		<el-form-item label="礼服名称" prop="dressName">
			<el-input v-model="dressBaseInfo.dressName"></el-input>
		</el-form-item>
		<el-form-item label="礼服介绍" prop="dressIntroduction">
			<el-input type="textarea" v-model="dressBaseInfo.dressIntroduction"></el-input>
		</el-form-item>
		<el-form-item label="礼服类型" prop="dressType">
			<el-select v-model="dressBaseInfo.dressType">
				<el-option label="官服" value="官服"></el-option>
				<el-option label="民服" value="民服"></el-option>
				<el-option label="中式" value="中式"></el-option>
				<el-option label="西式" value="西式"></el-option>
				<el-option label="中西融合式" value="中西融合式"></el-option>
				<el-option label="五服制" value="五服制"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="归属时期" prop="belongingPeriod">
			<el-select v-model="dressBaseInfo.belongingPeriod">
				<el-option label="民国" value="民国"></el-option>
				<el-option label="晚清" value="晚清"></el-option>
			</el-select>
		</el-form-item>
		<!-- 自定义服装款式标签 -->
		<el-form-item label="标签" prop="dressTag">
			<el-input-tag v-model="dressBaseInfo.dressTag" placeholder="请输入标签" />
		</el-form-item>
		<!-- 礼服主图 -->
		<el-form-item label="礼服主图">
			<el-upload ref="dressImgRef" :show-file-list="true" :action="uploadUrl"
				:data="{ resourceType: 'dress_image', typeCode: 1 }" :before-upload="beforeUpload"
				:on-success="handleDressImageChange" :on-error="handleImageError">
				<el-button type="primary">选择图片</el-button>
			</el-upload>
		</el-form-item>

		<!-- 示例图片 -->
		<el-form-item label="示例图片">
			<el-upload ref="imageUploadRef" :show-file-list="true" :action="uploadUrl"
				:data="{ resourceType: 'example_image', typeCode: 2 }" :before-upload="beforeUpload"
				:on-success="handleImageSuccess" :on-error="handleImageError">
				<el-button type="primary">选择图片</el-button>
			</el-upload>
		</el-form-item>

		<!-- 三维模型 -->
		<el-form-item label="三维模型">
			<el-upload ref="threeDModelUploadRef" :show-file-list="true" :action="uploadUrl"
				:data="{ resourceType: '3d_model', typeCode: 3 }" :before-upload="beforeUpload"
				:on-success="handleThreeDModelChange" :on-error="handleImageError">
				<el-button type="primary">选择三维模型</el-button>
			</el-upload>
		</el-form-item>

		<!-- 视频 -->
		<el-form-item label="视频">
			<el-upload ref="videoUploadRef" :show-file-list="true" :action="uploadUrl"
				:data="{ resourceType: 'video', typeCode: 4 }" :before-upload="beforeUpload"
				:on-success="handleVideoChange" :on-error="handleImageError">
				<el-button type="primary">选择视频</el-button>
			</el-upload>
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
	import {
		ElMessage
	} from 'element-plus';
	import {
		saveDressBaseInfo
	} from '/src/api/dress.js';

	const formRef = ref(null);
	const imageUploadRef = ref(null);
	const threeDModelUploadRef = ref(null);
	const videoUploadRef = ref(null);
	const dressImgRef = ref(null);

	const dressBaseInfo = ref({
		dressName: '',
		dressIntroduction: '',
		dressType: '',
		belongingPeriod: '',
		dressTag: null,
		image: '', // 示例图片
		threeDModel: '', // 三维模型
		video: '', // 视频
		dressImg: '', // 礼服主图
	});

	const rules = {
		dressName: [{
			required: true,
			message: '请输入礼服名称',
			trigger: 'blur'
		}],
		dressIntroduction: [{
			required: true,
			message: '请输入礼服介绍',
			trigger: 'blur'
		}],
		dressType: [{
			required: true,
			message: '请选择礼服类型',
			trigger: 'change'
		}],
		belongingPeriod: [{
			required: true,
			message: '请选择归属时期',
			trigger: 'change'
		}],
	};

	// 图片上传的接口地址
	const uploadUrl = 'http://localhost:8080/multimedia/upload';

	// 文件上传前的校验
	const beforeUpload = (file) => {
		return true;
	};

	// 礼服主图上传成功后的回调
	const handleDressImageChange = (response, file) => {
		if (response.id) {
			ElMessage.success('礼服主图上传成功');
			dressBaseInfo.value.dressImg = response.resourceLink;
		} else {
			ElMessage.error('礼服主图上传失败：' + (response.message || '未知错误'));
		}
	};

	// 示例图片上传成功后的回调
	const handleImageSuccess = (response, file) => {
		if (response.id) {
			ElMessage.success('示例图片上传成功');
			dressBaseInfo.value.image = !dressBaseInfo.value.image ?
				response.id :
				dressBaseInfo.value.image + ';' + response.id;
		} else {
			ElMessage.error('示例图片上传失败：' + (response.message || '未知错误'));
		}
	};

	// 三维模型上传成功后的回调
	const handleThreeDModelChange = (response, file) => {
		if (response.id) {
			ElMessage.success('三维模型上传成功');
			dressBaseInfo.value.threeDModel = !dressBaseInfo.value.threeDModel ?
				response.id :
				dressBaseInfo.value.threeDModel + ';' + response.id;
		} else {
			ElMessage.error('三维模型上传失败：' + (response.message || '未知错误'));
		}
	};

	// 视频上传成功后的回调
	const handleVideoChange = (response, file) => {
		if (response.id) {
			ElMessage.success('视频上传成功');
			// dressBaseInfo.value.video = response.id;
			dressBaseInfo.value.video = !dressBaseInfo.value.video ?
				response.id :
				dressBaseInfo.value.video + ';' + response.id;
		} else {
			ElMessage.error('视频上传失败：' + (response.message || '未知错误'));
		}
	};

	// 提交表单
	const submitForm = async () => {
		formRef.value.validate(async (valid) => {
			if (valid) {
				// 检查文件是否已上传
				if (!dressBaseInfo.value.dressImg) {
					ElMessage.error('请上传礼服主图');
					return;
				}
				if (!dressBaseInfo.value.image) {
					ElMessage.error('请上传示例图片');
					return;
				}

				try {
					const response = await saveDressBaseInfo(dressBaseInfo.value);
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

	// 重置表单
	const resetForm = () => {
		formRef.value.resetFields();
		dressBaseInfo.value = {
			dressName: '',
			dressIntroduction: '',
			dressType: '',
			belongingPeriod: '',
			dressTag: null,
			image: '',
			threeDModel: '',
			video: '',
			dressImg: '',
		};
		imageUploadRef.value.clearFiles();
		threeDModelUploadRef.value.clearFiles();
		videoUploadRef.value.clearFiles();
		dressImgRef.value.clearFiles();
	};
</script>

<style>
	/* 表单容器 */
	.el-form {
		background-color: #FFFFF0;
		padding: 24px;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
	}

	/* 表单项标签 */
	.el-form-item__label {
		color: #4A4A4A;
		font-weight: 500;
	}

	/* 输入框样式 */
	.el-input__inner,
	.el-select__inner {
		border-color: #E8E8E8;
		border-radius: 4px;
	}

	.el-input__inner:focus,
	.el-select__inner:focus {
		border-color: #D4AF37;
		/* 鎏金焦点色 */
		box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
	}
</style>