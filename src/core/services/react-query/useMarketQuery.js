import { useQuery } from 'react-query'
import { useMainContext } from '../../contexts/main'
import {filterFetch, normalFetch, normalFetchWithoutToken} from '../fetch-api/get'

const useMarketQuery = () => {
	const {
		profile: { token },
	} = useMainContext()

	return useQuery('fetch-market', () => normalFetch(token, 'market'), {
		enabled: !!token,
		refetchOnWindowFocus: false,
		staleTime: 5 * 60 * 1000,
		select: (res) => res.data?.data,
	})
}

const useGetDailyBalance = (params = {}) => {
	const {
		profile: { token },
	} = useMainContext()
	return useQuery(
		'daily-balance', () => filterFetch(params, token, `dailyBalance`, ),
		{
			enabled: !!token,
			refetchOnWindowFocus: false,
			select: (res) => res.data?.data,
		}
	)
}


const useGetDailyRecords = (params = {}) => {
	const {
		profile: { token },
	} = useMainContext()
	return useQuery(
		'daily-record', () => filterFetch(params, token, `dailyRecords`),
		{
			enabled: !!token,
			refetchOnWindowFocus: false,
			select: (res) => res.data?.data,
		}
	)
}


const useMarketVolumes = () => {

    return useQuery(
        'market-volumes', () => normalFetchWithoutToken('market/volume'),
        {
            select: res => res?.data?.data?.otc,
            refetchInterval: 5 * 60 * 1000
        }
    )
}


export { useMarketQuery, useGetDailyBalance, useGetDailyRecords, useMarketVolumes }
