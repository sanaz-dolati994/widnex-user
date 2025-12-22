import { useEffect, useRef, useState } from 'react'
import Card from '../components/common/Card'
import ModalLayout from '../components/layouts/ModalLayout'
import MobileModal from '../components/modals/MobileModal'
import Text from '../core/utils/Text'
import { Heading } from '../styles/newStyles/Dashboard.styled'
import { useWindowSize } from '../core/hooks/useWindowSize'
import AddContactModal from '../components/modals/AddContactModal'
import {
	useCreateContactMutation,
	useDeleteContactMutation,
	useGetContactsList,
} from '../core/services/react-query/useContact'
import { ClipLoader } from 'react-spinners'
import { getMainTheme } from '../core/utils/theme'
import { ReactComponent as NotFound } from './accounts/assets/not-found.svg'
import { useQueryContext } from '../core/contexts/query'
import TruncateEnd from '../components/common/TruncateEnd'
import { BiCopy } from 'react-icons/bi'
import { TrashIcon } from '../components/common/icons'
import useClickOutside from '../core/hooks/useClickOutside'
import { ItemRow } from '../styles/newStyles/MobileModal.styled'
import { PaginationContainer } from '../styles/CommonStyles'
import Pagination from 'react-js-pagination'
import { useMainContext } from '../core/contexts/main'

