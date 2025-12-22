import { useEffect, useMemo, useState } from 'react'
import { useQueryContext } from '../../core/contexts/query'
import { useMutation } from 'react-query'
import { postApiWithToken } from '../../core/services/fetch-api/post'
import { useMainContext } from '../../core/contexts/main'
import axios from 'axios'
import { BASE_URL, SOCKET_URL } from '../../core/constants/urls'
import BaseModal from './BaseModal'
import Text from '../../core/utils/Text'
import { ClipLoader } from 'react-spinners'
import { getMainTheme } from '../../core/utils/theme'
import { formatNumber } from '../../core/utils/common'
import { Link } from 'react-router-dom'
import { AiFillPlusCircle } from 'react-icons/ai'
import styled from 'styled-components'
import { useProfileQuery } from '../../core/services/react-query/useProfileQuery'
import { useWindowSize } from '../../core/hooks/useWindowSize'
import { WalletDropdown } from './WalletDropdown'
import { BankAccountDropdown } from './BankAccountsDropdown'

export default function OtcInvoiceModal({
    state,
    isModalOpen,
    firstAsset,
    secondAsset,
    onClose,
    coin,
    isP2p,
}) {
    const { setToast } = useQueryContext()

    const isBuying = state === 'buy'
    const isSelling = state === 'sell'

    const [data, setData] = useState()
    const {
        data: calculate,
        mutate: getWages,
        isLoading: loadingWages,
    } = useOtcCalculate()
    useEffect(() => {
        if (!!calculate) {
            setData(calculate?.data?.data)
        }
    }, [calculate])

    useEffect(() => {
        getWages({
            section: 'otc',
            type: state,
            pair: 'irt',
            coin: coin.id,
            amount: isBuying ? secondAsset?.amount : firstAsset?.amount,
            price: isBuying
                ? secondAsset?.info[state]
                : firstAsset?.info[state],
        })
    }, [])

    const [isDirect, setIsDirect] = useState(false)
    const [loading, setLoading] = useState(false)
    const [otcData, setOtcData] = useState(null)

    const [withdrawStep, setWithdrawStep] = useState(1)

    const {
        main: { theme },
        profile: { token }
    } = useMainContext()

    const [selectedWithdrawNetwork, setSelectedWithdrawNetwork] = useState({})
    const [selectedWithdrawWallet, setSelectedWithdrawWallet] = useState({})
    const [
        selectedWithdrawBankAccount,
        setSelectedWithdrawBankAccount,
    ] = useState({})

    const validations = useMemo(() => {
        const hasSelectedNetwork = isBuying
            ? !!(selectedWithdrawNetwork?.network && selectedWithdrawWallet?.id)
            : true
        const hasSelectedBankAccount = isSelling
            ? selectedWithdrawBankAccount?.id
            : true

        const isValid =
            withdrawStep === 1
                ? true
                : !isDirect || (hasSelectedNetwork && hasSelectedBankAccount)

        return {
            isValid,
            hasSelectedNetwork,
            hasSelectedBankAccount,
        }
    }, [
        withdrawStep,
        isDirect,
        selectedWithdrawNetwork,
        selectedWithdrawBankAccount,
        selectedWithdrawWallet,
    ])

    const buttonVariant = useMemo(
        () =>
            validations.isValid
                ? 'primary'
                : theme === 'dark'
                    ? 'white'
                    : 'dark-secondary',
        [validations.isValid]
    )

    const reset = () => {
        setIsDirect(false)
        // setCalculatedData({ raw: {}, list: [] })
        setLoading(false)
        setOtcData(null)
        setSelectedWithdrawNetwork({})
        setSelectedWithdrawWallet({})
        setWithdrawStep(1)
    }

    const close = () => {
        onClose()
        reset()
    }

    const { refetch: refetchProfile } = useProfileQuery()

    const order = () => {
        const fn = async function () {
            setLoading(true)

            const values = {
                isDirect,
                amount: isBuying ? secondAsset.amount : firstAsset.amount,
                coin: isBuying ? secondAsset.info.coin : firstAsset.info.coin,
                type: state,
                network:
                    isDirect && isBuying
                        ? selectedWithdrawNetwork.network
                        : undefined,
                wallet:
                    isDirect && isBuying
                        ? selectedWithdrawWallet.id
                        : undefined,
                bank:
                    isDirect && isSelling
                        ? selectedWithdrawBankAccount.id
                        : undefined,
            }

            try {
                if (isDirect) {
                    if (withdrawStep === 1) {
                        try {
                            const order = await tradeAPIs.otc.create(values, token);
                            setOtcData(order)
                            setToast({
                                message: order?.data?.message,
                                show: true,
                            })
                            setWithdrawStep(2)
                        } catch (error) {
                            setToast({
                                message: error.response?.data?.message,
                                show: true,
                                isError: true,
                            })
                        }
                    } else if (withdrawStep === 2) {
                        let res

                        if (isBuying) {
                            res = await auditAPIs.coining.withdraw({
                                amount: otcData?.data?.data?.afterWage,
                                coin: secondAsset.info.coin,
                                network: selectedWithdrawNetwork.network,
                                wallet: selectedWithdrawWallet.id,
                            })
                        } else if (isSelling) {
                            res = await auditAPIs.banking.withdraw({
                                amount: otcData?.data?.data?.afterWage,
                                account: selectedWithdrawBankAccount.id,
                            })
                        }

                        setToast({
                            message: res?.data?.message,
                            show: true,
                        })
                    }
                } else {
                    try {
                        const order = await tradeAPIs.otc.create(values, token);
                        setToast({
                            message: order?.data?.message,
                            show: true,
                        })
                    } catch (error) {
                        setToast({
                            message: error.response?.data?.message,
                            show: true,
                            isError: true,
                        })
                    }
                }

                if ((isDirect && withdrawStep === 2) || !isDirect) {
                    close()
                }

                // dispatch(resetTradeForm())
            } catch (e) { }

            setLoading(false)
            refetchProfile()
        }

        fn()
    }

    // select default network
    useEffect(() => {
        setSelectedWithdrawNetwork(
            data?.withdrawList?.length ? data.withdrawList[0] : {}
        )
    }, [data?.withdrawList])

    // reset wallets on network select
    useEffect(() => {
        setSelectedWithdrawWallet({})
    }, [selectedWithdrawNetwork])

    // reset invoice
    useEffect(() => {
        if (!isModalOpen) {
            reset()
        }
    }, [isModalOpen])

    const { width } = useWindowSize()

    return (
        <>
            <div className={'flex flex-col gap-6'}>
                <div
                    className={
                        `flex flex-col gap-2.5 items-center justify-center ${width > 1024 ? '-mt-20' : ''}`
                    }>
                    {width > 1024 ? <div className={'logo-wrapper'}>
                        <img
                            src={
                                secondAsset?.info?.id === 'irt'
                                    ? require('../../assets/images/tooman.png')
                                    : SOCKET_URL +
                                    `assets/icon/${secondAsset?.info.id}.png`
                            }
                            width={72}
                            height={72}
                            alt={' '}
                        />
                    </div> :
                        <img
                            src={
                                secondAsset?.info?.id === 'irt'
                                    ? require('../../assets/images/tooman.png')
                                    : SOCKET_URL +
                                    `assets/icon/${secondAsset?.info.id}.png`
                            }
                            width={40}
                            height={40}
                            alt={' '}
                        />
                    }

                    <h4 className={'text-lg fontBold '}>
                        <Text
                            tid={
                                state === 'buy'
                                    ? 'buy-invoice'
                                    : 'sell-invoice'
                            }
                            className='text-dark-secondary dark:text-white fontBold'
                        />
                    </h4>
                </div>

                <hr className={'opacity-10'} />

                {/* {withdrawStep === 1 && (
                        <div className={'flex items-center justify-center gap-3'}>
                            <div
                                onClick={(e) => {
                                    setWithdrawStep(1)
                                    setIsDirect(false)
                                }}
                                className={`rounded-md ${!isDirect ? 'bg-primary' : ''} cursor-pointer p-2 shadow`}
                            >
                                <Text tid={isBuying ? 'internal-wallet' : 'internal-account'} />
                            </div>
                            <div
                                onClick={(e) => setIsDirect(true)}
                                className={`rounded-md ${isDirect ? 'bg-primary' : ''} cursor-pointer p-2 shadow`}
                            >
                                <Text tid={isBuying ? 'external-wallet' : 'external-account'} />
                            </div>
                        </div>
                    )} */}

                {/*{((isDirect && withdrawStep === 1) || !isDirect) && (*/}
                {/*)}*/}

                {withdrawStep === 2 && (
                    <div className={'card card-success'}>
                        <div
                            className={
                                'p-3 text-center flex items-center justify-center gap-2'
                            }>
                            <i className={'fad fa-badge-check'} />
                            <b>
                                <Text
                                    tid={
                                        isBuying
                                            ? 'buy-payment-succeed'
                                            : 'sell-payment-succeed'
                                    }
                                />
                            </b>
                        </div>
                    </div>
                )}

                {loadingWages ? (
                    <div
                        className={
                            'bg-white-overlay dark:bg-dark-secondary p-4 rounded-md text-lg flex justify-center items-center min-h-[92px]'
                        }>
                        <ClipLoader
                            size={24}
                            color={getMainTheme(theme, 'fa').color}
                            className={'mx-auto'}
                        />
                    </div>
                ) : (
                    <Calculations
                        step={withdrawStep}
                        network={selectedWithdrawNetwork}
                        isDirect={isDirect}
                        state={state}
                        data={data}
                        firstAsset={firstAsset}
                        secondAsset={secondAsset}
                        coin={coin}
                    />
                )}

                {isDirect && withdrawStep === 2 && (
                    <SelectWalletOrAccount
                        isDirect={isDirect}
                        network={selectedWithdrawNetwork}
                        setNetwork={setSelectedWithdrawNetwork}
                        setAccount={setSelectedWithdrawBankAccount}
                        setWallet={setSelectedWithdrawWallet}
                        state={state}
                        data={data}
                    />
                )}

                <div
                    className={
                        'flex items-center flex-wrap justify-between gap-3'
                    }>
                    <div>
                        {/*{withdrawStep > 1 && (*/}
                        {/*	<Button onClick={() => setWithdrawStep(1)} variant={'transparent'}>*/}
                        {/*		<Text tid={'previous-step'} />*/}
                        {/*	</Button>*/}
                        {/*)}*/}
                    </div>
                    <div
                        className={
                            'flex items-center justify-between gap-3 w-full'
                        }>
                        <div
                            // disabled={loading} loading={loading}
                            onClick={close}
                            className={
                                'grow text-sm text-center bg-gray-300 text-heading px-6 py-2 rounded-md shadow cursor-pointer'
                            }>
                            <Text tid={'cancel'} />
                        </div>
                        <div
                            onClick={order}
                            className={
                                'grow text-sm text-center bg-cBlue px-6 py-2 rounded-md shadow cursor-pointer'
                            }>
                            <Text tid={'go-on'} className={'text-white'} />
                        </div>
                    </div>
                </div>

                {/*{isDevelopment() && (*/}
                {/*	<pre dir={'ltr'} className={'invoice-info text-left'}>*/}
                {/*		{JSON.stringify(data, null, '\t')}*/}
                {/*		<br />*/}
                {/*		{JSON.stringify(calculatedData, null, '\t')}*/}
                {/*	</pre>*/}
                {/*)}*/}
            </div>
        </>
    )
}

