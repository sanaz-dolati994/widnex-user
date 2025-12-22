import { CgClose } from 'react-icons/cg'

export default function ReminderModalBase({
    children,
    onClose,
    className = null,
}) {
    return (
        <div
            className={`bg-light-overlay dark:bg-dark-overlay absolute inset-0 z-50 flex justify-center items-start pt-20 lg:pt-5 ${className}`}
            onClick={onClose}>
            <div
                className='bg-slate-200 dark:bg-primary dark:text-white flex flex-col py-2 sm:py-5 px-5 sm:px-10 text-primary w-[90%] md:w-4/5 min-h-[25%] sm:h-auto sm:overflow-y-hidden rounded-md text-justify gap-y-2 relative text-xs md:text-base'
                onClick={(e) => e.stopPropagation()}>
                <div
                    className='absolute top-2 sm:top-4 left-2 sm:left-4 text-sm md:text-lg rounded-full border border-primary dark:border-white p-1 cursor-pointer hover:bg-primaryBg hover:text-white dark:hover:bg-white dark:hover:text-primary transition-colors'
                    onClick={onClose}>
                    <CgClose />
                </div>

                {children}
            </div>
        </div>
    )
}
