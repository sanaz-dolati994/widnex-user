import { useMutation, useQuery } from 'react-query'
import { useMainContext } from '../../contexts/main'
import { normalFetch } from '../fetch-api/get'
import { postApiWithToken } from '../fetch-api/post'
import {useQueryContext} from "../../contexts/query";

const useTicketsQuery = (page) => {
	const {
		profile: { token },
	} = useMainContext()

	return useQuery('fetch-tickets', () => normalFetch(token, `tickets?page=${page}&limit=10`), {
		enabled: !!token,
		select: (res) => res.data,
		refetchOnWindowFocus: false,
	})
}

const useCreateTicketMutation = () => {
	const {
		profile: { token },
	} = useMainContext()
	const { queryClient } = useQueryContext()

	return useMutation('create-tickets', (data) => postApiWithToken(data, token, 'tickets/user'), {
		onSuccess: () => {
			queryClient.invalidateQueries('fetch-tickets')
		},
	})
}

export { useTicketsQuery, useCreateTicketMutation }
