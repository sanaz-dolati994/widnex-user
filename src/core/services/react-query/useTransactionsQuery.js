import { useMutation, useQuery } from 'react-query'
import { useMainContext } from '../../contexts/main'
import { filterFetch, normalFetch } from '../fetch-api/get'
import { deleteApi } from '../fetch-api/delete'

const useWalletTransactionsQuery = (data) => {
	const {
		profile: { token },
	} = useMainContext()

	return useQuery('wallet-transactions', () => filterFetch(data, token, 'coining'), {
		enabled: !!token,
		select: (res) => res.data,
		refetchOnWindowFocus: false,
		refetchInterval: 15000,
	})
}

const useGetBankTransaction = (id) => {
	const {
		profile: { token },
	} = useMainContext()

	return useQuery('get-single-bank-transaction', () => normalFetch(token, `banking/${id}`), {
		enabled: false,
		select: (res) => res.data,
		refetchOnWindowFocus: false,
		// cacheTime: 60 * 1000,
		refetchInterval: 15000,
	})
}

const useBankTransactionsQuery = (data) => {
	const {
		profile: { token },
	} = useMainContext()

	return useQuery('bank-transactions', () => filterFetch(data, token, 'banking'), {
		enabled: !!token,
		select: (res) => res.data,
		refetchOnWindowFocus: false,
		refetchInterval: 60000,
	})
}

const useCancelCoinTransaction = (onSuccess) => {
	const {
		profile: { token },
	} = useMainContext()

	return useMutation('coin-transaction-cancel', (id) => deleteApi(token, `coining/${id}`), {
		enabled: !!token,
		select: (res) => res.data,
		onSuccess: () => onSuccess()
	})
}

const useCancelBankTransaction = (onSuccess) => {
	const {
		profile: { token },
	} = useMainContext()

	return useMutation('bank-transaction-cancel', (id) => deleteApi(token, `banking/${id}`), {
		enabled: !!token,
		select: (res) => res.data,
		onSuccess: () => onSuccess()
	})
}
export { useWalletTransactionsQuery, useBankTransactionsQuery, useGetBankTransaction, useCancelCoinTransaction, useCancelBankTransaction }
