import { useEffect, useState } from "react";
import { useMarketQuery, usePairsQuery } from "../utils/useMarketQuery"

/**
 * Market Change hook for all pairs
 * @returns {{changes: *[], loading: boolean}}
 */
const useMarketChange = () => {

    const { data: markets, isFetching: marketLoading } = useMarketQuery()
    const { data: pairs, isFetching: pairsLoading } = usePairsQuery()

    // { coin, pair, _24change, _24value, _7change, _7value  }
    const [changes, setChanges] = useState([])

    useEffect(() => {
        try {
            let temp = []
            markets?.forEach(market => {
                try {
                    temp.push(
                        {
                            coin: market.id, pair: "irt",
                            _24change: market.changes["24h"].changePresent,
                            _24value: market.changes["24h"].changeValue,
                            _7change: market.changes["7d"].changePresent,
                            _7value: market.changes["7d"].changeValue,
                            min: market.changes["24h"].min,
                            max: market.changes["24h"].max
                        }
                    )
                    pairs?.forEach(pair => {
                        try {
                            if (market.id !== pair.id) {
                                const pairMarket = markets.find(c => c.id === pair.id)
                                const pairChange = calculateChange(market, pairMarket)

                                temp.push({
                                    coin: market.id, pair: pair.id,
                                    _24change: pairChange,
                                    ...pairChange
                                })
                            }
                        } catch (err) {
                            console.log(pair.id)
                        }
                    })
                } catch (err) {

                }

            })

            if (temp.length) setChanges(temp)

        } catch (e) { }
    }, [markets, pairs])


    return { changes, loading: marketLoading || pairsLoading }

}

/**
 * calculate pair change
 * @param coin
 * @param pair
 * @returns {{_24change: number, _24value: number}}
 */
const calculateChange = (coin, pair) => {
    const oldCoin = coin.value - coin.changes["24h"].changeValue
    const oldPair = pair.value - pair.changes["24h"].changeValue

    const oldPairValue = oldCoin / oldPair
    const newPairValue = coin.value / pair.value

    return {
        _24change: (newPairValue - oldPairValue) / oldPairValue * 100,
        _24value: newPairValue - oldPairValue
    }
}


export default useMarketChange;
