import { useEffect, useRef } from 'react'
import { useAuth } from '../../pages/UserAuthentication'
import { onInputValueChange, onSubmitClicked } from '../utils/authHelper'
import {
	useMeliCardMutation,
	useProfileQuery,
	useProfileUpdateMutation,
	useSelfieMutation,
} from '../services/react-query/useProfileQuery'
import { p2e } from "../utils/common";
import { useQueryContext } from "../contexts/query";

const useAuthentication = (active, setActiveWizard) => {
	const { authData, setAuthData } = useAuth()
	const firstAttemp = useRef(false)

	const { data: profile, isFetching: fetchingProfile } = useProfileQuery()
	const { mutate: updateProfile, isLoading: updatingProfile } = useProfileUpdateMutation()
	const { mutate: updateMeliCard, isLoading: updatingMeli } = useMeliCardMutation()
	const { mutate: updateSelfi, isLoading: updatingSelfi } = useSelfieMutation()

	useEffect(() => {
		if (!profile?.email || !profile?.mobile) setActiveWizard(0)
		else if (
			!profile?.firstName ||
			!profile?.lastName ||
			// !profile?.address.zip ||
			!profile?.idNo
		)
			setActiveWizard(1)
		else if (!profile?.idCard) setActiveWizard(2)
		else if (!profile?.selfi) setActiveWizard(3)
		else setActiveWizard(4)

		if (profile?.email && !profile?.mobile) setAuthData({ type: '1-mode', payload: 'mobile' })
		if (!profile?.email && profile?.mobile) setAuthData({ type: '1-mode', payload: 'email' })

		if (profile && active === 1 && !firstAttemp) {
			firstAttemp.current = true
			const newState = {
				firstName: profile.firstName,
				lastName: profile.lastName,
				idNo: profile.idNo,
				gender: profile.gender,
				birthDate: profile.birthDate,
				phone: profile.phone,
				address: profile.address,
			}
			setAuthData({ type: '2-data', payload: newState })
			const newValidations = {
				firstName: profile?.firstName ? 'valid' : 'normal',
				lastName: profile?.lastName ? 'valid' : 'normal',
				idNo: profile?.idNo ? 'valid' : 'normal',
				zip: profile?.address?.zip ? 'valid' : 'normal',
			}
			setAuthData({ type: '2-validation', payload: newValidations })
		}
		// eslint-disable-next-line
	}, [profile])

	const onInputChange = (e, type = null) => {
		const data = { value: p2e(e?.target?.value), type, authData, setAuthData, active }
		onInputValueChange(data)
	}

	const { setToast } = useQueryContext()
	const onNextClicked = () => {

		onSubmitClicked({
				updateProfile,
				authData,
				active,
				updateMeliCard,
				updateSelfi,
			},
			setToast
		)
	}

	return {
		onInputChange,
		onNextClicked,
		loading: updatingProfile || updatingSelfi || updatingMeli || fetchingProfile,
	}
}

export default useAuthentication
