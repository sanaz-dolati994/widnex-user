import {useMainContext} from "../../../../core/contexts/main";
import React, {useMemo, useState} from "react";
import Text from "../../../../core/utils/Text";
import Input from "../../utils/Input";
import {useGetFiatSetting} from "../../../../core/services/react-query/useSetting";
import {formatNumber, stringToNumber} from "../../../../core/utils/common";
import {Decoration} from "../../../../styles/CoinOperationStyles";

const Step1 = ({ amount, setAmount, onAction }) => {

    const { main: { lang } } = useMainContext()
    const { data: fiatSetting } = useGetFiatSetting()

    const validFirstStepAction = useMemo(() => {
       return (
			!!amount &&
			stringToNumber(amount) >= fiatSetting?.deposit?.min 
            // && stringToNumber(amount) < fiatSetting?.deposit?.max
		)
    }, [amount, fiatSetting])

    const [showError, setShowError] = useState(false)
    const _onAction = () => {
        if (validFirstStepAction) onAction()
        else setShowError(true)
    }

    return (
        <div className={'flex flex-col mx-auto max-w-[400px] justify-center items-center gap-5 mt-10'}>
            <div className={'w-full flex flex-col gap-1'}>
                <Text tid={'deposit-in-tooman'} className={'text-secondary text-sm'} />
                <Input
                    value={amount}
                    onChange={setAmount}
                    placeholder={lang === 'fa' ? 'مقدار را وارد کنید.' : 'Please Enter Amount'}
                    hasError={!validFirstStepAction && showError}
                    error={'amount-error'}
                    number
                />
                <div className={'flex items-center gap-1 text-secondary text-xs mt-[6px]'}>
                    <Decoration />
                    <span>
                        <Text tid={'minimum-deposit'} />
                        <span> :</span>
                    </span>
                    <span className={'mt-[2px]'}>{`${formatNumber(fiatSetting?.withdraw?.min, { type: 'irt' })} تومان`}</span>
                </div>{/* <div className={'flex items-center gap-1 text-secondary text-xs mt-[6px]'}>
					<Decoration />
					<span>
						<Text tid={'maximum-deposit'} />
						<span> :</span>
					</span>
					<span className={'mt-[2px]'}>{`${formatNumber(fiatSetting?.deposit?.max, {
						type: 'irt',
					})} تومان`}</span>
				</div> */}
            </div>
            <div
                className=
                    {`rounded-md flex items-center justify-center mx-auto shadow-md mt-8 
                        w-full lg:w-[400px] h-[42px] ${validFirstStepAction ? 'bg-active text-black' :
                        'dark:bg-gray-800 bg-gray-400  text-secondary'} cursor-pointer hover:brightness-110 transition`
                    }
                onClick={_onAction}
            >
                <Text tid={'deposit'} className={'text-sm'} />
            </div>
        </div>
    )
}

export default Step1
