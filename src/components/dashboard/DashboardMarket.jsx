import { FaChevronDown, FaChevronUp, FaSearch } from 'react-icons/fa'
import { useMarketQuery, useMarketVolumes } from '../../core/services/react-query/useMarketQuery'
import Text from '../../core/utils/Text'
import { useEffect, useMemo, useState } from 'react'
import { HOME, SOCKET_URL } from '../../core/constants/urls'
import { deepCopy, formatNumber } from '../../core/utils/common'
import { Link, useNavigate } from 'react-router-dom'
import { Heading } from '../../styles/newStyles/Dashboard.styled'
import { useWindowSize } from '../../core/hooks/useWindowSize'
import styled from 'styled-components'

export default function DashboardMarket() {
	const [coinList, setCoinList] = useState([])
	const [searchTerm, setSearchTerm] = useState('')

	const navigate = useNavigate()

	const { data: coins } = useMarketQuery()
	const { data: volumes } = useMarketVolumes()

	const volumedCoins = useMemo(() => {
		let temp = []
		coins?.forEach((coin) => {
			const newCoin = deepCopy(coin)
			const vol = volumes?.find((v) => v.coin === newCoin.id)
			let toomanVolume = 0
			let usdVolume = 0
			if (!!vol) {
				toomanVolume = vol.value
				usdVolume = toomanVolume / newCoin.value
			}
			newCoin.toomanVolume = toomanVolume
			newCoin.usdVolume = usdVolume
			temp.push(newCoin)
		})
		return temp
	}, [coins, volumes])

	useEffect(() => {
		setCoinList(volumedCoins)
	}, [coins, volumes, volumedCoins])

	const handleInputChange = (e) => {
		const value = e?.target?.value
		if (value) {
			setSearchTerm(value)
			const newCoins = volumedCoins.filter((c) => c.id.includes(value) || c.fa.includes(value))
			setCoinList(newCoins)
		} else {
			setCoinList(volumedCoins)
			setSearchTerm('')
		}
	}

	const { width } = useWindowSize()

	const TableConfig = width > 1024 ? TABLE_HEADERS : TABLE_HEADERS_MOBILE
	const headers = TableConfig.map((header) => {
		return (
			<div key={header.label} className='first:pr-4 text-right' style={{ width: header.width }}>
				<Text tid={header.label} className='text-[#A6A9B9] text-sm font-normal' />
			</div>
		)
	})

	return (
		<div className='py-5 lg:py-0 lg:h-full'>
			<Heading className='px-4'>
				<h2 className='text-heading dark:text-gray-light font-bold'>
					<Text tid='trade-markets' />
				</h2>
				{width > 1024 ? (
					<form className='bg-primary dark:bg-white/10 relative flex items-center w-48 px-4 py-2 rounded-lg'>
						<input
							type='text'
							className='block w-4/5 bg-transparent placeholder:text-sm'
							placeholder='جستجو در بازار...'
							value={searchTerm}
							onChange={handleInputChange}
						/>
						<FaSearch className='w-1/5 text-black/20 dark:text-pColor' />
					</form>
				) : (
					<Link to={`/otc`} className='text-sm text-cBlue'>
						<Text tid='all' />
					</Link>
				)}
			</Heading>

			<div className='mt-4 border-b dark:border-card-border flex'>{headers}</div>
			<div className='lg:overflow-y-auto lg:h-4/5 relative'>
				<div className=''>
					{coinList?.length > 0
						? coinList.map((coin) => {
							const isBearish = coin.changes['24h'].changePresent.startsWith('-')

							return (
								<div
									className='border-b dark:border-card-border last:border-b-0 w-full flex items-center'
									key={coin.id}
									onClick={() => {
										if (width <= 1024) navigate(`/otc?coin=${coin.id}`)
									}}
								>
									<TableCoumn width={TableConfig[0]} className=''>
										<div className='flex items-center gap-x-2 px-4 py-2'>
											<img
												src={SOCKET_URL + `assets/icon/${coin.id}.png`}
												alt={coin.id.toUpperCase()}
												className='w-7 h-7'
											/>
											<div className='flex flex-col'>
												<h5 className='text-sm'>{coin.id.toUpperCase()}</h5>
												<h5 className='text-xs text-[#A6A9B9]'>{coin.fa}</h5>
											</div>
										</div>
									</TableCoumn>

									<TableCoumn width={TableConfig[1]} className='text-sm'>
										<span>{`${formatNumber(coin.value)} $`}</span>
									</TableCoumn>

									{width > 1024 && (
										<TableCoumn width={TableConfig[2]}>
											<span>
												{formatNumber(coin.usdVolume, {
													type: 'usdt',
												})}
											</span>
										</TableCoumn>
									)}

									<TableCoumn
										width={TableConfig[3]}
										dir='ltr'
										className={`text-sm text-right ${isBearish ? 'text-red-500' : 'text-green-500'
											}`}
									>
										<div className='flex items-center justify-end gap-x-2'>
											{isBearish ? <FaChevronDown size={10} /> : <FaChevronUp size={10} />}
											{coin.changes['24h'].changePresent}%
										</div>
									</TableCoumn>

									{width > 1024 && (
										<TableCoumn width={TableConfig[4]}>
											<Link
												to={`/otc?coin=${coin.id}`}
												className='rounded-lg border-2 border-borderPrimary px-4 py-1'
											>
												<Text tid='trade' />
											</Link>
										</TableCoumn>
									)}
								</div>
							)
						})
						: null}
				</div>
			</div>
			{coinList?.length === 0 && (
				<div className='flex justify-center my-10'>
					<img alt=' ' src={require('../../assets/images/noData.png')} />
				</div>
			)}
		</div>
	)
}

const TABLE_HEADERS = [
	{ label: 'coin-name', width: '20%' },
	{ label: 'last-price', width: '22%' },
	{ label: 'volume', width: '22%' },
	{ label: 'daily-change', width: '16%' },
	{ label: 'operation', width: '16%' },
]

const TABLE_HEADERS_MOBILE = [
	{ label: 'coin-name', width: '35%' },
	{ label: 'last-price', width: '40%' },
	{ label: 'daily-change', width: '25%' },
]

const TableCoumn = styled.div`
	width: ${(props) => props.width};
`
