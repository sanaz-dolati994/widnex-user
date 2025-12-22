import {useLayoutEffect, useRef} from "react";


export const useRunAfterUpdate = () => {
    const ref = useRef(null)
    useLayoutEffect(() => {
        if (ref.current){
            ref.current()
            ref.current = null
        }
    })
    return fn => (ref.current = fn)
}