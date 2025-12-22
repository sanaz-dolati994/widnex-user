import React from 'react'
import ChooseAccount from '../../utils/ChooseAccount'
import Text from '../../../../core/utils/Text'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import HintBox from '../../../../components/common/HintBox'
import { useCreateDeposit, useTransferConfig } from '../../../../core/services/react-query/useTransferConfig'
import { Controller, useFormContext } from 'react-hook-form'
import Hints from './hints'
import provider from './provider'
import Bank from './bank'
import Amount from './amount'
import ModalLayout from '../../../../components/layouts/ModalLayout'
import { ScrollWrap } from '../../../../styles/responsive/Common'
import { DText, FlexCenter } from '../../../../styles/CommonStyles'
import { formatNumber } from '../../../../core/utils/common'
import { ProfileItem } from './profileItem'
import { useCopy } from '../../../../core/hooks/useCopy'
import { CopyIcon } from '../../../../components/common/icons'
import { Status } from '../state'
import { IconWrapper } from '../../../../styles/CoinOperationStyles'
import { IoCloseCircle } from 'react-icons/io5'
import Upload from './upload'
import { CgSpinner } from 'react-icons/cg'


const DepositOffline = () => {
    const [state, setState] = React.useState()
    const { t } = useTranslation();
    const { control, handleSubmit, reset } = useFormContext();
    const { data } = useTransferConfig();
    const onCopyClipboard = useCopy();

    const { mutateAsync, data: response, isLoading } = useCreateDeposit({
        onSuccess: () => {
            setState({
                date: new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                }).format(new Date())
            });
        }
    });

    const onFormSubmit = async (dto) => {
        await mutateAsync({
            "userBankId": dto.userBank.id,
            "amount": dto.amount.replaceAll(",", ""),
            "bankId": dto.bank.id,
            "attachment": dto.attachment
        });
        reset();
    }

    return (
        <React.Fragment>
            <div className='flex items-start gap-4 mt-5 flex-col xl:flex-row'>
                <form onSubmit={handleSubmit(onFormSubmit)} className='w-full'>
                    <div className='w-full'>
                        <div className='flex items-center justify-between'>
                            <Text tid='choose-source-card' className='text-sm' />
                            <Link
                                to='/profile/cards&accounts?tab=bank-accounts'
                                className='text-sm text-cBlue'>
                                <Text tid='add-account' />
                            </Link>
                        </div>
                        <Controller
                            rules={{ required: t("select-your-bank-card-error") }}
                            name='userBank'
                            control={control}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <React.Fragment>
                                    <ChooseAccount
                                        label={'choose-bank-account'}
                                        onOptionChange={onChange}
                                        value={value}
                                        type={'bank'}
                                        className={'mt-2 mx-auto text-white'}
                                    />
                                    {error?.message && (
                                        <Text tid={error.message} className={'text-red-500 text-xs'} />
                                    )}
                                </React.Fragment>
                            )}
                        />
                    </div>
                    <div className='mt-6 w-full'>
                        <HintBox type='info' heading={t('hint')} body={t("offline-deposit-shaba-hint")} />
                    </div>

                    <div className='w-full mt-5'>
                        <Text tid={"choose-destination-bank"} className='text-sm ' />
                        <Bank data={data} />
                        <Amount data={data} />
                        <Controller
                            name='attachment'
                            render={({ field: { onChange, value } }) =>
                                <Upload
                                    value={value}
                                    onSuccess={onChange}
                                />
                            }
                        />
                    </div>

                    <button
                        disabled={isLoading}
                        className=
                        {`disabled:opacity-70 rounded-md flex items-center justify-center mx-auto shadow-md mt-8 
                        w-full lg:w-[400px] h-[42px]  cursor-pointer hover:brightness-110 transition bg-cBlue text-white  `
                        }
                    >
                        {isLoading ? (<CgSpinner className='animate-spin size-5' />) : <Text tid={'deposit'} className={'text-sm'} />}
                    </button>
                </form>
                <Hints />
            </div>


            {(state && response) && (
                <ModalLayout open={!!state} onClose={() => setState(undefined)} width={"429px"} >
                    <div className="flex justify-end">
                        <IconWrapper className='relative -top-4' onClick={() => setState(undefined)}>
                            <IoCloseCircle size={24} />
                        </IconWrapper>
                    </div>
                    <FlexCenter style={{ marginBottom: '10px' }}>
                        <DText className="text-base font-semibold flex flex-col text-center items-center justify-center">
                            <Text tid={"offline-deposit-successful"} className='text-sm font-semibold' />
                            <Text className='mt-1 text-xs opacity-80 font-medium' tid={"offline-deposit-success-desc"} />
                            <div className='text-[#20B65C] mt-1 text-2xl font-semibold'>{formatNumber(response.data.data.amount)} <Text tid="tooman" as="span" className='text-sm' /></div>
                        </DText>
                    </FlexCenter>
                    <ScrollWrap maxHeight='400px' className='gap-4 flex flex-col mt-5'>
                        <ProfileItem className='text-sm'>
                            <div><Text tid="date" />:</div>
                            <div>{state.date}</div>
                        </ProfileItem>
                        <ProfileItem className='text-sm'>
                            <div><Text tid="status" />:</div>
                            <Status state={response.data.data.state} />
                        </ProfileItem>
                        <ProfileItem className='text-sm'>
                            <div><Text tid="trackId" />:</div>
                            <div className='flex items-center gap-2'>
                                <span>{response.data.data.transactionId}</span>
                                <button
                                    className=' text-cBlue text-sm bottom-0.5 relative'
                                    onClick={onCopyClipboard.bind(null, response.data.data.transactionId)}
                                >
                                    <CopyIcon color='currentColor' />
                                </button>
                            </div>

                        </ProfileItem>


                        <Link to={"/dashboard"} className='border rounded-md h-9 mt-7 flex items-center justify-center text-center' >
                            <Text tid="back-home" />
                        </Link>
                    </ScrollWrap>
                </ModalLayout>
            )}
        </React.Fragment>
    )
}

export default provider(DepositOffline)