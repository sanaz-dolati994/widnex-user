import { forwardRef, useRef, useState } from 'react'
import { FaCaretDown, FaCaretUp, FaEquals, FaExchangeAlt } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { ProfileDropdown } from '../modals/ProfileDropdown'
import { MdSettings, MdSpaceDashboard } from 'react-icons/md'
import NotificationDropdown from '../modals/NotificationDropdown'
import SettingsDropdown from '../modals/SettingsDropdown'
import { SiMarketo } from 'react-icons/si'
import { CgMenuLeftAlt } from 'react-icons/cg'
import { useMainContext } from '../../core/contexts/main'
import { useWindowSize } from '../../core/hooks/useWindowSize'
import useClickOutside from '../../core/hooks/useClickOutside'
import { useProfileQuery } from '../../core/services/react-query/useProfileQuery'
import { useLogout } from '../../core/services/react-query/useAuthQuery'
import { useUnreadNotificationQuery } from '../../core/services/react-query/useNotificationsQuery'
import { HOME } from '../../core/constants/urls'
import { MOBILE_SIZE } from '../../core/constants/common'
import { GiPayMoney } from 'react-icons/gi'
import {
    Avatar,
    Body,
    DropBody,
    DropItem,
    Flex,
    Image,
    LinkRow,
    MHeaderButtonWrapper,
    MHeaderIconWrapper,
    MLink,
    MText,
    Menu,
    Notification,
    Profile,
    RegisterIcon,
    SinginIcon,
    UnreadNotificationIcon,
} from '../../styles/layout-styles/HeaderStyles'
import Text from '../../core/utils/Text'
import { RiSunFill } from 'react-icons/ri'
import { BsFillMoonFill } from 'react-icons/bs'
import { useAuthContext } from '../../core/contexts/auth'
import { AnimatePresence } from 'framer-motion'