const Calculations = ({
    network,
    isDirect,
    step = 1,
    state,
    firstAsset,
    secondAsset,
    data,
    coin,
}) => {
    const {
        main: { lang },
    } = useMainContext()
    const { width } = useWindowSize()
    const isBuying = state === 'buy'
    const isSelling = !isBuying

    const [calculatedData, setCalculatedData] = useState({ raw: {}, list: [] })

    const calculate = () => {
        if (!data?.wage?.maker) {
            return
        }

        const amount = isBuying ? secondAsset.amount : firstAsset.amount
        const unit = isBuying
            ? secondAsset.info.coin.toUpperCase()
            : firstAsset.info.coin.toUpperCase()
        const price = isBuying ? firstAsset.amount : secondAsset.amount
        const calculations = {
            total: {
                label: `${formatNumber(amount)} ${lang === 'fa' ? 'واحد' : 'Unit'
                    } ${unit}`,
                amount,
                price,
                show: step >= 1,
            },
            affiliate: {
                label: 'affiliate-profit',
                amount: 0,
                price: 0,
                show: step >= 1,
            },
        }

        // calculate base fees

        const feeFactor = data.wage.maker.factor
        calculations.fee = {
            label: 'fee',
            factor: feeFactor,
            amount: (amount * feeFactor) / 100,
            price: (price * feeFactor) / 100,
            show: step >= 1,
        }

        // calculate fees based on network

        if (isDirect && step === 2) {
            let newAmount = 1

            if (isBuying && network?.network) {
                const factorPrice = (network.feeFactor * amount) / 100
                const factor = Math.min(factorPrice, network.feeMax)

                calculations.withdrawFee = {
                    label: 'withdraw-fee',
                    amount: factor,
                    price:
                        (factor * calculations.fee.price) /
                        calculations.fee.amount,
                    show: step === 2,
                }
            } else if (isSelling) {
                const factorPrice = (data.withdraw.feeFactor * amount) / 100
                const factor = Math.min(factorPrice, network.feeMax)

                calculations.withdrawFee = {
                    label: 'transfer-fee',
                    amount: factor,
                    price:
                        (factor * calculations.fee.price) /
                        calculations.fee.amount,
                    show: step === 2,
                }
            }

            // uncomment to apply discount on network fee

            // calculations.fee.price = (newAmount * calculations.fee.price) / calculations.fee.amount
            // calculations.fee.amount = newAmount
        }

        // calculate max fee

        const maxFee = data.wage.maker.max
        let totalAmountFee = calculations.fee.amount
        if (maxFee > 0 && totalAmountFee > maxFee) {
            calculations.fee.price =
                (maxFee * calculations.fee.price) / calculations.fee.amount
            calculations.fee.amount = maxFee
        }

        // calculate off over fees

        const off = data.stars.off
        calculations.off = {
            label: 'off-over-fee',
            factor: off,
            amount: (calculations.fee.amount * off) / 100,
            price: (calculations.fee.price * off) / 100,
            show: step >= 1,
        }

        const affOff = data?.affiliate?.calculated || 0
        calculations.affiliate = {
            label: 'affiliate-profit',
            amount: isBuying ? affOff : affOff / coin.sell,
            price: isBuying ? affOff * coin.buy : affOff,
            show: step >= 1,
        }

        calculations.calculated = {
            amount:
                amount -
                (calculations.fee.amount +
                    calculations.off.amount -
                    calculations.affiliate.amount ||
                    0 + (calculations?.withdrawFee?.amount || 0)),
            price:
                price -
                (calculations.fee.price +
                    calculations.off.price +
                    -(calculations.affiliate.price || 0) +
                    (calculations?.withdrawFee?.price || 0)),
        }

        setCalculatedData({
            raw: calculations,
            list: Object.entries(calculations),
        })
    }

    useEffect(calculate, [
        data,
        firstAsset,
        secondAsset,
        isDirect,
        network,
        step,
    ])

    return (
        <>
            <div
                className={
                    'bg-slate-200 dark:bg-slate-700 dark:text-white p-4 rounded-md text-lg flex flex-col gap-3.5 fontBold'
                }>
                {calculatedData.list?.length && (
                    <>
                        {calculatedData.list.map(([key, item], index) => {
                            const { label, amount, price, show } = item

                            if (label && show)
                                return (
                                    <div
                                        key={index}
                                        className={
                                            'flex flex-row gap-2 items-center justify-between flex-wrap'
                                        }>
                                        <Text
                                            tid={label}
                                            className={'text-sm'}
                                        />
                                        <div className={'flex flex-wrap gap-2'}>
                                            <p
                                                className={'flex gap-1 text-sm'}
                                                dir={'ltr'}>
                                                <span>
                                                    {formatNumber(amount)}
                                                </span>
                                                <span>
                                                    {isBuying
                                                        ? secondAsset?.info?.coin?.toUpperCase?.()
                                                        : firstAsset?.info?.coin?.toUpperCase()}
                                                </span>
                                            </p>
                                            <b>≈</b>
                                            <p className={'flex gap-1 text-sm'}>
                                                <span>
                                                    {formatNumber(price, {
                                                        type: 'irt',
                                                    })}
                                                </span>
                                                <span>
                                                    <Text tid={'toman'} />
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                )
                        })}
                    </>
                )}
            </div>

            {calculatedData?.raw?.calculated && (
                <div
                    className={
                        'bg-slate-200 dark:bg-slate-700 dark:text-light-primary p-4 rounded-md flex flex-row gap-2 items-center justify-between flex-wrap fontBold'
                    }>
                    <span className={'text-sm'}>
                        <Text
                            tid={
                                step === 2
                                    ? 'amount-to-receive'
                                    : state === 'buy'
                                        ? 'amount-to-pay'
                                        : 'amount-to-receive'
                            }
                        />
                    </span>
                    <div className={'flex flex-wrap gap-2'}>
                        <p className={'flex gap-1 text-sm'} dir={'ltr'}>
                            <span>
                                {formatNumber(
                                    calculatedData.raw.calculated.amount
                                )}
                            </span>
                            <span>
                                {isBuying
                                    ? secondAsset?.info?.coin?.toUpperCase?.()
                                    : firstAsset?.info?.coin?.toUpperCase()}
                            </span>
                        </p>
                        <b>≈</b>
                        <p className={'flex gap-1 text-sm'}>
                            <span>
                                {formatNumber(
                                    calculatedData.raw.calculated.price
                                )}
                            </span>
                            <span>
                                <Text tid={'toman'} />
                            </span>
                        </p>
                    </div>
                </div>
            )}

            {step === 1 && (
                <p
                    className={
                        'text-primary flex justify-center items-center gap-2'
                    }>
                    {width >= 768 && <Decoration />}
                    <Text
                        className='text-dark-secondary dark:text-white text-xs lg:text-sm font-bold lg:font-normal'
                        tid={'invoice-popup-hint'}
                    />
                </p>
            )}
        </>
    )
}

