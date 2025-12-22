import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { useProfileQuery } from '../services/react-query/useProfileQuery'
import { normalFetch } from '../services/fetch-api/get'
import { useMainContext } from '../contexts/main'
import { useCreateTicketMutation, useTicketsQuery } from '../services/react-query/useTicketsQuery'

const useMyTickets = () => {
	const {
		profile: { token },
	} = useMainContext()
	const [admins, setAdmins] = useState([])

	const [activePage, setActivePage] = useState(1)
	const [allPages, setAllPages] = useState(null)
	const [newMessage, setNewMessage] = useState('')

	const { data: allTickets, isFetching: ticketsLoading, refetch } = useTicketsQuery(activePage)
	const { mutate: mutateTicket, isLoading: ticketCreating } = useCreateTicketMutation()
	const { data: profile } = useProfileQuery()

	useEffect(() => {
		if (allTickets && (allPages !== allTickets.meta.total || !allPages)) {
			setAllPages(allTickets.meta.total)
		}
	}, [allTickets])

	useEffect(() => {
		refetch()
	}, [activePage])

	const onTextFieldChange = useCallback((e) => {
		setNewMessage(e?.target?.value)
	}, [])

	const getAdminName = (id) => {
		const admin = admins.find((a) => a.id == id)
		if (admin) {
			return admin.name
		} else {
			normalFetch(token, `users/${id}`)
				.then((res) => {
					if (res.status == 200) {
						const name = `${res.data.data.firstName} ${res.data.data.lastName}`
						setAdmins((state) => [...state, { id: res.data.data._id, name }])
						return name
					}
					return ' '
				})
				.catch((err) => {
					return ' '
				})
		}
	}

	const onPageChange = (page) => {
		setActivePage(page)
	}

	const createTicket = () => {
		if (newMessage.length) {
			mutateTicket({ message: newMessage })
			setActivePage(1)
			setNewMessage('')
		}
	}

	return [
		newMessage,
		allTickets,
		allPages,
		activePage,
		profile,
		onTextFieldChange,
		onPageChange,
		createTicket,
		getAdminName,
		ticketsLoading,
		ticketCreating,
	]
}

export default useMyTickets
