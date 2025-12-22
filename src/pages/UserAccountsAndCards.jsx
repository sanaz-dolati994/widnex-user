import MainLayout from '../components/layouts/MainLayout'
import CardsAndAccounts from '../components/cards-accounts/CardsAndAccounts'
import { useWindowSize } from '../core/hooks/useWindowSize'
import { TABLET_SIZE } from '../core/constants/common'
import RCardsAndAccounts from '../components/responsive/card-and-accounts/RCardsAndAccounts'

const UserAccountsAndCards = () => {
	const { width } = useWindowSize()

	return (
		<MainLayout>{width > TABLET_SIZE ? <CardsAndAccounts /> : <RCardsAndAccounts />}</MainLayout>
	)
}

export default UserAccountsAndCards
