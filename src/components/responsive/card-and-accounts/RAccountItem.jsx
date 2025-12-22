import React from 'react'
import Text from '../../../core/utils/Text'
import { RCFlexEnd, RFlexBetween, RRow, RText } from '../../../styles/responsive/Common'
import { Flex } from '../../../styles/CommonStyles'
import { DeleteIcon, TextWithMargin } from '../../../styles/OrdersStyle'
import { _formatDate } from '../../../core/utils/dates'
import { TransactionStatus } from '../../../styles/TransactionHistoryStyles'
import { useMainContext } from '../../../core/contexts/main'
import {IconWrapper} from "../../../styles/CoinOperationStyles";
import {ClipLoader} from "react-spinners";
import {getMainTheme} from "../../../core/utils/theme";

const RAccountItem = ({ data: item, idx, onCheckAuth, loading }) => {
	const { cardNo, createdAt, id, issuer, label, shebaNo, verifyAt } = item

	const {
		main: { lang },
	} = useMainContext()

	// card-number
	// shaba-number
	// label
	// status

	return (
		<>
			<div className={'flex justify-end'}>
				{loading === idx ?
					<IconWrapper>
						<ClipLoader size={16} color={getMainTheme('dark', 'en').active} />
					</IconWrapper>
					:
					<IconWrapper onClick={() => onCheckAuth(item, idx, 'bank')}>
						<DeleteIcon size={12}/>
					</IconWrapper>
				}
			</div>

			<RRow className={'w-full m-auto px-5'}>

				<Flex align={'center'} className={'gap-3 w-full'}>
					<RCFlexEnd>
						<RFlexBetween>
							<RText className={'pl-2 '} fontSize='0.55rem'>
								<Text tid='label' />:
							</RText>
							<TextWithMargin className={'m-0 text-xs'}>{label}</TextWithMargin>
						</RFlexBetween>
						<RFlexBetween>
							<RText className={'pl-2'} fontSize='0.55rem'>
								<Text tid='shaba-number' />:
							</RText>
							<RText className={''} fontSize='0.55rem'>
								{shebaNo}
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

export default RAccountItem
