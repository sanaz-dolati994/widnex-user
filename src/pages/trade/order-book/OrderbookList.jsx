import { formatNumber } from "../../../core/utils/common"



const OrderbookList = ({ orders = [], _max, onOrderClicked, type }) => {

    const bgColor = type === 'sell' ? 'bg-red-400' : 'bg-green-400'
    const textColor = type === 'sell' ? 'text-red-400' : 'text-green-400'

    return (
        <>
            {orders?.map((order, idx) => {

                const hotbar = order.price / _max[type] * 100
                return (
                    <div
                        className={'grid grid-cols-3 text-[0.675rem] dark:hover:bg-gray-800 p-2 rounded-md cursor-pointer hover:bg-gray-200 relative'}
                        key={idx}
                        onClick={() => onOrderClicked("sell", order.priceUnit)}
                    >
                        <div
                            style={{ width: `${hotbar}%` }}
                            className={`
                absolute right-0 top-0 ${bgColor} h-full bg-opacity-10   
            `}
                        />
                        <span className={textColor}>{formatNumber(order.priceUnit)}</span>
                        <span>{formatNumber(order.amount)}</span>
                        <div className={'flex justify-end'}>
                            <span>{formatNumber(order.price)}</span>
                        </div>
                    </div>
                )
            })}
        </>
    )
}

export default OrderbookList