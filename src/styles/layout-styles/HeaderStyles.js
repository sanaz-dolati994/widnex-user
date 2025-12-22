import styled, { css, keyframes } from 'styled-components'
import { MdNotificationsActive } from 'react-icons/md'
import { FaRegUser, FaCaretDown, FaCaretUp, FaUserPlus } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { IoMdSettings } from 'react-icons/io'
import { IoExitOutline } from 'react-icons/io5'

const Body = styled.div`
    background-color: ${(props) => props.theme.headerBg};
    font-family: ${(props) => (props.theme.english ? 'Roboto' : 'Vazir')};
    direction: ${(props) => (props.theme.english ? 'ltr' : 'rtl')};
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80px;
    width: 100%;
    position: fixed;
    top: 0;
    z-index: 999;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
    padding: 0 ${(props) => (props.resp ? '15px' : '45px')};
`

const Flex = styled.div`
    display: flex;
    align-items: center;
    position: relative;
`

const FlexColumn = styled.div`
    display: flex;
    align-items: flex-start;
    flex-direction: column;
`

const MLink = styled.div`
    color: #fff;
    margin: 0 15px;
    transition: all 0.3s;
    font-size: 0.8rem;
    cursor: pointer;

    &:hover {
        color: ${(props) => props.theme.mainGreen};
    }

    @media screen and (max-width: 1050px) {
        margin: 0 10px;
        font-size: 0.9rem;
    }

    @media screen and (max-width: 768px) {
        margin: 0 10px;
        font-size: 0.8rem;
    }
`

const MText = styled.div`
    color: ${(props) => props.theme.secondary};
    transition: all 0.3s;
    font-size: ${(props) => props.fontSize || '0.9rem'};
    cursor: pointer;

    &:hover {
        color: ${(props) => props.theme.active};
    }

    @media screen and (max-width: 768px) {
        font-size: 0.9rem;
    }
`

const NotWrapper = styled.div`
    position: relative;
    margin: 0 15px;
`

const Notification = styled(MdNotificationsActive)`
    /* color: ${(props) => props.theme.color}; */
    color: ${(props) => !props.sidebar && '#fff'};
    border-radius: 50%;

    ${(props) =>
        props.hasNotif &&
        css`
            animation: pulse 2s ease-out infinite;
        `}

    &:hover {
        color: ${(props) => props.theme.active};
    }

    @keyframes pulse {
        0% {
            box-shadow: 0 0 0 4px ${(props) => props.theme.notification}70;
        }

        50% {
            box-shadow: 0 0 0 8px ${(props) => props.theme.notification}70;
        }

        100% {
            box-shadow: 0 0 0 4px ${(props) => props.theme.notification}70;
        }
    }
`

const Button = styled.div`
    background-color: ${(props) => props.theme.active};
    color: ${(props) => props.theme.bg};
    border-radius: 5px;
    width: 90px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 0.9rem;

    @media screen and (max-width: 768px) {
        font-size: 0.8rem;
        width: 70px;
        height: 30px;
        margin: 0 8px;
    }
`

const Profile = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${(props) => props.size};
    height: ${(props) => props.size};
    border-radius: 50%;
    margin: 0 15px;
    overflow: hidden;
    border: 1px solid ${(props) => props.theme.mainGreen};
    cursor: pointer;
    transition: all 0.2s;

    :hover {
        border-color: #fff;

        & > svg {
            color: ${(props) => props.theme.mainGreen};
        }
    }

    @media screen and (max-width: 480px) {
        margin: 0 8px;
    }
`

const Avatar = styled(FaRegUser)`
    /* color: ${(props) => props.theme.active}; */
    color: #fff;
    transition: all 0.2s;
`

const DropBody = styled.div`
    position: absolute;
    min-width: ${(props) => props.minWidth};
    padding: 10px 0;
    background-color: ${(props) => props.theme.settingBg};
    border-radius: 6px;
    top: calc(100% + 10px);
    ${(props) =>
        props.theme.english &&
        css`
            right: 0;
        `};
    ${(props) =>
        !props.theme.english &&
        css`
            left: 0;
        `};
    transition: all 0.3s;
    direction: ${(props) => (props.theme.english ? 'ltr' : 'rtl')};
`

const DropItem = styled.div`
    min-width: 120px;
    cursor: pointer;
    margin: 4px 0;
    padding: 6px 0;
    transition: all 0.3s;
    position: relative;
    font-size: 0.9rem;
    font-weight: bold;
    color: ${(props) =>
        (props.active && props.theme.active) || props.theme.color};
    ${(props) =>
        props.active &&
        css`
            background-color: ${(props) => props.theme.hover};

            &::after {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                height: 100%;
                width: 8px;
                background-color: ${(props) => props.theme.color};
            }
        `}

    &:hover {
        background-color: ${(props) => props.theme.hover};
    }
`

const Balance = styled.div`
    font-size: 1rem;
    color: ${(props) => props.theme.bg};
    background-color: ${(props) => props.theme.active};
    padding: 8px 12px;
    margin: 2px 0 10px 0;
    // letter-spacing: 1.2px;
    font-weight: 600;
    border-radius: 8px;
    text-align: start;
    // font-family: monospace !important;

    @media screen and (max-width: 768px) {
        font-size: 0.9rem;
        // letter-spacing: 1px;
    }
