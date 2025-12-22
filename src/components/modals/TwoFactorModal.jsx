import ModalLayout from '../layouts/ModalLayout'
import Text from '../../core/utils/Text'
import { useAuthContext } from '../../core/contexts/auth'
import PinInput from '../../packages/pin-input'
import { useEffect, useState } from 'react'
import { useRequestFinanceOtp } from '../../core/services/react-query/useProfileQuery'

const TwoFactorModal = ({ open, onSubmit, onClose, cause }) => {
	const { profileSettings } = useAuthContext()
	const [authData, setAuthData] = useState({ ga: '', otp: '' })

	const [timer, setTimer] = useState(0)
	useEffect(() => {
		let interval
		if (timer > 0) {
			interval = setInterval(() => {
				if (timer > 0) {
					setTimer((state) => state - 1)
				} else {
					clearInterval(interval)
				}
			}, 1000)
		}
		return () => clearInterval(interval)
	}, [timer])
	const onSuccess = () => {
		setTimer(60)
	}
	const { mutate, isSuccess } = useRequestFinanceOtp(onSuccess)

	// useEffect(() => {
	// 	if (timer === 0) mutate({ caus: cause })
	// }, [])

	const onRequestOtp = () => {
		if (timer === 0) mutate({ caus: cause })
	}

	const onSubmitFactors = () => {
		onSubmit(authData)
		onClose()
	}

	return (
		<ModalLayout open={open} onClose={onClose} width={'520px'}>
			<div className={'flex flex-col items-center'}>
				<Text tid={'towfactor-settings'} />
				<div className={'w-full h-[1px] bg-gray-500 dark:bg-slate-800 mt-2'} />
				<div className={'flex flex-col gap-2 w-full mt-4'}>
					<div className={'text-sm flex justify-between items-center md:flex-row flex-col mb-3'}>
						<div className='flex flex-col gap-1'>
							<Text tid={'enter-otp'} className={'md:text-sm text-xs'} />
							<Text tid={'enter-otp-2'} className={'md:text-sm text-xs'} />
						</div>
						<div
							className={'text-lg rounded-lg px-3 py-1 bg-[#4f31c5] text-white cursor-pointer'}
							onClick={onRequestOtp}
						>
							<Text tid={isSuccess ? (timer > 0 ? timer : 'resend-code') : 'request-otp'} />
						</div>
					</div>
					{profileSettings?.settings?.twoFactor?.otp && (
						<PinInput onChange={(v) => setAuthData((state) => ({ ...state, otp: v }))} />
					)}
				</div>

				{profileSettings?.settings?.twoFactor?.ga && (
					<div className={'flex flex-col gap-2 w-full'}>
						<div className={'w-full h-[1px] bg-gray-500 dark:bg-slate-800 mt-4'} />
						<Text tid={'enter-ga'} className={'md:text-sm text-xs'} />
						<PinInput onChange={(v) => setAuthData((state) => ({ ...state, ga: v }))} />
					</div>
				)}
				<div className={'flex items-center justify-center w-full gap-2 mt-5'}>
					<div
						className={
							'rounded-md border-[1px] dark:border-slate-500 bg-[#4f31c5] min-w-[92px] min-h-[32px] text-sm flex justify-center items-center cursor-pointer text-black'
						}
						onClick={onSubmitFactors}
					>
						<Text tid={'submit'} />
					</div>
					<div
						className={
							'rounded-md border-[1px] dark:border-slate-500 min-w-[92px] min-h-[32px] text-sm flex justify-center items-center cursor-pointer'
						}
						onClick={onClose}
					>
						<Text tid={'cancel'} />
					</div>
				</div>
			</div>
		</ModalLayout>
	)
}

export default TwoFactorModal
