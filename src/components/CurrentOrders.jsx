import CardLayout from './layouts/CardLayout'
import {Column, HeaderColumn, HeaderRow, Row} from '../styles/TableStyle'
import { BuyIcon, DeleteIcon, Market, SellIcon, TextWithMargin } from '../styles/OrdersStyle'
import { FlexCenter, PercentText } from '../styles/CommonStyles'
import { formatDate, formatNumber } from '../core/utils/common'
import FilterLayout from './layouts/FilterLayout'
import ModalLayout from './layouts/ModalLayout'
import OrdersDeleteModal from './modals/DeleteModal'
import { useMainContext } from '../core/contexts/main'
import Text from '../core/utils/Text'
import { SOCKET_URL } from '../core/constants/urls'
import useCurrentOrders from '../core/hooks/useCurrentOrders'
import AuthLoading from './authentication/AuthLoading'


const CurrentOrders = ({ hasFilters }) => {

	const {
		currentOrders,
		setDeleteModal,
		allPages,
		filterQueries,
		setFilterQueries,
		initialState,
		loading,
		deleteModal,
		onModalClicked,
	} = useCurrentOrders()


	return (
		<>
			<CardLayout
				// height={hasFilters ? '80vh' : '350px'}
				title={hasFilters ? '' : 'current-orders'}
				style={{ padding: '20px' }}
			>
					{hasFilters ? (
						<FilterLayout
							headers={headers}
							data={currentOrders}
							totalPages={allPages}
							state={{ filterQueries, setFilterQueries, initialState }}
							loading={loading}
							hasTradeOptions
							hasTypeOptions
							hasCoinOption
						>
							<CurrentOrdersTable setDeleteModal={setDeleteModal} currentOrders={currentOrders} />
						</FilterLayout>
					) : (
						<>
							<HeaderRow>
								{headers.map((header) => (
									<HeaderColumn width={header.width} key={header.title}>
										<Text tid={header.title} />
									</HeaderColumn>
								))}
							</HeaderRow>
							<CurrentOrdersTable
								setDeleteModal={setDeleteModal}
								currentOrders={currentOrders}
								height='60%'
							/>
							<AuthLoading loading={loading} />
						</>
					)}
			</CardLayout>

			<ModalLayout
				width='450px'
				open={deleteModal.open}
				onClose={() => setDeleteModal({ id: null, open: false })}
			>
				<OrdersDeleteModal onModalBtnClicked={onModalClicked} />
			</ModalLayout>
		</>
	)
}

const CurrentOrdersTable = ({ currentOrders, setDeleteModal, height }) => {
	const {
		main: { lang },
	} = useMainContext()

	return (
		<>
			{currentOrders?.data?.map((item, index) => {
				return (
					<Row key={item._id}>
						<Column>
							<FlexCenter>
								<img
									width='25px'
									height='25px'
									src={SOCKET_URL + `assets/icon/${item?.coin?.toLowerCase()}.png`}
									alt={`${item.id?.toLowerCase()}.png`}
								/>
								<Market>{`${item.coin}/${item.pair}`}</Market>
							</FlexCenter>
						</Column>
						<Column number>{formatNumber(item.amount)}</Column>
						<Column number>{formatNumber(item.priceUnit)}</Column>
						<Column number>{formatNumber(item.price)}</Column>
						<Column>
							<FlexCenter>
								{item.type === 'buy' ? <BuyIcon /> : <SellIcon />}
								<TextWithMargin type={item.type}>
									<Text tid={item.type} />
								</TextWithMargin>
							</FlexCenter>
						</Column>
						<Column>{item.submit}</Column>
						<Column number>
							{formatDate(item.createdAt, 'date', lang === 'en' ? 'en-US' : 'fa-IR')}
						</Column>
						<Column number>
							{formatDate(item.createdAt, 'time', lang === 'en' ? 'en-US' : 'fa-IR')}
						</Column>
						<Column width='9%'>
							{
								<PercentText pc={(item.tradedAmount * 100) / item.amount}>
									{Math.round((item.tradedAmount * 100) / item.amount)}%
								</PercentText>
							}
						</Column>
						<Column width='2.2%'>
							<DeleteIcon onClick={() => setDeleteModal({ id: item._id, open: true })} />
						</Column>
					</Row>
				)
			})}
		</>
	)
}

const headers = [
	{ title: 'market', width: '11.1%' },
	{ title: 'amount', width: '11.1%' },
	{ title: 'unitPrice', width: '11.1%' },
	{ title: 'totalPrice', width: '11.1%' },
	{ title: 'transactionType', width: '11.1%' },
	{ title: 'tradeType', width: '11.1%' },
	{ title: 'date', width: '11.1%' },
	{ title: 'timeHour', width: '11.1%' },
	{ title: 'donePc', width: '11.1%' },
]

export default CurrentOrders
