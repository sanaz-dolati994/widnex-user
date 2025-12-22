import CardLayout from '../layouts/CardLayout'
import { Flex, FlexCenter, FlexStart } from '../../styles/CommonStyles'
import SearchBox from '../SearchBox'
import {
	BtnText,
	BalanceBtn,
	BalanceRow,
	BalanceTable,
	BalanceWrapper,
	HeaderRow,
	HeaderCol,
	SearchWrapper,
	BalanceCol,
	CoinName,
	HeaderWrapper,
} from '../../styles/UserBalanceStyles'
import Text from '../../core/utils/Text'
import { formatNumber } from '../../core/utils/common'
import { SOCKET_URL } from '../../core/constants/urls'
import useUserBalance, { getButtons } from '../../core/hooks/useUserBalance'
import { useMainContext } from '../../core/contexts/main'
import { NoDataWrapper, TD, TH } from '../../styles/TableStyle'
import { Fragment } from 'react'
import { Button } from '../../styles/SecurityStyles'
import { _formatNumber } from '../../core/utils/numbers'

const UserBalance = () => {
	const {
		main: { theme },
	} = useMainContext()

	const {
		onInputValueChange,
		onCloseSearchClicked,
		searchValue,
		balanceList,
		onBalanceOperationsClicked,
	} = useUserBalance()

	return (
		<CardLayout width='100%' minHeight='400px' className={'pt-5 px-5'}>
			<SearchWrapper>
				<SearchBox
					width='50%'
					bgColor={theme === 'dark' ? '#3f4243' : '#B7B8B9'}
					onInputValueChange={onInputValueChange}
					onCloseSearchClicked={onCloseSearchClicked}
					searchValue={searchValue}
				/>
			</SearchWrapper>
			<div className={'overflow-x-auto mt-5'}>
				{!balanceList?.length ? (
					<NoDataWrapper top='150px'>
						<img alt=' ' src={require('../../assets/images/noData.png')} />
					</NoDataWrapper>
				) : (
					<table className={'table table-auto w-full'}>
						<thead>
							<tr className={'border-b-[0.5px] border-[#44464c]'}>
								{headers.map((item, index) => (
									<TH className={'p-0 text-center'} key={index}>
										<HeaderCol header={true} idx={index}>
											<Text tid={item} />
										</HeaderCol>
									</TH>
								))}
								<th />
							</tr>
						</thead>
						<tbody>
							{balanceList?.map((coin, idx) => {
								const isLast = idx === balanceList.length - 1

								return (
									<tr className={`${isLast ? '' : 'border-b-[0.5px] border-[#44464c]'}`}>
										<TD className={''}>
											<Flex align={'center'} justify={'start'}>
												<img
													width='28px'
													height='28px'
													src={
														coin.name === 'tomanBalance'
															? require('../../assets/images/tooman.png')
															: SOCKET_URL + `assets/icon/${coin.name}.png`
													}
													alt=' '
												/>
												<CoinName>
													<Text tid={coin.name} />
												</CoinName>{' '}
											</Flex>
										</TD>
										<TD className={''}>{formatNumber(coin.all)}</TD>
										<TD className={''}>{formatNumber(coin.available)}</TD>
										<TD className={''}>{formatNumber(coin.blocked)}</TD>
										<TD className={''}>{coin.tether ? formatNumber(coin.tether) : ' '}</TD>
										<TD className={''}>
											<Flex className={'flex-nowrap'}>
												{getButtons('16px').map((btn) => {
													return (
														<BalanceBtn
															key={btn.name}
															onClick={() =>
																onBalanceOperationsClicked(
																	btn.name,
																	coin.name,
																	coin.name === 'tomanBalance' && btn.name === 'trade'
																)
															}
															disabled={coin.name === 'tomanBalance' && btn.name === 'trade'}
														>
															{btn.icon}
															<BtnText>
																<Text tid={btn.name} />
															</BtnText>
														</BalanceBtn>
													)
												})}
											</Flex>
										</TD>
									</tr>
								)
							})}
						</tbody>
					</table>
				)}
			</div>
		</CardLayout>
	)
}

const headers = ['coin', 'balance', 'available', 'blockedBalance', 'tetherBalance', 'operations']

export default UserBalance
