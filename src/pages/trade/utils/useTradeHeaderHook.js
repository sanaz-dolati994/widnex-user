import useMarketChange from "./useMarketChange";
import { useEffect, useMemo, useState } from "react";
import { useMainContext } from "../../../core/contexts/main";
import { useSocketContent } from "../../../core/contexts/socket-content";


const useTradeHeaderHook = () => {
    const { market } = useMainContext()
    const { prices } = useSocketContent()
    const { changes, loading } = useMarketChange()

    const [currentChange, setCurrentChange] = useState(null)

    const [price, setPrice] = useState({
        tooman: null, usdt: null, color: null
    })

    useEffect(() => {
        if (prices) {
            if (market.pair === "irt") {
                const coinPrice = prices.find(p => p.id === market?.coin)
                setPrice(old => ({
                    tooman: coinPrice?.buy, usdt: coinPrice?.value,
                    color: old.tooman > coinPrice?.buy ? "buy" : "sell"
                }))
            } else {
                const coinPrice = prices.find(p => p.id === market?.coin)
                const pairPrice = prices.find(p => p.id === market?.pair)
                setPrice(old => ({
                    tooman: coinPrice?.buy / pairPrice?.buy,
                    usdt: coinPrice?.value / pairPrice?.value,
                    color: old.tooman > (coinPrice?.buy / pairPrice?.buy) ? "buy" : "sell"
                }))
            }
        }
    }, [prices, market])

    useEffect(() => {
        if (changes.length) {
            const current = changes.find(c => c.coin === market.coin && c.pair === market.pair)
            setCurrentChange(current)
        }
    }, [changes, market])

    const persianNames = useMemo(() => {

    }, [market,])

    return {
        market,
        price,
        currentChange,
        loading,
        persianNames
    }
}

const useOrderPercentage = () => {
    const { buyOrders, sellOrders } = useSocketContent()
    const [ordersAmount, setOrdersAmount] = useState({ buy: null, bl: true, sell: null, sl: true })

    /* pc calculated by amount of buy and sell orders */
    useEffect(() => {
        if (buyOrders) {
            let buy = 0
            buyOrders.forEach(o => buy += o.amount)
            setOrdersAmount(state => ({ ...state, buy, bl: false }))
        }
    }, [buyOrders])

    useEffect(() => {
        if (sellOrders) {
            let sell = 0
            sellOrders.forEach(o => sell += o.amount)
            setOrdersAmount(state => ({ ...state, sell, sl: false }))
        }
    }, [sellOrders])

    return {
        ordersAmount
    }
}



export {
    useTradeHeaderHook,
    useOrderPercentage
}
