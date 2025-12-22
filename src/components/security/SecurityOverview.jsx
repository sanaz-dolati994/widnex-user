import CardLayout from '../layouts/CardLayout'
import {
	NotSetIcon,
	SecurityBody,
	SecurityText,
	SetIcon,
	State,
	Button,
} from '../../styles/SecurityStyles'
import { FaGoogle, FaMobileAlt, FaAt, FaList, FaTrashAlt, FaEdit, FaPlus } from 'react-icons/fa'
import ActivityCard from '../ActivityCard'
import { variants } from '../../core/utils/common'
import AuthLoading from '../authentication/AuthLoading'
import Text from '../../core/utils/Text'
import { useProfileQuery } from '../../core/services/react-query/useProfileQuery'
import { useRemove2faMutation } from '../../core/services/react-query/useAuthQuery'
import { useState } from 'react'
import ModalLayout from '../layouts/ModalLayout'
import AuthDeleteModal from '../modals/AuthDeleteModal'
import { Flex, Grid } from '../../styles/CommonStyles'
import ActivityCardModal from '../ActivityCardModal'
import ProfileSettings from './ProfileSettings'

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
		<SecurityBody variants={variants} initial='out' animate='in' exit='out'>
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
					<Flex align={'center'} justify={'center'} wrap={true} className={'gap-5'}>
						<State>
							{profile?.authenticator ? <SetIcon size={18} /> : <NotSetIcon size={18} />}
							<SecurityText>
								<Text tid='two-factor' />
							</SecurityText>
						</State>
						<State>
							{profile?.verifyAt ? <SetIcon size={18} /> : <NotSetIcon size={18} />}
							<SecurityText>
								<Text tid='identity-verify' />
							</SecurityText>
						</State>
						<State>
							{profile?.banks.length || profile?.wallets.length ? (
								<SetIcon size={18} />
							) : (
								<NotSetIcon size={18} />
							)}
							<SecurityText>
								<Text tid='white-list' />
							</SecurityText>
						</State>
					</Flex>

					<CardLayout width='100%' title='two-factor-auth'>
						<Grid className={`grid-cols-5 gap-5 py-4 mx-[30px] border-b-[0.5px] border-[#44464c]`}>
							<State className={'lg:col-span-2 col-span-3'}>
								<FaGoogle size={20} color='#e9106c' />
								<SecurityText fontSize='0.9rem'>
									<Text tid='google-auth' />
								</SecurityText>
							</State>
							<div className={'sm:col-span-2 col-span-5 hidden lg:block'}>
								<State className={''}>
									{!!profile?.authenticator ? <SetIcon size={18} /> : <NotSetIcon size={18} />}
									<SecurityText>
										<Text tid={profile?.authenticator ? 'set' : 'not-set'} />
									</SecurityText>
								</State>
							</div>
							<Flex className={'col-span-2 lg:col-span-1'} align={'center'} justify={'end'}>
								<Button
									// className={'lg:bg-[#3f4243] bg-[#e9106c]'}
									onClick={() => {
										profile?.authenticator ? onAuthDelete() : onGoogleAuthClicked('activate')
									}}
								>
									{!profile?.authenticator ? (
										<FaPlus className={'inline-block lg:hidden'} />
									) : (
										<FaTrashAlt className={'inline-block lg:hidden'} />
									)}

									<Text
										className={'hidden lg:inline-block'}
										tid={profile?.authenticator ? 'delete' : 'activate'}
									/>
								</Button>
							</Flex>
						</Grid>

						<Grid className={`grid-cols-5 gap-5 py-4 mx-[30px] border-b-[0.5px] border-[#44464c]`}>
							<State className={'lg:col-span-2 col-span-3'}>
								<FaMobileAlt size={20} color='#4f31c5' />
								<SecurityText fontSize='0.9rem' margin='0 10px'>
									<Text tid='mobile-auth' />
								</SecurityText>
							</State>
							<div className={'sm:col-span-2 col-span-5 hidden lg:block'}>
								<State className={''}>
									{profile?.mobile ? <SetIcon size={18} /> : <NotSetIcon size={18} />}
									<SecurityText margin='0 8px' number>
										<Text tid={profile?.mobile ? profile?.mobile : 'not-set'} />
									</SecurityText>
								</State>
							</div>
							<Flex className={'col-span-2 lg:col-span-1'} align={'center'} justify={'end'}>
								{!profile?.mobile ? (
									<Button onClick={() => onGoogleAuthClicked('auth')}>
										<Text tid='activate' />
									</Button>
								) : (
									<State className={'flex lg:hidden'}>
										{profile?.mobile ? <SetIcon size={18} /> : <NotSetIcon size={18} />}
										<SecurityText margin='0 8px'>
											<Text tid={profile?.mobile ? profile?.mobile : 'not-set'} />
										</SecurityText>
									</State>
								)}
							</Flex>
						</Grid>

						<Grid className={`grid-cols-5 gap-5 py-4 pb-0 mx-[30px]`} last={true}>
							<State className={'lg:col-span-2 col-span-3'}>
								<FaAt size={20} color='#1ce087' />
								<SecurityText fontSize='0.9rem' margin='0 10px'>
									<Text tid='email-auth' />
								</SecurityText>
							</State>
							<div className={'sm:col-span-2 col-span-5 hidden lg:block'}>
								<State className={''}>
									{profile?.email ? <SetIcon size={18} /> : <NotSetIcon size={18} />}
									<SecurityText>
										<Text tid={profile?.email ? profile?.email : 'not-set'} />
									</SecurityText>
								</State>
							</div>
							<Flex className={'col-span-2 lg:col-span-1'} align={'center'} justify={'end'}>
								{!profile?.email ? (
									<Button
										// className={'lg:bg-[#3f4243] bg-[#e9106c]'}
										onClick={() => onGoogleAuthClicked('auth')}
									>
										<FaPlus className={'inline-block lg:hidden'} />

										<Text className={'hidden lg:inline-block'} tid={'activate'} />
									</Button>
								) : (
									<State className={'flex lg:hidden'}>
										{profile?.email ? <SetIcon size={18} /> : <NotSetIcon size={18} />}
										<SecurityText>
											<Text tid={profile?.email ? profile?.email : 'not-set'} />
										</SecurityText>
									</State>
								)}
							</Flex>
						</Grid>
					</CardLayout>

					{/* two factor */}
					<ProfileSettings />

					<CardLayout width='100%' title='white-list'>
						<Grid className={`grid-cols-5 gap-5 py-4 mx-[30px] border-b-[0.5px] border-[#44464c]`}>
							<State className={'lg:col-span-2 col-span-3'}>
								<FaList color='#4f31c5' size={20} />
								<SecurityText>
									<Text tid='bank-white-list' />
								</SecurityText>
							</State>
							<div className={'sm:col-span-2 col-span-5 hidden lg:block'}>
								<State className={''}>
									{profile?.banks?.length ? <SetIcon size={18} /> : <NotSetIcon size={18} />}
									<SecurityText margin='0 8px'>
										<Text tid={profile?.banks?.length ? 'set' : 'not-set'} />
									</SecurityText>
								</State>
							</div>
							<Flex className={'col-span-2 lg:col-span-1'} align={'center'} justify={'end'}>
								<Button
									// className={'lg:bg-[#3f4243] bg-[#e9106c]'}
									onClick={() => onGoogleAuthClicked('bank')}
								>
									{profile?.banks?.length ? (
										<FaEdit className={'inline-block lg:hidden'} />
									) : (
										<FaPlus className={'inline-block lg:hidden'} />
									)}

									<Text
										className={'hidden lg:inline-block'}
										tid={profile?.banks?.length ? 'edit-list' : 'add-list'}
									/>
								</Button>
							</Flex>
						</Grid>

						<Grid
							className={`grid-cols-5 gap-5 py-4 mx-[30px] border-b-[0.5px] border-[#44464c]`}
							last={true}
						>
							<State className={'lg:col-span-2 col-span-3'}>
								<FaList color='#4f31c5' size={20} />
								<SecurityText>
									<Text tid='wallet-white-list' />
								</SecurityText>
							</State>
							<div className={'sm:col-span-2 col-span-5 hidden lg:block'}>
								<State className={''}>
									{profile?.wallets?.length ? <SetIcon size={16} /> : <NotSetIcon size={18} />}
									<SecurityText margin='0 8px'>
										<Text tid={profile?.wallets?.length ? 'set' : 'not-set'} />
									</SecurityText>
								</State>
							</div>
							<Flex className={'col-span-2 lg:col-span-1'} align={'center'} justify={'end'}>
								<Button
									// className={'lg:bg-[#3f4243] bg-[#e9106c]'}
									onClick={() => onGoogleAuthClicked('wallet')}
								>
									{profile?.wallets?.length ? (
										<FaEdit className={'inline-block lg:hidden'} />
									) : (
										<FaPlus className={'inline-block lg:hidden'} />
									)}

									<Text
										className={'hidden lg:inline-block'}
										tid={profile?.wallets?.length ? 'edit-list' : 'add-list'}
									/>
								</Button>
							</Flex>
						</Grid>
					</CardLayout>

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
		</SecurityBody>
	)
}

export default SecurityOverview
