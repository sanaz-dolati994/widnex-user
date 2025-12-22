import { useEffect, useState } from 'react'
import { useMarketQuery } from '../services/react-query/useMarketQuery'

const useSymbolHook = () => {
	const { data: fullCoins } = useMarketQuery()

	const [coins, setCoins] = useState([])
	const [selectedCoin, setSelectedCoin] = useState()
	const [activeCoin, setActiveCoin] = useState(0)

	useEffect(() => {
		setCoins(fullCoins)
		if (fullCoins?.length) {
			setSelectedCoin(fullCoins[activeCoin])
		}
	}, [fullCoins])

	// const [change, setChange] = useState(
	//   changes?.find((c) => c.pair === `${selectedCoin.id}/IRT`)?.change
	// );
	const [modalOpen, setModalOpen] = useState(false)
	const [searchValue, setSearchValue] = useState('')

	const onCloseSearchClicked = () => {
		setCoins(fullCoins)
		setSearchValue('')
	}

	const onInputValueChange = (e) => {
		const value = e?.target?.value
		if (value) {
			setSearchValue(value)
			const newCoins = fullCoins.filter((c) => c.id.includes(value) || c.fa.includes(value))
			setCoins(newCoins)
		} else {
			setCoins(fullCoins)
			setSearchValue('')
		}
	}

	const onModalStateChange = (state) => {
		setModalOpen(state)
	}

	const onCoinChanged = (coin) => {
		setModalOpen(false)

		const idx = fullCoins.findIndex((c) => c.id === coin.coin)
		if (activeCoin !== idx) {
			setActiveCoin(idx)
			setSelectedCoin(fullCoins[idx])
			// setChange(
			//   changes.find((c) => c.pair === `${fullCoins[idx].id}/IRT`).change
			// );
			setCoins(fullCoins)
			setSearchValue('')
		}
	}

	return [
		coins,
		selectedCoin,
		modalOpen,
		searchValue,
		onModalStateChange,
		onCoinChanged,
		onCloseSearchClicked,
		onInputValueChange,
	]
}

export default useSymbolHook
