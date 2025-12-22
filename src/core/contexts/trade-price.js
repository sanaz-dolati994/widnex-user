import { createContext, useContext, useState } from "react";


const TradePriceContext = createContext()

export const useTradePrice = () => {
    return useContext(TradePriceContext)
}

export const TradePriceProvider = ({ children }) => {

    const [tradePrice, setTradePrice] = useState({
        buy: null, sell: null, value: null, type: null
    })

    /**
     * temporary
     */
    const [activeSpotTab, setActiveSpotTab] = useState(0)

    return (
        <TradePriceContext.Provider value={{ tradePrice, setTradePrice, activeSpotTab, setActiveSpotTab }}>
            {children}
        </TradePriceContext.Provider>
    )
}
