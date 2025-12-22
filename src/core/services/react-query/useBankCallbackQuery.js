import { useQuery } from 'react-query'
import { useMainContext } from '../../contexts/main'
import { putApi } from '../fetch-api/put'

export const useBankCallbackQuery = ({ id = '', gateway, trackingCode, cardNo }) => {
	const {
		profile: { token },
	} = useMainContext()

	let url = `banking/callback/${id}`

	if (gateway === 'payStar') {
		url += `?trackingCode=${trackingCode}&cardNo=${cardNo}`
	}

	return useQuery('fetch-bank-callback', () => putApi(undefined, token, url), {
		enabled: !!token,
		select: (res) => res.data?.data?.bankResult || {},
		refetchOnWindowFocus: false,
	})
}
