import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import {
	DText,
	FlexCenter,
	PaginationContainer,
	ReadAllNotsWrapper,
} from '../../../styles/CommonStyles'
import Pagination from 'react-js-pagination'
import {
	useNotificationsQuery,
	useReadAllNotificationsMutation,
	useUnreadNotificationQuery,
} from '../../../core/services/react-query/useNotificationsQuery'
import RNotificationItem from './RNotificationItem'
import Text from '../../../core/utils/Text'
import { useMainContext } from '../../../core/contexts/main'
import { NoDataWrapper } from '../../../styles/TableStyle'

const RNotifications = () => {
	const {
		main: { theme },
	} = useMainContext()
	const [activePage, setActivePage] = useState(1)
	const [totalPages, setTotalPages] = useState(null)

	const { data: notifications, isFetching, refetch } = useNotificationsQuery(activePage)
	const { data: unreadNots } = useUnreadNotificationQuery(activePage)
	const { mutate: readNots } = useReadAllNotificationsMutation()

	useEffect(() => {
		if (notifications) {
			setTotalPages(notifications.meta.total)
		}
	}, [notifications])

	const onPageChange = (p) => {
		setActivePage(p)
	}

	useEffect(refetch, [activePage])

	const readAllNotifications = () => {
		readNots()
	}

	return (
		<>
			{unreadNots?.data?.length ? (
				<FlexCenter style={{ justifyContent: 'flex-end' }}>
					<ReadAllNotsWrapper onClick={readAllNotifications}>
						<DText>
							<Text tid='read-all-notifications' />
						</DText>
					</ReadAllNotsWrapper>
				</FlexCenter>
			) : null}
			<AnimatePresence exitBeforeEnter>
				{!isFetching && notifications?.data?.length && (
					<div className={'px-5 mb-20'}>
						{notifications.data.map((item, index) => (
							<RNotificationItem key={index} data={item} index={index} />
						))}
					</div>
				)}

				{!isFetching && !notifications?.data?.length && (
					<div className={'p-5'}>
						<NoDataWrapper top='80px'>
							<img alt=' ' src={require('../../../assets/images/noData.png')} />
						</NoDataWrapper>
					</div>
				)}
			</AnimatePresence>
			{totalPages ? (
				<PaginationContainer>
					<Pagination
						activePage={activePage}
						itemsCountPerPage={10}
						totalItemsCount={totalPages}
						pageRangeDisplayed={3}
						onChange={(p) => onPageChange(p)}
						itemClass={theme === 'light' ? 'd-page-item' : 'page-item'}
						linkClass={theme === 'light' ? 'd-page-link' : 'page-link'}
					/>
				</PaginationContainer>
			) : null}
		</>
	)
}

export default RNotifications
