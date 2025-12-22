import { createContext, useContext, useEffect, useState } from "react";
import { MutationCache, QueryCache, QueryClient } from "react-query";


const context = createContext()

export const useQueryContext = () => {
    return useContext(context)
}

const QueryContextProvider = ({ children }) => {


    const [queryClient, setQueryClient] = useState(new QueryClient())
    const [toast, setToast] = useState({
        show: false, message: "", isError: null
    })

    const [queryCache, setQueryCache] = useState(null)

    useEffect(() => {
        const _queryCache = new QueryCache({
            onError: (res) => {
                setToast({
                    message: res.response.data.message,
                    show: true,
                    isError: true
                })
            }
        })
        setQueryCache(_queryCache)
    }, [])

    useEffect(() => {
        if (queryCache) {
            const client = new QueryClient({
                defaultOptions: {
                    queries: {
                        refetchOnWindowFocus: false,
                        select: res => res.data,
                        retry: 0
                    }
                },
                queryCache: queryCache,
                mutationCache: new MutationCache({
                    onError: (res) => {
                        setToast({
                            message: res.response.data.message,
                            show: true,
                            isError: true
                        })
                    }
                })
            })
            setQueryClient(client)
        }
    }, [queryCache])

    return (
        <context.Provider
            value={{
                queryClient,
                toast,
                setToast
            }}
        >
            {children}
        </context.Provider>
    )
}

export default QueryContextProvider
