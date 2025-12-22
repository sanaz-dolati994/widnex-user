import {useQueryContext} from "../../../core/contexts/query";


export const useCopyToClipboard = () => {
    const { setToast } = useQueryContext()
    const copyToClip = (msg) => {
        navigator.clipboard.writeText(msg)
        setToast({
            error: false, show: true,
            message: 'copy-success'
        })
    }
    return {copyToClip}
}
