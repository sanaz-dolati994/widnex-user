import { Link } from 'react-router-dom'
import { useWindowSize } from '../core/hooks/useWindowSize'
import Text from '../core/utils/Text'
import { PairBody, PairColumn, PairHeading } from '../styles/newStyles/Dashboard.styled'
import { VerticalLine } from '../styles/newStyles/Header.styled'
import Avatar from './common/Avatar'
import Card from './common/Card'
import { FaArrowLeft } from 'react-icons/fa'
import { useProfileQuery } from '../core/services/react-query/useProfileQuery'
import { statusColors } from '../pages/NewMainDashboard'
import styled from 'styled-components'
import { CopyIcon } from './common/icons'
import { useQueryContext } from '../core/contexts/query'

export default function NewProfile() {
	const { data: profile, isFetching: profileLoading } = useProfileQuery()

	const { setToast } = useQueryContext()
	const onCopyClipboard = (value) => {
		navigator.clipboard.writeText(value)
		setToast({
			show: true,
			message: 'copy-success',
		})
	}

	const fullname = profile ? `${profile.firstName ?? ''} ${profile.lastName ?? ''}` : ''

	return (
		<Card className='pb-16 col-span-3 lg:overflow-y-auto'>
			<Card className='flex items-center justify-between lg:gap-x-4 lg:justify-start mb-10 rounded-xl'>
				<Avatar loading={profileLoading} profile={profile} />

				<PairColumn>
					<PairHeading>
						<Text tid='fullname' />
					</PairHeading>
					<PairBody>{fullname}</PairBody>
				</PairColumn>

				<VerticalLine className='bg-gray-light' />

				{profile?.status !== 'VERIFIED' ? (
					<Link
						to='/authentication'
						className='flex items-center gap-x-2 lg:gap-x-4 bg-gray-light dark:bg-cBlue text-cBlue dark:text-white rounded-md text-xs lg:text-base px-3 py-1 lg:px-5 lg:py-2 transition-colors border border-transparent hover:border-cBlue'
					>
						<Text tid='auth' className='' />
						<FaArrowLeft />
					</Link>
				) : (
					<PairColumn>
						<PairHeading>
							<Text tid='account-status' />
						</PairHeading>
						<PairBody>
							<Text tid={profile?.status} className={`${statusColors[profile?.status] || ''}`} />
						</PairBody>
					</PairColumn>
				)}
			</Card>

			<div>
				<h3 className='font-semibold text-lg my-5'>
					<Text tid={'user-info'} />
				</h3>

				<div className='grid grid-cols-1 lg:grid-cols-2 grid-rows-2 gap-10 border-b border-borderPrimary dark:border-card-border pb-10'>
					<ProfileItem>
						<h4 className='item-label'>
							<Text tid='firstName' />
						</h4>
						<div className='item-value'>{profile?.firstName}</div>
					</ProfileItem>
					<ProfileItem>
						<h4 className='item-label'>
							<Text tid='lastName' />
						</h4>
						<div className='item-value'>{profile?.lastName}</div>
					</ProfileItem>
					<ProfileItem>
						<h4 className='item-label'>
							<Text tid='birthDate' />
						</h4>
						<div className='item-value'>{profile?.birthDate?.replaceAll('-', '/')}</div>
					</ProfileItem>
					<ProfileItem>
						<h4 className='item-label'>
							<Text tid='idNo' />
						</h4>
						<div className='item-value'>{profile?.idNo}</div>
					</ProfileItem>
					<ProfileItem>
						<h4 className='item-label'>
							<Text tid='user-id' />
						</h4>
						<div className='item-value justify-between'>
							<span>{profile?._id}</span>
							<button
								className='bg-cBlue text-white flex items-center gap-x-2 rounded-lg px-4 py-2 text-sm'
								onClick={onCopyClipboard.bind(null, profile?._id)}
							>
								<CopyIcon />
								<Text tid='copy' />
							</button>
						</div>
					</ProfileItem>
				</div>

				<h3 className='font-semibold text-lg my-5'>
					<Text tid={'contact-info'} />
				</h3>

				<div className='grid grid-cols-1 lg:grid-cols-2 grid-rows-2 gap-10'>
					<ProfileItem>
						<h4 className='item-label'>
							<Text tid='contact-mobile' />
						</h4>
						<div className='item-value'>{profile?.mobile}</div>
					</ProfileItem>
					<ProfileItem>
						<h4 className='item-label'>
							<Text tid='email' />
						</h4>
						<div className='item-value'>{profile?.email}</div>
					</ProfileItem>
					<ProfileItem>
						<h4 className='item-label'>
							<Text tid='address' />
						</h4>
						<div className='item-value'>{profile?.address.line}</div>
					</ProfileItem>
				</div>
			</div>
		</Card>
	)
}

const ProfileItem = styled.div`
	display: flex;
	flex-direction: column;
	row-gap: 5px;

	.item-label {
		font-weight: 500;
		font-size: 14px;
	}

	.item-value {
		border: 1px solid ${(props) => props.theme.inputBorder};
		background-color: ${(props) => props.theme.fieldBg};
		border-radius: 8px;
		height: 44px;
		padding: 1rem 0.5rem;

		display: flex;
		align-items: center;
		justify-content: flex-start;
	}
`
