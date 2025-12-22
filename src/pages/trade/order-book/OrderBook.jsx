import { useMemo, useState } from 'react'
import Card from '../../../components/common/Card'
import { useSocketContent } from '../../../core/contexts/socket-content'
import { formatNumber } from '../../../core/utils/common'
import useOrdersBook from '../utils/useOrdersBook'
import { useOrderPercentage } from '../utils/useTradeHeaderHook'
import Loading from '../common/Loading'
import { useMainContext } from '../../../core/contexts/main'
import OrderbookTab from './OrderbookTab'
import OrderbookList from './OrderbookList'

const OrderBook = () => {
	const [orderBookTab, setOrderBookTab] = useState('all')

	const { ordersAmount } = useOrderPercentage()
	const { market } = useMainContext()
	const { trades } = useSocketContent()
	const {
		_sellOrders,
		_buyOrders,
		sellHover,
		buyHover,
		setSellHover,
		setBuyHover,
		sellHoverRef,
		buyHoverRef,
		sellHoverDetails,
		buyHoverDetails,
		onSellOrdersHover,
		onBuyOrdersHover,
		_max,
		onOrderClicked,
		loading,
	} = useOrdersBook()

	const lastTrade = useMemo(() => {
		let res = {
			irt: 0,
			usdt: 0,
			color: '',
		}
		if (trades?.length) {
			if (trades.length > 1) {
				let diff = trades[0].priceUnit - trades[1].priceUnit
				if (diff > 0) res.color = 'green'
				if (diff < 0) res.color = 'red'
				res.irt = trades[0].priceUnit
				res.usdt = trades[0].price
			}
		}
		return res
	}, [trades])

	const buySide = Math.ceil((ordersAmount.buy / (ordersAmount.buy + ordersAmount.sell)) * 100)

	const sellSide = Math.floor((ordersAmount.sell / (ordersAmount.buy + ordersAmount.sell)) * 100)

	return (
		<div className={'flex flex-col gap-1'}>
			<Card className={'w-full min-h-[400px] relative'} padding={'px-2 py-4'}>
				<div className={'w-full border-b-[1px] dark:border-card-border pb-2'}>
					<div className={'grid grid-cols-12 w-[95%] items-end text-xs relative gap-2'}>
						<Loading loading={ordersAmount.bl && ordersAmount.sl} />
						<div>
							<span className={'text-green-400'}>خرید</span>
						</div>
						<div className={'col-span-10'}>
							<div className={'w-full flex flex-col'}>
								<div className={'flex items-center justify-between'}>
									<span className={'text-green-400'}>{buySide} %</span>
									<span className={'text-red-400'}>{sellSide} %</span>
								</div>
								<div className={'flex'}>
									<div
										className={`bg-green-400 h-[6px] rounded-r-md`}
										style={{ width: `${buySide}%` }}
									/>
									<div
										className={`bg-red-400 h-[6px] rounded-l-md`}
										style={{ width: `${sellSide}%` }}
									/>
								</div>
							</div>
						</div>
						<div>
							<span className={'text-red-400'}>فروش</span>
						</div>
					</div>

					<OrderbookTab orderBookTab={orderBookTab} setOrderBookTab={setOrderBookTab} />
				</div>

				<div className={'grid grid-cols-3 mt-3 px-2'}>
					{['قیمت(TMN)', `مقدار(${market.coin?.toUpperCase()})`, 'قیمت کل(TMN)'].map(
						(head, idx) => {
							const ids = ['order-book-price', 'order-book-amount', 'order-book-total']

							return (
								<div
									className={`
                                ${idx === 2 ? 'flex justify-end' : ''}
                                text-xs
                            `}
									key={head}
								>
									<span className={'p-1'} id={ids[idx]}>
										{head}
									</span>
								</div>
							)
						}
					)}
				</div>
				<div
					className={`flex w-full ${
						orderBookTab === 'all' ? 'min-h-[300px] items-end' : 'min-h-[600px]'
					}`}
				>
					<div className={`flex flex-col w-full gap-1 mt-3`}>
						<OrderbookList
							orders={
								orderBookTab === 'all'
									? _sellOrders?.slice(0, 10).reverse()
									: orderBookTab === 'sell'
									? _sellOrders?.reverse()
									: _buyOrders
							}
							onOrderClicked={onOrderClicked}
							_max={_max}
							type={orderBookTab === 'all' ? 'sell' : orderBookTab}
						/>
					</div>
				</div>
			</Card>

			{orderBookTab === 'all' ? (
				<>
					<Card
						className={'w-full h-[66px] relative  flex items-center justify-between'}
						padding={'px-2 py-4'}
					>
						<span
							className={`${lastTrade.color === 'red' && 'text-red-500'}
                    ${lastTrade.color === 'green' && 'text-green-500'}
                `}
						>
							{formatNumber(lastTrade.irt, { type: 'irt' })}
						</span>
						<span dir={'ltr'} className={'text-sm'}>
							{formatNumber(lastTrade.usdt, { type: 'usdt' })} USDT
						</span>
					</Card>
					<Card className={'w-full min-h-[380px] relative'} padding={'px-2 py-4'}>
						<div className={`flex flex-col gap-1 mt-3`}>
							<OrderbookList
								orders={_buyOrders?.slice(0, 10)}
								onOrderClicked={onOrderClicked}
								_max={_max}
								type={'buy'}
							/>
						</div>
					</Card>
				</>
			) : null}
		</div>
	)
}

export default OrderBook
