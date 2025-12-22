import SearchBox from '../../SearchBox'
import { SOCKET_URL } from '../../../core/constants/urls'
import { useMainContext } from '../../../core/contexts/main'
import useUserBalance, { getButtons } from '../../../core/hooks/useUserBalance'
import CardLayout from '../../layouts/CardLayout'
import {
	RCFlex,
	RFlex,
	RCFlexEnd,
	RFlexBetween,
	RRow,
	RText,
	ScrollWrap,
} from '../../../styles/responsive/Common'
import { SearchWrapper } from '../../../styles/UserBalanceStyles'
import { formatNumber } from '../../../core/utils/common'
import Text from '../../../core/utils/Text'
import { _formatNumber } from '../../../core/utils/numbers'
import { Flex } from '../../../styles/CommonStyles'
import { useState } from 'react'

const RUserBalance = ({ setShowModal, setActiveItem }) => {
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
		<>
			<CardLayout width='100%' className={'pt-5 px-5'}>
				<SearchWrapper>
					<SearchBox
						width='90%'
						bgColor={theme === 'dark' ? '#3f4243' : '#B7B8B9'}
						onInputValueChange={onInputValueChange}
						onCloseSearchClicked={onCloseSearchClicked}
						searchValue={searchValue}
					/>
				</SearchWrapper>
				<ScrollWrap style={{ marginTop: '10px' }}>
					{balanceList.map((coin, index) => (
						<RRow
							key={index}
							onClick={(e) => {
								if (coin.name !== 'tomanBalance') {
									setShowModal(true)
									setActiveItem(coin)
								}
							}}
						>
							<Flex align={'end'} className={'w-[100%]'}>
								<RFlex style={{ alignItems: 'center', margin: '0 8px' }} width='50%'>
									<img
										width='20px'
										src={
											coin.name === 'tomanBalance'
												? require('../../../assets/images/tooman.png')
												: SOCKET_URL + `assets/icon/${coin.name}.png`
										}
										alt=' '
										style={{ margin: '0 8px' }}
									/>
									<RCFlex>
										<RFlexBetween>
											{coin.name !== 'tomanBalance' ? (
												<RText fontSize='0.9rem'>{coin.name.toUpperCase()}</RText>
											) : (
												<RText fontSize='0.7rem'>
													<Text tid={coin.name} />
												</RText>
											)}
										</RFlexBetween>
									</RCFlex>
								</RFlex>
								<RCFlexEnd width='50%' style={{ margin: '0 8px' }}>
									<RFlexBetween>
										<RText fontSize='0.55rem'>
											<Text tid='available' />:
										</RText>
										<RText fontSize='0.55rem'>
											{_formatNumber(coin.available, { shorten: true })}
										</RText>
									</RFlexBetween>
									<RFlexBetween>
										<RText fontSize='0.55rem'>
											<Text tid='tetherBalance' />:
										</RText>
										<RText fontSize='0.55rem'>
											{_formatNumber(coin.tether, { shorten: true })}
										</RText>
									</RFlexBetween>
								</RCFlexEnd>
							</Flex>

							{false && (
								<RCFlex className={'gap-1.5'} width='18%' style={{ margin: '0 4px' }}>
									{getButtons('10px').map((btn) => (
										<RFlex
											onClick={() =>
												onBalanceOperationsClicked(
													btn.name,
													coin.name,
													coin.name === 'tomanBalance' && btn.name === 'trade'
												)
											}
											style={{ alignItems: 'center' }}
										>
											{btn.icon}
											<RText fontSize='0.7rem' style={{ margin: '0 5px' }}>
												<Text tid={btn.name.split('-')[0]} />
											</RText>
										</RFlex>
									))}
								</RCFlex>
							)}
						</RRow>
					))}
				</ScrollWrap>
			</CardLayout>
		</>
	)
}

export default RUserBalance
