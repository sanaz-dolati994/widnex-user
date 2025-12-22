import Text from "../../../core/utils/Text";
import {SOCKET_URL} from "../../../core/constants/urls";
import React, {useEffect, useRef, useState} from "react";
import useClickOutside from "../../../core/hooks/useClickOutside";
import { IoSearchSharp } from "react-icons/io5";
import {useMainContext} from "../../../core/contexts/main";


const Select = ({ className = '', dropdownClass= '', options = [], value, onChange, placeholder, isCoin = false, selector = null }) => {


    const { main: {lang} } = useMainContext()

    const [onBoard, setOnBoard] = useState([])
    useEffect(() => {
        setOnBoard(options)
    }, [options])

    const [open, setOpen] = useState(false)
    const onOption = (option) => {
        onChange(option)
        setOpen(false)
    }

    const ref = useRef()
    useClickOutside(ref, () => setOpen(false))

    const [search, setSearch] = useState('')
    useEffect(() => {
        if (!!search) {
            const temp = options.filter(x => {
                if (isCoin) return x.id.includes(search) || x.name.includes(search) || x.fa.includes(search)
                if (selector) return x[selector].includes(search)
                return x.includes(search)
            })
            setOnBoard(temp)
        }else {
            setOnBoard(options)
        }
    }, [search])


    return (
        <div className={'relative text-sm'} ref={ref}>
            <div
                className={'rounded border-[1px] border-main border-opacity-20 px-4 py-2 cursor-pointer hover:border-active ' + className}
                onClick={() => setOpen(state => !state)}
            >
                <div className={'flex items-center justify-between'}>
                    <div className={'flex items-center gap-2'}>
                        {!!value ?
                            isCoin ?
                            <>
                                <img
                                    src={SOCKET_URL + `assets/icon/${value.id}.png`}
                                    width={32}
                                    height={32}
                                    alt={value.id}
                                />
                                <span className={'mt-1'}>{value?.id?.toUpperCase()}</span>
                            </>
                                :
                                selector ?
                                    <span>{value[selector]}</span>
                                    :
                                    <span>{value}</span>

                            :
                            <Text tid={placeholder} className={'text-secondary text-xs'}/>
                        }
                    </div>
                </div>
            </div>

            {open ?
                <div className={'absolute bg-white shadow-md dark:bg-primaryBg z-[1002] w-full left-0 top-[110%] rounded border-[1px] border-main border-opacity-20 ' + dropdownClass}>
                    <div className={'py-2 px-5'}>
                        <div className={'rounded border-[1px] border-main border-opacity-20 px-3 py-2 w-full flex items-center gap-2'}>
                            <IoSearchSharp size={20} />
                            <input
                                placeholder={lang === 'fa' ? 'جستجو' : 'Search'}
                                value={search}
                                onChange={e => setSearch(e?.target?.value)}
                                className={'bg-transparent w-[80%]'}
                            />
                        </div>
                    </div>
                    <div className={'w-full h-[1px] bg-gray-300 opacity-20'} />
                    <div className={'flex flex-col max-h-[300px] overflow-y-auto overflow-x-hidden'}>
                        {onBoard.length ?
                            onBoard?.map((option) => {
                            let active
                            try {
                                if (isCoin) active = option.id === value.id
                                else {
                                    if (selector) active = option[selector] === value[selector]
                                    else active = option === value
                                }
                            }catch (_) {}

                            return (
                                <div className={`px-5 py-3 hover:bg-gray-200 dark:hover:bg-secondaryBg ${active && 'bg-gray-200 dark:bg-secondaryBg'} cursor-pointer`} onClick={() => onOption(option)}>
                                    {isCoin ?
                                        <div className={'flex items-center gap-2'}>
                                            <img
                                                src={SOCKET_URL + `assets/icon/${option.id}.png`}
                                                width={32}
                                                height={32}
                                                alt={option.id}
                                            />
                                            <span className={`${active ? 'text-active' : ''} mt-1`}>{option?.id?.toUpperCase()}</span>
                                        </div>
                                    :
                                        selector ?
                                            <span>{option[selector]}</span>
                                            :
                                            <span>{option}</span>
                                    }
                                </div>
                            )
                        }):
                            <div className={'flex items-center justify-center py-4'}>
                                <img alt=' ' src={require('../../../assets/images/noData.png')} width={64} />
                            </div>
                        }
                    </div>
                </div>
            : null}

        </div>
    )
}

export default Select
