import { useEffect, useRef, useState } from 'react'
import Card from '../components/common/Card'
import NewLayout from '../components/layouts/NewLayout'
import NewProfile from '../components/NewProfile'
import Text from '../core/utils/Text'
import { ItemData, LinkItemRow } from '../styles/newStyles/MobileModal.styled'
import { useWindowSize } from '../core/hooks/useWindowSize'
import { useLocation } from 'react-router-dom'
import {
	CardsIcon,
	ContactsIcon,
	InviteFriendsIcon,
	SecurityIcon2,
	// SettingsIcon2,
	UserEditIcon,
} from '../components/common/icons'
import UserSecurity from './UserSecurity'
// import UserSettings from './UserSettings'
import NewUserInvite from './NewUserInvite'
import RNewUserInvite from '../components/responsive/user-invite/RNewUserInvite'
import UserCardsAndAccounts from './UserCardsAndAccounts'
import UserContacts from './UserContacts'
// import MainLayout from '../components/layouts/MainLayout'

const SUBNAV = [
	{ href: '/profile', tid: 'account-overview', Icon: UserEditIcon },
	{ href: '/profile/cards&accounts', tid: 'cards-accounts', Icon: CardsIcon },
	{ href: '/profile/contacts', tid: 'contacts', Icon: ContactsIcon },
	{ href: '/profile/security', tid: 'account-security', Icon: SecurityIcon2 },
	// { href: '/profile/settings', tid: 'account-settings', Icon: SettingsIcon2 },
	{
		href: '/profile/invite-friends',
		tid: 'invite-friends',
		Icon: InviteFriendsIcon,
	},
]

const UserProfile = () => {
	const { pathname } = useLocation()
	const { width } = useWindowSize()

	let ActiveSubpage = NewProfile
	switch (pathname) {
		case '/profile/cards&accounts':
			ActiveSubpage = UserCardsAndAccounts
			break
		case '/profile/contacts':
			ActiveSubpage = UserContacts
			break
		case '/profile/security':
			ActiveSubpage = UserSecurity
			break
		// case '/profile/settings':
		// 	ActiveSubpage = UserSettings
		// 	break
		case '/profile/invite-friends':
			ActiveSubpage = width > 1024 ? NewUserInvite : RNewUserInvite
			break
		default:
			ActiveSubpage = NewProfile
	}

	useEffect(() => {
		switch (pathname) {
			case '/profile':
				setActiveLinkIndex(0)
				break
			case '/profile/cards&accounts':
				setActiveLinkIndex(1)
				break
			case '/profile/contacts':
				setActiveLinkIndex(2)
				break
			case '/profile/security':
				setActiveLinkIndex(3)
				break
			// case '/profile/settings':
			// 	setActiveLinkIndex(4)
			// 	break
			case '/profile/invite-friends':
				setActiveLinkIndex(4)
				break
			default:
				setActiveLinkIndex(5)
		}
	}, [pathname])

	const initialActiveLinkIndex = () => {
		switch (pathname) {
			case '/profile':
				return 0
			case '/profile/cards&accounts':
				return 1
			case '/profile/contacts':
				return 2
			case '/profile/security':
				return 3
			// case '/profile/settings':
			// 	return 4
			case '/profile/user-invites':
				return 4
			default:
				return 0
		}
	}
	const [activeLinkIndex, setActiveLinkIndex] = useState(initialActiveLinkIndex)

	const tabRefs = useRef([]);

	useEffect(() => {
		if (width < 1024 && tabRefs.current[activeLinkIndex]) {
			tabRefs.current[activeLinkIndex]?.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest',
				inline: 'start',
			});
		}
	}, [activeLinkIndex, width]);

	const renderedItems =
		width > 1024
			? SUBNAV.map((navItem, index) => {
				const { href, Icon, tid } = navItem
				return (
					<LinkItemRow
						key={tid}
						to={href}
						onClick={setActiveLinkIndex.bind(null, index)}
						className={`text-sm hover:bg-gray-light dark:hover:bg-white/10 transition rounded-lg px-4 ${activeLinkIndex === index ? 'bg-gray-light dark:bg-white/10' : ''
							}`}
					>
						<ItemData className='text-sm'>
							<Icon color={activeLinkIndex === index && '#0773F1'} />
							<Text tid={tid} />
						</ItemData>
					</LinkItemRow>
				)
			})
			: SUBNAV.map((navItem, index) => {
				const { href, tid } = navItem

				return (
					<LinkItemRow
						key={tid}
						ref={(el) => (tabRefs.current[index] = el)}
						to={href}
						onClick={setActiveLinkIndex.bind(null, index)}
						className={`bg-gray-secondary dark:bg-white/5 ${activeLinkIndex === index
							? 'text-cBlue bg-gray-light dark:bg-white/5'
							: 'text-heading dark:text-pColor'
							} text-sm px-4 py-2 rounded-full shrink-0 inline-block`}
					>
						<ItemData>
							<Text tid={tid} />
						</ItemData>
					</LinkItemRow>
				)
			})
	return (
		<NewLayout>
			<div className={`grid grid-cols-1 lg:grid-cols-4 lg:gap-4 lg:h-full`}>
				<Card
					className={`${width < 1024
						? 'flex items-end flex-nowrap gap-x-4 py-4 overflow-x-scroll no-scrollbar'
						: 'col-span-1 space-y-4 self-start '
						}`}
				>
					{renderedItems}
				</Card>

				<ActiveSubpage />
			</div>
		</NewLayout>
	)
}

export default UserProfile
