import MainLayout from '../components/layouts/MainLayout'
import CardLayout from '../components/layouts/CardLayout'
import { AnimatePresence } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import useMyInvites from '../core/hooks/useMyInvites'
import { Flex, PaginationContainer } from '../styles/CommonStyles'
import Pagination from 'react-js-pagination'
import AuthLoading from '../components/authentication/AuthLoading'
import { Column, HeaderColumn, HeaderRow, NoDataWrapper, Row } from '../styles/TableStyle'
import { TableWrapper } from '../styles/OrdersStyle'
import { formatDate, variants } from '../core/utils/common'
import Text from '../core/utils/Text'
import { useMainContext } from '../core/contexts/main'
import { RoundedIconButtonWithColor, TextWithColor } from '../styles/InvitesStyle'
import { FaCopy, FaLink, FaTrashAlt } from 'react-icons/fa'
import ModalLayout from '../components/layouts/ModalLayout'
import CreateInviteCodeModal from '../components/modals/CreateInviteCodeModal'
import { InvitedUsersTree } from '../components/tree'
import InviteBannerImage from '../assets/images/invite-banner.jpg'
import InviteBannerImageEN from '../assets/images/invite-banner-en.jpg'
import { useQueryContext } from '../core/contexts/query'
import DeleteModal from '../components/modals/DeleteModal'
import { HOME } from '../core/constants/urls'
import Card from '../components/common/Card'
import { Heading } from '../styles/newStyles/Dashboard.styled'
import { ItemData, ItemRow } from '../styles/newStyles/MobileModal.styled'
import { useWindowSize } from '../core/hooks/useWindowSize'
import styled from 'styled-components'
import MobileModal from '../components/modals/MobileModal'
import RNewUserInvite from '../components/responsive/user-invite/RNewUserInvite'

