import { useEffect, useState } from 'react'
import { useGetTransfersListFiltered } from '../services/react-query/useInternalTransfer'

export const useTransfers = (transfersInitialState = {}, fetchTransfers = true) => {
	transfersInitialState = {
		page: 1,
		dateFrom: null,
		search: {
			currency: 'currency',
		},
		query: {
			currency: '',
		},
		...transfersInitialState,
	}

	const [transfersQueries, setTransfersQueries] = useState(transfersInitialState)

	const {
		data: filteredTransfers,
		isFetching: transfersFetching,
		refetch: transfersfetch,
	} = useGetTransfersListFiltered(transfersQueries)

	useEffect(() => {
		fetchTransfers && transfersfetch()
	}, [transfersQueries, transfersfetch])

	return {
		filteredTransfers,
		transfersQueries,
		setTransfersQueries,
		transfersInitialState,
		transfersLoading: transfersFetching,
	}
}
