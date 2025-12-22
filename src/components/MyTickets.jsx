import CardLayout from './layouts/CardLayout'
import { FaRegUser, FaRegEye } from 'react-icons/fa'
import { formatDate } from '../core/utils/common'
import { FlexCenter, PaginationContainer, SpinnerContainer } from '../styles/CommonStyles'
import Pagination from 'react-js-pagination'
import {
	AdminFooter,
	AdminName,
	TicketBody,
	TextField,
	TicketsContainer,
	MessageContainer,
	MessageContent,
	MessageFooter,
	MessageWrapper,
	Avatar,
	SendBtn,
	TextFieldContainer,
} from '../styles/MyTicketStyles'
import useMyTickets from '../core/hooks/useMyTickets'
import { ClipLoader } from 'react-spinners'
import { useMainContext } from '../core/contexts/main'
import Text from '../core/utils/Text'
import { NoDataWrapper } from '../styles/TableStyle'

const MyTickets = () => {
	const {
		main: { lang, theme },
	} = useMainContext()

	const [
		newMessage,
		allTickets,
		allPages,
		activePage,
		profile,
		onTextFieldChange,
		onPageChange,
		createTicket,
		getAdminName,
		ticketsLoading,
		ticketCreating,
	] = useMyTickets()

	return (
		<CardLayout width='100%'>
			<TicketBody>
				<TicketsContainer>
					{profile &&
						!ticketsLoading &&
						allTickets?.data?.map((ticket) => {
							// types => 1-admin 2-user
							const type = ticket.type === 'QUESTION' ? 2 : 1

							return (
								<MessageContainer key={ticket.createAt} type={type}>
									<Avatar>
										{type === 2 &&
											(profile && profile?.avatar ? (
												<img src={profile?.avatar} alt=' ' width='100%' height='100%' />
											) : (
												<FaRegUser color='#c3c5b7' size={28} />
											))}
										{type === 1 && (
											<img
												src={require(`../assets/images/logo-${lang}-${theme}.png`)}
												alt=' '
												width='80%'
												height='80%'
												className='object-contain'
											/>
										)}
									</Avatar>
									<MessageWrapper type={type}>
										<MessageContent type={type}>
											{ticket.message.split('\n').map((m) => (
												<span key={m} style={{ display: 'block' }}>
													{m}
												</span>
											))}
										</MessageContent>
										<MessageFooter className={'gap-5'} type={type}>
											{type === 1 ? (
												<AdminFooter>
													<AdminName>{getAdminName(ticket.userId)}</AdminName>
													<Text tid='technical-expert' />
												</AdminFooter>
											) : (
												`${profile?.firstName} ${profile?.lastName}`
											)}
											<FlexCenter>
												{formatDate(ticket.createdAt, 'time', lang === 'en' ? 'en-US' : 'fa-IR')}
												{' - '}
												{formatDate(ticket.createdAt, 'date', lang === 'en' ? 'en-US' : 'fa-IR')}
												{ticket.readBy && type === 2 && (
													<FaRegEye style={{ marginRight: '5px' }} color='white' size={13} />
												)}
											</FlexCenter>
										</MessageFooter>
									</MessageWrapper>
								</MessageContainer>
							)
						})}

					{!ticketsLoading && !allTickets?.data?.length && (
						<div className={'p-5'}>
							<NoDataWrapper top='80px'>
								<img alt=' ' src={require('../assets/images/noData.png')} />
							</NoDataWrapper>
						</div>
					)}

					{allPages ? (
						<PaginationContainer bottom='-60px'>
							<Pagination
								activePage={activePage}
								itemsCountPerPage={10}
								totalItemsCount={allPages}
								pageRangeDisplayed={3}
								onChange={onPageChange}
								itemClass={theme === 'light' ? 'd-page-item' : 'page-item'}
								linkClass={theme === 'light' ? 'd-page-link' : 'page-link'}
							/>
						</PaginationContainer>
					) : null}
				</TicketsContainer>

				<TextFieldContainer>
					<TextField
						placeholder={lang === 'en' ? 'Write your message here...' : 'پیام خود را بنویسید...'}
						onChange={onTextFieldChange}
						value={newMessage}
					/>
					<SendBtn onClick={createTicket}>
						{ticketCreating ? <ClipLoader size={24} color='#0d1726' /> : <Text tid='send' />}
					</SendBtn>
				</TextFieldContainer>
			</TicketBody>

			{ticketsLoading && (
				<SpinnerContainer>
					<ClipLoader size={42} color='#4f31c5' />
				</SpinnerContainer>
			)}
		</CardLayout>
	)
}

export default MyTickets
