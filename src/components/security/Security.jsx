import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
// import SecurityOverview from './SecurityOverview'
import NewSecurityOverview from './NewSecurityOverview'
import GoogleAuth from './GoogleAuth'
import { useNavigate } from 'react-router-dom'

const Security = () => {
	const [loading, setLoading] = useState(false)
	const [googleAuth, setGoogleAuth] = useState(false)

	const navigate = useNavigate()
	const onGoogleAuthClicked = (type) => {
		switch (type) {
			case 'activate':
				setGoogleAuth(true)
				break
			case 'delete':
				// delete google auth
				break
			case 'auth':
				navigate('/authentication')
				break
			case 'bank':
				navigate('/accounts-cards')
				break
			case 'wallet':
				navigate('/accounts-cards', { state: { wallet: true } })
				break
			default:
				break
		}
	}

	return (
		<AnimatePresence exitBeforeEnter>
			{!googleAuth && <NewSecurityOverview onGoogleAuthClicked={onGoogleAuthClicked} />}
			{googleAuth && (
				<GoogleAuth loadingState={{ loading, setLoading }} setGoogleAuth={setGoogleAuth} />
			)}
		</AnimatePresence>
	)
}

export default Security
