import { useMainContext } from "../../../core/contexts/main"
import { useSocketContent } from "../../../core/contexts/socket-content"
import { useTradePrice } from "../../../core/contexts/trade-price"
import { useQueryContext } from "../../../core/contexts/query";
import { useAuthContext } from "../../../core/contexts/auth";
import { useEffect, useRef, useState } from "react";
import { formatNumber, stringToNumber } from "../../../core/utils/common";
import { loadPersistedData, persistData } from "../../../core/utils/persistor";
import { HOME } from "../../../core/constants/urls";
import { useMutation, useQuery } from "react-query";
import { postApiWithToken } from "../../../core/services/fetch-api/post";
import { normalFetch } from "../../../core/services/fetch-api/get";



const ERRORS = {
    en: { max: "Total price is greater than ", min: "Total price is less than " },
    fa: { max: "قیمت انتخابی بیشتر از سقف سفارش گذاری است. سقف سفارش: ", min: "قیمت انتخابی کمتر از کف سفارش گذاری است. کف سفارش: " },

}

export const useTradingSpot = () => {

    const { market, main: { lang } } = useMainContext()
    const { tradePrice } = useTradePrice()
    const { setToast } = useQueryContext()
    const { buyOrders, sellOrders, prices } = useSocketContent()
    const { profile } = useAuthContext()

    const [validTrade, setValidTrade] = useState({ buy: false, sell: false })
    const [activeType, setActiveType] = useState("buy")
    const {
        activeSpotTab: activeTab,
        setActiveSpotTab: setActiveTab
    } = useTradePrice()
    const [invoice, setInvoice] = useState({ type: null, visible: false })

    //OCO validation
    const ocoErrorInitial = {
        price: {
            show: false, message: '', type: null
        },
        stop: {
            show: false, message: '', type: null
        },
    }
    const [ocoError, setOcoError] = useState(ocoErrorInitial)
    const firstBuySuggestion = useRef(true)
    const firstSellSuggestion = useRef(true)

    /**
     * @typedef TradeSpotInput
     * @property {string|number} price
     * @property {string|number} stop
     * @property {string|number} limit
     * @property {string|number} amount
     * @property {string|number} total
     */
    const initialState = {
        price: 0, stop: 0, limit: 0, amount: 0, total: 0
    }
    const [buyInput, setBuyInput] = useState(initialState)
    const [sellInput, setSellInput] = useState(initialState)


    /**
     * @param {TradeSpotInput} state
     * @param {string} price
     */
    const getInputNewState = (state, price) => ({
        price: formatNumber(price),
        stop: 0,
        limit: 0,
        amount: state.amount,
        total: formatNumber(stringToNumber(state.amount) * price, { type: market.pair })
    })


    useEffect(() => {
        const p2pCache = loadPersistedData('p2p-cache')
        setBuyInput(p2pCache?.buyInput ? p2pCache.buyInput : initialState)
        setSellInput(p2pCache?.sellInput ? p2pCache.sellInput : initialState)

        return () => localStorage.removeItem('p2p-cache')
    }, [market])


    useEffect(() => {
        if (tradePrice.type) {
            setActiveType(tradePrice.type === "buy" ? "sell" : "buy")
        }
        if (market.pair === "irt") {
            if (tradePrice.buy) setBuyInput(state => getInputNewState(state, tradePrice.buy))
            if (tradePrice.sell) setSellInput(state => getInputNewState(state, tradePrice.sell))
        } else {
            setBuyInput(state => getInputNewState(state, tradePrice.value))
            setSellInput(state => getInputNewState(state, tradePrice.value))
        }
    }, [tradePrice])


    useEffect(() => {
        if (!firstBuySuggestion.current) firstBuySuggestion.current = true
        if (!firstSellSuggestion.current) firstSellSuggestion.current = true
    }, [market])


    useEffect(() => {
        let newBuyInput
        let newSellInput

        if (!buyInput.price) {

            if (sellOrders?.length) {
                newBuyInput = { ...initialState, price: formatNumber(sellOrders[0].priceUnit) }
            }
        }
        if (!sellInput.price) {
            if (buyOrders?.length) newSellInput = { ...initialState, price: formatNumber(buyOrders[0].priceUnit) }
        }

        if (activeTab === 0 || activeTab === 1) {
            if (newBuyInput) {
                if (firstBuySuggestion.current) {
                    setBuyInput(newBuyInput)
                    firstBuySuggestion.current = false
                }
            }
            if (newSellInput) {
                if (firstSellSuggestion.current) {
                    setSellInput(newSellInput)
                    firstSellSuggestion.current = false
                }
            }
        } else if (activeTab === 2) {
            if (newBuyInput) setBuyInput({ ...newBuyInput, limit: formatNumber(sellOrders[0].priceUnit) })
            if (newSellInput) setSellInput({ ...newSellInput, limit: formatNumber(buyOrders[0].priceUnit) })
        }
    }, [activeTab, buyOrders, sellOrders])


    const validateTrade = (type) => {
        const data = type === 'buy' ? buyInput : sellInput
        const { amount, price, limit, stop } = data
        let valid = true

        switch (activeTab) {
            case 0:
                valid = !!amount && !!price
                break
            case 1:
                valid = !!amount
                break
            case 2:
                valid = !!amount && !!limit && !!stop
                break
            case 3:
                valid = !!amount && !!limit && !!stop && !!price
                break
            default:
                break
        }
        return valid
    }

    const validateOco = (type) => {
        let valid = false
        const data = type === 'buy' ? buyInput : sellInput
        const { price: _price, stop: _stop } = data
        const stop = stringToNumber(_stop)
        const price = stringToNumber(_price)

        const coin = prices?.find(item => item.id === market?.coin)

        if (coin) {
            const marketPrice = coin[type]
            if (type === 'buy') {
                valid = price < marketPrice && stop > marketPrice
                if (!valid) {
                    setOcoError({
                        price: {
                            show: price > marketPrice,
                            message: 'price-lt-market',
                            type
                        },
                        stop: {
                            show: stop < marketPrice,
                            message: 'stop-gt-market',
                            type
                        }
                    })
                }
            } else {
                valid = price > marketPrice && stop < marketPrice
                if (!valid) {
                    setOcoError({
                        price: {
                            show: price < marketPrice,
                            message: 'price-gt-market',
                            type
                        },
                        stop: {
                            show: stop > marketPrice,
                            message: 'stop-lt-market',
                            type
                        }
                    })
                }
            }
        } else {
            setToast({
                isError: true, show: true,
                message: 'not-valid-oco-pair'
            })
        }
        return valid
    }

    /**
     * reset oco error
     */
    useEffect(() => {
        if (ocoError.price.show || ocoError.stop.show) {
            setOcoError(ocoErrorInitial)
        }
    }, [activeTab, buyInput, sellInput])

    useEffect(() => {
        const valid = {
            buy: validateTrade('buy'), sell: validateTrade('sell')
        }
        setValidTrade(valid)
    }, [buyInput, sellInput])

    /**
     * @param {string} type
     * @param limitsError
     * @param limits
     */
    const onOperationClicked = (type, limitsError, limits) => {

        const valid = validTrade[type]

        if (!!profile) {
            if (limitsError.userError) {
                window.location.href = HOME + "user/wallets/deposit"
            }
            else if (limitsError.error) {
                setToast({
                    isError: true, show: true,
                    message: ERRORS[lang][limitsError.type] + formatNumber(limits[limitsError.type])
                })
            }
            // all fields are filled
            else if (valid) {
                // oco has another layer of validation
                if (activeTab === 3) {
                    const validOco = validateOco(type)
                    validOco && setInvoice({ type, visible: true })
                }
                else setInvoice({ type, visible: true })
            } else {
                setToast({
                    isError: true, show: true,
                    message: "fill-input-error"
                })
            }
        } else {
            persistData('p2p-cache', { buyInput, sellInput })
            window.location.href =
                HOME + `user/register-signin?redirect=trade/${market?.coin?.toUpperCase()}_${market?.pair?.toUpperCase()}`
        }
    }

    const onInvoiceClosed = () => setInvoice({ type: null, visible: false })

    return {
        activeTab, activeType,
        setActiveTab, setActiveType,
        buyInput, setBuyInput,
        sellInput, setSellInput,
        onOperationClicked,
        invoice, onInvoiceClosed,
        validTrade, ocoError
    }
}


