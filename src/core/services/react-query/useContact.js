import { useMutation, useQuery } from 'react-query'
import { useMainContext } from '../../contexts/main'
import { useQueryContext } from '../../contexts/query'
import { normalFetch } from '../fetch-api/get'
import { postApiWithToken } from '../fetch-api/post'
import { deleteApi } from '../fetch-api/delete'

// import axios from 'axios'
// const BASE_URL = 'https://dev.exdev.ir/v1/'

// const normalFetch = (token, path) => {
// 	return axios.get(BASE_URL + path, {
// 		headers: {
// 			'x-auth-token': token,
// 		},
// 	})
// }

// const postApiWithToken = (data, token, path) => {
// 	return axios.post(BASE_URL + path, data, {
// 		headers: {
// 			'x-auth-token': token,
// 		},
// 	})
// }

// const deleteApi = (token, path, payload = {}) => {
// 	return axios.delete(BASE_URL + path, {
// 		data: payload,
// 		headers: {
// 			'x-auth-token': token,
// 		},
// 	})
// }

// const putApi = (data, token, path) => {
// 	return axios.put(BASE_URL + path, data, {
// 		headers: {
// 			'x-auth-token': token,
// 		},
// 	})
// }

export const useGetContactsList = (page) => {
	const {
		profile: { token },
	} = useMainContext()

	// let modifiedToken = ''
	// if (!!token)
	// 	modifiedToken =
	// 		'ed0b9107-55ed-44e4-b6a4-a8ea12fa08fedf65141783-7d8a-4d12-ba34-044e276da88f6e6c9d3c-2414-4e34-bd21-6b9f32f003e9'

	return useQuery('get-contacts-list', () => normalFetch(token, `contacts?page=${page}&limit=10`), {
		select: (res) => res?.data,
	})
}

export const useCreateContactMutation = (onSettled = () => {}) => {
	const {
		profile: { token },
	} = useMainContext()
	const { queryClient, setToast } = useQueryContext()

	// let modifiedToken = ''
	// if (!!token)
	// 	modifiedToken =
	// 		'ed0b9107-55ed-44e4-b6a4-a8ea12fa08fedf65141783-7d8a-4d12-ba34-044e276da88f6e6c9d3c-2414-4e34-bd21-6b9f32f003e9'

	return useMutation(
		'add-contact',
		(data) => {
			return postApiWithToken(data, token, `contacts`)
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries('get-contacts-list')
				setToast({
					show: true,
					message: 'op-success',
					isError: null,
				})
			},
			onSettled: () => {
				onSettled()
			},
		}
	)
}

export const useDeleteContactMutation = () => {
	const {
		profile: { token },
	} = useMainContext()
	const { queryClient, setToast } = useQueryContext()

	// let modifiedToken = ''
	// if (!!token)
	// 	modifiedToken =
	// 		'ed0b9107-55ed-44e4-b6a4-a8ea12fa08fedf65141783-7d8a-4d12-ba34-044e276da88f6e6c9d3c-2414-4e34-bd21-6b9f32f003e9'

	return useMutation('delete-contact', (id) => deleteApi(token, `contacts/${id}`), {
		onSuccess: () => {
			queryClient.invalidateQueries('get-contacts-list')
			setToast({
				show: true,
				message: 'op-success',
				isError: null,
			})
		},
	})
}
