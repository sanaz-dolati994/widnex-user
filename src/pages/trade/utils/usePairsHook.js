import { useEffect, useState } from "react";
import { usePairsQuery } from "./useMarketQuery";
import useMarketChanges from "./useMarketChange"
import { useSocketContent } from "../../../core/contexts/socket-content";
import { persistData } from "../../../core/utils/persistor";
import { usePairContext } from "../pairs/Pairs";


const useMakePairs = ({ filters, setFilters }) => {

    const { prices } = useSocketContent()
    const { data: pairs } = usePairsQuery()
    const { changes, loading } = useMarketChanges()

    const [fullPairs, setFullPairs] = useState([])
    const [onBoardPairs, setOnBoardPairs] = useState([])

    useEffect(() => {
        let temp = []

        prices?.forEach(price => {
            const change = changes.find(c => c.coin === price.id && c.pair === "irt")
            const starred = filters.starred.includes(`${price.coin}/irt`)
            temp.push({
                ...change, price: price.buy, starred
            })

            pairs?.forEach(pair => {
                if (price.id !== pair.id) {

                    const change = changes.find(c => c.coin === price.id && c.pair === pair.id)
                    const pairPrice = prices.find(p => p.id === pair.id)
                    const starred = filters.starred.includes(`${price.coin}/${pair.id}`)
                    temp.push({
                        ...change, price: price.value / pairPrice?.value, starred
                    })
                }
            })
        })

        if (temp.length) setFullPairs(old => {
            if (old.length === temp.length) {
                return temp.map((t, idx) => ({
                    ...t, color: old[idx].price > t.price ? "green" : "red"
                }))
            }
            return temp
        })

    }, [changes, prices, filters])


    useEffect(() => {
        setOnBoardPairs(_ => {
            if (filters.search || filters.pair) {
                const filtered = fullPairs.filter(pair => {
                    if (filters.search) {
                        return `${pair.coin}/${pair.pair}`.includes(filters.search)
                    }
                    if (filters.pair) {
                        if (filters.pair === "starred") {
                            return pair.starred
                        } else {
                            return pair.pair === filters.pair
                        }
                    }
                })
                return filtered
            }
            return fullPairs
        })
    }, [filters, fullPairs])


    useEffect(() => {
        persistData("starred", filters.starred)

        if (filters.starred.length) {
            setFullPairs(old => (old.map(pair => {
                const pairName = `${pair.coin}/${pair.pair}`
                if (filters.starred.includes(pairName)) {
                    return { ...pair, starred: true }
                }
                return pair
            })))
        }
    }, [filters.starred])


    const onStarredChange = (pair) => {
        setFilters(old => {
            const pairName = `${pair.coin}/${pair.pair}`
            let starred = [...old.starred];
            if (old.starred.includes(pairName)) {
                starred = old.starred.filter(c => c !== pairName)
            } else {
                starred.push(pairName)
            }
            return { ...old, starred }
        })
    };


    const onSortClicked = (type, direction) => {
        const copy = [...onBoardPairs];
        if (direction !== "normal") {
            const sortedPairs = copy.sort((a, b) => {
                if (a[type] < b[type]) {
                    return direction === "up" ? -1 : 1;
                }
                if (a[type] > b[type]) {
                    return direction === "up" ? 1 : -1;
                }
                return 0;
            });
            setOnBoardPairs(sortedPairs);
        }
    };



    return {
        fullPairs,
        onBoardPairs,
        loading,
        onSortClicked,
        onStarredChange
    };
};




const usePairHeader = (onSortClicked) => {

    const { filters, setFilters } = usePairContext()

    const [activeSortTab, setActiveSortTab] = useState(-1)

    const onHeaderClicked = (filter) => {
        setActiveSortTab(-1)
        setFilters(state => ({ ...state, pair: filter }))
    }

    const onCloseSearchClicked = () => {
        setFilters(state => ({ ...state, search: "" }))
    }

    const onInputValueChange = (e) => {
        setFilters(state => ({ ...state, pair: null, search: e?.target?.value }))
    }

    const onSortButtonClicked = (index, type, direction) => {
        setActiveSortTab(index)
        onSortClicked(type, direction)
    }

    return {
        filters, activeSortTab,
        onHeaderClicked, onCloseSearchClicked,
        onInputValueChange, onSortButtonClicked
    }
}


export {
    useMakePairs,
    usePairHeader
}

