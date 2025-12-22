import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
	BadgeIcon,
	BalancesIcon,
	DashboardIcon,
	NotificationIcon,
	OtcTradeIcon,
	ProfileIcon,
	StakeIcon,
	// SettingsIcon,
	SpotTradeIcon,
} from '../common/icons'
import Text from '../../core/utils/Text'
import { PiUserFocus } from 'react-icons/pi'
import { HOME } from '../../core/constants/urls'
import { useUnreadNotificationQuery } from '../../core/services/react-query/useNotificationsQuery'

export default function NewSidebar({
	isSidebarExpanded,
	toggleSidebar,
	openSideBar,
	closeSideBar,
}) {
	const [activeLinkIndex, setActiveLinkIndex] = useState(-1)
	const { pathname } = useLocation()

	useEffect(() => {
		if (pathname === '/dashboard') setActiveLinkIndex(0)
		else if (pathname === '/otc') setActiveLinkIndex(1)
		else if (pathname === '/authentication') setActiveLinkIndex(2)
		else if (
			pathname.startsWith('/wallets') ||
			pathname === '/transaction-history' ||
			pathname === '/log'
		)
			setActiveLinkIndex(4)
		else if (pathname.startsWith('/profile')) setActiveLinkIndex(6)
		else if (pathname === '/notifications') setActiveLinkIndex(7)
		else if (pathname === '/staking') setActiveLinkIndex(5)
	}, [pathname])

	const { data: notifications, isFetching: notificationsLoading } = useUnreadNotificationQuery(1)

	const renderedItems = LINKS.map((item, index) => {
		const { Icon } = item
		const NotificationIcon =
			!notificationsLoading && notifications?.data?.length > 0 ? (
				<div className='relative'>
					<Icon color={activeLinkIndex === index ? '#0773F1' : '#A6A9B9'} />
					<div className='absolute top-0 right-0 animate-pulse'>
						<BadgeIcon size={11} />
					</div>
				</div>
			) : (
				<Icon color={activeLinkIndex === index ? '#0773F1' : '#A6A9B9'} />
			)

		return (
			<li
				key={item.text}
				className={`flex items-center ${isSidebarExpanded ? 'justify-start' : 'justify-center'}  ${activeLinkIndex !== index ? 'hover:bg-white/5' : ''
					}
                ${isSidebarExpanded && activeLinkIndex === index ? 'bg-white/5' : ''}`}
			>
				<Link
					to={item.href}
					className={activeLinkIndex === index && !isSidebarExpanded ? 'bg-white/5 rounded-lg' : ''}
				>
					{item.text === 'notifications' ? (
						NotificationIcon
					) : (
						<Icon color={activeLinkIndex === index ? '#0773F1' : '#A6A9B9'} />
					)}
					{isSidebarExpanded && <Text tid={item.text} />}
				</Link>
			</li>
		)
	})

	return (
		<Sidebar
			className={`bg-sidebar ${isSidebarExpanded ? 'expanded' : 'collapsed'}`}
			onMouseEnter={openSideBar}
			onMouseLeave={closeSideBar}
		>
			<div className='h-16'>
				{isSidebarExpanded ? (
					<a href={HOME}>
						<img
							src={require(`../../assets/newImages/logo-dark.png`)}
							alt='ویدنکس'
							className='w-1/2 h-auto mx-auto my-4'
						/>
					</a>
				) : (
					<button className='toggle-button' onClick={toggleSidebar}>
						<img
							src={require('../../assets/newImages/toggler.png')}
							alt='Widnex - Toggle Sidebar'
						/>
					</button>
				)}
			</div>
			<nav>
				<ul>{renderedItems}</ul>
			</nav>
		</Sidebar>
	)
}

const Sidebar = styled.aside`
	position: fixed;
	top: 1rem;
	right: 1rem;
	height: calc(100% - 2rem);
	color: white;
	transition: width 0.3s;
	z-index: 200;
	border-radius: 20px;

	&.expanded {
		width: 320px;
	}

	&.collapsed {
		width: 96px;
	}

	.toggle-button {
		cursor: pointer;
		margin: 1rem auto;
		display: flex;
		align-items: center;
	}

	nav ul {
		list-style-type: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		row-gap: 5px;
	}

	nav ul li a {
		display: flex;
		align-items: center;
		padding: 15px;
		cursor: pointer;
		gap: 5px;
		font-size: 0.8rem;
		transition: all 0.1s ease-in-out;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	nav ul li {
		transition: background-color 0.3s;
	}

	.icon {
		margin-left: 10px;
	}
`

const AuthenticationIcon = styled(PiUserFocus)`
	width: 24px;
	height: 24px;
`

export const LINKS = [
	{ text: 'dashboard', Icon: DashboardIcon, href: '/dashboard' },
	{ text: 'otc-trade', Icon: OtcTradeIcon, href: '/otc' },
	{ text: 'authentication', Icon: AuthenticationIcon, href: '/authentication' },
	{ text: 'spot-trade', Icon: SpotTradeIcon, href: '/trade' },
	{ text: 'your-balances', Icon: BalancesIcon, href: '/wallets' },
	{ text: 'staking', Icon: StakeIcon, href: '/staking' },
	{ text: 'user-profile', Icon: ProfileIcon, href: '/profile' },
	{ text: 'notifications', Icon: NotificationIcon, href: '/notifications' },
	// { text: 'account-settings', Icon: SettingsIcon, href: '#' },
]
