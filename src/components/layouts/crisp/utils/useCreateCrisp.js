import { useEffect } from 'react'
import { useMainContext } from '../../../../core/contexts/main'
import { useProfileQuery } from '../../../../core/services/react-query/useProfileQuery'

const useCreateCrisp = () => {
	const {
		main: { lang },
		profile: { token },
	} = useMainContext()

	const { data: profile } = useProfileQuery()

	useEffect(() => {
		const d = document
		const s = document.createElement('script')
		window.$crisp = []
		window.CRISP_WEBSITE_ID = '15cf72e8-c180-44a3-948a-e1782fe368e5'
		window.CRISP_RUNTIME_CONFIG = {
			locale: lang,
		}
		;(function () {
			s.src = 'https://client.crisp.chat/l.js'
			s.async = 1
			createCrisp()
			d.getElementsByTagName('head')[0].appendChild(s)
		})()
	}, [])

	useEffect(() => {
		if (token && !!profile) {
			profile?.email &&
				window.$crisp.push(['set', 'user:email', profile?.email ? profile?.email : ''])
			window.$crisp.push(['set', 'user:nickname', [profile?._id]])
			profile?.avatar && window.$crisp.push(['set', 'user:avatar', [profile?.avatar]])
			profile?.mobile && window.$crisp.push(['set', 'user:phone', [profile?.mobile]])
		}
	}, [token, profile])
}

export const createCrisp = () => {
	window.$crisp.push(['do', 'chat:hide'])
	window.$crisp.push(['config', 'position:reverse', [true]])
	window.$crisp.push(['config', 'color:theme', ['amber']])
	window.$crisp.push(['on', 'chat:closed', () => window.$crisp.push(['do', 'chat:hide'])])
}

export const resetCrisp = () => {
	//TODO: delete if not needed - useCase in useAuthQuery - logout
}

export default useCreateCrisp
