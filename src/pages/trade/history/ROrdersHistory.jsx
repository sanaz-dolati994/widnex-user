import { useState } from 'react'
import Loading from '../common/Loading'
import { usePersianNames } from '../utils'
import { useOrdersHistoryQuery } from '../utils/useHistory'
import { AnimatePresence, motion } from 'framer-motion'
import { SOCKET_URL } from '../../../core/constants/urls'
import { formatDate, formatNumber } from '../../../core/utils/common'
import Text from '../../../core/utils/Text'
import { BiChevronDown } from 'react-icons/bi'
import { useProfileQuery } from '../../../core/services/react-query/useProfileQuery'
import NoData from './NoData'

const ROrdersHistory = () => {
	const { data: profile } = useProfileQuery()
	const { findPersianName } = usePersianNames()
	const { data: history, isLoading } = useOrdersHistoryQuery()

	const [openItem, setOpenItem] = useState(-1)

	return (
		<div
			className={
				'flex flex-col gap-2 max-h-[280px] overflow-y-auto overflow-x-hidden relative min-h-[200px] mt-5'
			}
		>
			<Loading loading={isLoading} />
			<NoData show={history?.data?.length === 0} />
			{history?.data?.map((trade, idx) => {
				let tradeType = trade.order?.type
				if (profile?._id !== trade.order?.userId) {
					tradeType = tradeType === 'buy' ? 'sell' : 'buy'
				}

				let wage = trade?.client?.wage
				if (profile?._id !== trade.client?.userId) {
					wage = trade?.order?.wage
				}

				const active = idx === openItem
				const onItem = () => {
					if (active) setOpenItem(-1)
					else setOpenItem(idx)
				}

				return (
					<div
						key={trade._id}
						className={'border-b-[1px] dark:border-card-border py-2'}
						onClick={onItem}
					>
						<div className={'grid grid-cols-2 gap-2'}>
							<div className={'flex items-center gap-2'}>
								<img
									width={32}
									height={32}
									src={SOCKET_URL + `assets/icon/${trade?.coin?.toLowerCase()}.png`}
									alt={`${trade.coin?.toLowerCase()}.png`}
								/>
								<div className={'flex flex-col'}>
									<span className={'text-[0.8rem]'}>
										<span>{`${trade.coin?.toUpperCase()}`}</span>
										<span className={'text-gray-400 dark:text-gray-500'}> / </span>
										<span
											className={'text-gray-400 dark:text-gray-500'}
										>{`${trade.pair?.toUpperCase()}`}</span>
									</span>
									<span className={'text-gray-400 text-[0.7rem]'}>
										<span>{`${findPersianName(trade.coin)}`}</span>
										<span> / </span>
										<span>{`${findPersianName(trade.pair)}`}</span>
									</span>
								</div>
							</div>

							<div className={'text-xs flex items-center justify-end gap-2'}>
								<span>{formatNumber(trade.amount, { type: trade.coin })}</span>
								<div
									className={`${tradeType === 'buy' ? 'bg-green-400' : 'bg-red-400'}
                                 text-slate-800 px-2 py-[2px] rounded-md bg-opacity-20`}
								>
									<Text
										tid={tradeType}
										className={` ${tradeType === 'buy' ? 'text-green-400' : 'text-red-400'}`}
									/>
								</div>
								<div className={`${active ? 'rotate-180' : ''} transition`}>
									<BiChevronDown size={18} />
								</div>
							</div>
						</div>
						<AnimatePresence exitBeforeEnter>
							{active ? (
								<motion.div
									variants={variants}
									initial={'out'}
									exit={'out'}
									animate={'in'}
									className={'text-[0.8rem] mt-2 px-2'}
								>
									<div className={'grid grid-cols-2 gap-2'}>
										<span className={'dark:text-slate-400'}>وضعیت</span>
										<div className={'flex justify-end'}>
											<span>{trade.order?.status}</span>
										</div>
										<span className={'dark:text-slate-400'}>تاریخ</span>
										<div className={'flex justify-end'}>
											{formatDate(trade.createdAt, 'date', 'Fa-IR')}
										</div>

										<span className={'dark:text-slate-400'}>نوع</span>
										<div className={'flex justify-end'}>
											<span>{trade.order?.submit}</span>
										</div>
										<span className={'dark:text-slate-400'}>مقدار سفارش</span>
										<div className={'flex justify-end'}>
											<span>{formatNumber(trade.order?.amount, { type: trade.coin })}</span>
										</div>

										<span className={'dark:text-slate-400'}>قیمت واحد</span>
										<div className={'flex justify-end'}>
											<span>{formatNumber(trade.order?.priceUnit, { type: trade.pair })}</span>
										</div>

										<span className={'dark:text-slate-400'}>مبلغ کل</span>
										<div className={'flex justify-end'}>
											<span>{formatNumber(trade.order?.price, { type: trade.pair })}</span>
										</div>

										<span className={'dark:text-slate-400'}>کارمزد</span>
										<div className={'flex justify-end'}>
											<span>{formatNumber(wage, { type: trade.coin, point: 6 })}</span>
										</div>
									</div>
								</motion.div>
							) : null}
						</AnimatePresence>
					</div>
				)
			})}
		</div>
	)
}

const variants = {
	in: { h: 'auto' },
	out: { h: 0 },
}

export default ROrdersHistory
