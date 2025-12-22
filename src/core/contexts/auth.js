import { createContext, useContext, useEffect } from 'react'
import { useMainContext } from './main'
import { useLogout } from '../services/react-query/useAuthQuery'
import { useProfileQuery, useProfileSettings } from '../services/react-query/useProfileQuery'

const AuthContext = createContext()

export const useAuthContext = () => {
	return useContext(AuthContext)
}

export const AuthContextProvider = ({ children }) => {
	const {
		profile: { setToken },
	} = useMainContext()
	const { data: profileSettings } = useProfileSettings()
	const { data: profile } = useProfileQuery()

	const onLogout = () => {
		setToken('')
	}
	const { mutate: logout, isLoading: loading } = useLogout(onLogout)

	useEffect(() => {
		if (typeof window !== undefined && profile?._id) {

			window.Goftino?.setUserId?.(profile?._id)

			window.Goftino?.setUser?.({
				email: profile?.email,
				name: profile?.firstName + profile?.lastName,
				about: profile?.idNo,
				phone: profile?.mobile,
				avatar: profile?.avatar,
				tags: `${profile?.selfi},${profile?.idCard}`,
				forceUpdate: true,
			})

			window.addEventListener('goftino_ready', function () {
				window.Goftino.setUserId(profile?._id)

				window.Goftino.setUser({
					email: profile?.email,
					name: profile?.firstName + profile?.lastName,
					about: profile?.idNo,
					phone: profile?.mobile,
					avatar: profile?.avatar,
					tags: `${profile?.selfi},${profile?.idCard}`,
					forceUpdate: true,
				})
				// function...
				// Goftino.getUser(...);
				// Goftino.setWidget(...);
				// Goftino.sendMessage(...);
			})

			return () => {
				window.Goftino?.setUserId?.(undefined)

				window.Goftino?.setUser?.({
					email: undefined,
					name: undefined,
					about: undefined,
					phone: undefined,
					avatar: undefined,
					tags: undefined,
					forceUpdate: true,
				})
			}
		}
	}, [profile])

	return (
		<AuthContext.Provider value={{ logout, loading, profileSettings, profile }}>
			{children}
		</AuthContext.Provider>
	)
}
