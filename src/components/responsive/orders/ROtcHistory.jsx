import { useEffect, useState } from 'react'
import CardLayout from '../../layouts/CardLayout'
import { useOtcHistoryQuery } from '../../../core/services/react-query/useOrdersHistoryQuery'
import RFilterLayout from '../layouts/RFilterLayout'
import ROtcOrderItem from './ROtcOrderItem'
import { FlexCenter } from '../../../styles/CommonStyles'
import { DetailsIcon } from '../../../styles/TransactionHistoryStyles'

const ROtcHistory = ({ setDetailsModal, withCard = false }) => {
	const initialState = {
		page: 1,
		dateFrom: null,
		search: {
			type: 'type',
			coin: 'coin',
		},
		query: {
			type: '',
			coin: '',
		},
	}
	const [filterQueries, setFilterQueries] = useState(initialState)

	const [allPages, setAllPages] = useState(null)
	const { data: orders, isFetching, refetch } = useOtcHistoryQuery(filterQueries)

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
		<CardLayout width='100%' minHeight='400px' color={'#607d8b'} bgColor={!withCard} marginTop={'0'}>
			<RFilterLayout
				headers={headers}
				data={orders}
				totalPages={allPages}
				state={{ filterQueries, setFilterQueries, initialState }}
				loading={isFetching}
				filters={['date', 'type']}
			>
				{orders?.data?.map((item, index) => (
					<ROtcOrderItem setDetailsModal={setDetailsModal} data={item} key={index} />
				))}
			</RFilterLayout>
		</CardLayout>
	)
}

const headers = [
	{ title: 'coin', width: '14.2%' },
	{ title: 'amount', width: '14.2%' },
	{ title: 'unitPrice', width: '14.2%' },
	{ title: 'totalPrice', width: '14.2%' },
	{ title: 'transactionType', width: '14.2%' },
	{ title: 'date', width: '14.2%' },
	{ title: 'timeHour', width: '14.2%' },
]

export default ROtcHistory
