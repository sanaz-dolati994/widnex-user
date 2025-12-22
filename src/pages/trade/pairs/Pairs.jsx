import { createContext, Fragment, useContext, useMemo, useState } from "react";
import Card from "../../../components/common/Card"
import Loading from "../common/Loading"
import { useMakePairs } from "../utils/usePairsHook";
import { FaSearch } from "react-icons/fa";
import { SOCKET_URL } from "../../../core/constants/urls";
import { usePersianNames } from "../utils";
import { deepCopy, formatNumber } from "../../../core/utils/common";
import { useMainContext } from "../../../core/contexts/main";
import { useSearchParams } from "react-router-dom";
import PairContent from "./PairContent";

const excludedPairs = [
    { coin: 'usdt', pair: 'irt' },
];


const PairContext = createContext({
    filters: {}, setFilters: () => { }
})

export const usePairContext = () => {
    return useContext(PairContext)
}

const Pairs = () => {

    const [searchParams, setSearchParams] = useSearchParams()
    const { setMarket } = useMainContext()
    const { findPersianName } = usePersianNames()

    const secondParts = [
        { id: null, name: 'همه' },
        { id: 'irt', name: 'تومان' },
        { id: 'usdt', name: 'USDT' },
    ]

    const [filters, setFilters] = useState({
        search: "", pair: null, starred: []
    })

    const {
        onBoardPairs,
        loading,
    } = useMakePairs({ filters, setFilters });

    const handleSearch = (e) => {
        setFilters(state => ({ ...state, search: e?.target?.value }))
    }


    const onboard = useMemo(() => {
        if (!filters.pair) {
            const newFilteredPairs = deepCopy(onBoardPairs);

            return newFilteredPairs.filter(
                x => (x.pair === 'irt' || x.pair === 'usdt') &&
                    excludedPairs.some(e => e.coin === x.coin && e.pair === x.pair)
            );
        } else {
            return onBoardPairs.filter(
                x => (x.pair === 'irt' || x.pair === 'usdt') &&
                    excludedPairs.some(e => e.coin === x.coin && e.pair === x.pair)
            );
        }
    }, [onBoardPairs, filters]);


    const onMarketChange = (coin) => {
        setMarket({ coin: coin.coin, pair: coin.pair })
        setSearchParams({ coin: coin.coin, pair: coin.pair })
    }

    return (
        <PairContext.Provider value={{ filters, setFilters }}>
            <Card className={'w-full h-full relative flex flex-col gap-4'} padding={'px-2 pt-7 pb-5'}>
                <Loading loading={loading} />
                <PairContent
                    onboard={onboard}
                    filters={filters}
                    setFilters={setFilters}
                    findPersianName={findPersianName}
                    secondParts={secondParts}
                    handleSearch={handleSearch}
                    onMarketChange={onMarketChange}
                />
            </Card>
        </PairContext.Provider>
    )
}

export default Pairs