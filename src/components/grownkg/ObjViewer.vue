<!-- 三维模型展示OBJ -->
<template>
	<div ref="container" style="width: 100%; height: 500px;"></div>
</template>

<script setup>
	import {
		onMounted,
		ref
	} from 'vue';
	import * as THREE from 'three';
	import {
		STLLoader
	} from 'three-stl-loader';

	// 使用 CommonJS 导入方式
	const OBJLoader = require('three-obj-loader')(THREE);

	const container = ref(null);

	onMounted(() => {
		// 创建场景
		const scene = new THREE.Scene();

		// 创建相机
		const camera = new THREE.PerspectiveCamera(75, container.value.offsetWidth / container.value.offsetHeight,
			0.1, 1000);
		camera.position.z = 5;

		// 创建渲染器
		const renderer = new THREE.WebGLRenderer();
		renderer.setSize(container.value.offsetWidth, container.value.offsetHeight);
		container.value.appendChild(renderer.domElement);

		// 创建光源
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
		directionalLight.position.set(1, 1, 1);
		scene.add(directionalLight);

		// 加载 OBJ 文件
		const objLoader = new OBJLoader();
		objLoader.load(
			'http://localhost:9000/grownkg/服装三维样例.obj',
			(object) => {
				scene.add(object);
			},
			(xhr) => {
				console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
			},
			(error) => {
				console.log('An error happened', error);
			}
		);

		// 如果你也有 STL 文件需要加载，可以使用以下代码
		// const stlLoader = new STLLoader();
		// stlLoader.load(
		//   '/src/img/example.stl',
		//   (geometry) => {
		//     const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
		//     const mesh = new THREE.Mesh(geometry, material);
		//     scene.add(mesh);
		//   },
		//   (xhr) => {
		//     console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
		//   },
		//   (error) => {
		//     console.log('An error happened', error);
		//   }
		// );

		// 渲染循环
		const animate = () => {
			requestAnimationFrame(animate);

			// 可以在这里添加一些动画效果，比如旋转模型
			// object.rotation.x += 0.01;
			// object.rotation.y += 0.01;

			renderer.render(scene, camera);
		};

		animate();
	});
</script>

<style scoped>
	/* 可以添加一些样式来调整容器的外观 */
</style>