import { SOCKET_URL } from "../../../core/constants/urls"
import Loading from "../common/Loading"
import { usePersianNames } from "../utils"
import { useTradeHeaderHook } from "../utils/useTradeHeaderHook"
import { formatNumber } from "../../../core/utils/common"
import Text from "../../../core/utils/Text"
import { CgChevronDown } from "react-icons/cg"

const RMarketChanges = () => {

    const { findPersianName } = usePersianNames()
    const {
        market,
        price,
        currentChange,
        loading,
    } = useTradeHeaderHook()

    let change = currentChange?._24change
    if (typeof change === 'number') change = change.toFixed(2)

    return (
        <div>
            <div className={'flex items-center gap-2 text-sm'}>
                <img
                    width={32}
                    height={32}
                    src={SOCKET_URL + `assets/icon/${market?.coin?.toLowerCase()}.png`}
                    alt={`${market.coin?.toLowerCase()}.png`}
                />
                <div className={'flex flex-col'}>
                    <span>
                        <span>{`${market.coin?.toUpperCase()}`}</span>
                        <span className={'text-gray-400 dark:text-gray-500'}> / </span>
                        <span className={'text-gray-400 dark:text-gray-500'}>{`${market.pair?.toUpperCase()}`}</span>
                    </span>
                    <span className={'text-gray-400 text-xs'}>
                        <span>{`${findPersianName(market.coin)}`}</span>
                        <span> / </span>
                        <span>{`${findPersianName(market.pair)}`}</span>
                    </span>
                </div>
            </div>
            <div className={'grid grid-cols-3 gap-2 mt-4 text-xs'}>
                <div className={'flex flex-col gap-1 items-start'}>
                    <span className={`${price.color === 'sell' ? 'text-red-500' : 'text-green-500'}`}>
                        {formatNumber(price.tooman, { type: 'irt' })}
                    </span>
                    <span dir={'ltr'} className={'text-xs'}>
                        {`${formatNumber(price.usdt, { type: 'usdt' })} USDT`}
                    </span>
                    <div className={`${change < 0 ? 'text-red-500' : 'text-green-500'} flex items-center gap-1`}>
                        <span dir={'ltr'}>
                            {`${change} %`}
                        </span>
                        <CgChevronDown className={`mb-1 ${change < 0 ? 'rotate-0' : 'rotate-180'}`} size={18} />
                    </div>
                </div>
                <div className={'flex flex-col gap-1 items-start text-[0.65rem]'}>
                    <Text className={'text-gray-400'} tid={'widnex-max-price'} />
                    <span>
                        {`${formatNumber(currentChange?.max, { type: 'usdt' })}`}
                    </span>
                    <Text className={'text-gray-400'} tid={'world-price'} />
                    <span>
                        {`${formatNumber(price?.usdt, { type: 'usdt' })}`}
                    </span>
                </div>

                <div className={'flex flex-col gap-1 items-start text-[0.65rem]'}>
                    <Text className={'text-gray-400'} tid={'widnex-min-price'} />
                    <span>
                        {`${formatNumber(currentChange?.min, { type: 'usdt' })}`}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default RMarketChanges