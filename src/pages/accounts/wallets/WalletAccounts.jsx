import Text from "../../../core/utils/Text";
import React, {memo} from "react";
import {ClipLoader} from "react-spinners";
import {getMainTheme} from "../../../core/utils/theme";
import {ReactComponent as NotFound} from "../assets/not-found.svg";
import {useWalletAccounts} from "../utils/hooks";
import ModalLayout from "../../../components/layouts/ModalLayout";
import AddWalletAccountModal from "./AddWalletAccountModal";
import WalletCard from "../../../packages/wallet-service/WalletCard";
import Button from "../utils/Button";
import {useDeleteAccountAndCard} from "../../../core/hooks/useDeleteAccountAndCard";
import TwoFactorModal from "../../../components/modals/TwoFactorModal";


const WalletAccounts = memo(() => {


    const {
        profile, modal,
        openModal, closeModal
    } = useWalletAccounts()

    const { loading, onCheckAuth, authModal, onSubmitTwoFactorModal, closeAuthModal, accountCauses } =
        useDeleteAccountAndCard(2)

    return (
        <>
            <div className={'absolute left-2 cursor-pointer top-2 rounded-md bg-white dark:bg-slate-800 py-2 px-5 w-max'} onClick={openModal}>
                <Text tid={'add-wallet-account'} className={'lg:text-sm text-xs'} />
            </div>
            {!!profile ?
                profile.wallets.length ?
                    <div className={'flex items-center justify-center gap-8 flex-wrap mt-10'}>
                        {profile.wallets.map((item, idx) => {

                            return (
                                <div className={'max-w-[340px] flex flex-col gap-3 rounded-md p-5 bg-gray-100 dark:bg-primaryBg'}>
                                    <div className={'flex justify-center'}>
                                        <WalletCard
                                            item={item}
                                            newWallet
                                        />
                                    </div>
                                    <Button
                                        className={'lg:w-[300px] h-[32px] px-3 mt-[-30px]'}
                                        textClassName={'text-xs'}
                                        onClick={() => onCheckAuth(item, idx, 'wallet')}
                                        tid={'delete-wallet-account'}
                                        loading={loading === idx}
                                        twoStep
                                    />
                                </div>
                            )
                        })}
                    </div>
                    :
                    <div className={'w-full min-h-[260px] flex flex-col gap-2 items-center justify-center'}>
                        <NotFound width={244} height={200} />
                        <Text tid={'no-wallet-account-added'} className={'lg:text-sm text-xs text-secondary'} />
                    </div>
                :
                <div className={'w-full min-h-[260px] flex items-center justify-center'}>
                    <ClipLoader size={32} color={getMainTheme().active} />
                </div>
            }

            { /* delete two factor */ }
            <TwoFactorModal
                open={authModal.con}
                onSubmit={onSubmitTwoFactorModal}
                onClose={closeAuthModal}
                cause={accountCauses[1]}
            />

            <ModalLayout
                width={'480px'}
                open={modal}
                isStatic
            >
                <AddWalletAccountModal onClose={closeModal} />
            </ModalLayout>
        </>
    )
})

export default WalletAccounts
