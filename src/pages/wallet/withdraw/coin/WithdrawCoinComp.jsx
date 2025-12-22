import Text from "../../../../core/utils/Text";
import Select from "../../utils/Select";
import Input from "../../utils/Input";
import FeeContainer from "../../utils/FeeContainer";
import ChooseAccount from "../../utils/ChooseAccount";
import TransactionTable from "../../TransactionsTable";
import TwoFactorModal from "../../../../components/modals/TwoFactorModal";
import React from "react";
import {useWithdrawCoin} from "../../utils/hooks";
import {useMainContext} from "../../../../core/contexts/main";
import {ClipLoader} from "react-spinners";
import {useWindowSize} from "../../../../core/hooks/useWindowSize";
import {TABLET_SIZE} from "../../../../core/constants/common";
import {Link} from "react-router-dom";
import {formatNumber} from "../../../../core/utils/common";


const WithdrawCoinComp = () => {

    const { width } = useWindowSize()
    const { main: { lang } } = useMainContext()
    const {
        availableCoins, coin, setCoin,
        amount, setAmount,
        wallet, setWallet,
        network, validAction, showError,
        onSubmitTwoFactorModal, onWithdrawClicked,
        authModal, setAuthModal, loading, balance
    } = useWithdrawCoin()

    return (
        <>
            <div className={'max-w-[1200px] mx-auto text-black dark:text-white mt-12'}>
                <div className={'w-full bg-white dark:bg-secondaryBg rounded-md p-6 min-h-[300px] shadow-md relative'}>
                    <Link to={'/wallets/withdrawFiat'}>
                        <div className={'absolute left-2 cursor-pointer top-2 rounded-md bg-white dark:bg-slate-800 py-2 px-5 w-max'}>
                            <Text tid={'withdraw-fiat'} className={'lg:text-sm text-xs'} />
                        </div>
                    </Link>
                    <div className={'flex lg:justify-center text-lg mb-3'}>
                        <Text tid={'withdraw-coin'} />
                    </div>
                    <div className={'lg:grid lg:grid-cols-2 items-stretch'}>
                        <div className={'flex flex-col gap-8 mx-auto'}>
                            <div className={'flex flex-col gap-1'}>
                                <Text tid={'coin'} className={'text-sm text-secondary mx-1'} />
                                <Select
                                    options={availableCoins?.data || []}
                                    value={coin}
                                    onChange={setCoin}
                                    dropdownClass={'min-h-[164px]'}
                                    placeholder={'coinFilter'}
                                    className={'w-full lg:w-[400px] h-[42px] flex items-center'}
                                    isCoin
                                />
                                {(showError && validAction.type === 'coin') &&
                                    <Text tid={validAction.error} className={'text-red-500 text-xs mt-1'} />
                                }
                            </div>
                            <div className={'flex flex-col gap-1'}>
                                <Text tid={'amount'} className={'text-sm text-secondary mx-1'}  />
                                <Input
                                    value={amount}
                                    onChange={setAmount}
                                    placeholder={lang === 'fa' ? 'مقدار را وارد کنید' : 'please enter amount'}
                                    hasError={showError && validAction.type === 'amount'}
                                    error={validAction.error}
                                    number
                                />
                                {!!coin ?
                                    <div className={'flex items-center gap-1 text-xs mt-1'}>
                                        <Text tid={'balance-can-withdraw'} />
                                        <span>{formatNumber(balance || 0, { type: coin.id })}</span>
                                        <span>{coin.id?.toUpperCase()}</span>
                                    </div>
                                : null}
                            </div>
                            {width < TABLET_SIZE ?
                                <div className={'flex flex-col items-center mx-auto'}>
                                    <ChooseAccount
                                        label={'deposit'}
                                        type={'wallet'}
                                        coin={coin}
                                        label={'choose-wallet'}
                                        value={wallet}
                                        onOptionChange={setWallet}
                                    />
                                    {(showError && validAction.type === 'wallet') &&
                                        <Text tid={validAction.error} className={'text-red-500 text-xs mt-1'} />
                                    }
                                </div>
                            : null}
                            <div className={''}>
                                <FeeContainer flow={'withdraw'} network={network} amount={amount} coin={coin} type={'wallet'} />
                            </div>
                        </div>
                        {width > TABLET_SIZE ?
                            <div className={'flex flex-col items-center mx-auto'}>
                                <ChooseAccount
                                    label={'deposit'}
                                    type={'wallet'}
                                    coin={coin}
                                    label={'choose-wallet'}
                                    value={wallet}
                                    onOptionChange={setWallet}
                                />
                                {(showError && validAction.type === 'wallet') &&
                                    <Text tid={validAction.error} className={'text-red-500 text-xs mt-1'} />
                                }
                            </div>
                        : null}

                    </div>
                    <div
                        className=
                            {`rounded-md flex items-center justify-center mx-auto shadow-md mt-8 
                                    w-[300px] h-[42px] ${validAction.valid ? 'bg-active text-black' :
                                'dark:bg-gray-800 bg-gray-400  text-secondary'} cursor-pointer ${loading ? 'brightness-50' : ''} hover:brightness-110 transition`
                            }
                        onClick={onWithdrawClicked}
                    >
                        {loading ?
                            <ClipLoader size={24} color={'#000'} />
                            :
                            <Text tid={'withdraw'} />
                        }
                    </div>
                </div>
                <div className={'w-full bg-white dark:bg-secondaryBg rounded-md py-6 px-3 lg:p-6 min-h-[300px] shadow-md mt-6'}>
                    <TransactionTable
                        flow='withdraw'
                        type={'wallet'}
                        coin={coin}
                    />
                </div>
            </div>
            <TwoFactorModal open={authModal} onSubmit={onSubmitTwoFactorModal} onClose={() => setAuthModal(false)} cause={'withdraw'}/>
        </>
    )
}

export default WithdrawCoinComp
