import { lazy, Suspense, useEffect, useState } from 'react'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import { useMainContext } from '../core/contexts/main'
import i18next from 'i18next'
import UserInvite from './UserInvite'
import GlobalLoading from '../components/layouts/loading/GlobalLoading'
import BankCallback from './BankCallback'
import CrispProvider from '../components/layouts/crisp/components/CrispProvider'
import TransactionHistoryPage from './TransactionHistoryPage'
import UserOtc from './UserOtc'
import { SocketProvider } from '../core/contexts/socket'
import { SocketContentProvider } from '../core/contexts/socket-content'
import { TradePriceProvider } from '../core/contexts/trade-price'
import TransfersHistoryPage from './TransfersHistoryPage'
// import RegisterPage from './RegisterPage'

const UserCurrentOrders = lazy(() => import('./UserCurrentOrders'))
// const RegisterSignIn = lazy(() => import('./RegisterSignIn'))
const RegisterPage = lazy(() => import('./RegisterPage'))
const UserOrdersHistory = lazy(() => import('./UserOrdersHistory'))
const UserOtcHistory = lazy(() => import('./UserOtcHistory'))
const UserTransactionHistory = lazy(() => import('./UserTransactionHistory'))
const UserAccountsAndCards = lazy(() => import('./accounts/NewUserAccounts'))
const UserTickets = lazy(() => import('./UserTickets'))
// const UserNotifications = lazy(() => import('./UserNotifications'))
const UserNotifications = lazy(() => import('./NewUserNotifications'))
const UserWallets = lazy(() => import('./NewUserWallet'))
const DepositCoin = lazy(() => import('./wallet/deposit/coin/DepositCoin'))
const WithdrawCoin = lazy(() => import('./wallet/withdraw/coin/WithdrawCoin'))
const DepositFiat = lazy(() => import('./wallet/deposit/fiat/DepositFiat'))
const WithdrawFiat = lazy(() => import('./wallet/withdraw/fiat/WithdrawFiat'))
const UserWalletsOperation = lazy(() => import('./UserWalletsOperation'))
const UserAuthentication = lazy(() => import('./UserAuthentication'))
const UserSecurity = lazy(() => import('./UserSecurity'))
const MainUserDashboard = lazy(() => import('./NewMainDashboard'))
const UserProfile = lazy(() => import('./UserProfile'))
const WalletCharts = lazy(() => import('./WalletCharts'))
const UserTrace = lazy(() => import('./UserTrace'))
const Trade = lazy(() => import('./trade/main/Trade'))
const AdvanceTrade = lazy(() => import('./trade/main/AdvanceTrade'))

const TempWallet = lazy(() => import('./wallet/NewUserWallet'))
const StakingMain = lazy(() => import('../modules/staking/index'))
const StakingDetail = lazy(() => import('../modules/staking/components/StakingDetail'))

const Index = () => {
	const {
		main: { lang, theme },
		profile: { token },
	} = useMainContext()

	useEffect(() => {
		i18next.changeLanguage(lang)
		//eslint-disable-next-line
	}, [])

	useEffect(() => {
		if (theme === 'dark') {
			document.documentElement.classList.add('dark')
		} else {
			document.documentElement.classList.remove('dark')
		}
	}, [theme])

	return (
		<Router basename={process.env.PUBLIC_URL}>
			<Suspense fallback={<GlobalLoading />}>
				<CrispProvider>
					<SocketProvider>
						<SocketContentProvider>
							<TradePriceProvider>
								{token ? (
									<Routes>
										<Route index path='/dashboard' element={<MainUserDashboard />} />

										{routes.map((route) => (
											<Route path={route.path} element={route.element} />
										))}

										<Route path='*' element={<Navigate to='/dashboard' replace />} />
									</Routes>
								) : (
									<Routes>
										<Route
											path='/register-signin'
											element={
												// <RegisterSignIn />
												<RegisterPage />
											}
										/>
										<Route
											path='*'
											element={<Navigate to='/register-signin?mode=login' replace />}
										/>
									</Routes>
								)}
							</TradePriceProvider>
						</SocketContentProvider>
					</SocketProvider>
				</CrispProvider>
			</Suspense>
		</Router>
	)
}

const routes = [
	{ path: '/current-orders', element: <UserCurrentOrders /> },
	{ path: '/orders-history', element: <UserOrdersHistory /> },
	{ path: '/otc-history', element: <UserOtcHistory /> },
	{ path: '/otc', element: <UserOtc /> },
	// { path: '/transaction-history', element: <UserTransactionHistory /> },
	{ path: '/accounts-cards', element: <UserAccountsAndCards /> },
	{ path: '/tickets', element: <UserTickets /> },
	// { path: '/notifications', element: <UserNotifications /> },
	{ path: '/notifications', element: <UserNotifications /> },
	{ path: '/wallets_old', element: <TempWallet /> },
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

export default Index
