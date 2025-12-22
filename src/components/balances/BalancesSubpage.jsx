import styled from 'styled-components'
import Text from '../../core/utils/Text'
import Card from '../common/Card'
import WalletOverview from '../dashboard/WalletOverview'
import { FaChevronDown, FaChevronUp, FaExchangeAlt } from 'react-icons/fa'
import { formatNumber } from '../../core/utils/common'
import { SOCKET_URL } from '../../core/constants/urls'
import { useWindowSize } from '../../core/hooks/useWindowSize'
import { useWalletRealTimeData } from '../newWallet/useWalletData'
import { useWalletContext } from '../../core/contexts/wallet'
import { useNavigate } from 'react-router-dom'
import BalanceOverview from './BalanceOverview'
import { TradeIcon } from '../common/icons'

export default function BalancesSubpage() {
	const navigate = useNavigate()

	const { myBalance } = useWalletRealTimeData()
	const { setWallet, setCoin } = useWalletContext()

	const onAction = (action) => {
		if (action.op === 'trade') {
			navigate(`/otc?coin=${action.coin}`)
			document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' })
			return
		}
		setWallet({
			op: action.op,
			type: action.coin === 'irt' ? 'tooman' : 'coin',
		})
		if (action.coin !== 'irt') {
			setCoin(action.coin)

			if (action.op === 'withdraw') {
				navigate('/wallets/withdrawCoin')
			} else if (action.op === 'deposit') {
				navigate('/wallets/depositCoin')
			}
		} else {
			if (action.op === 'withdraw') {
				navigate('/wallets/withdrawFiat')
			} else if (action.op === 'deposit') {
				navigate('/wallets/depositFiat')
			}
		}
	}

	const actionBtns = [{ title: 'trade', Icon: <FaExchangeAlt color='#0773F1' size={18} /> }]

	return (
		<>
			<Card
				className='lg:col-span-2 mb-4 lg:mb-0 lg:col-start-2 lg:row-span-2 lg:col-end-4 '
				padding='px-0 py-4 lg:py-0'
			>
				<WalletOverview className='w-[90%] mx-auto lg:w-auto' fullHeight />
			</Card>
			<Card
				className='overflow-y-auto lg:col-span-2 mb-4 lg:mb-0 lg:row-span-2 lg:col-start-4 lg:col-end-6'
				padding={'px-4 py-5'}
			>
				<BalanceOverview />
			</Card>
			<Card className={'col-span-1 lg:col-span-4 lg:col-start-2 lg:row-span-3 lg:row-start-3 lg:overflow-hidden'}>
				<Table
					mainTab={'profit&Lost'}
					coinData={myBalance.coins}
					onAction={onAction}
					actionBtns={actionBtns}
				/>
			</Card>
		</>
	)
}

const Table = ({ mainTab, coinData, onAction, actionBtns }) => {
	const { width } = useWindowSize()
	const isMobile = width < 1024
	const TableConfig = isMobile ? smallScreenTable : attributes['profit&Lost']
	const { cs, headers } = TableConfig
	const sortedCoins = coinData.sort((a, b) => b.value - a.value)
	return (
		<div className={'h-full'}>
			<Grid cs={cs} className='border-b border-primary dark:border-card-border lg:h-1/5'>
				{headers.map((item) => {
					return (
						<div
							className={
								item === '24h-change-pc'
									? 'flex text-right'
									: item === 'total' && isMobile
										? 'text-center'
										: ''
							}
							key={item}
						>
							<Text tid={item} className={'text-sm'} />
						</div>
					)
				})}
			</Grid>
			{sortedCoins.length > 0 ? (
				<div className='lg:overflow-y-scroll lg:h-4/5 lg:pb-2'>
					{sortedCoins.map((item, index, array) => {
						return (
							<div className={'dark:text-white text-black'}>
								<Grid cs={cs} key={item.id}>
									<div className={`flex items-center gap-1 `}>
										<img
											src={
												item.id === 'irt'
													? require('../../assets/images/tooman.png')
													: SOCKET_URL + `assets/icon/${item.id}.png`
											}
											alt=' '
											width='24px'
											height='24px'
										/>
										<div className={'flex flex-col gap-1'}>
											<span className={'text-sm'}>{item.fa || item.id}</span>
											<span className={'text-xs text-secondary'}>{item.id.toUpperCase()}</span>
										</div>
									</div>
									<span className={`break-all text-sm ${isMobile ? 'text-center' : ''}`}>
										{formatNumber(item.amount, {
											type: item.id,
										})}
									</span>
									<span className={`break-all text-sm ${isMobile ? 'hidden' : ''}`}>
										{formatNumber(item.blocked, {
											type: item.id,
										})}
									</span>
									<span className={`break-all text-sm ${isMobile ? 'hidden' : ''}`}>
										{formatNumber(item.available, {
											type: item.id,
										})}
									</span>
									<span className={`break-all text-sm `}>
										{formatNumber(item.value, {
											type: 'irt',
										})}
									</span>
									<span
										className={`flex items-center gap-x-2 text-sm justify-end ${item.ch24 > 0 && 'text-green-700'
											} ${item.ch24 < 0 && 'text-red-500'} ${isMobile ? 'hidden' : ''}`}
										dir={'ltr'}
									>
										{item.ch24 < 0 ? (
											<FaChevronDown size={10} />
										) : item.ch24 > 0 ? (
											<FaChevronUp size={10} />
										) : null}
										{item.ch24 || 0} %
									</span>
									<div className={`flex justify-center items-center gap-1 flex-wrap`}>
										{actionBtns.map((btn) => {
											const { title } = btn
											const deactive = title === 'trade' && item.id === 'irt'
											return (
												<div
													className={`rounded-lg text-heading dark:text-pColor border-2 border-borderPrimary  py-1 text-sm ${deactive ? 'cursor-not-allowed' : 'cursor-pointer'
														} ${deactive && 'opacity-40'} ${isMobile ? 'p-0 !border-none' : 'px-4'} flex justify-center items-center gap-1`}
													onClick={() => {
														if (deactive) return
														onAction({
															op: title,
															coin: item.id,
														})
													}}
												>
													{
														isMobile ?
															<TradeIcon color={'#3369cc'} /> :
															<Text tid={title} />
													}
												</div>
											)
										})}
									</div>
								</Grid>
								<div
									className={`${index === array.length - 1 && 'hidden'
										} w-full h-[1px] bg-gray-500 dark:bg-gray-700 opacity-20`}
								/>
							</div>
						)
					})}
				</div>
			) : (
				<div className={'flex justify-center items-center w-full h-full min-h-[240px]'}>
					<img
						src={require('../../assets/images/noData.png')}
						className='w-20 h-auto'
						alt={'no-data'}
					/>
				</div>
			)}
		</div>
	)
}
const attributes = {
	realTime: {
		cs: '15% 15% 15% 15% 15% 25%',
		headers: ['name', 'total', 'blocked', 'available', 'prob-value'],
	},
	'profit&Lost': {
		cs: '15% 15% 15% 15% 15% 15% 10%',
		headers: ['coin-name', 'total', 'blocked', 'available', 'prob-value', '24h-change-pc'],
	},
}

const smallScreenTable = {
	cs: '28% 29% 33% 10%',
	headers: ['coin-name', 'total', 'prob-value'],
}

const Grid = styled.div`
	display: grid;
	grid-template-columns: ${(props) => props.cs};
	width: 100%;
	align-items: center;
	margin: 8px 0;
	& > * {
		padding: ${(props) => (props.theme.english ? '0 5px 0 0' : '0 0 0 5px')};
	}
`
