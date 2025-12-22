import { useQueryContext } from "../contexts/query"

export const useCopy = () => {
    const { setToast } = useQueryContext()

    return (value) => {
        navigator.clipboard.writeText(value)
        setToast({
            show: true,
            message: 'copy-success',
        })
    }
}