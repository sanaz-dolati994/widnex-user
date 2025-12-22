import MainLayout from '../../components/layouts/MainLayout'
import UserAccountsComp from './UserAccountsComp'
import AuthReminderModal from '../../components/modals/AuthReminderModal'

const NewUserAccounts = () => {
    return (
        <MainLayout scrollY>
            <UserAccountsComp />
            <AuthReminderModal />
        </MainLayout>
    )
}

export default NewUserAccounts
