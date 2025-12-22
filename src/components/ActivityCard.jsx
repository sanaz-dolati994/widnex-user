import { FaArrowCircleLeft, FaArrowCircleRight, FaCaretLeft } from 'react-icons/fa'
import { formatDate, variants } from '../core/utils/common'
import CardLayout from './layouts/CardLayout'
import { ActivityBody, ActivityItem, Title } from '../styles/AcitivityStyles'
import { TableWrapper } from '../styles/OrdersStyle'
import { Button, FlexEnd, OpenPopUpButton } from '../styles/SecurityStyles'
import {
	Column,
	HeaderColumn,
	HeaderRow,
	NoDataWrapper,
	Row,
	Table,
	TD,
	TH,
} from '../styles/TableStyle'
import {
	useDeleteSessionMutation,
	useLogout,
	useSessionsQuery,
} from '../core/services/react-query/useAuthQuery'
import Text from '../core/utils/Text'
import { useMainContext } from '../core/contexts/main'
import AuthLoading from './authentication/AuthLoading'
import { useNavigate } from 'react-router-dom'
import { Fragment } from 'react'
import { useWindowSize } from '../core/hooks/useWindowSize'
import { TABLET_SIZE } from '../core/constants/common'
import { useAuthContext } from '../core/contexts/auth'
import Card from './common/Card'
import { IoIosExit } from 'react-icons/io'
import Loader from 'react-spinners/BarLoader'

const ActivityCard = ({
	activeSessionsModal,
	setActiveSessionsModal,
	width,
	height,
	fullVersion,
}) => {
	const {
		main: { lang, theme },
		profile: { token },
	} = useMainContext()
	const { data: activities, isFetching } = useSessionsQuery()
	const { logout } = useAuthContext()
	const { mutate: deleteSession } = useDeleteSessionMutation()

	const { width: windowWidth } = useWindowSize()
	const isTablet = windowWidth < TABLET_SIZE

	const isModalMode = setActiveSessionsModal && isTablet

	const onSessionClose = (session) => {
		if (session === token) {
			logout()
		} else {
			deleteSession(session)
		}
	}

	const navigate = useNavigate()

	const onMoreClicked = () => {
		navigate('/security')
	}

	return (
		<>
			{isModalMode ? (
				<OpenPopUpButton
					className='col-span-full'
					onClick={() => {
						window.scrollTo(0, 0)
						setActiveSessionsModal(true)
					}}
				>
					<span>مدیریت دستگاه‌ها</span>

					<FaCaretLeft />
				</OpenPopUpButton>
			) : (
				<Card className='col-span-full relative min-h-[200px] lg:overflow-y-auto' padding='p-10'>
					<h4 className='mb-8 font-semibold'>
						<Text tid='activities-devices' />
					</h4>
					<div className={'overflow-x-auto px-5'}>
						{!activities?.data?.length ? (
							<NoDataWrapper top='50px'>
								<img alt=' ' src={require('../assets/images/noData.png')} />
							</NoDataWrapper>
						) : (
							<table className={'table table-auto w-full'}>
								{!!fullVersion && (
									<thead>
										<tr className={'border-b-[0.5px] border-[#44464c]'}>
											{headers.map((item, index) => (
												<TH
													className={item.title === 'operation' ? 'text-center' : 'text-right'}
													key={index}
												>
													<Text tid={item.title} />
												</TH>
											))}
											<th />
										</tr>
									</thead>
								)}
								<tbody>
									{activities?.data?.map((activity, idx) => {
										const main = new Date(activity.createdAt)
										const time = formatDate(main, 'time', lang === 'en' ? 'en-US' : 'fa-IR')
										const date = formatDate(main, null, lang === 'en' ? 'en-US' : 'fa-IR')

										return (
											<Fragment key={idx}>
												{!isFetching && (
													<tr
														style={{
															borderBottom: theme === 'light' ? '#00000010' : '#ffffff10',
														}}
													>
														{/* {!!fullVersion && <TD>{idx + 1}</TD>} */}
														<TD>{activity.platform}</TD>
														<TD>{activity.ip}</TD>
														{!!fullVersion ? (
															<>
																<TD>{`${activity.extra?.deviceName}/${activity.extra?.deviceVersion}`}</TD>
																<TD>
																	<div className={'flex items-center justify-center'}>
																		<button
																			onClick={() => onSessionClose(activity.token)}
																			className='text-red-500 flex items-center gap-x-2 text-sm'
																		>
																			<IoIosExit size={20} />
																			<Text tid='signout' />
																		</button>
																	</div>
																</TD>
															</>
														) : (
															<>
																<TD>{date}</TD>
																<TD>{time}</TD>
															</>
														)}
													</tr>
												)}
											</Fragment>
										)
									})}
								</tbody>
							</table>
						)}
					</div>
				</Card>
			)}
		</>
	)
}

const headers = [
	// { title: 'row', width: '5%' },
	{ title: 'platform', width: '25%' },
	{ title: 'ip', width: '25%' },
	{ title: 'browser', width: '25%' },
	{ title: 'operation', width: '25%' },
]

export default ActivityCard
