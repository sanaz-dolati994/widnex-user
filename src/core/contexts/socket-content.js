import { createContext, useContext, useEffect, useState } from "react";
import { useMainContext } from "./main";
import { useSocket } from "./socket";


const SocketContentContext = createContext()

export const useSocketContent = () => {
    return useContext(SocketContentContext)
}

export const SocketContentProvider = ({ children }) => {

    const socket = useSocket()
    const { market } = useMainContext()

    const [prices, setPrices] = useState(null)
    const [trades, setTrades] = useState(null)

    const [buyOrders, setBuyOrders] = useState(null)
    const [sellOrders, setSellOrders] = useState(null)

    const resetContent = () => {
        setBuyOrders(null)
        setSellOrders(null)
        setTrades(null)
    }

    useEffect(() => {
        resetContent()
    }, [market])


    /* prices */
    useEffect(() => {
        if (socket) {
            socket.emit("get.prices")
            socket.on("prices", (data) => {
                setPrices(data)
            })
        }

        return () => {
            if (socket) {
                socket.off("prices")
            }
        }
    }, [socket])


    /* trades */
    useEffect(() => {
        if (socket) {
            socket.emit("get.trades", { coin: market.coin, pair: market.pair })
            socket.on(`trades.${market.coin}.${market.pair}`, (data) => {
                // if (tradeRef.current) ordersRefetch("trade")
                // else tradeRef.current = true
                setTrades(data)
            })
        }

        return () => {
            if (socket) {
                socket.off(`trades.${market.coin}.${market.pair}`)
            }
        }
    }, [socket, market])


    /* orders - buy */
    useEffect(() => {
        if (socket) {
            socket.emit(`get.orders.buy`, { coin: market.coin, pair: market.pair })
            socket.on(`orders.buy.${market.coin}.${market.pair}`, (data) => {
                // if (buyRef.current) ordersRefetch("order")
                // else buyRef.current = true
                setBuyOrders(data)
            })
        }

        return () => {
            if (socket) {
                socket.off(`orders.buy.${market.coin}.${market.pair}`)
            }
        }
    }, [socket, market])


    /* orders - sell */
    useEffect(() => {
        if (socket) {
            socket.emit(`get.orders.sell`, { coin: market.coin, pair: market.pair })
            socket.on(`orders.sell.${market.coin}.${market.pair}`, (data) => {
                // if (sellRef.current) ordersRefetch("order")
                // else sellRef.current = true
                setSellOrders(data)
            })
        }

        return () => {
            if (socket) {
                socket.off(`orders.sell.${market.coin}.${market.pair}`)
            }
        }
    }, [socket, market])


    return (
        <SocketContentContext.Provider value={{ prices, trades, buyOrders, sellOrders, resetContent }}>
            {children}
        </SocketContentContext.Provider>
    )
}
