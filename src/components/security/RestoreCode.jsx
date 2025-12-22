import { useEffect, useState } from 'react'
import { CFlexStart, FlexCenter, FlexStart } from '../../styles/CommonStyles'
import { CText, QrBox } from '../../styles/SecurityStyles'
import { FaFileInvoice, FaRegCopy, FaStop } from 'react-icons/fa'
import { ButtonContainer, NextStep } from '../../styles/AuthenticationStyles'
import Text from '../../core/utils/Text'
import { useQueryContext } from '../../core/contexts/query'

const RestoreCode = ({ onSubmitClicked, setLoading, active2fa }) => {
	const [nextStep, setNextStep] = useState(false)
	const { setToast } = useQueryContext()

	useEffect(() => {
		setTimeout(() => {
			setLoading(false)
		}, 300)
	}, [])

	const onCopyClicked = (navigator) => {
		navigator.clipboard.writeText(active2fa?.data?.data?.key)
		setNextStep(true)
		setToast({
			error: false,
			show: true,
			message: 'copy-success',
		})
	}

	return (
		<FlexCenter style={{ padding: '40px 30px', flexDirection: 'column' }}>
			<CText>
				<Text tid='restore-title' />
			</CText>
			<FaFileInvoice color='#4f31c5' size={128} style={{ margin: '30px 0' }} />
			{active2fa && (
				<QrBox>
					<FlexCenter>
						<CText
							// color='#eaecef'
							margin='5px 0 0 0'
							fontSize='1.1rem'
						>
							{active2fa?.data?.data?.key}
						</CText>
						<FaRegCopy
							onClick={() => onCopyClicked(navigator)}
							// color='#eaecef'
							style={{ margin: '0 10px', cursor: 'pointer' }}
							size={28}
						/>
					</FlexCenter>
				</QrBox>
			)}
			<CFlexStart>
				<FlexCenter style={{ margin: '25px 0' }}>
					<FaStop
						color='#4f31c5'
						size={22}
						style={{ transform: 'rotate(45deg)', margin: '0 10px' }}
					/>
					<CText fontSize='1rem' color='#4f31c5'>
						<Text tid='restore-note-1' />
					</CText>
				</FlexCenter>
				<FlexCenter>
					<FaStop
						color='#4f31c5'
						size={22}
						style={{ transform: 'rotate(45deg)', margin: '0 10px' }}
					/>
					<CText fontSize='1rem' color='#4f31c5'>
						<Text tid='restore-note-2' />
					</CText>
				</FlexCenter>
			</CFlexStart>
			<ButtonContainer>
				<NextStep active={nextStep} onClick={() => onSubmitClicked(nextStep ? 'valid' : 'error')}>
					<Text tid='next-step' />
				</NextStep>
			</ButtonContainer>
		</FlexCenter>
	)
}

export default RestoreCode
