import { useEffect, useState } from 'react'
import CardLayout from './layouts/CardLayout'
import { Column, Row } from '../styles/TableStyle'
import { BuyIcon, Market, SellIcon, TextWithMargin } from '../styles/OrdersStyle.js'
import { FlexCenter } from '../styles/CommonStyles'
import { formatDate, formatNumber } from '../core/utils/common'
import FilterLayout from './layouts/FilterLayout'
import { useMainContext } from '../core/contexts/main'
import Text from '../core/utils/Text'
import { useOrdersHistoryQuery } from '../core/services/react-query/useOrdersHistoryQuery'
import { SOCKET_URL } from '../core/constants/urls'
import { useProfileQuery } from '../core/services/react-query/useProfileQuery'

const OrdersHistory = () => {
	const {
		main: { lang },
	} = useMainContext()

	const { data: profile } = useProfileQuery()

	const initialState = {
		page: 1,
		dateFrom: null,
		search: {
			type: 'order.type',
			coin: 'order.coin',
		},
		query: {
			type: '',
			coin: '',
		},
	}
	const [filterQueries, setFilterQueries] = useState(initialState)

	const [allPages, setAllPages] = useState(null)
	const { data: orders, isFetching, refetch } = useOrdersHistoryQuery(filterQueries)

	useEffect(() => {
		if ((orders && !allPages) || (orders && orders.meta.total !== allPages)) {
			setAllPages(orders.meta.total)
		}
		// eslint-disable-next-line
	}, [orders])

	useEffect(() => {
		refetch()
	}, [filterQueries, refetch])

	return (
		<CardLayout width='100%'>
			<FilterLayout
				headers={headers}
				data={orders}
				totalPages={allPages}
				state={{ filterQueries, setFilterQueries, initialState }}
				loading={isFetching}
				hasCoinOption
				hasTypeOptions
			>
				{profile &&
					orders?.data?.map((item, index) => {
						let transactionType
						if (profile?._id === item.order.userId) {
							transactionType = item.order.type
						} else {
							transactionType = item.order.type === 'buy' ? 'sell' : 'buy'
						}
						return (
							<Row key={index}>
								<Column width='14.2%'>
									<FlexCenter>
										<img
											src={SOCKET_URL + `assets/icon/${item?.order.coin}.png`}
											alt=' '
											width='18px'
											height='18px'
										/>
										<Market>{`${item.order.coin}/${item.pair}`}</Market>
									</FlexCenter>
								</Column>
								<Column number width='14.2%'>
									{formatNumber(item.amount)}
								</Column>
								<Column number width='14.2%'>
									{formatNumber(item.priceUnit)}
								</Column>
								<Column number width='14.2%'>
									{formatNumber(item.price)}
								</Column>
								<Column width='14.2%'>
									<FlexCenter>
										{transactionType === 'buy' ? <BuyIcon /> : <SellIcon />}
										<TextWithMargin type={transactionType}>
											<Text tid={transactionType} />
										</TextWithMargin>
									</FlexCenter>
								</Column>
								<Column width='14.2%' number>
									{formatDate(item.order.createdAt, 'date', lang === 'en' ? 'en-US' : 'fa-IR')}
								</Column>
								<Column width='14.2%' number>
									{formatDate(item.order.createdAt, 'time', lang === 'en' ? 'en-US' : 'fa-IR')}
								</Column>
							</Row>
						)
					})}
			</FilterLayout>
		</CardLayout>
	)
}

const headers = [
	{ title: 'market', width: '14.2%' },
	{ title: 'amount', width: '14.2%' },
	{ title: 'unitPrice', width: '14.2%' },
	{ title: 'totalPrice', width: '14.2%' },
	{ title: 'transactionType', width: '14.2%' },
	{ title: 'date', width: '14.2%' },
	{ title: 'timeHour', width: '14.2%' },
]

export default OrdersHistory
