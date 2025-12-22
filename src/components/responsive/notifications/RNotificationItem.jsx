import { RCFlex, RFlex, RRow, RText } from '../../../styles/responsive/Common'
import { Flex } from '../../../styles/CommonStyles'
import Text from '../../../core/utils/Text'
import { formatDate } from '../../../core/utils/common'
import { useMainContext } from '../../../core/contexts/main'
import { FaEnvelope, FaEnvelopeOpen } from 'react-icons/fa'
import { Badge, Indicator } from '../../../styles/NotificationsStyles'
import { useState } from 'react'
import Description from '../../modals/Description'
import ReactMarkdown from 'react-markdown'

const RNotificationItem = ({ data: item, index }) => {
	const {
		main: { lang },
	} = useMainContext()

	const priority = item.priority.toLowerCase()

	const isRead = item.readAt

	let priorityColor =
		priority === 'high' ? '#1ce087' : priority === 'medium' ? '#4f31c5' : '#a12356'

	let iconColor = isRead ? '#858585' : priorityColor

	// item.body =
	// 	'## کاربر محترم ویدنکس\nبه اطلاع شما می‌رسانیم که ویژگی جدیدی به پنل کاربری اضافه شده است! از این پس، می‌توانید تمامی عملیات مالی خود را به صورت جامع و یکجا در پنل کاربری خود مشاهده کنید. \n\nاین بخش جدید با نام تاریخچه تراز موجودی شامل تمامی فعالیت‌های مالی شماست، از جمله:\n\n- نمایش حجم خرید یا فروش ارز دیجیتال\n- نمایش قبل و بعد مقدار دارایی‌ها\n- نمایش نوع دارایی‌ها(ارزها)\n- نمایش نوع معاملات خرید یا فروش ارزها\n- نمایش موجودی بلاک شده\n- تغییرات اعمال شده توسط ادمین سایت\n- ساعت و تاریخ تمام موارد بیان شده در جدول نمایش داده میشود.\n\nبا این امکان جدید، می‌توانید به راحتی و با شفافیت بیشتری، مدیریت مالی خود را در ویدنکس انجام دهید.\n\nاین تنها یکی از گام‌های ما برای ارائه تجربه بهتر به شماست!\n\n### با احترام\n\nتیم صرافی ارز دیجیتال ویدنکس'

	return (
		<>
			<RRow className={'w-full block m-auto'}>
				<Flex align={'center'} className={'gap-3 w-full'}>
					<RFlex style={{ alignItems: 'center' }}>
						<RCFlex>
							<div>
								<Flex align={'center'}>
									<span
										style={{
											color: iconColor,
										}}
									>
										{isRead ? <FaEnvelopeOpen /> : <FaEnvelope />}
									</span>

									<Text className={'mr-1'} tid={item.title} />
									{
										isRead ? null :
											<span>
												<Indicator className={`${'animate-ping'}`} color={iconColor} />
											</span>
									}
								</Flex>
								<small>
									{item.createdAt ? (
										<>{formatDate(item.createdAt, 'time', lang === 'en' ? 'en-US' : 'fa-IR')} - {formatDate(item.createdAt, 'date', lang === 'en' ? 'en-US' : 'fa-IR')}</>
									) : (
										<Text tid='did-not-read' />
									)}
								</small>
							</div>
						</RCFlex>
					</RFlex>
					<Flex className={'text-center'} flexDirection={'col'} align={'center'} justify={'center'}>
						<small
							style={{
								color: priorityColor,
							}}
						>
							<Text tid={priority} />
						</small>

						<Badge>
							<Text tid={item.type.toLowerCase()} />
						</Badge>
					</Flex>
				</Flex>

				<RText
					style={{
						position: 'relative',
					}}
					className={'mt-4 opacity-75 text-md markdown-content'}
				>
					<ReactMarkdown children={item.body ? item.body : '--'} />
				</RText>
			</RRow>
		</>
	)
}

export default RNotificationItem
