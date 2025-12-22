import React, { useEffect } from 'react'
import { FlexColumn } from '../../styles/CommonStyles'
import { FaRegAddressCard } from 'react-icons/fa'
import {
	FinalIcon,
	CheckIcon,
	CheckBg,
	MeliTitle,
	ButtonContainer,
	RejectIcon,
	NextStep,
	ReviewIcon,
} from '../../styles/AuthenticationStyles'
import { useNavigate } from 'react-router-dom'
import Text from '../../core/utils/Text'
import { useClaimKyc, useProfileQuery } from '../../core/services/react-query/useProfileQuery'

const FinalStep = () => {
	const { data: profile } = useProfileQuery()

	const navigate = useNavigate()
	const onSubmitClicked = () => {
		navigate('/dashboard')
	}

	const status = {
		PENDING: {
			icon: <ReviewIcon size={28} />,
			color: '#ffc800',
			tid: 'review',
			desc: 'reviewDesc',
		},
		CREATED: {
			icon: <ReviewIcon size={28} />,
			color: '#ffc800',
			tid: 'review',
			desc: 'reviewDesc',
		},
		VERIFIED: {
			icon: <CheckIcon size={28} />,
			color: '#1ce087',
			tid: 'verified',
			desc: 'finalDesc',
		},
		REJECTED: {
			icon: <RejectIcon size={32} />,
			color: '#e9106c',
			tid: 'rejected',
			desc: 'rejectedDesc',
		},
	}

	const { mutate: claimKyc } = useClaimKyc()
	useEffect(() => {
		if (profile?.status === 'CREATED') claimKyc()
	}, [])

	return (
		<div className='w-full lg:w-1/2 lg:mx-auto mt-5'>
			<div className='mb-5'>
				<h2>
					<Text tid='step5' className='opacity-90' />
					{' : '}
					<Text tid='step5-heading' className='font-semibold' />
				</h2>
			</div>
			<FlexColumn style={{ alignItems: 'center' }}>
				<FinalIcon className='mt-5'>
					<FaRegAddressCard size={92} color='#c3c5b7' />
					{profile?.status === 'VERIFIED' && <CheckBg size={42} />}
					{!!profile ? status[profile.status].icon : null}
				</FinalIcon>
				<MeliTitle
					margin='15px 0 0 0'
					color={status[profile.status || 'CREATED'].color}
					fontSize='0.9rem'
				>
					<Text tid={!!profile ? status[profile.status].tid : ''} />
				</MeliTitle>

				<MeliTitle
					margin='15px 0 0 0'
					fontSize='0.9rem'
					className=' flex items-center gap-x-1 font-bold text-lg text-heading dark:text-pColor'
				>
					{profile?.firstName}
					<Text tid='dear' />
					{'!'}
				</MeliTitle>
				<MeliTitle
					margin='15px 0 0 0'
					fontSize='0.8rem'
					className={`${
						profile.status === 'REJECTED'
							? 'leading-relaxed md:leading-loose md:w-1/2 mx-auto text-justify'
							: ''
					} text-center w-3/4 mx-auto text-heading dark:text-pColor`}
				>
					<Text
						tid={!!profile ? status[profile.status].desc : ''}
						className='font-semibold text-sm'
					/>
				</MeliTitle>
				{profile?.status !== 'PENDING' && (
					<MeliTitle margin='10px 0 0 0' fontSize='1rem'>
						<Text tid='finalFooter' className='text-sm text-heading dark:text-pColor' />
					</MeliTitle>
				)}

				<ButtonContainer>
					<NextStep active={true} onClick={onSubmitClicked}>
						<Text tid='back-to-dashboard' />
					</NextStep>
				</ButtonContainer>
			</FlexColumn>
		</div>
	)
}

export default FinalStep
