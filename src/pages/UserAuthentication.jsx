import { createContext, useContext, useReducer, useState } from 'react'
import Wizard from '../components/authentication/Wizard'
// import MainLayout from '../components/layouts/MainLayout'
import NewLayout from '../components/layouts/NewLayout'
import Authentication from '../components/authentication/Authentication'
import { authReducer, initialState } from '../core/utils/authHelper'
import { useWindowSize } from '../core/hooks/useWindowSize'
import { TABLET_SIZE } from '../core/constants/common'
import RWizard from '../components/responsive/authentication/RNewWizard'
import Card from '../components/common/Card'
import Text from '../core/utils/Text'
import {
	PersonalCardIcon,
	SelfieIcon,
	SmsIcon,
	UserIcon,
	VerifyIcon2,
} from '../components/common/icons'
import { useMainContext } from '../core/contexts/main'

const AuthContext = createContext()

export const useAuth = () => {
	return useContext(AuthContext)
}

const UserAuthentication = () => {
	const {
		main: { theme },
	} = useMainContext()

	const [activeWizard, setActiveWizard] = useState(0)
	const [authData, setAuthData] = useReducer(authReducer, initialState)
	const [loading, setLoading] = useState(false)

	const { width } = useWindowSize()

	return (
		<AuthContext.Provider value={{ authData, setAuthData, loading, setLoading }}>
			<NewLayout>
				<Card className='lg:h-full lg:overflow-y-auto'>
					{width > TABLET_SIZE ? (
						<>
							<div className='my-4'>
								<img
									src={require(`../assets/newImages/logo-${theme}.png`)}
									alt='ویدنکس'
									className='w-40 h-auto mx-auto mb-4'
								/>
								<h2 className='text-lg text-center font-semibold'>
									<Text tid='welcome-to-auth' />
								</h2>
							</div>
							<Wizard active={activeWizard} items={wizardData} />
							<Authentication active={activeWizard} setActiveWizard={setActiveWizard} />
						</>
					) : (
						<>
							<div className='my-4'>
								<img
									src={require(`../assets/newImages/logo-${theme}.png`)}
									alt='ویدنکس'
									className='w-20 h-auto mb-4'
								/>
								<h2 className=''>
									<Text tid='welcome-to-auth' />
								</h2>
							</div>
							<RWizard active={activeWizard} items={wizardData} />
							<Authentication active={activeWizard} setActiveWizard={setActiveWizard} />
						</>
					)}
				</Card>
			</NewLayout>
		</AuthContext.Provider>
	)
}

const wizardData = [
	{ title: 'submit-mobile-email', icon: SmsIcon },
	{ title: 'personal-info', icon: UserIcon },
	{ title: 'meli-image', icon: PersonalCardIcon },
	{ title: 'selfie-image', icon: SelfieIcon },
	{ title: 'final-verification', icon: VerifyIcon2 },
]

export default UserAuthentication
