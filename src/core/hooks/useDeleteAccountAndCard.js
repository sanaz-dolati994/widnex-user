import { useAuthContext } from '../contexts/auth'
import { useState } from 'react'
import {
	useProfileQuery,
	useSoftDeleteBank,
	useSoftDeleteWallet,
} from '../services/react-query/useProfileQuery'

let loading = -1
export const useDeleteAccountAndCard = (activeTab) => {
	const { profileSettings } = useAuthContext()
	const initialAuthModal = { con: false, type: '', item: null, idx: -1 }
	const [authModal, setAuthModal] = useState(initialAuthModal)
	const closeAuthModal = () => setAuthModal(initialAuthModal)
	const { data: profile, refetch: refetchProfile } = useProfileQuery()

	const { mutateAsync: deleteBank } = useSoftDeleteBank()
	const onDeleteBank = async (bank, idx, payload) => {
		loading = idx
		try {
			await deleteBank({ id: bank.id, payload })
		} catch (_) {}
		loading = -1
		refetchProfile()
	}

	const { mutateAsync: deleteWallet } = useSoftDeleteWallet()
	const onDeleteWallet = async (wallet, idx, payload) => {
		loading = idx
		try {
			await deleteWallet({ id: wallet.id, payload })
		} catch (_) {}
		loading = -1
		refetchProfile()
	}

	const onCheckAuth = (item, idx, type) => {
		if (
			(profileSettings?.settings?.twoFactor?.onWhiteListWallet && activeTab === 2) ||
			(profileSettings?.settings?.twoFactor?.onWhiteListAccount && activeTab === 1)
		) {
			setAuthModal({ con: true, item, idx, type })
		} else {
			if (type === 'wallet') onDeleteWallet(item, idx, {})
			if (type === 'bank') onDeleteBank(item, idx, {})
		}
	}

	const accountCauses = ['WHITE_LIST_ACCOUNT', 'WHITE_LIST_WALLET']
	const onSubmitTwoFactorModal = (authData) => {
		const fun = authModal.type === 'bank' ? onDeleteBank : onDeleteWallet
		fun(authModal.item, authModal.idx, authData || {})
	}

	return {
		loading,
		onCheckAuth,
		authModal,
		onSubmitTwoFactorModal,
		closeAuthModal,
		accountCauses,
	}
}
