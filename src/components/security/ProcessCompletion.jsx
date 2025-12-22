import { useEffect } from 'react'
import {
	ButtonContainer,
	CheckBg,
	CheckIcon,
	FinalIcon,
	NextStep,
} from '../../styles/AuthenticationStyles'
import { FlexCenter } from '../../styles/CommonStyles'
import { CText } from '../../styles/SecurityStyles'
import { FaRegAddressCard } from 'react-icons/fa'
import Text from '../../core/utils/Text'

const ProcessCompletion = ({ setLoading, setGoogleAuth }) => {
	useEffect(() => {
		setTimeout(() => {
			setLoading(false)
		}, 300)
	}, [])

	const onSubmitClicked = () => {
		setGoogleAuth(false)
	}

	return (
		<FlexCenter style={{ padding: '40px 30px', flexDirection: 'column' }}>
			<CText>
				<Text tid='process-completion-title' />
			</CText>
			<FinalIcon>
				<FaRegAddressCard size={92} color='#c3c5b7' />
				<CheckBg size={42} />
				<CheckIcon size={22} />
			</FinalIcon>
			<CText margin='30px 0 0 0'>
				<Text tid='process-completion-desc' />
			</CText>
			<ButtonContainer>
				<NextStep width='160px' active={true} onClick={onSubmitClicked}>
					<Text tid='security-page' />
				</NextStep>
			</ButtonContainer>
		</FlexCenter>
	)
}

export default ProcessCompletion
