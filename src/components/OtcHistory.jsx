import { AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { formatDate, formatNumber, variants } from '../core/utils/common'
import CardLayout from './layouts/CardLayout'
import FilterLayout from './layouts/FilterLayout'
import { FlexCenter } from '../styles/CommonStyles'
import { BuyIcon, Market, SellIcon, TableWrapper, TextWithMargin } from '../styles/OrdersStyle'
import { Column, Row, Table } from '../styles/TableStyle'
import { useMainContext } from '../core/contexts/main'
import Text from '../core/utils/Text'
import { useOtcHistoryQuery } from '../core/services/react-query/useOrdersHistoryQuery'
import { SOCKET_URL } from '../core/constants/urls'
import { DetailsIcon } from '../styles/TransactionHistoryStyles'

const OtcHistory = ({ setDetailsModal }) => {
	const {
		main: { lang },
	} = useMainContext()

	const initialState = {
		page: 1,
		dateFrom: null,
		search: {
			type: 'type',
			coin: 'coin'
		},
		query: {
			type: '',
			coin: ''
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
		<>
			<FilterLayout
				headers={headers}
				data={orders}
				totalPages={allPages}
				state={{ filterQueries, setFilterQueries, initialState }}
				loading={isFetching}
				hasCoinOption
				hasTypeOptions
			>

				{orders?.data?.map((item, index) => (
					<Row key={item.createdAt}>
						<Column width='12%'>
							<FlexCenter>
								<img
									src={SOCKET_URL + `assets/icon/${item.coin}.png`}
									alt=' '
									width='18px'
									height='18px'
								/>
								<Market>{item.coin}</Market>
							</FlexCenter>
						</Column>
						<Column width='12%' number>{formatNumber(item.amount)}</Column>
						<Column width='12%' number style={{ direction: 'ltr' }}>{
							`${formatNumber(item.wage)} (${item.type === 'sell' ? 'IRT' : item.coin?.toUpperCase()})`
						}</Column>
						<Column width='12%' number>{item.priceUnit ? formatNumber(item.priceUnit) : '--'}</Column>
						<Column width='12%' number>{item.price ? formatNumber(item.price) : '--'}</Column>
						<Column width='14.2%'>
							<FlexCenter>
								{item.type === 'buy' ? <BuyIcon /> : <SellIcon />}
								<TextWithMargin type={item.type}>
									<Text tid={item.type} />
								</TextWithMargin>
							</FlexCenter>
						</Column>
						<Column width='14.2%' number>
							{formatDate(item.createdAt, 'date', lang === 'en' ? 'en-US' : 'fa-IR')}
						</Column>
						<Column width='14.2%' number>
							{formatDate(item.createdAt, 'time', lang === 'en' ? 'en-US' : 'fa-IR')}
						</Column>
						<Column width='8.2%'>
							<FlexCenter >
								<DetailsIcon size={22} onClick={(e) => {
									setDetailsModal({ open: true, item })
								}} />
							</FlexCenter>
						</Column>
					</Row>
				))}
			</FilterLayout>
		</>

	)
}

const headers = [
	{ title: 'coin', width: '12%' },
	{ title: 'amount', width: '12%' },
	{ title: 'wage', width: '12%' },
	{ title: 'unitPrice', width: '12%' },
	{ title: 'totalPrice', width: '12%' },
	{ title: 'transactionType', width: '12%' },
	{ title: 'date', width: '14.2%' },
	{ title: 'timeHour', width: '14.2%' },
	{ title: 'other', width: '8.2%' },
]

export default OtcHistory
