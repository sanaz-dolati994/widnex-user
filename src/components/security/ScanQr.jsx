import { useEffect } from 'react'
import QRCode from 'react-qr-code'
import { FlexCenter } from '../../styles/CommonStyles'
import { CText, QrBox, QrWrapper } from '../../styles/SecurityStyles'
import { FaRegCopy, FaStop } from 'react-icons/fa'
import { ButtonContainer, NextStep } from '../../styles/AuthenticationStyles'
import Text from '../../core/utils/Text'
import { useActive2faMutation } from '../../core/services/react-query/useAuthQuery'
import { useQueryContext } from '../../core/contexts/query'

const ScanQr = ({ onSubmitClicked, setLoading, setActive2fa }) => {
	const { data: active2fa, mutate: activate2fa, isLoading } = useActive2faMutation()
	const { setToast } = useQueryContext()

	useEffect(() => {
		setActive2fa(active2fa)
	}, [setActive2fa, active2fa])

	useEffect(() => {
		activate2fa()
	}, [activate2fa])

	useEffect(() => {
		setLoading(isLoading)
	}, [isLoading, setLoading])

	const onCopyClicked = (navigator) => {
		navigator.clipboard.writeText(active2fa?.data?.data?.key)
		setToast({
			error: false,
			show: true,
			message: 'copy-success',
		})
	}

	return (
		<FlexCenter style={{ padding: '40px 30px', flexDirection: 'column' }}>
			{active2fa && (
				<>
					<CText>
						<Text tid='scan-qr-title' />
					</CText>
					<QrBox>
						<QrWrapper>
							<QRCode size={180} value={active2fa?.data?.data?.qr} />
						</QrWrapper>
						<CText fontSize='1.3rem'>SCAN</CText>
					</QrBox>
					<QrBox>
						<FlexCenter>
							<CText margin='5px 0 0 0' fontSize='1.1rem'>
								{active2fa?.data?.data?.key}
							</CText>
							<FaRegCopy
								onClick={() => onCopyClicked(navigator)}
								style={{ margin: '0 10px', cursor: 'pointer' }}
								size={28}
							/>
						</FlexCenter>
					</QrBox>
					<FlexCenter style={{ margin: '25px 0' }}>
						<FaStop
							color='#4f31c5'
							size={22}
							style={{ transform: 'rotate(45deg)', margin: '0 10px' }}
						/>
						<CText fontSize='1rem' color='#4f31c5'>
							<Text tid='scan-qr-desc' />
						</CText>
					</FlexCenter>
					<ButtonContainer>
						<NextStep active={true} onClick={() => onSubmitClicked('valid')}>
							<Text tid='next-step' />
						</NextStep>
					</ButtonContainer>
				</>
			)}
		</FlexCenter>
	)
}

export default ScanQr
