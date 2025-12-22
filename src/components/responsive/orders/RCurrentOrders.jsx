import { useMainContext } from '../../../core/contexts/main'
import useCurrentOrders from '../../../core/hooks/useCurrentOrders'
import CardLayout from '../../layouts/CardLayout'
import ModalLayout from '../../layouts/ModalLayout'
import OrdersDeleteModal from '../../modals/DeleteModal'
import { ScrollWrap } from '../../../styles/responsive/Common'
import { NoDataWrapper } from '../../../styles/TableStyle'
import RFilterLayout from '../layouts/RFilterLayout'
import RCurrentOrderItem from './RCurrentOrderItem'

const RCurrentOrders = ({ hasFilters }) => {
	const {
		main: { lang },
	} = useMainContext()
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
				width='100%'
				minHeight='400px'
			>
				{hasFilters ? (
					<RFilterLayout
						headers={[]}
						data={currentOrders}
						totalPages={allPages}
						state={{ filterQueries, setFilterQueries, initialState }}
						loading={loading}
						filters={['date', 'type', 'submit']}
					>
						{currentOrders?.data?.map((item, index) => (
							<RCurrentOrderItem setDeleteModal={setDeleteModal} data={item} key={index} />
						))}
					</RFilterLayout>
				) : (
					<ScrollWrap
					// height='300px'
					>
						{currentOrders?.data?.map((item, index) => (
							<RCurrentOrderItem setDeleteModal={setDeleteModal} data={item} key={index} />
						))}
						{!currentOrders?.data?.length && (
							<NoDataWrapper top='80px'>
								<img alt=' ' src={require('../../../assets/images/noData.png')} />
							</NoDataWrapper>
						)}
					</ScrollWrap>
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

export default RCurrentOrders
