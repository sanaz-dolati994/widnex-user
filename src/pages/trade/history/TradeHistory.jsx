import { useState } from 'react'
import Card from '../../../components/common/Card'
import Text from '../../../core/utils/Text'
import OpenOrders from './OpenOrders'
import OrdersHistory from './OrdersHistory'

const TradeHistory = () => {
	const tabs = ['open-orders', 'history']
	const [tab, setTab] = useState('open-orders')

	return (
		<Card className={'w-full h-full relative'}>
			<div className={'flex items-center justify-between py-3 px-3'}>
				<div className={'flex items-center gap-5'}>
					<span>سفارشات اسپات</span>
					{tabs.map((item, idx) => {
						const active = tab === item
						const ids = ['tour-current-orders', 'tour-orders-history']

						return (
							<div
								id={ids[idx]}
								className={`rounded-md  text-xs py-1 px-2 dark:bg-white bg-black
                                ${
																	active
																		? 'dark:bg-opacity-20 bg-opacity-20'
																		: 'dark:bg-opacity-5 bg-opacity-5'
																}
                                cursor-pointer transition
                            `}
								onClick={() => setTab(item)}
							>
								<Text tid={item} />
							</div>
						)
					})}
				</div>
				{/* <Link to={'/'}>
					<div className={'text-blue-500 text-sm cursor-pointer'}>
						<span>نمایش بیشتر</span>
					</div>
				</Link> */}
			</div>

			{tab === 'open-orders' ? <OpenOrders /> : null}

			{tab === 'history' ? <OrdersHistory /> : null}
		</Card>
	)
}

export default TradeHistory
