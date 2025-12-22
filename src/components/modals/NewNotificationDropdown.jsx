import { forwardRef } from 'react'
import { useReadAllNotificationsMutation, useReadNotificationMutation } from '../../core/services/react-query/useNotificationsQuery'
import { useMainContext } from '../../core/contexts/main'
import styled from 'styled-components'
import Card from '../common/Card'
import { Heading } from '../../styles/newStyles/Dashboard.styled'
import Text from '../../core/utils/Text'
import { ScaleLoader } from 'react-spinners'
import { FaCircle } from 'react-icons/fa'
import { formatDate } from '../../core/utils/common'
import { Link } from 'react-router-dom'
import { useWindowSize } from '../../core/hooks/useWindowSize'

export const NotificationDropdown = forwardRef((props, ref) => {
	const { notifications, loading } = props

	const { width } = useWindowSize()

	const {
		main: { lang },
	} = useMainContext()

	const {
		mutate: readNotification,
		isLoading,
	} = useReadNotificationMutation()

	const onNotificationRead = (id) => {
		readNotification(id)
	}
	const { mutate: readAllNotifications } = useReadAllNotificationsMutation()

	return (
		<Wrapper ref={ref}>
			<Card className='rounded-xl shadow-sm shadow-black/50 dark:shadow-white/50'>
				<Heading className='mb-5'>
					<h3 className='font-semibold'>
						<Text tid='notifications' />
					</h3>

					{!loading && notifications.data.length > 0 ? (
						<button className='text-xs text-cBlue' onClick={readAllNotifications}>
							<Text tid={width > 1024 ? 'mark-all-notifications' : 'read-all'} />
						</button>
					) : (
						<Link to='/notifications' className='text-xs text-cBlue'>
							<Text tid='see-all' />
						</Link>
					)}
				</Heading>

				{loading && (
					<div className='flex items-center justify-center'>
						<ScaleLoader height={18} width={2} color='#0773F1' />
					</div>
				)}

				{!loading && notifications.data.length === 0 && (
					<div className='flex items-center justify-center text-sm pb-5'>
						<Text tid='no-notification' />
					</div>
				)}

				{!loading &&
					notifications?.data?.map((notif) => {
						return (
							<Link
								key={notif._id}
								to={`/notifications`}
								onClick={() => { onNotificationRead(notif._id) }}
								className='block py-2 border-b last:border-b-0 border-borderPrimary dark:border-card-border'
							>
								<Heading className='flex-col lg:flex-row items-start lg:items-center gap-y-2 lg:gap-y-0'>
									<div className='text-sm flex items-center gap-x-2'>
										<FaCircle color='#0773F1' size={8} />
										<h4 className='font-medium dark:text-pColor'>{notif.title}</h4>
									</div>

									<div className='text-xs dark:text-white/50'>
										<span>
											{formatDate(notif.createdAt, 'time', lang === 'en' ? 'en-US' : 'fa-IR', {
												hour: '2-digit',
												minute: '2-digit',
											})}
										</span>
										<span> • </span>
										<span>
											{formatDate(notif.createdAt, 'date', lang === 'en' ? 'en-US' : 'fa-IR')}
										</span>
									</div>
								</Heading>
							</Link>
						)
					})}
			</Card>
		</Wrapper>
	)
})

const Wrapper = styled.div`
	position: absolute;
	top: calc(100% + 1rem);
	left: 0;
	width: 30%;

	@media screen and (max-width: 1024px) {
		width: 60%;
		left: 1rem;
	}
`
