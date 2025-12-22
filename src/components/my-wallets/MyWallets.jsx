import React, { useEffect, useState } from 'react'
import CardLayout from '../layouts/CardLayout'
import { ChartWrapper, VisibilityToggleContainer } from '../../styles/WalletStyle'
import { FaArrowCircleRight, FaArrowCircleLeft } from 'react-icons/fa'
import { BiShow, BiHide } from 'react-icons/bi'
import {
	TableWrapper,
	Table,
	HeaderRow,
	Row,
	HeaderColumn,
	Column,
	NoDataWrapper,
} from '../../styles/TableStyle'
import useBalanceViewState, { HIDDEN_CONST } from '../../core/hooks/useBalanceViewState'
import { useProfileQuery } from '../../core/services/react-query/useProfileQuery'
import { useMarketQuery } from '../../core/services/react-query/useMarketQuery'
import { useMainContext } from '../../core/contexts/main'
import { formatNumber } from '../../core/utils/common'
import Text from '../../core/utils/Text'
import WalletChart from './WalletChart'
import { Flex } from '../../styles/CommonStyles'
import { useWindowSize } from '../../core/hooks/useWindowSize'
import { TABLET_SIZE } from '../../core/constants/common'
import { useNavigate } from 'react-router-dom'
import { SOCKET_URL } from '../../core/constants/urls'
import { CoinName } from '../../styles/UserBalanceStyles'

const MyWallets = ({ width = '100%', hasIcon = true, showIcon = true } = {}) => {
	const navigate = useNavigate()

	const {
		main: { lang },
	} = useMainContext()
	const { width: Width } = useWindowSize()

	const { data: profile } = useProfileQuery()
	const { data: market } = useMarketQuery()

	const [chartData, setChartData] = useState([])

	const [viewHidden, setAndPersistViewHidden] = useBalanceViewState()

	useEffect(() => {
		const temp = []

		profile?.coins?.forEach((coin) => {
			const marketItem = market?.find((m) => m.id?.toLowerCase() === coin?.coin?.toLowerCase())
			if (marketItem) {
				temp.push({
					name: marketItem.coin?.toUpperCase(),
					value: coin.amount * marketItem.buy,
				})
			}
		})

		setChartData(temp)
	}, [profile, market])

	const calculatePc = (idx) => {
		let total = 0
		chartData?.forEach((item) => (total += item.value))
		const res = (chartData[idx]?.value / total) * 100
		return res ? res : 0
	}

	const WalletTable = () => {
		return (
			<div style={{ width: '100%' }}>
				<TableWrapper height='180px'>
					<Table width='100%'>
						<HeaderRow width='100%'>
							{headers.map((item) => (
								<HeaderColumn width='25%'>
									<Text tid={item} />
								</HeaderColumn>
							))}
						</HeaderRow>
						{profile?.coins?.slice(0, Math.max(profile?.coins?.length, 3)).map((item, index) => {
							return (
								<Row>
									<Column width='25%'>
										<Flex className={'px-2'} align={'center'} justify={'start'}>
											{!!showIcon && (
												<img
													width='28px'
													height='28px'
													src={
														item.coin === 'tomanBalance'
															? require('../../assets/images/tooman.png')
															: SOCKET_URL + `assets/icon/${item.coin}.png`
													}
													alt=' '
												/>
											)}
											<CoinName>
												<Text tid={item.coin.toUpperCase()} />
											</CoinName>
										</Flex>
									</Column>
									<Column width='25%' bold={viewHidden} number>
										{viewHidden ? HIDDEN_CONST : formatNumber(item.amount, 2)}
									</Column>
									<Column width='25%' bold={viewHidden} number>
										{viewHidden ? HIDDEN_CONST : formatNumber(item.amountBlocked, 2)}
									</Column>
									<Column width='25%' bold={viewHidden} number>
										{viewHidden
											? HIDDEN_CONST
											: chartData.length
											? `${formatNumber(calculatePc(index).toFixed(2))}%`
											: '0%'}
									</Column>
								</Row>
							)
						})}
					</Table>
				</TableWrapper>
			</div>
		)
	}

	const onMoreClicked = () => {
		navigate('/wallets')
	}

	return (
		<CardLayout
			width={width}
			minHeight='400px'
			title='Wallets'
			icon={
				hasIcon &&
				(lang === 'en' ? (
					<FaArrowCircleRight
						onClick={onMoreClicked}
						style={{ cursor: 'pointer' }}
						size={24}
						color='#4f31c5'
					/>
				) : (
					<FaArrowCircleLeft
						onClick={onMoreClicked}
						style={{ cursor: 'pointer' }}
						size={24}
						color='#4f31c5'
					/>
				))
			}
		>
			{!!profile?.coins?.length ? (
				<>
					<>
						<VisibilityToggleContainer>
							{viewHidden ? (
								<BiHide
									onClick={setAndPersistViewHidden}
									color='#c3c5b7'
									size='22px'
									cursor='pointer'
								/>
							) : (
								<BiShow
									onClick={setAndPersistViewHidden}
									color='#c3c5b7'
									size='22px'
									cursor='pointer'
								/>
							)}
						</VisibilityToggleContainer>

						{Width > TABLET_SIZE ? (
							<Flex className={'flex-col'}>
								<ChartWrapper>
									<WalletChart data={chartData} />
								</ChartWrapper>
								<WalletTable />
							</Flex>
						) : (
							<Flex items={'center'} justify={'center'} flexDirection={'col'}>
								<WalletTable />

								<ChartWrapper>
									<WalletChart data={chartData} />
								</ChartWrapper>
							</Flex>
						)}
					</>
				</>
			) : (
				<>
					<NoDataWrapper top='150px'>
						<img alt=' ' src={require('../../assets/images/noData.png')} />
					</NoDataWrapper>
				</>
			)}
		</CardLayout>
	)
}

const headers = ['coin', 'available', 'blockedAmount', 'assetsPercentage']

export default MyWallets
