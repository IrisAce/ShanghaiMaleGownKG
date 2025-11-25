<!-- 三维模型展示STL -->
<template>
	<div ref="container" class="stl-viewer"></div>
</template>

<script>
	import * as THREE from 'three';
	import {
		STLLoader
	} from 'three/examples/jsm/loaders/STLLoader.js';

	export default {
		name: 'StlViewer',
		data() {
			return {
				scene: null,
				camera: null,
				renderer: null,
				stlModel: null,
			};
		},
		mounted() {
			this.initThree();
			this.loadStlModel();
			this.animate();
		},
		methods: {
			// 初始化Three.js场景
			initThree() {
				const container = this.$refs.container;

				// 创建场景
				this.scene = new THREE.Scene();

				// 创建相机
				this.camera = new THREE.PerspectiveCamera(
					75, // 视野角度
					container.clientWidth / container.clientHeight, // 宽高比
					0.1, // 近裁剪面
					1000 // 远裁剪面
				);
				this.camera.position.z = 50; // 设置相机位置

				// 创建渲染器
				this.renderer = new THREE.WebGLRenderer({
					antialias: true
				});
				this.renderer.setSize(container.clientWidth, container.clientHeight);
				container.appendChild(this.renderer.domElement);

				// 添加光源
				const ambientLight = new THREE.AmbientLight(0x404040); // 环境光
				this.scene.add(ambientLight);

				const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // 平行光
				directionalLight.position.set(1, 1, 1).normalize();
				this.scene.add(directionalLight);
			},

			// 加载STL模型
			loadStlModel() {
				const stlLoader = new STLLoader();
				stlLoader.load(
					// STL文件路径
					'/src/img/example.stl',
					// 加载完成回调
					(geometry) => {
						// 创建材质
						const material = new THREE.MeshPhongMaterial({
							color: 0x00ff00, // 模型颜色
							specular: 0x111111,
							shininess: 200,
						});

						// 创建网格
						this.stlModel = new THREE.Mesh(geometry, material);

						// 调整模型位置和缩放
						this.stlModel.position.set(0, 0, 0);
						this.stlModel.scale.set(1, 1, 1); // 根据需要调整缩放
						this.stlModel.rotation.set(-Math.PI / 2, 0, 0); // 调整旋转

						// 将模型添加到场景
						this.scene.add(this.stlModel);
					},
					// 加载进度回调
					(xhr) => {
						console.log((xhr.loaded / xhr.total) * 100 + '% 已加载');
					},
					// 加载错误回调
					(error) => {
						console.error('加载STL文件失败:', error);
					}
				);
			},

			// 渲染循环
			animate() {
				requestAnimationFrame(this.animate);

				// 如果需要，可以在这里添加模型旋转或其他动画
				if (this.stlModel) {
					this.stlModel.rotation.y += 0.01; // 让模型绕Y轴旋转
				}

				// 渲染场景
				this.renderer.render(this.scene, this.camera);
			},
		},
	};
</script>

<style scoped>
	.stl-viewer {
		width: 100%;
		height: 100vh;
		/* 使容器占满整个视口 */
		margin: 0;
		padding: 0;
		overflow: hidden;
	}
</style>