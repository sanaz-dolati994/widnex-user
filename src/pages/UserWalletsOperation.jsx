import MainLayout from '../components/layouts/MainLayout'
import { useWindowSize } from '../core/hooks/useWindowSize'
import { TABLET_SIZE } from '../core/constants/common'
import RWalletOperations from '../components/responsive/user-wallet/RWalletOperations'
import WalletsOperation from '../components/my-wallets/WalletOperation'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useWalletContext } from '../core/contexts/wallet'

const UserWalletsOperation = () => {
	const { width } = useWindowSize()

	const { wallet, setWallet } = useWalletContext()

	const search = new URLSearchParams(useLocation().search)
	const opType = search.get('type')

	useEffect(() => {
		if (opType && wallet.op !== opType) setWallet((state) => ({ ...state, op: opType }))
	}, [opType])

	return (
		<MainLayout>{width > TABLET_SIZE ? <WalletsOperation /> : <RWalletOperations />}</MainLayout>
	)
}

export default UserWalletsOperation
