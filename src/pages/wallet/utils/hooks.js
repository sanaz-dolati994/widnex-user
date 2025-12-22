import { useEffect, useMemo, useState } from "react";
import { useAvailableCoinsQuery } from "../../../core/services/react-query/useAvailableCoinsQuery";
import { stringToNumber } from "../../../core/utils/common";
import {
    useBankDepositMutation,
    useBankWithdrawMutation,
    useWithdrawMutation
} from "../../../core/services/react-query/useWalletQuery";
import { useQueryContext } from "../../../core/contexts/query";
import { useAuthContext } from "../../../core/contexts/auth";
import { useGetFiatSetting } from "../../../core/services/react-query/useSetting";
import { useProfileQuery } from "../../../core/services/react-query/useProfileQuery";
import useAvailableBanks from "../../../core/hooks/useAvailableBanks";
import { useAddWalletAccount } from "../../accounts/utils/hooks";


export const useWithdrawCoin = () => {

    const { setNetwork, network: walletNetwork, valid: addWalletIsValid, address, setAddress, label, setLabel, onAction: onAddWalletAction, setCoin: setWalletCoin, availableCoins, setShowError: setAddWalletError, showError: showAddWalletError, isLoading: addWalletIsLoading } = useAddWalletAccount()

    const [showAddWallet, setShowAddWallet] = useState(false)
    const [amount, setAmount] = useState('')
    const [coin, setCoin] = useState('')
    const [networks, setNetworks] = useState([])
    const [wallet, setWallet] = useState(null)
    const [showError, setShowError] = useState(false)

    useEffect(() => {
        if (!!availableCoins && !!coin) {
            const c = availableCoins?.data?.find(x => x.id === coin.id)
            setNetworks(c?.withdrawList || [])
            // setNetwork('')
        }
    }, [coin, availableCoins])

    useEffect(() => {
        if (wallet && showAddWallet) {
            setShowAddWallet(false)
        }
    }, [wallet])

    useEffect(() => {
        if (!!coin) {
            setWalletCoin(coin)
        }
    }, [coin])

    const network = useMemo(() => {
        if (!!coin && !!wallet) {
            const ns = coin.withdrawList.filter(x => x.network === wallet.network)
            if (ns.length) {
                // setNetwork(ns[0])
                return ns[0]
            }
        }
        return {}
    }, [coin, wallet])

    const { data: profile } = useProfileQuery()
    const balance = useMemo(() => {
        return profile?.coins.find(x => x.coin === coin?.id)?.amount || 0
    }, [profile, coin])

    const validAction = useMemo(() => {
        if (!coin) return { type: 'coin', error: 'coin-is-required' }
        if (!wallet && !showAddWallet && !addWalletIsValid.con) return { type: 'wallet', error: 'wallet-is-required' }
        if (!!amount) {
            if (stringToNumber(amount) > balance) return { type: 'amount', error: 'amount-bigger-balance' }
            if (stringToNumber(amount) > network.max) return { type: 'amount', error: 'amount-bigger-max' }
            if (stringToNumber(amount) < network.min) return { type: 'amount', error: 'amount-lesser-min' }
        } else return { type: 'amount', error: 'amount-is-required' }
        return { valid: true, error: null }
    }, [coin, wallet, amount, network, balance, showAddWallet, addWalletIsValid])


    // Action
    const { mutate: withdraw, isLoading: loading } = useWithdrawMutation({
        callback: () => {
            setAmount('')
            setWallet(null)
        },
    })

    const sendWithdraw = (authData = null, newWallet = null) => {
        let floatAmount = parseFloat(stringToNumber(amount))
        const payload = {
            amount: floatAmount,
            coin: coin.id,
            wallet: newWallet ? newWallet.id : wallet.id,
            network: newWallet ? newWallet.network : wallet.network,
            blockchain: network?.blockchain,
        }


        if (authData?.otp) payload.otp = authData.otp
        if (authData?.ga) payload.ga = authData.ga
        withdraw(payload)
        if (showAddWallet) {
            setAddress('')
            setNetwork('')
            setLabel('')
            setCoin(null)
            setAmount('')
            setShowAddWallet(false)
        }
    }

    const { profileSettings } = useAuthContext()
    const [authModal, setAuthModal] = useState(false)
    const onSubmitTwoFactorModal = (authData) => {
        sendWithdraw(authData)
    }

    const onWithdrawClicked = () => {
        if (loading) return
        if (showAddWallet) {
            if (addWalletIsValid) {
                onAddWalletAction().then(res => {
                    const addedWallet = res.data.data.wallets.find(wallet => {
                        return wallet.address === address
                    })
                    sendWithdraw(null, addedWallet)
                })
            }

            if (!addWalletIsValid.con) {
                setAddWalletError(true)
                return;
            }
        }

        if (validAction.valid) {
            if (
                profileSettings?.settings?.twoFactor?.onWithdraw
            )
                setAuthModal(true)
            else
                sendWithdraw()
        } else setShowError(true)
    }

    return {
        availableCoins, coin, setCoin,
        amount, setAmount,
        wallet, setWallet,
        network, validAction, showError,
        onSubmitTwoFactorModal, onWithdrawClicked,
        authModal, setAuthModal, loading,
        balance, setShowAddWallet, showAddWallet, networks, setNetworks,
        setNetwork, walletNetwork, addWalletIsValid, address, setAddress, label, setLabel, showAddWalletError, addWalletIsLoading

    }
}

