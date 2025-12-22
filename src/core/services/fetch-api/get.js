import axios from 'axios';
import { BASE_URL, BASE_URL_V2 } from '../../constants/urls';
import { getUrlWithQueries } from '../../utils/getUrlWithQueries';

const filterFetch = (data, token, path) => {
	return axios.get(getUrlWithQueries(BASE_URL + path, data), {
		headers: {
			'x-auth-token': token,
		},
	});
};

const filterFetchV2 = (data, token, path) => {
	return axios.get(getUrlWithQueries(BASE_URL_V2 + path, data), {
		headers: {
			'x-auth-token': token,
		},
	});
};

const normalFetch = (token, path) => {
	return axios.get(BASE_URL + path, {
		headers: {
			'x-auth-token': token,
		},
	});
};

const normalFetchV2 = (token, path) => {
	return axios.get(BASE_URL_V2 + path, {
		headers: {
			'x-auth-token': token,
		},
	});
};

/**
 * Get api
 * @param {string} path
 * @returns {Promise}
 */
const normalFetchWithoutToken = (path) => {

	return axios.get(BASE_URL + path);
};


export { filterFetch, normalFetch, normalFetchWithoutToken, normalFetchV2, filterFetchV2 };
