import MainLayout from '../../components/layouts/MainLayout'
import styled from 'styled-components'
import Text from '../../core/utils/Text'
import { useMemo, useState } from 'react'
import { useWalletPLData, useWalletRealTimeData } from '../../components/newWallet/useWalletData'
import { formatNumber } from '../../core/utils/common'
import { useWalletContext } from '../../core/contexts/wallet'
import { Link, useNavigate } from 'react-router-dom'
import { HOME, SOCKET_URL } from '../../core/constants/urls'
import { FaArrowAltCircleDown, FaArrowAltCircleUp, FaExchangeAlt, FaWallet } from 'react-icons/fa'
import { GiProfit } from 'react-icons/gi'
import WalletPieChart from '../../components/charts/WalletPieChart'
import WalletAreaChart from '../../components/charts/WalletAreaChart'
import { TABLET_SIZE } from '../../core/constants/common'
import { useWindowSize } from '../../core/hooks/useWindowSize'
import ModalLayout from '../../components/layouts/ModalLayout'

import { ReactComponent as FiatAsset } from './assets/withdraw.svg'
import { ReactComponent as CoinAsset } from './assets/deposit.svg'
import WithdrawFiatComp from './withdraw/fiat/WithdrawFiatComp'

const NewUserWallet = () => {
	const { width } = useWindowSize()
	const mainTabs = [
		{ title: 'realTime', Icon: FaWallet },
		{ title: 'profit&Lost', Icon: GiProfit },
	]
	const [mainTab, setMainTab] = useState('realTime')

	const currencyTabs = ['tooman', 'usdt']
	const [currencyTab, setCurrencyTab] = useState('tooman')

	const { setWallet, setCoin } = useWalletContext()
	const { userBalance, userChange, coinChange, areaChartData } = useWalletPLData()

	const { myBalance } = useWalletRealTimeData()

	const navigate = useNavigate()
	const onAction = (action) => {
		if (action.op === 'trade') {
			window.location.href = HOME + `trade/${action.coin?.toUpperCase()}_IRT`
			return
		}
		setWallet({ op: action.op, type: action.coin === 'irt' ? 'tooman' : 'coin' })
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

	const type = currencyTab === 'tooman' ? 'irt' : 'usdt'

	const balanceData = useMemo(() => {
		if (mainTab === 'realTime') return myBalance
		else return userBalance
	}, [userBalance, myBalance, mainTab])

	const coinData = useMemo(() => {
		if (mainTab === 'realTime') return myBalance.coins
		else return coinChange
	}, [coinChange, myBalance, mainTab])

	const actionBtns = [
		{ title: 'deposit', Icon: <FaArrowAltCircleUp color='#1ce087' size={18} /> },
		{ title: 'withdraw', Icon: <FaArrowAltCircleDown color='#ce1440' size={18} /> },
		{ title: 'trade', Icon: <FaExchangeAlt color='#4f31c5' size={18} /> },
	]

	const MainTable = width > TABLET_SIZE ? Desktop : Mobile

	const initialChooseModal = { type: null, open: false }
	const [chooseModal, setChooseModal] = useState(initialChooseModal)
	const openModal = (type) => setChooseModal({ type, open: true })
	const closeModal = () => setChooseModal(initialChooseModal)

	return (
		<MainLayout>
			{/* Main Tab */}
			<div className={'w-full flex items-center justify-center my-3'}>
				<div
					className={
						'rounded-md border-[1px] dark:border-gray-300 border-gray-800 w-min flex items-center justify-center'
					}
				>
					{mainTabs.map((item) => {
						const { Icon, title } = item
						const active = title === mainTab
						return (
							<div
								className={`min-w-[144px] flex items-center justify-center rounded-md transition
                                ${active
										? 'dark:bg-gray-100 bg-gray-800 dark:text-black text-white shadow-md'
										: ''
									} 
                                min-h-[38px] cursor-pointer gap-2 text-sm`}
								onClick={() => setMainTab(title)}
							>
								<Icon size={20} />
								<Text tid={title} />
							</div>
						)
					})}
				</div>
			</div>

			{/* first row */}
			<div
				className={
					'lg:grid lg:grid-cols-6 flex flex-col gap-4 items-stretch max-w-[1200px] mx-auto text-black dark:text-white'
				}
			>
				<div className={'col-span-2 '}>
					<Card>
						<div className={'flex flex-col justify-between h-full py-6 lg:py-10'}>
							<div>
								<div className={'flex justify-between items-center'}>
									<div className={'flex items-center gap-2'}>
										<Text tid={'prob-value'} className={'text-xs lg:text-sm text-secondary'} />
									</div>
									<div className={'flex items-center dark:bg-slate-800 bg-gray-300 rounded-md'}>
										{currencyTabs.map((tab) => {
											const active = currencyTab === tab
											return (
												<div
													className={`px-4 py-[2px] rounded ${active && 'bg-gray-100 dark:bg-primaryBg'
														} cursor-pointer shadow`}
													onClick={() => setCurrencyTab(tab)}
												>
													<Text tid={tab} className={'text-xs'} />
												</div>
											)
										})}
									</div>
								</div>
								<div className={'mt-8 flex items-center justify-between'}>
									<Text tid={'wallet'} className={'text-sm text-secondary'} />
									<div className={'flex items-center gap-1'} dir={'ltr'}>
										<span className={'text-lg lg:text-xl'}>
											{formatNumber(balanceData[currencyTab], { type })}
										</span>
										<span className={'text-xs text-secondary'}>
											{currencyTab === 'tooman' ? 'IRT' : 'USDT'}
										</span>
									</div>
								</div>
								{mainTab === 'profit&Lost' ? (
									<>
										<div className={'mt-2 flex items-center justify-between'}>
											<Text tid={'24h-change'} className={'text-sm text-secondary'} />
											<div
												className={`flex items-center gap-1 ${userChange[currencyTab] > 0 && 'text-green-700'
													} ${userChange[currencyTab] < 0 && 'text-red-600'}`}
												dir={'ltr'}
											>
												<span>{formatNumber(userChange[currencyTab], { type })}</span>
												<span className={'text-xs text-secondary'}>
													{currencyTab === 'tooman' ? 'IRT' : 'USDT'}
												</span>
											</div>
										</div>
										<div className={'mt-1 flex items-center justify-between'}>
											<Text tid={'24h-change-pc'} className={'text-sm text-secondary'} />
											<div
												className={`flex items-center gap-1 ${userChange.pc > 0 && 'text-green-700'
													} ${userChange.pc < 0 && 'text-red-600'}`}
												dir={'ltr'}
											>
												<span>{userChange.pc} %</span>
											</div>
										</div>
									</>
								) : null}
							</div>
							<div className={'mt-8 flex items-center justify-center mx-auto gap-5'}>
								<div
									className={
										'min-w-[100px] flex items-center justify-center py-2 rounded-md bg-active shadow text-sm cursor-pointer text-white'
									}
									onClick={() => openModal('deposit')}
								>
									<Text tid={'deposit'} />
								</div>
								<div
									className={
										'min-w-[100px] flex items-center justify-center py-2 rounded-md shadow text-sm cursor-pointer dark:bg-gray-800 bg-gray-200'
									}
									onClick={() => openModal('withdraw')}
								>
									<Text tid={'withdraw'} />
								</div>
							</div>
						</div>
					</Card>
				</div>

				{/* chart */}
				<div className={'col-span-4 h-full'}>
					<Card>
						{mainTab === 'realTime' ? (
							<WalletPieChart data={myBalance.coins} />
						) : (
							<div
								className={'flex justify-between items-center w-full h-full relative'}
								dir={'ltr'}
							>
								<div
									className={
										'absolute top-0 left-0 w-full flex justify-between items-center z-[100] text-sm'
									}
								>
									<Link to={'/wallet-charts'}>
										<div
											className={'underline cursor-pointer text-[0.65rem] lg:text-xs text-blue-300'}
										>
											<Text tid={'see-all-charts'} />
										</div>
									</Link>
									<Text tid={'wallet-area-chart'} className={'lg:text-base text-xs'} />
								</div>
								<WalletAreaChart data={areaChartData} />
							</div>
						)}
					</Card>
				</div>
			</div>

			{/* second row */}
			<div className={'w-full max-w-[1200px] mx-auto mt-4'}>
				<Card>
					<div className={'flex justify-between items-center'}>
						<Text tid={'your-balance'} />
					</div>
					<MainTable
						mainTab={mainTab}
						coinData={coinData}
						onAction={onAction}
						actionBtns={actionBtns}
					/>
				</Card>
			</div>

			<ModalLayout width={'480px'} onClose={closeModal} open={chooseModal.open}>
				<div className={'flex flex-col gap-4'}>
					<Link to={`/wallets/${chooseModal.type}Coin`}>
						<div
							className={
								'flex items-center gap-8 w-full hover:bg-slate-800 hover:text-white rounded-md px-3 cursor-pointer'
							}
						>
							<CoinAsset width={114} height={114} />
							<div className={'flex flex-col gap-2'}>
								<Text tid={`${chooseModal.type}-coin`} className={'lg:text-base text-sm'} />
								<Text tid={`${chooseModal.type}-coin-desc`} className={'text-xs'} />
							</div>
						</div>
					</Link>
					<div className={'w-full h-[1px] bg-gray-500 opacity-50'} />
					<Link to={`/wallets/${chooseModal.type}Fiat`}>
						<div
							className={
								'flex items-center gap-8 w-full hover:bg-slate-800 hover:text-white rounded-md px-3 cursor-pointer'
							}
						>
							<FiatAsset width={114} height={114} />
							<div className={'flex flex-col gap-2'}>
								<Text tid={`${chooseModal.type}-fiat`} className={'lg:text-base text-sm'} />
								<Text tid={`${chooseModal.type}-fiat-desc`} className={'text-xs'} />
							</div>
						</div>
					</Link>
				</div>
			</ModalLayout>
		</MainLayout>
	)
}

const Desktop = ({ mainTab, coinData, onAction, actionBtns }) => {
	return (
		<div className={'mt-2'}>
			<Grid cs={attributes[mainTab].cs}>
				{attributes[mainTab].headers.map((item) => {
					return (
						<div className={item.includes('24h-change') && 'flex justify-end'} key={item}>
							<Text tid={item} className={'text-xs'} />
						</div>
					)
				})}
			</Grid>
			{coinData.length > 0 ? (
				coinData.map((item) => {
					return (
						<div className={'dark:text-white text-black'}>
							<Grid cs={attributes[mainTab].cs} key={item.id}>
								<div className={'flex items-center gap-1'}>
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
								<span className={'break-all text-xs'}>
									{formatNumber(item.amount, { type: item.id })}
								</span>
								<span className={'break-all text-xs'}>
									{formatNumber(item.blocked, { type: item.id })}
								</span>
								<span className={'break-all text-xs'}>
									{formatNumber(item.available, { type: item.id })}
								</span>
								<span className={'break-all text-xs'}>
									{formatNumber(item.value, { type: 'irt' })}
								</span>
								{mainTab === 'profit&Lost' ? (
									<>
										<span
											className={`break-all text-xs ${item.change > 0 && 'text-green-700'} ${item.change < 0 && 'text-red-500'
												}`}
											dir={'ltr'}
										>
											{formatNumber(item.change, { type: item.id })}
										</span>
										<span
											className={`break-all text-xs ${item.change > 0 && 'text-green-700'} ${item.change < 0 && 'text-red-500'
												}`}
											dir={'ltr'}
										>
											{item.pc || 0} %
										</span>
									</>
								) : null}
								{mainTab === 'realTime' ? (
									<div className={'flex justify-center items-center gap-1 flex-wrap'}>
										{actionBtns.map((btn) => {
											const { title, Icon } = btn
											const deactive = title === 'trade' && item.id === 'irt'
											return (
												<div
													className={`text-xs rounded-md min-w-[82px] min-h-[36px] dark:bg-gray-800 bg-gray-300 hover:border-[1px] hover:border-active 
                                                                transition ${deactive
															? 'cursor-not-allowed'
															: 'cursor-pointer'
														} ${deactive && 'opacity-30'
														} flex justify-center items-center gap-1`}
													onClick={() => {
														if (deactive) return
														onAction({ op: title, coin: item.id })
													}}
												>
													{Icon}
													<Text tid={title} />
												</div>
											)
										})}
									</div>
								) : null}
							</Grid>
							<div className={'w-full h-[1px] bg-gray-500 dark:bg-gray-700 opacity-20'} />
						</div>
					)
				})
			) : (
				<div className={'flex justify-center items-center w-full h-full min-h-[240px]'}>
					<img src={require('../../assets/images/noData.png')} width={128} alt={'no-data'} />
				</div>
			)}
		</div>
	)
}

const Mobile = ({ coinData, onAction, mainTab, actionBtns }) => {
	return (
		<div className={'mt-2'}>
			{coinData.length > 0 ? (
				coinData.map((item) => {
					return (
						<div className={'dark:text-white text-black mt-4'}>
							<div className={''}>
								<div className={'flex flex-col gap-2'}>
									<div className={'flex items-center gap-1'}>
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
									<div className={'grid grid-cols-2 gap-2 w-full text-xs'}>
										<Text tid={'total'} />
										<span className={'break-all text-xs'} dir={'ltr'}>
											{formatNumber(item.amount, { type: item.id })}
										</span>
										<Text tid={'blocked'} />
										<span className={'break-all text-xs'} dir={'ltr'}>
											{formatNumber(item.blocked, { type: item.id })}
										</span>
										<Text tid={'available'} />
										<span className={'break-all text-xs'} dir={'ltr'}>
											{formatNumber(item.available, { type: item.id })}
										</span>
										<Text tid={'prob-value'} />
										<span className={'break-all text-xs'} dir={'ltr'}>
											{formatNumber(item.value, { type: 'irt' })}
										</span>
										{mainTab === 'profit&Lost' ? (
											<>
												<Text tid={'24h-change'} className={'text-xs'} />
												<span
													className={`break-all text-xs ${item.change > 0 && 'text-green-700'} ${item.change < 0 && 'text-red-500'
														}`}
													dir={'ltr'}
												>
													{formatNumber(item.change, { type: item.id })}
												</span>
												<Text tid={'24h-change-pc'} />
												<span
													className={`break-all text-xs ${item.change > 0 && 'text-green-700'} ${item.change < 0 && 'text-red-500'
														}`}
													dir={'ltr'}
												>
													{item.pc || 0} %
												</span>
											</>
										) : null}
									</div>

									{mainTab === 'realTime' ? (
										<div className={'flex justify-center items-center gap-1 flex-wrap'}>
											{actionBtns.map((btn) => {
												const { title, Icon } = btn
												const deactive = title === 'trade' && item.id === 'irt'
												return (
													<div
														className={`text-xs rounded-md min-w-[82px] min-h-[36px] dark:bg-gray-800 bg-gray-300 hover:border-[1px] hover:border-active 
                                                                transition ${deactive
																? 'cursor-not-allowed'
																: 'cursor-pointer'
															} ${deactive && 'opacity-30'
															} flex justify-center items-center gap-1`}
														onClick={() => {
															if (deactive) return
															onAction({ op: title, coin: item.id })
														}}
													>
														{Icon}
														<Text tid={title} />
													</div>
												)
											})}
										</div>
									) : null}
								</div>
							</div>
							<div className={'w-full h-[1px] bg-gray-500 dark:bg-gray-700 opacity-20 mt-2'} />
						</div>
					)
				})
			) : (
				<div className={'flex justify-center items-center w-full h-full min-h-[240px]'}>
					<img src={require('../../assets/images/noData.png')} width={128} alt={'no-data'} />
				</div>
			)}
		</div>
	)
}

const Card = styled.div`
	width: 100%;
	background: ${(props) => props.theme.secondaryBg};
	padding: 16px 24px;
	border-radius: 4px;
	box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
	height: 100%;
	min-height: 300px;

	@media screen and (max-width: 1050px) {
		min-height: 200px;
	} ;
`

const attributes = {
	realTime: {
		cs: '15% 15% 15% 15% 15% 25%',
		headers: ['name', 'total', 'blocked', 'available', 'prob-value'],
	},
	'profit&Lost': {
		cs: '15% 15% 15% 15% 15% 15% 10%',
		headers: ['name', 'total', 'blocked', 'available', 'prob-value', '24h-change', '24h-change-pc'],
	},
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

export default NewUserWallet
