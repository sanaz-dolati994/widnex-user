import { useState } from 'react'
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

const MobileEmailSubmit = ({ onInputValueChange, setActiveWizard }) => {
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

	const onSubmitClicked = () => {
		if (stepState.step === 1) {
			optRequest({ [authData.step1.mode]: authData.step1[authData.step1.mode] })
			makeInterval()
		} else {
			verifyOtp({
				[authData.step1.mode]: authData.step1[authData.step1.mode],
				code: stepState.code,
			})
		}
	}

	const onCodeInputChange = (e) => {
		let value = p2e(e?.target?.value)
		value = value.replace(/[^\d.,]/g, '')
		if (value.length < 6) setStepState((state) => ({ ...state, validation: 'error' }))
		if (value.length === 6) setStepState((state) => ({ ...state, validation: 'valid' }))
		if (value.length === 0) setStepState((state) => ({ ...state, validation: 'normal' }))
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
		<AuthMobileWrapper>
			<>
				<Row>
					<Label color='#4f31c5'>
						{authData.step1.mode === 'email' && <Text tid='email' />}
						{authData.step1.mode === 'mobile' && <Text tid='mobile' />}
					</Label>
					<Input
						status={authData.step1.validation}
						value={authData.step1[authData.step1.mode]}
						onChange={onInputValueChange}
					/>
					{authData.step1.validation === 'error' && (
						<Error>
							<Text tid='invalid-format' />
						</Error>
					)}
				</Row>
				{stepState.step === 2 && (
					<Row margin='20px 0 0 0'>
						<Flex justify={'between'} style={{ width: '100%' }}>
							<Label color='#09af97'>
								<Text tid='enter-code' />
							</Label>
							<ResendCotainer>
								{timer > 0 && <Item fontSize='12px'>{timer}</Item>}
								<Item
									cursor={timer === 0 ? 'pointer' : 'not-allowed'}
									active={timer === 0}
									onClick={onResend}
								>
									<Text tid='resend' />
								</Item>
								{timer > 0 && <ClockLoader size={22} color='#09af97' />}
							</ResendCotainer>
						</Flex>
						<Input
							disabled={stepState.step === 1}
							status={stepState.validation}
							value={stepState.code}
							onChange={onCodeInputChange}
							maxLength={6}
						/>
						{stepState.validation === 'error' && (
							<Error>
								<Text tid='invalid-format' />
							</Error>
						)}
					</Row>
				)}
				<ButtonContainer>
					<NextStep
						active={authData.step1.validation === 'valid' || stepState.code.length === 5}
						onClick={onSubmitClicked}
					>
						{otpLoading || verfiyLoading ? (
							<LoaderContainer>
								<PulseLoader size={9} color='#0d1726' />
							</LoaderContainer>
						) : (
							<Text tid='next-step' />
						)}
					</NextStep>
				</ButtonContainer>
			</>
		</AuthMobileWrapper>
	)
}

export default MobileEmailSubmit
