import Text from '../../../core/utils/Text'
import React, { memo } from 'react'
import { ClipLoader } from 'react-spinners'
import { getMainTheme } from '../../../core/utils/theme'
import { ReactComponent as NotFound } from '../assets/not-found.svg'
import { useWalletAccounts } from '../utils/hooks'
import ModalLayout from '../../../components/layouts/ModalLayout'
import AddWalletAccountModal from './AddWalletAccountModal'
import Button from '../utils/Button'
import { useDeleteAccountAndCard } from '../../../core/hooks/useDeleteAccountAndCard'
import TwoFactorModal from '../../../components/modals/TwoFactorModal'
import { SOCKET_URL } from '../../../core/constants/urls'
import TruncateEnd from '../../../components/common/TruncateEnd'
import { BiCopy } from 'react-icons/bi'
import { useQueryContext } from '../../../core/contexts/query'
import { useWindowSize } from '../../../core/hooks/useWindowSize'
import { TrashIcon } from '../../../components/common/icons'
import MobileModal from '../../../components/modals/MobileModal'

const WalletAccounts = memo(() => {
	const { setToast } = useQueryContext()
	const { width } = useWindowSize()

	const { profile, modal, openModal, closeModal } = useWalletAccounts()

	const { loading, onCheckAuth, authModal, onSubmitTwoFactorModal, closeAuthModal, accountCauses } =
		useDeleteAccountAndCard(2)

	const onCopyClipboard = (value) => {
		navigator.clipboard.writeText(value)
		setToast({
			show: true,
			message: 'copy-success',
		})
	}

	return (
		<>
			<div className='hidden lg:flex items-center justify-end'>
				<button
					type='button'
					className={
						'bg-gray-secondary dark:bg-white/10 text-cBlue dark:hover:bg-cBlue dark:hover:text-white transition-colors  text-sm rounded-full px-6 py-2'
					}
					onClick={openModal}
				>
					+ <Text tid={'add-wallet-account'} className={'lg:text-sm text-xs'} />
				</button>
			</div>
			{!!profile ? (
				profile.wallets.length ? (
					<div className={'flex flex-col gap-y-4 mt-5'}>
						{profile.wallets.map((item, idx) => {
							return (
								<div
									className={
										'w-full rounded-lg border border-borderPrimary dark:border-card-border flex flex-col gap-3 px-4 py-2'
									}
								>
									{width > 1024 ? (
										<div className='flex w-full h-full justify-between items-center'>
											<div className='flex gap-x-4 w-[15%]'>
												<img
													src={SOCKET_URL + `assets/icon/${item.coin}.png`}
													alt=''
													className='w-9 h-9'
												/>
												<div className='flex flex-col gap-y-1'>
													<p className='text-pcolor-light text-xs'>
														<Text tid='name' />:
													</p>
													<p className='text-sm font-semibold'>{item.coin?.toUpperCase()}</p>
												</div>
											</div>

											<div className='flex flex-col gap-y-1 w-[15%]'>
												<p className='text-pcolor-light text-xs'>
													<Text tid='network' />:
												</p>
												<p className='text-sm font-semibold'>{item.network.toUpperCase()}</p>
											</div>

											<div className='flex flex-col gap-y-1 w-[30%]'>
												<p className='text-pcolor-light text-xs'>
													<Text tid='label' />:
												</p>
												<p className='text-sm font-semibold'>{item.label || '--'}</p>
											</div>

											<div className='flex flex-col gap-y-1 w-[25%]'>
												<p className='text-pcolor-light text-xs'>
													<Text tid='address' />:
												</p>
												<p
													className='text-sm flex items-center gap-x-1 cursor-pointer'
													onClick={onCopyClipboard.bind(null, item.address)}
												>
													<BiCopy color='#0773F1' size={18} />
													<TruncateEnd text={item.address} dir='ltr' />
												</p>
											</div>

											<div className='w-[15%]'>
												<Button
													textClassName={
														'text-xs text-pcolor-light group-hover:text-red-400 transition-colors'
													}
													btnWrapperClassName='bg-transparent border border-borderPrimary hover:border-red-400 dark:border-red-400 group'
													onClick={() => onCheckAuth(item, idx, 'wallet')}
													tid={'delete-wallet-account'}
													loading={loading === idx}
													Icon={<TrashIcon size={18} />}
													twoStep
												/>
											</div>
										</div>
									) : (
										<div className='w-full h-full py-2'>
											<div className='w-full flex justify-between items-center'>
												<div className='flex gap-x-4 w-2/3'>
													<img
														src={SOCKET_URL + `assets/icon/${item.coin}.png`}
														alt=''
														className='w-9 h-9'
													/>
													<div className='flex flex-col gap-y-1'>
														<p className='text-pcolor-light text-xs'>
															<Text tid='name' />:
														</p>
														<p className='text-sm font-semibold'>{item.coin?.toUpperCase()}</p>
													</div>
												</div>

												<div className='w-1/3'>
													<Button
														textClassName={'text-xs text-red-400'}
														btnWrapperClassName='bg-transparent border border-red-400'
														onClick={() => onCheckAuth(item, idx, 'wallet')}
														tid={'delete-wallet-account'}
														loading={loading === idx}
														twoStep
													/>
												</div>
											</div>

											<div className='flex items-center justify-between gap-x-2 mt-4'>
												<div className='flex flex-col gap-y-1 w-[15%]'>
													<p className='text-pcolor-light text-xs'>
														<Text tid='network' />:
													</p>
													<p className='text-sm font-semibold'>{item.network.toUpperCase()}</p>
												</div>

												<div className='flex flex-col gap-y-1 w-[50%]'>
													<p className='text-pcolor-light text-xs'>
														<Text tid='label' />:
													</p>
													<p className='text-sm font-semibold'>{item.label || '--'}</p>
												</div>

												<div className='flex flex-col gap-y-1 w-[35%]'>
													<p className='text-pcolor-light text-xs'>
														<Text tid='address' />:
													</p>
													<p
														className='text-sm flex items-center gap-x-1 cursor-pointer'
														onClick={onCopyClipboard.bind(null, item.address)}
													>
														<BiCopy color='#0773F1' size={18} />
														<TruncateEnd frontChars={8} text={item.address} dir='ltr' />
													</p>
												</div>
											</div>
										</div>
									)}
								</div>
							)
						})}
					</div>
				) : (
					<div className={'w-full min-h-[260px] flex flex-col gap-2 items-center justify-center'}>
						<NotFound width={244} height={200} />
						<Text tid={'no-wallet-account-added'} className={'lg:text-sm text-xs text-secondary'} />
					</div>
				)
			) : (
				<div className={'w-full min-h-[260px] flex items-center justify-center'}>
					<ClipLoader size={32} color={getMainTheme().active} />
				</div>
			)}

			<div className='lg:hidden mt-5 pt-5 border-t border-borderPrimary dark:border-card-border'>
				<button
					type='button'
					className={'bg-cBlue text-white text-sm rounded-full px-6 py-2 w-full'}
					onClick={openModal}
				>
					+ <Text tid={'add-wallet-account'} className={'lg:text-sm text-xs'} />
				</button>
			</div>

			{/* delete two factor */}
			<TwoFactorModal
				open={authModal.con}
				onSubmit={onSubmitTwoFactorModal}
				onClose={closeAuthModal}
				cause={accountCauses[1]}
			/>

			{width > 1024 ? (
				<ModalLayout width={'480px'} open={modal} onClose={closeModal}>
					<AddWalletAccountModal onClose={closeModal} />
				</ModalLayout>
			) : (
				<MobileModal isOpen={modal} onClose={closeModal}>
					<AddWalletAccountModal onClose={closeModal} />
				</MobileModal>
			)}
		</>
	)
})

export default WalletAccounts
