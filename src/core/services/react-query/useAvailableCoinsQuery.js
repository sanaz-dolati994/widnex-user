import { useQuery } from 'react-query'
import { normalFetch } from '../fetch-api/get'


const useAvailableCoinsQuery = () => {
	return useQuery('fetch-available-coins', () => normalFetch(null, `settings/coins`), {
		select: (res) => res.data,
		refetchOnWindowFocus: false,
	})
}

export { useAvailableCoinsQuery }
