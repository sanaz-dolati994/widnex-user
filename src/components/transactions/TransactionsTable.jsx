import { useMainContext } from '../../core/contexts/main'
import { Column, Row } from '../../styles/TableStyle'
import { FlexCenter } from '../../styles/CommonStyles'
import { SOCKET_URL } from '../../core/constants/urls'
import { Market, TextWithMargin } from '../../styles/OrdersStyle'
import { formatDate, formatNumber } from '../../core/utils/common'
import Text from '../../core/utils/Text'
import { DetailsIcon, NetworkBadge, TransactionStatus } from '../../styles/TransactionHistoryStyles'
import React from 'react'
import TruncateMiddle from '../common/TruncateMiddle'
import { useQueryContext } from '../../core/contexts/query'
import CountdownTimer from '../common/CountDownTimer'
import Tooltip from '../common/Tooltip'

export const TransactionTable = ({
	data,
	type,
	setDetailsModal,
	setCancelModal
}) => {
	const {
		main: { lang },
	} = useMainContext()

	const { setToast } = useQueryContext()

	const onCopyToClipboard = (hash) => {
		console.log(hash)
		navigator.clipboard.writeText(hash)
		setToast({
			show: true,
			message: 'copy-success',
		})
	}

	return (
		<>
			{data.map((item, idx) => {
				return (
					<Row
						className='odd:bg-body dark:odd:bg-[#ffffff02] odd:rounded-xl flex justify-between'
						key={item._id}
					>
						{type === 'wallet' && (
							<Column className='rounded-r-xl w-[12%] flex justify-center items-center'>
								<FlexCenter className='relative'>
									{item.type === "tsp" && (
										<div className='bg-green-700 text-white absolute -top-1 -right-1 text-2xs rounded-full h-4 flex items-center justify-center w-8 rotate-45 shadow-lg pt-1'>
											TSP
										</div>
									)}
									<img
										src={SOCKET_URL + `assets/icon/${item.coin}.png`}
										alt=' '
										className='w-6 h-6'
									/>
									<Market>{item.coin.toUpperCase()}</Market>
								</FlexCenter>
							</Column>
						)}

						{type === 'wallet' && (
							<Column className='flex flex-col gap-y-2 text-sm w-[13%]'>
								<Text tid='id' className='text-pcolor-light text-sm' />
								<TruncateMiddle
									text={item._id}
									frontChars={4}
									backChars={4}
									onClick={() => onCopyToClipboard(item._id)}
								/>
							</Column>
						)}
						<Column
							className={`${type === 'bank' ? 'rounded-r-xl' : ''
								} flex flex-col gap-y-2 text-sm w-[13%]`}
						>
							<Text tid='flow' className='text-pcolor-light text-sm' />
							<FlexCenter>
								{/* {item.flow === 'deposit' ? (
                                    <BuyIcon />
                                ) : (
                                    <SellIcon />
                                )} */}
								<TextWithMargin type={item.flow}>
									<Text tid={item.flow} />
								</TextWithMargin>
							</FlexCenter>
						</Column>
						{type === 'bank' && (
							<Column className='flex flex-col gap-y-2 w-[13%]'>
								<Text tid='id' className='text-pcolor-light text-sm' />
								<TruncateMiddle
									text={item._id}
									frontChars={4}
									backChars={4}
									onClick={() => onCopyToClipboard(item._id)}
								/>
							</Column>
						)}
						<Column
							number
							className={`flex flex-col gap-y-2 text-sm ${type === 'wallet' ? 'w-[13%]' : 'w-[15%]'
								}`}
						>
							<Text tid='date' className='text-pcolor-light text-sm' />
							{formatDate(item.createdAt, 'date', lang === 'en' ? 'en-US' : 'fa-IR')}
						</Column>
						<Column
							number
							className={`flex flex-col gap-y-2 text-sm ${type === 'wallet' ? 'w-[10%]' : 'w-[24%]'
								}`}
						>
							<Text tid='amount' className='text-pcolor-light text-sm' />
							{item.amount ? formatNumber(item.amount) : '--'}
						</Column>
						{type === 'wallet' && (
							<Column className='flex flex-col gap-y-2 text-sm w-[10%]'>
								<Text tid='network' className='text-pcolor-light text-sm' />
								<FlexCenter>
									{item.network.toUpperCase()}
									{/* <NetworkBadge>{item.network}</NetworkBadge> */}
								</FlexCenter>
							</Column>
						)}
						{type === 'wallet' && (
							<Column className='flex flex-col gap-y-2 text-sm w-[13%]'>
								<Text tid='TXID' className='text-pcolor-light text-sm' />
								<TruncateMiddle
									text={item.txId}
									frontChars={4}
									backChars={4}
									onClick={() => onCopyToClipboard(item.txId)}
								/>
							</Column>
						)}

						{type === 'bank' && (
							<Column number className='flex flex-col gap-y-2 text-sm w-[15%]'>
								<Text tid='timeHour' className='text-pcolor-light text-sm' />
								{formatDate(item.createdAt, 'time', lang === 'en' ? 'en-US' : 'fa-IR')}
							</Column>
						)}
						<Column className='flex flex-col items-center gap-y-2 text-sm w-[15%]'>
							<Text tid='status' className='text-pcolor-light text-sm' />
							<TransactionStatus status={item.status} className='!max-w-max !px-4'>
								<Text tid={`T${item.status}`} />
							</TransactionStatus>
						</Column>

						{item.flow === 'withdraw' && item.status === 'created' && (
							<Column className={`rounded-l-xl flex items-center justify-center px-2 w-[20%]`}>
								<FlexCenter gap={'4px'}>
									{item.status === 'created' && <CountdownTimer startTime={item.createdAt} />}
									<Tooltip title={'cancel-withdraw-hint'} />
									<button
										className={`rounded-lg border border-red-500 text-red-500 px-4 py-1 ${item.status === 'created' ? '' : 'opacity-50 cursor-not-allowed'
											}`}
										onClick={() => {
											if (item.status === 'created')
												setCancelModal({ open: true, type: type, item })
										}}
									>
										<Text tid={'cancel'} />
									</button>
								</FlexCenter>
							</Column>
						)}
						<Column
							className={`rounded-l-xl flex items-center justify-center  ${type === 'wallet' ? 'w-[6%]' : 'w-[10%]'
								}`}
						>
							<FlexCenter onClick={() => setDetailsModal({ open: true, item })}>
								<DetailsIcon size={22} />
							</FlexCenter>
						</Column>
					</Row>
				)
			})}
		</>
	)
}

export default TransactionTable
