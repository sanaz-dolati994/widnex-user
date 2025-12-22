import React from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { ProfileItem } from './profileItem';
import { Listbox } from '@headlessui/react'
// import Melli from "../../../../packages/bank-service/banks/Melli.svg"
import { CgChevronDown } from 'react-icons/cg'
import { CopyIcon } from '../../../../components/common/icons'
import { useCopy } from '../../../../core/hooks/useCopy';
import Text from '../../../../core/utils/Text';



const Bank = ({ data }) => {
    const { control, setValue, } = useFormContext();
    const onCopyClipboard = useCopy();

    const currentBank = useWatch({ control, name: "bank" })

    React.useEffect(() => {
        if (data && data[0]?.bankAccounts[0] && !currentBank) {
            setValue("bank", data[0]?.bankAccounts[0])
        }
    }, [setValue, data, currentBank])

    if (!data) return <></>;
    return (
        <Controller
            control={control}
            name='bank'
            render={({ field: { value, onChange } }) => {
                return (
                    <div className='w-full flex flex-col mt-3 gap-3'>
                        <div >
                            <ProfileItem className='relative'>
                                <Listbox value={value?.id}>
                                    <Listbox.Button className='flex justify-between items-center w-full'>
                                         {value?.bankName && (
                                            <img
                                                alt='bank-icon'
                                                src={require(`./../../../../packages/bank-service/banks/${value.bankName}.svg`)}
                                                className='bg-white rounded-full p-0.5 w-9 h-9'
                                            />
                                        )}
                                        {value?.accountName} 
                                        <CgChevronDown />
                                    </Listbox.Button>
                                    <Listbox.Options className={"shadow absolute left-0 right-0 z-10 top-full mt-3 w-full bg-gray-100 p-2 rounded-md dark:bg-secondaryBg gap-2 flex flex-col"}>
                                        {data?.map((config, index) =>
                                            config.bankAccounts.map((bankAccount, jIndex) => (
                                                <ProfileItem key={index + jIndex} onClick={() => onChange(bankAccount)} className='relative cursor-pointer w-full h-full bg-gray-50 dark:bg-transparent hover:hover:bg-gray-50/10 dark:hover:bg-gray-50/10'>
                                                    <Listbox.Option
                                                        className={"w-full"}
                                                        value={bankAccount.id}
                                                    >
                                                        {bankAccount.accountName}
                                                    </Listbox.Option>
                                                </ProfileItem>
                                            ))
                                        )}
                                    </Listbox.Options>
                                </Listbox>
                            </ProfileItem>
                        </div>
                        <ProfileItem>
                            <Text tid="shaba-number" className='text-xs opacity-70' />
                            <div className='flex items-center gap-2'>
                                <span>IR{value?.shabaNumber}</span>
                                <button
                                    type="button"
                                    className=' text-cBlue text-sm bottom-0.5 relative'
                                    onClick={onCopyClipboard.bind(null, value?.shabaNumber)}
                                >
                                    <CopyIcon color='currentColor' />
                                </button>
                            </div>
                        </ProfileItem>
                        <ProfileItem>
                            <Text tid="card-number" className='text-xs opacity-70' />
                            <div className='flex items-center gap-2'>
                                <span>{value?.cardNumber?.replace(/(\d{4})(?=\d)/g, '$1-')}</span>
                                <button
                                    type="button"
                                    className=' text-cBlue text-sm bottom-0.5 relative'
                                    onClick={onCopyClipboard.bind(null, value?.cardNumber)}
                                >
                                    <CopyIcon color='currentColor' />
                                </button>
                            </div>
                        </ProfileItem>
                        <ProfileItem>
                            <Text tid="account-number" className='text-xs opacity-70' />
                            <div className='flex items-center gap-2'>
                                <span>{value?.accountNumber}</span>
                                <button
                                    type="button"
                                    className=' text-cBlue text-sm bottom-0.5 relative'
                                    onClick={onCopyClipboard.bind(null, value?.accountNumber)}
                                >
                                    <CopyIcon color='currentColor' />
                                </button>
                            </div>
                        </ProfileItem>
                    </div >
                )
            }}
        />
    )
}


export default Bank