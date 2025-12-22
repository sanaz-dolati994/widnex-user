import { useMainContext } from "../../../core/contexts/main"
import useOrdersBook from "../utils/useOrdersBook"
import { formatNumber } from "../../../core/utils/common"



const AdvanceOrderBook = () => {

    const { market } = useMainContext()
    const {
        _sellOrders, _buyOrders,
        sellHover, buyHover,
        setSellHover, setBuyHover,
        sellHoverRef, buyHoverRef,
        sellHoverDetails, buyHoverDetails,
        onSellOrdersHover, onBuyOrdersHover,
        _max, onOrderClicked, loading
    } = useOrdersBook()

    return (
        <div className={'flex flex-col gap-2 text-xs mt-3'}>
            <span className={'text-slate-500'}>فروشندگان / خریداران</span>

            <div className={'grid grid-cols-2 gap-2'}>
                <div className={'flex flex-col gap-3 relative'}>
                    <div className={'grid grid-cols-2 mt-3 px-2'}>
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
                    <div className={'flex w-full min-h-[144px]'}>
                        <div className={`flex flex-col w-full gap-1 mt-3`}>
                            {_sellOrders?.slice(0, 15).reverse().map((order, idx) => {

                                const hotbar = order.price / _max.sell * 100
                                return (
                                    <div
                                        className={'grid grid-cols-2 text-[0.675rem] dark:hover:bg-gray-800 p-2 rounded-md cursor-pointer hover:bg-gray-200 relative'}
                                        key={idx}
                                    >
                                        <div
                                            style={{ width: `${hotbar}%` }}
                                            className={`
                                            absolute right-0 top-0 bg-red-400 h-full bg-opacity-10   
                                        `}
                                        />
                                        <span className={'text-red-400'}>{formatNumber(order.priceUnit)}</span>
                                        <div className={'flex justify-end'}>
                                            <span>{formatNumber(order.amount)}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div className={'flex flex-col gap-3 relative'}>
                    <div className={'grid grid-cols-2 mt-3 px-2'}>
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
                    <div className={'flex w-full min-h-[144px]'}>
                        <div className={`flex flex-col w-full gap-1 mt-3`}>
                            {_buyOrders?.slice(0, 15).reverse().map((order, idx) => {

                                const hotbar = order.price / _max.buy * 100
                                return (
                                    <div
                                        className={'grid grid-cols-2 text-[0.675rem] dark:hover:bg-gray-800 p-2 rounded-md cursor-pointer hover:bg-gray-200 relative'}
                                        key={idx}
                                    >
                                        <div
                                            style={{ width: `${hotbar}%` }}
                                            className={`
                                            absolute right-0 top-0 bg-green-400 h-full bg-opacity-10   
                                        `}
                                        />
                                        <span className={'text-green-400'}>{formatNumber(order.priceUnit)}</span>
                                        <div className={'flex justify-end'}>
                                            <span>{formatNumber(order.amount)}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdvanceOrderBook