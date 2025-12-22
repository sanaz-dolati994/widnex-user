import { useEffect } from 'react'
import { useAvailableCoinsQuery } from '../services/react-query/useAvailableCoinsQuery'

const useAvailableCoins = () => {
	const {
		data: availableCoins,
		isFetching: availableCoinsLoading,
		refetch: refetchAvailableCoins,
	} = useAvailableCoinsQuery()
	useEffect(refetchAvailableCoins, [])

	return {
		availableCoins,
		availableCoinsLoading,
		refetchAvailableCoins,
	}
}

export default useAvailableCoins
