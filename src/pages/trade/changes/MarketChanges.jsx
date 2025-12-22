import Card from "../../../components/common/Card"
import { SOCKET_URL } from "../../../core/constants/urls"
import Loading from "../common/Loading"
import { usePersianNames } from "../utils"
import { useTradeHeaderHook } from "../utils/useTradeHeaderHook"
import { formatNumber } from "../../../core/utils/common"
import Text from "../../../core/utils/Text"


const MarketChanges = () => {

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
        <Card className={'w-full h-full relative'}>
            <Loading loading={loading} />

            <div className={'flex items-center gap-8 w-full overflow-y-auto h-full'}>
                <div className={'flex items-center gap-2'}>
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
                <div className={'flex flex-col items-center justify-between h-[42px] gap-1'}>
                    <span className={`${price.color === 'sell' ? 'text-red-500' : 'text-green-500'}`}>
                        {formatNumber(price.tooman, { type: 'irt' })}
                    </span>
                    <span dir={'ltr'} className={'text-xs'}>
                        {`${formatNumber(price.usdt, { type: 'usdt' })} USDT`}
                    </span>
                </div>
                <div className={'flex flex-col items-center justify-between h-[42px] gap-1'}>
                    <Text className={'text-gray-400 text-xs'} tid={'widnex-24h-change'} />
                    <span dir={'ltr'} className={`${currentChange?._24change < 0 ? 'text-red-500' : 'text-green-500'} text-xs`}>
                        {`${change} %`}
                    </span>
                </div>

                <div className={'flex flex-col items-center justify-between h-[42px] gap-1'}>
                    <Text className={'text-gray-400 text-xs'} tid={'widnex-max-price'} />
                    <span className={`text-xs`}>
                        {`${formatNumber(currentChange?.max, { type: 'usdt' })}`}
                    </span>
                </div>

                <div className={'flex flex-col items-center justify-between h-[42px] gap-1'}>
                    <Text className={'text-gray-400 text-xs'} tid={'widnex-min-price'} />
                    <span className={`text-xs`}>
                        {`${formatNumber(currentChange?.min, { type: 'usdt' })}`}
                    </span>
                </div>

                <div className={'flex flex-col items-center justify-between h-[42px] gap-1'}>
                    <Text className={'text-gray-400 text-xs'} tid={'world-price'} />
                    <span className={`text-xs`}>
                        {`${formatNumber(price?.usdt, { type: 'usdt' })}`}
                    </span>
                </div>
            </div>
        </Card>
    )
}

export default MarketChanges