import Text from '../../../core/utils/Text'
import { ClipLoader } from 'react-spinners'
import { getMainTheme } from '../../../core/utils/theme'
import { ReactComponent as NotFound } from '../assets/not-found.svg'
import BankCard from '../../../packages/bank-service/NewBankCard'
import getBankInfo from '../../../packages/bank-service/Bank'
import { TransactionStatus } from '../../../styles/TransactionHistoryStyles'
import { useDeleteAccountAndCard } from '../../../core/hooks/useDeleteAccountAndCard'
import TwoFactorModal from '../../../components/modals/TwoFactorModal'
import ModalLayout from '../../../components/layouts/ModalLayout'
import AddBankAccountModal from './AddBankAccountModal'
import { HAS_DEPOSIT_WITH_ID } from '../../../core/constants/urls'
import Button from '../utils/Button'
import { useBankAccounts } from '../utils/hooks'
import { memo } from 'react'
import { FaPlus } from 'react-icons/fa'
import { TrashIcon } from '../../../components/common/icons'
import { useMainContext } from '../../../core/contexts/main'
import MobileModal from '../../../components/modals/MobileModal'
import { useWindowSize } from '../../../core/hooks/useWindowSize'

const BankAccounts = memo(() => {
	const {
		main: { theme },
	} = useMainContext()

	const { width } = useWindowSize()

	const {
		modal,
		openModal,
		closeModal,
		banks,
		onDepositWithIdAction,
		loadingAddToDepositId,
		profile,
		loadingDepositWithId,
	} = useBankAccounts()

	const { loading, onCheckAuth, authModal, onSubmitTwoFactorModal, closeAuthModal, accountCauses } =
		useDeleteAccountAndCard(1)

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
					+<Text tid={'add-bank-account'} className={'lg:text-sm text-xs'} />
				</button>
			</div>
			{!!profile && !loadingDepositWithId ? (
				banks.length ? (
					<div className={'grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-10 mt-5'}>
						{banks.map((item, idx) => {
							const bankInfo = getBankInfo(item.cardNo)
							return (
								<div>
									<div className={'flex flex-col gap-y-3'}>
										<BankCard bankAccount={item} bankInfo={bankInfo} newBank />

										<div className={'flex items-center gap-x-4'}>
											{HAS_DEPOSIT_WITH_ID && item.status === 'VERIFIED' ? (
												<Button
													className={'w-3/5 h-[32px]'}
													textClassName={'text-xs text-cBlue dark:text-white'}
													btnWrapperClassName='bg-gray-light dark:bg-cBlue border border-borderPrimary dark:border-transparent'
													onClick={() => onDepositWithIdAction(item, idx)}
													tid={item.hasId ? 'remove-from-deposit-id' : 'add-to-deposit-id'}
													loading={loadingAddToDepositId === idx}
													Icon={<FaPlus size={10} color={theme === 'dark' ? '#fff' : '#0773F1'} />}
												/>
											) : (
												<div className='w-3/5' />
											)}
											<Button
												className={'w-2/5 h-[32px]'}
												textClassName={
													'text-xs text-pcolor-light group-hover:text-red-400 transition-colors'
												}
												btnWrapperClassName='bg-transparent border border-borderPrimary hover:border-red-400 dark:border-red-400 group'
												onClick={() => onCheckAuth(item, idx, 'bank')}
												tid={'delete-bank-account'}
												loading={loading === idx}
												twoStep
												Icon={<TrashIcon size={18} />}
											/>
										</div>
									</div>
								</div>
							)
						})}
					</div>
				) : (
					<div className={'w-full min-h-[260px] flex flex-col gap-2 items-center justify-center'}>
						<NotFound width={244} height={200} />
						<Text tid={'no-bank-account-added'} className={'lg:text-sm text-xs text-secondary'} />
					</div>
				)
			) : (
				<div className={'w-full min-h-[260px] flex items-center justify-center'}>
					<ClipLoader size={32} color={getMainTheme().mainOrange} />
				</div>
			)}
			<div className='lg:hidden mt-5 pt-5 border-t border-borderPrimary dark:border-card-border'>
				<button
					type='button'
					className={'bg-cBlue text-white text-sm rounded-full px-6 py-2 w-full'}
					onClick={openModal}
				>
					+ <Text tid={'add-bank-account'} className={'lg:text-sm text-xs'} />
				</button>
			</div>

			{/* delete two factor */}
			<TwoFactorModal
				open={authModal.con}
				onSubmit={onSubmitTwoFactorModal}
				onClose={closeAuthModal}
				cause={accountCauses[0]}
			/>

			{width > 1024 ? (
				<ModalLayout width={'480px'} open={modal} onClose={closeModal}>
					<AddBankAccountModal onClose={closeModal} />
				</ModalLayout>
			) : (
				<MobileModal isOpen={modal} onClose={closeModal}>
					<AddBankAccountModal onClose={closeModal} />
				</MobileModal>
			)}
		</>
	)
})

export default BankAccounts
