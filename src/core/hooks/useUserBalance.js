import { useEffect, useState } from 'react'
import { useProfileQuery } from '../services/react-query/useProfileQuery'
import { useMarketQuery } from '../services/react-query/useMarketQuery'
import { useNavigate } from 'react-router-dom'
import { useWalletContext } from '../contexts/wallet'
import { FaExchangeAlt, FaArrowAltCircleUp, FaArrowAltCircleDown } from 'react-icons/fa'
import { HOME } from '../constants/urls'

export const getButtons = (size) => [
	{ name: 'deposit', icon: <FaArrowAltCircleUp color='#1ce087' size={size} /> },
	{ name: 'withdraw', icon: <FaArrowAltCircleDown color='#ce1440' size={size} /> },
	{ name: 'trade', icon: <FaExchangeAlt color='#4f31c5' size={size} /> },
]

const useUserBalance = () => {
	const navigate = useNavigate()
	const { setWallet, setCoin } = useWalletContext()

	const { data: profile } = useProfileQuery()
	const { data: market } = useMarketQuery()

	const [balanceFullList, setBalanceFullList] = useState([])
	const [balanceList, setBalanceList] = useState([])
	const [searchValue, setSearchValue] = useState('')

	useEffect(() => {
		if (market && profile) {
			const temp = []
			profile?.coins.map((coin) => {
				const coinDetails = market.find((c) => c.id === coin.coin)
				const available = coin.amount
				const blocked = coin.amountBlocked
				const all = available + blocked
				let tether
				if (coinDetails) {
					tether = all * coinDetails.value
				}
				temp.push({
					name: coin.coin,
					all,
					blocked,
					available,
					tether,
				})
			})
			const tether = market.find((c) => c.id === 'usdt')
			temp.unshift({
				name: 'tomanBalance',
				all: profile?.balance + profile?.balanceBlocked,
				blocked: profile?.balanceBlocked,
				available: profile?.balance,
				tether: tether ? profile?.balance / tether.sell : '',
			})
			setBalanceList(temp)
			setBalanceFullList(temp)
		}
	}, [market, profile])

	const onBalanceOperationsClicked = (btn, coin, disabled = false) => {
		if (disabled) {
			return
		}
		if (btn === 'trade') {
			window.location.href = HOME + `trade/${coin}_irt`
		} else {
			if (coin === 'tomanBalance') {
				setWallet((state) => ({ ...state, type: 'tooman' }))
				setCoin(null)
			} else {
				setWallet((state) => ({ ...state, op: btn }))
				setCoin(coin)
			}
			navigate('/wallets')
		}
	}

	const onInputValueChange = (e) => {
		const val = e?.target?.value
		setSearchValue(val)
		if (val) {
			const selectedBalance = balanceFullList.filter((b) => b.name.includes(val))
			setBalanceList(selectedBalance)
		} else {
			setBalanceList(balanceFullList)
		}
	}

	const onCloseSearchClicked = () => {
		setSearchValue('')
		setBalanceList(balanceFullList)
	}

	return {
		onInputValueChange,
		onCloseSearchClicked,
		searchValue,
		balanceList,
		onBalanceOperationsClicked,
	}
}

export default useUserBalance
