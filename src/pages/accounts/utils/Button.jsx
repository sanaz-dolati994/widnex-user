import {ClipLoader} from "react-spinners";
import Text from "../../../core/utils/Text";
import React, {useRef, useState} from "react";
import useClickOutside from "../../../core/hooks/useClickOutside";


const Button = ({ valid, onClick, loading, tid, Icon, className = '', textClassName = '', btnWrapperClassName = '', twoStep= false }) => {

    const ref = useRef()
    const [modal, setModal] = useState(false)
    useClickOutside(ref, () => setModal(false))
    const _onClick = () => {
        if (twoStep) setModal(true)
        else onClick()
    }

    const onSubmit = () => {
        onClick()
        setModal(false)
    }

    return (
        <div className={'relative ' + className} ref={ref} >
            <div
                className=
                    {`rounded-lg w-full h-full min-h-[36px] flex items-center justify-center mx-auto shadow-md
                         ${valid ? 'bg-cBlue text-white' : ''} cursor-pointer transition ${btnWrapperClassName}`
                    }
                onClick={_onClick}
            >
                {loading ?
                    <ClipLoader size={24}  />
                    :
                    <div className="flex items-center gap-x-2">
                        {!!Icon && Icon}
                        <Text tid={tid} className={textClassName} />
                    </div>
                }
            </div>
            {(twoStep && modal) ?
                <div className={'absolute left-[50%] z-[1000] top-[110%] bg-white dark:bg-primaryBg -translate-x-1/3 lg:-translate-x-1/2 rounded border-[1px] border-opacity-30 py-2 px-3'}>
                    <div className={'flex flex-col gap-3 text-[0.7rem] w-[164px]'}>
                        <Text tid={'are-you-sure'} />
                        <div className={'grid grid-cols-2 gap-2'}>
                            <Button
                                tid={'submit'}
                                onClick={onSubmit}
                                valid
                            />
                            <Button
                                tid={'cancel'}
                                onClick={() => setModal(false)}
                            />
                        </div>
                    </div>
                </div>
                : null}
        </div>

    )
}

export default Button
