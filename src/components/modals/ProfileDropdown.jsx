import { forwardRef } from 'react'
import { ScaleLoader } from 'react-spinners'
import { TABLET_SIZE } from '../../core/constants/common'
import { Flex } from '../../styles/CommonStyles'
import {
    Avatar,
    Balance,
    DropBody,
    FlexColumn,
    Image,
    MText,
    Profile,
    ProfileItem,
} from '../../styles/layout-styles/HeaderStyles'
import Text from '../../core/utils/Text'
import {
    FaUser,
    FaCoins,
    FaHistory,
    FaUnlockAlt,
    FaUsers,
    FaSignOutAlt,
} from 'react-icons/fa'
import { formatNumber } from '../../core/utils/common'

const profileItems = [
    { title: 'accountOverview', path: '/dashboard', icon: FaUser },
    { title: 'transactions', path: '/transaction-history', icon: FaCoins },
    { title: 'accountActivity', path: '/security', icon: FaHistory },
    { title: 'twoFacAut', path: '/security', icon: FaUnlockAlt },
    { title: 'referFriends', path: '/invite', icon: FaUsers },
]

export const ProfileDropdown = forwardRef((props, ref) => {
    const { profile, width, onProfileItemsClicked } = props

    return (
        <DropBody minWidth='250px' style={{ padding: '20px' }} ref={ref}>
            {profile && (
                <>
                    <Flex>
                        <Profile size={width < TABLET_SIZE ? '34px' : '42px'}>
                            {profile?.avatar ? (
                                <Image
                                    src={profile?.avatar}
                                    alt=' '
                                    size={width < TABLET_SIZE ? '34px' : '42px'}
                                />
                            ) : (
                                <Avatar size={width < TABLET_SIZE ? 18 : 22} />
                            )}
                        </Profile>
                        <FlexColumn>
                            {profile?.firstName && (
                                <>
                                    <MText>{`${profile?.firstName} ${profile?.lastName}`}</MText>
                                    <MText>{profile?.email}</MText>
                                </>
                            )}
                        </FlexColumn>
                    </Flex>
                    <MText
                        style={{
                            textAlign: 'start',
                            margin: '10px 8px',
                            fontSize: '0.9rem',
                        }}>
                        <Text tid='balance' />
                    </MText>
                    <Balance>{formatNumber(profile?.balance)} تومان</Balance>
                </>
            )}
            {!profile && (
                <Flex style={{ justifyContent: 'center' }}>
                    <ScaleLoader color='#4f31c5' size={15} />
                </Flex>
            )}
            {profileItems.map((item) => (
                <ProfileItem
                    key={item._id}
                    onClick={() => onProfileItemsClicked('profile', item.path)}>
                    <item.icon
                        style={{ marginBottom: '2px' }}
                        size={18}
                        color='#4f31c5'
                    />
                    <MText fontSize='0.75rem' style={{ margin: '0 10px' }}>
                        <Text tid={item.title} />
                    </MText>
                </ProfileItem>
            ))}
            <ProfileItem
                last={true}
                onClick={() => onProfileItemsClicked('exit')}>
                <FaSignOutAlt color='red' size={18} />
                <MText fontSize='1rem' style={{ margin: '0 10px' }}>
                    <Text tid='exit' />
                </MText>
            </ProfileItem>
        </DropBody>
    )
})
