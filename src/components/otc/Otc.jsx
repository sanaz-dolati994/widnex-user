import { useOtc } from './useOtc'
import { useRunAfterUpdate } from '../../core/hooks/useRunAfterUpdate'
import { onInputValueChangeUtil } from '../../core/utils/useInputValueChange'
import { useMainContext } from '../../core/contexts/main'
import { IoIosArrowRoundUp } from 'react-icons/io'
import Text from '../../core/utils/Text'
import ToomanRow from './ToomanRow'
import CryptoCoinSelect from './CryptoCoinSelect'
import ModalLayout from '../layouts/ModalLayout'
import OtcInvoiceModal from '../modals/OtcInvoiceModal'
import OtcErrorModal from '../modals/OtcErrorModal'
import { useEffect } from 'react'
import { TbH4, TbInfoCircle } from 'react-icons/tb'
import { Link } from 'react-router-dom'
import { deformatNumber, formatNumber } from '../../core/utils/common'
import '../../assets/css/form.css'
import MobileModal from '../modals/MobileModal'
import { useWindowSize } from '../../core/hooks/useWindowSize'

export default function Otc({ classes = null, type, selectedCoin = null }) {
    const {
        main: { lang },
    } = useMainContext()

    const { width } = useWindowSize()

    const {
        profile,
        balance,
        onBalanceClick,
        coin,
        price,
        onPriceChange,
        volume,
        onVolumeChange,
        setCoin,
        onAction,
        modal,
        toomanCoin,
        onClose,
        limits,
        setType,
    } = useOtc()

    const isOpen = true

    useEffect(() => {
        setType(type)
    }, [type])

    useEffect(() => {
        if (selectedCoin) {
            setCoin(selectedCoin)
        }
    }, [selectedCoin])

    const afterUpdate = useRunAfterUpdate()
    const onChange = (e, inputType) => {
        const value = onInputValueChangeUtil(e, afterUpdate)
        if (inputType === 'first') {
            type === 'buy' ? onPriceChange(value) : onVolumeChange(value)
        } else {
            type === 'sell' ? onPriceChange(value) : onVolumeChange(value)
        }
    }

    return (
        <>
            <div
                className={`flex flex-col gap-1 py-6 w-[90%] lg:w-4/5 mx-auto ${classes}`}>
                {/* {!!profile ? (
                    <div
                        className={
                            'flex items-center justify-center gap-2 w-full text-sm cursor-pointer mx-[-4px]'
                        }
                        onClick={onBalanceClick}>
                        <Text tid={'balance'} />
                        <span>:</span>
                        <span className={'mt-[4px]'} dir={'ltr'}>
                            {balance}
                        </span>
                    </div>
                ) : null} */}

                <div
                    className={`flex flex-col gap-6 ${!!profile ? 'mt-0' : 'mt-5'
                        }`}>
                    <div>
                        {type === 'buy' ? (
                            <div className='flex justify-between items-center'>
                                <h4 className='mb-2'>
                                    <Text tid='pay-amount' />
                                </h4>
                                <Link
                                    to={'/wallets/deposit'}
                                    className='text-sm text-cBlue'>
                                    + <Text tid='increase-balance' />
                                </Link>
                            </div>
                        ) : (
                            <h4 className='mb-2'>
                                <Text tid='sell-amount' />
                            </h4>
                        )}
                        <div
                            className={
                                'rounded-lg overflow-hidden w-full h-[42px] border border-light-border dark:border-card-border flex items-center'
                            }>
                            <div dir={'ltr'} className='w-4/5'>
                                <input
                                    placeholder={
                                        lang === 'fa'
                                            ? 'مقدار مبلغ پرداختی شما'
                                            : 'You pay'
                                    }
                                    value={
                                        type === 'buy'
                                            ? price
                                                ? price
                                                : ''
                                            : volume
                                                ? volume
                                                : ''
                                    }
                                    onChange={(e) => onChange(e, 'first')}
                                    className={
                                        'h-[42px] text-sm px-3 border-none bg-transparent w-full'
                                    }
                                />
                            </div>
                            {type === 'buy' ? (
                                <ToomanRow className='w-1/4 lg:w-1/5 h-full justify-center bg-gray-secondary dark:bg-card-border' />
                            ) : (
                                <div
                                    className={
                                        'flex justify-start items-center cursor-pointer w-1/4 lg:w-1/5 bg-gray-secondary dark:bg-card-border h-full'
                                    }>
                                    <CryptoCoinSelect
                                        coin={coin}
                                        type={type}
                                        onChange={(c) => setCoin(c)}
                                    />
                                </div>
                            )}
                        </div>
                        {type === 'sell' && (
                            <p className='flex justify-between items-center text-sm bg-primary dark:bg-white/5 rounded my-2 px-2 py-1'>
                                <div>
                                    <Text tid='coin-price' />
                                    <span>:</span>
                                </div>
                                <div className='flex gap-x-2 text-sm items-center'>
                                    <div
                                        dir='ltr'
                                        className={`rounded-full py-1 px-2 text-xs font-bold text-center  ${coin?.changes[
                                            '24h'
                                        ].changePresent.startsWith('-')
                                            ? 'bg-red-200 text-red-700'
                                            : 'bg-[#07BA4F30] text-[#4FCB6A]'
                                            } `}>
                                        {coin?.changes[
                                            '24h'
                                        ].changePresent.startsWith('-')
                                            ? ''
                                            : '+'}
                                        {coin?.changes['24h'].changePresent}%
                                    </div>
                                    <div className='text-xs'>
                                        <span className='font-bold mx-1'>
                                            {formatNumber(coin?.sell, {
                                                type: 'irt',
                                            })}
                                        </span>
                                        <span className='opacity-80'>
                                            تومان
                                        </span>
                                    </div>
                                </div>
                            </p>
                        )}
                        {!!profile && (
                            <p
                                className='mt-2 flex items-center gap-x-2 text-sm cursor-pointer'
                                onClick={onBalanceClick}>
                                <TbInfoCircle
                                    className='text-cBlue'
                                    size={16}
                                />
                                <Text
                                    tid='full-balance'
                                    className='text-pcolor-light'
                                />
                                <span
                                    dir={type === 'buy' ? 'rtl' : 'ltr'}
                                    className='font-semibold'>
                                    {balance}
                                </span>
                            </p>
                        )}
                    </div>

                    {/* <div dir={'ltr'}>
                        <input
                            placeholder={
                                lang === 'fa'
                                    ? 'مقدار مبلغ پرداختی شما'
                                    : 'You pay'
                            }
                            value={
                                type === 'buy'
                                    ? price
                                        ? price
                                        : ''
                                    : volume
                                    ? volume
                                    : ''
                            }
                            onChange={(e) => onChange(e, 'first')}
                            className={
                                'h-[42px] text-sm px-3 otc-input-bg border-none rounded-lg w-full'
                            }
                        />
                    </div> */}
                    <div className='mt-4'>
                        <div>
                            <h4 className='mb-2'>
                                <Text tid='recieve-amount' />
                            </h4>
                        </div>
                        <div
                            className={
                                'rounded-lg overflow-hidden w-full h-[42px] flex items-center border border-light-border dark:border-card-border'
                            }>
                            <div dir={'ltr'} className='w-4/5'>
                                <input
                                    placeholder={
                                        lang === 'fa'
                                            ? 'مقدار مبلغ دریافتی شما'
                                            : 'You receive'
                                    }
                                    value={
                                        type === 'sell'
                                            ? price
                                                ? price
                                                : ''
                                            : volume
                                                ? volume
                                                : ''
                                    }
                                    onChange={(e) => onChange(e, 'second')}
                                    className={
                                        'h-[42px] text-sm px-3 bg-transparent border-none w-full'
                                    }
                                />
                            </div>
                            {type === 'sell' ? (
                                <ToomanRow className='w-1/4 lg:w-1/5 h-full justify-center bg-gray-secondary dark:bg-card-border' />
                            ) : (
                                <div
                                    className={
                                        'flex justify-start items-center cursor-pointer w-1/4 lg:w-1/5 bg-gray-secondary dark:bg-card-border h-full'
                                    }>
                                    <CryptoCoinSelect
                                        coin={coin}
                                        type={type}
                                        onChange={(c) => setCoin(c)}
                                    />
                                </div>
                            )}
                        </div>
                        {type === 'buy' && (
                            <p className='flex justify-between items-center text-sm bg-primary dark:bg-white/5 rounded mt-2 px-2 py-1'>
                                <div>
                                    <Text tid='coin-price' />
                                    <span>:</span>
                                </div>
                                <div className='flex gap-x-2 text-sm items-center'>
                                    <div
                                        dir='ltr'
                                        className={`rounded-full py-1 px-2 text-xs font-bold text-center ${coin?.changes[
                                            '24h'
                                        ].changePresent.startsWith('-')
                                            ? 'bg-red-200 text-red-700'
                                            : 'bg-[#07BA4F30] text-[#4FCB6A]'
                                            } `}>
                                        {coin?.changes[
                                            '24h'
                                        ].changePresent.startsWith('-')
                                            ? ''
                                            : '+'}
                                        {coin?.changes['24h'].changePresent}%
                                    </div>
                                    <div className='text-xs'>
                                        <span className='font-bold mx-1'>
                                            {formatNumber(coin?.buy, {
                                                type: 'irt',
                                            })}
                                        </span>
                                        <span className='opacity-80'>
                                            تومان
                                        </span>
                                    </div>
                                </div>
                            </p>
                        )}
                    </div>
                    {/* <div dir={'ltr'}>
                        <input
                            placeholder={
                                lang === 'fa'
                                    ? 'مقدار مبلغ دریافتی شما'
                                    : 'You receive'
                            }
                            value={
                                type === 'sell'
                                    ? price
                                        ? price
                                        : ''
                                    : volume
                                    ? volume
                                    : ''
                            }
                            onChange={(e) => onChange(e, 'second')}
                            className={
                                'h-[42px] text-sm px-3 otc-input-bg border-none rounded-lg w-full'
                            }
                        />
                    </div> */}
                </div>

                <div
                    className={`w-full rounded-lg flex items-center justify-center h-[42px] cursor-pointer mt-5  ${type === 'buy' ? 'bg-green-600' : 'bg-red-600'
                        }`}
                    onClick={() => onAction(type)}>
                    <Text tid={type} className={'text-pColor'} />
                </div>
            </div>

            {modal === 'otc' ? (
                width > 1024 ?
                    <ModalLayout
                        open={isOpen}
                        onClose={onClose}
                        width={'480px'}>
                        <OtcInvoiceModal
                            isModalOpen={isOpen}
                            state={type}
                            firstAsset={{
                                info: type === 'buy' ? toomanCoin : coin,
                                amount:
                                    type === 'buy'
                                        ? deformatNumber(price)
                                        : deformatNumber(volume),
                                formattedNumber: type === 'buy' ? price : volume,
                            }}
                            secondAsset={{
                                info: type === 'sell' ? toomanCoin : coin,
                                amount:
                                    type === 'sell'
                                        ? deformatNumber(price)
                                        : deformatNumber(volume),
                                formattedNumber: type === 'sell' ? price : volume,
                            }}
                            onClose={onClose}
                            coin={coin}
                        />
                    </ModalLayout>
                    :
                    <MobileModal
                        isOpen={isOpen}
                        onClose={onClose}>
                        <OtcInvoiceModal
                            state={type}
                            firstAsset={{
                                info: type === 'buy' ? toomanCoin : coin,
                                amount:
                                    type === 'buy'
                                        ? deformatNumber(price)
                                        : deformatNumber(volume),
                                formattedNumber: type === 'buy' ? price : volume,
                            }}
                            secondAsset={{
                                info: type === 'sell' ? toomanCoin : coin,
                                amount:
                                    type === 'sell'
                                        ? deformatNumber(price)
                                        : deformatNumber(volume),
                                formattedNumber: type === 'sell' ? price : volume,
                            }}
                            onClose={onClose}
                            coin={coin}
                        />
                    </MobileModal>

            ) : (
                <ModalLayout
                    open={modal !== 'close'}
                    onClose={onClose}
                    width={'480px'}>
                    <OtcErrorModal
                        onClose={onClose}
                        limit={limits}
                        coin={coin}
                        type={modal}
                        tradeType={type}
                    />
                </ModalLayout>
            )}
        </>
    )
}
