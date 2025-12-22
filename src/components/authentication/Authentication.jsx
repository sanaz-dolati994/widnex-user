import CardLayout from '../layouts/CardLayout'
import { AnimatePresence } from 'framer-motion'
import { variants } from '../../core/utils/common'
import { AuthWrapper, AnimateBody } from '../../styles/AuthenticationStyles'
import MobileEmailSubmit from './NewMobileEmailSubmit'
import PersonalInfo from './NewPersonalInfo'
import RPersonalInfo from '../responsive/authentication/RNewPersonalInfo'
import MeliPhoto from './MeliPhoto'
import SelfiePhoto from './SelfiePhoto'
import FinalStep from './FinalStep'
import AuthLoading from './AuthLoading'
import useAuthentication from '../../core/hooks/useAuthentication'
import { useWindowSize } from '../../core/hooks/useWindowSize'
import { TABLET_SIZE } from '../../core/constants/common'

const Authentication = ({ active, setActiveWizard }) => {
	const { width } = useWindowSize()

	const { onInputChange, onNextClicked, loading } = useAuthentication(active, setActiveWizard)

	return (
		<>
			<AuthWrapper>
				<div
					className='relative'
					// width={active === 0 && width > TABLET_SIZE ? '50%' : '100%'}
					// height={active === 0 ? '320px' : '100%'}
					// marginTop={width < TABLET_SIZE && '200px'}
					style={{
						width: active === 0 && width > TABLET_SIZE ? '50%' : '100%',
						height: '100%',
					}}
				>
					<AnimatePresence exitBeforeEnter>
						<AnimateBody
							variants={variants}
							initial='out'
							animate='in'
							hasPadding={active === 1 || active === 3}
						>
							{/*  step 1 */}
							{active === 0 && (
								<MobileEmailSubmit
									onInputValueChange={onInputChange}
									setActiveWizard={setActiveWizard}
								/>
							)}

							{/* step 2 */}
							{active === 1 &&
								(width > TABLET_SIZE ? (
									<PersonalInfo
										onInputValueChange={onInputChange}
										onSubmitClicked={onNextClicked}
									/>
								) : (
									<RPersonalInfo
										onInputValueChange={onInputChange}
										onSubmitClicked={onNextClicked}
									/>
								))}

							{/* step 3 */}
							{active === 2 && <MeliPhoto onSubmitClicked={onNextClicked} />}
							{active === 3 && <SelfiePhoto onSubmitClicked={onNextClicked} />}

							{active === 4 && <FinalStep />}
						</AnimateBody>
					</AnimatePresence>
				</div>
			</AuthWrapper>
			<AuthLoading loading={loading} />
		</>
	)
}

export default Authentication
