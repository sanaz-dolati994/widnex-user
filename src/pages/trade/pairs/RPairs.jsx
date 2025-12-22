import { createContext, Fragment, useContext, useEffect, useMemo, useState } from "react";
import Card from "../../../components/common/Card"
import Loading from "../common/Loading"
import { useMakePairs } from "../utils/usePairsHook";
import { FaSearch } from "react-icons/fa";
import { SOCKET_URL } from "../../../core/constants/urls";
import { usePersianNames } from "../utils";
import { deepCopy, formatNumber } from "../../../core/utils/common";
import { useMainContext } from "../../../core/contexts/main";
import { useSearchParams } from "react-router-dom";
import { BiChevronDown } from "react-icons/bi";
import RespModal from "../common/RespModal";
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

const RPairs = () => {

    const [searchParams, setSearchParams] = useSearchParams()
    const { market, setMarket } = useMainContext()
    const { findPersianName } = usePersianNames()

    const [pairModal, setPairModal] = useState(false)

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
        setPairModal(false)
        setMarket({ coin: coin.coin, pair: coin.pair })
        setSearchParams({ coin: coin.coin, pair: coin.pair })
    }

    useEffect(() => {
        const preCoin = searchParams.get('coin')
        const prePair = searchParams.get('pair')
        if (!!preCoin || !!prePair) setMarket({ coin: preCoin, pair: prePair })
    }, [searchParams])


    return (
        <>
            <PairContext.Provider value={{ filters, setFilters }}>
                <Card
                    className={'w-full h-full relative flex items-center justify-between gap-4 rounded-md'}
                    padding={'px-4 py-2'}
                    onClick={() => setPairModal(true)}
                >
                    <div className={'flex items-center gap-1 col-span-2'}>
                        <img
                            width={32}
                            height={32}
                            src={SOCKET_URL + `assets/icon/${market?.coin?.toLowerCase()}.png`}
                            alt={`${market.coin?.toLowerCase()}.png`}
                        />
                        <div className={'flex flex-col'}>
                            <span className={'text-gray-500 text-xs'}>{
                                filters.pair ?
                                    market.coin?.toUpperCase()
                                    :
                                    `${market.coin?.toUpperCase()} / ${market.pair?.toUpperCase()}`
                            }</span>
                            <span className={'text-xs'}>{findPersianName(market.coin)}</span>
                        </div>
                    </div>
                    <BiChevronDown size={24} />
                </Card>
            </PairContext.Provider>
            <RespModal
                show={pairModal}
                onClose={() => setPairModal(false)}
            >
                <div className={'p-5 flex flex-col gap-3 h-full'}>
                    <PairContent
                        onboard={onboard}
                        filters={filters}
                        setFilters={setFilters}
                        findPersianName={findPersianName}
                        secondParts={secondParts}
                        handleSearch={handleSearch}
                        onMarketChange={onMarketChange}
                    />
                </div>
            </RespModal>
        </>

    )
}

export default RPairs