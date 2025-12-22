import {filters, getFilterDate, TYPES} from "../utils/filter";
import {useMarketQuery} from "../services/react-query/useMarketQuery";
import {useGetBankTransaction} from "../services/react-query/useTransactionsQuery";


// api => type = { "flow", "trade", "default" } , callback, search, query
// search list convention ==> { type, search (pair, coin, etc ..), trade}
const useSearchApi = (activeTab, state) => {

    const { filterQueries, setFilterQueries, searchValue } = state
    const {data: coinOptions} = useMarketQuery()
    const { refetch } = useGetBankTransaction(searchValue)


    const onOptionChanged = (idx, type) => {
        let objectType = ''
        if (type !== TYPES.COIN && type !== TYPES.CURRENCY) {
            objectType = filters[type][idx]
        }else if (coinOptions?.length) {
            objectType = coinOptions[idx]?.id
        }

        if (type === TYPES.DATE) {
            objectType = getFilterDate(idx)
            setFilterQueries(state => ({...state, page: 1, dateFrom: objectType}))
            return
        }

        if (type === TYPES.STATUS) {
            objectType = objectType.replace('T', '')
        }

        if (idx === 0 && type !== TYPES.COIN && type !== TYPES.CURRENCY) {
            objectType = ''
        }
        setFilterQueries(state => ({...state, page: 1, query: {...state.query, [type]: objectType}}))
    }


    const onPageChange = (pageNumber) => {
        setFilterQueries(state => ({...state, page: pageNumber}))
    }


    const onCloseSearchClicked = () => {
        setFilterQueries(filterQueries)
    }


    const requestOrdersByMarket = () => {
        if (searchValue) {
            refetch()
        }
    }

    return [
        onCloseSearchClicked,
        onPageChange,
        requestOrdersByMarket,
        onOptionChanged
    ]
}


export default useSearchApi;