// src/api/dress.js
import axios from 'axios';

const baseUrl = 'http://localhost:8080';

// 礼服基础信息相关接口
export const saveDressBaseInfo = (dressBaseInfo, image, threeDModel, video) => {
	const formData = new FormData();
	formData.append('dressName', dressBaseInfo.dressName);
	formData.append('dressIntroduction', dressBaseInfo.dressIntroduction);
	formData.append('dressType', dressBaseInfo.dressType);
	formData.append('belongingPeriod', dressBaseInfo.belongingPeriod);
	formData.append('dressTag', dressBaseInfo.dressTag);
	formData.append('image', dressBaseInfo.image);
	formData.append('video', dressBaseInfo.video);
	formData.append('threeDModel', dressBaseInfo.threeDModel);
	formData.append('dressImg', dressBaseInfo.dressImg);
	//文件先上传
	if (image) formData.append('image', image);
	if (threeDModel) formData.append('threeDModel', threeDModel);
	if (video) formData.append('video', video);

	return axios.post(`${baseUrl}/dress-base-info`, formData, {
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	});
};

export const getAllDressBaseInfos = () => {
	return axios.get(`${baseUrl}/dress-base-info`);
};

export const getDressByPerid = (period) => {
	return axios.get(`${baseUrl}/dress-base-info/period`, {
		params: {
			period
		}
	});
};

export const getDressBaseInfoById = (dressId) => {
	return axios.get(`${baseUrl}/dress-base-info/${dressId}`);
};

export const deleteDressBaseInfo = (dressId) => {
	return axios.delete(`${baseUrl}/dress-base-info/${dressId}`);
};

// 礼服主体款式信息相关接口
export const saveDressStyleInfo = (dressStyleInfo, dressId, image, threeDModel, video) => {
	const formData = new FormData();
	formData.append('styleName', dressStyleInfo.styleName);
	formData.append('styleIntroduction', dressStyleInfo.styleIntroduction);
	formData.append('styleCategory', dressStyleInfo.styleCategory);
	formData.append('styleType', dressStyleInfo.styleType);
	formData.append('belongingPeriod', dressStyleInfo.belongingPeriod);
	formData.append('image', dressStyleInfo.image);
	formData.append('video', dressStyleInfo.video);
	formData.append('threeDModel', dressStyleInfo.threeDModel);
	formData.append('dressId', dressId);
	formData.append('matchingId', dressStyleInfo.matchingId);
	//补充Tag标签
	formData.append('styleTag', dressStyleInfo.styleTag);
	if (image) formData.append('image', image);
	if (threeDModel) formData.append('threeDModel', threeDModel);
	if (video) formData.append('video', video);

	return axios.post(`${baseUrl}/dress-style-info`, formData, {
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	});
};

export const getAllDressStyleInfos = () => {
	return axios.get(`${baseUrl}/dress-style-info`);
};

export const getDressStyleByPeriod = (period) => {
	return axios.get(`${baseUrl}/dress-style-info/period`, {
		params: {
			period
		}
	});
};

export const getDressStyleInfoById = (styleId) => {
	return axios.get(`${baseUrl}/dress-style-info/${styleId}`);
};

export const deleteDressStyleInfo = (styleId) => {
	return axios.delete(`${baseUrl}/dress-style-info/${styleId}`);
};

// 成套配伍信息相关接口
export const saveDressMatchingInfo = (dressMatchingInfo, dressId, image, threeDModel, video) => {
	const formData = new FormData();
	formData.append('matchingName', dressMatchingInfo.matchingName);
	formData.append('matchingIntroduction', dressMatchingInfo.matchingIntroduction);
	formData.append('matchingComposition', dressMatchingInfo.matchingComposition);
	formData.append('styleType', dressMatchingInfo.styleType);
	formData.append('belongingPeriod', dressMatchingInfo.belongingPeriod);
	formData.append('image', dressMatchingInfo.image);
	formData.append('video', dressMatchingInfo.video);
	formData.append('threeDModel', dressMatchingInfo.threeDModel);
	formData.append('dressId', dressId);
	formData.append('matchTag', dressMatchingInfo.matchTag);
	if (image) formData.append('image', image);
	if (threeDModel) formData.append('threeDModel', threeDModel);
	if (video) formData.append('video', video);

	return axios.post(`${baseUrl}/dress-matching-info`, formData, {
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	});
};

export const getAllDressMatchingInfos = () => {
	return axios.get(`${baseUrl}/dress-matching-info`);
};

export const getDressMatchingInfoById = (matchingId) => {
	return axios.get(`${baseUrl}/dress-matching-info/${matchingId}`);
};

export const deleteDressMatchingInfo = (matchingId) => {
	return axios.delete(`${baseUrl}/dress-matching-info/${matchingId}`);
};

//获取多媒体相关接口
//根据编号查询多媒体数据
export const getDressesByIds = (param) => {
	return axios.get(`${baseUrl}/multimedia/getByIds`, {
		params: {
			param
		}
	});
};

//  目前用不到，未建立关联关系
export const getDressesByPeriod = (period) => {
	return axios.get(`${baseUrl}/multimedia/getByPeriod`, {
		params: {
			period
		}
	});
};

// export const imageCrawler = (matchingId) => {
// 	return axios.post(`${baseUrl}/dress-matching-info`, formData, {
// 		headers: {
// 			'Content-Type': 'multipart/form-data'
// 		}
// 	});
// };