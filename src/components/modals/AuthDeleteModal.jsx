import { useState } from 'react'
import { FlexCenter } from '../../styles/CommonStyles'
import { CText } from '../../styles/SecurityStyles'
import Text from '../../core/utils/Text'
import { ButtonContainer, Input, Label, NextStep, Row } from '../../styles/AuthenticationStyles'

const AuthDeleteModal = ({ onSubmitClicked }) => {
	const [code, setCode] = useState({ code: '', state: 'normal' })

	const onInputValueChange = (e) => {
		const val = e?.target?.value
		if (val.length === 0) setCode((state) => ({ ...state, state: 'normal' }))
		if (val.length > 0) setCode((state) => ({ ...state, state: 'error' }))
		if (val.length === 6) setCode((state) => ({ ...state, state: 'valid' }))
		setCode((state) => ({ ...state, code: val }))
	}

	return (
		<FlexCenter style={{ flexDirection: 'column' }}>
			<CText fontSize='1.3rem'>
				<Text tid='delete-auth' />
			</CText>
			<CText fontSize='0.9rem'>
				<Text tid='delete-auth-desc' />
			</CText>
			<Row margin='40px 0 20px 0' style={{ width: '350px' }}>
				<Label>
					<Text tid='google-verify' />
				</Label>
				<Input value={code.code} onChange={onInputValueChange} maxLength={6} status={code.state} />
			</Row>
			<ButtonContainer>
				<NextStep active={code.state === 'valid'} onClick={() => onSubmitClicked(code)}>
					<Text tid='submit' />
				</NextStep>
			</ButtonContainer>
		</FlexCenter>
	)
}

export default AuthDeleteModal
