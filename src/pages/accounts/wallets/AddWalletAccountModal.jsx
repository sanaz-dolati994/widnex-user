import { useAddWalletAccount } from "../utils/hooks";
import { CloseSearchIcon } from "../../../styles/CoinOperationStyles";
import React from "react";
import Text from "../../../core/utils/Text";
import Select from "../utils/Select";
import Input from "../utils/Input";
import { useMainContext } from "../../../core/contexts/main";
import Button from "../utils/Button";
import TwoFactorModal from "../../../components/modals/TwoFactorModal";


const AddWalletAccountModal = ({ onClose }) => {

    const { main: { lang } } = useMainContext()
    const {
        availableCoins, coin, setCoin,
        network, networks, setNetwork,
        address, setAddress, label, setLabel,
        valid, showError, onAction, isLoading,
        authModal, closeAuthModal, onSubmitTwoFactorModal
    } = useAddWalletAccount(onClose)

    const mappedNetworks = networks.length === 0 ? networks : networks.map(option => {
        if (option.network === 'eth') return { ...option, network: 'erc20' }
        if (option.network === 'trx') return { ...option, network: 'trc20' }
        if (option.network === 'bsc') return { ...option, network: 'bep20' }
        return option
    })

    return (
        <div className={'w-full relative'}>
            <div className={'absolute left-[-8px] top-[-12px]'} onClick={onClose}>
                <CloseSearchIcon />
            </div>
            <div className={'w-full flex flex-col gap-5 text-sm'}>
                <div className={'flex items-center justify-center'}>
                    <Text tid={'add-wallet-account'} />
                </div>
                <div className={'flex flex-col gap-1'}>
                    <Text tid={'coin'} />
                    <Select
                        options={availableCoins?.data || []}
                        value={coin}
                        onChange={setCoin}
                        dropdownClass={'min-h-[164px]'}
                        placeholder={'coinFilter'}
                        className={'w-full h-[42px] flex items-center'}
                        isCoin
                    />
                    {(showError && valid.type === 'coin') ?
                        <Text tid={'coin-is-required'} className={'text-red-500 text-xs'} />
                        : null}
                </div>
                <div className={'flex flex-col gap-1'}>
                    <Text tid={'network'} className={'text-sm text-secondary mx-1'} />
                    <Select
                        value={network}
                        options={mappedNetworks}
                        onChange={setNetwork}
                        className={'w-full h-[42px] flex items-center'}
                        dropdownClass={'min-h-[164px]'}
                        placeholder={'select-network'}
                        selector={'network'}
                    />
                    {(showError && valid.type === 'network') ?
                        <Text tid={'network-is-required'} className={'text-red-500 text-xs'} />
                        : null}
                </div>
                <div className={'flex flex-col gap-1'}>
                    <Text tid={'wallet-address'} />
                    <Input
                        value={address}
                        onChange={setAddress}
                        className={'w-full h-[42px]'}
                        placeholder={lang === 'fa' ? 'آدرس کیف پول را وارد کنید.' : 'Wallet Address'}
                        hasError={valid.type === 'address' && showError}
                        error={'address-is-required'}
                    />
                </div>
                <div className={'flex flex-col gap-1'}>
                    <Text tid={'label'} />
                    <Input
                        value={label}
                        onChange={setLabel}
                        className={'w-full h-[42px]'}
                        placeholder={lang === 'fa' ? 'لطفا نام دلخواه را وارد نمایید' : 'label'}
                        hasError={valid.type === 'label' && showError}
                        error={'label-is-required'}
                    />
                </div>
                <div className={'w-full grid grid-cols-2 gap-2 mt-3'}>
                    <Button
                        tid={'add-new-bank-account'}
                        onClick={onAction}
                        loading={isLoading}
                        valid={valid.con}
                        btnWrapperClassName='bg-cBlue text-white'
                    />
                    <Button
                        tid={'cancel'}
                        onClick={onClose}
                        btnWrapperClassName='bg-transparent border border-borderPrimary'
                    />
                </div>
            </div>
            <TwoFactorModal
                open={authModal}
                onSubmit={onSubmitTwoFactorModal}
                onClose={closeAuthModal}
                cause={'WHITE_LIST_WALLET'}
            />
        </div>
    )
}

export default AddWalletAccountModal
