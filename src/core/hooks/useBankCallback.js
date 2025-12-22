import { useEffect } from 'react'
import { useBankCallbackQuery } from '../services/react-query/useBankCallbackQuery'

const useBankCallback = ({ id, gateway, trackingCode, cardNo }) => {
	const {
		data: bankCallback,
		isFetching: bankCallbackLoading,
		refetch,
	} = useBankCallbackQuery({ id, gateway, trackingCode, cardNo })

	useEffect(refetch, [id])

	return {
		bankCallback,
		bankCallbackLoading,
		refetch,
	}
}

export default useBankCallback
