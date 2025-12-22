import axios from 'axios';
import { BASE_URL } from '../../constants/urls';

const deleteApi = (token, path, payload = {}) => {
	return axios.delete(BASE_URL + path, {
		data: payload,
		headers: {
			'x-auth-token': token,
		},
	});
};

export { deleteApi };
