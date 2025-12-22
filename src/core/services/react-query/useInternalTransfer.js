import { useMutation, useQuery } from 'react-query'
import { useMainContext } from '../../contexts/main'
import { useQueryContext } from '../../contexts/query'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { getUrlWithQueries } from '../../utils/getUrlWithQueries'
import { filterFetch, normalFetch } from '../fetch-api/get'
import { postApiWithToken } from '../fetch-api/post'

// const BASE_URL = 'https://dev.exdev.ir/v1/'

// const normalFetch = (token, path) => {
// 	return axios.get(BASE_URL + path, {
// 		headers: {
// 			'x-auth-token': token,
// 		},
// 	})
// }

// const filterFetch = (data, token, path) => {
// 	return axios.get(getUrlWithQueries(BASE_URL + path, data), {
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

export const useGetCoinsList = () => {
	const {
		profile: { token },
	} = useMainContext()

	// let modifiedToken = ''
	// if (!!token)
	// 	modifiedToken =
	// 		'ed0b9107-55ed-44e4-b6a4-a8ea12fa08fedf65141783-7d8a-4d12-ba34-044e276da88f6e6c9d3c-2414-4e34-bd21-6b9f32f003e9'

	return useQuery('get-coins-list', () => normalFetch(token, 'settings/internal/transfer'), {
		select: (res) => res?.data.data,
	})
}

export const useGetTransfersList = () => {
	const {
		profile: { token },
	} = useMainContext()

	// let modifiedToken = ''
	// if (!!token)
	// 	modifiedToken =
	// 		'ed0b9107-55ed-44e4-b6a4-a8ea12fa08fedf65141783-7d8a-4d12-ba34-044e276da88f6e6c9d3c-2414-4e34-bd21-6b9f32f003e9'

	return useQuery('get-transfers-list', () => normalFetch(token, 'transfers'), {
		select: (res) => res?.data,
	})
}

export const useGetTransfersListFiltered = (data) => {
	const {
		profile: { token },
	} = useMainContext()

	// let modifiedToken = ''
	// if (!!token)
	// 	modifiedToken =
	// 		'ed0b9107-55ed-44e4-b6a4-a8ea12fa08fedf65141783-7d8a-4d12-ba34-044e276da88f6e6c9d3c-2414-4e34-bd21-6b9f32f003e9'

	return useQuery('get-transfers-list-filtered', () => filterFetch(data, token, 'transfers'), {
		enabled: !!token,
		select: (res) => res.data,
		refetchOnWindowFocus: false,
		refetchInterval: 60000,
	})

	// return useQuery('get-transfers-list', () => normalFetch(modifiedToken, 'transfers'), {
	// 	select: (res) => res?.data,
	// })
}

export const useCreateInvoiceMutation = (onSuccess = () => {}) => {
	const {
		profile: { token },
	} = useMainContext()
	const { queryClient, setToast } = useQueryContext()

	// let modifiedToken = ''
	// if (!!token)
	// 	modifiedToken =
	// 		'ed0b9107-55ed-44e4-b6a4-a8ea12fa08fedf65141783-7d8a-4d12-ba34-044e276da88f6e6c9d3c-2414-4e34-bd21-6b9f32f003e9'

	return useMutation(
		'create-internal-transfer-invoice',
		(data) => {
			return postApiWithToken(data, token, `transfers/invoice`)
		},
		{
			onSuccess: () => {
				// queryClient.invalidateQueries('get-contacts-list')
				setToast({
					show: true,
					message: 'op-success',
					isError: null,
				})
				onSuccess()
			},
		}
	)
}

export const useMakeTransferMutation = (onSuccess = () => {}) => {
	const {
		profile: { token },
	} = useMainContext()
	const { queryClient, setToast } = useQueryContext()

	// let modifiedToken = ''
	// if (!!token)
	// 	modifiedToken =
	// 		'ed0b9107-55ed-44e4-b6a4-a8ea12fa08fedf65141783-7d8a-4d12-ba34-044e276da88f6e6c9d3c-2414-4e34-bd21-6b9f32f003e9'

	return useMutation(
		'make-internal-transfer',
		(data) => {
			return postApiWithToken(data, token, `transfers`)
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries('fetch-profile-modified')
				queryClient.invalidateQueries('get-transfers-list')
				setToast({
					show: true,
					message: 'op-success',
					isError: null,
				})
				onSuccess()
			},
		}
	)
}

export const useProfileQuery = () => {
	const {
		profile: { token, setToken },
	} = useMainContext()
	const navigate = useNavigate()

	// let modifiedToken = ''
	// if (!!token)
	// 	modifiedToken =
	// 		'ed0b9107-55ed-44e4-b6a4-a8ea12fa08fedf65141783-7d8a-4d12-ba34-044e276da88f6e6c9d3c-2414-4e34-bd21-6b9f32f003e9'

	return useQuery('fetch-profile-modified', () => normalFetch(token, 'profile'), {
		enabled: !!token,
		select: (res) => res.data.data,
		refetchOnWindowFocus: false,
		retry: 0,
		cacheTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		onError: (res) => {
			if (res.response.status === 401) {
				setToken('')
				navigate('/register-signin')
			}
		},
	})
}
