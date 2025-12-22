import { useState } from 'react'
import { useMainContext } from '../../../core/contexts/main'
import { useQueryContext } from '../../../core/contexts/query'
import useMyInvites from '../../../core/hooks/useMyInvites'
import { useWindowSize } from '../../../core/hooks/useWindowSize'
import Text from '../../../core/utils/Text'
import { ItemData, ItemRow } from '../../../styles/newStyles/MobileModal.styled'
import { NoDataWrapper } from '../../../styles/TableStyle'
import AuthLoading from '../../authentication/AuthLoading'
import CreateInviteCodeModal from '../../modals/CreateInviteCodeModal'
import DeleteModal from '../../modals/DeleteModal'
import MobileModal from '../../modals/MobileModal'
import { HOME } from '../../../core/constants/urls'
import { HEADERS } from '../../../pages/NewUserInvite'
import { FaCopy, FaLink, FaTrashAlt } from 'react-icons/fa'
import { formatDate } from '../../../core/utils/common'
import { Heading } from '../../../styles/newStyles/Dashboard.styled'
import Card from '../../common/Card'
import { PaginationContainer } from '../../../styles/CommonStyles'
import Pagination from 'react-js-pagination'

export default function RNewUserInvite() {
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

	const renderedItems = inviteCodes?.data.map((item, index, array) => {
		const { _id, actorShare, objectShare, code, maxUse, used, createdAt } = item

		return (
			<div key={_id} className='border border-borderPrimary rounded-xl py-4 px-6 text-sm mb-5'>
				<ItemRow className='border-b border-borderPrimary'>
					<ItemData className='text-pcolor-light'>
						<Text tid={HEADERS[0].title} />
					</ItemData>
					<p>{code}</p>
				</ItemRow>
				<ItemRow className='border-b border-borderPrimary'>
					<ItemData className='text-pcolor-light'>
						<Text tid={HEADERS[1].title} />
					</ItemData>
					<p>{actorShare}</p>
				</ItemRow>
				<ItemRow className='border-b border-borderPrimary'>
					<ItemData className='text-pcolor-light'>
						<Text tid={HEADERS[2].title} />
					</ItemData>
					<p>{objectShare}</p>
				</ItemRow>
				<ItemRow className='border-b border-borderPrimary'>
					<ItemData className='text-pcolor-light'>
						<Text tid={HEADERS[3].title} />
					</ItemData>
					<p>{maxUse}</p>
				</ItemRow>
				<ItemRow className='border-b border-borderPrimary'>
					<ItemData className='text-pcolor-light'>
						<Text tid={HEADERS[4].title} />
					</ItemData>
					<p>{used}</p>
				</ItemRow>
				<ItemRow className=''>
					<ItemData className='text-pcolor-light'>
						<Text tid={HEADERS[5].title} />
					</ItemData>
					<p>{formatDate(createdAt, 'time', lang === 'en' ? 'en-US' : 'fa-IR')}</p>
				</ItemRow>

				<div className='mt-5 grid grid-cols-2 gap-4'>
					<button
						onClick={() => onCopyClipboard(code, 'link')}
						className='text-xs bg-gray-light rounded-lg text-cBlue	transition-colors p-1 h-[38px] flex justify-center gap-x-2 items-center'
					>
						<FaLink />
						<Text tid='copy-link' />
					</button>

					<button
						onClick={() => onCopyClipboard(code, 'code')}
						className='text-xs bg-gray-light rounded-lg text-cBlue transition-colors p-1 h-[38px] flex justify-center gap-x-2 items-center'
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
						className='text-xs bg-gray-light rounded-lg text-red-500 transition-colors p-1 h-[38px] flex justify-center gap-x-2 items-center'
					>
						<FaTrashAlt />
						<Text tid='delete' />
					</button>
				</div>
			</div>
		)
	})

	return (
		<div className='col-span-4'>
			<Card padding={'p-5'} className='relative'>
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
				<div className='mb-20 relative pb-10'>
					{inviteCodesLoading ? (
						<AuthLoading loading={inviteCodesLoading} />
					) : !!inviteCodes?.data?.length ? (
						<div className=''>{renderedItems}</div>
					) : (
						!inviteCodes?.data?.length && (
							<NoDataWrapper top='0'>
								<img alt=' ' src={require('../../../assets/images/noData.png')} />
							</NoDataWrapper>
						)
					)}

					{allPages && !inviteCodesLoading && !!inviteCodes?.data?.length ? (
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

				<MobileModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}>
					<CreateInviteCodeModal
						setShowCreateModal={setShowCreateModal}
						onClose={() => setShowCreateModal(false)}
					/>
				</MobileModal>
				<MobileModal
					isOpen={deleteModal.open}
					onClose={() => setDeleteModal({ id: null, open: false })}
				>
					<DeleteModal onModalBtnClicked={onModalClicked} title='delete-invite-code' />
				</MobileModal>
			</Card>
		</div>
	)
}
