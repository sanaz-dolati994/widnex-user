import { Fragment, useEffect, useMemo, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { FiChevronDown } from 'react-icons/fi'
import { useProfileQuery } from '../../core/services/react-query/useProfileQuery'
import Text from '../../core/utils/Text'

export const BankAccountDropdown = ({ onChange = () => {} }) => {
    const { data: profile } = useProfileQuery()

    const banks = useMemo(() => {
        if (profile?.banks?.length) {
            return profile?.banks?.filter((item) => !!item.verifyAt)
        } else return []
    }, [profile])

    const [selected, setSelected] = useState(banks?.length ? banks[0] : {})

    useEffect(() => onChange(selected), [selected])

    return (
        <div className='asset-dropdown'>
            <Listbox value={selected} onChange={setSelected}>
                <div className='relative'>
                    <div
                        className={`form-control ${
                            !banks?.length ? 'pointer-events-none' : ''
                        }`}>
                        <Listbox.Button className='form-input w-full overflow-hidden text-ellipsis whitespace-nowrap'>
                            {selected.shebaNo ? (
                                `${selected.label} - ${selected.shebaNo}`
                            ) : (
                                <Text
                                    tid={
                                        !banks?.length
                                            ? 'no-banks-found'
                                            : 'banks-list'
                                    }
                                />
                            )}
                        </Listbox.Button>

                        {!!banks?.length && (
                            <div className='dropdown-icon-button'>
                                <FiChevronDown size={18} />
                            </div>
                        )}
                    </div>
                    {!!banks?.length && (
                        <Transition
                            as={Fragment}
                            leave='transition ease-in duration-100'
                            leaveFrom='opacity-100'
                            leaveTo='opacity-0'>
                            <Listbox.Options className='dropdown-menu'>
                                {banks.map((item, index) => (
                                    <Listbox.Option
                                        key={index}
                                        className={({ active }) =>
                                            `dropdown-item ${
                                                active ? 'active' : ''
                                            }`
                                        }
                                        value={item}>
                                        {({ selected }) => (
                                            <>
                                                <span
                                                    className={`block truncate ${
                                                        selected
                                                            ? 'font-medium'
                                                            : 'font-normal'
                                                    }`}>
                                                    {item.label} -{' '}
                                                    {item.shebaNo}
                                                </span>
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    )}
                </div>
            </Listbox>
        </div>
    )
}
