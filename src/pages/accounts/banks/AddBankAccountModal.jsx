import Text from "../../../core/utils/Text";
import Input from "../utils/Input";
import React, { useMemo, useState } from "react";
import { useMainContext } from "../../../core/contexts/main";
import Button from "../utils/Button";
import getBankInfo from "../../../packages/bank-service/Bank";
import TwoFactorModal from "../../../components/modals/TwoFactorModal";
import { useAuthContext } from "../../../core/contexts/auth";
import { useProfileUpdateMutation } from "../../../core/services/react-query/useProfileQuery";
import { CloseSearchIcon } from "../../../styles/CoinOperationStyles";
import { useAddBankAccount } from "../utils/hooks";


const AddBankAccountModal = ({ onClose }) => {

    const { main: { lang } } = useMainContext()
    const {
        cardNo, setCardNo,
        shebaNo, setShebaNo,
        label, setLabel,
        authModal, onSubmitTwoFactorModal,
        onAction, showError, valid,
        isLoading, closeAuthModal
    } = useAddBankAccount(onClose)

    return (
        <div className={'relative'}>
            <div className={'absolute left-[-8px] top-[-12px]'} onClick={onClose}>
                <CloseSearchIcon />
            </div>
            <div className={'flex flex-col gap-5 text-sm'}>
                <div className={'flex items-center justify-center'}>
                    <Text tid={'add-bank-account'} />
                </div>
                <div className={'flex flex-col gap-1'}>
                    <Text tid={'card-number'} />
                    <Input
                        value={cardNo}
                        onChange={setCardNo}
                        className={'w-full h-[42px]'}
                        type={'card'}
                        placeholder={'---- ---- ---- ----'}
                        hasError={valid.type === 'cardNo' && showError}
                        error={'card-not-valid'}

                    />
                </div>
                <div className={'flex flex-col gap-1'}>
                    <Text tid={'shaba-number'} />
                    <Input
                        value={shebaNo}
                        onChange={setShebaNo}
                        className={'w-full h-[42px]'}
                        placeholder={'-- ---- ---- ---- ---- --'}
                        type={'sheba'}
                        hasError={valid.type === 'shebaNo' && showError}
                        error={'sheba-not-valid'}
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
                <div className={'flex items-center justify-center gap-2'}>
                    <Button
                        tid={'add-new-bank-account'}
                        onClick={onAction}
                        loading={isLoading}
                        valid={valid.con}
                        className={'w-1/2'}
                        btnWrapperClassName='bg-cBlue text-white'
                    />
                    <Button
                        tid={'cancel'}
                        onClick={onClose}
                        className={'w-1/2'}
                        btnWrapperClassName='bg-transparent border border-borderPrimary'
                    />
                </div>

            </div>

            <TwoFactorModal
                open={authModal}
                onSubmit={onSubmitTwoFactorModal}
                onClose={closeAuthModal}
                cause={'WHITE_LIST_ACCOUNT'}
            />
        </div>
    )
}

export default AddBankAccountModal
