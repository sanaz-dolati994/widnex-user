import {useMutation, useQuery} from 'react-query'
import { useNavigate } from 'react-router-dom'
import { useMainContext } from '../../contexts/main'
import { deleteApi } from '../fetch-api/delete'
import { normalFetch } from '../fetch-api/get'
import { postApiWithToken } from '../fetch-api/post'
import { putApi } from '../fetch-api/put'
import {useQueryContext} from "../../contexts/query";


const useProfileQuery = () => {
	const {
		profile: { token, setToken }
	} = useMainContext()
	const navigate = useNavigate()

	return useQuery('fetch-profile', () => normalFetch(token, 'profile'), {
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
		}
	})
}

const useProfileUpdateMutation = (onSuccess = () => {}) => {
	const {
		profile: { token },
	} = useMainContext()
	const { queryClient, setToast } = useQueryContext()

	return useMutation((data) => putApi(data, token, 'profile'), {
		onSuccess: () => {

			queryClient.invalidateQueries('fetch-profile')
			setToast({
				isError: false, show: true,
				message: "op-success",
			})
			onSuccess()
		},
	})
}

const useMeliCardMutation = () => {
	const {
		profile: { token },
	} = useMainContext()
	const { queryClient } = useQueryContext()

	return useMutation((data) => putApi(data, token, 'profile/idCard'), {
		onSuccess: () => {
			queryClient.invalidateQueries('fetch-profile')
		},
	})
}

const useSelfieMutation = () => {
	const {
		profile: { token },
	} = useMainContext()
	const { queryClient } = useQueryContext()

	return useMutation((data) => putApi(data, token, 'profile/selfi'), {
		onSuccess: () => {
			queryClient.invalidateQueries('fetch-profile')
		},
	})
}

const useProfileOtpMutation = (onOtpSuccess) => {
	const {
		profile: { token },
	} = useMainContext()
	return useMutation((data) => postApiWithToken(data, token, 'profile/otp'), {
		onSuccess: () => onOtpSuccess(),
	})
}

const useProfileVerfiyOtpMutation = (onVerifySuccess) => {
	const {
		profile: { token },
	} = useMainContext()
	const { queryClient } = useQueryContext()

	return useMutation((data) => postApiWithToken(data, token, 'profile/otp/verify'), {
		onSuccess: () => {
			queryClient.invalidateQueries('fetch-profile')
			onVerifySuccess()
		},
	})
}

const useUpdateProfileAvatar = () => {
	const {
		profile: { token },
	} = useMainContext()
	const { queryClient, setToast } = useQueryContext()

	return useMutation((data) => putApi(data, token, 'profile/avatar'), {
		onSuccess: () => {
			queryClient.invalidateQueries('fetch-profile')
			setToast({
				isError: false, show: true,
				message: "image-update"
			})
		},
	})
}

const useDeleteProfileAvatar = () => {
	const {
		profile: { token },
	} = useMainContext()
	const { queryClient, setToast } = useQueryContext()

	return useMutation(() => deleteApi(token, 'profile/avatar'), {
		onSuccess: () => {
			queryClient.invalidateQueries('fetch-profile')
			setToast({
				isError: false, show: true,
				message: "image-delete"
			})
		},
	})
}


const useGetUserStar = () => {

	const {
		profile: { token },
	} = useMainContext()

	return useQuery(
		'user-star', () => normalFetch(token, 'settings/wages/user'),
		{
			select: res => res?.data?.data
		}
	)
}

export const useProfileSettings = () => {
	const {
		profile: { token },
	} = useMainContext()

	return useQuery(
		'profile-settings', () => normalFetch(token, 'profile/settings'),
		{
			select: res => res?.data?.data,
			cacheTime: 5 * 60 * 1000,
			staleTime: 5 * 60 * 1000,
			enabled: !!token
		}
	)
}

export const useUpdateProfileSettings = () => {
	const {
		profile: { token },
	} = useMainContext()
	const { setToast, queryClient } = useQueryContext()

	return useMutation(
		'update-profile-settings', (payload) => putApi(payload, token, 'profile'),
		{
			onSuccess: () => {
				setToast({
					message: 'op-success', show: true
				})
				queryClient.invalidateQueries(['profile-settings'])
			}
		}
	)
}

export const useRequestFinanceOtp = (onSuccess) => {
	const {
		profile: { token },
	} = useMainContext()

	return useMutation(
		'finance-otp', (payload) => postApiWithToken(payload, token, 'profile/otp/finance'),
		{
			onSuccess
		}
	)
}

const useSoftDeleteBank = () => {
	const {
		profile: { token },
	} = useMainContext()
	const { setToast, queryClient } = useQueryContext()

	return useMutation(
		'soft-delete-bank', ({ payload, id }) => deleteApi(token, `profile/banks/${id}`, payload),
		{
			onSuccess: () => {
				setToast({
					message: 'op-success', show: true
				})
				queryClient.invalidateQueries(['fetch-profile'])
				queryClient.invalidateQueries(['fiat-deposit-account'])
			}
		}
	)
}

const useSoftDeleteWallet = () => {
	const {
		profile: { token },
	} = useMainContext()
	const { setToast, queryClient } = useQueryContext()

	return useMutation(
		'soft-delete-wallet', ({ payload, id }) => deleteApi(token, `profile/wallets/${id}`, payload),
		{
			onSuccess: () => {
				setToast({
					message: 'op-success', show: true
				})
				queryClient.invalidateQueries(['fetch-profile'])
			}
		}
	)
}

const useClaimKyc = () => {
	const {
		profile: { token },
	} = useMainContext()

	return useMutation(
		'claim-kyc', () => postApiWithToken({}, token, 'profile/kyc/claim')
	)
}

export {
	useProfileQuery,
	useProfileUpdateMutation,
	useMeliCardMutation,
	useSelfieMutation,
	useProfileOtpMutation,
	useProfileVerfiyOtpMutation,
	useUpdateProfileAvatar,
	useDeleteProfileAvatar,
	useGetUserStar,
	useSoftDeleteBank,
	useSoftDeleteWallet,
	useClaimKyc
}
