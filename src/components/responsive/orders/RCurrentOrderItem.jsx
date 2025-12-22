import React from 'react'
import CardLayout from '../../layouts/CardLayout'
import {
	RCFlex,
	RCFlexEnd,
	RFlex,
	RFlexBetween,
	RRow,
	RText,
} from '../../../styles/responsive/Common'
import { Flex } from '../../../styles/CommonStyles'
import { SOCKET_URL } from '../../../core/constants/urls'
import { DeleteIcon, TextWithMargin } from '../../../styles/OrdersStyle'
import Text from '../../../core/utils/Text'
import { TransactionStatus, TransactionType } from '../../../styles/TransactionHistoryStyles'
import { _formatDate } from '../../../core/utils/dates'
import { _formatNumber } from '../../../core/utils/numbers'
import { useMainContext } from '../../../core/contexts/main'

const RCurrentOrderItem = ({ data: item = {}, setDeleteModal }) => {
	const {
		main: { lang },
	} = useMainContext()

	const {
		_id,
		createdAt,
		amount,
		pair,
		price,
		priceUnit,
		coin,
		submit,
		type,
	} = item


	return (
		<RRow className={'w-full m-auto px-5'}>
			<Flex align={'center'} className={'gap-3 w-full'}>
				<RFlex style={{ alignItems: 'center' }}>
					<Flex align={'center'} justify={'center'} flexDirection={'col'}>
						<div>
							<Flex dir={'ltr'}>

								<img
									src={SOCKET_URL + `assets/icon/${coin}.png`}
									alt=' '
									style={{ width: 20, height: 20, maxWidth: 'none', maxHeight: 'none' }}
								/>
								{!!pair && (
									pair === 'irt' ?
										<img
											src={require('../../../assets/images/tooman.png')}
											alt=' '
											style={{ width: 20, height: 20, maxWidth: 'none', maxHeight: 'none' }}
										/>
										:
										<img
											className={'-ml-2.5'}
											src={SOCKET_URL + `assets/icon/${pair}.png`}
											alt={pair}
											style={{ width: 20, height: 20, maxWidth: 'none', maxHeight: 'none' }}
										/>
								)}
							</Flex>
						</div>
						<div>
							{!!pair ? (
								<small className={'block text-center w-full mt-1'}>
									{`${coin}/${pair}`.toUpperCase()}
								</small>
							) : (
								<small className={'block text-center w-full mt-1'}>{coin.toUpperCase()}</small>
							)}

							<TransactionType className={'text-xs'} status={type}>
								<small className={'block text-center w-full'}>
									{type}/{submit}
								</small>
							</TransactionType>
						</div>
					</Flex>
				</RFlex>
				<RCFlexEnd>
					<RFlexBetween>
						<RText className={'pl-2 '} fontSize='0.55rem'>
							<Text tid='amount' />:
						</RText>
						<TextWithMargin className={'m-0 text-xs text-left'} type={item.flow}>
							{_formatNumber(amount)}
						</TextWithMargin>
					</RFlexBetween>
					<RFlexBetween>
						<RText className={'pl-2'} fontSize='0.55rem'>
							<Text tid='unitPrice' />:
						</RText>
						<RText className={'text-left'} fontSize='0.55rem'>
							{_formatNumber(priceUnit)}
						</RText>
					</RFlexBetween>
					<RFlexBetween>
						<RText className={'pl-2'} fontSize='0.55rem'>
							<Text tid='totalPrice' />:
						</RText>
						<RText className={'text-left'} fontSize='0.55rem'>
							{_formatNumber(price)}
						</RText>
					</RFlexBetween>
				</RCFlexEnd>
				<Flex flexDirection={'col'} align={'end'} justify={'center'}>
					<DeleteIcon className={'mb-2'} onClick={() => setDeleteModal({ id: _id, open: true })} />
					<RFlexBetween>
						<RText className={'text-left'} fontSize='0.55rem'>
							{_formatDate(createdAt, { lang })}
						</RText>
					</RFlexBetween>
				</Flex>
			</Flex>
		</RRow>
	)
}

export default RCurrentOrderItem
