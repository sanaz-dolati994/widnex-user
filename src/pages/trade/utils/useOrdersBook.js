import { useEffect, useRef, useState } from "react"
import { useMainContext } from "../../../core/contexts/main"
import { useSocketContent } from "../../../core/contexts/socket-content"
import { useTradePrice } from "../../../core/contexts/trade-price"
import { useWindowSize } from "../../../core/hooks/useWindowSize"
import { TABLET_SIZE } from "../../../core/constants/common"



const useOrdersBook = () => {

    const { width } = useWindowSize()
    const { market } = useMainContext()
    const { buyOrders, sellOrders } = useSocketContent()
    const { setTradePrice } = useTradePrice()
    const [loading, setLoading] = useState(true)

    const [_sellOrders, setSellOrders] = useState(null)
    const [_buyOrders, setBuyOrders] = useState(null)
    const [_max, setMax] = useState({ buy: 0, sell: 0 })

    const [sellHoverDetails, setSellHoverDetails] = useState({
        avg: null, sum: null, total: null
    })

    const [buyHoverDetails, setBuyHoverDetails] = useState({
        avg: null, sum: null, total: null
    })

    const [buyHover, setBuyHover] = useState(-1)
    const [sellHover, setSellHover] = useState(-1)
    const sellHoverRef = useRef([])
    const buyHoverRef = useRef([])

    useEffect(() => {
        if (market) {
            setBuyOrders(null)
            setSellOrders(null)
        }
    }, [market])

    // concat buy orders
    useEffect(() => {
        if (buyOrders) setBuyOrders(concatOrders(buyOrders, _buyOrders))
    }, [buyOrders])

    // concat sell orders
    useEffect(() => {
        if (sellOrders) setSellOrders(concatOrders(sellOrders, _sellOrders))
    }, [sellOrders])

    useEffect(() => {
        setLoading(!buyOrders && !sellOrders)
    }, [buyOrders, sellOrders])

    useEffect(() => {
        if (_buyOrders) {
            const buy = Math.max(..._buyOrders.slice(0, 15).map(o => o.price))
            setMax(state => ({ ...state, buy }))
        }
    }, [_buyOrders])


    useEffect(() => {
        if (_sellOrders) {
            const sell = Math.max(..._sellOrders.slice(0, 15).map(o => o.price))
            setMax(state => ({ ...state, sell }))
        }
    }, [_sellOrders])


    const onBuyOrdersHover = (idx) => {
        setBuyHover(idx)
        let sum = 0;
        let total = 0;
        let avgTotal = 0;
        for (let i = 0; i < idx + 1; i++) {
            const curr = _buyOrders[i]
            total += curr.price
            sum += curr.amount
            avgTotal += curr.priceUnit
        }
        const avg = avgTotal / (idx + 1)
        setBuyHoverDetails({ avg, sum, total })
    }

    const onSellOrdersHover = (idx) => {
        setSellHover(idx)
        let sum = 0;
        let total = 0;
        let avgTotal = 0;
        for (let i = 0; i < (Math.min(_sellOrders.length, width > TABLET_SIZE ? 15 : 5)) - idx; i++) {
            const curr = _sellOrders[i]
            total += curr.price
            sum += curr.amount
            avgTotal += curr.priceUnit
        }
        const avg = avgTotal / ((Math.min(_sellOrders.length, width > TABLET_SIZE ? 15 : 5)) - idx)
        setSellHoverDetails({ avg, sum, total })
    }


    const onOrderClicked = (type, price) => {
        if (market.pair === "irt") {
            setTradePrice(state => ({ ...state, [type === "buy" ? "sell" : "buy"]: price, type }))
        } else {
            setTradePrice(state => ({ ...state, value: price, type }))
        }
    }

    return {
        _sellOrders, _buyOrders,
        sellHover, buyHover,
        setSellHover, setBuyHover,
        sellHoverRef, buyHoverRef,
        sellHoverDetails, buyHoverDetails,
        onSellOrdersHover, onBuyOrdersHover,
        _max, onOrderClicked, loading
    }
}


/**
 * Concat socket orders according to unitPrice
 * @param {SocketOrder[]} orders
 * @param old - old contacted orders
 * @return {SocketOrder[]}
 */
export const concatOrders = (orders, old) => {
    let temp = []
    let amount = 0;
    let price = 0;
    for (let i = 0; i < orders.length; i++) {
        const curr = orders[i]
        if (i === orders.length - 1) {
            amount += curr.amount
            price += curr.price
            curr.animate = isNewOrder(curr, old)
            temp.push({
                ...curr, amount: amount.toFixed(6), price
            })
            break
        }
        if (curr.priceUnit === orders[i + 1].priceUnit) {
            amount += curr.amount
            price += curr.price
        } else {
            if (!amount && !price) {
                const order = { ...orders[i] }
                order.animate = isNewOrder(order, old)
                temp.push(order)
            } else {
                amount += curr.amount
                price += curr.price

                curr.animate = isNewOrder(curr, old)

                // if (!curr.animate) {
                //     const probableOldItem = old?.find(c => c._id === curr._id)
                //     if (!!probableOldItem) {
                //         if (probableOldItem.price !== curr.price) {
                //             curr.animate = true
                //         }
                //     }
                // }

                temp.push({
                    ...curr, amount: amount.toFixed(6), price
                })
                amount = 0
                price = 0
            }
        }
    }

    return temp
}


export const isNewOrder = (order, old) => {
    if (!old) return false
    let isNew = true
    for (let i = 0; i < old.length; i++) {
        const curr = old[i]
        if (curr._id === order._id) {
            if (curr.amount !== order.amount) continue
            isNew = false
            break
        }
    }
    return isNew
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

export default useOrdersBook;
