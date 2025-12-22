import { useEffect, useRef, useState } from 'react'
import {
	BalancesIcon,
	DepositIcon,
	DocumentIcon,
	HistoryIcon,
	InternalTransferIcon,
	WithdrawIcon,
} from '../components/common/icons'
import NewLayout from '../components/layouts/NewLayout'
import Text from '../core/utils/Text'
import { ItemData, LinkItemRow } from '../styles/newStyles/MobileModal.styled'
import Card from '../components/common/Card'
import { useWindowSize } from '../core/hooks/useWindowSize'
import DepositSubpage from './wallet/deposit/DepositSubpage'
import WithdrawSubpage from './wallet/withdraw/WithdrawSubpage'
import BalancesSubpage from '../components/balances/BalancesSubpage'
import { useLocation, useParams } from 'react-router-dom'
import InternalTransferSubpage from '../components/internal-transfer/InternalTransferSubpage'

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

export default function NewUserWallet() {
	const params = useParams()
	const { pathname } = useLocation()

	useEffect(() => {
		switch (pathname) {
			case '/wallets':
				setActiveLinkIndex(0)
				break
			case '/wallets/deposit':
				setActiveLinkIndex(1)
				break
			case '/wallets/withdraw':
				setActiveLinkIndex(2)
				break
			case '/wallets/internal-transfer':
				setActiveLinkIndex(3)
				break
			default:
				setActiveLinkIndex(0)
		}
	}, [pathname])

	const { width } = useWindowSize()

	const initialActiveLinkIndex = () => {
		switch (pathname) {
			case '/wallets':
				return 0
			case '/wallets/deposit':
				return 1
			case '/wallets/withdraw':
				return 2
			case '/wallets/internal-transfer':
				return 3
			default:
				return 0
		}
	}
	const [activeLinkIndex, setActiveLinkIndex] = useState(initialActiveLinkIndex)

	const Subpages = [BalancesSubpage, DepositSubpage, WithdrawSubpage, InternalTransferSubpage]
	let ActiveSubpage = Subpages[activeLinkIndex]

	const GridCols = {
		balances: 'lg:grid-cols-5 lg:gap-4',
		deposit: 'lg:grid-cols-6 lg:gap-4',
		withdraw: 'lg:grid-cols-6 lg:gap-4',
		'internal-transfer': 'lg:grid-cols-6 lg:gap-4',
	}

	const tabRefs = useRef([]);

	useEffect(() => {
		if (activeLinkIndex < 4 && width < 1024 && tabRefs.current[activeLinkIndex]) {
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
				const { href, Icon, tid } = navItem;
				return (
					<LinkItemRow
						key={tid}
						to={href}
						onClick={() => setActiveLinkIndex(index)}
						className={`text-sm hover:bg-gray-light dark:hover:bg-white/10 transition rounded-lg px-4 ${activeLinkIndex === index ? 'bg-gray-light dark:bg-white/10' : ''}`}
					>
						<ItemData className='text-sm'>
							<Icon color={activeLinkIndex === index ? '#0773F1' : undefined} />
							<Text tid={tid} />
						</ItemData>
					</LinkItemRow>
				);
			})
			: SUBNAV.map((navItem, index) => {
				const { href, tid } = navItem;

				return (
					<LinkItemRow
						key={tid}
						ref={(el) => (tabRefs.current[index] = el)}
						to={href}
						onClick={() => setActiveLinkIndex(index)}
						className={`bg-gray-secondary dark:bg-white/5 ${activeLinkIndex === index ? 'text-cBlue bg-gray-light dark:bg-white/5' : 'text-heading dark:text-pColor'
							} text-sm px-4 py-2 rounded-full shrink-0 inline-block`}
					>
						<ItemData>
							<Text tid={tid} />
						</ItemData>
					</LinkItemRow>
				);
			});

	return (
		<NewLayout>
			<div
				className={`grid  grid-cols-1 ${GridCols[params.subpage || 'balances']} lg:h-full ${activeLinkIndex === 0 ? 'lg:grid-rows-5 lg:gap-y-4' : ''
					}`}
			>
				<Card
					className={`${width < 1024
						? 'flex items-end flex-nowrap gap-x-4 py-4 overflow-x-scroll no-scrollbar'
						: 'col-span-1 space-y-4 self-start'
						}`}
				>
					{renderedItems}
				</Card>
				<ActiveSubpage />
			</div>
		</NewLayout>
	)
}
