import { useMemo, useState } from 'react'
import { formatNumber } from '../../core/utils/common'
import Text from '../../core/utils/Text'
import { Heading } from '../../styles/newStyles/Dashboard.styled'
import { useWalletRealTimeData } from '../newWallet/useWalletData'
import styled from 'styled-components'
import { SOCKET_URL } from '../../core/constants/urls'

export default function BalanceOverview() {
	const currencyTabs = ['tooman', 'usdt']

	const [currencyTab, setCurrencyTab] = useState('tooman')
	const type = currencyTab === 'tooman' ? 'irt' : 'usdt'

	const { myBalance } = useWalletRealTimeData()

	const chartData = useMemo(() => {
		let res = []
		const sorted = [...myBalance.coins]
		sorted.sort((a, b) => (a.value < b.value ? 1 : a.value > b.value ? -1 : 0))

		let total = 0
		for (const c of sorted) total += c.value

		for (let i = 0; i < Math.min(5, sorted.length); i++) {
			const curr = sorted[i]
			const item = {
				name: curr.id.toUpperCase(),
				value: curr.value,
				pc: !!total ? ((curr.value / total) * 100).toFixed(2) : 0,
			}
			res.push(item)
		}
		let other = {
			name: 'Other',
			value: 0,
			pc: 0,
		}
		for (let i = 5; i < sorted.length; i++) {
			const curr = sorted[i]
			other.value += curr.value
		}
		if (other.value) {
			other.pc = Math.floor((other.value / total) * 100)
			res.push(other)
		}
		return res
	}, [myBalance.coins])

	return (
		<>
			<Heading>
				<h2 className='font-semibold'>
					<Text tid='your-wallet' />
				</h2>

				<div className={'flex items-center w-28 rounded-md bg-gray-light dark:bg-white/10 p-1'}>
					{currencyTabs.map((tab) => {
						const active = currencyTab === tab
						return (
							<div
								className={`text-center w-1/2 rounded-lg ${
									active && 'text-white bg-cBlue'
								} cursor-pointer`}
								onClick={() => setCurrencyTab(tab)}
							>
								<Text tid={tab} className={'text-xs'} />
							</div>
						)
					})}
				</div>
			</Heading>
			<div className='flex items-center justify-between gap-2 mt-2'>
				<p className='dark:text-white/50 text-sm'>
					<Text tid='wallet_subheading' />
				</p>
				<div className={'flex items-center gap-1'}>
					<span className={'text-lg font-semibold'}>
						{formatNumber(myBalance[currencyTab], { type })}
					</span>
					<Text
						className={'text-xs dark:text-white/50'}
						tid={currencyTab === 'tooman' ? 'tooman' : 'usdt'}
					/>
				</div>
			</div>

			<div className='mt-2' dir='ltr'>
				<Chart data={chartData} />
			</div>
		</>
	)
}

const getImageSource = (coinName) =>
	coinName === 'IRT'
		? require('../../assets/images/tooman.png')
		: SOCKET_URL + `assets/icon/${coinName.toLowerCase()}.png`

const Chart = ({ data }) => {
	const [details, setDetails] = useState({ show: false, coin: null })

	const colors = ['#5470c6', '#009393', '#f8a036', '#ee6666', '#ac9a00', '#e11222']

	const renderedParts = data.map((coin) => {
		let bgColor = ''
		switch (coin.name) {
			case 'IRT':
				bgColor = colors[4]
				break
			case 'USDT':
				bgColor = colors[1]
				break
			case 'BTC':
				bgColor = colors[2]
				break
			case 'LTC':
				bgColor = colors[0]
				break
			case 'TRX':
				bgColor = colors[5]
				break
			case 'Other':
				bgColor = '#c4c4c4'
				break
			default:
				// Generate a random color for the default case
				bgColor = `#${Math.floor(Math.random() * 16777215)
					.toString(16)
					.padStart(6, '0')}`
				break
		}

		const imgSrc = getImageSource(coin.name)

		return (
			<CoinPart
				key={coin.name}
				$bg={bgColor}
				$width={coin.pc}
				onMouseEnter={() => setDetails({ show: true, coin: { ...coin, imgSrc, bgColor } })}
				onMouseLeave={() => setDetails({ show: false, coin: null })}
			></CoinPart>
		)
	})

	const renderedItems = data.map((coin) => {
		return (
			<div key={coin.name} className=' flex flex-col items-center justify-center gap-y-2'>
				<div className='flex flex-col gap-y-2 justify-center'>
					<>
						{coin.name === 'Other' ? (
							<p className='rounded-full w-7 h-7 flex items-center justify-center border dark:border-borderPrimary border-card-border text-[10px]'>
								<Text tid='other' />
							</p>
						) : (
							<img
								width='28px'
								height='28px'
								src={getImageSource(coin.name)}
								alt={`${coin.name.toLowerCase()}.png`}
							/>
						)}
						<span className='font-bold text-center text-sm'>% {coin.pc}</span>
					</>
				</div>
			</div>
		)
	})

	return (
		<div className='relative'>
			<Details
				className='bg-gray-100 dark:bg-primaryBg'
				$show={details.show}
				$borderColor={details.coin?.bgColor || '#e2e2e2'}
			>
				<p className='flex items-center gap-x-2 text-sm'>
					<span>{formatNumber(details.coin?.value)}</span>
					{details.coin?.name !== 'Other' && (
						<img
							width='22px'
							height='22px'
							src={details.coin?.imgSrc}
							alt={`${details.coin?.name.toLowerCase()}.png`}
						/>
					)}
					<span>{details.coin?.name}</span>
				</p>
				<span>-</span>
				<p className='font-bold'>{details.coin?.pc} %</p>
			</Details>
			<div className='mt-1 mb-4 w-full h-8 rounded-full overflow-x-hidden flex items-center'>
				{renderedParts}
			</div>

			<div className='flex justify-between items-start flex-col gap-2 flex-wrap'>
				{/* <span className='self-end'>
					<Text className='text-sm' tid='asset-allocation-by-percentage' />
				</span> */}
				<div className='flex items-center  lg:justify-start gap-10 flex-wrap w-full p-4'>
					{renderedItems}
				</div>
			</div>
		</div>
	)
}

const CoinPart = styled.div`
	width: ${(props) => props.$width}%;
	height: 100%;
	background-color: ${(props) => props.$bg};
	cursor: help;
	display: flex;
	align-items: center;
	justify-content: center;
	column-gap: 5px;
`

const Details = styled.div`
	position: absolute;
	top: -35px;
	padding: 0 1rem;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	column-gap: 1rem;
	background-color: #c33;
	height: 32px;
	border: 1px solid ${(props) => props.$borderColor};
	border-radius: 8px;

	visibility: ${(props) => (props.$show ? 'visible' : 'hidden')};
`
