import { useEffect, useState } from 'react'
import CardLayout from '../../layouts/CardLayout'
import { useOrdersHistoryQuery } from '../../../core/services/react-query/useOrdersHistoryQuery'
import RFilterLayout from '../layouts/RFilterLayout'
import ROrderItem from './ROrderItem'

const ROrdersHistory = () => {

	const initialState = {
		page: 1,
		dateFrom: null,
		search: {
			type: 'order.type',
			coin: 'order.coin'
		},
		query: {
			type: '',
			coin: ''
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
		<CardLayout width='100%' minHeight='400px'>
			<RFilterLayout
				headers={headers}
				data={orders}
				totalPages={allPages}
				state={{ filterQueries, setFilterQueries, initialState }}
				loading={isFetching}
				filters={['date', 'type']}
			>
				{orders?.data?.map((item, index) => {
					return <ROrderItem data={item} key={index} />
				})}
			</RFilterLayout>
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

export default ROrdersHistory
