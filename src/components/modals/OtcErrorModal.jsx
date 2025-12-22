import { IoIosClose, IoMdAlert } from 'react-icons/io'
import { useMainContext } from '../../core/contexts/main'
import { getMainTheme } from '../../core/utils/theme'
import { DText } from '../../styles/CommonStyles'
import Text from '../../core/utils/Text'
import { Link } from 'react-router-dom'
import { formatNumber } from '../../core/utils/common'
import styled from 'styled-components'

// type: login - min - max - balance
const OtcErrorModal = ({ onClose, limit, coin, type, tradeType }) => {
    const {
        main: { lang, theme },
    } = useMainContext()

    const hrefs = {
        login: '/register-signin',
        balance: '/wallets',
    }
    const path = hrefs[type]

    return (
        <div className={'w-full flex flex-col gap-4 items-center'}>
            <div className={'flex items-center  w-full'}>
                <IconWrapper onClick={onClose}>
                    <CloseIcon size={24} />
                </IconWrapper>
            </div>
            <div className={'w-full flex justify-center'}>
                <OtcErrorIconWrapper>
                    <IoMdAlert
                        size={42}
                        color={getMainTheme(theme, lang).mainOrange}
                    />
                </OtcErrorIconWrapper>
            </div>
            <div className={'flex items-center justify-start my-5'}>
                <DText primary cFontSize={'1rem'}>
                    {(type === 'min' || type === 'max') && (
                        <div className={'flex flex-wrap items-center'}>
                            <Text tid={`${type}-part-1`} />
                            <Text
                                tid={`${formatNumber(limit)} ${
                                    tradeType === 'buy'
                                        ? lang === 'fa'
                                            ? coin.fa
                                            : coin.name
                                        : lang === 'fa'
                                        ? 'تومان'
                                        : 'Tooman'
                                }`}
                                className={'mx-2'}
                            />
                            <Text tid={`${type}-part-2`} />
                        </div>
                    )}
                    {(type === 'login' || type === 'balance') && (
                        <Text
                            tid={`${type}-error`}
                            className='text-base'
                            dir={lang === 'fa' ? 'rtl' : 'ltr'}
                        />
                    )}
                </DText>
            </div>
            <div className={'flex w-full justify-center'}>
                {path ? (
                    <Link
                        className={'btn btn-primary w-full h-[40px]'}
                        to={path}>
                        <Text tid={`${type}-btn`} />
                    </Link>
                ) : (
                    <div
                        className={
                            'btn btn-primary w-full h-[40px] cursor-pointer flex justify-center items-center'
                        }
                        onClick={onClose}>
                        <Text tid={`${type}-btn`} />
                    </div>
                )}
            </div>
        </div>
    )
}

const IconWrapper = styled.div`
    padding: 4px;
    border-radius: 50px;
    cursor: pointer;

    &:hover {
        background-color: ${(props) => props.theme.color}20;
    }
`

const CloseIcon = styled(IoIosClose)`
    color: ${(props) => props.theme.primary};
`

const OtcErrorIconWrapper = styled.div`
    border-radius: 50%;
    outline: 3px solid ${(props) => props.theme.mainOrange};
    padding: 2px;
    box-shadow: 0 0 8px ${(props) => props.theme.mainOrange};
`

export default OtcErrorModal
