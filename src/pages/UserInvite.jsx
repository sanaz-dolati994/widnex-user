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
import { useQueryContext } from "../core/contexts/query";
import DeleteModal from "../components/modals/DeleteModal";
import { HOME } from '../core/constants/urls'


const UserInvite = () => {
	const {
		main: { lang, theme },
	} = useMainContext()
	const { setToast } = useQueryContext()

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

	const headers = [
		{ title: 'invite-code' },
		{ title: 'actorShare' },
		{ title: 'objectShare' },
		{ title: 'maxUse' },
		{ title: 'used' },
		{ title: 'createdAt' },
	]

	const onCopyClipboard = (code, type) => {
		const copyText =
			type === 'code'
				? code
				: HOME + `user/register-signin?tab=0&code=${code}`
		navigator.clipboard.writeText(copyText)
		setToast({
			show: true,
			message: 'copy-success'
		})
	}


	return (
		<>
			<MainLayout>
				<img alt={'invite'} src={lang === 'en' ? InviteBannerImageEN : InviteBannerImage} />

				<InvitedUsersTree />

				<CardLayout className={'p-5'}>
					<AnimatePresence exitBeforeEnter>
						<div style={{ minHeight: '400px' }}>
							<Flex align={'center'} justify={'between'} className={'mb-3 gap-5'}>
								<h6>
									<Text tid={'already-created-invite-codes'} />
								</h6>

								<RoundedIconButtonWithColor
									onClick={() => setShowCreateModal(true)}
									color={'input'}
								>
									<Text tid={'create-invite-code'} />
								</RoundedIconButtonWithColor>
							</Flex>


							<TableWrapper variants={variants} initial='out' animate='in' exit='out'>
								<div className={'overflow-x-auto w-100 bg-red-500'}>
									<table className={'table table-auto w-full'}>
										{!!headers?.length && (
											<thead>
												<HeaderRow>
													{headers.map((header) => (
														<HeaderColumn key={header.title}>
															<Text tid={header.title} />
														</HeaderColumn>
													))}

													<HeaderColumn />
												</HeaderRow>
											</thead>
										)}
										{!!inviteCodes?.data?.length && (
											<tbody>
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
														<Row key={index}>
															<Column>
																<TextWithColor color={'mainGreen'}>{code}</TextWithColor>
															</Column>
															<Column>
																<TextWithColor color={'mainOrange'}>{actorShare}</TextWithColor>
															</Column>
															<Column>
																<TextWithColor color={'mainOrange'}>{objectShare}</TextWithColor>
															</Column>
															<Column>{maxUse}</Column>
															<Column>{used}</Column>
															<Column>
																{formatDate(createdAt, 'time', lang === 'en' ? 'en-US' : 'fa-IR')}
															</Column>
															<Column>
																<Flex
																	className={
																		'gap-2'
																	}>
																	<button
																		onClick={() =>
																			onCopyClipboard(
																				code,
																				'link'
																			)
																		}
																		className='text-xs hover:bg-light-hover dark:hover:bg-dark-hover
																		text-blue-500 transition-colors p-1 rounded-md flex gap-x-1 items-center'>
																		<FaLink />
																		<Text tid='link' />
																	</button>

																	<button
																		onClick={() =>
																			onCopyClipboard(
																				code,
																				'code'
																			)
																		}
																		className='text-xs hover:bg-light-hover dark:hover:bg-dark-hover
																		text-green-600 transition-colors p-1 rounded-md flex gap-x-1 items-center'>
																		<FaCopy />
																		<Text tid='code' />
																	</button>

																	<button
																		onClick={() =>
																			setDeleteModal(
																				{
																					id: _id,
																					open: true,
																				}
																			)
																		}
																		className='text-xs hover:bg-light-hover dark:hover:bg-dark-hover
																		text-red-500 transition-colors p-1 rounded-md flex gap-x-1 items-center'>
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


							<AuthLoading loading={inviteCodesLoading} />

							{!inviteCodes?.data?.length && !inviteCodesLoading && (
								<NoDataWrapper top='200px'>
									<img alt=' ' src={require('../assets/images/noData.png')} />
								</NoDataWrapper>
							)}

							{allPages && !inviteCodesLoading ? (
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
						</div>
					</AnimatePresence>
				</CardLayout>

				{!!showCreateModal && (
					<ModalLayout
						width='650px'
						open={showCreateModal}
						onClose={() => setShowCreateModal(false)}
					>
						<CreateInviteCodeModal setShowCreateModal={setShowCreateModal} />
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
			</MainLayout>
		</>
	)
}

export default UserInvite
