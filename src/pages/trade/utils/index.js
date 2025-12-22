import { useCallback } from "react"
import { useMarketQuery } from "../utils/useMarketQuery"

export const usePersianNames = () => {

    const { data: market } = useMarketQuery()

    const findPersianName = useCallback((id) => {
        if (!!market) {
            if (id === 'irt') return 'تومان'
            const c = market.find(m => m.id === id)
            return c?.fa || ''
        }
    }, [market])

    return {
        findPersianName
    }
}