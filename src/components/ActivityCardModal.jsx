import {
	FaArrowCircleLeft,
	FaArrowCircleRight,
	FaCaretLeft,
	FaChevronRight,
	FaEdit,
	FaLaptop,
	FaPlus,
	FaTrashAlt,
} from 'react-icons/fa'
import { variants } from '../core/utils/common'
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
	DIV,
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
import { Grid } from '../styles/CommonStyles'
import {useAuthContext} from "../core/contexts/auth";
import Card from './common/Card'

const ActivityCardModal = ({
	activeSessionsModal,
	setActiveSessionsModal,
	width,
	height,
	fullVersion,
}) => {
	const {
		main: { lang },
		profile: { token },
	} = useMainContext()
	const {
		main: { theme },
	} = useMainContext()
	const { data: activities, isFetching } = useSessionsQuery()
	const { logout } = useAuthContext()
	const { mutate: deleteSession } = useDeleteSessionMutation()

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
			<div
				className={`flex w-full px-2 justify-start ${
					theme === 'dark' ? 'text-white' : 'text-black'
				}`}
			>
				<FaChevronRight onClick={() => setActiveSessionsModal(false)} />
			</div>
			<Card className='col-span-full' width={width} height={height}>
				<div className={'px-5'}>
					{activities?.data?.map((activity, idx) => {
						const isLast = idx === activities.data.length - 1

						const main = new Date(activity.createdAt)
						const time = formatDate(main, 'time', lang === 'en' ? 'en-US' : 'fa-IR')
						const date = formatDate(main, null, lang === 'en' ? 'en-US' : 'fa-IR')

						return (
							<Fragment key={idx}>
								{!isFetching && (
									<Grid
										className={`grid-cols-2 ${isLast ? '' : 'border-b-[0.5px] border-[#44464c]'}`}
									>
										<div>
											<DIV className={'flex items-center justify-start'}>
												<FaLaptop size={'26'} className={'ml-2'} />
												{`${activity.extra?.deviceName}/${activity.extra?.deviceVersion}`}
											</DIV>
											<DIV className={'flex items-center justify-start'}>IP</DIV>
											<DIV className={'flex items-center justify-start'}>تاریخ ورود</DIV>
										</div>
										<div>
											<DIV className={'flex items-center justify-end'}>
												<Button
													className={'px-1.5 lg:bg-[#3f4243] bg-[#e9106c]'}
													onClick={() => onSessionClose(activity.token)}
												>
													<FaTrashAlt className={'inline-block lg:hidden'} />
												</Button>
											</DIV>
											<DIV className={'flex mt-2 items-center justify-end'}>{activity.ip}</DIV>
											<DIV dir={'ltr'} className={'flex items-center justify-start'}>
												{date} {time}
											</DIV>
										</div>
									</Grid>
								)}
							</Fragment>
						)
					})}
				</div>
			</Card>
		</>
	)
}

const formatDate = (date, type, lang) => {
	if (type === 'time') {
		return new Date(date).toLocaleTimeString(lang)
	}
	return new Date(date).toLocaleDateString(lang)
}

export default ActivityCardModal
