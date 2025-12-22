import ModalLayout from '../../../components/layouts/ModalLayout'
import { SOCKET_URL } from '../../../core/constants/urls'
import { formatDate, formatNumber } from '../../../core/utils/common'
import Text from '../../../core/utils/Text'
import Loading from '../common/Loading'
import { usePersianNames } from '../utils'
import { useCurrentOrders } from '../utils/useHistory'
import NoData from './NoData'

const OpenOrders = () => {
	const { findPersianName } = usePersianNames()
	const {
		orders,
		deleteModal,
		setDeleteModal,
		onCloseDeleteModal,
		onModalClicked,
		loading,
		isDeleting,
	} = useCurrentOrders()

	const headers = [
		'تاریخ سفارش',
		'بازار',
		'سمت',
		'نوع',
		'مقدار سفارش',
		'قیمت واحد',
		'مبلغ کل',
		'مقدار پر شده',
		'وضعیت',
		'عملیات',
	]

	return (
		<div className={'w-full overflow-x-auto'}>
			<div className={'grid grid-cols-10 mt-3 pb-3 px-3 border-b-[1px] dark:border-card-border'}>
				{headers.map((head) => {
					return (
						<span className={'text-sm'} key={head}>
							{head}
						</span>
					)
				})}
			</div>
			<div className={'min-h-[200px] w-full relative'}>
				<Loading loading={loading} />

				<NoData show={orders?.data?.length === 0} />

				{orders?.data?.map((order, idx) => {
					return (
						<div
							className={`
                        grid grid-cols-10 my-1 py-2 px-3 rounded-md text-sm relative
                        ${
													idx % 2 === 0 ? 'dark:bg-white dark:bg-opacity-5 bg-slate-200' : ''
												} items-center
                    `}
						>
							<span>{formatDate(order.createdAt, 'date', 'Fa-IR')}</span>
							<div className={'flex items-center gap-2'}>
								<img
									width={32}
									height={32}
									src={SOCKET_URL + `assets/icon/${order?.coin?.toLowerCase()}.png`}
									alt={`${order.coin?.toLowerCase()}.png`}
								/>
								<div className={'flex flex-col'}>
									<span>
										<span>{`${order.coin?.toUpperCase()}`}</span>
										<span className={'text-gray-400 dark:text-gray-500'}> / </span>
										<span
											className={'text-gray-400 dark:text-gray-500'}
										>{`${order.pair?.toUpperCase()}`}</span>
									</span>
									<span className={'text-gray-400 text-xs'}>
										<span>{`${findPersianName(order.coin)}`}</span>
										<span> / </span>
										<span>{`${findPersianName(order.pair)}`}</span>
									</span>
								</div>
							</div>
							<Text
								tid={order.type}
								className={`${order.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}
							/>
							<span>{order.submit}</span>
							<span>{formatNumber(order.amount, { type: order.coin })}</span>
							<span>{formatNumber(order.priceUnit, { type: order.pair })}</span>
							<span>{formatNumber(order.price, { type: order.pair })}</span>
							<span>{formatNumber(order.tradedAmount, { type: order.coin })}</span>
							<span>{order.status}</span>
							<button
								className='border border-red-500 p-2 rounded-lg'
								onClick={() => setDeleteModal({ open: true, id: order._id })}
							>
								<Text tid='delete' />
							</button>
						</div>
					)
				})}
			</div>
			<ModalLayout width={'470px'} open={deleteModal.open} onClose={onCloseDeleteModal}>
				<div className='flex flex-col gap-10 items-center'>
					<Text tid={'delete-current-order'} />
					<div className='flex items-center justify-center gap-4 w-full'>
						<button
							onClick={onModalClicked}
							className='w-1/2 bg-red-500 rounded-lg flex justify-center items-center p-2'
						>
							<Text tid={isDeleting ? 'deleting' : 'delete'} />
						</button>
						<button
							onClick={onCloseDeleteModal}
							className='w-1/2 border border-gray-300 dark:border-gray-600 rounded-lg p-2'
						>
							<Text tid={'cancel'} />
						</button>
					</div>
				</div>
			</ModalLayout>
		</div>
	)
}

export default OpenOrders
