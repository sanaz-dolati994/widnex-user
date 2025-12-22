import { useMutation, useQuery } from 'react-query'
import { useMainContext } from '../../contexts/main'
import { normalFetch } from '../fetch-api/get'
import { deleteApi } from '../fetch-api/delete'
import { useQueryContext } from '../../contexts/query'
import { postApiWithToken } from '../fetch-api/post'

const useInviteCodesQuery = (page = 1) => {
	const {
		profile: { token },
	} = useMainContext()

	return useQuery(
		'fetch-invite-codes',
		() => normalFetch(token, `affiliates?page=${page}&limit=10`),
		{
			enabled: !!token,
			select: (res) => res.data,
			refetchOnWindowFocus: false,
		}
	)
}

const useInviteTreeQuery = (page = 1) => {
	const {
		profile: { token },
	} = useMainContext()

	return useQuery('fetch-invite-tree', () => normalFetch(token, `affiliates/users`), {
		enabled: !!token,
		select: (res) => res.data,
		refetchOnWindowFocus: false,
	})
}

const useDeleteInviteCodeMutation = () => {
	const {
		profile: { token },
	} = useMainContext()
	const { queryClient, setToast } = useQueryContext()

	return useMutation(
		'delete-invite-code',
		(id) => deleteApi(token, `affiliates/${id}`),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('fetch-invite-codes')
				setToast({
					show: true,
					message: 'op-success'
				})
			},
		}
	)
}

const useCreateInviteCodeMutation = () => {
	const {
		profile: { token },
	} = useMainContext()
	const { queryClient, setToast } = useQueryContext()

	return useMutation(
		'create-invite-code',
		(data) => {
			return postApiWithToken(data, token, `affiliates`)
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries('fetch-invite-codes')
				setToast({
					show: true,
					message: 'op-success'
				})
			},
		}
	)
}

export {
	useInviteCodesQuery,
	useDeleteInviteCodeMutation,
	useCreateInviteCodeMutation,
	useInviteTreeQuery,
}
