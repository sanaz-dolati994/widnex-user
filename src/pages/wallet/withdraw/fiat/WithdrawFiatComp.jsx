import Text from "../../../../core/utils/Text";
import Input from "../../utils/Input";
import {formatNumber} from "../../../../core/utils/common";
import ChooseAccount from "../../utils/ChooseAccount";
import {ClipLoader} from "react-spinners";
import TransactionTable from "../../TransactionsTable";
import React from "react";
import {useMainContext} from "../../../../core/contexts/main";
import {useWithdrawFiat} from "../../utils/hooks";
import TwoFactorModal from "../../../../components/modals/TwoFactorModal";
import {Link} from "react-router-dom";
import FeeContainer from "../../utils/FeeContainer";


const WithdrawFiatComp = () => {

    const { main: { lang } } = useMainContext()
    const {
        amount, setAmount,
        bankAccount, setBankAccount,
        showError, onAction, profile,
        validAction, withdrawLoading,
        authModal, setAuthModal, onSubmitTwoFactorModal,
    } = useWithdrawFiat()

    return (
        <>
            <div className={'max-w-[1200px] mx-auto text-black dark:text-white mt-12'}>
                <div className={'w-full bg-white dark:bg-secondaryBg rounded-md p-6 min-h-[300px] shadow-md relative'}>
                    <Link to={'/wallets/withdrawCoin'}>
                        <div className={'absolute left-2 cursor-pointer top-2 rounded-md bg-white dark:bg-slate-800 py-2 px-5 w-max'}>
                            <Text tid={'withdrawCoin'} className={'lg:text-sm text-xs'} />
                        </div>
                    </Link>
                    <div className={'flex lg:justify-center text-lg mb-3'}>
                        <Text tid={'withdraw-fiat'} />
                    </div>
                    <div className={'flex flex-col mx-auto max-w-[400px] justify-center items-center gap-5 mt-10'}>
                        <div className={'w-full flex flex-col gap-1'}>
                            <Text tid={'withdraw-in-tooman'} className={'text-secondary text-sm'} />
                            <Input
                                value={amount}
                                onChange={setAmount}
                                placeholder={lang === 'fa' ? 'مقدار را وارد کنید.' : 'Please Enter Amount'}
                                hasError={showError && validAction.type === 'amount'}
                                error={validAction.error}
                                number
                            />
                            <div className={'flex items-center gap-1 text-xs mt-1'}>
                                <Text tid={'balance-can-withdraw'} />
                                <span>{formatNumber(profile?.balance || 0, { type: 'irt' })}</span>
                                <span>تومان</span>
                            </div>
                        </div>
                        <div className={'w-full'}>
                            <ChooseAccount
                                label={'choose-bank-account'}
                                onOptionChange={setBankAccount}
                                value={bankAccount}
                                type={'bank'}
                                className={'mt-2 mx-auto'}
                            />
                            {(showError && validAction.type === 'bankAccount') &&
                                <div className={'flex justify-center'}>
                                    <Text tid={validAction.error} className={'text-red-500 text-xs mt-2'} />
                                </div>
                            }
                        </div>

                        <div className={'mt-4'}>
                            <FeeContainer type={'bank'} flow={'withdraw'} amount={amount}/>
                        </div>

                        <div
                            className=
                                {`rounded-md flex items-center justify-center mx-auto shadow-md mt-4 
                        w-full lg:w-[400px] h-[42px] ${validAction.valid ? 'bg-active text-black' :
                                    'dark:bg-gray-800 bg-gray-400  text-secondary'} cursor-pointer hover:brightness-110 transition`
                                }
                            onClick={onAction}
                        >
                            {withdrawLoading ?
                                <ClipLoader size={24} />
                                :
                                <Text tid={'withdraw'} className={'text-sm'} />
                            }
                        </div>
                    </div>
                </div>
                <div className={'w-full bg-white dark:bg-secondaryBg rounded-md py-6 px-3 lg:p-6 min-h-[300px] shadow-md mt-6'}>
                    <TransactionTable
                        flow='withdraw'
                        type={'bank'}
                    />
                </div>
            </div>

            <TwoFactorModal open={authModal} onSubmit={onSubmitTwoFactorModal} onClose={() => setAuthModal(false)} cause={'withdraw'}/>
        </>
    )
}

export default WithdrawFiatComp
