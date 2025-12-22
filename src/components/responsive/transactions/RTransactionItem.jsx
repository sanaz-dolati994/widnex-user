import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CardLayout from '../../layouts/CardLayout'
import { RCFlex, RFlex, RFlexCenter, RRow, RText } from '../../../styles/responsive/Common'
import { Flex } from '../../../styles/CommonStyles'
import { SOCKET_URL } from '../../../core/constants/urls'
import { Market, TextWithMargin } from '../../../styles/OrdersStyle'
import Text from '../../../core/utils/Text'
import { DetailRow, DetailText, TransactionStatus } from '../../../styles/TransactionHistoryStyles'
import { _formatDate } from '../../../core/utils/dates'
import { formatDate, formatNumber } from '../../../core/utils/common'
import { CgChevronDown, CgChevronUp } from 'react-icons/cg'
import TruncateMiddle from '../../common/TruncateMiddle'
import { useQueryContext } from '../../../core/contexts/query'
import { useMainContext } from '../../../core/contexts/main'
import CountdownTimer from '../../common/CountDownTimer'
import Tooltip from '../../common/Tooltip'
import Description from '../../modals/Description'

const RTransactionItem = (props) => {
	const { data: item, isCoin = true, type, setCancelModal } = props
	const { setToast } = useQueryContext()
	const [isExpanded, setIsExpanded] = useState(false)
	const {
		main: { lang },
	} = useMainContext()
	const onCopyToClipboard = (hash) => {
		navigator.clipboard.writeText(hash)
		setToast({
			show: true,
			message: 'copy-success',
		})
	}

	return (
		<Flex align={'center'} className={'gap-3 justify-between w-full !flex-col'}>
			<RRow className={'w-full m-auto px-0'}>
				{!!isCoin ? (
					<RFlex style={{ alignItems: 'center' }} className='w-[30%] relative'>
						{item.type === "tsp" && (
							<div className='bg-green-700 text-white absolute -top-1 -right-1 text-[9px] rounded-full h-4 flex items-center justify-center w-6 rotate-45 shadow-lg pt-1'>
								TSP
							</div>
						)}
						<img
							width='20px'
							src={SOCKET_URL + `assets/icon/${item.coin}.png`}
							alt=' '
							style={{ margin: '0 8px' }}
						/>
						<Market className='text-sm'>{item.coin.toUpperCase()}</Market>
					</RFlex>
				) : (
					<RCFlex className={`${isCoin ? 'w-[20%]' : 'w-[30%]'}`}>
						<Flex flexDirection='col' align={'center'} justify={'start'} className={'text-xs'}>
							<TextWithMargin className={'m-0 pr-1'} type={item.flow}>
								<Text tid={item.flow} />
							</TextWithMargin>
						</Flex>
					</RCFlex>
				)}

				<Flex className={`${'w-[35%] gap-1'}`} justify={'end'} align='center'>
					{isCoin && <p className='text-[9px] font-normal uppercase'>{item.coin}</p>}
					<span className={'m-0 text-xs text-left'}>{formatNumber(item.amount)}</span>
				</Flex>

				<Flex flexDirection={'col'} align={'end'} justify={'center'} className='w-[35%] mx-2'>
					<TransactionStatus className={'text-xs font-normal'} status={item.status}>
						<Text tid={`T${item.status}`} />
					</TransactionStatus>
				</Flex>

				<div className='w-[5%] cursor-pointer' onClick={() => setIsExpanded(!isExpanded)}>
					{isExpanded ? <CgChevronUp /> : <CgChevronDown />}
				</div>
			</RRow>

			<AnimatePresence>
				{isExpanded && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						className=' p-2 w-full flex flex-col gap-3'
					>
						{/* <DetailText>
                                        <Text tid='last-amount' />
                                    </DetailText>
                                    <DetailText color='mainGreen' style={{ direction: 'ltr' }}>
                                        {formatNumber(transaction.totalAmount)} {type === 'wallet' ? transaction.coin?.toUpperCase() : 'IRT'}
                                    </DetailText> */}
						<Flex justify={'between'}>
							<Text className='text-sm' tid={'last-amount'} />
							<div className='text-sm'>
								<Text className='text-[#1ce087]' tid={formatNumber(item.totalAmount)} /> {type === 'wallet' ? item.coin?.toUpperCase() : 'IRT'}
							</div>
						</Flex>
						<Flex justify={'between'}>
							<Text className='text-sm' tid={'type'} />
							<Text className='text-sm' tid={item.flow} />
						</Flex>
						<Flex justify={'between'}>
							<Text className='text-sm' tid={'id'} />
							<Text className='text-sm text-info' tid={item._id} onClick={() => onCopyToClipboard(item._id)} />
						</Flex>
						<Flex justify={'between'}>
							<Text className='text-sm' tid={'date'} />
							<p>{formatDate(item.createdAt, 'date', lang === 'en' ? 'en-US' : 'fa-IR')}</p>
						</Flex>



						{!!isCoin && (
							<>
								<Flex justify={'between'}>
									<Text className='text-sm' tid={'network'} />
									<Text className='text-sm' tid={item.network} />
								</Flex>
								<Flex justify={'between'}>
									<Text className='text-sm' tid={'TXID'} />
									<TruncateMiddle
										text={item.txId}
										frontChars={10}
										backChars={10}
										onClick={() => onCopyToClipboard(item.txId)}
									/>
								</Flex>
							</>
						)}
						{type === 'wallet' ?
							<Flex justify={'between'}>
								<Text tid='address' />
								<Text tid={item.address || "-"} />
							</Flex>
							: null
						}

						{type === 'wallet' ?
							<DetailRow
								last
							>
								<DetailText>
									<Text tid='note' />
								</DetailText>

								<DetailText  >
									{item.note ?
										item.note.toString().substring(0, 50) +
										(item.note.toString().length > 50 ? '...' : '')
										:
										'--'
									}
								</DetailText>

								<Description
									show={item.note?.toString()?.length > 50}
									note={item.note}
								/>

							</DetailRow>
							: null
						}
						{item.flow === 'withdraw' && item.status === 'created' && (
							<Flex justify='between'>
								<Text className='text-sm' tid={'request'} />
								<Flex className={`flex items-center justify-center gap-2`}>
									<Tooltip title={'cancel-withdraw-hint'} />
									{item.status === 'created' && <CountdownTimer startTime={item.createdAt} />}
									<button
										className={`rounded-lg border border-red-500 text-red-500 py-1 px-3 ${item.status === 'created' ? '' : 'opacity-50 cursor-not-allowed'
											}`}
										onClick={() => {
											if (item.status === 'created') setCancelModal({ open: true, type, item })
										}}
									>
										<Text className='text-sm' tid={'cancel'} />
									</button>
								</Flex>
							</Flex>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</Flex>
	)
}

export default RTransactionItem
