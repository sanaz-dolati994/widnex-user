import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query';
import { useMainContext } from '../../contexts/main';
import { filterFetchV2, normalFetchV2 } from '../fetch-api/get';
import { postApiWithTokenV2 } from '../fetch-api/post';

export const useTransferConfig = () => {
    const {
        profile: { token },
    } = useMainContext();

    return useQuery('/private/transfer-config', () => normalFetchV2(token, 'private/transfer-config'), {
        enabled: !!token,
        select: (res) => res.data?.data,
        refetchOnWindowFocus: false,
        refetchInterval: 15000,
    });
};

export const useCreateDeposit = ({ onSuccess }) => {
    const {
        profile: { token },
    } = useMainContext();
    const qc = useQueryClient();

    return useMutation('private/create-deposit-by-receipt', (data) => postApiWithTokenV2(data, token, 'private/create-deposit-by-receipt'), {
        onSuccess: (d, v, c) => {
            qc.invalidateQueries({ queryKey: ['user-deposits-by-receipt'] });
            onSuccess?.(d, v, c);
        },
    });
}

export const useUserDepositsByReceipt = () => {
    const {
        profile: { token },
    } = useMainContext();

    return useInfiniteQuery({
        queryKey: ['user-deposits-by-receipt'],
        enabled: !!token,
        queryFn: ({ pageParam = 1 }) =>
            filterFetchV2({ page: pageParam, limit: 10 }, token, 'private/user-deposit-by-receipt'),
        getNextPageParam: (lastPage) => {
            const currentPage = lastPage?.data?.pagination?.currentPage ?? 1;
            const pages = lastPage?.data?.pagination?.pages ?? 1;
            return currentPage < pages ? currentPage + 1 : undefined; // ✅
        },
        select: (res) => res.pages.flatMap(p => p.data?.data ?? []),
        refetchOnWindowFocus: false,
    });
};

export const useBankAccount = () => {
    const {
        profile: { token },
    } = useMainContext();

    return useQuery('/private/bank-accounts', () => normalFetchV2(token, 'private/bank-accounts'), {
        enabled: !!token,
        select: (res) => res.data?.data,
        refetchOnWindowFocus: false,
        refetchInterval: 15000,
    });
};
