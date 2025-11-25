import axios from 'axios';
import {
	ElMessage
} from 'element-plus'; // 引入Element Plus的消息提示组件

// 基础URL
// const baseUrl = process.env.VUE_APP_API_BASE_URL || '/api';
const baseUrl = 'http://localhost:8080/api';

/**
 * 统一请求处理函数
 * @param {Function} requestFn - axios请求函数
 * @param {String} errorMsg - 错误提示信息
 * @returns {Promise} - 返回处理后的Promise
 */
const handleRequest = async (requestFn, errorMsg) => {
	try {
		const response = await requestFn();
		// 假设后端返回格式为 { code, data, message }
		if (response.data.code === 200) {
			return response.data.data;
		} else {
			ElMessage.error(response.data.message || errorMsg);
			return Promise.reject(new Error(response.data.message || errorMsg));
		}
	} catch (error) {
		ElMessage.error(error.message || '网络请求异常');
		return Promise.reject(error);
	}
};

/**
 * 获取标签列表（支持分页和筛选）
 * @param {Object} params - 查询参数
 * @param {number} params.pageNum - 页码（默认1）
 * @param {number} params.pageSize - 每页条数（默认10）
 * @param {string} params.keyword - 搜索关键词（标签名称模糊匹配）
 * @returns {Promise} - 响应Promise
 */
export const getTagList = (params = {}) => {
	// 参数验证和默认值处理
	const validParams = {
		pageNum: params.pageNum || 1,
		pageSize: params.pageSize || 10,
		keyword: params.keyword || ''
	};

	return handleRequest(
		() => axios.get(`${baseUrl}/tags`, {
			params: validParams
		}),
		'获取标签列表失败'
	);
};

/**
 * 获取单个标签详情
 * @param {number|string} id - 标签ID
 * @returns {Promise} - 响应Promise
 */
export const getTagDetail = (id) => {
	if (!id) {
		ElMessage.warning('标签ID不能为空');
		return Promise.reject(new Error('标签ID不能为空'));
	}

	return handleRequest(
		() => axios.get(`${baseUrl}/tags/${id}`),
		'获取标签详情失败'
	);
};

/**
 * 创建新标签
 * @param {Object} data - 标签数据
 * @param {string} data.name - 标签名称（必填）
 * @param {string} [data.description] - 标签描述（可选）
 * @returns {Promise} - 响应Promise
 */
export const createTag = (data) => {
	// 表单验证
	if (!data || !data.name) {
		ElMessage.warning('标签名称不能为空');
		return Promise.reject(new Error('标签名称不能为空'));
	}

	if (data.name.length > 50) {
		ElMessage.warning('标签名称不能超过50个字符');
		return Promise.reject(new Error('标签名称不能超过50个字符'));
	}

	return handleRequest(
		() => axios.post(`${baseUrl}/tags`, {
			name: data.name.trim(),
			description: (data.description || '').trim()
		}),
		'创建标签失败'
	);
};

/**
 * 更新标签信息
 * @param {number|string} id - 标签ID
 * @param {Object} data - 待更新的标签数据
 * @param {string} data.name - 标签名称
 * @param {string} [data.description] - 标签描述
 * @returns {Promise} - 响应Promise
 */
export const updateTag = (id, data) => {
	if (!id) {
		ElMessage.warning('标签ID不能为空');
		return Promise.reject(new Error('标签ID不能为空'));
	}

	if (!data || !data.name) {
		ElMessage.warning('标签名称不能为空');
		return Promise.reject(new Error('标签名称不能为空'));
	}

	if (data.name.length > 50) {
		ElMessage.warning('标签名称不能超过50个字符');
		return Promise.reject(new Error('标签名称不能超过50个字符'));
	}

	return handleRequest(
		() => axios.put(`${baseUrl}/tags/${id}`, {
			name: data.name.trim(),
			description: (data.description || '').trim()
		}),
		'更新标签失败'
	);
};

/**
 * 删除标签
 * @param {number|string} id - 标签ID
 * @returns {Promise} - 响应Promise
 */
export const deleteTag = (id) => {
	if (!id) {
		ElMessage.warning('标签ID不能为空');
		return Promise.reject(new Error('标签ID不能为空'));
	}

	return handleRequest(
		() => axios.delete(`${baseUrl}/tags/${id}`),
		'删除标签失败'
	);
};

/**
 * 获取所有标签（用于选择器，无分页）
 * @returns {Promise} - 响应Promise
 */
export const getAllTags = () => {
	return handleRequest(
		() => axios.get(`${baseUrl}/tags/all`),
		'获取所有标签失败'
	);
};

/**
 * 批量获取标签（根据ID列表）
 * @param {Array} ids - 标签ID数组
 * @returns {Promise} - 响应Promise
 */
export const getTagsByIds = (ids) => {
	if (!ids || !ids.length) {
		ElMessage.warning('标签ID列表不能为空');
		return Promise.resolve([]); // 空列表时返回空数组
	}

	return handleRequest(
		() => axios.get(`${baseUrl}/tags/batch`, {
			params: {
				ids: ids.join(',')
			}
		}),
		'批量获取标签失败'
	);
};

/**
 * 检查标签名称是否已存在
 * @param {string} name - 标签名称
 * @param {number|string} [excludeId] - 排除的标签ID（用于编辑时）
 * @returns {Promise<boolean>} - 是否存在
 */
export const checkTagNameExists = (name, excludeId) => {
	if (!name) {
		return Promise.resolve(false);
	}

	return handleRequest(
		() => axios.get(`${baseUrl}/tags/check-name`, {
			params: {
				name: name.trim(),
				excludeId: excludeId || ''
			}
		}),
		'检查标签名称失败'
	);
};