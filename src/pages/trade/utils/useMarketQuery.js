import { useQuery } from "react-query"
import { normalFetch } from "../../../core/services/fetch-api/get"


/**
 * Market prices Get api
 * @returns {UseQuery}
 */
const useMarketQuery = () => {

    return useQuery(
        'fetch-market', () => normalFetch(null, "market"),
        {
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000,
            select: (res) => (res.data?.data)
        }
    )
}


/**
 * Available pairs Get api
 * @returns {UseQuery}
 */
const usePairsQuery = () => {
    return useQuery(
        'fetch-pairs', () => normalFetch(null, "settings/pairs"),
        {
            select: (res) => (res?.data?.data),
            cacheTime: 60 * 60 * 1000,
            staleTime: 60 * 60 * 1000,
            refetchOnWindowFocus: false,
        }
    )
}


const useAvailableCoin = () => {

    return useQuery(
        'fetch-available-coins', () => normalFetch(null, "settings/coins"),
        {
            select: (res) => (res?.data?.data),
            cacheTime: 60 * 60 * 1000,
            staleTime: 60 * 60 * 1000,
            refetchOnWindowFocus: false
        }
    )
}



export {
    useMarketQuery,
    usePairsQuery,
    useAvailableCoin
}