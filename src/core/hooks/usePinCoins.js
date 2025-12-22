import { useEffect, useState } from 'react'
import { useMarketQuery } from '../services/react-query/useMarketQuery'
import cookieService from '../services/cookie'

const FAV_KEY = 'market-favs'

export const usePinCoins = () => {
	const [allCoins, setAllCoins] = useState([])
	const [favs, setFavs] = useState(cookieService.get(FAV_KEY) ? cookieService.get(FAV_KEY) : [])

	const { data: market, isFetching } = useMarketQuery()
	useEffect(() => {
		!isFetching && setAllCoins(market)
	}, [market, isFetching])

	let temp = [...allCoins]
	if (market?.length) {
		const favCoins = []
		for (const _coin of temp) {
			if (favs?.includes(_coin.id)) favCoins.push({ ..._coin, fav: true })
			else favCoins.push({ ..._coin, fav: false })
		}
		temp = [...favCoins]
		temp = temp.filter((d) => d.fav)
	}

	const onFav = (id) => {
		let temp = [...favs]
		if (favs?.includes(id)) temp = favs.filter((d) => d !== id)
		else temp.push(id)
		setFavs(temp)
		cookieService.set(FAV_KEY, temp)
	}

	return { favs, onFav }
}