export default function NewUserInvite() {
	const {
		main: { lang, theme },
	} = useMainContext()
	const { setToast } = useQueryContext()
	const { width } = useWindowSize()

	const {
		inviteCodes,
		inviteCodesLoading,
		activePage,
		allPages,
		onPageChange,
		deleteModal,
		onModalClicked,
		setDeleteModal,
	} = useMyInvites()

	const [showCreateModal, setShowCreateModal] = useState(false)

	const onCopyClipboard = (code, type) => {
		const copyText = type === 'code' ? code : HOME + `user/register-signin?tab=0&code=${code}`
		navigator.clipboard.writeText(copyText)
		setToast({
			show: true,
			message: 'copy-success',
		})
	}

	return (
		<>
			<Card padding={'p-5'} className='relative col-span-3 lg:h-full lg:overflow-y-hidden'>
				<h2 className='font-semibold mb-2'>
					<Text tid='invite-friends' />
				</h2>
				<p className='text-pcolor-light text-sm'>
					<Text tid='invite-page-description' />
				</p>

				{/* <InvitedUsersTree /> */}
				<AnimatePresence mode='wait'>
					<div style={{ height: 'calc(100vh - 17rem)', position: 'relative' }}>
						{width > 1024 ? (
							<>
								<Heading className='my-10'>
									<h6>
										<Text tid={'your-invite-codes'} />
									</h6>

									<button
										className='px-3 py-2 text-xs bg-cBlue text-white rounded-lg transition-colors hover:bg-opacity-90'
										onClick={() => setShowCreateModal(true)}
									>
										<Text tid={'create-invite-code'} />
									</button>
								</Heading>
								<TableWrapper variants={variants} initial='out' animate='in' exit='out'>
									<div className={'h-[calc(100vh-26rem)] relative lg:overflow-x-auto lg:overflow-y-auto w-100'}>
										<table className={'table table-auto w-full '}>
											{!!HEADERS?.length && (
												<thead className=''>
													<HeaderRow>
														{HEADERS.map((header) => (
															<HeaderColumn key={header.title}>
																<Text tid={header.title} className='text-pcolor-light text-xs' />
															</HeaderColumn>
														))}

														<HeaderColumn />
													</HeaderRow>
												</thead>
											)}
											{!!inviteCodes?.data?.length && (
												<tbody className=' '>
													{inviteCodes.data.map((item, index) => {
														const {
															_id,
															userId,
															actorShare,
															objectShare,
															code,
															maxUse,
															used,
															createdAt,
															isDelete,
														} = item

														return (
															<Row key={index} className='text-xs border-b border-gray-600 py-2 rounded-lg'>
																<Column>{code}</Column>
																{/* <Column>{code}</Column> */}
																<Column>{actorShare}</Column>
																<Column>{objectShare}</Column>
																<Column>{maxUse}</Column>
																<Column>{used}</Column>
																<Column>
																	{formatDate(createdAt, 'time', lang === 'en' ? 'en-US' : 'fa-IR')}
																</Column>
																<Column>
																	<Flex className={'gap-2'}>
																		<button
																			onClick={() => onCopyClipboard(code, 'link')}
																			className='text-xs hover:bg-light-hover dark:hover:bg-dark-hover
																	text-cBlue	transition-colors p-1 rounded-md flex gap-x-1 items-center'
																		>
																			<FaLink />
																			<Text tid='copy-link' />
																		</button>

																		<button
																			onClick={() => onCopyClipboard(code, 'code')}
																			className='text-xs hover:bg-light-hover dark:hover:bg-dark-hover
																	text-cBlue transition-colors p-1 rounded-md flex gap-x-1 items-center'
																		>
																			<FaCopy />
																			<Text tid='copy-code' />
																		</button>

																		<button
																			onClick={() =>
																				setDeleteModal({
																					id: _id,
																					open: true,
																				})
																			}
																			className='text-xs hover:bg-light-hover dark:hover:bg-dark-hover
																		text-red-500 transition-colors p-1 rounded-md flex gap-x-1 items-center'
																		>
																			<FaTrashAlt />
																			<Text tid='delete' />
																		</button>
																	</Flex>
																</Column>
															</Row>
														)
													})}
												</tbody>
											)}
										</table>
									</div>
								</TableWrapper>
							</>
						) : (
							<RNewUserInvite
								inviteCodes={inviteCodes}
								inviteCodesLoading={inviteCodesLoading}
								showCreateModal={showCreateModal}
								setShowCreateModal={setShowCreateModal}
								onModalClicked={onModalClicked}
								deleteModal={deleteModal}
								setDeleteModal={setDeleteModal}
								onCopyClipboard={onCopyClipboard}
								lang={lang}
							/>
						)}

						<AuthLoading loading={inviteCodesLoading} />

						{!inviteCodes?.data?.length && !inviteCodesLoading && (
							<NoDataWrapper top='200px'>
								<img alt=' ' src={require('../assets/images/noData.png')} />
							</NoDataWrapper>
						)}
						{allPages && !inviteCodesLoading ? (
							<PaginationContainer bottom='5px'>
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
					</div>
				</AnimatePresence>
			</Card>

			{!!showCreateModal && (
				<ModalLayout width='400px' open={showCreateModal} onClose={() => setShowCreateModal(false)}>
					<CreateInviteCodeModal
						setShowCreateModal={setShowCreateModal}
						onClose={() => setShowCreateModal(false)}
					/>
				</ModalLayout>
			)}

			{deleteModal?.open && (
				<ModalLayout
					width='450px'
					open={deleteModal.open}
					onClose={() => setDeleteModal({ id: null, open: false })}
				>
					<DeleteModal onModalBtnClicked={onModalClicked} title='delete-invite-code' />
				</ModalLayout>
			)}
		</>
	)
}

export const HEADERS = [
	{ title: 'invite-code' },
	{ title: 'actorShare' },
	{ title: 'objectShare' },
	{ title: 'maxUse' },
	{ title: 'used' },
	{ title: 'createdAt' },
]
