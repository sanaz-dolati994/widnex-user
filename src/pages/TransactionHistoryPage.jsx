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
import { HorizontalLine, ItemData, LinkItemRow } from '../styles/newStyles/MobileModal.styled'
import Card from '../components/common/Card'
import { useWindowSize } from '../core/hooks/useWindowSize'
import NewTransactionHistory from '../components/transactions/NewTransactionHistory'
import RNewTransactionHistory from '../components/responsive/transactions/RNewTransactionHistory'

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

export default function TransactionHistoryPage() {
	const [activeTab, setActiveTab] = useState(0)
	const [config, setConfig] = useState({ type: 'bank', flow: 'withdraw' })
	const tabRefs = useRef([]);

	const { width } = useWindowSize()

	const [activeLinkIndex, setActiveLinkIndex] = useState(4)

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
						to={href}
						ref={(el) => (tabRefs.current[index] = el)}
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

	const handleTabChange = (index) => {
		if (index === 0) {
			setConfig({ type: 'bank', flow: 'withdraw' })
		} else if (index === 1) {
			setConfig({ type: 'wallet', flow: 'withdraw' })
		} else if (index === 2) {
			setConfig({ type: 'bank', flow: 'deposit' })
		} else if (index === 3) {
			setConfig({ type: 'wallet', flow: 'deposit' })
		}

		setActiveTab(index)
	}

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


				<Card className='col-span-4 relative lg:overflow-x-hidden'>
					<h2 className='font-semibold'>
						<Text tid='transaction-list' />
					</h2>
					<div className='flex items-center justify-start gap-x-8 mt-4 overflow-x-scroll whitespace-nowrap lg:whitespace-normal no-scrollbar'>
						<TabBar activeTab={activeTab} onTabChange={handleTabChange} />

					</div>
					<HorizontalLine />
					{width > 1024 ? (
						<NewTransactionHistory {...config} />
					) : (
						<RNewTransactionHistory {...config} />
					)}
				</Card>
			</div>
		</NewLayout>
	)
}

const TABS = [
	// 'all-transactions',
	'withdrawIrt',
	'withdrawCoin',
	'depositIrt',
	'depositCoin',
]

const TabBar = ({ onTabChange, activeTab }) => {
	return TABS.map((tab, index) => {
		return (
			<h3
				key={tab}
				className={`${activeTab === index ? 'text-cBlue border-cBlue' : 'border-transparent'
					} cursor-pointer border-b-2 transition pb-2 flex-1 text-center lg:flex-none`}
				onClick={onTabChange.bind(null, index)}
			>
				<Text tid={tab} />
			</h3>
		)
	})
}