`

const ProfileItem = styled.div`
    display: flex;
    padding: 12px 4px;
    ${(props) =>
        !props.last &&
        css`
            border-bottom: 1px solid ${(props) => props.theme.primaryBg}80;
        `}
    transition: all 0.3s;

    &:hover {
        background-color: ${(props) => props.theme.hover};
        border-radius: 8px;
    }

    @media screen and (max-width: 480px) {
        padding: 8px 2px;
    }
`

const Image = styled.img`
    width: ${(props) => props.size};
    height: ${(props) => props.size};
    border-radius: 50%;
`

const NotItem = styled.div`
    border-radius: 8px;
    margin: 10px 0;
    padding: 8px 12px;
    background-color: ${(props) => props.theme.dropdown};
    color: ${(props) => props.theme.color};
    display: flex;
    align-items: center;
`

const NotText = styled.div`
    font-size: ${(props) => props.fontSize};
    color: ${(props) => props.color || props.theme.color};
`

const SettingWrapper = styled.div`
    width: 100%;
    margin: 10px 0;
    padding: 4px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    ${(props) =>
        props.active &&
        css`
            border-bottom: 1px solid ${(props) => props.theme.color}20;
        `}
`

const SettingItem = styled.div`
    color: ${(props) => props.theme.color};
    font-size: 0.8rem;
`

const SettingSub = styled.div`
    color: ${(props) => props.theme.color};
    font-size: 0.8rem;
    width: 100%;
`

const UpCaret = styled(FaCaretUp)`
    color: ${(props) => props.theme.color};
`

const DownCaret = styled(FaCaretDown)`
    color: ${(props) => props.theme.color};
`

const SettingCheckBox = styled.div`
    width: 12px;
    height: 12px;
    margin: 0 8px;
    position: relative;
    border-radius: 50%;
    cursor: pointer;
    background-color: ${(props) =>
        props.active ? props.theme.mainOrange : props.theme.color};
`

const InfiniteAnim = keyframes`
  0% {
    opacity: 0.2;
  }
  100% {
    opacity: 1;
  }
`

const UnreadNotificationIcon = styled.div`
    width: 9px;
    height: 9px;
    background-color: ${(props) => props.theme.notification};
    position: absolute;
    bottom: 0px;
    right: 0;
    border-radius: 50%;
    /* animation: ${InfiniteAnim} 1.5s infinite; */

    @media screen and (max-width: 1050px) {
        width: 8px;
        height: 8px;
    }
`

const Menu = styled(motion.div)`
    position: absolute;
    padding: 20px 5px 10px 20px;
    background-color: ${(props) => props.theme.primaryBg};
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    border: 1px solid ${(props) => props.theme.color}20;
    left: -1px;
    top: 80px;
`

const LinkRow = styled(Flex)`
    color: ${(props) => props.theme.color};
    margin: 10px;
    padding-bottom: 12px;
    border-bottom: 1px solid ${(props) => props.theme.color}15;
`

const LayoutSettingIcon = styled(IoMdSettings)`
    color: ${(props) => props.theme.color};
    margin: 0 8px;
    cursor: pointer;

    &:hover {
        color: ${(props) => props.theme.mainOrange};
    }
`

const MHeaderIconWrapper = styled.div`
    padding: 0.7rem 0.875rem;
    margin: 0 5px;
    border-radius: 12px;
    cursor: pointer;
    position: relative;

    &:hover {
        background-color: ${(props) => props.theme.colorHeaderIconHover};
    }

    @media screen and (max-width: 768px) {
        padding: 0.4rem 0.475rem;
        margin: 0 2px;
    }
`

const MHeaderButtonWrapper = styled(MHeaderIconWrapper)`
    background-color: ${(props) => props.theme.active};
    color: #0d1726;
    font-size: 0.95rem;
    font-weight: 600;

    &:hover {
        background-color: ${(props) => props.theme.active};
    }

    @media screen and (max-width: 768px) {
        font-size: 0.8rem;
    }
`

const RegisterIcon = styled(FaUserPlus)`
    color: #fff;
    margin: 0 8px;
    margin-bottom: 3px;
`

const SinginIcon = styled(IoExitOutline)`
    color: #191c20;
    margin: 0 8px;
    margin-bottom: 3px;
`

export {
    NotText,
    NotItem,
    Image,
    Body,
    DropBody,
    DropItem,
    Flex,
    FlexColumn,
    Profile,
    ProfileItem,
    Balance,
    Notification,
    NotWrapper,
    Avatar,
    MText,
    MLink,
    Button,
    SettingWrapper,
    SettingItem,
    SettingSub,
    UpCaret,
    DownCaret,
    SettingCheckBox,
    UnreadNotificationIcon,
    Menu,
    LinkRow,
    LayoutSettingIcon,
    MHeaderIconWrapper,
    RegisterIcon,
    SinginIcon,
    MHeaderButtonWrapper,
}
