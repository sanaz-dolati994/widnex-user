import {
    useState,
    useReducer,
    useEffect,
    useRef,
    useCallback,
    createRef,
} from 'react'
import Text from '../core/utils/Text'
import MainLayout from '../components/layouts/MainLayout'
import { GoCheck } from 'react-icons/go'
import { AnimatePresence } from 'framer-motion'
import {
    osVersion,
    osName,
    browserName,
    browserVersion,
} from 'react-device-detect'
import { PulseLoader, ClockLoader } from 'react-spinners'
import {
    RECAPTCHA_KEY,
    TABLET_SIZE,
    validEmailRegex,
} from '../core/constants/common'
import { useMainContext } from '../core/contexts/main'
import { useLocation, useNavigate } from 'react-router-dom'
import {
    useRequestOtp,
    useVerify2fa,
    useVerifyOtp,
} from '../core/services/react-query/useAuthQuery'
import {
    Wrapper,
    Body,
    Item,
    Input,
    ResendCotainer,
    SingUpRows,
    TabChanger,
    Error,
    SubmitBtn,
    Label,
    Title,
    Row,
    Rules,
    RulesContainer,
    CheckBox,
} from '../styles/RegisterStyles'
import { Flex, LoaderContainer } from '../styles/CommonStyles'
import { useWindowSize } from '../core/hooks/useWindowSize'
import { useQueryContext } from '../core/contexts/query'
import { p2e } from '../core/utils/common'
import ReCAPTCHA from 'react-google-recaptcha'
import { CiEdit } from 'react-icons/ci'

const initialState = {
    mobileOrEmail: '',
    affiliateCode: '',
    rulesAccepted: false,
}

