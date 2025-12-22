import { useState, useEffect } from 'react'
import {
	useBankTransactionsQuery,
	useWalletTransactionsQuery,
	useCancelCoinTransaction,
	useCancelBankTransaction,
} from '../services/react-query/useTransactionsQuery'

const useTransactions = ({
	walletInitialState = {},
	bankInitialState = {},
	fetchWallets = true,
	fetchBanks = true,
} = {}) => {
	const [allPages, setAllPages] = useState({ WT: null, BT: null })

	walletInitialState = {
		page: 1,
		dateFrom: null,
		search: {
			flow: 'flow',
			coin: 'coin',
		},
		query: {
			flow: '',
			coin: '',
		},
		...walletInitialState,
	}
	const [walletQueries, setWalletQueries] = useState(walletInitialState)
	const {
		data: walletTransactions,
		isFetching: walletFetching,
		refetch: walletRefetch,
	} = useWalletTransactionsQuery(walletQueries)

	bankInitialState = {
		page: 1,
		dateFrom: null,
		search: {
			flow: 'flow',
		},
		query: {
			flow: 'withdraw',
		},
		...bankInitialState,
	}
	const [bankQueries, setBankQueries] = useState(bankInitialState)
	const {
		data: bankTransactions,
		isFetching: bankFetching,
		refetch: bankRefetch,
	} = useBankTransactionsQuery(bankQueries)

	const { mutate: cancelCoinTransactionMutate } = useCancelCoinTransaction(walletRefetch)
	const { mutate: cancelBankTransactionMutate } = useCancelBankTransaction(bankRefetch)

	const onCancelTransaction = (item, type) => {
		console.log('on cancel transaction')
		if (type === 'wallet') {
			cancelCoinTransactionMutate(item._id)
		} else if (type === 'bank') {
			cancelBankTransactionMutate(item._id)
		}
	}

	useEffect(() => {
		if (
			(walletTransactions && !allPages.WT) ||
			(walletTransactions && allPages.WT !== walletTransactions.meta.total)
		) {
			setAllPages((state) => ({ ...state, WT: walletTransactions.meta.total }))
		}
		// eslint-disable-next-line
	}, [walletTransactions])

	useEffect(() => {
		if (
			(bankTransactions && !allPages.BT) ||
			(bankTransactions && allPages.BT !== bankTransactions.meta.total)
		) {
			setAllPages((state) => ({ ...state, BT: bankTransactions.meta.total }))
		}
		// eslint-disable-next-line
	}, [bankTransactions])

	useEffect(() => {
		fetchWallets && walletRefetch()
	}, [walletQueries, walletRefetch])

	useEffect(() => {
		fetchBanks && bankRefetch()
	}, [bankQueries, bankRefetch])

	return {
		bankQueries,
		bankFetching,
		bankTransactions,
		walletQueries,
		walletFetching,
		walletTransactions,
		allPages,
		setBankQueries,
		setWalletQueries,
		bankInitialState,
		walletInitialState,
		walletRefetch,
		bankRefetch,
		cancelCoinTransactionMutate,
		onCancelTransaction,
	}
}

export default useTransactions
