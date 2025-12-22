import { useEffect, useState } from 'react'
import {
	useCreateInviteCodeMutation,
	useDeleteInviteCodeMutation,
	useInviteCodesQuery,
	useInviteTreeQuery,
} from '../services/react-query/useInvitesQuery'


const useMyInvites = () => {
	const [activePage, setActivePage] = useState(1)
	const [allPages, setAllPages] = useState(null)

	const [deleteModal, setDeleteModal] = useState({ id: null, open: false })

	const {
		data: inviteCodes,
		isFetching: inviteCodesLoading,
		refetch,
	} = useInviteCodesQuery(activePage)

	const {
		data: inviteTree,
		isFetching: inviteTreeLoading,
		refetch: refetchInviteTree,
	} = useInviteTreeQuery(activePage)

	const { mutate: createInviteCode, isLoading: isCreating } = useCreateInviteCodeMutation()
	const { mutate: deleteInviteCode, isLoading: isDeleting } = useDeleteInviteCodeMutation()

	const onModalClicked = (value) => {
		if (value === 1) deleteInviteCode(deleteModal.id)

		setDeleteModal({ id: null, open: false })
	}

	const onPageChange = (page) => {
		setActivePage(page)
	}

	useEffect(() => {
		if (inviteCodes && (allPages !== inviteCodes.meta.total || !allPages)) {
			setAllPages(inviteCodes.meta.total)
		}
	}, [inviteCodes])

	useEffect(refetch, [activePage])

	return {
		allPages,
		activePage,
		onPageChange,
		inviteCodes,
		inviteCodesLoading,
		createInviteCode,
		isCreating,
		setDeleteModal,
		onModalClicked,
		deleteModal,
		isDeleting,
		inviteTree,
		inviteTreeLoading,
		refetchInviteTree,
	}
}

export default useMyInvites
