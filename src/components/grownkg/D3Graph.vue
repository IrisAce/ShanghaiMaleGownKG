<template>
	<div class="main-container">
		<!-- 返回首页按钮 -->
		<div class="home-button-container">
			<el-button type="success" @click="goHome" :icon="HomeFilled">返回首页</el-button>
		</div>
		<!-- 图谱展示区域 -->
		<div ref="graphContainer" class="graph-container"></div>
		<!-- 分类控制区域 -->
		<div class="controls">
			<div v-for="category in categories" :key="category" class="category-label"
				:style="{ backgroundColor: getCategoryColor(category, selectedCategories.has(category)) }"
				@click="toggleCategory(category)">
				{{ category }}
			</div>
			<div class="category-label" :style="{ backgroundColor: '#ccc' }" @click="resetCategories">
				全部显示
			</div>
		</div>
	</div>
</template>
<script>
	import * as d3 from 'd3';
	import {
		onMounted,
		ref
	} from 'vue';
	import axios from 'axios';
	import {
		useRouter
	} from 'vue-router';
	import {
		HomeFilled
	} from '@element-plus/icons-vue';

	export default {
		name: 'D3Graph',
		setup() {
			const graphContainer = ref(null);
			const categories = ref([]);
			const selectedCategories = ref(new Set());
			let simulation;
			let nodes, links;

			const router = useRouter();

			const goHome = () => {
				router.push('/home');
			};

			const fetchData = async () => {
				try {
					const response = await axios.get('http://localhost:8080/api/nodes-and-relationships');
					nodes = response.data.nodes;
					links = response.data.links;
					extractCategories();
					renderGraph(nodes, links);
				} catch (error) {
					console.error('Failed to fetch data:', error);
				}
			};

			const extractCategories = () => {
				const categorySet = new Set(nodes.map(node => node.category));
				categories.value = Array.from(categorySet);
			};

			const categoryRadiusMap = new Map();
			const categoryRadiusGenerator = d3.scaleOrdinal([30, 25, 20, 10, 10]);

			const renderGraph = (nodesToRender, linksToRender) => {
				const container = graphContainer.value;
				const {
					width,
					height
				} = getContainerSize(container);

				d3.select(container).selectAll('*').remove();

				const svg = d3.select(container)
					.append('svg')
					.attr('width', width)
					.attr('height', height);

				const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

				categories.value.forEach(category => {
					categoryRadiusMap.set(category, categoryRadiusGenerator(category));
				});

				// 调整力导向图参数
				simulation = d3.forceSimulation(nodesToRender)
					.force('link', d3.forceLink(linksToRender).id(d => d.id).distance(120)) // 增大distance值
					.force('charge', d3.forceManyBody().strength(-300)) // 增大斥力强度
					.force('center', d3.forceCenter(width / 2, height / 2))
					.force('collision', d3.forceCollide().radius(d => categoryRadiusMap.get(d.category) +
					5)); // 增大碰撞半径

				const link = svg.append('g')
					.selectAll('line')
					.data(linksToRender)
					.enter()
					.append('line')
					.attr('stroke', '#999')
					.attr('stroke-width', 2);

				const linkText = svg.append('g')
					.selectAll('text')
					.data(linksToRender)
					.enter()
					.append('text')
					.text(d => d.name)
					.attr('font-size', 12)
					.attr('fill', '#333');

				const node = svg.append('g')
					.selectAll('circle')
					.data(nodesToRender)
					.enter()
					.append('circle')
					.attr('r', d => categoryRadiusMap.get(d.category))
					.attr('fill', d => colorScale(d.category))
					.call(d3.drag()
						.on('start', dragstarted)
						.on('drag', dragged)
						.on('end', dragended)
					);

				const label = svg.append('g')
					.selectAll('text')
					.data(nodesToRender)
					.enter()
					.append('text')
					.text(d => d.name)
					.attr('font-size', 12)
					.attr('dx', d => categoryRadiusMap.get(d.category) + 5)
					.attr('dy', 5);

				simulation.on('tick', () => {
					link
						.attr('x1', d => d.source.x)
						.attr('y1', d => d.source.y)
						.attr('x2', d => d.target.x)
						.attr('y2', d => d.target.y);
					linkText
						.attr('x', d => (d.source.x + d.target.x) / 2)
						.attr('y', d => (d.source.y + d.target.y) / 2);
					node
						.attr('cx', d => d.x)
						.attr('cy', d => d.y);
					label
						.attr('x', d => d.x)
						.attr('y', d => d.y);
				});

				function dragstarted(event, d) {
					if (!event.active) simulation.alphaTarget(0.3).restart();
					d.fx = d.x;
					d.fy = d.y;
				}

				function dragged(event, d) {
					d.fx = event.x;
					d.fy = event.y;
				}

				function dragended(event, d) {
					if (!event.active) simulation.alphaTarget(0);
					d.fx = null;
					d.fy = null;
				}
			};

			const toggleCategory = (category) => {
				if (selectedCategories.value.has(category)) {
					selectedCategories.value.delete(category);
				} else {
					selectedCategories.value.add(category);
				}
				filterGraph();
			};

			const filterGraph = () => {
				if (selectedCategories.value.size === 0) {
					renderGraph(nodes, links);
				} else {
					const filteredNodes = new Set();
					const filteredLinks = new Set();

					selectedCategories.value.forEach(category => {
						nodes.filter(node => node.category === category).forEach(node => {
							filteredNodes.add(node);
							findConnectedNodes(node, filteredNodes, filteredLinks);
						});
					});

					const nodesToRender = Array.from(filteredNodes);
					const validLinks = links.filter(link => {
						const sourceNode = nodes.find(n => n.id === link.source.id);
						const targetNode = nodes.find(n => n.id === link.target.id);
						return filteredNodes.has(sourceNode) && filteredNodes.has(targetNode);
					});

					renderGraph(nodesToRender, validLinks);
				}
			};

			const findConnectedNodes = (node, filteredNodes, filteredLinks) => {
				links.forEach(link => {
					if (link.source === node.id) {
						const targetNode = nodes.find(n => n.id === link.target);
						if (!filteredNodes.has(targetNode)) {
							filteredNodes.add(targetNode);
							filteredLinks.add(link);
							findConnectedNodes(targetNode, filteredNodes, filteredLinks);
						}
					}
					if (link.target === node.id) {
						const sourceNode = nodes.find(n => n.id === link.source);
						if (!filteredNodes.has(sourceNode)) {
							filteredNodes.add(sourceNode);
							filteredLinks.add(link);
							findConnectedNodes(sourceNode, filteredNodes, filteredLinks);
						}
					}
				});
			};

			const resetCategories = () => {
				selectedCategories.value.clear();
				renderGraph(nodes, links);
			};

			const getCategoryColor = (category, isSelected) => {
				const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
				const color = colorScale(category);
				return isSelected ? d3.color(color).brighter(0.5) : d3.color(color).darker(0.5);
			};

			const getContainerSize = (container) => {
				return {
					width: container.clientWidth,
					height: container.clientHeight
				};
			};

			onMounted(() => {
				fetchData();
			});

			return {
				graphContainer,
				categories,
				selectedCategories,
				toggleCategory,
				resetCategories,
				getCategoryColor,
				goHome
			};
		}
	};
</script>
<style scoped>
	.main-container {
		position: relative;
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.home-button-container {
		position: absolute;
		top: 10px;
		right: 10px;
		z-index: 10;
	}

	.graph-container {
		flex: 1;
		width: 100%;
		height: calc(100vh - 60px);
		border: 1px solid #ccc;
		background-color: #f9f4dc;
	}

	.controls {
		display: flex;
		justify-content: center;
		padding: 10px;
		background-color: #f5f5f5;
		border-top: 1px solid #ddd;
	}

	.category-label {
		display: inline-block;
		padding: 5px 10px;
		margin: 5px;
		border-radius: 5px;
		cursor: pointer;
		color: white;
		font-weight: bold;
	}

	.category-label:hover {
		opacity: 0.8;
	}
</style>