<template>
	<div ref="chart" style="width: 100%; height: 600px;"></div>
</template>

<script>
	import * as echarts from 'echarts';
	import {
		onMounted,
		ref
	} from 'vue';
	import axios from 'axios';

	export default {
		name: 'KnowledgeGraph',
		setup() {
			const chart = ref(null);
			const graphData = ref({
				nodes: [],
				links: []
			});

			// 从后端获取数据
			const fetchData = async () => {
				try {
					const response = await axios.get('http://localhost:8080/api/nodes-and-relationships');
					graphData.value = response.data;
					initChart();
				} catch (error) {
					console.error('Failed to fetch data:', error);
				}
			};

			// 初始化图表
			const initChart = () => {
				const myChart = echarts.init(chart.value);

				// 提取所有分类
				const categories = Array.from(new Set(graphData.value.nodes.map(node => node.category)))
					.map(category => ({
						name: category
					}));

				const option = {
					tooltip: {},
					legend: {
						data: categories.map(category => category.name),
					},
					series: [{
						type: 'graph',
						layout: 'force',
						symbolSize: 50,
						roam: true,
						label: {
							show: true,
							position: 'inside',
							formatter: '{b}',
						},
						edgeLabel: {
							show: true,
							formatter: '{c}',
						},
						force: {
							repulsion: 1000,
							edgeLength: 200,
						},
						data: graphData.value.nodes,
						links: graphData.value.links,
						categories: categories,
					}],
				};
				console.log('Graph Data:', graphData.value);
				console.log('Categories:', categories);

				myChart.setOption(option);
			};

		
			// 组件挂载时获取数据并初始化图表
			onMounted(() => {
				fetchData();
			});

			return {
				chart,
			};
		},
	};
</script>

<style scoped>
	/* 自定义样式 */
</style>