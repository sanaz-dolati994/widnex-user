import { useEffect, useRef } from "react";


const useClickOutside = (ref, callback) => {
    const callbackRef = useRef()
    callbackRef.current = callback

    useEffect(() => {
        const handleClickOutside = e => {
            if (!ref?.current?.contains(e.target) && callbackRef.current) {
                callbackRef.current(e)
            }
        }
        document.addEventListener('click', handleClickOutside, true)

        return () => {
            document.removeEventListener('click', handleClickOutside, true)
        }
    }, [callbackRef, ref])
}

export default useClickOutside;