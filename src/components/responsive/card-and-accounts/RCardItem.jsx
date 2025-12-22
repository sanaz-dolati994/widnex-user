import React from 'react'
import { TransactionStatus } from '../../../styles/TransactionHistoryStyles'
import { Column, Row } from '../../../styles/TableStyle'
import { Flex, FlexCenter } from '../../../styles/CommonStyles'
import { DeleteIcon, Market, TextWithMargin } from '../../../styles/OrdersStyle'
import Text from '../../../core/utils/Text'
import { SOCKET_URL } from '../../../core/constants/urls'
import { RCFlexEnd, RFlexBetween, RRow, RText } from '../../../styles/responsive/Common'
import { _formatDate } from '../../../core/utils/dates'
import { useMainContext } from '../../../core/contexts/main'
import {IconWrapper} from "../../../styles/CoinOperationStyles";
import {ClipLoader} from "react-spinners";
import {getMainTheme} from "../../../core/utils/theme";

const RCardItem = ({ data: item, idx, onCheckAuth, loading }) => {
	const { address, coin, createdAt, id, label, verifyAt } = item
	const {
		main: { lang },
	} = useMainContext()

	return (
		<>
			<div className={'flex justify-end'}>
				{loading === idx ?
					<IconWrapper>
						<ClipLoader size={16} color={getMainTheme('dark', 'en').active} />
					</IconWrapper>
					:
					<IconWrapper onClick={() => onCheckAuth(item, idx, 'wallet')}>
						<DeleteIcon size={12}/>
					</IconWrapper>
				}
			</div>
			<RRow className={'w-full m-auto px-5'}>
				<Flex align={'center'} className={'gap-3 w-full'}>
					<FlexCenter>
						<img src={SOCKET_URL + `assets/icon/${coin}.png`} alt=' ' width='18px' height='18px' />
						<Market>{coin}</Market>
					</FlexCenter>
					<RCFlexEnd>
						<RFlexBetween>
							<RText className={'pl-2 '} fontSize='0.55rem'>
								<Text tid='coin' />:
							</RText>
							<TextWithMargin className={'m-0 text-xs'}>{label}</TextWithMargin>
						</RFlexBetween>
						<RFlexBetween>
							<RText className={'pl-2 '} fontSize='0.55rem'>
								<Text tid='wallet-address' />:
							</RText>
							<RText className={'text-left'} style={{ lineBreak: 'anywhere' }} fontSize='0.55rem'>
								{address}
							</RText>
						</RFlexBetween>
					</RCFlexEnd>
					<Flex flexDirection={'col'} align={'end'} justify={'center'}>
						{/*<DeleteIcon*/}
						{/*	className={'mb-2'}*/}
						{/*	onClick={() => {*/}
						{/*		// setDeleteModal({ id: _id, open: true })*/}
						{/*	}}*/}
						{/*/>*/}
						<RFlexBetween>
							<RText className={'text-left'} fontSize='0.55rem'>
								{_formatDate(createdAt, { lang })}
							</RText>
						</RFlexBetween>

						<TransactionStatus
							style={{ fontSize: '0.55rem' }}
							status={verifyAt ? 'success' : 'pending'}
						>
							<Text tid={verifyAt ? 'verified' : 'Tpending'} />
						</TransactionStatus>
					</Flex>
				</Flex>
			</RRow>
		</>
	)
}

export default RCardItem
