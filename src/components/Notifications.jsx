import { useEffect, useState } from 'react'
import NewLayout from './layouts/NewLayout'
import { useMainContext } from '../core/contexts/main'
import {
	useNotificationsQuery,
	useReadAllNotificationsMutation,
	useReadNotificationMutation,
	useUnreadNotificationQuery,
} from '../core/services/react-query/useNotificationsQuery'
import { DText, FlexCenter, PaginationContainer, ReadAllNotsWrapper } from '../styles/CommonStyles'
import Text from '../core/utils/Text'
import { AnimatePresence } from 'framer-motion'
import { TableWrapper } from '../styles/OrdersStyle'
import { HeaderColumn, HeaderRow, Table, Row, Column, NoDataWrapper } from '../styles/TableStyle'
import Pagination from 'react-js-pagination'
import { formatDate, variants } from '../core/utils/common'
import { ScaleLoader } from 'react-spinners'
import Description from './modals/Description'
import Card from './common/Card'
import ReactMarkdown from 'react-markdown'
import { IoNotificationsCircle } from 'react-icons/io5'

export default function Notifications() {
	const {
		main: { lang, theme },
	} = useMainContext()

	const [activePage, setActivePage] = useState(1)
	const [totalPages, setTotalPages] = useState(null)

	const [showNote, setShowNote] = useState({
		show: false,
		item: null,
	})
	const { data: notifications, isFetching, refetch } = useNotificationsQuery(activePage)
	const { data: unreadNots } = useUnreadNotificationQuery(activePage)
	const { mutate: readNots } = useReadAllNotificationsMutation()
	const { mutate: readANote } = useReadNotificationMutation()

	useEffect(() => {
		if (notifications) {
			setTotalPages(notifications.meta.total)
		}
	}, [notifications])


	const handleMarkNotifAsRead = (_id) => {
		let shouldRefech = false
		try {
			shouldRefech = true
			readANote(_id)

		} catch (err) {
			console.log(err)
		} finally {
			if (shouldRefech) {
				setTimeout(refetch, 1000)
			}
		}
	}

	// useEffect(() => {
	// 	if (notifications?.data?.length) {
	// 		let shouldRefech = false
	// 		try {
	// 			notifications.data.forEach((not) => {
	// 				if (!not.readAt) {
	// 					shouldRefech = true
	// 					readANote(not._id)
	// 				}
	// 			})
	// 		} catch (err) {
	// 			console.log(err)
	// 		} finally {
	// 			if (shouldRefech) {
	// 				setTimeout(refetch, 1000)
	// 			}
	// 		}
	// 	}
	// }, [notifications, activePage])

	const onPageChange = (p) => {
		setActivePage(p)
	}

	useEffect(refetch, [activePage])

	const readAllNotifications = () => {
		readNots()
	}

	const handleShowNote = (item) => {
		setShowNote((prevState) =>
			!prevState.show && item.body?.toString()?.length > 50
				? {
					show: true,
					item: item,
				}
				: { show: false, item: null }
		)
		if (!item.readAt) handleMarkNotifAsRead(item._id)
	}

	return (
		<>
			{showNote.show ? (
				<ExtraNotifModal
					data={showNote.item}
					closeModal={() => setShowNote({ show: false, item: null })}
				/>
			) : (
				<>
					{unreadNots?.data?.length ? (
						<FlexCenter style={{ justifyContent: 'flex-end' }}>
							<ReadAllNotsWrapper onClick={readAllNotifications}>
								<DText>
									<Text tid='read-all-notifications' />
								</DText>
							</ReadAllNotsWrapper>
						</FlexCenter>
					) : null}
					<AnimatePresence exitBeforeEnter>
						{!isFetching && notifications?.data?.length ? (
							<TableWrapper
								className='lg:overflow-y-auto h-[75vh]'
								variants={variants}
								initial='out'
								animate='in'
								exit='out'
							>
								<Table width='100%'>
									<HeaderRow className='sticky top-0 !bg-white dark:!bg-dark z-10'>
										{headers.map((header) => (
											<HeaderColumn fontSize='0.9rem' width={header.width} key={header.title}>
												<Text tid={header.title} />
											</HeaderColumn>
										))}
									</HeaderRow>
									{notifications.data.map((item, index) => {
										const priority = item.priority.toLowerCase()

										// item.body =
										// 	'## کاربر محترم ویدنکس\nبه اطلاع شما می‌رسانیم که ویژگی جدیدی به پنل کاربری اضافه شده است! از این پس، می‌توانید تمامی عملیات مالی خود را به صورت جامع و یکجا در پنل کاربری خود مشاهده کنید. \n\nاین بخش جدید با نام تاریخچه تراز موجودی شامل تمامی فعالیت‌های مالی شماست، از جمله:\n\n- نمایش حجم خرید یا فروش ارز دیجیتال\n- نمایش قبل و بعد مقدار دارایی‌ها\n- نمایش نوع دارایی‌ها(ارزها)\n- نمایش نوع معاملات خرید یا فروش ارزها\n- نمایش موجودی بلاک شده\n- تغییرات اعمال شده توسط ادمین سایت\n- ساعت و تاریخ تمام موارد بیان شده در جدول نمایش داده میشود.\n\nبا این امکان جدید، می‌توانید به راحتی و با شفافیت بیشتری، مدیریت مالی خود را در ویدنکس انجام دهید.\n\nاین تنها یکی از گام‌های ما برای ارائه تجربه بهتر به شماست!\n\n### با احترام\n\nتیم صرافی ارز دیجیتال ویدنکس'
										let notifBody = ''
										if (!item.body) notifBody = '--'
										else {
											if (item.body.toString().length <= 50) {
												notifBody = item.body
											} else {
												// notifBody =
												//     item.body
												//         .toString()
												//         .substring(0, 50) +
												//     '...'
												notifBody = (
													<ReactMarkdown children={item.body.toString().substring(0, 50) + '...'} />
												)
											}
										}

										return (
											<Row key={item.createdAt}>
												<Column width='15%'>{item.title}</Column>
												<Column
													className={`${item.readAt ? '' : 'text-blue-400 font-bold'}`}
													style={{
														cursor: 'pointer',
													}}
													width='25%'
													onClick={handleShowNote.bind(null, item)}
												>
													{notifBody}
												</Column>
												<Column width='12%'>
													<Text tid={item.type.toLowerCase()} />
												</Column>
												<Column
													width='12%'
													color={
														priority === 'high'
															? '#1ce087'
															: priority === 'medium'
																? '#0773F1'
																: '#a12356'
													}
												>
													<Text tid={priority} />
												</Column>
												<Column width='12%' number>
													{formatDate(item.createdAt, 'time', lang === 'en' ? 'en-US' : 'fa-IR')} - {formatDate(item.createdAt, 'date', lang === 'en' ? 'en-US' : 'fa-IR')}
												</Column>
												<Column width='12%' number>
													{item.readAt ? (
														<>{formatDate(item.readAt, 'time', lang === 'en' ? 'en-US' : 'fa-IR')} - {formatDate(item.readAt, 'date', lang === 'en' ? 'en-US' : 'fa-IR')}</>
													) : (
														<Text tid='did-not-read' />
													)}
												</Column>
											</Row>
										)
									})}
								</Table>
							</TableWrapper>
						) : (
							<FlexCenter height='50vh'>
								<ScaleLoader color='#0773F1' height='24px' width='2px' />
							</FlexCenter>
						)}
					</AnimatePresence>

					{!isFetching && !notifications?.data?.length && (
						<div className={'p-5'}>
							<NoDataWrapper top='80px'>
								<img alt=' ' src={require('../assets/images/noData.png')} />
							</NoDataWrapper>
						</div>
					)}
					{totalPages ? (
						<PaginationContainer bottom={'0'} className='bg-white dark:bg-dark rounded-xl right-0 py-3 w-full'>
							<Pagination
								activePage={activePage}
								itemsCountPerPage={10}
								totalItemsCount={totalPages}
								pageRangeDisplayed={3}
								onChange={(p) => onPageChange(p)}
								itemClass={theme === 'light' ? 'd-page-item' : 'page-item'}
								linkClass={theme === 'light' ? 'd-page-link' : 'page-link'}
							/>
						</PaginationContainer>
					) : null}
				</>
			)}
		</>
	)
}

const headers = [
	{ title: 'title', width: '15%' },
	{ title: 'description', width: '25%' },
	{ title: 'type', width: '12%' },
	{ title: 'priority', width: '12%' },
	{ title: 'createdAt', width: '12%' },
	{ title: 'readAt', width: '12%' },
]

const ExtraNotifModal = ({ data, closeModal }) => {
	return (
		<div className='w-full h-full p-8'>
			<div className='flex items-center justify-between border-b pb-2'>
				<h3 className='flex items-center gap-2 text-lg'>
					<IoNotificationsCircle size={26} />
					{data.title}
				</h3>
				<button type='button' className='text-blue-600' onClick={closeModal}>
					<Text tid='back' />
				</button>
			</div>
			<div dir='rtl' className='text-right markdown-content w-full h-auto my-2'>
				<ReactMarkdown children={data.body} />
			</div>
		</div>
	)
}
