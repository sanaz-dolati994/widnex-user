import { useEffect, useMemo, useRef, useState } from 'react'
import {
	useCreateInvoiceMutation,
	useGetCoinsList,
	useMakeTransferMutation,
	useProfileQuery,
} from '../../core/services/react-query/useInternalTransfer'
import Text from '../../core/utils/Text'
import { Heading } from '../../styles/newStyles/Dashboard.styled'
import Card from '../common/Card'
import HintBox from '../common/HintBox'
import { ClipLoader, ScaleLoader } from 'react-spinners'
import { SOCKET_URL } from '../../core/constants/urls'
import { FaChevronDown } from 'react-icons/fa'
import useClickOutside from '../../core/hooks/useClickOutside'
import { useRunAfterUpdate } from '../../core/hooks/useRunAfterUpdate'
import { onInputValueChangeUtil } from '../../core/utils/useInputValueChange'
import { TbInfoCircle } from 'react-icons/tb'
import { deformatNumber, formatNumber, stringToNumber } from '../../core/utils/common'
import { UserIcon } from '../common/icons'
import { useMainContext } from '../../core/contexts/main'

import InternalTransferInvoice from './transfer-invoice'
import InternalTransferResult from './transfer-result'
import ModalLayout from '../layouts/ModalLayout'
import { Link } from 'react-router-dom'
import TransfersOverview from './transfers-overview'
import { useWindowSize } from '../../core/hooks/useWindowSize'
import MobileModal from '../modals/MobileModal'
import ContactsList from './contacts-list'

