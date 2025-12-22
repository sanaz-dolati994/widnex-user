import { useEffect, useRef, useState } from 'react'
// import MainLayout from '../components/layouts/MainLayout'
import NewLayout from '../components/layouts/NewLayout'
import { useWindowSize } from '../core/hooks/useWindowSize'
import UserTraceTable from '../components/trace/UserTraceTable'
import RUserTraceTable from '../components/trace/RUserTraceTable'
import {
	BalancesIcon,
	DepositIcon,
	DocumentIcon,
	HistoryIcon,
	InternalTransferIcon,
	WithdrawIcon,
} from '../components/common/icons'
import Text from '../core/utils/Text'
import { ItemData, LinkItemRow } from '../styles/newStyles/MobileModal.styled'
import Card from '../components/common/Card'

const SUBNAV = [
	{ href: '/wallets', tid: 'your-balances', Icon: BalancesIcon },
	{ href: '/wallets/deposit', tid: 'deposit-wallet', Icon: DepositIcon },
	{ href: '/wallets/withdraw', tid: 'withdraw-wallet', Icon: WithdrawIcon },
	{ href: '/wallets/internal-transfer', tid: 'internal-transfer', Icon: InternalTransferIcon },
	{
		href: '/transaction-history',
		tid: 'accounts-history',
		Icon: HistoryIcon,
	},
	{
		href: '/transfers-history',
		tid: 'transfers-history',
		Icon: HistoryIcon,
	},
	{ href: '/log', Icon: DocumentIcon, tid: 'log' },
]

const UserTrace = () => {
	const { width } = useWindowSize()
	const ActiveComp = width > 1024 ? UserTraceTable : RUserTraceTable

	const [activeLinkIndex, setActiveLinkIndex] = useState(6)

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
						className={`text-sm hover:bg-gray-light dark:hover:bg-white/10 transition rounded-lg px-4 ${index === activeLinkIndex ? 'bg-gray-light dark:bg-white/10' : ''
							}`}
					>
						<ItemData className='text-sm'>
							<Icon color={index === activeLinkIndex && '#0773F1'} />
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
			<div className={`grid grid-cols-1 lg:grid-cols-5 lg:gap-4 lg:h-full`}>
				<Card
					className={`${width < 1024
						? 'flex items-end flex-nowrap gap-x-4 py-4 overflow-x-scroll no-scrollbar'
						: 'col-span-1 space-y-4 self-start '
						}`}
				>
					{renderedItems}
				</Card>

				<Card className='col-span-4 relative lg:overflow-y-auto' padding='px-0 py-5'>
					<ActiveComp />
				</Card>
			</div>
		</NewLayout>
	)
}

export default UserTrace
