import { useEffect, useState } from 'react'
import { useMainContext } from '../../core/contexts/main'
import { useWindowSize } from '../../core/hooks/useWindowSize'
import { useGetContactsList } from '../../core/services/react-query/useContact'
import Text from '../../core/utils/Text'
import { ItemColumn } from '../../styles/newStyles/MobileModal.styled'
import { Link } from 'react-router-dom'
import { PaginationContainer } from '../../styles/CommonStyles'
import Pagination from 'react-js-pagination'
import { getMainTheme } from '../../core/utils/theme'
import { ClipLoader } from 'react-spinners'
import { ReactComponent as NotFound } from '../../pages/accounts/assets/not-found.svg'

export default function ContactsList({ setReceiverId }) {
	const { width } = useWindowSize()
	const {
		main: { theme },
	} = useMainContext()

	const [activePage, setActivePage] = useState(1)
	const [allPages, setAllPages] = useState(null)
	const { data, isLoading: contactsLoading, refetch } = useGetContactsList(activePage)
	const contacts = data?.data
	const meta = data?.meta
	useEffect(() => {
		if (contacts && (allPages !== meta.total || !allPages)) {
			setAllPages(meta.total)
		}
	}, [contacts])

	useEffect(refetch, [activePage])

	const onPageChange = (page) => {
		setActivePage(page)
	}

	return (
		<>
			{!contactsLoading ? (
				contacts.length ? (
					<div className={'flex flex-col gap-y-4 pb-16 h-[350px] overflow-y-auto'}>
						{contacts.map((contact, idx) => {
							const fullname = `${contact.contact.firstName ?? '--'} ${
								contact.contact.lastName ?? '--'
							}`

							return (
								<div
									className={
										'w-full rounded-lg border border-borderPrimary dark:border-card-border flex flex-col gap-3 px-4 py-2 cursor-pointer hover:bg-light-hover dark:hover:bg-dark-hover transition-colors'
									}
									onClick={setReceiverId.bind(null, contact.contactId)}
									key={contact._id}
								>
									{width > 1024 ? (
										<div className='flex w-full h-full justify-between items-center'>
											<div className='flex flex-col gap-y-1 w-[50%]'>
												<p className='text-pcolor-light text-sm'>
													<Text tid='fullname' />:
												</p>
												<p className='text-sm font-semibold'>{fullname}</p>
											</div>

											<div className='flex flex-col gap-y-1 w-[40%]'>
												<p className='text-pcolor-light text-sm'>
													<Text tid='tag' />:
												</p>
												<p className='text-sm font-semibold'>{contact.note || '--'}</p>
											</div>
										</div>
									) : (
										<div className='w-full h-full py-2 flex items-center justify-between'>
											<ItemColumn>
												<p className='text-pcolor-light text-xs'>
													<Text tid='fullname' />:
												</p>
												<p className='text-xs font-medium'>{fullname}</p>
											</ItemColumn>

											<ItemColumn>
												<p className='text-pcolor-light text-xs'>
													<Text tid='tag' />:
												</p>
												<p className='text-xs font-medium'>{contact.note || '--'}</p>
											</ItemColumn>
										</div>
									)}
								</div>
							)
						})}
					</div>
				) : (
					<div className={'w-full min-h-[260px] flex flex-col gap-2 items-center justify-center'}>
						<NotFound width={144} height={100} />
						<Text tid={'no-contact-added'} className={'lg:text-sm text-xs text-secondary'} />
						<Link to='/profile/contacts' className='text-sm text-cBlue'>
							برو به مخاطبین
						</Link>
					</div>
				)
			) : (
				<div className={'w-full min-h-[260px] flex items-center justify-center'}>
					<ClipLoader size={32} color={getMainTheme().mainOrange} />
				</div>
			)}

			{allPages && !contactsLoading && contacts.length > 0 ? (
				<PaginationContainer bottom='0'>
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
		</>
	)
}
