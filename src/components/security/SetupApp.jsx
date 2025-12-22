import { useEffect, useState } from 'react'
import { useVerify2faMutation } from '../../core/services/react-query/useAuthQuery'
import { ButtonContainer, Input, Label, NextStep, Row } from '../../styles/AuthenticationStyles'
import { FlexCenter } from '../../styles/CommonStyles'
import { CText } from '../../styles/SecurityStyles'
import Text from '../../core/utils/Text'
import { p2e } from '../../core/utils/common'

const SetupApp = ({ onSubmitClicked, setLoading }) => {
	const [code, setCode] = useState({ code: '', state: 'normal' })

	const onSuccess = () => {
		onSubmitClicked(code.state)
	}

	const { mutate: verify2fa } = useVerify2faMutation(onSuccess)

	useEffect(() => {
		setTimeout(() => {
			setLoading(false)
		}, 300)
	}, [])

	const onInputValueChange = (e) => {
		const val = p2e(e?.target?.value)
		if (val.length === 0) setCode((state) => ({ ...state, state: 'normal' }))
		if (val.length > 0) setCode((state) => ({ ...state, state: 'error' }))
		if (val.length === 6) setCode((state) => ({ ...state, state: 'valid' }))
		setCode((state) => ({ ...state, code: val }))
	}

	const onNextClicked = () => {
		verify2fa({ code: code.code })
	}

	return (
		<FlexCenter style={{ padding: '40px 30px', flexDirection: 'column' }}>
			<CText fontSize='1.4rem'>
				<Text tid='activate-app' />
			</CText>
			<Row
				margin='40px 0 20px 0'
				className={'max-w-[350px]'}
				// style={{ width: "350px" }}
			>
				<Label>
					<Text tid='google-verify' />
				</Label>
				<Input value={code.code} onChange={onInputValueChange} maxLength={6} status={code.state} />
			</Row>
			<ButtonContainer>
				<NextStep active={code.state === 'valid'} onClick={onNextClicked}>
					<Text tid='next-step' />
				</NextStep>
			</ButtonContainer>
		</FlexCenter>
	)
}

export default SetupApp
