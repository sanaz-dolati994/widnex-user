import { useEffect, useState } from 'react'
import {
	useDeleteMyOrderMutation,
	useMyOrdersQuery,
} from '../services/react-query/useCurrentOrdersQuery'


const useCurrentOrders = () => {

	const initialState = {
		page: 1,
		dateFrom: null,
		search: {
			type: "type",
			submit: "submit",
			coin: 'coin'
		},
		query: {
			type: "",
			submit: "",
			coin: ''
		},
	}
	const [filterQueries, setFilterQueries] = useState(initialState)

	const { data: currentOrders, isFetching, refetch } = useMyOrdersQuery(filterQueries)
	const { mutate: deleteOrder, isLoading } = useDeleteMyOrderMutation()

	const [deleteModal, setDeleteModal] = useState({ id: null, open: false })
	const [allPages, setAllPages] = useState(null)

	useEffect(() => {
		refetch()
	}, [filterQueries, refetch])

	useEffect(() => {
		if ((currentOrders && !allPages) || (currentOrders && currentOrders.meta.total !== allPages)) {
			setAllPages(currentOrders.meta.total)
		}
		// eslint-disable-next-line
	}, [currentOrders])

	const onModalClicked = (submit) => {
		if (submit) {
			deleteOrder(deleteModal.id)
		}
		setDeleteModal({ id: null, open: false })
	}

	return {
		currentOrders,
		setDeleteModal,
		allPages,
		filterQueries,
		setFilterQueries,
		initialState,
		loading: isFetching || isLoading,
		onModalClicked,
		deleteModal,
	}
}

export default useCurrentOrders
