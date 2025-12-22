import React, { useState } from 'react'
import { FaInfo } from 'react-icons/fa'
import Text from '../../core/utils/Text'

const Tooltip = ({ title }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative group">
            <button onClick={() => { setIsOpen(prevState => !prevState) }} onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)} className="p-1  border border-blue-500 rounded-full">
                <FaInfo size={10} />
            </button>
            {
                isOpen &&
                <div
                    className="absolute md:top-1/2 left-1/2 -translate-x-1/4 md:-translate-x-0 md:left-full transform md:-translate-y-1/2 ml-2  w-max px-2 py-1 text-sm text-white bg-gray-700 rounded shadow-lg   z-10 max-w-xs">
                    <Text tid={title} className='max-w-xs whitespace-pre-wrap' />
                </div>
            }
        </div>
    )
}

export default Tooltip