import { Fragment, useRef, useState } from 'react'
import { CFlexBetween, FlexColumn } from '../../styles/CommonStyles'
import {
    Body,
    LinkWrapper,
    MLink,
    NavItemWrapper,
    NavText,
    ExitWrapper,
    ExitText,
    ExitIcon,
    RespBody,
} from '../../styles/layout-styles/SideBarStyles'
import {
    FaShieldAlt,
    FaWallet,
    FaSortAmountUpAlt,
    FaHistory,
    FaColumns,
    FaIdBadge,
    FaSortAmountDownAlt,
    FaBuffer,
    FaRegIdCard,
    FaRegUser,
    FaEquals,
} from 'react-icons/fa'
import { MdFace, MdNotificationsActive } from 'react-icons/md'
import Text from '../../core/utils/Text'
import { CLOSE_SIDEBAR_SIZE, TABLET_SIZE } from '../../core/constants/common'
import { Link, useNavigate } from 'react-router-dom'
import useClickOutside from '../../core/hooks/useClickOutside'
import { useWindowSize } from '../../core/hooks/useWindowSize'
import { HOME } from '../../core/constants/urls'
import { useMainContext } from '../../core/contexts/main'
import { useAuthContext } from '../../core/contexts/auth'
import {
    Notification,
    UnreadNotificationIcon,
} from '../../styles/layout-styles/HeaderStyles'
import { useUnreadNotificationQuery } from '../../core/services/react-query/useNotificationsQuery'

const Sidebar = ({ windowSize, isOpen, setIsMenuOpen }) => {
    const {
        main: { theme, lang },
    } = useMainContext()
    const { logout } = useAuthContext()
    const { width } = useWindowSize()
    const { data: notifications } = useUnreadNotificationQuery(1)

    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState(window.location.pathname)

    const sideRef = useRef()
    useClickOutside(sideRef, () => {
        setIsMenuOpen(false)
    })

    const onLinkClicked = (nav) => {
        setIsMenuOpen(false)
        if (nav.route === '/') {
            window.location.href = HOME + lang
        }

        if (window.location.pathname !== `/user${nav.route}`) {
            setActiveTab(nav.route)
            navigate(nav.route)
        }
    }

    const variants = {
        in: {
            x: 0,
            transition: { duration: 0.3 },
        },
        out: {
            x: '300px',
            transition: { duration: 0.3 },
        },
    }

    const SideBody = () => {
        return (
            <CFlexBetween ref={sideRef} resp={width < TABLET_SIZE}>
                <FlexColumn>
                    <LinkWrapper>
                        {navigations.map((nav) => {
                            if (
                                width > CLOSE_SIDEBAR_SIZE &&
                                nav.text === 'main'
                            ) {
                                return
                            }

                            let hasNotif
                            let sidebar = false
                            if (nav.text === 'my-notifications') {
                                hasNotif = notifications?.data?.length
                                sidebar = true
                            }

                            return (
                                <>
                                    {nav?.external ? (
                                        <a href={nav.route}>
                                            <MLink
                                                _theme={theme}
                                                active={
                                                    activeTab ===
                                                    `/user${nav.route}`
                                                }
                                                // onClick={() => onLinkClicked(nav)}
                                                key={nav.route}>
                                                <NavItemWrapper>
                                                    <nav.icon
                                                        hasNotif={hasNotif}
                                                        sidebar={sidebar}
                                                    />
                                                    <NavText>
                                                        <Text tid={nav.text} />
                                                    </NavText>
                                                </NavItemWrapper>
                                            </MLink>
                                        </a>
                                    ) : (
                                        <Link to={nav.route}>
                                            <MLink
                                                _theme={theme}
                                                active={
                                                    activeTab ===
                                                    `/user${nav.route}`
                                                }
                                                // onClick={() => onLinkClicked(nav)}
                                                key={nav.route}>
                                                <NavItemWrapper>
                                                    <nav.icon
                                                        hasNotif={hasNotif}
                                                        sidebar={sidebar}
                                                    />
                                                    <NavText>
                                                        <Text tid={nav.text} />
                                                    </NavText>
                                                </NavItemWrapper>
                                            </MLink>
                                        </Link>
                                    )}
                                </>
                            )
                        })}
                    </LinkWrapper>
                </FlexColumn>
                <ExitWrapper onClick={logout}>
                    <ExitIcon />
                    <ExitText>
                        <Text tid='exit' />
                    </ExitText>
                </ExitWrapper>
            </CFlexBetween>
        )
    }

    return (
        <>
            {windowSize.width < CLOSE_SIDEBAR_SIZE ? (
                <RespBody
                    variants={variants}
                    initial='out'
                    animate={
                        windowSize.width < CLOSE_SIDEBAR_SIZE &&
                        (isOpen ? 'in' : 'out')
                    }>
                    <SideBody />
                </RespBody>
            ) : (
                <Body>
                    <SideBody />
                </Body>
            )}
        </>
    )
}

const navigations = [
    { text: 'main', route: '/', icon: FaEquals, external: true },
    { text: 'dashboard', route: '/dashboard', icon: FaColumns },
    { text: 'profile', route: '/profile', icon: FaRegUser },
    { text: 'security', route: '/security', icon: FaShieldAlt },
    { text: 'authentication', route: '/authentication', icon: FaIdBadge },
    { text: 'my-wallet', route: '/wallets', icon: FaWallet },
    {
        text: 'transaction-history',
        route: '/transaction-history',
        icon: FaSortAmountDownAlt,
    },
    {
        text: 'current-orders',
        route: '/current-orders',
        icon: FaSortAmountUpAlt,
    },
    { text: 'orders-history', route: '/orders-history', icon: FaHistory },
    { text: 'otc-orders', route: '/otc-history', icon: FaBuffer },
    { text: 'cards-accounts', route: '/accounts-cards', icon: FaRegIdCard },
    // {
    //     text: 'my-notifications',
    //     route: '/notifications',
    //     icon: MdNotificationsActive,
    // },
    {
        text: 'my-notifications',
        route: '/notifications',
        icon: Notification,
    },
    { text: 'invite-friends', route: '/invite', icon: MdFace },
]

export default Sidebar
