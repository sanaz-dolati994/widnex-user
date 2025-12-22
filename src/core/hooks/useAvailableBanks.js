import { useEffect } from 'react'
import { useAvailableBanksQuery } from '../services/react-query/useAvailableBanksQuery'

const useAvailableBanks = () => {
	const {
		data: availableBanks,
		isFetching: availableBanksLoading,
		refetch: refetchAvailableBanks,
	} = useAvailableBanksQuery()

	useEffect(refetchAvailableBanks, [])

	return {
		availableBanks,
		availableBanksLoading,
		refetchAvailableBanks,
	}
}

export default useAvailableBanks
