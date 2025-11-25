// src/api/dressDisplay.js
import axios from 'axios';

const baseUrl = 'http://localhost:8080';

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