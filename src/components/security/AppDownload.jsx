import { FlexCenter } from '../../styles/CommonStyles'
import { CText, AppContainer, App } from '../../styles/SecurityStyles'
import { FaApple, FaGooglePlay, FaFileDownload } from 'react-icons/fa'
import { ButtonContainer, NextStep } from '../../styles/AuthenticationStyles'
import Text from '../../core/utils/Text'

const AppDownload = ({ onSubmitClicked }) => {
	return (
		<FlexCenter style={{ padding: '40px 30px', flexDirection: 'column' }}>
			<CText>
				<Text tid='download-app-title' />
			</CText>
			<AppContainer>
				<App target='blank' href='https://apps.apple.com/us/app/google-authenticator/id388497605'>
					<FaApple color='#c3c5b7' size={74} />
					<CText margin='10px 0 0 0'>App Store</CText>
				</App>
				<App
					target='blank'
					href='https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en_CA&gl=US'
				>
					<FaGooglePlay color='#c3c5b7' size={62} />
					<CText margin='16px 0 0 0'>Google Play</CText>
				</App>
			</AppContainer>
			<FlexCenter>
				<FaFileDownload color='#4f31c5' size={28} style={{ margin: '0 10px' }} />
				<CText color='#4f31c5'>
					<Text tid='how-to-download' />
				</CText>
			</FlexCenter>
			<ButtonContainer>
				<NextStep active={true} onClick={() => onSubmitClicked('valid')}>
					<Text tid='next-step' />
				</NextStep>
			</ButtonContainer>
		</FlexCenter>
	)
}

export default AppDownload
