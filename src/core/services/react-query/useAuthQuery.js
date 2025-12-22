import { useMutation, useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { useMainContext } from '../../contexts/main'
import { deleteApi } from '../fetch-api/delete'
import { postApi, postApiWithToken } from '../fetch-api/post'
import { putApi } from '../fetch-api/put'
import { normalFetch } from '../fetch-api/get'
import { useQueryContext } from "../../contexts/query";
import { resetCrisp } from "../../../components/layouts/crisp/utils/useCreateCrisp";
import { HOME } from "../../constants/urls";

const useRequestOtp = (data, onError) => {

	return useQuery('request-otp', () => postApi(data, 'auth/otp'), {
		enabled: false,
		select: (res) => res.data,
		cacheTime: 0,
		retry: 1,
		onError
	})
}


const useVerifyOtp = (redirect) => {
	const {
		profile: { setToken },
	} = useMainContext()
	const { queryClient } = useQueryContext()

	return useMutation('verify-otp', (data) => postApi(data, 'auth/otp/verify'), {
		onSuccess: (res) => {
			if (!res.data?.data?.authenticator) {
				setToken(res.headers['x-auth-token'], !redirect)
				if (redirect) window.location.href = HOME + redirect
				queryClient.invalidateQueries('fetch-profile')
			}
		},
	})
}



const useVerify2fa = (redirect) => {
	const {
		profile: { setToken },
	} = useMainContext()
	const { queryClient } = useQueryContext()

	return useMutation('verify-2fa', (data) => postApi(data, 'auth/2fa/verify'), {
		onSuccess: async (res) => {
			setToken(res.headers['x-auth-token'], !redirect)
			if (redirect) window.location.href = HOME + redirect
			queryClient.invalidateQueries('fetch-profile')
		},
	})
}

const useSessionsQuery = () => {
	const {
		profile: { token },
	} = useMainContext()
	return useQuery('fetch-sessions', () => normalFetch(token, 'auth/sessions'), {
		enabled: !!token,
		refetchOnWindowFocus: false,
		select: (res) => res.data,
	})
}

const useActive2faMutation = () => {
	const {
		profile: { token },
	} = useMainContext()

	return useMutation('active-2fa', () => postApiWithToken({}, token, 'profile/2fa/active'))
}

const useVerify2faMutation = (onSuccess) => {
	const {
		profile: { token },
	} = useMainContext()
	const { queryClient } = useQueryContext()

	return useMutation('active-2fa', (data) => putApi(data, token, 'profile/2fa/verify'), {
		onSuccess: () => {
			queryClient.invalidateQueries('fetch-profile')
			onSuccess()
		},
	})
}

const useRemove2faMutation = (onSuccess) => {
	const {
		profile: { token },
	} = useMainContext()
	const { queryClient } = useQueryContext()

	return useMutation('active-2fa', (data) => putApi(data, token, 'profile/2fa/remove'), {
		onSuccess: () => {
			queryClient.invalidateQueries('fetch-profile')
			onSuccess()
		},
	})
}

const useDeleteSessionMutation = () => {
	const {
		profile: { token },
	} = useMainContext()
	const { queryClient, setToast } = useQueryContext()

	return useMutation('remove-session', (session) => deleteApi(token, `auth/sessions/${session}`), {
		onSuccess: () => {
			queryClient.invalidateQueries('fetch-sessions')
			setToast({
				isError: false, show: true,
				message: "op-success"
			})
		},
	})
}

const useLogout = (onSuccess) => {
	const {
		profile: { token },
	} = useMainContext()
	return useMutation('logout', () => deleteApi(token, 'auth/token'), {
		onSuccess
	})
}

export {
	useRequestOtp,
	useVerifyOtp,
	useVerify2fa,
	useSessionsQuery,
	useActive2faMutation,
	useVerify2faMutation,
	useRemove2faMutation,
	useDeleteSessionMutation,
	useLogout,
}
