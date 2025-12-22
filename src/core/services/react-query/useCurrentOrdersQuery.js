import { useMutation, useQuery } from 'react-query'
import { useMainContext } from '../../contexts/main'
import { deleteApi } from '../fetch-api/delete'
import { filterFetch } from '../fetch-api/get'
import {useQueryContext} from "../../contexts/query";

const useMyOrdersQuery = (data) => {
	const {
		profile: { token },
	} = useMainContext()
	return useQuery('fetch-my-orders', () => filterFetch(data, token, 'orders/my'), {
		enabled: !!token,
		select: (res) => res.data,
		refetchOnWindowFocus: false,
	})
}

const useDeleteMyOrderMutation = () => {
	const {
		profile: { token },
	} = useMainContext()
	const { queryClient, setToast } = useQueryContext()

	return useMutation((id) => deleteApi(token, `orders/${id}`), {
		onSuccess: () => {
			queryClient.invalidateQueries('fetch-my-orders')
			setToast({
				isError:false, show: true,
				message: "order-delete-success"
			})
		},
	})
}

export { useMyOrdersQuery, useDeleteMyOrderMutation }
