import { useEffect, useReducer, useRef, useState } from 'react'
import { useMainContext } from '../core/contexts/main'
import Text from '../core/utils/Text'
import { WarnIcon } from '../components/common/icons'
import { BsDot } from 'react-icons/bs'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { HOME } from '../core/constants/urls'
import { p2e } from '../core/utils/common'
import { validEmailRegex } from '../core/constants/common'
import { ErrorWrapper, Input } from '../styles/newStyles/Register.styled'
import {
	useRequestOtp,
	useVerify2fa,
	useVerifyOtp,
} from '../core/services/react-query/useAuthQuery'
import { osVersion, osName, browserName, browserVersion } from 'react-device-detect'
import { useQueryContext } from '../core/contexts/query'
import { LoaderContainer } from '../styles/CommonStyles'
import { PulseLoader } from 'react-spinners'

import '../styles/newStyles/register.css'
import OTPInput from '../components/common/OtpInput'
import Toast from '../components/modals/Toast'
import { getMainTheme } from '../core/utils/theme'
import { ThemeProvider } from 'styled-components'
import { useWindowSize } from '../core/hooks/useWindowSize'

const initialState = {
	mobileOrEmail: '',
	affiliateCode: '',
	rulesAccepted: true,
}

export default function RegisterPage() {
	const {
		main: { theme, lang },
		profile: { token },
	} = useMainContext()

	const { width } = useWindowSize()

	const navigate = useNavigate()

	const [searchParams] = useSearchParams()
	const tab = searchParams.get('mode') || 'login'
	const redirect = searchParams.get('redirect')

	useEffect(() => {
		if (tab) setMode(tab)
	}, [tab])

	const reducer = (state, action) => {
		switch (action.type) {
			case 'main':
				return {
					...state,
					mobileOrEmail: action.payload,
				}
			case 'option':
				return {
					...state,
					affiliateCode: action.payload,
				}
			// case 'condition':
			//     return {
			//         ...state,
			//         rulesAccepted: !state.rulesAccepted,
			//     }
			default:
				return state
		}
	}

	const otpInputRef = useRef()
	const eventRef = useRef()

	const [mode, setMode] = useState(tab)
	const [showAffiliate, setShowAffiliate] = useState()
	const [inputValues, setInputValues] = useReducer(reducer, initialState)
	const [signMethod, setSignMethod] = useState(null)
	const [validationStatus, setValidationStatus] = useState('normal')
	const [firstStep, setFirstStep] = useState(true)
	const [verifyCode, setVerifyCode] = useState('')
	const [extra, setExtra] = useState({
		deviceName: '',
		deviceVersion: '',
		osDevice: '',
		appVersion: '',
	})
	const [authCode, setAuthCode] = useState('')
	const [timer, setTimer] = useState(60)
	const [captchaToken] = useState(null)

	useEffect(() => {
		if (token) {
			navigate('/')
		}
		setExtra((_) => ({
			deviceName: browserName,
			deviceVersion: browserVersion,
			osDevice: `${osName} ${osVersion}`,
			appVersion: 1,
		}))
	}, [navigate, token])

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

	const onOtpResend = () => {
		if (timer > 0) return
		otpRefetch()
		setTimer(60)
		makeInterval()
	}

	const toggleAffiliate = () => setShowAffiliate((prevState) => !prevState)

	const {
		data: verifyData,
		isLoading: verifyLoading,
		mutate: verifyRefetch,
	} = useVerifyOtp(redirect)

	const { mutate: _2faRefetch, isLoading: verify2faLoading } = useVerify2fa(redirect)

	const onRequestOtpError = () => {
		setInputValues(initialState)
	}
	const {
		data: otpData,
		isLoading: otpLoading,
		refetch: otpRefetch,
	} = useRequestOtp(
		{
			[signMethod]: inputValues.mobileOrEmail,
			captcha: captchaToken,
		},
		onRequestOtpError
	)

	useEffect(() => {
		if (otpData?.success === 'true') {
			setFirstStep(false)
			setTimer(60)
			makeInterval()
		}
		if (otpData?.success === 'false') {
			setFirstStep(true)
		}
	}, [otpData, otpLoading])

	const { setToast } = useQueryContext()

	// const LOADING = optLoading || verifyLoading || verify2faLoading
	const LOADING = verifyLoading || verify2faLoading

	const onInputValueChange = (e, type) => {
		const payload = p2e(e?.target?.value)
		switch (type) {
			case 'main':
				validateInput(payload)
				setInputValues({ type, payload })
				break
			case 'option':
				setInputValues({ type, payload })
				break
			default:
				break
		}
	}

	const validateInput = (_val) => {
		const val = p2e(_val)
		if (val && val.length > 0) {
			if (isNaN(val)) {
				// gmail
				const valid = validEmailRegex.test(val)
				setSignMethod('email')
				valid ? setValidationStatus('valid') : setValidationStatus('error')
			} else {
				// mobile
				setSignMethod('mobile')
				// eslint-disable-next-line
				if (!['۰', '0'].includes(val[0]) || val.length !== 11) {
					setValidationStatus('error')
				} else {
					setValidationStatus('valid')
				}
			}
		}
		if (val.length === 0) {
			setSignMethod(null)
			setValidationStatus('normal')
		}
	}

	const onSubmitClicked = () => {
		if (LOADING) return
		if (firstStep && validationStatus === 'valid') {
			// delete this later
			setFirstStep(false)
			setTimer(60)
			makeInterval()

			if (tab === 'signup') {
				if (inputValues.rulesAccepted) {
					setValidationStatus('normal')
					otpRefetch()
				} else {
					setToast({
						isError: true,
						show: true,
						message: 'register-rules-accept',
					})
				}
			} else {
				setValidationStatus('normal')
				otpRefetch()
			}
		}
		if (!firstStep && validationStatus === 'valid') {
			if (verifyData?.data?.data?.authenticator) {
				_2faRefetch({
					preToken: verifyData?.data?.data?.preToken,
					extra,
					code: authCode,
				},)
			} else {
				let payload = {
					[signMethod]: inputValues.mobileOrEmail,
					extra,
					code: verifyCode,
				}
				if (inputValues.affiliateCode) {
					payload = {
						...payload,
						affiliateCode: inputValues.affiliateCode,
					}
				}
				verifyRefetch(payload)
			}
		}
	}

	const onVerifyCodeChange = (val) => {
		if (val.length > 6) return
		if (val.length === 6) setValidationStatus('valid')
		if (validationStatus === 'valid' && val.length !== 6) setValidationStatus('normal')
		setVerifyCode(val)
	}

	const handler = (e) => {
		if (e?.keyCode === 13) {
			onSubmitClicked()
		}
	}

	useEffect(() => {
		eventRef.current = handler
	}, [handler])

	useEffect(() => {
		const isSupported = window && window.addEventListener

		if (!isSupported) return

		const eventListener = (event) => eventRef.current(event)

		window.addEventListener('keyup', eventListener)

		return () => window.removeEventListener('keyup', eventListener)
	}, [window])

	return (
		<ThemeProvider theme={getMainTheme(theme, lang)}>
			<div
				className={`w-screen h-screen p-10 lg:px-20 flex gap-x-10 justify-between text-sm lg:text-base ${width < 1024 ? 'bg-white dark:bg-inherit' : ''
					}`}
				dir={lang === 'fa' ? 'rtl' : 'ltr'}
			>
				<div className='w-full lg:w-1/3 self-center'>
					<img
						src={require(`../assets/newImages/logo-${theme}.png`)}
						alt='Widnex'
						className='w-40'
					/>
					<h1 className='text-xl font-bold my-6'>
						{firstStep ? <Text tid={mode} /> : <Text tid={'confirm-email-phone'} />}
					</h1>
					{firstStep ? (
						<>
							<p className='warn-wrapper mb-4'>
								<WarnIcon />
								<Text tid='domain-check' />
							</p>
							<p className='warn-wrapper'>
								<WarnIcon />
								{mode === 'signup' ? (
									<>
										<Text tid={'already-signed-up'} />
										<Link to='?mode=login'>
											<Text tid={'log-in'} className='text-[#0773F1]' />
										</Link>
									</>
								) : (
									<>
										<Text tid={'no-account'} />
										<Link to='?mode=signup'>
											<Text tid={'sign-up'} className='text-[#0773F1]' />
										</Link>
									</>
								)}
							</p>
						</>
					) : (
						<p className='warn-wrapper'>
							<WarnIcon />
							<Text tid={'code-sent_part-1'} />
							<span className='text-xs text-gray-500'>{inputValues.mobileOrEmail}</span>
							<Text tid={'code-sent_part-2'} />
						</p>
					)}
					{!firstStep ? (
						<button
							className='text-gray-500 hover:text-cBlue text-sm mt-4 lg:my-4'
							onClick={() => setFirstStep(true)}
						>
							<Text tid='edit-mobile/email' />
						</button>
					) : null}
					{firstStep ? (
						<>
							{' '}
							<div className='flex flex-col gap-2 mt-6 mb-5'>
								<label htmlFor='email-phone'>
									<Text tid={'enter-phone-email'} />
								</label>
								<Input
									type='text'
									placeholder='شماره موبایل یا ایمیل'
									className={`bg-input dark:bg-white/5 px-4 py-1 placeholder:text-sm rounded-md`}
									onChange={(e) => onInputValueChange(e, 'main')}
									value={inputValues.mobileOrEmail}
									autoFocus={firstStep}
									onKeyDown={(event) => {
										if (event.key === 'Enter') onSubmitClicked()
									}}
									status={validationStatus}
									id='email-phone'
								/>
								{validationStatus === 'error' && (
									<ErrorWrapper>
										<Text tid='format-wrong' className='text-sm' />
									</ErrorWrapper>
								)}
							</div>
							{mode === 'signup' && (
								<div>
									<p
										onClick={toggleAffiliate}
										style={{ cursor: 'pointer' }}
										className='flex items-center text-cBlue'
									>
										<BsDot size={30} />
										<Text tid={'have-affiliate-code'} />
									</p>
									<div
										className={`overflow-hidden transition-all duration-300 ease-in-out mt-1`}
										style={{
											height: showAffiliate ? '40px' : '0px',
										}}
									>
										<Input
											type='text'
											placeholder='کد دعوت'
											className='w-full bg-input dark:bg-white/5 px-4 py-1 placeholder:text-sm rounded-md'
											onChange={(e) => onInputValueChange(e, 'option')}
										/>
									</div>
								</div>
							)}
						</>
					) : (
						<>
							<OTPInput
								ref={otpInputRef}
								value={verifyCode}
								autoFocus={!firstStep}
								onOtpChange={onVerifyCodeChange}
							/>
							{timer > 0 ? (
								<p className='flex items-center text-gray-500 text-sm'>
									<Text tid='get-new-code' />
									{' : '}
									{timer}
								</p>
							) : (
								<p className='cursor-pointer hover:text-cBlue text-sm' onClick={onOtpResend}>
									<Text tid={'get-new-code'} />
								</p>
							)}
							{verifyData?.data?.data?.authenticator && (
								<div className='flex flex-col gap-2 mt-6 mb-5'>
									<label htmlFor='ga'>
										<Text tid='google-verify' />
									</label>
									<Input
										className='bg-input dark:bg-white/5 px-4 py-1 placeholder:text-sm rounded-md'
										id='ga'
										status={
											authCode.length === 0 ? 'normal' : authCode.length === 6 ? 'valid' : 'error'
										}
										maxLength={6}
										onChange={(e) => setAuthCode(e?.target?.value)}
										value={authCode}
										autoFocus
									/>
								</div>
							)}
						</>
					)}

					<button
						type='button'
						className={`rounded-md block w-full text-center bg-cBlue text-white py-2 mt-5 ${validationStatus === 'valid' && (inputValues.rulesAccepted || tab === 1)
							? 'cursor-pointer pointer-events-auto'
							: 'cursor-not-allowed pointer-events-none'
							}`}
						onClick={onSubmitClicked}
					>
						{LOADING ? (
							<LoaderContainer className='mt-0'>
								<PulseLoader size={6} color='#83a8de' />
							</LoaderContainer>
						) : (
							<Text tid={firstStep ? 'continue' : 'submit'} />
						)}
					</button>
					<p className='mt-2'>
						<Text tid='terms_part-1' />
						<a href={HOME + 'terms'}>
							<Text tid='terms' className='text-cBlue' />
						</a>
						<Text tid='terms_part-2' />
					</p>
				</div>
				<img
					src={require('../assets/newImages/register-bg.png')}
					alt='widnex - register'
					className='hidden lg:block h-full w-3/5'
				/>
			</div>
			<Toast />
		</ThemeProvider>
	)
}
