import { useMutation, useQuery } from 'react-query'
import { useMainContext } from '../../contexts/main'
import { normalFetch } from '../fetch-api/get'
import { putApi } from '../fetch-api/put'
import {useQueryContext} from "../../contexts/query";

const useNotificationsQuery = (page) => {
	const {
		profile: { token },
	} = useMainContext()

	return useQuery(
		'fetch-notifications',
		() => normalFetch(token, `notifications?page=${page}&limit=10`),
		{
			enabled: !!token,
			refetchOnWindowFocus: false,
			select: (res) => res.data,
		}
	)
}

const useUnreadNotificationQuery = (page) => {
	const {
		profile: { token },
	} = useMainContext()

	return useQuery(
		'fetch-unread-notifications',
		() => normalFetch(token, `notifications/unread?page=${page}&limit=5`),
		{
			enabled: !!token,
			refetchOnWindowFocus: false,
			select: (res) => res.data,
		}
	)
}


const useReadAllNotificationsMutation = () => {
	const {profile: {token}} = useMainContext()
	const {queryClient, setToast} = useQueryContext()

	return useMutation(() => putApi({}, token, "notifications/read/all"), {
		onSuccess: () => {
			queryClient.invalidateQueries('fetch-notifications')
			queryClient.invalidateQueries('fetch-unread-notifications')
			setToast({
				isError: false, show: true,
				message: "op-success"
			})
		}
	})
}

const useReadNotificationMutation = () => {
	const {
		profile: { token },
	} = useMainContext()
	const { queryClient } = useQueryContext()

	return useMutation((id) => putApi({}, token, `notifications/read/${id}`), {
		onSuccess: () => {
			queryClient.invalidateQueries('fetch-unread-notifications')
		},
	})
}

export {
	useNotificationsQuery,
	useUnreadNotificationQuery,
	useReadNotificationMutation,
	useReadAllNotificationsMutation
}
