import {
	createRouter,
	createWebHistory
} from 'vue-router';
import Home from '../pages/Home.vue';
import DressManagement from '../pages/DressManagement.vue';
import D3Graph from '../components/grownkg/D3Graph.vue';
import ObjViewer from '../components/grownkg/ObjViewer.vue'
import ThreeModelViewer from '../components/grownkg/ThreeModelViewer.vue'
import DressBaseInfoForm from '../components/dressmanage/DressBaseInfoForm.vue';
import DressStyleInfoForm from '../components/dressmanage/DressStyleInfoForm.vue';
import DressMatchingInfoForm from '../components/dressmanage/DressMatchingInfoForm.vue';
import DressBaseInfoList from '../components/dressmanage/DressBaseInfoList.vue';
import DressStyleInfoList from '../components/dressmanage/DressStyleInfoList.vue';
import DressMatchingInfoList from '../components/dressmanage/DressMatchingInfoList.vue';
import DisplayItem from '../components/dressdisplay/DisplayItem.vue';
import DressType from '../components/dressdisplay/DressType.vue';
import DressMatches from '../components/dressdisplay/DressMatches.vue';
import Tag from '../pages/TagManager.vue';
import ImageCrawler from '../components/tool/ImageCrawlerTool.vue';
import DressExhibitio from '../pages/DressExhibitio.vue';
import CompatibilityDisplay from '../components/dressdisplay/CompatibilityDisplay.vue';
import Type2March from '../components/dressdisplay/DressType2Match.vue';


const routes = [{
		path: '/home',
		name: 'Home',
		component: Home
	},
	{
		path: '/dress',
		name: 'DressManagement',
		component: DressManagement
	},
	{
		path: '/kg',
		name: 'D3Graph',
		component: D3Graph
	},
	{
		path: '/dress-base-info/list',
		name: 'DressBaseInfoList',
		component: DressBaseInfoList
	},
	{
		path: '/dress-base-info/add',
		name: 'DressBaseInfoAdd',
		component: DressBaseInfoForm
	},
	{
		path: '/dress-style-info/list',
		name: 'DressStyleInfoList',
		component: DressStyleInfoList
	},
	{
		path: '/dress-style-info/add',
		name: 'DressStyleInfoAdd',
		component: DressStyleInfoForm
	},
	{
		path: '/dress-matching-info/list',
		name: 'DressMatchingInfoList',
		component: DressMatchingInfoList
	},
	{
		path: '/dress-matching-info/add',
		name: 'DressMatchingInfoAdd',
		component: DressMatchingInfoForm
	},
	{
		path: '/dressitem',
		name: 'DisplayItem',
		component: DisplayItem
	}, {
		path: '/dresstype',
		name: 'DressType',
		component: DressType
	}, {

		path: '/3dview',
		name: 'ObjViewer',
		component: ObjViewer
	},
	{
		path: '/threemodel',
		name: 'ThreeModelViewer',
		component: ThreeModelViewer
	},
	{
		path: '/3dmatch',
		name: 'DressMatches',
		component: DressMatches
	},
	{
		path: '/tag',
		name: 'Tag',
		component: Tag
	},
	{
		path: '/image-crawler',
		name: 'ImageCrawler',
		component: ImageCrawler,
		meta: {
			title: '图片爬取工具'
		}
	},
	{
		path: '/exhibitio',
		name: 'DressExhibitio',
		component: DressExhibitio
	},
	{
		path: '/compatibilityDisplay',
		name: 'CompatibilityDisplay',
		component: CompatibilityDisplay
	},
	{
		path: '/type2March',
		name: 'Type2March',
		component: Type2March
	}
];

const router = createRouter({
	history: createWebHistory(),
	routes
});

export default router;