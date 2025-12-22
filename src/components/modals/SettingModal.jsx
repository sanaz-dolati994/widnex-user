import { FaChevronLeft } from 'react-icons/fa'
import { useProfileQuery } from '../../core/services/react-query/useProfileQuery'
import Avatar from '../common/Avatar'
import Text from '../../core/utils/Text'
import { SecurityIcon, VerifyIcon } from '../common/icons'
import { useMainContext } from '../../core/contexts/main'
import { IoIosExit } from 'react-icons/io'
import { useAuthContext } from '../../core/contexts/auth'
import {
    HorizontalLine,
    ItemData,
    ItemRow,
    LinkItemRow,
    Toggler,
} from '../../styles/newStyles/MobileModal.styled'

const statusColors = {
    CREATED: 'text-blue-500 bg-blue-500/10',
    PENDING: 'text-orange-500 bg-orange-500/10',
    VERIFIED: 'text-green-500 bg-green-500/10',
    REJECTED: 'text-red-500 bg-red-500/10',
}

export default function SettingModal() {
    const {
        main: { theme, setTheme },
    } = useMainContext()
    const isDark = theme === 'dark'

    const { data: profile, isFetching: profileLoading } = useProfileQuery()
    const { logout } = useAuthContext()

    const fullname = profile
        ? `${profile.firstName ?? ''} ${profile.lastName ?? ''}`
        : ''

    const handleTogglerClick = () => {
        if (isDark) setTheme('light')
        else setTheme('dark')
    }

    return (
        <div className='flex flex-col gap-y-5'>
            <LinkItemRow to='/profile'>
                <ItemData>
                    <Avatar profile={profile} loading={profileLoading} />
                    <h4 className='text-heading dark:text-pColor font-bold'>
                        {fullname}
                    </h4>
                </ItemData>
                <FaChevronLeft />
            </LinkItemRow>
            <HorizontalLine />

            <ItemRow>
                <ItemData>
                    <VerifyIcon color={theme === 'dark' && '#d9d9d9'} />
                    <Text tid='authentication' />
                </ItemData>
                <Text
                    tid={profile?.status}
                    className={`${
                        statusColors[profile?.status] || ''
                    } px-4 py-1 rounded-lg`}
                />
            </ItemRow>
            <LinkItemRow to='/profile/security'>
                <ItemData>
                    <SecurityIcon color={theme === 'dark' && '#d9d9d9'} />
                    <Text tid='security-settings' />
                </ItemData>
                <FaChevronLeft />
            </LinkItemRow>
            <HorizontalLine />

            <ItemRow>
                <Text tid='dark-mode' className='font-semibold' />

                <Toggler onClick={handleTogglerClick} $isDark={isDark} />
            </ItemRow>
            <HorizontalLine />

            <button
                className='text-red-500 flex items-center gap-x-2'
                onClick={logout}>
                <IoIosExit size={24} />
                <Text tid='logout' />
            </button>
        </div>
    )
}
