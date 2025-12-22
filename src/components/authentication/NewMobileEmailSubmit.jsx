import { useRef, useState } from 'react'
import { useAuth } from '../../pages/UserAuthentication'
import {
	ButtonContainer,
	Error,
	Label,
	Input,
	Row,
	NextStep,
	AuthMobileWrapper,
} from '../../styles/AuthenticationStyles'
import Text from '../../core/utils/Text'
import { Flex, LoaderContainer } from '../../styles/CommonStyles'
import { ClockLoader, PulseLoader } from 'react-spinners'
import {
	useProfileOtpMutation,
	useProfileVerfiyOtpMutation,
} from '../../core/services/react-query/useProfileQuery'
import { useWindowSize } from '../../core/hooks/useWindowSize'
import { p2e } from '../../core/utils/common'
import { Item, ResendCotainer } from '../../styles/RegisterStyles'
import OTPInput from '../common/OtpInput'

const MobileEmailSubmit = ({ onInputValueChange, setActiveWizard }) => {
	const otpRef = useRef()

	const { width } = useWindowSize()

	const { authData } = useAuth()
	const [stepState, setStepState] = useState({ code: '', step: 1, validation: 'normal' })

	const onOtpSuccess = () => {
		setStepState((state) => ({ ...state, step: 2 }))
	}

	const onVerifySuccess = () => {
		setActiveWizard((state) => state + 1)
	}

	const { isLoading: otpLoading, mutate: optRequest } = useProfileOtpMutation(onOtpSuccess)
	const { isLoading: verfiyLoading, mutate: verifyOtp } =
		useProfileVerfiyOtpMutation(onVerifySuccess)

	const handleNextStep = () => {
		verifyOtp({
			[authData.step1.mode]: authData.step1[authData.step1.mode],
			code: stepState.code,
		})
	}

	const handleRequestOtp = () => {
		optRequest({ [authData.step1.mode]: authData.step1[authData.step1.mode] })
		makeInterval()
	}

	// const onCodeInputChange = (e) => {
	// 	let value = p2e(e?.target?.value)
	// 	value = value.replace(/[^\d.,]/g, '')
	// 	if (value.length < 6) setStepState((state) => ({ ...state, validation: 'error' }))
	// 	if (value.length === 6) setStepState((state) => ({ ...state, validation: 'valid' }))
	// 	if (value.length === 0) setStepState((state) => ({ ...state, validation: 'normal' }))
	// 	setStepState((state) => ({ ...state, code: value }))
	// }

	const onVerifyCodeChange = (value) => {
		if (value.length > 6) return
		if (value.length === 0) setStepState((state) => ({ ...state, validation: 'normal' }))
		else if (value.length === 6) setStepState((state) => ({ ...state, validation: 'valid' }))
		else if (value.length < 6) setStepState((state) => ({ ...state, validation: 'error' }))
		setStepState((state) => ({ ...state, code: value }))
	}

	const [timer, setTimer] = useState(60)
	const makeInterval = () => {
		let interval
		interval = setInterval(() => {
			setTimer((time) => {
				if (time === 1) {
					clearInterval(interval)
				}
				return time - 1
			})
		}, 1000)
	}
	const onResend = () => {
		if (timer > 0) return
		optRequest({ [authData.step1.mode]: authData.step1[authData.step1.mode] })
		setTimer(60)
		makeInterval()
	}

	return (
		<>
			<div className='my-5'>
				<h2 className='mb-2'>
					<Text tid='step1' className='opacity-90' />
					{' : '}
					<Text tid='step1-heading' className='font-semibold' />
				</h2>
				<p className='text-sm text-pcolor-light dark:text-white/50'>
					<Text tid='step1-body' />
				</p>
			</div>
			<Row>
				<Label className='text-heading dark:text-pColor'>
					{authData.step1.mode === 'email' && <Text tid='email' />}
					{authData.step1.mode === 'mobile' && <Text tid='mobile' />}
				</Label>
				<div className='flex flex-col lg:flex-row items-center gap-x-2 w-full'>
					<Input
						status={authData.step1.validation}
						value={authData.step1[authData.step1.mode]}
						onChange={onInputValueChange}
						className='!bg-transparent w-full lg:w-2/3'
					/>
					{width < 1024 && authData.step1.validation === 'error' && (
						<Error>
							<Text tid='invalid-format' />
						</Error>
					)}
					<button
						className={`w-full lg:w-1/3 rounded-lg h-[44px] transition-colors bg-gray-light dark:bg-white/5 dark:hover:bg-white/10 text-cBlue flex justify-center items-center mt-[15px] ${
							authData.step1.validation !== 'valid' ? 'cursor-not-allowed' : 'cursor-pointer'
						}`}
						type='button'
						disabled={authData.step1.validation !== 'valid'}
						onClick={handleRequestOtp}
					>
						{otpLoading ? (
							<LoaderContainer>
								<PulseLoader size={9} color='#0773F1' />
							</LoaderContainer>
						) : (
							<Text tid='request-otp-code' />
						)}
					</button>
				</div>
				{width >= 1024 && authData.step1.validation === 'error' && (
					<Error>
						<Text tid='invalid-format' />
					</Error>
				)}
			</Row>
			{stepState.step === 2 && (
				<div className='mt-10'>
					{/* <Input
						disabled={stepState.step === 1}
						status={stepState.validation}
						value={stepState.code}
						onChange={onCodeInputChange}
						maxLength={6}
					/> */}
					<div className='w-full lg:w-2/3 mx-auto flex flex-col lg:items-center justify-center'>
						<Label>
							<Text tid='otp-code' className='font-semibold' />
						</Label>
						<OTPInput
							ref={otpRef}
							onOtpChange={onVerifyCodeChange}
							value={stepState.code}
							inputClassName={
								'border-light-border dark:border-card-border bg-transparent dark:bg-transparent rounded-lg'
							}
							wrapperClassName={'justify-between lg:justify-center'}
						/>
						{stepState.validation === 'error' && (
							<Error className='mb-4 flex justify-start lg:justify-center '>
								<Text tid='invalid-format' />
							</Error>
						)}
						<ResendCotainer>
							<Item
								cursor={timer === 0 ? 'pointer' : 'not-allowed'}
								active={timer === 0}
								onClick={onResend}
							>
								<Text tid='get-new-code' />
							</Item>
							{timer > 0 && <Item fontSize='12px'>{` : ${timer}`}</Item>}
						</ResendCotainer>
					</div>
				</div>
			)}
			<ButtonContainer>
				<NextStep active={stepState.code.length === 6} onClick={handleNextStep}>
					{verfiyLoading ? (
						<LoaderContainer>
							<PulseLoader size={9} color='#0d1726' />
						</LoaderContainer>
					) : (
						<Text tid='next-step' />
					)}
				</NextStep>
			</ButtonContainer>
		</>
	)
}

export default MobileEmailSubmit
