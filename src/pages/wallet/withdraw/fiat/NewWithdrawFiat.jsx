import { formatNumber } from '../../../../core/utils/common'
import ChooseAccount from '../../utils/ChooseAccount'
import FeeContainer from '../../utils/FeeContainer'
import { ClipLoader } from 'react-spinners'
import TwoFactorModal from '../../../../components/modals/TwoFactorModal'
import Input from '../../utils/Input'
import { useWithdrawFiat } from '../../utils/hooks'
import Text from '../../../../core/utils/Text'
import { useMainContext } from '../../../../core/contexts/main'
import { Link } from 'react-router-dom'
import { useRunAfterUpdate } from '../../../../core/hooks/useRunAfterUpdate'
import { onInputValueChangeUtil } from '../../../../core/utils/useInputValueChange'
import HintBox from '../../../../components/common/HintBox'
import { HorizontalLine } from '../../../../styles/newStyles/MobileModal.styled'
import ModalLayout from '../../../../components/layouts/ModalLayout'
import { useEffect, useState } from 'react'

export default function NewWithdrawFiat() {
    const {
        main: { lang },
    } = useMainContext()

    const {
        amount,
        setAmount,
        bankAccount,
        setBankAccount,
        showError,
        onAction,
        profile,
        validAction,
        withdrawLoading,
        authModal,
        setAuthModal,
        onSubmitTwoFactorModal,
    } = useWithdrawFiat()
    const [hintModal, setHintModal] = useState(false)
    const onCloseHintModal = () => setHintModal(false)
    const runAfterUpdate = useRunAfterUpdate()
    const onInputChange = (e) => {
        let v = e?.target?.value
        v = onInputValueChangeUtil(e, runAfterUpdate)
        setAmount(v)
    }
    useEffect(() => { setHintModal(true) }, [])


    return (
        <div className='flex flex-col lg:flex-row gap-x-4 py-4'>
            <div className='w-full lg:w-1/2'>
                <div
                    className={
                        'flex flex-col mx-auto justify-center gap-5 mt-2'
                    }>
                    <div className={'w-full'}>
                        <div className='flex items-center justify-between'>
                            <Text tid='withdraw-to' className='text-sm' />
                            <Link
                                to='/profile/cards&accounts?tab=bank-accounts'
                                className='text-sm text-cBlue'>
                                <Text tid='add-account' />
                            </Link>
                        </div>
                        <ChooseAccount
                            label={'choose-bank-account'}
                            onOptionChange={setBankAccount}
                            value={bankAccount}
                            type={'bank'}
                            className={'mt-2 mx-auto'}
                        />
                        {showError && validAction.type === 'bankAccount' && (
                            <div className={'flex justify-center'}>
                                <Text
                                    tid={validAction.error}
                                    className={'text-red-500 text-xs mt-2'}
                                />
                            </div>
                        )}
                    </div>

                    <div className={'w-full flex flex-col gap-1'}>
                        <Text
                            tid={'withdraw-in-tooman'}
                            className={'text-secondary text-sm'}
                        />
                        <div
                            className={`border rounded-lg overflow-hidden border-gray-200 dark:border-card-border flex h-10 ${showError && validAction.type === 'amount'
                                ? 'border border-red-500'
                                : ''
                                }`}>
                            <input
                                type='text'
                                id='deposit-amount'
                                className={`h-full block w-4/5 px-4 bg-transparent`}
                                placeholder={
                                    lang === 'fa'
                                        ? 'مقدار را وارد کنید.'
                                        : 'Please Enter Amount'
                                }
                                value={amount}
                                onChange={onInputChange}
                            />
                            <div className='w-1/5 bg-gray-light dark:bg-[#172B46] flex items-center justify-center cursor-default'>
                                <Text tid='tooman' />
                            </div>
                        </div>
                        {showError && validAction.type === 'amount' && (
                            <p>
                                <Text
                                    tid={validAction.error}
                                    className={'text-red-500 text-xs'}
                                />
                            </p>
                        )}
                        <div className={'flex items-center gap-1 text-xs mt-1'} onClick={() => { setAmount(formatNumber(profile?.balance)) }}>
                            <Text tid={'balance-can-withdraw'} />
                            <span>
                                {formatNumber(profile?.balance || 0, {
                                    type: 'irt',
                                })}
                            </span>
                            <span>تومان</span>
                        </div>
                    </div>

                    <div className={'mt-4'}>
                        <FeeContainer
                            type={'bank'}
                            flow={'withdraw'}
                            amount={amount}
                        />
                    </div>

                    <HintBox
                        type='hint'
                        heading='hint'
                        body='max-withdraw-hint'
                        className='-order-1 lg:order-1'
                    />

                    <div
                        className={`rounded-md flex items-center justify-center mx-auto shadow-md mt-4 
                        w-full h-[42px] ${validAction.valid
                                ? 'bg-cBlue text-white'
                                : 'dark:bg-gray-800 bg-gray-400  text-secondary'
                            } cursor-pointer hover:brightness-110 transition`}
                        onClick={onAction}>
                        {withdrawLoading ? (
                            <ClipLoader size={24} />
                        ) : (
                            <Text
                                tid={'submit-withdraw'}
                                className={'text-sm'}
                            />
                        )}
                    </div>
                </div>
                <TwoFactorModal
                    open={authModal}
                    onSubmit={onSubmitTwoFactorModal}
                    onClose={() => setAuthModal(false)}
                    cause={'withdraw'}
                />
            </div>

            <div className='w-full mt-6 lg:mt-0 lg:w-1/2'>
                <HintBox type='warn' heading='warn' body='withdraw-hint' />
                <HorizontalLine className='my-4' />
                <HintBox
                    type='warn'
                    heading='warn'
                    body='deposit-to-unauthorized-people-warn'
                />
                <HorizontalLine className='my-4' />
                <HintBox type='info' heading='info' body='cancel-withdraw-hint2' />


                <HorizontalLine className='my-4' />

                <div className='text-xs text-pcolor-light dark:text-pColor flex flex-col gap-y-2'>
                    <h4 className='font-semibold text-cBlue text-sm'>
                        <Text tid={'good-to-know'} />
                    </h4>

                    <h5>
                        <Text tid='cycles__title' />
                    </h5>
                    <h6 className='mt-4'>
                        <Text tid='cycles--1__heading' />
                    </h6>
                    <p>
                        <Text tid='cycles--1__p--1' />
                    </p>
                    <p>
                        <Text tid='cycles--1__p--2' />
                    </p>
                    <p>
                        <Text tid='cycles--1__p--3' />
                    </p>

                    <h6 className='mt-4'>
                        <Text tid='cycles--2__heading' />
                    </h6>
                    <p>
                        <Text tid='cycles--2__p--1' />
                    </p>
                </div>
                <ModalLayout open={hintModal} width={"520px"} onClose={onCloseHintModal}>
                    <div className='flex flex-col gap-3'>
                        <HintBox type='warn' heading='warn' body='withdraw-hint' className='!bg-none' />
                        <button onClick={onCloseHintModal} className='w-full py-2 px-3 bg-cBlue rounded-lg'>
                            <Text tid={'confirm'} />
                        </button>
                    </div>
                </ModalLayout>
            </div>
        </div>
    )
}
