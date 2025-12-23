import React, { useEffect, Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useMainContext } from '../core/contexts/main'
import i18next from 'i18next'

// Layouts & Providers
import GlobalLoading from '../components/layouts/loading/GlobalLoading'
import CrispProvider from '../components/layouts/crisp/components/CrispProvider'
import { SocketProvider } from '../core/contexts/socket'
import { SocketContentProvider } from '../core/contexts/socket-content'
import { TradePriceProvider } from '../core/contexts/trade-price'

// Pages
import MainUserDashboard from './NewMainDashboard'
import RegisterPage from './RegisterPage'
import TransactionHistoryPage from './TransactionHistoryPage'
import TransfersHistoryPage from './TransfersHistoryPage'
import UserOtc from './UserOtc'
import UserCurrentOrders from './UserCurrentOrders'
import UserOrdersHistory from './UserOrdersHistory'
import UserOtcHistory from './UserOtcHistory'
import UserAccountsAndCards from './accounts/NewUserAccounts'
import UserTickets from './UserTickets'
import UserNotifications from './NewUserNotifications'
import UserWallets from './NewUserWallet'
import DepositCoin from './wallet/deposit/coin/DepositCoin'
import WithdrawCoin from './wallet/withdraw/coin/WithdrawCoin'
import DepositFiat from './wallet/deposit/fiat/DepositFiat'
import WithdrawFiat from './wallet/withdraw/fiat/WithdrawFiat'
import UserWalletsOperation from './UserWalletsOperation'
import UserAuthentication from './UserAuthentication'
import UserSecurity from './UserSecurity'
import UserProfile from './UserProfile'
import WalletCharts from './WalletCharts'
import UserTrace from './UserTrace'
import Trade from './trade/main/Trade'
import AdvanceTrade from './trade/main/AdvanceTrade'
import StakingMain from '../modules/staking/index'
import StakingDetail from '../modules/staking/components/StakingDetail'
import UserInvite from './UserInvite'
import BankCallback from './BankCallback'

const Index = () => {
	const {
		main: { lang, theme },
		profile: { token },
	} = useMainContext()

	// تنظیم زبان
	useEffect(() => {
		i18next.changeLanguage(lang)
	}, [lang])

	// تنظیم تم
	useEffect(() => {
		if (theme === 'dark') {
			document.documentElement.classList.add('dark')
		} else {
			document.documentElement.classList.remove('dark')
		}
	}, [theme])

	// تعریف همه مسیرهای برنامه
	const routes = [
		{ path: '/current-orders', element: <UserCurrentOrders /> },
		{ path: '/orders-history', element: <UserOrdersHistory /> },
		{ path: '/otc-history', element: <UserOtcHistory /> },
		{ path: '/otc', element: <UserOtc /> },
		{ path: '/accounts-cards', element: <UserAccountsAndCards /> },
		{ path: '/tickets', element: <UserTickets /> },
		{ path: '/notifications', element: <UserNotifications /> },
		{ path: '/wallets', element: <UserWallets /> },
		{ path: '/wallets/:subpage', element: <UserWallets /> },
		{ path: '/transaction-history', element: <TransactionHistoryPage /> },
		{ path: '/transfers-history', element: <TransfersHistoryPage /> },
		{ path: '/wallets/depositCoin', element: <DepositCoin /> },
		{ path: '/wallets/withdrawCoin', element: <WithdrawCoin /> },
		{ path: '/wallets/depositFiat', element: <DepositFiat /> },
		{ path: '/wallets/withdrawFiat', element: <WithdrawFiat /> },
		{ path: '/wallet-operations', element: <UserWalletsOperation /> },
		{ path: '/authentication', element: <UserAuthentication /> },
		{ path: '/security', element: <UserSecurity /> },
		{ path: '/profile', element: <UserProfile /> },
		{ path: '/profile/:subpage', element: <UserProfile /> },
		{ path: '/invite', element: <UserInvite /> },
		{ path: '/callback', element: <BankCallback /> },
		{ path: '/wallet-charts', element: <WalletCharts /> },
		{ path: '/log', element: <UserTrace /> },
		{ path: '/trade', element: <Trade /> },
		{ path: '/trade/advance', element: <AdvanceTrade /> },
		{ path: '/staking', element: <StakingMain /> },
		{ path: '/staking/:id', element: <StakingDetail /> },
		{ path: '/staking-history', element: <StakingMain /> },
	]

	return (
		<Suspense fallback={<GlobalLoading />}>
			<CrispProvider>
				<SocketProvider>
					<SocketContentProvider>
						<TradePriceProvider>
							{token ? (
								<Routes>
									<Route index path='/dashboard' element={<MainUserDashboard />} />
									{routes.map((route) => (
										<Route key={route.path} path={route.path} element={route.element} />
									))}
									<Route path='*' element={<Navigate to='/dashboard' replace />} />
								</Routes>
							) : (
								<Routes>
									<Route path='/register-signin' element={<RegisterPage />} />
									<Route path='*' element={<Navigate to='/register-signin?mode=login' replace />} />
								</Routes>
							)}
						</TradePriceProvider>
					</SocketContentProvider>
				</SocketProvider>
			</CrispProvider>
		</Suspense>
	)
}

export default Index