export default function UserContacts() {
	const { width } = useWindowSize()
	const {
		main: { theme },
	} = useMainContext()
	const { setToast } = useQueryContext()

	const onCopyClipboard = (value) => {
		navigator.clipboard.writeText(value)
		setToast({
			show: true,
			message: 'copy-success',
		})
	}

	const [showModal, setShowModal] = useState(false)
	const [contactDeletingId, setContactDeletingId] = useState(null)
	const [activePage, setActivePage] = useState(1)
	const [allPages, setAllPages] = useState(null)

	const closeModal = () => setShowModal(false)
	const openModal = () => setShowModal(true)

	const { data, isLoading: contactsLoading, refetch } = useGetContactsList(activePage)
	const contacts = data?.data
	const meta = data?.meta
	const { mutate: createContact, isLoading: creatingContact } = useCreateContactMutation(closeModal)
	const { mutate: deleteContact, isLoading: deletingContact } = useDeleteContactMutation()

	const onPageChange = (page) => {
		setActivePage(page)
	}

	useEffect(() => {
		if (contacts && (allPages !== meta.total || !allPages)) {
			setAllPages(meta.total)
		}
	}, [contacts])

	useEffect(refetch, [activePage])

	const handleDeleteContact = (id) => {
		setContactDeletingId(id)
		deleteContact(id)
	}

	return (
		<>
			<Card className='col-span-3 lg:h-full lg:overflow-y-auto lg:overflow-x-hidden relative'>
				<Heading className='flex-row lg:gap-x-10 items-center text-sm lg:border-b border-borderPrimary dark:border-card-border p-5 lg:pb-4'>
					<h2 className='text-base font-semibold'>
						<Text tid='contacts' />
					</h2>

					<button
						type='button'
						className={
							'bg-gray-secondary dark:bg-white/10 text-cBlue dark:hover:bg-cBlue dark:hover:text-white transition-colors  text-sm rounded-full px-6 py-2'
						}
						onClick={openModal}
					>
						<Text tid='add-contact' />
					</button>
				</Heading>


				{!contactsLoading ? (
					contacts.length ? (
						<div className={'flex flex-col gap-y-4 mt-5 pb-16'}>
							{contacts.map((contact, idx) => {
								return (
									<div
										className={
											'w-full rounded-lg border border-borderPrimary dark:border-card-border flex flex-col gap-3 px-4 py-2'
										}
										key={contact._id}
									>
										{width > 1024 ? (
											<div className='flex w-full h-full justify-between items-center'>
												<div className='flex flex-col gap-y-1 w-[20%]'>
													<p className='text-pcolor-light text-sm'>
														<Text tid='firstName' />:
													</p>
													<p className='text-sm font-semibold'>
														{contact.contact.firstName || '--'}
													</p>
												</div>

												<div className='flex flex-col gap-y-1 w-[20%]'>
													<p className='text-pcolor-light text-sm'>
														<Text tid='lastName' />:
													</p>
													<p className='text-sm font-semibold'>
														{contact.contact.lastName || '--'}
													</p>
												</div>

												<div className='flex flex-col gap-y-1 w-[20%]'>
													<p className='text-pcolor-light text-sm'>
														<Text tid='tag' />:
													</p>
													<p className='text-sm font-semibold'>{contact.note || '--'}</p>
												</div>

												<div className='flex flex-col gap-y-1 w-[25%]'>
													<p className='text-pcolor-light text-sm'>
														<Text tid='contactId' />:
													</p>
													<div
														className='text-sm flex items-center gap-x-1 cursor-pointer'
														onClick={onCopyClipboard.bind(null, contact.contactId)}
													>
														<BiCopy color='#0773F1' size={18} />
														<TruncateEnd text={contact.contactId} dir='ltr' />
													</div>
												</div>

												<div className='w-[15%]'>
													<Button
														textClassName={
															'text-sm text-pcolor-light group-hover:text-red-400 transition-colors'
														}
														btnWrapperClassName='bg-transparent border border-borderPrimary hover:border-red-400 dark:border-red-400 group'
														onClick={handleDeleteContact.bind(null, contact._id)}
														tid={'delete-contact'}
														loading={deletingContact && contactDeletingId === contact._id}
														loaderColor='rgb(248, 113, 113)'
														Icon={<TrashIcon size={18} />}
														twoStep
													/>
												</div>
											</div>
										) : (
											<div className='w-full h-full py-2'>
												<ItemRow>
													<p className='text-pcolor-light text-xs'>
														<Text tid='firstName' />:
													</p>
													<p className='text-sm font-semibold'>
														{contact.contact.firstName || '--'}
													</p>
												</ItemRow>

												<ItemRow>
													<p className='text-pcolor-light text-xs'>
														<Text tid='lastName' />:
													</p>
													<p className='text-sm font-semibold'>
														{contact.contact.lastName || '--'}
													</p>
												</ItemRow>

												<ItemRow className='mb-4'>
													<p className='text-pcolor-light text-xs'>
														<Text tid='contactId' />:
													</p>
													<p
														className='text-sm flex items-center gap-x-1 cursor-pointer'
														onClick={onCopyClipboard.bind(null, contact.contactId)}
													>
														<BiCopy color='#0773F1' size={18} />
														<TruncateEnd text={contact.contactId} dir='ltr' />
													</p>
												</ItemRow>

												<Button
													textClassName={'text-xs text-red-400'}
													btnWrapperClassName='bg-transparent border border-red-400'
													onClick={handleDeleteContact.bind(null, contact._id)}
													tid={'delete-contact'}
													loading={deletingContact && contactDeletingId === contact._id}
													loaderColor='rgb(248, 113, 113)'
													twoStep
												/>
											</div>
										)}
									</div>
								)
							})}
						</div>
					) : (
						<div className={'w-full min-h-[260px] flex flex-col gap-2 items-center justify-center'}>
							<NotFound width={244} height={200} />
							<Text tid={'no-contact-added'} className={'lg:text-sm text-xs text-secondary'} />
						</div>
					)
				) : (
					<div className={'w-full min-h-[260px] flex items-center justify-center'}>
						<ClipLoader size={32} color={getMainTheme().mainOrange} />
					</div>
				)}

				{allPages && !contactsLoading ? (
					<PaginationContainer>
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
			</Card>

			{width > 1024 ? (
				<ModalLayout width={'480px'} open={showModal} onClose={closeModal}>
					<AddContactModal
						onClose={closeModal}
						onSubmit={createContact}
						submitting={creatingContact}
					/>
				</ModalLayout>
			) : (
				<MobileModal isOpen={showModal} onClose={closeModal}>
					<AddContactModal
						onClose={closeModal}
						onSubmit={createContact}
						submitting={creatingContact}
					/>
				</MobileModal>
			)}
		</>
	)
}

const Button = ({
	valid,
	onClick,
	loading,
	loaderColor = 'white',
	tid,
	Icon,
	className = '',
	textClassName = '',
	btnWrapperClassName = '',
	twoStep = false,
}) => {
	const ref = useRef()
	const [modal, setModal] = useState(false)
	useClickOutside(ref, () => setModal(false))
	const _onClick = () => {
		if (twoStep) setModal(true)
		else onClick()
	}

	const onSubmit = () => {
		onClick()
		setModal(false)
	}

	return (
		<div className={'relative ' + className} ref={ref}>
			<div
				className={`rounded-lg w-full h-full min-h-[36px] flex items-center justify-center mx-auto shadow-md
                         ${valid ? 'bg-cBlue text-white' : ''
					} cursor-pointer transition ${btnWrapperClassName}`}
				onClick={_onClick}
			>
				{loading ? (
					<ClipLoader size={24} color={loaderColor} />
				) : (
					<div className='flex items-center gap-x-2'>
						{!!Icon && Icon}
						<Text tid={tid} className={textClassName} />
					</div>
				)}
			</div>
			{twoStep && modal ? (
				<div
					className={
						'absolute left-[50%] z-[1000] top-[110%] bg-white dark:bg-primaryBg -translate-x-1/3 lg:-translate-x-1/2 rounded border-[1px] border-opacity-30 py-2 px-3'
					}
				>
					<div className={'flex flex-col gap-3 text-[0.7rem] w-[164px]'}>
						<Text tid={'are-you-sure'} />
						<div className={'grid grid-cols-2 gap-2'}>
							<Button tid={'submit'} onClick={onSubmit} valid />
							<Button tid={'cancel'} onClick={() => setModal(false)} />
						</div>
					</div>
				</div>
			) : null}
		</div>
	)
}
