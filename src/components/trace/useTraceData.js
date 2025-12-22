import {useEffect, useState} from "react";
import {useGetUserTrace} from "../../core/services/react-query/useUserTrace";
import styled from "styled-components";
import {cloneDeep} from "tailwindcss/lib/util/cloneDeep";


export const useTraceData = () => {

    const initialState = {
        page: 1,
        dateFrom: null,
        search: {
            _id: '_id'
        },
        query: {
            _id: ''
        },
    }

    const [filterQueries, setFilterQueries] = useState(initialState)
    const { data: traces, isFetching, refetch } = useGetUserTrace(filterQueries)

    const [searchId, setSearchId] = useState('')
    const onSearchById = () => {
        setFilterQueries(state => {
            const newState = cloneDeep(state)
            newState.query._id = searchId
            return newState
        })
    }

    useEffect(() => {
        if (!searchId) {
            setFilterQueries(state => {
                const newState = cloneDeep(state)
                newState.query._id = ''
                return newState
            })
        }
    }, [searchId])

    useEffect(() => {
        refetch()
    }, [filterQueries, refetch])

    const onPageChange = (page) => {
        setFilterQueries(state => ({...state, page}))
    }


    return {
        filterQueries,
        onPageChange,
        traces,
        isFetching,
        searchId,
        setSearchId,
        onSearchById
    }
}

export const Grid = styled.div`
  display: grid;
  grid-template-columns: ${props => props.cs};
`

export const traceHeaders = [
    'currency', 'volume', 'balanceChange', 'balanceBlockChange', 'type', 'cause', 'date'
]

export const traceCs = '15% 10% 20% 20% 10% 10% 15%'