const MasterHeader = ({ setIsMenuOpen }) => {
    const {
        main: { lang, setLang, theme, setTheme },
        profile: { token },
    } = useMainContext()

    const { width } = useWindowSize()
    const navigate = useNavigate()

    const [langOpen, setLangOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [notificationsOpen, setNotificationsOpen] = useState(false)
    const [menuIsOpen, setMenuIsOpen] = useState(false)

    const menuRef = useRef()
    useClickOutside(menuRef, () => menuIsOpen && setMenuIsOpen(false))

    const langRef = useRef()
    useClickOutside(langRef, () => langOpen && setLangOpen(false))

    const profileRef = useRef()
    useClickOutside(profileRef, () => profileOpen && setProfileOpen(false))

    const notificationRef = useRef()
    useClickOutside(
        notificationRef,
        () => notificationsOpen && setNotificationsOpen(false)
    )

    const settingsRef = useRef()
    useClickOutside(settingsRef, () => settingsOpen && setSettingsOpen(false))

    const onThemeChange = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    const { data: profile } = useProfileQuery()
    const {
        data: notifications,
        isFetching: notificationsLoading,
        refetch: refetchUnreadNotifications,
    } = useUnreadNotificationQuery(1)
    const { logout } = useAuthContext()

    const onOptionClicked = (type) => {
        setLangOpen(false)
        switch (type) {
            case 'english':
                setLang('en')
                break
            case 'فارسی':
                setLang('fa')
                break
            default:
                break
        }
    }

    const onProfileItemsClicked = (type, path = null) => {
        if (type === 'exit') {
            logout()
        } else {
            window.location.href = HOME + 'user' + path
        }
    }

    const goToSignin = (type) => {
        window.location.href =
            HOME + `user/register-signin?tab=${type === 'register' ? '0' : '1'}`
    }

    const onLinkClicked = (path) => {
        if (path !== '/markets' && path !== '/otc') {
            window.location.href = HOME + `${lang}/${path}`
        } else {
            navigate(path)
        }
    }

    return (
        <Body resp={width < MOBILE_SIZE}>
            <AnimatePresence exitBeforeEnter>
                {menuIsOpen && (
                    <Menu
                        variants={menuVariants}
                        animate='in'
                        exit='out'
                        initial='out'
                        ref={menuRef}>
                        {getLinks(lang).map((link) => (
                            <LinkRow
                                key={link.path}
                                justify='flex-start'
                                onClick={() => onLinkClicked(link.path)}>
                                {link.icon}
                                <MLink key={link.title}>
                                    {link.needLogin && !token ? (
                                        <></>
                                    ) : link.external ? (
                                        <a href={link.path}>
                                            <Text tid={link.title} />
                                        </a>
                                    ) : (
                                        <Link to={link.path}>
                                            <Text tid={link.title} />
                                        </Link>
                                    )}
                                </MLink>
                            </LinkRow>
                        ))}
                    </Menu>
                )}
            </AnimatePresence>
            <Flex>
                {width < MOBILE_SIZE && !!token && (
                    <CgMenuLeftAlt
                        onClick={() => setIsMenuOpen((state) => !state)}
                        size={28}
                        color='#c3c5b7'
                    />
                )}
                <a href={'/' + lang}>
                    <img
                        src={require(`../../assets/images/logo-${lang}-dark.png`)}
                        width={132}
                        alt=' '
                        style={{ cursor: 'pointer' }}
                        onClick={() => onLinkClicked('')}
                    />
                </a>
                {width > MOBILE_SIZE &&
                    getLinks(lang).map((link) => (
                        <MLink key={link.title}>
                            {link.external ? (
                                <a href={link.path}>
                                    <Text tid={link.title} />
                                </a>
                            ) : (
                                <Link to={link.path}>
                                    <Text tid={link.title} />
                                </Link>
                            )}
                        </MLink>
                    ))}
            </Flex>
            <Flex>
                {token ? (
                    <Flex
                        style={{
                            margin: '0 8px',
                            position: 'relative',
                            cursor: 'pointer',
                        }}
                        onClick={() => setNotificationsOpen(true)}>
                        <Notification
                            size={20}
                            hasNotif={notifications?.data?.length}
                        />
                        {notifications?.data?.length ? (
                            <UnreadNotificationIcon />
                        ) : null}
                    </Flex>
                ) : null}
                {notificationsOpen && (
                    <NotificationDropdown
                        ref={notificationRef}
                        notifications={notifications}
                        loading={notificationsLoading}
                        onReadANotification={() => refetchUnreadNotifications()}
                    />
                )}
                {width > MOBILE_SIZE ? (
                    <MHeaderIconWrapper onClick={onThemeChange}>
                        {theme === 'dark' ? (
                            <RiSunFill color={'#4f31c5'} size={20} />
                        ) : (
                            <BsFillMoonFill color={'#fafafa'} size={18} />
                        )}
                    </MHeaderIconWrapper>
                ) : null}
                {width > MOBILE_SIZE ? (
                    <>
                        <Flex ref={langRef}>
                            <MHeaderIconWrapper
                                onClick={() => setLangOpen((state) => !state)}>
                                <Flex>
                                    {langOpen ? (
                                        <FaCaretUp color='#c3c5b7' size={18} />
                                    ) : (
                                        <FaCaretDown
                                            color='#c3c5b7'
                                            size={18}
                                        />
                                    )}
                                    <MText className={'text-gray-100'}>
                                        {languages[lang]}
                                    </MText>
                                </Flex>
                            </MHeaderIconWrapper>
                            {langOpen && (
                                <Dropdown
                                    options={languageOptions}
                                    onOptionClicked={onOptionClicked}
                                    active={lang === 'en' ? 'english' : 'فارسی'}
                                />
                            )}
                        </Flex>
                    </>
                ) : (
                    <Flex style={{ margin: '0 5px' }}>
                        <MdSettings
                            onClick={() => setSettingsOpen(true)}
                            size={20}
                            color='#c3c5b7'
                        />
                        {settingsOpen && <SettingsDropdown ref={settingsRef} />}
                    </Flex>
                )}
                {token ? (
                    <Profile
                        onClick={() => setProfileOpen((state) => !state)}
                        size={width < MOBILE_SIZE ? '34px' : '42px'}>
                        {profile?.avatar ? (
                            <Image
                                src={profile?.avatar}
                                alt=' '
                                size={width < MOBILE_SIZE ? '34px' : '42px'}
                            />
                        ) : (
                            <Avatar size={width < MOBILE_SIZE ? 18 : 22} />
                        )}
                        {profileOpen && (
                            <ProfileDropdown
                                ref={profileRef}
                                width={width}
                                profile={profile}
                                onProfileItemsClicked={onProfileItemsClicked}
                            />
                        )}
                    </Profile>
                ) : (
                    <>
                        <MHeaderIconWrapper
                            onClick={() => goToSignin('register')}>
                            <Flex>
                                <RegisterIcon size={18} />
                                <MText className={'text-gray-100'}>
                                    <Text tid='register' />
                                </MText>
                            </Flex>
                        </MHeaderIconWrapper>
                        <MHeaderButtonWrapper
                            onClick={() => goToSignin('signin')}>
                            <Flex className='!text-white'>
                                <SinginIcon color='#ffffff' size={18} />
                                <Text tid='signin' />
                            </Flex>
                        </MHeaderButtonWrapper>
                    </>
                )}
            </Flex>
        </Body>
    )
}

const Dropdown = forwardRef((props, ref) => {
    const { options, active, onOptionClicked } = props

    return (
        <DropBody ref={ref}>
            {options.map((option) => (
                <DropItem
                    key={option}
                    onClick={() => onOptionClicked(option)}
                    active={active === option}>
                    <Flex style={{ padding: '0 20px' }} className='font-bold'>
                        {option}
                    </Flex>
                </DropItem>
            ))}
        </DropBody>
    )
})

const getLinks = (lang) => [
    {
        title: 'main',
        path: HOME + lang,
        icon: <FaEquals size={18} />,
        external: true,
    },
    {
        title: 'dashboard',
        path: '/dashboard',
        icon: <FaEquals size={18} />,
        needLogin: true,
    },
    {
        title: 'otc',
        path: HOME + lang + '/otc2/form',
        icon: <FaExchangeAlt size={18} />,
        external: true,
    },
    {
        title: 'markets',
        path: HOME + lang + '/market',
        icon: <SiMarketo size={18} />,
        external: true,
    },
    {
        title: 'p2p-trade',
        path: HOME + 'trade/BTC_IRT',
        icon: <SiMarketo size={18} />,
        external: true,
    },
    {
        title: 'wallet',
        path: '/wallets',
        icon: <GiPayMoney size={18} />,
        needLogin: true,
    },
]

const languages = {
    en: 'english',
    fa: 'فارسی',
}

const languageOptions = ['english', 'فارسی']

const menuVariants = {
    in: {
        x: 0,
        transition: { duration: 0.4 },
    },
    out: {
        x: -300,
        transition: { duration: 0.4 },
    },
}

export default MasterHeader
