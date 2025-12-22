import styled from 'styled-components'
import {
	BalancesIcon,
	BottomBarBalancesIcon,
	BottomBarSettingsIcon,
	ChartIcon,
	DashboardIcon,
	TradeIcon,
} from '../common/icons'
import { Link, useLocation } from 'react-router-dom'
import Text from '../../core/utils/Text'
import MobileModal from '../modals/MobileModal'
import { useEffect, useState } from 'react'
import SettingModal from '../modals/SettingModal'
import TradeModal from '../modals/TradeModal'
import { useMainContext } from '../../core/contexts/main'
import MenuModal from '../modals/MenuModal'

const LINKS = [
	{ text: 'menu', Icon: DashboardIcon, href: '#' },
	{ text: 'transactions', Icon: ChartIcon, href: '/transaction-history' },
	{ text: 'trade', Icon: TradeIcon, href: '#' },
	{ text: 'your-balance', Icon: BottomBarBalancesIcon, href: '/wallets' },
	{ text: 'settings', Icon: BottomBarSettingsIcon, href: '#' },
]

export default function NewBottomBar() {
	const {
		main: { theme },
	} = useMainContext()

	const [activeTab, setActiveTab] = useState(0)

	const initialModal = { type: null, open: false }
	const [modal, setModal] = useState(initialModal)

	const openModal = (type) => setModal({ type, open: true })
	const closeModal = () => setModal(initialModal)

	const { pathname } = useLocation()

	useEffect(() => {
		if (pathname === '/dashboard') setActiveTab(0)
		else if (pathname === '/otc' || pathname.includes('trade')) setActiveTab(2)
		else if (pathname.startsWith('/wallets') || pathname === '/log') setActiveTab(3)
		else if (pathname === '/transaction-history') setActiveTab(1)
	}, [pathname])

	return (
		<BottomNav className='bg-white dark:bg-dark border-t dark:border-t-black/20' dir='rtl'>
			<ul className='w-full flex justify-between'>
				{LINKS.map((item, index) => {
					const { Icon } = item

					if (item.text === 'trade')
						return (
							<li key={item.text} className='w-1/4' onClick={openModal.bind(null, 'trade')}>
								<Link to={item.href} className='w-full h-full flex justify-center items-center'>
									<div className='bg-heading p-2 rounded-lg'>
										<Icon
											color={
												activeTab === index ? '#0773F1' : theme === 'dark' ? '#d9d9d9' : '#FFFFFF'
											}
										/>
									</div>
								</Link>
							</li>
						)

					if (item.text === 'settings' || item.text === 'menu')
						return (
							<li key={item.text} className='w-1/4' onClick={openModal.bind(null, item.text)}>
								<Link
									to={item.href}
									className='w-full h-full flex flex-col justify-around items-center'
								>
									<Icon
										color={
											activeTab === index ? '#0773F1' : theme === 'dark' ? '#ffffff50' : '#191D3180'
										}
									/>
									<Text
										tid={item.text}
										className={`text-sm ${
											activeTab === index ? 'text-cBlue' : 'text-heading/80 dark:text-white/50'
										}`}
									/>
								</Link>
							</li>
						)

					return (
						<li key={item.text} className='w-1/4'>
							<Link
								to={item.href}
								className='w-full h-full flex flex-col justify-around items-center'
							>
								<Icon
									color={
										activeTab === index ? '#0773F1' : theme === 'dark' ? '#ffffff50' : '#191D3180'
									}
								/>
								<Text
									tid={item.text}
									className={`text-sm ${
										activeTab === index ? 'text-cBlue' : 'text-heading/80 dark:text-white/50'
									}`}
								/>
							</Link>
						</li>
					)
				})}
			</ul>

			<MobileModal isOpen={modal.open} onClose={closeModal}>
				{modal.type === 'settings' && <SettingModal />}
				{modal.type === 'menu' && <MenuModal />}
				{modal.type === 'trade' && <TradeModal />}
			</MobileModal>
		</BottomNav>
	)
}
const BottomNav = styled.nav`
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 80px;
	color: white;
	display: flex;
	justify-content: space-around;
	padding: 10px 0;
	z-index: 40;
`
