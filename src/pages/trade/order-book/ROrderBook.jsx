import { useMemo, useState } from "react"
import { useMainContext } from "../../../core/contexts/main"
import { useSocketContent } from "../../../core/contexts/socket-content"
import useOrdersBook from "../utils/useOrdersBook"
import { formatNumber } from "../../../core/utils/common"
import OrderbookTab from "./OrderbookTab"
import OrderbookList from "./OrderbookList"



const ROrderBook = () => {

    const [orderBookTab, setOrderBookTab] = useState('all')
    const { market } = useMainContext()
    const { trades } = useSocketContent()
    const {
        _sellOrders, _buyOrders,
        sellHover, buyHover,
        setSellHover, setBuyHover,
        sellHoverRef, buyHoverRef,
        sellHoverDetails, buyHoverDetails,
        onSellOrdersHover, onBuyOrdersHover,
        _max, onOrderClicked, loading
    } = useOrdersBook()

    const lastTrade = useMemo(() => {
        let res = {
            irt: 0,
            usdt: 0,
            color: ''
        }
        if (trades?.length) {
            if (trades.length > 1) {
                let diff = trades[0].priceUnit - trades[1].priceUnit
                if (diff > 0) res.color = 'green'
                if (diff < 0) res.color = 'red'
                res.irt = trades[0].priceUnit
                res.usdt = trades[0].price
            }
        }
        return res
    }, [trades])

    return (
        <div className={'flex flex-col gap-3 relative'}>
            <div className={`flex justify-end border-b-[1px] dark:border-card-border pb-2`}>
                <OrderbookTab
                    orderBookTab={orderBookTab}
                    setOrderBookTab={setOrderBookTab}
                />
            </div>
            <div className={'grid grid-cols-2 mt-2 px-2'}>
                {['قیمت(TMN)', `مقدار(${market.coin?.toUpperCase()})`].map((head, idx) => {

                    return (
                        <div className={`
                                ${idx === 1 ? 'flex justify-end' : ''}
                                text-xs
                            `} key={head}>
                            <span>{head}</span>
                        </div>
                    )
                })}
            </div>
            <div className={`flex w-full ${orderBookTab === 'all' ? 'items-end min-h-[144px]' : 'min-h-[244px]'}`}>
                <div className={`flex flex-col w-full gap-1 mt-3`}>

                    <OrderbookList
                        orders={
                            orderBookTab === 'all' ?
                                _sellOrders?.slice(0, 6).reverse() : (
                                    orderBookTab === 'sell' ?
                                        _sellOrders?.slice(0, 12).reverse() :
                                        _buyOrders?.slice(0, 12)
                                )
                        }
                        onOrderClicked={onOrderClicked}
                        _max={_max}
                        type={orderBookTab === 'all' ? 'sell' : orderBookTab}
                    />
                </div>
            </div>

            {orderBookTab === 'all' ?
                <>
                    <div className={'my-1 py-2 border-b-[1px] border-t-[1px] dark:border-card-border text-sm flex items-center justify-between'}>
                        <span className={`${lastTrade.color === 'red' && 'text-red-500'}
                    ${lastTrade.color === 'green' && 'text-green-500'}
                `}>
                            {formatNumber(lastTrade.irt, { type: 'irt' })}
                        </span>
                    </div>

                    <div className={`flex flex-col gap-1 mt-3`}>
                        <OrderbookList
                            orders={
                                _buyOrders?.slice(0, 6)
                            }
                            onOrderClicked={onOrderClicked}
                            _max={_max}
                            type={'buy'}
                        />

                    </div>
                </>
                : null}

        </div>
    )
}

export default ROrderBook