const SelectWalletOrAccount = ({
    network,
    setNetwork,
    isDirect,
    setWallet,
    setAccount,
    state,
    data,
}) => {
    const isBuying = state === 'buy'
    const isSelling = !isBuying

    return (
        <>
            {isDirect && (
                <>
                    {isBuying && (
                        <>
                            <div className={'flex flex-col gap-3'}>
                                <div
                                    className={
                                        'bg-white-overlay dark:bg-dark-secondary p-4 rounded-md text-lg flex flex-col gap-3.5 fontBold'
                                    }>
                                    <div
                                        className={
                                            'flex items-center justify-between gap-5 flex-wrap'
                                        }>
                                        <b>
                                            <Text tid={'select-network'} />
                                        </b>
                                        <div
                                            className={
                                                'flex gap-3 flex-wrap grow justify-end'
                                            }>
                                            {data?.withdrawList?.length && (
                                                <>
                                                    {data.withdrawList.map(
                                                        (item, index) => {
                                                            const isActive =
                                                                item.network ===
                                                                network.network
                                                            return (
                                                                <div
                                                                    className={
                                                                        'shrink'
                                                                    }
                                                                    key={index}
                                                                    onClick={() =>
                                                                        setNetwork(
                                                                            item
                                                                        )
                                                                    }>
                                                                    {
                                                                        item.network
                                                                    }
                                                                </div>
                                                            )
                                                        }
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {!!network?.network && (
                                    <div
                                        className={
                                            'bg-white-overlay dark:bg-dark-secondary p-4 rounded-md text-lg'
                                        }>
                                        <div
                                            className={
                                                'flex items-center justify-between gap-5 flex-wrap'
                                            }>
                                            <b className={''}>
                                                <Text tid={'select-wallet'} />
                                            </b>

                                            <div
                                                className={
                                                    'flex items-center gap-2'
                                                }
                                                style={{ minWidth: 0 }}>
                                                <div
                                                    className={'grow'}
                                                    style={{
                                                        minWidth: 0,
                                                        maxWidth: 300,
                                                    }}>
                                                    <WalletDropdown
                                                        onChange={(wallet) =>
                                                            setWallet(wallet)
                                                        }
                                                        network={
                                                            network.network
                                                        }
                                                    />
                                                </div>

                                                <Link
                                                    className={
                                                        'btn btn-transparent btn-rounded'
                                                    }
                                                    href={'#'}>
                                                    <AiFillPlusCircle
                                                        size={18}
                                                    />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                    {isSelling && (
                        <>
                            <div
                                className={
                                    'bg-white-overlay dark:bg-dark-secondary p-4 rounded-md text-lg'
                                }>
                                <div
                                    className={
                                        'flex items-center justify-between gap-5 flex-wrap'
                                    }>
                                    <b className={''}>
                                        <Text tid={'select-bank-account'} />
                                    </b>

                                    <div
                                        className={
                                            'grow flex items-center gap-2 justify-end'
                                        }
                                        style={{ minWidth: 0 }}>
                                        <div
                                            className={'grow'}
                                            style={{
                                                minWidth: 0,
                                                maxWidth: 300,
                                            }}>
                                            <BankAccountDropdown
                                                onChange={(account) =>
                                                    setAccount(account)
                                                }
                                            />
                                        </div>

                                        <Link
                                            className={
                                                'btn btn-transparent btn-rounded'
                                            }
                                            href={'#'}>
                                            <i
                                                className={'fad fa-plus-circle'}
                                            />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </>
    )
}

const Decoration = styled.div`
    width: 12px;
    height: 12px;
    border-radius: 3px;
    transform: rotate(45deg);
    background-color: ${(props) => props.theme.mainOrange};
`

const useOtcCalculate = () => {
    const {
        profile: { token },
    } = useMainContext()

    return useMutation('otc-calculate', (data) =>
        postApiWithToken(data, token, 'settings/wages/calculate')
    )
}

const tradeAPIs = {
    otc: {
        create(data, token) {
            return axios.post(BASE_URL + 'otc', data, {
                headers: {
                    'x-auth-token': token,
                },
            })
        },
    },
}

const auditAPIs = {
    coining: {
        withdraw(data, token) {
            return axios.post(BASE_URL + 'coining/withdraw', data, {
                headers: {
                    'x-auth-token': token,
                },
            })
        },
    },
    banking: {
        withdraw(data, token) {
            return axios.post(BASE_URL + 'banking/withdraw', data, {
                headers: {
                    'x-auth-token': token,
                },
            })
        },
    },
}
