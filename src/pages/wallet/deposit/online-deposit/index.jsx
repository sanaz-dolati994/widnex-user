import React from 'react'
import Text from '../../../../core/utils/Text'
import ChooseAccount from '../../utils/ChooseAccount';
import { useTranslation } from 'react-i18next';
import HintBox from '../../../../components/common/HintBox';
import { ProfileItem } from '../offline/profileItem';
import { useBankAccount } from '../../../../core/services/react-query/useTransferConfig';
import { useCopy } from '../../../../core/hooks/useCopy';
import { CopyIcon } from '../../../../components/common/icons';

const OnlineDeposit = () => {
    const onCopyClipboard = useCopy();
    const { data } = useBankAccount();
    const { t } = useTranslation();
    const [state, setState] = React.useState(null);
    const selected = React.useMemo(() => data?.find(x => x?.selectedOnlineDeposit && x?.isActive), [data])

    const onChange = (e) => {
        if (!e) return;
        setState(e);
    }

    if (!selected) return (
        <div className='mt-5'>
            <HintBox
                type='warn'
                heading={t('hint')}
                body={"درحال حاضر امکان واریز انلاین وجود ندارد !"}
            />
        </div>
    )

    return (
        <div className='flex items-start gap-4 mt-5 flex-col xl:flex-row'>
            <div className='w-full'>
                <div className='w-full'>
                    <React.Fragment>
                        <ChooseAccount
                            label={'choose-bank-account'}
                            onOptionChange={onChange}
                            value={state}
                            type={'bank'}
                            className={'mt-2 mx-auto text-white'}
                        />
                    </React.Fragment>
                </div>
                {state ? (
                    <div className='w-full mt-5 flex flex-col gap-4'>
                        <ProfileItem>
                            <Text tid="bank-owner" className='text-xs opacity-70' />
                            <div className='flex items-center gap-2'>
                                <span>{selected?.accountName}</span>
                                <button
                                    type='button'
                                    className=' text-cBlue text-sm bottom-0.5 relative'
                                    onClick={onCopyClipboard.bind(null, selected?.accountName)}
                                >
                                    <CopyIcon color='currentColor' />
                                </button>
                            </div>
                        </ProfileItem>
                        <ProfileItem>
                            <Text tid="shaba-number" className='text-xs opacity-70' />
                            <div className='flex items-center gap-2'>
                                <span>IR{selected?.shabaNumber}</span>
                                <button
                                    type='button'
                                    className=' text-cBlue text-sm bottom-0.5 relative'
                                    onClick={onCopyClipboard.bind(null, selected?.shabaNumber)}
                                >
                                    <CopyIcon color='currentColor' />
                                </button>
                            </div>
                        </ProfileItem>
                        <ProfileItem>
                            <Text tid="card-number" className='text-xs opacity-70' />
                            <div className='flex items-center gap-2'>
                                <span>{selected?.cardNumber?.replace(/(\d{4})(?=\d)/g, '$1-')}</span>
                                <button
                                    type='button'
                                    className=' text-cBlue text-sm bottom-0.5 relative'
                                    onClick={onCopyClipboard.bind(null, selected?.cardNumber)}
                                >
                                    <CopyIcon color='currentColor' />
                                </button>
                            </div>
                        </ProfileItem>
                        {/* <ProfileItem>
                            <Text tid="account-number" className='text-xs opacity-70' />
                            <div className='flex items-center gap-2'>
                                <span>{selected?.accountNumber}</span>
                                <button
                                    type='button'
                                    className=' text-cBlue text-sm bottom-0.5 relative'
                                    onClick={onCopyClipboard.bind(null, selected?.accountNumber)}
                                >
                                    <CopyIcon color='currentColor' />
                                </button>
                            </div>
                        </ProfileItem> */}
                        <HintBox type='warn' heading={t('هشدار')} body={t("online-hint-3")} />
                        <HintBox type='warn' heading={t('hint')} body={t("online-hint-2")}
                        />
                    </div>
                ) : (
                    <div className='mt-6 w-full'>
                        <HintBox type='warn' heading={t('hint')} body={t("please-select-a-card-number")} />
                    </div>
                )}
            </div>
            <div className='w-full'>
                <HintBox heading={t('hint')} body={t("online-hint-1")} />
            </div>
        </div >
    )
}

export default React.memo(OnlineDeposit)