import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { useMainContext } from '../../core/contexts/main'

export default function BaseModal({
    title = '',
    children,
    show = false,
    close = () => {},
    className = '',
}) {
    const {
        main: { lang },
    } = useMainContext()

    return (
        <>
            <Transition
                appear
                show={show}
                as={Fragment}
                dir={lang === 'en' ? 'ltr' : 'rtl'}>
                <Dialog
                    as='div'
                    className={`modal ${className}`}
                    onClose={close}>
                    <Transition.Child
                        as={Fragment}
                        enter='ease-out duration-300'
                        enterFrom='opacity-0'
                        enterTo='opacity-100'
                        leave='ease-in duration-200'
                        leaveFrom='opacity-100'
                        leaveTo='opacity-0'>
                        <div className='backdrop' />
                    </Transition.Child>

                    <div className='modal-container'>
                        <div className='modal-wrapper'>
                            <Transition.Child
                                as={Fragment}
                                enter='ease-out duration-300'
                                enterFrom='opacity-0 scale-95'
                                enterTo='opacity-100 scale-100'
                                leave='ease-in duration-200'
                                leaveFrom='opacity-100 scale-100'
                                leaveTo='opacity-0 scale-95'>
                                <Dialog.Panel className='modal-panel bg-white dark:bg-dark-secondary'>
                                    {!!title && (
                                        <Dialog.Title
                                            as='h3'
                                            className='modal-title'>
                                            {title}
                                        </Dialog.Title>
                                    )}

                                    <div className='mt-2'>{children}</div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}
