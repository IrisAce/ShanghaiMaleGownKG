<template>
	<div style="position: relative;">
		<!-- 返回首页按钮 -->
		<el-button class="home-button" type="success" @click="goHome" :icon="HomeFilled">返回首页</el-button>

		<h3>近代上海地区男性礼服3D模型</h3>
		<div ref="container" style="width: 100%; height: 1500px;margin-top: 20px;"></div>
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
		ref
	} from 'vue';
	import {
		HomeFilled
	} from '@element-plus/icons-vue';
	import {
		useRouter
	} from 'vue-router'; // 引入路由钩子

	const container = ref(null);
	const router = useRouter(); // 获取路由实例

	// 定义返回首页的方法
	const goHome = () => {
		router.push('/home');
	};

	onMounted(() => {
		// 创建场景
		const scene = new THREE.Scene();

		// 设置场景背景色，这里设置为白色，你可以根据需要修改颜色值
		scene.background = new THREE.Color('#f9f4dc');

		// 创建相机
		const camera = new THREE.PerspectiveCamera(75, container.value.clientWidth / container.value.clientHeight,
			0.1, 1000);
		camera.position.z = 5;

		// 创建渲染器
		const renderer = new THREE.WebGLRenderer();
		renderer.outputEncoding = THREE.sRGBEncoding;
		renderer.setSize(container.value.clientWidth, container.value.clientHeight);
		container.value.appendChild(renderer.domElement);

		// 创建光照
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.position.set(1, 1, 1);
		scene.add(directionalLight);

		// 初始化轨道控制器
		const controls = new OrbitControls(camera, renderer.domElement);

		// 加载 GLTF 模型
		const loader = new GLTFLoader();
		// 替换为你在 MinIO 中的 GLTF/GLB 模型文件的完整访问 URL
		const modelUrl = 'http://localhost:9000/grownkg/坎肩GLB/坎肩GLB.glb';
		loader.load(
			modelUrl,
			(gltf) => {
				const model = gltf.scene;
				model.scale.set(2, 2, 2);
				scene.add(model);

				// 遍历模型的所有子对象
				model.traverse((child) => {
					if (child.isMesh) {
						console.log('Mesh material:', child.material);
					}
				});
			},
			undefined,
			(error) => {
				console.error('加载模型时出错:', error);
			}
		);

		// 渲染循环
		function animate() {
			requestAnimationFrame(animate);
			// 更新控制器
			controls.update();
			renderer.render(scene, camera);
		}

		animate();
	});
</script>

<style scoped>
	div {
		width: 100%;
		height: 100%;
	}

	.home-button {
		position: absolute;
		top: 10px;
		right: 20px;
	}
</style>