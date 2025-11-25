<template>
	<el-form ref="formRef" :model="dressStyleInfo" :rules="rules" label-width="120px" style="max-width: 1000px">
		<!-- 款式名称 -->
		<el-form-item label="款式名称" prop="styleName">
			<el-input v-model="dressStyleInfo.styleName"></el-input>
		</el-form-item>
		<!-- 款式介绍 -->
		<el-form-item label="款式介绍" prop="styleIntroduction">
			<el-input type="textarea" v-model="dressStyleInfo.styleIntroduction"></el-input>
		</el-form-item>
		<!-- 款式分类 -->
		<el-form-item label="款式分类" prop="styleCategory">
			<el-select v-model="dressStyleInfo.styleCategory">
				<el-option label="主体款式" value="主体款式"></el-option>
				<el-option label="服饰品" value="服饰品"></el-option>
				<el-option label="成套" value="成套"></el-option>
			</el-select>
		</el-form-item>
		<!-- 款式类型 -->
		<el-form-item label="款式类型" prop="styleType">
			<el-select v-model="dressStyleInfo.styleType">
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
			<el-select v-model="dressStyleInfo.belongingPeriod">
				<el-option label="民国" value="民国"></el-option>
				<el-option label="晚清" value="晚清"></el-option>
			</el-select>
		</el-form-item>
		<!-- 所属礼服 ID -->
		<el-form-item label="所属礼服" prop="dressId">
			<el-select v-model="dressStyleInfo.dressId" placeholder="请选择所属礼服">
				<el-option v-for="dress in dressOptions" :key="dress.dressId" :label="dress.dressName"
					:value="dress.dressId"></el-option>
			</el-select>
		</el-form-item>
		<!-- 关联配伍 ID -->
		<el-form-item label="配伍组成" prop="matchingId">
			<el-select v-model="dressStyleInfo.matchingId" placeholder="请选择配伍组成" multiple size="large">
				<el-option v-for="match in matchOptions" :key="match.matchingId" :label="match.matchingName"
					:value="match.matchingId"></el-option>
			</el-select>
		</el-form-item>
		<!-- 自定义服装款式标签 -->
		<el-form-item label="标签" prop="styleTag">
			<el-input-tag v-model="dressStyleInfo.styleTag" placeholder="请输入标签" />
		</el-form-item>
		<!-- 图片上传 -->
		<el-form-item label="图片">
			<el-upload ref="imageUploadRef" :show-file-list="true" :action="uploadUrl"
				:data="{ resourceType: 'image', typeCode: 1 }" :before-upload="beforeUpload"
				:on-success="handleImageSuccess" :on-error="handleImageError" multiple>
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
		saveDressStyleInfo,
		getAllDressBaseInfos,
		getAllDressMatchingInfos
	} from '/src/api/dress.js';

	// 表单引用
	const formRef = ref(null);
	// 图片上传组件引用
	const imageUploadRef = ref(null);
	// 三维模型上传组件引用
	const threeDModelUploadRef = ref(null);
	// 视频上传组件引用
	const videoUploadRef = ref(null);

	// 款式信息数据
	const dressStyleInfo = ref({
		styleName: '',
		styleIntroduction: '',
		styleCategory: '',
		styleType: '',
		belongingPeriod: '',
		dressId: null, // 所属礼服 ID
		matchingId: null, //配伍信息
		styleTag: null, // 标签信息
		image: null, // 图片
		threeDModel: null, // 三维模型
		video: null, // 视频
	});

	// 礼服选项数据
	const dressOptions = ref([]);

	//获取所有配伍数据
	const matchOptions = ref([]);

	// 表单验证规则
	const rules = {
		styleName: [{
			required: true,
			message: '请输入款式名称',
			trigger: 'blur'
		}],
		styleIntroduction: [{
			required: true,
			message: '请输入款式介绍',
			trigger: 'blur'
		}],
		styleCategory: [{
			required: true,
			message: '请选择款式分类',
			trigger: 'change'
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
	const handleImageSuccess = (response, file, fileList) => {
		if (response.id) {
			ElMessage.success('图片上传成功');
			const newImageIds = Array.isArray(response.id) ? response.id.join(';') : response.id;
			dressStyleInfo.value.image = !dressStyleInfo.value.image ?
				newImageIds :
				dressStyleInfo.value.image + ';' + newImageIds;
			console.log(dressStyleInfo.value.image);
		} else {
			ElMessage.error('图片上传失败：' + (response.message || '未知错误'));
		}
	};

	// 三维模型上传成功后的回调
	const handleThreeDModelSuccess = (response, file) => {
		if (response.id) {
			ElMessage.success('三维模型上传成功');
			dressStyleInfo.value.threeDModel = !dressStyleInfo.value.threeDModel ?
				response.id :
				dressStyleInfo.value.threeDModel + ';' + response.id;
		} else {
			ElMessage.error('三维模型上传失败：' + (response.message || '未知错误'));
		}
	};

	// 视频上传成功后的回调
	const handleVideoSuccess = (response, file) => {
		if (response.id) {
			ElMessage.success('视频上传成功');
			dressStyleInfo.value.video = !dressStyleInfo.value.video ?
				response.id :
				dressStyleInfo.value.video + ';' + response.id;
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


	// 获取所有配伍数据
	const fetchMatchOptions = async () => {
		try {
			const response = await getAllDressMatchingInfos();
			matchOptions.value = response.data; // 假设返回的数据是一个数组
		} catch (error) {
			ElMessage.error('获取配伍数据失败：' + error.message);
		}
	};

	// 提交表单函数
	const submitForm = async () => {
		formRef.value.validate(async (valid) => {
			if (valid) {
				try {
					// 调用 API 保存款式信息
					const response = await saveDressStyleInfo(dressStyleInfo.value, dressStyleInfo
						.value.dressId);
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
		dressStyleInfo.value = {
			styleName: '',
			styleIntroduction: '',
			styleCategory: '',
			styleType: '',
			belongingPeriod: '',
			dressId: null,
			matchingId: null,
			styleTag: null, // 标签信息
			image: null,
			threeDModel: null,
			video: null,
		};
		imageUploadRef.value.clearFiles();
		threeDModelUploadRef.value.clearFiles();
		videoUploadRef.value.clearFiles();
	};

	// 组件加载时获取礼服数据
	onMounted(() => {
		fetchDressOptions();
		fetchMatchOptions();
	});
</script>

<style>
</style>