import { useEffect, useState } from "react";
// import {
//     useDeleteMyOrderMutation,
// } from "../services/react-query/useOrdersQuery";
import { useMutation, useQuery } from "react-query";
import { normalFetch } from "../../../core/services/fetch-api/get";
import { useMainContext } from "../../../core/contexts/main";
import { deleteApi } from "../../../core/services/fetch-api/delete";
import { useQueryContext } from "../../../core/contexts/query";


export const useMyOrdersQuery = () => {

    const { profile: { token } } = useMainContext()
    return useQuery(
        'fetch-my-orders', () => normalFetch(token, "orders/my"),
        {
            enabled: !!token,
            select: (res) => (res.data),
            refetchOnWindowFocus: false
        }
    )
}

export const useOrdersHistoryQuery = () => {
    const { profile: { token } } = useMainContext()
    return useQuery(
        'fetch-orders-history', () => normalFetch(token, "trades"),
        {
            enabled: !!token,
            select: (res) => (res.data),
            refetchOnWindowFocus: false
        }
    )
}

export const useDeleteMyOrderMutation = () => {
    const {
        profile: { token },
    } = useMainContext()
    const { queryClient, setToast } = useQueryContext()

    return useMutation((id) => deleteApi(token, `orders/${id}`), {
        onSuccess: () => {
            queryClient.invalidateQueries('fetch-my-orders')
            setToast({
                isError: false, show: true,
                message: "order-delete-success"
            })
        },
    })
}


export const useCurrentOrders = () => {
    const { data: orders, isLoading } = useMyOrdersQuery()
    const { mutate: deleteOrder, isLoading: isDeleting, isSuccess } = useDeleteMyOrderMutation()

    const [deleteModal, setDeleteModal] = useState({ id: null, open: false })
    const onCloseDeleteModal = () => {
        deleteModal.open && setDeleteModal({ id: null, open: false })
    }
    const onModalClicked = (submit) => {
        if (submit) {
            deleteOrder(deleteModal.id)
        }
        setDeleteModal({ id: null, open: false })
    }

    return {
        deleteModal,
        setDeleteModal,
        onCloseDeleteModal,
        onModalClicked,
        orders,
        isDeleting,
        loading: isLoading
    }
}
