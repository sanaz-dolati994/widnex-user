import Text from "../../../core/utils/Text";
import {ClipLoader} from "react-spinners";
import {getMainTheme} from "../../../core/utils/theme";
import { ReactComponent as NotFound } from "../assets/not-found.svg";
import BankCard from "../../../packages/bank-service/BankCard";
import getBankInfo from "../../../packages/bank-service/Bank";
import {TransactionStatus} from "../../../styles/TransactionHistoryStyles";
import {useDeleteAccountAndCard} from "../../../core/hooks/useDeleteAccountAndCard";
import TwoFactorModal from "../../../components/modals/TwoFactorModal";
import ModalLayout from "../../../components/layouts/ModalLayout";
import AddBankAccountModal from "./AddBankAccountModal";
import {HAS_DEPOSIT_WITH_ID} from "../../../core/constants/urls";
import Button from "../utils/Button";
import {useBankAccounts} from "../utils/hooks";
import {memo} from "react";



const BankAccounts = memo(() => {

    const {
        modal, openModal, closeModal,
        banks, onDepositWithIdAction,
        loadingAddToDepositId, profile,
        loadingDepositWithId
    } = useBankAccounts()

    const { loading, onCheckAuth, authModal, onSubmitTwoFactorModal, closeAuthModal, accountCauses } =
        useDeleteAccountAndCard(1)

    return (
        <>
            <div className={'absolute left-2 cursor-pointer top-2 rounded-md bg-white dark:bg-slate-800 py-2 px-5 w-max'} onClick={openModal}>
                <Text tid={'add-bank-account'} className={'lg:text-sm text-xs'} />
            </div>
            {(!!profile && !loadingDepositWithId) ?
                banks.length ?
                    <div className={'flex items-center justify-center gap-8 flex-wrap mt-10'}>
                        {banks.map((item, idx) => {

                            const bankInfo = getBankInfo(item.cardNo)
                            return (
                                <div className={'flex flex-col gap-3 rounded-md p-5 bg-gray-100 dark:bg-primaryBg'}>
                                    <div className={'max-w-[320px] flex items-center gap-2 text-xs'}>
                                            <span>
                                                <Text tid={'status'} />
                                                <span>:</span>
                                            </span>
                                        <TransactionStatus status={item.verifyAt ? 'success' : 'pending'}>
                                            <Text tid={item.verifyAt ? 'verified' : 'Tpending'} />
                                        </TransactionStatus>
                                    </div>
                                    <div className={'flex justify-center'}>
                                        <BankCard
                                            bankAccount={item}
                                            bankInfo={bankInfo}
                                            newBank
                                        />
                                    </div>

                                    <div className={'flex flex-col gap-3 mt-3'}>
                                        {(HAS_DEPOSIT_WITH_ID && item.status === 'VERIFIED') ?
                                            <Button
                                                className={'lg:w-[300px] h-[32px] px-3'}
                                                textClassName={'text-xs'}
                                                onClick={() => onDepositWithIdAction(item, idx)}
                                                tid={item.hasId ? 'remove-from-deposit-id' : 'add-to-deposit-id'}
                                                loading={loadingAddToDepositId === idx}
                                            />
                                            : <div />}
                                        <Button
                                            className={'lg:w-[300px] h-[32px] px-3'}
                                            textClassName={'text-xs'}
                                            onClick={() => onCheckAuth(item, idx, 'bank')}
                                            tid={'delete-bank-account'}
                                            loading={loading === idx}
                                            twoStep
                                        />
                                    </div>

                                </div>
                            )
                        })}
                    </div>
                    :
                    <div className={'w-full min-h-[260px] flex flex-col gap-2 items-center justify-center'}>
                        <NotFound width={244} height={200} />
                        <Text tid={'no-bank-account-added'} className={'lg:text-sm text-xs text-secondary'} />
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
                cause={accountCauses[0]}
            />

            <ModalLayout
                width={'480px'}
                open={modal}
                isStatic
            >
                <AddBankAccountModal onClose={closeModal} />
            </ModalLayout>
        </>
    )
})

export default BankAccounts
