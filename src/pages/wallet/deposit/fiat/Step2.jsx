import {useGetFiatSetting} from "../../../../core/services/react-query/useSetting";
import Text from "../../../../core/utils/Text";
import React, {useMemo} from "react";
import StepBtns from "./StepBtns";
import {formatNumber, stringToNumber} from "../../../../core/utils/common";
import {ClipLoader} from "react-spinners";
import {getMainTheme} from "../../../../core/utils/theme";
import {HAS_DEPOSIT_WITH_ID} from "../../../../core/constants/urls";


const Step2 = ({ amount, depositType, setDepositType, onAction, onBack }) => {

    const { data: fiat, isLoading } = useGetFiatSetting()

    const types = useMemo(() => {
        let max = 0
        let f = 0
        if (!!fiat && !!amount) {
            const df = fiat.deposit
            max = df.max
            f = Math.min(df.feeMax, df.feeFactor * stringToNumber(amount) / 100)
        }
        return [
            { tid: 'bank-gateway', fee: f, max: max, active: 1, enabled: stringToNumber(amount) <= max },
            { tid: 'deposit-id', fee: 500, max: null, active: HAS_DEPOSIT_WITH_ID, enabled: true }
        ]
    }, [fiat, amount])

    const onDepositType = (t) => {
        if (t.enabled) setDepositType(t.tid)
    }


    return (
        <div className={'flex flex-col justify-start items-center gap-5 mt-10 max-w-[520px] mx-auto'}>
            <Text tid={'choose-deposit-type'} className={'text-secondary text-sm'}/>
            {isLoading ?
                <div className={'my-8'}>
                    <ClipLoader size={32} color={getMainTheme().active} />
                </div>
            : null}
            {!isLoading ?
                <div className={'w-full flex flex-col gap-3'}>
                    {types.map(t => {
                        if (!t.active) return <></>
                        const active = t.tid === depositType
                        const shouldShowDepositError = !HAS_DEPOSIT_WITH_ID && !t.enabled

                        return (
                            <div className=
                                     {`rounded-md py-4 px-5 w-full ${active ? 'bg-gray-300 dark:bg-slate-800' : 'bg-gray-100 dark:bg-primaryBg'}
                                     ${!t.enabled && 'opacity-50'}
                                     flex items-center gap-6 cursor-pointer`}
                                 onClick={() => onDepositType(t)}
                            >
                                <div className={`rounded-[50%] flex items-center justify-center border-[1px] w-[18px] h-[18px] ${active ? 'border-active' : 'dark:border-gray-400 border-gray-800'}`}>
                                    {active &&
                                        <div className={'rounded-[50%] w-[10px] h-[10px] bg-active'} />
                                    }
                                </div>
                                <div className={`h-[80px] w-[1px] ${active ? 'bg-gray-500 dark:bg-gray-500' : 'bg-gray-300 dark:bg-gray-800'}`} />
                                <div className={'flex flex-col gap-2 text-sm'}>
                                    <Text tid={t.tid} />
                                    <span className={'text-secondary text-xs mt-2'}>
                                    <Text tid={'max-daily'} />
                                        {!!t.max ?
                                            <span>
                                                <span>{formatNumber(t.max, { type: 'irt' })}</span>
                                                <span>{' تومان'}</span>
                                            </span>
                                        :
                                            <Text tid={'infinite'} />
                                        }

                                    </span>
                                        <span className={'text-secondary text-xs'}>
                                        <Text tid={'bank-fee'} />
                                        <span>{formatNumber(t.fee, { type: 'irt' })}</span>
                                        <span>{' تومان'}</span>
                                    </span>
                                    {shouldShowDepositError ?
                                        <Text tid={'amount-is-bigger-than-max'} className={'text-red-500 text-xs'} />
                                    : null}
                                </div>

                            </div>
                        )
                    })}
                </div>
            : null}
            <div className={'w-full mt-5'}>
                <StepBtns
                    onBack={onBack}
                    onNext={onAction}
                    nextTid={depositType === 'deposit-id' ? 'get-deposit-id' : 'pay'}
                />
            </div>
        </div>
    )
}

export default Step2
