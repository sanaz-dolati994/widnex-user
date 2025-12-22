import axios from 'axios';
import { BASE_URL } from '../../constants/urls';

const putApi = (data, token, path) => {
	return axios.put(BASE_URL + path, data, {
		headers: {
			'x-auth-token': token,
		},
	});
};

export { putApi };
