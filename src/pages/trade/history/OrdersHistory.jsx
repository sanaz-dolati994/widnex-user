import { SOCKET_URL } from '../../../core/constants/urls'
import { useProfileQuery } from '../../../core/services/react-query/useProfileQuery'
import { formatDate, formatNumber } from '../../../core/utils/common'
import Text from '../../../core/utils/Text'
import Loading from '../common/Loading'
import { usePersianNames } from '../utils'
import { useOrdersHistoryQuery } from '../utils/useHistory'
import NoData from './NoData'

const OrdersHistory = () => {
	const { data: profile } = useProfileQuery()
	const { findPersianName } = usePersianNames()
	const { data: history, isLoading } = useOrdersHistoryQuery()
	const headers = [
		'تاریخ سفارش',
		'بازار',
		'سمت',
		'نوع',
		'مقدار سفارش',
		'قیمت واحد',
		'مبلغ کل',
		'مقدار پر شده',
		'کارمزد',
	]

	return (
		<div className={'min-w-[1000px] overflow-x-auto'}>
			<div className={'grid grid-cols-10 mt-3 pb-3 px-3 border-b-[1px] dark:border-card-border'}>
				{headers.map((head) => {
					return (
						<span className={'text-sm'} key={head}>
							{head}
						</span>
					)
				})}
			</div>
			<div className={'h-[400px] w-full relative overflow-y-auto'}>
				<Loading loading={isLoading} />
				<NoData show={history?.data?.length === 0} />
				{history?.data?.map((trade, idx) => {
					let submitType = trade?.order?.submit
					if (profile?._id !== trade.order?.userId && !!trade.submit) {
						submitType = trade?.submit
					}

					let tradeType = trade.order?.type
					if (profile?._id !== trade.order?.userId) {
						tradeType = tradeType === 'buy' ? 'sell' : 'buy'
					}

					let wage = trade?.client?.wage
					if (profile?._id !== trade.client?.userId) {
						wage = trade?.order?.wage
					}

					return (
						<div
							className={`
                        grid grid-cols-10 my-1 py-2 px-3 rounded-md text-sm relative
                        ${
													idx % 2 ? 'dark:bg-white dark:bg-opacity-5 bg-slate-200' : ''
												} items-center
                    `}
						>
							<span>{formatDate(trade.createdAt, 'date', 'Fa-IR')}</span>
							<div className={'flex items-center gap-2'}>
								<img
									width={32}
									height={32}
									src={SOCKET_URL + `assets/icon/${trade?.coin?.toLowerCase()}.png`}
									alt={`${trade.coin?.toLowerCase()}.png`}
								/>
								<div className={'flex flex-col'}>
									<span>
										<span>{`${trade.coin?.toUpperCase()}`}</span>
										<span className={'text-gray-400 dark:text-gray-500'}> / </span>
										<span
											className={'text-gray-400 dark:text-gray-500'}
										>{`${trade.pair?.toUpperCase()}`}</span>
									</span>
									<span className={'text-gray-400 text-xs'}>
										<span>{`${findPersianName(trade.coin)}`}</span>
										<span> / </span>
										<span>{`${findPersianName(trade.pair)}`}</span>
									</span>
								</div>
							</div>
							<Text
								tid={tradeType}
								className={`${tradeType === 'buy' ? 'text-green-400' : 'text-red-400'}`}
							/>
							<span>{submitType}</span>
							<span>{formatNumber(trade?.amount, { type: trade.coin })}</span>
							<span>{formatNumber(trade?.priceUnit, { type: trade.pair })}</span>
							<span>{formatNumber(trade?.price, { type: trade.pair })}</span>
							<span>{formatNumber(trade.order?.tradedAmount, { type: trade.coin })}</span>
							<span>{formatNumber(wage, { type: trade.coin, point: 6 })}</span>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default OrdersHistory
