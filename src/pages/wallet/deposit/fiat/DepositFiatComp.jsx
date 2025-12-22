import Text from "../../../../core/utils/Text";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3Gateway from "./Step3Gateway";
import Step3Id from "./Step3Id";
import TransactionTable from "../../TransactionsTable";
import TwoFactorModal from "../../../../components/modals/TwoFactorModal";
import ModalLayout from "../../../../components/layouts/ModalLayout";
import DepositIdModal from "./DepositIdModal";
import {useDepositFiat} from "../../utils/hooks";
import {Link} from "react-router-dom";
import React from "react";


const DepositFiatComp = () => {

    const {
        step, amount, setAmount,
        bankAccount, setBankAccount,
        depositType, setDepositType,
        depositIdModal, onFinish, onBack,
        onAction, depositLoading,
        authModal, setAuthModal,
        onSubmitTwoFactorModal,
        port, setPort, ports
    } = useDepositFiat()

    return (
        <>
            <div className={'max-w-[1200px] mx-auto text-black dark:text-white mt-12'}>
                <div className={'w-full bg-white dark:bg-secondaryBg rounded-md p-6 min-h-[300px] shadow-md relative'}>
                    <Link to={'/wallets/depositCoin'}>
                        <div className={'absolute left-2 cursor-pointer top-2 rounded-md bg-white dark:bg-slate-800 py-2 px-5 w-max'}>
                            <Text tid={'deposit-coin'} className={'lg:text-sm text-xs'} />
                        </div>
                    </Link>
                    <div className={'flex lg:justify-center text-lg mb-3'}>
                        <Text tid={'deposit-fiat'} />
                    </div>
                    {step === 1 ?
                        <Step1
                            amount={amount}
                            setAmount={setAmount}
                            onAction={onAction}
                        />
                        : null}
                    {step === 2 ?
                        <Step2
                            depositType={depositType}
                            setDepositType={setDepositType}
                            onAction={onAction}
                            onBack={onBack}
                            amount={amount}
                        />
                        : null}
                    {(step === 3 && depositType === 'bank-gateway') ?
                        <Step3Gateway
                            bankAccount={bankAccount}
                            setBankAccount={setBankAccount}
                            onAction={onAction}
                            onBack={onBack}
                            port={port}
                            setPort={setPort}
                            ports={ports}
                            depositLoading={depositLoading}
                        />
                        : null}
                    {(step === 3 && depositType === 'deposit-id') ?
                        <Step3Id
                            bankAccount={bankAccount}
                            setBankAccount={setBankAccount}
                            onAction={onAction}
                            onBack={onBack}
                        />
                        : null}
                </div>
                <div className={'w-full bg-white dark:bg-secondaryBg rounded-md py-6 px-3 lg:p-6 min-h-[300px] shadow-md mt-6'}>
                    <TransactionTable
                        flow='deposit'
                        type={'bank'}
                    />
                </div>
            </div>

            <TwoFactorModal open={authModal} onSubmit={onSubmitTwoFactorModal} onClose={() => setAuthModal(false)} cause={'deposit'}/>

            <ModalLayout
                width={'500px'}
                open={depositIdModal}
                isStatic
            >
                <DepositIdModal
                    onFinish={onFinish}
                />
            </ModalLayout>
        </>
    )
}

export default DepositFiatComp
