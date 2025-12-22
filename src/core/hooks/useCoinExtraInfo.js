import { useEffect, useState } from 'react'
import { useMarketQuery } from '../services/react-query/useMarketQuery'

const useCoinExtraInfo = ({ coin } = {}) => {
	const { data: market } = useMarketQuery()

	const [coinExtraInfo, setCoinExtraInfo] = useState({})

	const getExtraInfo = (coin) => {
		return coin ? market?.filter((item) => item.id === coin)[0] : {}
	}

	useEffect(() => {
		if (coin) {
			setCoinExtraInfo(getExtraInfo(coin))
		}
	}, [coin])

	return {
		coinExtraInfo,
		getExtraInfo,
	}
}

export default useCoinExtraInfo
