import {useQuery} from "react-query";
import {useMainContext} from "../../contexts/main";
import {filterFetch} from "../fetch-api/get";


export const useGetUserTrace = (data) => {

    const {
        profile: { token },
    } = useMainContext()

    return useQuery(
        'user-trace', () => filterFetch(data, token, 'traces/my'), {
            enabled: !!token,
            select: (res) => res.data,
            refetchOnWindowFocus: false,
        }
    )
}
