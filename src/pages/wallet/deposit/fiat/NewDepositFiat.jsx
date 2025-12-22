import Text from '../../../../core/utils/Text'
import { formatNumber, stringToNumber } from '../../../../core/utils/common'
import { HAS_DEPOSIT_WITH_ID } from '../../../../core/constants/urls'
import { IoInformationCircleOutline } from 'react-icons/io5'
import ChooseAccount from '../../utils/ChooseAccount'
import { useGetFiatSetting } from '../../../../core/services/react-query/useSetting'
import { useEffect, useMemo, useState } from 'react'
import { useDepositFiat } from '../../utils/hooks'
import { useRunAfterUpdate } from '../../../../core/hooks/useRunAfterUpdate'
import { onInputValueChangeUtil } from '../../../../core/utils/useInputValueChange'
import { PortLogo } from '../../../../styles/CoinOperationStyles'
import { useMainContext } from '../../../../core/contexts/main'
import HintBox from '../../../../components/common/HintBox'
import TwoFactorModal from '../../../../components/modals/TwoFactorModal'
import ModalLayout from '../../../../components/layouts/ModalLayout'
import DepositIdModal from './DepositIdModal'
import { ClipLoader } from 'react-spinners'

export default function NewDepositFiat({ depositType }) {
	const {
		main: { lang },
	} = useMainContext()

	const { data: fiatSetting, isLoading } = useGetFiatSetting()

	const {
		amount,
		setAmount,
		bankAccount,
		setBankAccount,
		depositIdModal,
		onFinish,
		authModal,
		setAuthModal,
		onSubmitTwoFactorModal,
		port,
		setPort,
		ports,
		depositLoading,
		newActionHandler,
	} = useDepositFiat()

	const validFirstStepAction = useMemo(() => {
		return (
			!!amount && stringToNumber(amount) >= fiatSetting?.deposit?.min
			// && stringToNumber(amount) < fiatSetting?.deposit?.max
		)
	}, [amount, fiatSetting])

	const [showError, setShowError] = useState(false)
	const [showHintModal, setShowHintModal] = useState(false)
	const [showDisabledGateway, setShowDisabledGateway] = useState(true)

	useEffect(() => {
		!validFirstStepAction ? setShowError(true) : setShowError(false)
	}, [validFirstStepAction])

	const runAfterUpdate = useRunAfterUpdate()
	const onInputChange = (e) => {
		let v = e?.target?.value
		v = onInputValueChangeUtil(e, runAfterUpdate)
		setAmount(v)
	}

	const types = useMemo(() => {
		let max = 0
		let f = 0
		if (!!fiatSetting && !!amount) {
			const df = fiatSetting.deposit
			max = df.max
			f = Math.min(df.feeMax, (df.feeFactor * stringToNumber(amount)) / 100)
		}
		return [
			{
				tid: 'bank-gateway',
				fee: f,
				max: max,
				active: 1,
				enabled: stringToNumber(amount) <= max,
			},
			{
				tid: 'deposit-id',
				fee: 500,
				max: null,
				active: HAS_DEPOSIT_WITH_ID,
				enabled: true,
			},
		]
	}, [fiatSetting, amount])

	const buttonDisabled = showError || !bankAccount


	useEffect(() => {
		if (!buttonDisabled) {
			setShowHintModal(true)
		} else {
			// setShowHintModal(false)
		}
	}, [buttonDisabled])

	return (
		<div className='flex items-start flex-col lg:flex-row gap-x-4 mt-5'>
			<div className='w-full lg:w-1/2 flex flex-col gap-y-8'>
				<div>
					<p>
						<Text tid='card-number' />
					</p>
					<ChooseAccount
						label={'choose-bank-account'}
						type={'bank'}
						onOptionChange={setBankAccount}
						value={bankAccount}
					/>
					{ports.length ? (
						<div className={'w-full flex items-center justify-center gap-4 flex-wrap'}>
							{ports.map((p) => {
								const active = p.id === port
								if (!p.isActive) {
									return null
								}
								return (
									<PortLogo active={active} onClick={() => setPort(p.id)}>
										{bankLogos[p.id] && <img src={bankLogos[p.id]} alt=' ' width='75%' />}
									</PortLogo>
								)
							})}
						</div>
					) : null}
				</div>

				<div>
					<label htmlFor='deposit-amount'>
						<Text tid='deposit-amount' />
					</label>
					<div className='border rounded-lg overflow-hidden border-gray-200 dark:border-card-border flex h-10'>
						<input
							type='text'
							id='deposit-amount'
							className='h-full block w-4/5 px-4 bg-transparent'
							placeholder={lang === 'fa' ? 'مقدار را وارد کنید.' : 'Please Enter Amount'}
							value={amount}
							onChange={onInputChange}
						/>
						<div className='w-1/5 bg-gray-light dark:bg-[#172B46] flex items-center justify-center cursor-default'>
							<Text tid='tooman' />
						</div>
					</div>
					{showError && (
						<p>
							<Text tid={'amount-error'} className={'text-red-500 text-xs'} />
						</p>
					)}
					<div className={'flex items-center gap-1 text-secondary text-xs mt-2'}>
						<IoInformationCircleOutline size={16} />
						<span>
							<Text tid={'minimum-deposit'} />
							<span> :</span>
						</span>
						<span className={'mt-[2px]'}>{`${formatNumber(fiatSetting?.withdraw?.min, {
							type: 'irt',
						})} تومان`}</span>
					</div>
				</div>

				{types.map((t) => {
					if (t.tid !== 'bank-gateway') return null
					const shouldShowDepositError = !HAS_DEPOSIT_WITH_ID && !t.enabled

					return (
						<div className={'flex flex-col gap-2 text-sm'}>
							<span className={'text-secondary text-xs mt-2'}>
								<Text tid={'max-daily'} />
								{!!t.max ? (
									<span>
										<span>
											{formatNumber(t.max, {
												type: 'irt',
											})}
										</span>
										<span>{' تومان'}</span>
									</span>
								) : (
									<Text tid={'infinite'} />
								)}
							</span>
							<span className={'text-secondary text-xs'}>
								<Text tid={'bank-fee'} />
								<span>
									{formatNumber(t.fee, {
										type: 'irt',
									})}
								</span>
								<span>{' تومان'}</span>
							</span>
							{shouldShowDepositError ? (
								<Text tid={'amount-is-bigger-than-max'} className={'text-red-500 text-xs'} />
							) : null}
						</div>
					)
				})}

				<button
					className={`w-full flex items-center justify-center gap-x-4 py-2 text-white rounded-lg ${buttonDisabled ? 'cursor-not-allowed bg-gray-400' : 'bg-cBlue'
						}`}
					disabled={buttonDisabled}
					onClick={() => {
						newActionHandler(depositType)
					}}
				>
					<Text tid='bank-gateway-pay' />
					{depositLoading && <ClipLoader color={'#fff'} size={26} />}
				</button>
			</div>

			<div className='w-full lg:w-1/2 -order-1 lg:order-1 my-4 lg:my-0'>
				<HintBox type='warn' heading='warn' body='vpn-warn' />
			</div>

			<TwoFactorModal
				open={authModal}
				onSubmit={onSubmitTwoFactorModal}
				onClose={() => setAuthModal(false)}
				cause={'deposit'}
			/>

			<ModalLayout width={'500px'} open={depositIdModal} isStatic>
				<DepositIdModal onFinish={onFinish} />
			</ModalLayout>
			<ModalLayout width={'500px'} open={showDisabledGateway} onClose={() => setShowDisabledGateway(false)}>
				<div className='flex flex-col bg-transparent p-2 gap-3'>
					<Text className='font-bold' tid={'gateway-disabled'} />
					<button
						className={`w-full flex items-center justify-center gap-x-4 py-2 text-white rounded-lg bg-cBlue
							}`}
						onClick={() => {
							setShowDisabledGateway(false)
						}}
					>
						<Text tid='submit' />
					</button>
				</div>
			</ModalLayout>
			<ModalLayout width={'500px'} open={showHintModal} onClose={() => setShowHintModal(false)}>
				<div className='flex flex-col bg-transparent p-2 gap-3'>
					<Text className='font-bold' tid={'fiat-deposit-hint-title'} />
					<p className='inline'>
						<Text className='inline-block' tid={'fiat-deposit-hint-1'} />
						<Text className='inline-block font-bold' tid={'fiat-deposit-hint-2'} />
						<Text className='inline-block' tid={'fiat-deposit-hint-3'} />
						<Text className='inline-block' tid={'fiat-deposit-hint-4'} />
					</p>
					<button
						className={`w-full flex items-center justify-center gap-x-4 py-2 text-white rounded-lg bg-cBlue
							}`}
						onClick={() => {
							setShowHintModal(false)
						}}
					>
						<Text tid='submit' />
					</button>
				</div>
			</ModalLayout>
		</div>
	)
}

const bankLogos = {
	zibal: require('../../../../assets/images/zibal-logo.png'),
	nextPay: require('../../../../assets/images/nextpay-logo.png'),
	vandar: require('../../../../assets/images/vandar-logo.png'),
}
