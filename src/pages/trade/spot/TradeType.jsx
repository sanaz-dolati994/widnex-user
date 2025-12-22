import { useEffect, useState } from 'react'
import { useAuthContext } from '../../../core/contexts/auth'
import { useMainContext } from '../../../core/contexts/main'
import { useWindowSize } from '../../../core/hooks/useWindowSize'
import { useAvailableCoin } from '../utils/useMarketQuery'
import SpotInput from './SpotInput'
import { formatNumber, stringToNumber } from '../../../core/utils/common'
import { HOME } from '../../../core/constants/urls'
import Slider from './Slider'
import Text from '../../../core/utils/Text'

const TradeType = ({
	type,
	activeTab,
	userInput,
	setUserInput,
	onOperationClicked,
	valid,
	ocoError,
}) => {
	const { profile } = useAuthContext()
	const { data: availableCoins } = useAvailableCoin()
	const {
		market,
		main: { lang },
	} = useMainContext()
	const { width } = useWindowSize()

	const [sliderVal, setSliderVal] = useState(0)
	const [available, setAvailable] = useState({
		buy: 0,
		sell: 0,
	})

	const [limits, setLimits] = useState({
		max: '',
		min: '',
	})

	const [depositHover, setDepositHover] = useState(false)

	const limitErrorInitial = {
		error: false,
		type: '',
		value: '',
		userError: false,
	}
	const [limitsError, setLimitsError] = useState(limitErrorInitial)

	/**
	 * setting available balances
	 */
	useEffect(() => {
		const sell = profile?.coins?.find((c) => c.coin === market.coin)
		const buy = profile?.coins?.find((c) => c.coin === market.pair)
		if (market.pair === 'irt') {
			setAvailable({ buy: profile?.balance ? profile?.balance : 0, sell: sell ? sell.amount : 0 })
		} else {
			setAvailable({ buy: buy ? buy.amount : 0, sell: sell ? sell.amount : 0 })
		}
	}, [profile, market])

	/**
	 * setting order limits
	 */
	useEffect(() => {
		if (availableCoins) {
			const coin = availableCoins.find((c) => c.id === market.coin)
			if (coin) {
				setLimits({
					max: coin.order.max,
					min: coin.order.min,
				})
			}
		}
	}, [availableCoins, market])

	/**
	 * setting limit errors
	 */
	useEffect(() => {
		const amount = stringToNumber(userInput.amount)

		let userBalance = available[type]
		if (type === 'buy') {
			userBalance = available[type] / stringToNumber(userInput.price)
		}

		if (amount > limits.max || amount > parseFloat(parseFloat(userBalance).toFixed(6))) {
			setLimitsError({
				error: true,
				type: 'max',
				value: limits.max,
				userError: amount > userBalance,
			})
		} else if (amount < limits.min || !amount) {
			setLimitsError({ error: true, type: 'min', value: limits.min, userError: false })
		} else {
			setLimitsError(limitErrorInitial)
		}
	}, [userInput, limits, available])

	// input change
	const onValueChange = (val, type) => {
		let total
		let amount
		switch (type) {
			case 'price':
				total = stringToNumber(val) * stringToNumber(userInput.amount)
				setUserInput((state) => ({
					...state,
					price: val,
					total: formatNumber(total, { type: 'irt' }),
				}))
				break
			case 'amount':
				total = stringToNumber(userInput.price) * stringToNumber(val)
				if (activeTab === 2) total = stringToNumber(val) * stringToNumber(userInput.limit)
				setUserInput((state) => ({
					...state,
					total: formatNumber(total, { type: 'irt' }),
					amount: val,
				}))
				break
			case 'total':
				amount = stringToNumber(val) / stringToNumber(userInput.price)
				if (activeTab === 2) amount = stringToNumber(val) / stringToNumber(userInput.limit)
				setUserInput((state) => ({
					...state,
					amount: formatNumber(amount, { point: 6 }),
					total: val,
				}))
				break
			case 'limit':
				setUserInput((state) => {
					const newState = { ...state }
					newState.limit = val
					if (activeTab === 2) {
						newState.price = val
					}
					return newState
				})
				break
			case 'stop':
				setUserInput((state) => ({ ...state, stop: val }))
				break
			default:
				break
		}
	}

	// slider change
	const onSliderChange = (val) => {
		setSliderVal(val)

		const getPrice = (price) => {
			return price !== 0 ? (stringToNumber(price) > 1 ? stringToNumber(price) : price) : 0
		}
		if (!getPrice(userInput.price)) {
			return
		}

		let amount
		let total
		if (type === 'buy') {
			amount = (available[type] * val) / 100 / getPrice(userInput.price)
			total = amount * getPrice(userInput.price)
		} else {
			amount = (available[type] * val) / 100
			total = amount * getPrice(userInput.price)
		}
		setUserInput((state) => ({
			...state,
			total: formatNumber(total, { type: 'irt' }),
			amount: formatNumber(amount, { point: 6 }),
		}))
	}

	const onDepositClicked = () => {
		// const coin = type === "buy" ? market.pair : market.coin
		const locName = market.pair === 'irt' && type === 'buy' ? 'depositFiat' : 'depositCoin'
		window.location.href = HOME + `user/wallets/${locName}`
	}

	return (
		<div className={'flex flex-col gap-2 lg:w-[50%]'}>
			<SpotInput
				id={'spot-price'}
				isMarket={activeTab === 1}
				label={'قیمت'}
				suffix={market.pair}
				value={userInput.price}
				onValueChange={(v) => onValueChange(v, 'price')}
				error={ocoError.price}
				type={type}
			/>
			<SpotInput
				id={'spot-amount'}
				label={'مقدار'}
				placeholder={`${limits.min} تا ${limits.max}`}
				suffix={market.coin}
				value={userInput.amount}
				onValueChange={(v) => onValueChange(v, 'amount')}
				error={ocoError.amount}
				type={type}
			/>
			{activeTab > 1 ? (
				<SpotInput
					id={'spot-limit'}
					label={'لیمیت'}
					suffix={market.pair}
					value={userInput.limit}
					onValueChange={(v) => onValueChange(v, 'limit')}
					error={ocoError.limit}
					type={type}
				/>
			) : null}
			{activeTab > 2 ? (
				<SpotInput
					id={'spot-stop'}
					label={'استاپ'}
					suffix={market.pair}
					value={userInput.stop}
					onValueChange={(v) => onValueChange(v, 'stop')}
					error={ocoError.stop}
					type={type}
				/>
			) : null}

			<div className={'pb-7 pt-3'}>
				<div className={'text-xs flex justify-between pb-2'}>
					<span>در دسترس: </span>
					<span>
						{formatNumber(available[type], { type: type === 'buy' ? market.pair : market.coin })}
					</span>
				</div>
				<Slider val={sliderVal} onSliderChange={onSliderChange} disabled={available[type] === 0} />
			</div>

			<SpotInput
				label={'مجموع'}
				suffix={market.pair}
				value={userInput.total}
				onValueChange={(v) => onValueChange(v, 'total')}
				error={ocoError.total}
				type={type}
			/>

			<div
				className={`
                ${type === 'buy' ? 'bg-[#4FCB6A]' : 'bg-[#CB4F4F]'}
                h-[40px] w-full rounded-md mt-5 flex items-center justify-center text-white
                shadow-md
            `}
				onClick={() => onOperationClicked(limitsError, limits)}
			>
				<Text tid={!!profile ? (limitsError.userError ? 'increase-balance' : type) : 'signin'} />
			</div>
		</div>
	)
}

export default TradeType
