import { useProfileQuery, useProfileUpdateMutation } from "../../../core/services/react-query/useProfileQuery";
import { useEffect, useMemo, useState } from "react";
import { useGetFiatDepositAccount, useUpdateFiatDepositAccounts } from "../../../core/services/react-query/useSetting";
import getBankInfo from "../../../packages/bank-service/Bank";
import { useAuthContext } from "../../../core/contexts/auth";
import { useAvailableCoinsQuery } from "../../../core/services/react-query/useAvailableCoinsQuery";


let loadingAddToDepositId = -1
export const useBankAccounts = () => {


    const { data: profile } = useProfileQuery()
    const [modal, setModal] = useState(false)
    const closeModal = () => setModal(false)
    const openModal = () => setModal(true)

    const { data: accountsWithId, isLoading: loadingDepositWithId } = useGetFiatDepositAccount()

    const banks = useMemo(() => {
        let temp = []
        if (!!profile) {
            profile.banks.forEach(b => {
                let newBank = { ...b }
                const hasId = accountsWithId?.userIbans.includes(b.shebaNo) || false
                newBank.hasId = hasId
                temp.push(newBank)
            })
        }
        return temp
    }, [profile, accountsWithId])


    const { mutateAsync } = useUpdateFiatDepositAccounts()
    const onDepositWithIdAction = async (account, idx) => {
        const userIbans = accountsWithId?.userIbans || []
        let newUserIbans = [...userIbans]
        if (account.hasId) {
            let removedList = []
            for (let i = 0; i < newUserIbans.length; i++) {
                if (newUserIbans[i] !== account.shebaNo) removedList.push(newUserIbans[i])
            }
            newUserIbans = [...removedList]
        }
        else newUserIbans.push(account.shebaNo)

        loadingAddToDepositId = idx
        try {
            await mutateAsync({ ibans: newUserIbans })
            loadingAddToDepositId = -1
        } catch (_) {
            loadingAddToDepositId = -1
        }
    }

    return {
        modal, openModal, closeModal,
        banks, onDepositWithIdAction,
        loadingAddToDepositId, profile,
        loadingDepositWithId
    }
}

export const useAddBankAccount = (onClose) => {

    const [cardNo, setCardNo] = useState('')
    const [shebaNo, setShebaNo] = useState('')
    const [label, setLabel] = useState('')
    const [showError, setShowError] = useState(false)

    const valid = useMemo(() => {
        if (cardNo?.length === 19) {
            const bankInfo = getBankInfo(cardNo)
            if (!bankInfo) return { con: false, type: 'cardNo' }
        } else return { con: false, type: 'cardNo' }
        if (shebaNo.length !== 24) {
            return { con: false, type: 'shebaNo' }
        }
        if (!label) return { con: false, type: 'label' }
        return { con: true, type: null }
    }, [cardNo, shebaNo, label])

    const { mutate: updateProfile, isLoading, } = useProfileUpdateMutation(onClose)

    // two factor add account
    const [authModal, setAuthModal] = useState(false)
    const closeAuthModal = () => setAuthModal(false)
    const onSubmitTwoFactorModal = (authData = null) => {
        const data = {
            banks: {
                cardNo: cardNo.replaceAll(' ', ''),
                shebaNo: 'IR' + shebaNo,
                label
            },
        }
        if (authData?.otp) data.otp = authData.otp
        if (authData?.ga) data.ga = authData.ga
        updateProfile(data)
    }

    const { profileSettings } = useAuthContext()
    const onAction = () => {
        if (isLoading || !valid.con) {
            setShowError(true)
            return
        }
        if (profileSettings?.settings?.twoFactor?.onWhiteListAccount) {
            setAuthModal(true)
        } else {
            onSubmitTwoFactorModal()
        }
    }

    return {
        cardNo, setCardNo,
        shebaNo, setShebaNo,
        label, setLabel,
        authModal, onSubmitTwoFactorModal,
        onAction, showError, valid,
        isLoading, closeAuthModal
    }
}


export const useWalletAccounts = () => {

    const { data: profile } = useProfileQuery()
    const [modal, setModal] = useState(false)
    const closeModal = () => setModal(false)
    const openModal = () => setModal(true)

    return {
        profile, modal,
        openModal, closeModal,
    }
}


export const useAddWalletAccount = (onClose) => {

    const [coin, setCoin] = useState(null)
    const [networks, setNetworks] = useState([])
    const [network, setNetwork] = useState('')
    const [address, setAddress] = useState('')
    const [label, setLabel] = useState('')
    const [showError, setShowError] = useState(false)


    const {
        data: availableCoins
    } = useAvailableCoinsQuery()
    useEffect(() => {

        if (!!availableCoins && !!coin) {
            const c = availableCoins?.data?.find(x => x.id === coin.id)
            setNetworks(c?.withdrawList || [])
            setNetwork('')
        }
    }, [coin, availableCoins])

    const valid = useMemo(() => {
        if (!coin) return { con: false, type: 'coin' }
        if (!network) return { con: false, type: 'network' }
        if (!address) return { con: false, type: 'address' }
        // if (!label) return { con: false, type: 'label' }
        return { con: true, type: null }
    }, [coin, network, address])

    const { mutate: updateProfile, isLoading, mutateAsync: updateProfileAsync } = useProfileUpdateMutation(onClose)

    const getNetwork = (network) => {
        if (network === 'erc20') return 'eth'
        if (network === 'trc20') return 'trx'
        if (network === 'bep20') return 'bsc'
        return network
    }

    // two factor
    const [authModal, setAuthModal] = useState(false)
    const closeAuthModal = () => setAuthModal(false)
    const { profileSettings } = useAuthContext()


    const onSubmitTwoFactorModal = async (authData = null) => {
        const data = {
            wallets: {
                coin: coin.id,
                address,
                label: label || 'Tag',
                network: getNetwork(network.network),
            },
        };
        if (authData?.otp) data.otp = authData.otp;
        if (authData?.ga) data.ga = authData.ga;

        return updateProfileAsync(data);
    };

    const onAction = async () => {
        try {
            if (isLoading) return;

            if (!valid.con) {
                setShowError(true);
                return;
            }

            if (profileSettings?.settings?.twoFactor?.onWhiteListWallet) {
                setAuthModal(true);
                return;
            } else {
                const response = await onSubmitTwoFactorModal();
                return response;
            }
        } catch (error) {
            throw error;
        }
    };



    return {
        availableCoins, coin, setCoin,
        network, networks, setNetwork,
        address, setAddress, label, setLabel,
        valid, showError, onAction, isLoading,
        authModal, closeAuthModal, onSubmitTwoFactorModal,
        setShowError
    }
}
