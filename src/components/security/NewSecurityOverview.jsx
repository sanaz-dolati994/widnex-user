import CardLayout from '../layouts/CardLayout'
import { NotSetIcon, SecurityText, SetIcon, State, Button } from '../../styles/SecurityStyles'
import { FaGoogle, FaMobileAlt, FaAt, FaList, FaTrashAlt, FaEdit, FaPlus } from 'react-icons/fa'
import ActivityCard from '../ActivityCard'
import AuthLoading from '../authentication/AuthLoading'
import Text from '../../core/utils/Text'
import { useProfileQuery } from '../../core/services/react-query/useProfileQuery'
import { useRemove2faMutation } from '../../core/services/react-query/useAuthQuery'
import { useState } from 'react'
import ModalLayout from '../layouts/ModalLayout'
import AuthDeleteModal from '../modals/AuthDeleteModal'
import { Flex, Grid } from '../../styles/CommonStyles'
import ActivityCardModal from '../ActivityCardModal'
import ProfileSettings from './NewProfileSettings'
// import ProfileSettings from './ProfileSettings'
import Card from '../common/Card'
import { ItemData, ItemRow } from '../../styles/newStyles/MobileModal.styled'
import { GoogleIcon, MailIcon, MobileIcon } from '../common/icons'
import CustomToggler from '../common/CustomToggler'

const SecurityOverview = ({ onGoogleAuthClicked }) => {
	const [activeSessionsModal, setActiveSessionsModal] = useState(false)
	const [authDeleteModal, setAuthDeleteModal] = useState(false)

	const onSuccess = () => {
		setAuthDeleteModal(false)
	}

	const { data: profile, isFetching } = useProfileQuery()
	const { mutate: remove2fa } = useRemove2faMutation(onSuccess)

	const onAuthDelete = () => {
		setAuthDeleteModal(true)
	}

	const onSubmitClicked = (code) => {
		if (code.state === 'valid') {
			remove2fa({ code: code.code })
		}
	}

	return (
		<>
			{activeSessionsModal ? (
				<>
					<ActivityCardModal
						activeSessionsModal={activeSessionsModal}
						setActiveSessionsModal={setActiveSessionsModal}
						width='100%'
					/>
				</>
			) : (
				<>
					<Card className='col-span-full lg:col-span-1 py-5'>
						<h3 className='font-semibold mb-5'>
							<Text tid='two-factor-auth' />
						</h3>

						<ItemRow className='border-b border-borderPrimary dark:border-card-border pb-4'>
							<ItemData>
								<GoogleIcon />
								<Text tid='ga' />
							</ItemData>

							<CustomToggler
								active={!!profile?.authenticator}
								onClick={() => {
									profile?.authenticator ? onAuthDelete() : onGoogleAuthClicked('activate')
								}}
							/>
						</ItemRow>
						<ItemRow className='border-b border-borderPrimary dark:border-card-border pb-4'>
							<ItemData>
								<MobileIcon />
								<Text tid='mobile-number' />
							</ItemData>

							{!profile?.mobile ? (
								<CustomToggler
									active={!!profile?.mobile}
									onClick={() => {
										onGoogleAuthClicked('auth')
									}}
								/>
							) : (
								<CustomToggler active={!!profile?.mobile} />
							)}
						</ItemRow>
						<ItemRow>
							<ItemData>
								<MailIcon />
								<Text tid='email' />
							</ItemData>

							{!profile?.email ? (
								<CustomToggler
									active={!!profile?.email}
									onClick={() => {
										onGoogleAuthClicked('auth')
									}}
								/>
							) : (
								<CustomToggler active={!!profile?.mobile} />
							)}
						</ItemRow>
					</Card>

					<Card className='col-span-full lg:col-span-1 py-5'>
						{/* two factor */}
						<ProfileSettings />
					</Card>

					<ActivityCard
						activeSessionsModal={activeSessionsModal}
						setActiveSessionsModal={setActiveSessionsModal}
						width='100%'
						fullVersion={true}
					/>

					<AuthLoading loading={isFetching} />
					<ModalLayout
						width='450px'
						open={authDeleteModal}
						onClose={() => setAuthDeleteModal(false)}
					>
						<AuthDeleteModal onSubmitClicked={onSubmitClicked} />
					</ModalLayout>
				</>
			)}
		</>
	)
}

export default SecurityOverview
