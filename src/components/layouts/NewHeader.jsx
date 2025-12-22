import { Link, useLocation } from 'react-router-dom'

import { HOME } from '../../core/constants/urls'
import { useWindowSize } from '../../core/hooks/useWindowSize'
import { useMainContext } from '../../core/contexts/main'
import { useProfileQuery } from '../../core/services/react-query/useProfileQuery'

import ThemeToggler from '../common/Toggler'
import { BadgeIcon, BalancesIcon, NotificationIcon, TriangleIcon } from '../common/icons'
import Avatar from '../common/Avatar'

import { Header, VerticalLine } from '../../styles/newStyles/Header.styled'
import { useUnreadNotificationQuery } from '../../core/services/react-query/useNotificationsQuery'
import { useRef, useState } from 'react'
import useClickOutside from '../../core/hooks/useClickOutside'
import { NotificationDropdown } from '../modals/NewNotificationDropdown'
import { ProfileDropdown } from '../modals/NewProfileDropdown'

export default function NewHeader({ isSidebarExpanded, setIsModalOpen, showSidebar }) {
	const [notificationDropdown, setNotificationDropdown] = useState(false)
	const [profileDropdown, setProfileDropdown] = useState(false)

	const notificationRef = useRef()
	useClickOutside(notificationRef, () => setNotificationDropdown(false))

	const profileRef = useRef()
	useClickOutside(profileRef, () => setProfileDropdown(false))

	const { pathname } = useLocation()
	const {
		main: { theme },
	} = useMainContext()
	const { width } = useWindowSize()
	const { data: profile, isFetching: profileLoading } = useProfileQuery()
	const {
		data: notifications,
		isFetching: notificationsLoading,
		refetch: refetchUnreadNotifications,
	} = useUnreadNotificationQuery(1)

	let currentLocation = ''
	if (pathname === '/dashboard') currentLocation = 'داشبورد کاربری'
	else if (pathname === '/otc') currentLocation = 'خرید و فروش آنی'
	else if (
		pathname.startsWith('/wallets') ||
		pathname === '/transaction-history' ||
		pathname === '/log'
	)
		currentLocation = 'دارایی های شما'
	else if (pathname.startsWith('/profile')) currentLocation = 'حساب کاربری'
	else if (pathname === '/authentication') currentLocation = 'احراز هویت'
	else if (pathname === '/notifications') currentLocation = 'پیام های شما'
	else if (pathname.includes('staking')) currentLocation = 'گنجینه سرمایه'

	const iconColor = theme === 'dark' ? '#D9D9D9' : '#2E3344'

	return (
		<Header
			dir='rtl'
			className={`bg-white dark:bg-dark shadow-md dark:border-card-border border ${
				isSidebarExpanded && showSidebar ? 'expanded' : 'collapsed'
			}`}
		>
			<div className='relative flex items-center justify-between w-full'>
				{width > 1024 ? (
					<h2>{currentLocation}</h2>
				) : (
					<a href={HOME} className='block'>
						<img
							src={require(`../../assets/newImages/logo-${theme}.png`)}
							alt='صرافی ویدنکس'
							className='block w-24 h-auto'
						/>
					</a>
				)}

				<div
					className={`flex items-center gap-x-4 ${width <= 1024 && 'flex-row-reverse'} relative`}
				>
					<div className='cursor-pointer' onClick={() => setProfileDropdown(true)}>
						<Avatar profile={profile} loading={profileLoading} />
					</div>

					{profileDropdown && (
						<ProfileDropdown
							ref={profileRef}
							profile={profile}
							loading={profileLoading}
							onClose={setProfileDropdown.bind(null, false)}
						/>
					)}

					{width > 1024 && (
						<>
							<VerticalLine className='bg-gray-light' />

							<Link to='/wallets'>
								<BalancesIcon color={iconColor} />
							</Link>

							<VerticalLine className='bg-gray-light' />
						</>
					)}

					<div className='relative cursor-pointer' onClick={() => setNotificationDropdown(true)}>
						<NotificationIcon color={iconColor} />
						{!notificationsLoading && notifications?.data?.length > 0 ? (
							<div className='absolute -top-1 -right-1'>
								<BadgeIcon size={18} />
								<span className='absolute z-10 top-1/2 left-1/2 transfrom -translate-y-1/2 -translate-x-1/2 text-[10px] text-white'>
									{notifications?.data?.length}
								</span>
							</div>
						) : null}

						{notificationDropdown && (
							<div className='absolute top-[200%] z-10'>
								<TriangleIcon
									color={theme === 'dark' ? '#151B2B' : '#fff'}
									className='shadow-sm shadow-black/50 dark:shadow-white/50'
								/>
							</div>
						)}
					</div>

					{width > 1024 && <ThemeToggler />}
				</div>

				{notificationDropdown && (
					<NotificationDropdown
						ref={notificationRef}
						notifications={notifications}
						loading={notificationsLoading}
						onReadANotification={() => refetchUnreadNotifications()}
					/>
				)}
			</div>
		</Header>
	)
}