export default function InternalTransferSubpage() {
	const {
		main: { theme },
	} = useMainContext()
	const { width } = useWindowSize()

	const [selectedCoin, setSelectedCoin] = useState(null)
	const [showCoinsList, setShowCoinsList] = useState(false)
	const [amount, setAmount] = useState('')
	const [receiverId, setReceiverId] = useState('')
	const [note, setNote] = useState('')
	const [validation, setValidation] = useState({ errorField: '', errorText: '' })
	const [modal, setModal] = useState({ type: '', show: false, data: null })
	const [showContacts, setShowContacts] = useState(false)

	const { data: availableCoinsList, isLoading } = useGetCoinsList()

	const {
		mutate: createInvoice,
		isLoading: isCreatingInvoice,
		data: invoiceData,
		isSuccess: invoiceCreated,
	} = useCreateInvoiceMutation()

	useEffect(() => {
		invoiceCreated && setModal({ type: 'invoice', show: true, data: invoiceData.data.data })
	}, [invoiceCreated, invoiceData])

	const {
		mutate: makeTransfer,
		isLoading: isTransfering,
		data: transferredData,
		isSuccess: transferred,
	} = useMakeTransferMutation()

	useEffect(() => {
		transferred && setModal({ type: 'result', show: true, data: transferredData.data })
	}, [transferred, transferredData])

	const { data: profile } = useProfileQuery()
	const balance = useMemo(() => {
		return profile?.coins.find((x) => x.coin === selectedCoin?.currency)?.amount || 0
	}, [profile, selectedCoin])

	const coinsListRef = useRef()
	useClickOutside(coinsListRef, () => setShowCoinsList(false))

	const runAfterUpdate = useRunAfterUpdate()
	const onInputChange = (e) => {
		let v = e?.target?.value
		v = onInputValueChangeUtil(e, runAfterUpdate)
		setAmount(v)
	}

	useEffect(() => {
		setValidation({ errorField: '', errorText: '' })
		setAmount('')
		setReceiverId('')
		setNote('')
	}, [selectedCoin])

	const isTooman = selectedCoin && selectedCoin.currency === 'irt'

	const handleSubmit = () => {
		if (!selectedCoin) setValidation({ errorField: 'coin', errorText: 'select-an-option' })
		else if (!amount) setValidation({ errorField: 'amount', errorText: 'amount-is-required' })
		else if (
			deformatNumber(amount) > selectedCoin.maxAmount ||
			deformatNumber(amount) < selectedCoin.minAmount
		)
			setValidation({ errorField: 'amount', errorText: 'amount-range' })
		else if (
			(isTooman && deformatNumber(amount) > profile.balance) ||
			(!isTooman && deformatNumber(amount) > balance)
		)
			setValidation({ errorField: 'amount', errorText: 'amount-bigger-balance' })
		else if (!receiverId)
			setValidation({ errorField: 'receiverId', errorText: 'receiverId-is-required' })
		else if (!note.trim())
			setValidation({ errorField: 'note', errorText: 'transaction-description-is-required' })
		else {
			setValidation({ errorField: '', errorText: '' })

			const payloadAmount = parseFloat(stringToNumber(amount))
			createInvoice({
				toId: receiverId,
				currency: selectedCoin.currency,
				amount: payloadAmount,
				note,
			})
		}
	}

	return (
		<>
			<Card className='col-span-3 lg:overflow-y-auto'>
				<Heading className='text-sm lg:border-b border-borderPrimary dark:border-card-border py-5 lg:pb-4'>
					<h2 className='text-base font-semibold'>
						<Text tid='internal-transfer' />
					</h2>
				</Heading>
				{width > 1024 ? (
					<ModalLayout
						open={modal.show && modal.type !== 'invoice'}
						onClose={() => {}}
						width={'480px'}
					>
						<div className='relative'>
							<InternalTransferResult
								// closeResault={setModal.bind(null, { type: '', show: false, data: null })}
								result={modal?.data}
							/>
						</div>
					</ModalLayout>
				) : (
					<MobileModal isOpen={modal.show && modal.type !== 'invoice'} onClose={() => {}}>
						<div className='relative'>
							<InternalTransferResult
								// closeResault={setModal.bind(null, { type: '', show: false, data: null })}
								result={modal?.data}
							/>
						</div>
					</MobileModal>
				)}
				{modal.show && modal.type === 'invoice' ? (
					<InternalTransferInvoice
						closeInvoice={setModal.bind(null, { type: '', show: false, data: null })}
						invoice={modal?.data}
						makeTransfer={makeTransfer}
						isTransfering={isTransfering}
					/>
				) : (
					<div className='py-4 pt-0 lg:pt-4 flex flex-col lg:flex-row items-start gap-x-8 lg:overflow-y-auto lg:h-[90%]'>
						<div className='w-full lg:w-1/2 space-y-6'>
							<div className='flex flex-col gap-y-2 relative'>
								<Text tid='select-coin' className='font-medium text-sm' />
								<div
									className={`border h-[44px] rounded-lg cursor-pointer ${
										validation.errorField && validation.errorField === 'coin'
											? 'border-red-400'
											: 'border-gray-400 dark:border-card-border'
									}`}
									onClick={() => setShowCoinsList((prevState) => !prevState)}
								>
									<div className='flex items-center gap-x-5 h-full px-5 py-2'>
										{selectedCoin ? (
											<>
												<img
													src={
														selectedCoin.currency === 'irt'
															? require('../../assets/images/tooman.png')
															: SOCKET_URL + `assets/icon/${selectedCoin.currency}.png`
													}
													width={28}
													height={28}
													alt={selectedCoin.currency}
												/>
												<p>{selectedCoin.currency.toUpperCase()}</p>

												<FaChevronDown
													className={`mr-auto transform transition-transform ${
														showCoinsList ? 'rotate-180' : ''
													}`}
													size={10}
												/>
											</>
										) : (
											<Text tid='select-an-option' className='text-xs font-extralight' />
										)}
									</div>
								</div>
								{validation.errorField && validation.errorField === 'coin' ? (
									<p className='text-xs text-red-400'>
										<Text tid={validation.errorText} />
									</p>
								) : null}

								{showCoinsList ? (
									<div
										className='absolute w-full top-full border bg-body dark:bg-body-dark border-borderPrimary dark:border-card-border shadow-md rounded-lg'
										ref={coinsListRef}
									>
										{!isLoading ? (
											availableCoinsList?.length > 0 ? (
												availableCoinsList.map((item) => {
													const isTooman = item.currency === 'irt'

													return (
														<div
															key={item.currency}
															className='flex items-center gap-x-4 px-5 py-2 hover:bg-white-hover dark:hover:bg-dark-hover rounded-lg cursor-pointer'
															onClick={() => {
																setShowCoinsList(false)
																setSelectedCoin(item)
															}}
														>
															<img
																src={
																	isTooman
																		? require('../../assets/images/tooman.png')
																		: SOCKET_URL + `assets/icon/${item.currency}.png`
																}
																width={isTooman ? 31 : 30}
																height={isTooman ? 31 : 30}
																alt={item.currency}
															/>
															<p>{item.currency.toUpperCase()}</p>
														</div>
													)
												})
											) : (
												<div className={'flex items-center justify-center py-4'}>
													<img alt=' ' src={require('../../assets/images/noData.png')} width={54} />
												</div>
											)
										) : (
											<div className='flex items-center justify-center my-4'>
												<ScaleLoader color='#0773F1' height='18px' width='2px' />
											</div>
										)}
									</div>
								) : null}
							</div>

							<div className='flex flex-col gap-y-2'>
								<label htmlFor='deposit-amount'>
									<Text tid='deposit-amount' className='font-medium text-sm' />
								</label>

								<div
									className={`border rounded-lg overflow-hidden ${
										validation.errorField && validation.errorField === 'amount'
											? 'border-red-400'
											: 'border-gray-200 dark:border-card-border'
									} flex h-[44px]`}
								>
									<input
										type='text'
										id='deposit-amount'
										className={`h-full block w-4/5 px-4 bg-transparent placeholder:text-xs placeholder:font-extralight`}
										placeholder='مقدار را وارد کنید.'
										value={amount}
										autoComplete='off'
										onChange={onInputChange}
									/>
									<div className='w-1/5 bg-gray-light dark:bg-card-border flex items-center justify-center cursor-default text-sm font-semibold'>
										<Text tid={selectedCoin?.currency.toUpperCase() || '--'} />
									</div>
								</div>
								{validation.errorField && validation.errorField === 'amount' ? (
									<p className='text-xs text-red-400'>
										<Text tid={validation.errorText} />
									</p>
								) : null}
								{!!selectedCoin ? (
									<div className={'flex items-center gap-1 text-xs mt-1'}>
										<Text tid={'balance-can-transfer'} />
										{isTooman ? (
											<span>
												{formatNumber(profile?.balance || 0, {
													type: 'irt',
												})}
											</span>
										) : (
											<>
												<span>{formatNumber(balance || 0, { type: selectedCoin.currency })}</span>
												<span>{selectedCoin.currency?.toUpperCase()}</span>
											</>
										)}
									</div>
								) : null}

								<div className='space-y-2 mt-3'>
									<div className={'flex items-center gap-x-2 text-xs'}>
										<TbInfoCircle className='text-cBlue' size={16} />
										<Text tid='min' />:{' '}
										<span dir={isTooman ? 'rtl' : 'ltr'}>
											{formatNumber(selectedCoin?.minAmount)}{' '}
											{!!isTooman ? <Text tid='toman' /> : selectedCoin?.currency?.toUpperCase()}
										</span>
									</div>
									<div className={'flex items-center gap-x-2 text-xs'}>
										<TbInfoCircle className='text-cBlue' size={16} />
										<Text tid='max' />:{' '}
										<span dir={isTooman ? 'rtl' : 'ltr'}>
											{formatNumber(selectedCoin?.maxAmount)}{' '}
											{!!isTooman ? <Text tid='toman' /> : selectedCoin?.currency?.toUpperCase()}
										</span>
									</div>
								</div>
							</div>

							<div className='flex flex-col gap-y-2'>
								<label htmlFor='receiverId'>
									<Text tid='receiver-id' className='font-medium text-sm' />
								</label>

								<div className='flex items-center gap-x-2 h-[44px]'>
									<input
										type='text'
										value={receiverId}
										onChange={(e) => setReceiverId(e.target.value?.trim())}
										id='receiverId'
										placeholder='Email یا شناسه کاربری'
										autoComplete='off'
										className={`w-2/3 px-4 text-sm rounded-lg bg-transparent outline-none border  h-full placeholder:text-xs placeholder:font-extralight ${
											validation.errorField && validation.errorField === 'receiverId'
												? 'border-red-400'
												: 'border-borderPrimary dark:border-card-border'
										}`}
									/>
									<button
										className='w-1/3 text-xs bg-gray-light dark:bg-cBlue dark:text-white text-cBlue flex items-center gap-x-1 px-2 py-1 h-full rounded-lg'
										onClick={() => setShowContacts(true)}
									>
										<UserIcon color={theme === 'dark' ? '#fff' : '#0773F1'} size='22' />
										<Text tid='my-contacts' />
									</button>
								</div>

								{validation.errorField && validation.errorField === 'receiverId' ? (
									<p className='text-xs text-red-400'>
										<Text tid={validation.errorText} />
									</p>
								) : null}
							</div>

							<div className='flex flex-col gap-y-2'>
								<label htmlFor='note'>
									<Text tid='transaction-note' className='font-medium text-sm' />
								</label>

								<textarea
									value={note}
									onChange={(e) => setNote(e.target.value)}
									placeholder='درصورت نیاز بنویسید ...'
									id='note'
									className={`text-sm bg-transparent rounded-lg border p-2 placeholder:text-xs placeholder:font-extralight ${
										validation.errorField && validation.errorField === 'note'
											? 'border-red-400'
											: 'border-borderPrimary dark:border-card-border'
									}`}
								></textarea>
								{validation.errorField && validation.errorField === 'note' ? (
									<p className='text-xs text-red-400'>
										<Text tid={validation.errorText} />
									</p>
								) : null}
							</div>

							<button
								className='rounded-lg h-[44px] w-full bg-cBlue text-white flex items-center justify-center gap-x-4'
								onClick={handleSubmit}
							>
								{isCreatingInvoice ? (
									<>
										<Text tid='calculating' />
										<ClipLoader size={15} color={'#fff'} />
									</>
								) : (
									<Text tid='next-step' />
								)}
							</button>
						</div>

						<div className='w-full lg:w-1/2 space-y-2  -order-1 lg:order-1 mb-5 lg:my-0'>
							<HintBox type='warn' heading='warn' body='vpn-warn' />
							<HintBox type='hint' heading='hint' body='change-wallet-address-hint' />
						</div>
					</div>
				)}
			</Card>

			<Card className='col-span-2 h-full'>
				<Heading className='py-2'>
					<h2 className={`text-heading dark:text-pColor font-bold`}>
						<Text tid='recent-transfers' />
					</h2>

					<Link to='/transfers-history' className={`text-sm text-cBlue`}>
						<Text tid='all-transactions' />
					</Link>
				</Heading>
				<TransfersOverview />
			</Card>

			{width > 1024 ? (
				<ModalLayout open={showContacts} onClose={() => setShowContacts(false)} width={'480px'}>
					<div className='relative'>
						<ContactsList
							setReceiverId={(user) => {
								setShowContacts(false)
								setReceiverId(user.id || user.email)
							}}
						/>
					</div>
				</ModalLayout>
			) : (
				<MobileModal isOpen={showContacts} onClose={() => setShowContacts(false)}>
					<div className='relative'>
						<ContactsList
							setReceiverId={(user) => {
								setShowContacts(false)
								// اگر user.id وجود داشت از اون استفاده می‌کنیم، وگرنه ایمیل
								setReceiverId(user.id || user.email)
							}}
						/>
					</div>
				</MobileModal>
			)}
		</>
	)
}