export const useWageCalculator = () => {
    const { profile: { token } } = useMainContext()

    return useMutation(
        'wages-calculator', (data) => postApiWithToken(data, token, "settings/wages/calculate"),
    )
}

export const useGetFiat = () => {
    const {
        profile: { token },
    } = useMainContext()

    return useQuery(
        'fiat-wage', () => normalFetch(token, 'settings/banks'),
        {
            select: res => res?.data?.data?.withdraw,
            staleTime: 5 * 60 * 1000,
            cacheTime: 5 * 60 * 1000
        }
    )
}

export const getCalculatedWages = (type, tradeType, wages, data, socketContent, market) => {

    let operationType;
    let affPair = 0;
    let affValue = 0

    if (tradeType === "p2p") {
        if (type === "buy") {
            operationType = stringToNumber(data.price) < Math.min(...socketContent?.sellOrders?.map(o => o.priceUnit)) ? "maker" : "taker"
        } else {
            operationType = stringToNumber(data.price) > Math.max(...socketContent?.buyOrders?.map(o => o.priceUnit)) ? "maker" : "taker"
        }
    } else {
        operationType = "maker" // TODO : Should change to taker in api and code
    }
    const totalPair = stringToNumber(data.price) * stringToNumber(data.amount)
    let feePair = wages.wage[operationType].factor * totalPair / 100
    let feeValue = wages.wage[operationType].factor * stringToNumber(data.amount) / 100

    const wageMax = wages.wage[operationType].max
    if (wageMax && wageMax < feeValue) {
        feeValue = wageMax
        feePair = wageMax * stringToNumber(data.price)
    }

    const feeOffPair = wages.stars?.off * feePair / 100
    const feeOffValue = wages.stars?.off * feeValue / 100
    if (wages.affiliate?.calculated) {
        if (type === 'buy') {
            affPair = wages.affiliate.calculated * stringToNumber(data.price)
            affValue = wages.affiliate.calculated
        } else {
            affPair = wages.affiliate.calculated
            affValue = wages.affiliate.calculated / stringToNumber(data.price)
        }

    }
    const receiveValue = stringToNumber(data.amount) - feeValue + feeOffValue + affValue
    const receivePair = totalPair - feePair + feeOffPair + affPair

    return {
        totalPair: formatNumber(totalPair, { type: market.pair }),
        totalValue: data.amount,
        feePair: formatNumber(feePair, { type: market.pair }),
        feeValue: formatNumber(feeValue),
        feeOffPair: formatNumber(feeOffPair, { type: market.pair }),
        feeOffValue: formatNumber(feeOffValue),
        affPair: formatNumber(affPair, { type: market.pair }),
        affValue: formatNumber(affValue),
        receivePair: formatNumber(receivePair, { type: market.pair }),
        receiveValue: formatNumber(receiveValue),
        withdrawPair: 0,
        withdrawValue: 0,
        loading: false
    }
}


