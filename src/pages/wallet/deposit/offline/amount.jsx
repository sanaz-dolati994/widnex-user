import React from 'react'
import { ProfileItem } from './profileItem'
import { useMainContext } from '../../../../core/contexts/main'
import { useTranslation } from 'react-i18next'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import Text from '../../../../core/utils/Text'
import { useRunAfterUpdate } from '../../../../core/hooks/useRunAfterUpdate'
import { onInputValueChangeUtil } from '../../../../core/utils/useInputValueChange'

const Amount = ({ data }) => {
    const { control, formState: { errors } } = useFormContext();
    const { t } = useTranslation();
    const { main: { lang } } = useMainContext()

    const selectedBank = useWatch({ control, name: "bank" });

    const selectedData = React.useMemo(() => data?.find(x =>
        x.bankAccounts.some(c => c.id === selectedBank?.id)
    ), [data, selectedBank]);


    const runAfterUpdate = useRunAfterUpdate();

    const onInputChange = (e) =>
        onInputValueChangeUtil(e, runAfterUpdate);


    const validate = (e) => {
        if (!e || e.trim() === "") return t("enter-amount-error");
        const value = Number(e.replaceAll(",", ""));
        if (isNaN(value)) {
            return t("invalid-amount-error");
        }

        if (value < selectedData.lowestAmount) {
            return t("amount-less-than-min-error", { min: selectedData.lowestAmount });
        }

        if (value > selectedData.highestAmount) {
            return t("amount-more-than-max-error", { max: selectedData.highestAmount });
        }

        return true;
    };


    if (!selectedData) return null;
    return (
        <React.Fragment>
            <div className='mt-10'>
                <Text tid="deposit-amount-tooman" as="span" className='text-sm' />
                <div className='border rounded-lg overflow-hidden border-gray-200 dark:border-card-border flex h-11 mt-3'>
                    <Controller
                        name='amount'
                        control={control}
                        rules={{
                            required: t("enter-deposit-amount-error"),
                            validate
                        }}
                        render={({ field: { onChange, value } }) => (
                            <input
                                value={value}
                                onChange={x => onChange(onInputChange(x))}
                                className='h-full block w-4/5 px-4 bg-transparent'
                                placeholder={lang === 'fa' ? 'مقدار را وارد کنید.' : 'Please Enter Amount'}
                            />
                        )}
                    />
                    <div className='w-1/5 bg-gray-light dark:bg-[#172B46] flex items-center justify-center cursor-default'>
                        <Text tid='tooman' />
                    </div>
                </div>
                {errors?.amount?.message && (
                    <Text tid={errors.amount.message} className={'text-red-500 text-xs'} />
                )}
            </div>
            <div className='mt-4 text-xs'>
                <div className='flex justify-between'>
                    <ProfileItem className='w-fit'><Text tid="max-amount-label" />: {selectedData?.highestAmount.toLocaleString()} <Text className='m-1' tid="tooman" /></ProfileItem>
                    <ProfileItem className='w-fit gap-1'><Text tid="fee" />: <span className='text-green-600'>{selectedData?.highestFee || t("free")}</span></ProfileItem>
                </div>
                <div className='mt-3'>
                    <ProfileItem className='w-fit'><Text tid="min-amount-label" />: {selectedData?.lowestAmount.toLocaleString()} <Text className='m-1' tid="tooman" /></ProfileItem>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Amount