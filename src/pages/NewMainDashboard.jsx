import Card from '../components/common/Card'
import NewLayout from '../components/layouts/NewLayout'
import { useWindowSize } from '../core/hooks/useWindowSize'
import { useProfileQuery } from '../core/services/react-query/useProfileQuery'
import { VerticalLine } from '../styles/newStyles/Header.styled'
import { PairBody, PairColumn, PairHeading } from '../styles/newStyles/Dashboard.styled'
import Text from '../core/utils/Text'
import { FaArrowLeft } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import DashboardMarket from '../components/dashboard/DashboardMarket'
import WalletOverview from '../components/dashboard/WalletOverview'
import TransactionsOverview from '../components/dashboard/TransactionsOverview'
import Avatar from '../components/common/Avatar'

export const statusColors = {
	CREATED: 'text-blue-500',
	PENDING: 'text-orange-500',
	VERIFIED: 'text-green-500',
	REJECTED: 'text-red-500',
}

export default function NewMainDashboard() {
	const { width } = useWindowSize()
	const { data: profile, isFetching: profileLoading } = useProfileQuery()

	const fullname = profile ? `${profile.firstName ?? ''} ${profile.lastName ?? ''}` : ''

	return (
		<NewLayout>
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-4 lg:h-full'>
				<div className='lg:col-span-2 min-h-full flex flex-col gap-y-4'>
					{width > 1024 && (
						<Card className='flex items-center gap-x-5'>
							<Avatar loading={profileLoading} profile={profile} />

							<PairColumn>
								<PairHeading>
									<Text tid='fullname' />
								</PairHeading>
								<PairBody>{fullname}</PairBody>
							</PairColumn>

							<VerticalLine className='bg-gray-light' />

							<PairColumn>
								<PairHeading>
									<Text tid='mobile' />
								</PairHeading>
								<PairBody>{profile?.mobile}</PairBody>
							</PairColumn>

							<VerticalLine className='bg-gray-light' />

							<PairColumn>
								<PairHeading>
									<Text tid='account-status' />
								</PairHeading>
								<PairBody>
									<Text
										tid={profile?.status}
										className={`${statusColors[profile?.status] || ''}`}
									/>
								</PairBody>
							</PairColumn>

							{profile?.status !== 'VERIFIED' ? (
								<Link
									to='/authentication'
									className='mr-auto flex items-center gap-x-4 bg-gray-light dark:bg-cBlue text-cBlue dark:text-white rounded-md px-5 py-2 transition-colors border border-transparent hover:border-cBlue'
								>
									<Text tid='auth' />
									<FaArrowLeft />
								</Link>
							) : null}
						</Card>
					)}

					<div className='relative w-[90%] mx-auto lg:w-auto lg:mx-0'>
						<img
							src={require('../assets/newImages/dashboard-banner.png')}
							alt='شروع معامله'
							className='rounded-md h-[100px] w-full object-cover'
						/>
						<div className='absolute top-1/2 right-10 -translate-y-1/2'>
							<h4 className='mb-2'>
								<Text tid='dashboard-banner_title--1' className='text-white/60' />
								<Text tid='dashboard-banner_title--2' className='text-white text-xl' />
							</h4>
							<button className='flex items-center gap-x-2'>
								<Text tid='dashboard-banner_body' className='text-white/60 dark:text-white' />
								<div className='flex items-center justify-center w-6 h-6 rounded-full bg-cBlue text-white'>
									<FaArrowLeft />
								</div>
							</button>
						</div>
					</div>

					<Card className={'!px-0 flex-1 lg:overflow-hidden'}>
						<DashboardMarket />
					</Card>
				</div>
				<Card
					className={`order-first lg:order-none ${width > 1024 ? 'overflow-y-auto' : 'self-start'}`}
					padding='px-0'
				>
					<WalletOverview className='w-[90%] mx-auto my-4 lg:w-auto lg:mx-4' />

					{width > 1024 && (
						<>
							<div className='h-[1px] bg-borderPrimary dark:bg-card-border'></div>

							<TransactionsOverview heading='recent-transactions' />
						</>
					)}
				</Card>
			</div>
		</NewLayout>
	)
}
