import { Fragment, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { FiChevronDown } from 'react-icons/fi'
import Text from '../../core/utils/Text'
import { useProfileQuery } from '../../core/services/react-query/useProfileQuery'

export const WalletDropdown = ({ network = '', onChange = () => {} }) => {
    const { data: profile } = useProfileQuery()

    const wallets = profile?.wallets?.filter((item) => item.network === network)

    const [selected, setSelected] = useState({})

    useEffect(() => onChange(selected), [selected])

    useEffect(() => setSelected(wallets?.length ? wallets[0] : {}), [network])

    return (
        <div className='asset-dropdown'>
            <Listbox value={selected} onChange={setSelected}>
                <div className='relative'>
                    <div
                        className={`form-control ${
                            !wallets?.length ? 'pointer-events-none' : ''
                        }`}>
                        <Listbox.Button className='form-input w-full overflow-hidden text-ellipsis whitespace-nowrap'>
                            {selected.address ? (
                                selected.address
                            ) : (
                                <Text
                                    tid={
                                        !wallets?.length
                                            ? 'no-wallets-found'
                                            : 'wallets-list'
                                    }
                                />
                            )}
                        </Listbox.Button>

                        {!!wallets?.length && (
                            <div className='dropdown-icon-button'>
                                <FiChevronDown size={18} />
                            </div>
                        )}
                    </div>
                    {!!wallets?.length && (
                        <Transition
                            as={Fragment}
                            leave='transition ease-in duration-100'
                            leaveFrom='opacity-100'
                            leaveTo='opacity-0'>
                            <Listbox.Options className='dropdown-menu'>
                                {wallets.map((item, index) => (
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
                                                    className={`block whitespace-nowrap ${
                                                        selected
                                                            ? 'font-medium'
                                                            : 'font-normal'
                                                    }`}>
                                                    {item.label}
                                                </span>
                                                <span
                                                    className={`block truncate ${
                                                        selected
                                                            ? 'font-medium'
                                                            : 'font-normal'
                                                    }`}>
                                                    {item.address}
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
