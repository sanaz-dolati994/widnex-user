import { useEffect, useState } from "react"
import { useMainContext } from "../../../core/contexts/main"
import { useSocketContent } from "../../../core/contexts/socket-content"
import { useWindowSize } from "../../../core/hooks/useWindowSize"
import { getCalculatedWages, getExtraWages, useGetFiat, useP2pInvoiceHook, useWageCalculator } from "../utils/spot"
import { formatNumber, stringToNumber } from "../../../core/utils/common"
import { SOCKET_URL } from "../../../core/constants/urls"
import { Decoration } from "../../../styles/CoinOperationStyles"
import Text from "../../../core/utils/Text"
import Loading from "../common/Loading"
import { ClipLoader } from "react-spinners"
import { TABLET_SIZE } from "../../../core/constants/common"
import RespModal from "../common/RespModal"


const Invoice = ({
    data, type,
    tab, onClose,
    tradeType = "p2p",
    otcType = "",
    networks = null,
    onOtcSuccess,
    modal
} = {}) => {

    const { width } = useWindowSize()
    const { market, setLoading } = useMainContext()
    const { data: wages, mutate: calculateWages } = useWageCalculator()
    const socketContent = useSocketContent()

    const { data: fiat } = useGetFiat()

    const initialState = {
        totalPair: "", totalValue: "",
        feePair: "", feeValue: "",
        feeOffPair: "", feeOffValue: "",
        affPair: "0", affValue: "0",
        withdrawPair: "0", withdrawValue: "0",
        receivePair: "", receiveValue: "",
        loading: true, added: false
    }
    const [invoiceCache, setInvoiceCache] = useState(initialState)
    const [invoiceData, setInvoiceData] = useState(initialState)

    const [extraWages, setExtraWages] = useState([])

    /**
     * calculate wages
     */
    useEffect(() => {
        if (tab === 1) return
        let body = {
            amount: stringToNumber(data.amount),
            section: tradeType,
            price: stringToNumber(data.price),
            coin: tradeType === "p2p" ? market.coin : data.coin,
            pair: tradeType === "p2p" ? market.pair : "irt",
            type
        }
        calculateWages(body)
    }, [])

    /**
     * setting invoice data on wage calculate
     */
    useEffect(() => {
        if (wages) {
            const invoiceData = getCalculatedWages(
                type, tradeType, wages.data.data, data, socketContent, market
            )
            setInvoiceCache(invoiceData)
            setInvoiceData(invoiceData)
        }
    }, [wages])


    /**
     * extra wages
     */
    useEffect(() => {
        if (networks) {
            const extra = getExtraWages(networks, data, type)
            setExtraWages(extra)
        }
    }, [networks])

    /**
     * withdraw wage
     */
    const getWithdrawWage = () => {
        const feeFactor = (stringToNumber(invoiceData.totalPair) * fiat.feeFactor) / 100
        const feePair = Math.min(feeFactor, fiat.feeMax)
        const feeValue = feePair / stringToNumber(data?.price)

        return {
            ...invoiceCache,
            withdrawPair: formatNumber(feePair, { type: market?.pair }),
            withdrawValue: formatNumber(feeValue),
            receivePair: formatNumber(stringToNumber(invoiceData.receivePair) - feePair, { type: market?.pair }),
            receiveValue: formatNumber(stringToNumber(invoiceData.receiveValue) - feeValue)
        }
    }

    /**
     * network data => invoice data
     */
    // useEffect(() => {
    //     if (networkData.selected !== null && extraWages.length && !invoiceCache.added) {
    //         const current = extraWages[networkData.selected]
    //         let netInvoiceData = {
    //             ...invoiceCache,
    //             withdrawPair: formatNumber(current.fee, { type: market?.pair }),
    //             withdrawValue: formatNumber(current.feeValue),
    //             added: true,
    //             showNote: current.showNote,
    //             receiveMax: current.receiveMax,
    //             receivePair: formatNumber(stringToNumber(invoiceCache.receivePair) - current.fee, { type: market?.pair }),
    //             receiveValue: formatNumber(stringToNumber(invoiceCache.receiveValue) - current.feeValue)
    //         }
    //         setInvoiceData(netInvoiceData)
    //     }
    // }, [networkData])

    const {
        p2pLoading,
        onP2pContinue
    } = useP2pInvoiceHook(
        data, type, tab, onClose
    )


    const getInvoiceText = (reverse = false) => {
        if (reverse) {
            if (type === "buy") {
                return tradeType === "p2p" ? market.pair?.toUpperCase() : "IRT"
            } else {
                return tradeType === "p2p" ? market.coin?.toUpperCase() : data.coin?.toUpperCase()
            }
        } else {
            if (type === "buy") {
                return tradeType === "p2p" ? market.coin?.toUpperCase() : data.coin?.toUpperCase()
            } else {
                return tradeType === "p2p" ? market.pair?.toUpperCase() : "IRT"
            }
        }
    }

    const onContinueClicked = () => {
        onP2pContinue()
    }

    /**
     * p2p market
     */
    useEffect(() => {
        if (tab === 1) {
            onP2pContinue()
        }
    }, [])


    const Rendered = () => {

        return (
            <div className={'lg:fixed relative lg:left-0 lg:top-0 lg:w-screen lg:h-screen flex items-center justify-center backdrop-blur-sm z-[1000000]'}>
                <div className={'w-full lg:w-[500px] p-3 lg:p-5 rounded-md dark:bg-primaryBg bg-white shadow lg:border-[1px] border-slate-500 border-opacity-30 lg:pt-10 relative'}>
                    <div className={'lg:absolute flex justify-center lg:left-[50%] lg:translate-x-[-50%] lg:top-0 lg:translate-y-[-50%]'}>
                        <img
                            src={
                                SOCKET_URL +
                                `assets/icon/${market.coin}.png`
                            }
                            width={72}
                            height={72}
                            alt={' '}
                        />
                    </div>
                    <div className={'border-b-[1px] border-slate-500 border-opacity-30 pb-3 text-center'}>
                        <span>{`فاکتور ${type === 'buy' ? 'خرید' : 'فروش'}`}</span>
                    </div>

                    <div className={'flex flex-col gap-4 pt-5 text-sm dark:text-white'}>
                        {invoiceData.loading ?
                            <div className={'relative h-[200px] w-full'}>
                                <Loading loading />
                            </div>
                            :
                            <>
                                <div className={'grid grid-cols-2 py-5 px-2 text-xs lg:text-base lg:px-3 gap-y-2 rounded-md bg-slate-200 dark:bg-slate-700'}>
                                    <span>مجموع</span>
                                    <div className={'flex items-center justify-start gap-1'} dir={'ltr'}>
                                        <span>{`${invoiceData.totalValue} ${market.coin.toUpperCase()}`}</span>
                                        <span className={'text-xl'}>≈</span>
                                        <span>{`${invoiceData.totalPair} ${market.pair.toUpperCase()}`}</span>
                                    </div>
                                    <span>سود معرف</span>
                                    <div className={'flex items-center justify-start gap-1'} dir={'ltr'}>
                                        <span>{`${invoiceData.affValue} ${market.coin.toUpperCase()}`}</span>
                                        <span className={'text-xl'}>≈</span>
                                        <span>{`${invoiceData.affPair} ${market.pair.toUpperCase()}`}</span>
                                    </div>
                                    <span>کارمزد</span>
                                    <div className={'flex items-center justify-start gap-1'} dir={'ltr'}>
                                        <span>{`${invoiceData.feeValue} ${market.coin.toUpperCase()}`}</span>
                                        <span className={'text-xl'}>≈</span>
                                        <span>{`${invoiceData.feePair} ${market.pair.toUpperCase()}`}</span>
                                    </div>
                                    <span>تخفیف بر کارمزد</span>
                                    <div className={'flex items-center justify-start gap-1'} dir={'ltr'}>
                                        <span>{`${invoiceData.feeOffValue} ${market.coin.toUpperCase()}`}</span>
                                        <span className={'text-xl'}>≈</span>
                                        <span>{`${invoiceData.feeOffPair} ${market.pair.toUpperCase()}`}</span>
                                    </div>
                                </div>
                                <div className={'grid grid-cols-2 p-3 rounded-md bg-slate-200 dark:bg-slate-700'}>
                                    <span>دریافتی نهایی</span>
                                    <div className={'flex items-center justify-start gap-1'} dir={'ltr'}>
                                        {type === 'sell' ?
                                            <span>{`${invoiceData.receiveValue} ${market.coin.toUpperCase()}`}</span>
                                            :
                                            <span>{`${invoiceData.receivePair} ${market.pair.toUpperCase()}`}</span>
                                        }
                                    </div>
                                </div>
                            </>
                        }

                        <p
                            className={
                                'text-primary flex justify-center items-center gap-2'
                            }>
                            {width >= 768 && <Decoration />}
                            <Text
                                className='text-dark-secondary dark:text-white text-xs lg:text-sm font-bold lg:font-normal'
                                tid={'invoice-popup-hint'}
                            />
                        </p>

                        <div
                            className={
                                'flex items-center justify-between gap-3 w-full'
                            }>
                            <div
                                onClick={onClose}
                                className={
                                    'grow text-sm text-center bg-gray-300 text-heading px-6 py-2 rounded-md shadow cursor-pointer'
                                }>
                                <Text tid={'cancel'} />
                            </div>
                            <div
                                onClick={onContinueClicked}
                                className={
                                    'grow text-sm text-center bg-cBlue px-6 py-2 rounded-md shadow cursor-pointer'
                                }>
                                {p2pLoading ?
                                    <ClipLoader size={14} />
                                    :
                                    <Text tid={'go-on'} className={'text-white'} />
                                }
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }

    const onboard = width > TABLET_SIZE ?
        <Rendered />
        :
        <RespModal show _height={'auto'} onClose={onClose}>
            <Rendered />
        </RespModal>

    return (
        <>
            {onboard}
        </>
    )
}




export default Invoice;