const RegisterSignIn = () => {
    const {
        main: { lang, theme },
        profile: { token },
    } = useMainContext()

    const location = useLocation()
    const _tab = new URLSearchParams(location.search).get('tab')
    const _username = new URLSearchParams(location.search).get('username')
    const redirect = new URLSearchParams(location.search).get('redirect')

    const { setToast } = useQueryContext()
    const { width } = useWindowSize()

    const navigate = useNavigate()
    const eventRef = useRef()
    const captchaRef = useRef()

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
            case 'condition':
                return {
                    ...state,
                    rulesAccepted: !state.rulesAccepted,
                }
            default:
                return state
        }
    }

    const [timer, setTimer] = useState(60)
    const [signMethod, setSignMethod] = useState(null)
    const [extra, setExtra] = useState({
        deviceName: '',
        deviceVersion: '',
        osDevice: '',
        appVersion: '',
    })
    const [tab, setTab] = useState(1)
    const [inputValues, setInputValues] = useReducer(reducer, initialState)
    const [firstStep, setFirstStep] = useState(true)
    const [validationStatus, setValidationStatus] = useState('normal')
    const [verifyCode, setVerifyCode] = useState('')
    const [authCode, setAuthCode] = useState('')
    const [captchaToken, setCaptchaToken] = useState(null)
    const [captchaSuccess, setCaptchaSuccess] = useState(false)

    useEffect(() => {
        if (_tab) setTab(parseInt(_tab))
    }, [_tab])

    useEffect(() => {
        if (_username) {
            validateInput(_username)
            setInputValues({ type: 'main', payload: _username })
        }
    }, [_username])

    const onRequestOtpError = () => {
        setInputValues(initialState)
    }

    const {
        data: otpData,
        isLoading: optLoading,
        refetch: otpRefetch,
    } = useRequestOtp(
        {
            [signMethod]: inputValues.mobileOrEmail,
            captcha: captchaToken,
        },
        onRequestOtpError
    )

    const {
        data: verifyData,
        isLoading: verifyLoading,
        mutate: verifyRefetch,
    } = useVerifyOtp(redirect)

    const { refetch: _2faRefetch, isLoading: verify2faLoading } = useVerify2fa(
        {
            preToken: verifyData?.data?.data?.preToken,
            extra,
            code: authCode,
        },
        redirect
    )

    // const LOADING = optLoading || verifyLoading || verify2faLoading
    const LOADING = verifyLoading || verify2faLoading

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

    useEffect(() => {
        if (otpData?.success) {
            setFirstStep(false)
            setTimer(60)
            makeInterval()
        }
    }, [otpData])

    const onCheckBoxClicked = () => {
        setInputValues({ type: 'condition' })
    }

    const goToRules = () => {
        window.location.href = '/terms'
    }

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
                valid
                    ? setValidationStatus('valid')
                    : setValidationStatus('error')
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

    const changeTab = () => {
        setTab((state) => {
            return state === 1 ? 0 : 1
        })
    }

    const onSubmitClicked = () => {
        if (LOADING) return
        if (firstStep && validationStatus === 'valid') {
            // delete this later
            setFirstStep(false)
            setTimer(60)

            // if (!captchaSuccess) return;
            if (tab === 0) {
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
                _2faRefetch()
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

    const onVerifyCodeChange = (e) => {
        const val = p2e(e?.target?.value)
        if (val.length > 6) return
        if (val.length === 6) setValidationStatus('valid')
        if (validationStatus === 'valid' && val.length !== 6)
            setValidationStatus('normal')
        setVerifyCode(val)
    }

    const onCaptchaSuccess = (v) => {
        setCaptchaToken(v)
        setCaptchaSuccess(true)
    }

    const onOtpResend = () => {
        if (timer > 0) return
        otpRefetch()
        setTimer(60)
        makeInterval()
    }

    return (
        <MainLayout hasSidebar={false}>
            <Wrapper>
                <Body>
                    <Title>
                        <Text tid={tab === 0 ? 'signup' : 'signin'} />
                    </Title>

                    <Title className='text-sm opacity-50 font-light max-w-sm text-center'>
                        <Text tid={'register-desc'} />
                    </Title>

                    {firstStep ? (
                        <>
                            <Row>
                                <Label>
                                    <Text tid='enter-phone-email' />
                                </Label>
                                <Input
                                    status={validationStatus}
                                    onChange={(e) =>
                                        onInputValueChange(e, 'main')
                                    }
                                    value={inputValues.mobileOrEmail}
                                    autoFocus={firstStep}
                                />
                                {validationStatus === 'error' && (
                                    <Error>
                                        <Text tid='format-wrong' />
                                    </Error>
                                )}
                            </Row>
                            <AnimatePresence exitBeforeEnter>
                                {tab === 0 && (
                                    <SingUpRows
                                        variants={variants}
                                        initial='out'
                                        animate='in'
                                        exit='out'>
                                        <Row>
                                            <Label>
                                                <Text tid='enter-affiliate-code' />
                                            </Label>
                                            <Input
                                                onChange={(e) =>
                                                    onInputValueChange(
                                                        e,
                                                        'option'
                                                    )
                                                }
                                            />
                                        </Row>
                                        <RulesContainer>
                                            <CheckBox
                                                onClick={onCheckBoxClicked}>
                                                {inputValues.rulesAccepted && (
                                                    <GoCheck
                                                        size={
                                                            width < TABLET_SIZE
                                                                ? 18
                                                                : 24
                                                        }
                                                        color='#1ce087'
                                                    />
                                                )}
                                            </CheckBox>
                                            {lang === 'en' ? (
                                                <>
                                                    I accept{' '}
                                                    <Rules>
                                                        Rules and Regulations
                                                    </Rules>
                                                </>
                                            ) : (
                                                <span>
                                                    <Rules onClick={goToRules}>
                                                        قوانین{' '}
                                                    </Rules>
                                                    سایت شما رو می پذیرم.
                                                </span>
                                            )}
                                        </RulesContainer>
                                    </SingUpRows>
                                )}
                            </AnimatePresence>
                        </>
                    ) : (
                        <>
                            <Row marginTop='40px'>
                                <div
                                    dir={'ltr'}
                                    className={
                                        'w-full rounded-md bg-active bg-opacity-40 py-2 px-3 my-2 flex items-center justify-between gap-2'
                                    }>
                                    <span>{inputValues.mobileOrEmail}</span>
                                    <div
                                        className={
                                            'rounded-md p-1 hover:bg-gray-500 cursor-pointer'
                                        }
                                        onClick={() => setFirstStep(true)}>
                                        <CiEdit size={24} color={'#fff'} />
                                    </div>
                                </div>
                                <Flex wrap className={'gap-3 mb-3'}>
                                    <Label>
                                        <Text tid='enter-code' />
                                    </Label>
                                    <ResendCotainer>
                                        {timer > 0 && (
                                            <Item fontSize='14px'>{timer}</Item>
                                        )}
                                        <Item
                                            cursor={
                                                timer === 0
                                                    ? 'pointer'
                                                    : 'not-allowed'
                                            }
                                            active={timer === 0}
                                            onClick={onOtpResend}>
                                            <Text tid='resend' />
                                        </Item>
                                        {timer > 0 && (
                                            <ClockLoader
                                                size={22}
                                                color='#4f31c5'
                                            />
                                        )}
                                    </ResendCotainer>
                                </Flex>
                                <Input
                                    status={validationStatus}
                                    onChange={onVerifyCodeChange}
                                    value={verifyCode}
                                    autoFocus
                                />
                            </Row>
                            {verifyData?.data?.data?.authenticator && (
                                <Row marginTop='20px'>
                                    <Label>
                                        <Text tid='google-verify' />
                                    </Label>
                                    <Input
                                        status={
                                            authCode.length === 0
                                                ? 'normal'
                                                : authCode.length === 6
                                                ? 'valid'
                                                : 'error'
                                        }
                                        maxLength={6}
                                        onChange={(e) =>
                                            setAuthCode(e?.target?.value)
                                        }
                                        value={authCode}
                                        autoFocus
                                    />
                                </Row>
                            )}
                        </>
                    )}

                    {/*{firstStep &&*/}
                    {/*	<ReCAPTCHA*/}
                    {/*		key={theme}*/}
                    {/*		style={{ marginTop: '30px' }}*/}
                    {/*		sitekey={RECAPTCHA_KEY}*/}
                    {/*		onExpired={() => setCaptchaSuccess(false)}*/}
                    {/*		onErrored={() => setCaptchaSuccess(false)}*/}
                    {/*		onChange={onCaptchaSuccess}*/}
                    {/*		theme={theme}*/}
                    {/*		hl={lang}*/}
                    {/*		ref={captchaRef}*/}
                    {/*	/>*/}
                    {/*}*/}

                    <SubmitBtn
                        onClick={onSubmitClicked}
                        active={
                            validationStatus === 'valid' &&
                            (inputValues.rulesAccepted || tab === 1)
                            // && captchaSuccess
                        }>
                        {LOADING ? (
                            <LoaderContainer>
                                <PulseLoader size={9} color='#0d1726' />
                            </LoaderContainer>
                        ) : (
                            <Text tid={firstStep ? 'next-step' : 'submit'} />
                        )}
                    </SubmitBtn>

                    {firstStep && (
                        <TabChanger>
                            <Text
                                tid={
                                    tab === 0
                                        ? 'have-account'
                                        : 'not-have-account'
                                }
                            />
                            <Rules onClick={changeTab} fontSize='1.1rem'>
                                <Text tid={tab === 0 ? 'signin' : 'signup'} />
                            </Rules>
                        </TabChanger>
                    )}
                </Body>
            </Wrapper>
        </MainLayout>
    )
}

const variants = {
    in: {
        opacity: 1,
        transition: { duration: 0.3, delay: 0.6 },
    },
    out: {
        opacity: 0,
        transition: { duration: 0.3 },
    },
}

export default RegisterSignIn
