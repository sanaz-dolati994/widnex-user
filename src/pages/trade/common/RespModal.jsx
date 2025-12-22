import { AnimatePresence, motion } from "framer-motion"
import { useWindowSize } from "../../../core/hooks/useWindowSize"
import { useRef } from "react"
import useClickOutside from "../../../core/hooks/useClickOutside"


const RespModal = ({ _height, show, onClose, children }) => {

    const ref = useRef()
    const { height } = useWindowSize()

    useClickOutside(ref, onClose)

    return (
        <AnimatePresence exitBeforeEnter>
            {show ?
                <motion.div
                    ref={ref}
                    className={`bottom-0 z-[99999] left-0 fixed w-screen
                         dark:bg-primaryBg bg-white shadow dark:border-card-border border-[1px] rounded-t-md
                    `}
                    style={{ height: _height || `${height * 50 / 100}px` }}
                    variants={variants}
                    animate={'in'}
                    initial={'out'}
                    exit={'out'}
                >
                    <div className={'w-[64px] mx-auto h-[4px] rounded-md mt-2 bg-slate-300 bg-opacity-50'} />
                    {children}
                </motion.div>
                : null}

        </AnimatePresence>
    )
}

const variants = {
    in: {
        y: 0, transition: { ease: "linear" }
    },
    out: {
        y: 1000, transition: { ease: "linear" }
    }
}

export default RespModal