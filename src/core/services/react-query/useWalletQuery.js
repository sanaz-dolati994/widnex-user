import { useMutation, useQuery } from 'react-query'
import { useMainContext } from '../../contexts/main'
import { normalFetch } from '../fetch-api/get'
import { postApiWithToken } from '../fetch-api/post'
import { useQueryContext } from '../../contexts/query'

const useAvailableCoinTokensQuery = (coin, onSuccessNetwork) => {
	const {
		profile: { token },
	} = useMainContext()

	return useQuery(
		'fetch-coin-tokens',
		() => normalFetch(token, `crypto/tokens?search=symbol&query=${coin ? coin : ''}`),
		{
			enabled: false,
			refetchOnWindowFocus: false,
			select: (res) => res.data,
			onSuccess: onSuccessNetwork,
		}
	)
}


const useDepositMutation = (onDepositSuccess = () => {}) => {
	const {
		profile: { token },
	} = useMainContext()

	return useMutation('deposit-coin', (data) => postApiWithToken(data, token, 'coining/deposit'), {
		onSuccess: onDepositSuccess,
	})
}



const useWithdrawMutation = ({ callback } = {}) => {
	const {
		profile: { token },
	} = useMainContext()
	const { setToast } = useQueryContext()
	return useMutation('withdraw-coin', (data) => postApiWithToken(data, token, 'coining/withdraw'), {
		onSuccess: () => {
			callback?.()

			setToast({
				isError: false,
				show: true,
				message: 'op-success',
			})
		},
	})
}


const useBankDepositMutation = (onSuccess) => {
	const {
		profile: { token },
	} = useMainContext()

	return useMutation('deposit-bank', (data) => postApiWithToken(data, token, 'banking/deposit'), {
		onSuccess,
	})
}

const useBankWithdrawMutation = ({ callback } = {}) => {
	const {
		profile: { token },
	} = useMainContext()
	const { setToast } = useQueryContext()

	return useMutation('withdraw-bank', (data) => postApiWithToken(data, token, 'banking/withdraw'), {
		onSuccess: () => {
			callback?.()

			setToast({
				isError: false,
				show: true,
				message: 'op-success',
			})
		},
	})
}

export {
	useAvailableCoinTokensQuery,
	useDepositMutation,
	useWithdrawMutation,
	useBankWithdrawMutation,
	useBankDepositMutation,
}
