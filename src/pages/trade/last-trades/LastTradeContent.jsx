import { useMainContext } from "../../../core/contexts/main"
import { formatDate, formatNumber } from "../../../core/utils/common"



const LastTradeContent = ({ tradesOnBoard }) => {

    const { market } = useMainContext()

    return (
        <>
            <div className={'p-3'}>
                <span>لیست معاملات</span>
            </div>

            <div className={`grid grid-cols-4 dark:text-gray-400
             text-gray-600 border-b-[1px] px-3 pb-3 dark:border-card-border text-xs`}>
                <div className={'col-span-2'}>
                    <span>قیمت (TMN)</span>
                </div>
                <span>{`مقدار (${market.coin.toUpperCase()})`}</span>
                <div className={'flex justify-end'}>
                    <span>زمان</span>
                </div>
            </div>

            <div className={'flex flex-col overflow-y-auto h-[500px] px-2'}>
                {tradesOnBoard.map(trade => {

                    return (
                        <div className={'grid grid-cols-4 text-xs py-3 border-b-[1px] dark:border-card-border'}>
                            <div className={'col-span-2'}>
                                <span
                                    className={`${trade.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}
                                >
                                    {formatNumber(trade.priceUnit)}
                                </span>
                            </div>
                            <span>
                                {formatNumber(trade.amount)}
                            </span>
                            <div className={'flex justify-end'}>
                                <span>
                                    {formatDate(trade.createdAt, "time", "fa-IR")}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default LastTradeContent