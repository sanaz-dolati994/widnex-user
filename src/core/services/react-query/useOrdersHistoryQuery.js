import { useQuery } from 'react-query'
import { useMainContext } from '../../contexts/main'
import { filterFetch } from '../fetch-api/get'

const useOrdersHistoryQuery = (data) => {
	const {
		profile: { token },
	} = useMainContext()
	return useQuery('fetch-orders-history', () => filterFetch(data, token, 'trades'), {
		enabled: !!token,
		select: (res) => res.data,
		refetchOnWindowFocus: false,
	})
}

const useOtcHistoryQuery = (data) => {
	const {
		profile: { token },
	} = useMainContext()
	return useQuery('fetch-otc-history', () => filterFetch(data, token, 'otc'), {
		enabled: !!token,
		select: (res) => res.data,
		refetchOnWindowFocus: false,
	})
}

export { useOrdersHistoryQuery, useOtcHistoryQuery }
