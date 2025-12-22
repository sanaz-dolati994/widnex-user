import TransactionHistory from '../components/transactions/TransactionHistory'
import MainLayout from '../components/layouts/MainLayout'
import RTransactionHistory from '../components/responsive/transactions/RTransactionHistory'
import { TABLET_SIZE } from '../core/constants/common'
import { useWindowSize } from '../core/hooks/useWindowSize'

const UserTransactionHistory = () => {
	const { width } = useWindowSize()

	return (
		<MainLayout>
			{width > TABLET_SIZE ? <TransactionHistory /> : <RTransactionHistory />}
		</MainLayout>
	)
}

export default UserTransactionHistory
