import axios from 'axios';
import { BASE_URL, BASE_URL_V2 } from '../../constants/urls';

const postApi = (data, path) => {
	return axios.post(BASE_URL + path, {
		'x-platform': 'web',
		...data,
	});
};

const postApiWithToken = (data, token, path) => {
	return axios.post(BASE_URL + path, data, {
		headers: {
			'x-auth-token': token,
		},
	});
};


const postApiWithTokenV2 = (data, token, path) => {
	return axios.post(BASE_URL_V2 + path, data, {
		headers: {
			'x-auth-token': token,
		},
	});
};

export { postApi, postApiWithToken, postApiWithTokenV2 };
