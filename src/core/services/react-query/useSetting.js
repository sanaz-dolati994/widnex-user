import {useMutation, useQuery} from "react-query";
import {normalFetch} from "../fetch-api/get";
import {useMainContext} from "../../contexts/main";
import {putApi} from "../fetch-api/put";
import {useQueryContext} from "../../contexts/query";


export const useGetFiatSetting = () => {

    const { profile: { token } } = useMainContext()

    return useQuery(
        'fiat-setting', () => normalFetch(token, 'settings/banks'),
        {
            select: res => res?.data?.data,
            cacheTime: 5 * 60 * 1000,
            staleTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false
        }
    )
}


export const useGetFiatDepositAccount = () => {

    const { profile: { token } } = useMainContext()

    return useQuery(
        'fiat-deposit-account', () => normalFetch(token, 'banking/depositWithAccount/accounts/self'),
        {
            select: res => res?.data?.data,
            refetchOnWindowFocus: false
        }
    )
}


export const useUpdateFiatDepositAccounts = () => {

    const { profile: { token } } = useMainContext()
    const { queryClient } = useQueryContext()

    return useMutation(
        'fiat-deposit-account-update', (data) => putApi(data, token, 'banking/depositWithAccount/accounts/self'),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['fiat-deposit-account'])
            }
        }
    )
}