export const getExtraWages = (
    networks,
    data,
    type
) => {

    const wages = []
    const nets = networks[type === "buy" ? "withdraw" : "deposit"]
    nets?.forEach(net => {
        const total = parseFloat(stringToNumber(data.total))
        const price = parseFloat(stringToNumber(data.price))

        let fee = total * net.feeFactor / 100
        let feeValue = fee / price

        if (net.feeMax && feeValue > net.feeMax) {
            feeValue = net.feeMax
            fee = feeValue * price
        }

        let payload = {
            network: net.network,
            fee, feeValue
        }

        // TODO: we should consider normal fees too
        const receive = total - fee
        if (receive > net.max && type === "sell") {
            payload = {
                ...payload,
                showNote: true,
                receiveMax: net.max
            }
        }

        wages.push(payload)
    })

    return wages
}


export const useP2pInvoiceHook = (
    data, type, tab, onClose
) => {

    const { market } = useMainContext()
    const { mutate: deepTrade, isLoading: p2pLoading } = useDeepTradeMutation(onClose)

    const onP2pContinue = () => {
        let payload = {
            type, amount: stringToNumber(data.amount), coin: market.coin
        }
        if (market.pair !== "irt") {
            payload = { ...payload, pair: market.pair }
        }
        switch (tab) {
            case 0:
                payload = { ...payload, priceUnit: parseFloat(stringToNumber(data.price)) }
                deepTrade(payload)
                break
            case 1:
                deepTrade(payload)
                break
            case 2:
                deepTrade({
                    type, priceUnit: stringToNumber(data.limit),
                    amount: stringToNumber(data.amount), coin: market.coin,
                    stop: stringToNumber(data.stop)
                })
                break
            case 3:
                deepTrade({
                    type, limit: stringToNumber(data.limit),
                    priceUnit: stringToNumber(data.price),
                    amount: stringToNumber(data.amount), coin: market.coin,
                    stop: stringToNumber(data.stop)
                })
                break
            default:
                break
        }
    }

    return {
        p2pLoading,
        onP2pContinue
    }
}


const useDeepTradeMutation = (onClose) => {

    const { profile: { token }, setLoading } = useMainContext()
    const { queryClient, setToast } = useQueryContext()
    const { refetchProfile } = useAuthContext()

    return useMutation(
        'deep-trade', (data) => postApiWithToken(data, token, "trades/deep"),
        {
            onSuccess: (res) => {
                onClose()
                setToast({
                    message: "trade-success-desc", isError: false, show: true
                })
                setLoading(true)
                setTimeout(() => {
                    queryClient.invalidateQueries('fetch-my-orders')
                    queryClient.invalidateQueries('fetch-orders-history')
                    refetchProfile()
                    setLoading(false)
                }, 2000)
            },
            onError: (res) => {
                setLoading(false)
                onClose()
            }
        }
    )
}