const useDepositFiatOperation = ({ bankAccount, amount, port }) => {

    const { setToast } = useQueryContext()

    const onDepositSuccess = (res) => {
        setToast({
            isError: false,
            show: true,
            message: 'sendto-bank-port',
        })
        window.location.href = res?.data?.data?.link
    }

    const { mutate: deposit, isLoading: depositLoading } = useBankDepositMutation(onDepositSuccess)

    const onOperationClicked = (authData = null) => {
        if (depositLoading) return
        const account = bankAccount?.id
        let payload = { amount: parseFloat(stringToNumber(amount)), account }
        if (authData?.otp) payload.otp = authData.otp
        if (authData?.ga) payload.ga = authData.ga
        payload = { ...payload, gateway: port }
        deposit(payload)
    }

    const { profileSettings } = useAuthContext()
    const [authModal, setAuthModal] = useState(false)
    const onSubmitTwoFactorModal = (authData) => {
        onOperationClicked(authData)
    }

    return {
        profileSettings,
        onOperationClicked,
        authModal, setAuthModal,
        onSubmitTwoFactorModal,
        depositLoading
    }
}

export const useDepositFiat = () => {

    const { data: fiatSetting } = useGetFiatSetting()

    const [step, setStep] = useState(1)
    const [amount, setAmount] = useState('')
    const [ports, setPorts] = useState([])
    const [port, setPort] = useState()
    const [depositType, setDepositType] = useState(null)
    const [bankAccount, setBankAccount] = useState(null)

    useEffect(() => {
        if (!!fiatSetting && fiatSetting.banks.length > 0) {
            if (fiatSetting.banks.length > 1) setPorts(fiatSetting.banks)
            else setPort(fiatSetting.banks[0].id)
        }
    }, [fiatSetting])

    // deposit with id
    const [depositIdModal, setDepositIdModal] = useState(false)

    // normal deposit
    const {
        profileSettings,
        onOperationClicked,
        authModal, setAuthModal,
        onSubmitTwoFactorModal,
        depositLoading
    } = useDepositFiatOperation({ bankAccount, amount, port })

    const { setToast } = useQueryContext()
    const onAction = () => {
        if (step === 1) setStep(2)
        if (step === 2) {
            if (!!depositType) setStep(3)
            else setToast({
                message: '.لطفا یکی از گزینه ها را انتخاب کنید', isError: true, show: true
            })
        }
        if (step === 3) {
            if (depositType === 'deposit-id' && !!bankAccount) setDepositIdModal(true)
            if (depositType === 'bank-gateway' && !!bankAccount) {
                if (profileSettings?.settings?.twoFactor?.onDeposit) setAuthModal(true)
                else onOperationClicked()
            }
        }
    }


    const newActionHandler = (depositType) => {
        if (depositType === 'deposit-id' && !!bankAccount) setDepositIdModal(true)
        if (depositType === 'bank-gateway' && !!bankAccount) {
            if (profileSettings?.settings?.twoFactor?.onDeposit) setAuthModal(true)
            else onOperationClicked()
        }
    }

    const onBack = () => {
        setDepositType('')
        setStep(state => state - 1)
    }

    const onFinish = () => {
        setStep(1)
        setAmount('')
        setDepositType(null)
        setBankAccount(null)
        setDepositIdModal(false)
    }


    return {
        step, amount, setAmount,
        bankAccount, setBankAccount,
        depositType, setDepositType,
        depositIdModal, onFinish, onBack,
        onAction, depositLoading,
        authModal, setAuthModal,
        onSubmitTwoFactorModal,
        port, setPort, ports, newActionHandler
    }
}


export const useWithdrawFiat = () => {

    const { data: profile } = useProfileQuery()

    const [amount, setAmount] = useState('')
    const [bankAccount, setBankAccount] = useState(null)
    const [showError, setShowError] = useState(false)
    const { availableBanks } = useAvailableBanks()

    const validAction = useMemo(() => {
        const withdrawFee = availableBanks?.data?.withdraw
        if (!!amount) {
            if (stringToNumber(amount) > profile?.balance) return { type: 'amount', error: 'amount-bigger-balance' }
            if (stringToNumber(amount) < withdrawFee.min) return { type: 'amount', error: 'amount-lesser-min' }
            if (stringToNumber(amount) > withdrawFee.max) return { type: 'amount', error: 'amount-bigger-max' }
        } else return { type: "amount", error: "amount-is-required" }
        if (!bankAccount) return { type: 'bankAccount', error: 'bank-account-error' }
        return { valid: true, error: null }
    }, [amount, bankAccount, profile, availableBanks])


    const { mutate: withdraw, isLoading: withdrawLoading } = useBankWithdrawMutation({
        callback: () => {
            setAmount('')
            setBankAccount(null)
        },
    })

    const { profileSettings } = useAuthContext()
    const [authModal, setAuthModal] = useState(false)

    const onOperationClicked = (authData = null) => {
        const account = bankAccount?.id
        let payload = { amount: parseFloat(stringToNumber(amount)), account }
        if (authData?.otp) payload.otp = authData.otp
        if (authData?.ga) payload.ga = authData.ga
        withdraw(payload)
    }

    const onSubmitTwoFactorModal = (authData) => {
        onOperationClicked(authData)
    }

    const onAction = () => {
        if (withdrawLoading) return
        if (validAction.valid) {
            if (profileSettings?.settings?.twoFactor?.onWithdraw) setAuthModal(true)
            else onOperationClicked()
        }
        else setShowError(true)
    }

    return {
        amount, setAmount,
        bankAccount, setBankAccount,
        showError, onAction,
        profile, validAction,
        withdrawLoading,
        authModal, setAuthModal, onSubmitTwoFactorModal,
    }
}
