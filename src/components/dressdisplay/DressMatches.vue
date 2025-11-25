<template>
	<div style="display: flex; height: 100vh;">
		<!-- 返回首页按钮 -->
<!-- 		<el-button class="home-button" type="success" @click="goHome" :icon="HomeFilled">返回首页</el-button> -->
		<!-- 3D模型容器 -->
		<div class="model-container">
			<div ref="container" style="width: 100%; height: 100%;"></div>
			<!-- 旋转提示文字 -->
			<div class="rotate-tip">
				<el-icon>
					<RefreshRight />
				</el-icon>
				<span>拖动可旋转模型查看</span>
			</div>
		</div>
		<!-- 右侧图片卡片容器 -->
		<div class="content">
			<el-row :gutter="30">
				<el-col v-for="match in matchMedia" :key="match.id" :span="8">
					<el-card class="item-card">
						<el-image :src="match.resourceLink" alt="图片" class="item-image" fit="fill" lazy />
					</el-card>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script setup>
	import * as THREE from 'three';
	import {
		GLTFLoader
	} from 'three/addons/loaders/GLTFLoader.js';
	import {
		OrbitControls
	} from 'three/addons/controls/OrbitControls.js';
	import {
		onMounted,
		ref,
		reactive
	} from 'vue';
	import {
		HomeFilled,
		RefreshRight
	} from '@element-plus/icons-vue'; // 新增引入旋转图标
	import {
		useRouter
	} from 'vue-router';
	import {
		getDressMatchingInfoById,
		getDressesByIds
	} from '/src/api/dress.js';
	import {
		ElMessage
	} from 'element-plus'; // 补充引入ElMessage

	// 原有逻辑保持不变...
	const container = ref(null);
	const router = useRouter();

	const matches = ref();
	const matchMedia = ref([]);
	const ids = ref();

	const fetchMatching = async () => {
		try {
			const response = await getDressMatchingInfoById('11'); 
			matches.value = response.data;
			ids.value = response.data.image;
			fetchMatchImage();
		} catch (error) {
			ElMessage.error('获取配伍数据失败：' + error.message);
		}
	};

	const fetchMatchImage = async () => {
		try {
			const response = await getDressesByIds(ids.value);
			matchMedia.value = response.data;
		} catch (error) {
			ElMessage.error('获取礼服图片数据失败：' + error.message);
		}
	};

	const goHome = () => {
		router.push('/home');
	};

	onMounted(async () => {
		// 原有3D渲染逻辑保持不变...
		const scene = new THREE.Scene();
		scene.background = new THREE.Color('#f9f4dc');
		const camera = new THREE.PerspectiveCamera(75, container.value.clientWidth / container.value
			.clientHeight, 0.1, 1000);
		camera.position.z = 3;
		const renderer = new THREE.WebGLRenderer();
		renderer.outputEncoding = THREE.sRGBEncoding;
		renderer.setSize(container.value.clientWidth, container.value.clientHeight);
		container.value.appendChild(renderer.domElement);
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
		scene.add(ambientLight);
		const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.position.set(1, 1, 1);
		scene.add(directionalLight);
		const controls = new OrbitControls(camera, renderer.domElement);
		const loader = new GLTFLoader();
		//长袍-坎肩模型.glb、长袍模型.glb-11
		const modelUrl = 'http://localhost:9000/grownkg/坎肩GLB/长袍模型.glb';
		loader.load(
			modelUrl,
			(gltf) => {
				const model = gltf.scene;
				model.scale.set(2, 2, 2);
				model.position.y = -2;
				scene.add(model);
			},
			undefined,
			(error) => {
				console.error('加载模型时出错:', error);
			}
		);

		function animate() {
			requestAnimationFrame(animate);
			controls.update();
			renderer.render(scene, camera);
		}
		animate();
		try {
			fetchMatching();
		} catch (error) {
			console.error('获取图片数据出错:', error);
		}
	});
</script>

<style scoped>
	/* 新增模型容器样式 */
	.model-container {
		position: relative;
		width: 50%;
		height: 93%;
		margin-top: 20px;
	}

	/* 旋转提示样式 */
	.rotate-tip {
		position: absolute;
		bottom: 20px;
		left: 70%;
		transform: translateX(-50%);
		background-color: rgba(0, 0, 0, 0.6);
		color: white;
		padding: 8px 16px;
		border-radius: 20px;
		font-size: 14px;
		display: flex;
		align-items: center;
		gap: 8px;
		backdrop-filter: blur(4px);
		z-index: 10;
		/* 确保在模型上方显示 */
	}

	/* 原有样式保持不变... */
	.home-button {
		position: absolute;
		top: 10px;
		right: 20px;
	}

	.item-card {
		margin-bottom: 20px;
	}

	.item-image {
		width: 100%;
	}

	.content {
		flex: 1;
		padding: 20px;
		overflow-y: auto;
		height: 90%;
		margin-top: 30px;
		width: 60%;
		padding: 20px;
	}
</style>