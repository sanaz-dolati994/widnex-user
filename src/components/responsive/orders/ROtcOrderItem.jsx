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
import { Flex, FlexCenter } from '../../../styles/CommonStyles'
import { SOCKET_URL } from '../../../core/constants/urls'
import { TextWithMargin } from '../../../styles/OrdersStyle'
import Text from '../../../core/utils/Text'
import { DetailsIcon, TransactionStatus, TransactionType } from '../../../styles/TransactionHistoryStyles'
import { _formatDate } from '../../../core/utils/dates'
import { _formatNumber } from '../../../core/utils/numbers'
import { useMainContext } from '../../../core/contexts/main'
import { formatDate } from '../../../core/utils/common'

const ROtcOrderItem = ({ setDetailsModal, data: item = {} }) => {
	const {
		main: { lang },
	} = useMainContext()

	const {
		// pair,
		// price,
		// priceUnit,
		// amount,
		orderId,
		value,
		_id,
		createdAt,

		amount,
		pair,
		price,
		priceUnit,
		coin,
		firstMeet,
		ip,
		isDelete,
		isFloat,
		lowerBound,
		margin,
		minAmount,
		modifiedAt,
		oco,
		status,
		submit,
		tradedAmount,
		tradedPrice,
		type,
		upperBound,
		userId,
	} = item

	return (
		<RRow className={'w-full m-auto px-5'}>
			<Flex align={'center'} className={'gap-3 w-full justify-evenly'}>

				<RFlex style={{ alignItems: 'center', width: '40%' }}>
					<Flex align={'center'} justify={'center'} flexDirection={'col'}>
						<div>
							<Flex dir={'ltr'}>
								<img
									src={SOCKET_URL + `assets/icon/${coin}.png`}
									alt=' '
									style={{ width: 20, height: 20, maxWidth: 'none', maxHeight: 'none' }}
								/>
								{!!pair && (
									<img
										className={'-ml-2.5'}
										src={SOCKET_URL + `assets/icon/${pair}.png`}
										alt={pair}
										style={{ width: 20, height: 20, maxWidth: 'none', maxHeight: 'none' }}
									/>
								)}
							</Flex>
						</div>
						{!!pair ? (
							<small className={'mt-1'}>{`${coin}/${pair}`.toUpperCase()}</small>
						) : (
							<small className={'mt-1'}>{coin.toUpperCase()}</small>
						)}
					</Flex>
				</RFlex>
				<RCFlexEnd >
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
					<TransactionType className={'text-xs'} status={type}>
						<Text tid={type} />
					</TransactionType>
					<RFlexBetween>
						<RText className={'text-left'} fontSize='0.55rem'>
							{`${formatDate(createdAt, 'time', lang === 'en' ? 'en-US' : 'fa-IR')}`}
							{`${formatDate(createdAt, 'time', lang === 'en' ? 'en-US' : 'fa-IR')}`}
						</RText>
					</RFlexBetween>
				</Flex>
				<FlexCenter className='mr-2' onClick={() => { setDetailsModal({ open: true, item }) }}>
					<DetailsIcon size={22} />
				</FlexCenter>
			</Flex>
		</RRow>
	)
}

export default ROtcOrderItem
